/* =====================================================================
   CORE: utilities, server API, state, translation, sign-in, settings
   ===================================================================== */
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const store = {
  get(k, d){ try{ const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; }catch(e){ return d; } },
  set(k, v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){} },
  del(k){ try{ localStorage.removeItem(k); }catch(e){} }
};
function hash(str){ let h1 = 0xdeadbeef, h2 = 0x41c6ce57; for(let i=0;i<str.length;i++){ const c=str.charCodeAt(i); h1=Math.imul(h1^c,2654435761); h2=Math.imul(h2^c,1597334677);} h1=Math.imul(h1^(h1>>>16),2246822507)^Math.imul(h2^(h2>>>13),3266489909); h2=Math.imul(h2^(h2>>>16),2246822507)^Math.imul(h1^(h1>>>13),3266489909); return (4294967296*(2097151&h2)+(h1>>>0)).toString(36); }
function toast(msg){ const el=$("#toast"); el.textContent=msg; el.hidden=false; clearTimeout(toast._t); toast._t=setTimeout(()=>el.hidden=true,2600); }
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2,7);

/* =====================================================================
   STATE
   ===================================================================== */
const S = {
  user:null, lang:"en",
  recipe:null, step:0, playing:false, servings:0, swapped:{},
  auto:false, rate:1,
  f:{ region:"all", chips:new Set(), q:"" },   // gallery filters
  timers:[],                                     // several cooking timers at once
  favs:new Set(), shop:[],
  listening:false, recActive:false, speakingNow:false, handsfree:true, armedUntil:0,
  authMode:"login", view:"dash", lastUpdate:0, bump:null, clearArm:false, micDenied:false, spoken:"", voiceIntro:false
};
const prefs = () => (S.user && S.user.prefs) || {};
const userKey = () => (S.user && S.user.email) ? S.user.email : "guest";

/* =====================================================================
   SERVER API (the app keeps working offline with the bundled recipes)
   ===================================================================== */
function serverBase(){
  const saved = store.get("cv_server", "");
  if(saved) return saved.replace(/\/+$/,"");
  if(window.COOKMATE_SERVER) return String(window.COOKMATE_SERVER).replace(/\/+$/,"");
  if(!NATIVE.isNative && location.protocol.startsWith("http")) return "";   // same server that served the page
  return null;
}
const API = { base: serverBase(), online:false, ai:false, token: store.get("cv_token", null) };
async function api(path, {method="GET", body, timeout=10000}={}){
  if(API.base == null) throw new Error("offline");
  const headers = {"Content-Type":"application/json"};
  if(API.token) headers.Authorization = "Bearer " + API.token;
  const res = await fetch(API.base + "/api" + path, {method, headers, body: body ? JSON.stringify(body) : undefined, signal: AbortSignal.timeout(timeout)});
  const j = await res.json().catch(()=>({}));
  if(!res.ok){ const e = new Error(j.error || "http_"+res.status); e.status = res.status; throw e; }
  return j;
}
const signedIn = () => API.online && API.token && S.user && S.user.id;
function setToken(tok){ API.token = tok; if(tok) store.set("cv_token", tok); else store.del("cv_token"); }

function applyCatalog(c){
  if(!c || !Array.isArray(c.recipes) || !c.recipes.length) return false;
  RECIPES.splice(0, RECIPES.length, ...c.recipes);
  Object.keys(ING).forEach(k=>delete ING[k]); Object.assign(ING, c.ingredients);
  Object.assign(UNITS, c.units || {});
  if(Array.isArray(c.regions) && c.regions.length) REGIONS.splice(0, REGIONS.length, ...c.regions);
  if(c.defaultW) Object.assign(DEFAULT_W, c.defaultW);
  return true;
}
async function initBackend(){
  // newest catalogue seen before (survives offline restarts of the phone app)
  const cached = store.get("cv_catalog", null);
  if(cached && cached.version && cached.dataVersion === DATA_VERSION) applyCatalog(cached);
  API.base = serverBase();
  if(API.base == null) return;
  try{
    const h = await api("/health", {timeout:4000});
    API.online = true; API.ai = !!h.assistant;
    const c = await api("/catalog", {timeout:15000});
    if(applyCatalog(c) && (!cached || cached.version !== c.version)) store.set("cv_catalog", {...c, dataVersion: DATA_VERSION});
  }catch(e){ API.online = false; console.info("[CookMate] server not reachable, running offline"); }
}

const chatLog = [];
async function askAssistant(text){
  if(!API.online || !API.ai) return null;
  try{
    const p = prefs();
    const r = await api("/assistant", {method:"POST", timeout:25000, body:{
      message:text, lang:S.lang, history:chatLog.slice(-6), allergies:p.allergies||[], diet:p.diet||"",
      recipeId: S.recipe ? S.recipe.id : null, step:S.step, servings:S.servings }});
    chatLog.push({role:"user", text}, {role:"assistant", text:r.reply});
    return r.reply || null;
  }catch(e){ return null; }
}

/* =====================================================================
   TRANSLATION
   UI + replies: built in for en/hi/mr/gu/ta. Recipe text: built in for en/hi,
   translated for every other language and cached on the device.
   ===================================================================== */
const MT = store.get("cv_mt", {});   // {lang:{english:translated}}
let mtFailed = {};
function saveMT(){ store.set("cv_mt", MT); }
const mtc = c => c==="zh" ? "zh-CN" : c;
async function mt(text, to, from="en"){
  if(!text) return text;
  const bucketKey = from==="en" ? to : from+">en";
  MT[bucketKey] = MT[bucketKey] || {};
  if(MT[bucketKey][text]) return MT[bucketKey][text];
  if(API.online){
    try{
      const r = await api("/translate", {method:"POST", timeout:30000, body:{text, from, to: from==="en" ? to : "en"}});
      const out = r.translations && r.translations[0];
      if(r.failed || !out) throw new Error("mt");
      MT[bucketKey][text] = out; saveMT(); return out;
    }catch(e){ mtFailed[to]=true; return text; }
  }
  if(API.base == null && NATIVE.isNative) { mtFailed[to]=true; return text; }
  try{
    const url = "https://api.mymemory.translated.net/get?q="+encodeURIComponent(text.slice(0,480))+"&langpair="+mtc(from)+"|"+(from==="en"?mtc(to):"en");
    const res = await fetch(url);
    const j = await res.json();
    let out = j && j.responseData && j.responseData.translatedText;
    if(!out || /MYMEMORY WARNING|INVALID|QUERY LENGTH/i.test(out)) throw new Error("mt");
    out = out.replace(/&#39;/g,"'").replace(/&quot;/g,'"').replace(/&amp;/g,"&");
    MT[bucketKey][text] = out; saveMT(); return out;
  }catch(e){ mtFailed[to]=true; return text; }
}
async function mtMany(arr, to){
  MT[to] = MT[to] || {};
  const need = [...new Set(arr.filter(s=>s && !MT[to][s]))];
  if(!need.length) return arr.map(s=>MT[to][s] || s);
  if(API.online){   // batched: one request per 100 strings
    for(let i=0;i<need.length;i+=100){
      try{
        const r = await api("/translate", {method:"POST", timeout:90000, body:{texts:need.slice(i,i+100), from:"en", to}});
        r.translations.forEach((tr,k)=>{ if(tr && tr!==need[i+k]) MT[to][need[i+k]] = tr; });
        if(r.failed) mtFailed[to] = true;
      }catch(e){ mtFailed[to] = true; }
    }
    saveMT();
    return arr.map(s=>MT[to][s] || s);
  }
  let i = 0;
  async function worker(){ while(i < need.length){ await mt(need[i++], to); } }
  await Promise.all([worker(),worker(),worker(),worker(),worker()]);
  return arr.map(s=>MT[to][s] || s);
}
// text from a {en,hi,...} object in the current language
function L(obj, lang=S.lang){
  if(obj == null) return "";
  if(typeof obj === "string") obj = {en:obj};
  if(obj[lang]) return obj[lang];
  if(MT[lang] && MT[lang][obj.en]) return MT[lang][obj.en];
  return obj.en;
}
function t(key){
  const l = S.lang;
  if(UI[l] && UI[l][key]) return UI[l][key];
  if(MT[l] && UI.en[key] && MT[l][UI.en[key]]) return MT[l][UI.en[key]];
  return UI.en[key] || key;
}
async function ensureUI(lang){
  if(lang==="en") return;
  const missing = Object.keys(UI.en).filter(k => !(UI[lang] && UI[lang][k]) && !(MT[lang] && MT[lang][UI.en[k]]));
  if(missing.length) await mtMany(missing.map(k=>UI.en[k]), lang);
}
function recipeStrings(r){
  const a=[r.desc.en, r.level.en, r.tip.en];
  if(!r.title[S.lang]) a.push(r.title.en);
  r.steps.forEach(s=>a.push(s.en));
  r.ing.forEach(([k,, ,ov])=>{ if(!ING[k]) return; a.push(ING[k].en); a.push((ov||ING[k].sub).en); });
  return a;
}
async function ensureRecipe(r, lang){
  if(CONTENT.includes(lang)) return;
  const need = recipeStrings(r).filter(s=>!(MT[lang] && MT[lang][s]));
  if(need.length) await mtMany(need, lang);
}
function needsTranslation(r, lang){
  if(CONTENT.includes(lang)) return false;
  return recipeStrings(r).some(s=>!(MT[lang] && MT[lang][s]));
}
async function reply(key, ...args){
  const pick = (lang) => { const f=R[lang][key]; return typeof f==="function"?f(...args):f; };
  if(R[S.lang]) return pick(S.lang);
  return await mt(pick("en"), S.lang);
}

/* =====================================================================
   SIGN-IN (server accounts when online; device-only accounts offline)
   ===================================================================== */
function fillLangSelect(sel, value){
  sel.innerHTML = Object.entries(LANGS).map(([c,l])=>`<option value="${c}">${l.native}${l.native!==l.name?" · "+l.name:""}</option>`).join("");
  sel.value = value || "en";
}
function setAuthMode(m){
  S.authMode = m;
  $("#tab-login").setAttribute("aria-selected", m==="login");
  $("#tab-signup").setAttribute("aria-selected", m==="signup");
  $("#name-field").hidden = m!=="signup";
  $("#auth-submit").textContent = m==="login" ? t("login") : t("createAccount");
  $("#f-pass").autocomplete = m==="login" ? "current-password" : "new-password";
  $("#auth-error").textContent = "";
}
function showAuth(){
  $("#app").hidden = true; $("#auth").hidden = false;
  const lang = $("#f-lang").value || "en";
  S.lang = BUILTIN.includes(lang) ? lang : "en";
  applyI18n(); setAuthMode(S.authMode);
  $("#offline-note").hidden = API.online;
}
function defaultLangs(pref){ const s = new Set(["en","hi","mr"]); s.add(pref); return [...s]; }
async function onAuthSubmit(e){
  e.preventDefault();
  const name=$("#f-name").value.trim(), email=$("#f-email").value.trim().toLowerCase(), pass=$("#f-pass").value, lang=$("#f-lang").value;
  const err = $("#auth-error");
  if(S.authMode==="signup" && !name){ err.textContent=t("errName"); return; }
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){ err.textContent=t("errEmail"); return; }
  if(pass.length<6){ err.textContent=t("errPass"); return; }
  if(API.online){
    const btn = $("#auth-submit"); btn.disabled = true;
    try{
      const r = S.authMode==="signup"
        ? await api("/auth/signup", {method:"POST", body:{name, email, password:pass, lang}})
        : await api("/auth/login", {method:"POST", body:{email, password:pass}});
      setToken(r.token);
      let u = r.user;
      if(S.authMode==="login" && lang && lang!==u.lang){
        const langs = u.langs.includes(lang) ? u.langs : [...u.langs, lang];
        try{ u = (await api("/auth/me", {method:"PATCH", body:{lang, langs}})).user; }catch(e2){}
      }
      store.set("cv_session", "api"); store.set("cv_api_user", u);
      startApp(u);
    }catch(ex){
      err.textContent = UI.en[ex.message] ? t(ex.message) : t("errServer");
    }finally{ btn.disabled = false; }
    return;
  }
  const users = store.get("cv_users", {});
  if(S.authMode==="signup"){
    if(users[email]){ err.textContent=t("errExists"); return; }
    users[email] = {name, email, pass:hash(email+"|"+pass), lang, langs:defaultLangs(lang), prefs:{}};
    store.set("cv_users", users);
  }else{
    const u = users[email];
    if(!u || u.pass!==hash(email+"|"+pass)){ err.textContent=t("errLogin"); return; }
    if(lang && lang!==u.lang){ u.lang=lang; if(!u.langs.includes(lang)) u.langs.push(lang); store.set("cv_users", users); }
  }
  store.set("cv_session", email);
  startApp(store.get("cv_users",{})[email]);
}
function guestLogin(){
  const lang = $("#f-lang").value || "en";
  const g = store.get("cv_guest", null) || {name:"Guest", email:null, lang, langs:defaultLangs(lang), prefs:{}};
  g.lang = lang; if(!g.langs.includes(lang)) g.langs.push(lang);
  store.set("cv_guest", g); store.set("cv_session", "guest");
  startApp(g);
}
function saveUser(){
  const u=S.user; if(!u) return;
  if(u.id){
    store.set("cv_api_user", u);
    if(API.online) api("/auth/me", {method:"PATCH", body:{name:u.name, lang:u.lang, langs:u.langs, prefs:u.prefs||{}}}).catch(()=>{});
    return;
  }
  if(!u.email){ store.set("cv_guest", u); return; }
  const users = store.get("cv_users", {}); users[u.email] = u; store.set("cv_users", users);
}
function logout(){
  stopAll(); clearAllTimers(); S.listening=false; stopRec();
  store.del("cv_session"); store.del("cv_api_user"); setToken(null); chatLog.length = 0;
  S.user=null; S.recipe=null; S.favs=new Set(); S.shop=[]; $("#chat").innerHTML="";
  closeModal("settings-modal");
  showAuth();
}

/* =====================================================================
   I18N APPLY + LANGUAGES
   ===================================================================== */
function applyI18n(){
  document.documentElement.lang = S.lang;
  document.documentElement.dir = ["ar","ur"].includes(S.lang) ? "rtl" : "ltr";
  $$("[data-i18n]").forEach(el=>{
    const k = el.dataset.i18n;
    if(k==="heroTitle"){ const v=t(k); const parts=v.split(/,|，|،/); el.innerHTML = parts.length>1 ? esc(parts[0])+", <em>"+esc(parts.slice(1).join(",").trim())+"</em>" : esc(v); return; }
    if(UI.en[k]) el.textContent = t(k);
  });
  $$("[data-i18n-ph]").forEach(el=>{ el.placeholder = t(el.dataset.i18nPh); });
  renderExamples();
}
function renderLangPills(){
  const box = $("#lang-pills");
  box.innerHTML = S.user.langs.map(c=>`<button class="lang-pill" data-lang="${c}" aria-pressed="${c===S.lang}" title="${LANGS[c].name}">${LANGS[c].native}</button>`).join("")
    + `<button class="lang-pill add" id="add-lang">+ ${esc(t("addLang"))}</button>`;
}
async function setLang(code){
  stopSpeech();
  S.lang = code; S.user.lang = code; saveUser();
  renderLangPills();
  if(S.recActive){ stopRec(); }
  const fullUI = BUILTIN.includes(code);
  if(!fullUI) toast(t("translating"));
  await ensureUI(code);
  if(S.lang!==code) return;
  if(mtFailed[code] && !fullUI) toast(UI.en.mtFail);
  applyI18n(); renderLangPills(); renderStage(); renderListView(); setMicStatus(); renderTimers(); if(S.view==="dash") renderDashboard();
  if(!$("#settings-modal").hidden) renderSettings();
  if(S.recipe && needsTranslation(S.recipe, code)) translateCurrent();
  botSay(await reply("hello"));
  if(S.listening) startRec();
}
function openLangModal(){
  $("#lang-grid").innerHTML = Object.entries(LANGS).map(([c,l])=>{
    const note = CONTENT.includes(c) ? "built-in" : BUILTIN.includes(c) ? "built-in app · recipes translated" : "translated";
    return `<label class="lang-opt"><input type="checkbox" value="${c}" ${S.user.langs.includes(c)?"checked":""} ${c==="en"?"disabled":""}>
      <span><span class="native">${l.native}</span><small>${l.name} · ${note}</small></span></label>`;
  }).join("");
  openModal("lang-modal");
}
function saveLangModal(){
  const picked = ["en", ...$$("#lang-grid input:checked:not([disabled])").map(i=>i.value)];
  S.user.langs = picked;
  if(!picked.includes(S.lang)) S.lang = S.user.lang = "en";
  saveUser(); closeModal("lang-modal"); renderLangPills(); toast(t("langAdded"));
}

/* =====================================================================
   MODALS + SETTINGS (diet, allergies, wake word, server, install)
   ===================================================================== */
function openModal(id){ const m=$("#"+id); m.hidden=false; const f=m.querySelector("input,button,select"); f && f.focus({preventScroll:true}); }
function closeModal(id){ const m=$("#"+id); if(m) m.hidden=true; }
const ALLERGENS = ["dairy","nuts","peanut","gluten","egg","soy","sesame","fish","mustard"];
const DIETS = [["any","dietAny"],["veg","dietVeg"],["eggetarian","dietEgg"],["vegan","dietVegan"],["jain","dietJain"]];

function renderSettings(){
  const p = prefs(), al = new Set(p.allergies||[]);
  $("#settings-body").innerHTML = `
    <section class="set-sec">
      <h4>${esc(t("dietPref"))}</h4>
      <div class="seg" role="radiogroup">${DIETS.map(([k,l])=>`<label class="seg-opt"><input type="radio" name="diet" value="${k}" ${ (p.diet||"any")===k?"checked":""}><span>${esc(t(l))}</span></label>`).join("")}</div>
    </section>
    <section class="set-sec">
      <h4>${esc(t("allergiesTitle"))}</h4>
      <p class="muted small">${esc(t("allergiesSub"))}</p>
      <div class="check-grid">${ALLERGENS.map(a=>`<label class="check"><input type="checkbox" name="allergy" value="${a}" ${al.has(a)?"checked":""}><span>${esc(t("al_"+a))}</span></label>`).join("")}</div>
    </section>
    <section class="set-sec row">
      <div><h4>${esc(t("wakeTitle"))}</h4><p class="muted small">${esc(t("wakeSub"))}</p></div>
      <button type="button" class="switch" id="set-wake" role="switch" aria-checked="${!!p.wake}" aria-label="${esc(t("wakeTitle"))}"></button>
    </section>
    <section class="set-sec row">
      <div><h4>${esc(t("addLangTitle"))}</h4><p class="muted small">${S.user.langs.map(c=>LANGS[c].native).join(" · ")}</p></div>
      <button type="button" class="btn small" id="set-langs">${esc(t("manageLangs"))}</button>
    </section>
    <section class="set-sec" id="install-sec" ${canInstall() ? "" : "hidden"}>
      <div class="row"><div><h4>${esc(t("installApp"))}</h4><p class="muted small">${esc(isIOS() && !deferredInstall ? t("iosInstall") : t("installSub"))}</p></div>
      ${deferredInstall ? `<button type="button" class="btn small primary" id="install-btn">${esc(t("installApp"))}</button>` : ""}</div>
    </section>
    <section class="set-sec">
      <h4>${esc(t("serverTitle"))}</h4>
      <p class="muted small">${esc(t("serverSub"))}</p>
      <input class="input" id="set-server" inputmode="url" autocomplete="off" placeholder="https://" value="${esc(store.get("cv_server","") || "")}">
      <p class="muted small" style="margin:.4rem 0 0">${API.online ? "● " + esc(t("live")) : esc(t("offlineMode"))}</p>
    </section>
    <section class="set-sec row">
      <div><h4>${esc(S.user.name)}</h4><p class="muted small">${esc(S.user.email || t("guest"))}</p></div>
      <button type="button" class="btn small" id="logout2">${esc(t("logout"))}</button>
    </section>`;
}
function openSettings(){ renderSettings(); openModal("settings-modal"); }
async function saveSettings(){
  const p = {...prefs()};
  const d = $("#settings-body input[name=diet]:checked"); p.diet = d ? d.value : "any";
  p.allergies = $$("#settings-body input[name=allergy]:checked").map(i=>i.value);
  p.wake = $("#set-wake").getAttribute("aria-checked")==="true";
  S.user.prefs = p; saveUser();
  const srv = $("#set-server").value.trim();
  const before = store.get("cv_server","");
  if(srv !== before){
    if(srv && !/^https?:\/\/[^\s]+$/i.test(srv)){ toast("http(s)://…"); return; }
    if(srv) store.set("cv_server", srv); else store.del("cv_server");
    await initBackend();
    toast(API.online ? t("live") : t("offlineMode"));
  }else toast(t("saved"));
  closeModal("settings-modal");
  applyDietDefault(true); renderStage(); renderHud(); setMicStatus();
  if(S.view==="dash") renderDashboard();
}

/* PWA install prompt */
let deferredInstall = null;
const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
const isStandalone = () => window.matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
const canInstall = () => !NATIVE.isNative && !isStandalone() && (!!deferredInstall || isIOS());
window.addEventListener("beforeinstallprompt", (e)=>{ e.preventDefault(); deferredInstall = e; const s=$("#install-sec"); if(s && !$("#settings-modal").hidden) renderSettings(); });
window.addEventListener("appinstalled", ()=>{ deferredInstall = null; });
async function promptInstall(){ if(!deferredInstall) return; deferredInstall.prompt(); await deferredInstall.userChoice.catch(()=>{}); deferredInstall = null; renderSettings(); }
