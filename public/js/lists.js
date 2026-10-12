/* =====================================================================
   CHAT, FAVOURITES, SHOPPING LIST, HISTORY + DASHBOARD, VIEWS
   ===================================================================== */

/* ---------- chat ---------- */
function addMsg(role, html){
  const d = document.createElement("div");
  d.className = "msg "+role;
  d.innerHTML = `<div class="who">${role==="bot"?"CookMate AI":esc(S.user?.name||"You")}</div>`+html;
  $("#chat").appendChild(d);
  $("#chat").scrollTop = $("#chat").scrollHeight;
  return d;
}
async function botSay(text, {chips=null, sub=null, speakIt=true}={}){
  let html = esc(text);
  if(sub) html += `<div class="sub-card"><b>${esc(sub.name)}</b> → ${esc(sub.alt)}${sub.key?`<br><button class="chip" data-addlist="${sub.key}">+ ${esc(t("addToList"))}</button>`:""}</div>`;
  if(chips && chips.length) html += `<div class="chips">${chips.map(r=>`<button class="chip" data-recipe="${r.id}">${esc(L(r.title))}</button>`).join("")}</div>`;
  addMsg("bot", html);
  if(speakIt) speak(text);
}

/* ---------- favourites (device + account sync) ---------- */
const favKey = () => "cv_fav_" + userKey();
function loadFavs(){ S.favs = new Set(store.get(favKey(), [])); }
async function pullFavs(){
  if(!signedIn()) return;
  try{
    const r = await api("/favorites");
    const local = [...S.favs];
    S.favs = new Set([...r.favorites, ...local]);
    local.filter(id=>!r.favorites.includes(id)).forEach(id=>api("/favorites/"+encodeURIComponent(id), {method:"PUT"}).catch(()=>{}));
    store.set(favKey(), [...S.favs]); refreshFavViews();
  }catch(e){}
}
function toggleFav(id, quiet){
  const on = !S.favs.has(id);
  if(on) S.favs.add(id); else S.favs.delete(id);
  store.set(favKey(), [...S.favs]);
  if(signedIn()) api("/favorites/"+encodeURIComponent(id), {method: on ? "PUT" : "DELETE"}).catch(()=>{});
  if(!quiet){ const r = RECIPES.find(x=>x.id===id); r && reply(on ? "favAdded" : "favRemoved", L(r.title)).then(toast); }
  refreshFavViews();
  return on;
}
function refreshFavViews(){
  $$(`.heart[data-fav]`).forEach(b=>{ const on = S.favs.has(b.dataset.fav); b.setAttribute("aria-pressed", on); b.setAttribute("aria-label", on ? t("unsaveFav") : t("saveFav")); });
  if(!S.recipe && S.f.chips.has("fav")) renderResults();
  if(S.view==="dash") renderDashboard();
}

/* ---------- shopping list ---------- */
const shopKey = () => "cv_shop_" + userKey();
function loadShop(){ S.shop = store.get(shopKey(), []) || []; }
let pushShopT = null;
function saveShop(){
  store.set(shopKey(), S.shop);
  if(signedIn()){ clearTimeout(pushShopT); pushShopT = setTimeout(()=>api("/shopping", {method:"PUT", body:{items:S.shop}}).catch(()=>{}), 800); }
  renderListBadge();
  if(S.view==="list") renderListView();
}
async function pullShop(){
  if(!signedIn()) return;
  try{
    const r = await api("/shopping");
    if(r.items && r.items.length){
      const ids = new Set(r.items.map(x=>x.id));
      S.shop = [...r.items, ...S.shop.filter(x=>!ids.has(x.id))];
      store.set(shopKey(), S.shop);
    }
    if(S.shop.length) api("/shopping", {method:"PUT", body:{items:S.shop}}).catch(()=>{});
    renderListBadge(); if(S.view==="list") renderListView();
  }catch(e){}
}
const itemName = x => x.ing && ING[x.ing] ? L(ING[x.ing]) : x.text;
function addToList(ingKey, qty, recipeId, text){
  const existing = ingKey ? S.shop.find(x=>x.ing===ingKey && !x.done) : S.shop.find(x=>!x.ing && x.text.toLowerCase()===String(text).toLowerCase() && !x.done);
  if(existing){
    if(qty && existing.qty && !existing.qty.split(" + ").includes(qty)) existing.qty += " + " + qty;
    else if(qty && !existing.qty) existing.qty = qty;
  }else{
    S.shop.unshift({id:uid(), ing:ingKey||null, text: ingKey ? (ING[ingKey]?.en || ingKey) : String(text||"").slice(0,120), qty: qty||"", from: recipeId||null, done:false});
  }
  saveShop();
  if(S.recipe) renderRecipe();
  toast(t("addedToList"));
}
function addAllToList(recipeId){
  const r = RECIPES.find(x=>x.id===recipeId); if(!r) return;
  r.ing.forEach(i=>{ if(["water","salt"].includes(i[0])) return; const ex = S.shop.find(x=>x.ing===i[0] && !x.done); if(!ex) S.shop.push({id:uid(), ing:i[0], text:ING[i[0]].en, qty: fmtQty(i, r, S.recipe===r ? S.servings : r.serves), from:r.id, done:false}); });
  saveShop(); if(S.recipe) renderRecipe(); toast(t("addedToList"));
}
function listText(){
  const items = S.shop.filter(x=>!x.done);
  return `${t("listTitle")} (CookMate AI)\n` + items.map(x=>`• ${itemName(x)}${x.qty?" — "+x.qty:""}`).join("\n");
}
async function shareList(whatsApp){
  const text = listText();
  if(whatsApp){ window.open("https://wa.me/?text="+encodeURIComponent(text), "_blank", "noopener"); return; }
  if(await NATIVE.share(t("listTitle"), text)) return;
  if(navigator.share){ try{ await navigator.share({title:t("listTitle"), text}); return; }catch(e){ if(e && e.name==="AbortError") return; } }
  try{ await navigator.clipboard.writeText(text); toast("✓"); }catch(e){ window.open("https://wa.me/?text="+encodeURIComponent(text), "_blank", "noopener"); }
}
function renderListBadge(){
  const n = S.shop.filter(x=>!x.done).length;
  $$(".list-badge").forEach(b=>{ b.textContent = n; b.hidden = !n; });
}
function renderListView(){
  const box = $("#list-inner"); if(!box || !S.user) return;
  const toBuy = S.shop.filter(x=>!x.done), got = S.shop.filter(x=>x.done);
  const row = x => {
    const r = x.from && RECIPES.find(y=>y.id===x.from);
    return `<li class="shop-item ${x.done?"done":""}">
      <label><input type="checkbox" data-shopcheck="${x.id}" ${x.done?"checked":""}><span class="box"></span>
      <span class="sname">${esc(itemName(x))}</span>${x.qty?`<span class="sqty mono">${esc(x.qty)}</span>`:""}</label>
      ${r?`<span class="sfrom">${esc(L(r.title))}</span>`:""}
      <button class="tbtn x" data-shopdel="${x.id}" aria-label="${esc(t("dismiss"))}">×</button></li>`;
  };
  box.innerHTML = `
    <div class="dash-head">
      <div><div class="eyebrow">${toBuy.length} ${esc(t("toBuy"))}</div><h1>${esc(t("listTitle"))}</h1><p>${esc(t("listSub"))}</p></div>
      <div class="share-row">
        <button class="btn wa" id="share-wa" ${toBuy.length?"":"disabled"}><svg class="icon"><use href="#i-chat"/></svg>${esc(t("shareWhatsApp"))}</button>
        <button class="btn" id="share-list" ${toBuy.length?"":"disabled"}><svg class="icon"><use href="#i-share"/></svg>${esc(t("share"))}</button>
      </div>
    </div>
    <form class="add-item" id="add-item-form"><input class="input" id="add-item" autocomplete="off" placeholder="${esc(t("addItemPh"))}" aria-label="${esc(t("addItemPh"))}"><button class="btn primary">+</button></form>
    <section class="panel">
      ${toBuy.length ? `<ul class="shop-list">${toBuy.map(row).join("")}</ul>` : `<p class="empty">${esc(t("listEmpty"))}</p>`}
    </section>
    ${got.length ? `<section class="panel"><h3>${esc(t("bought"))} <button class="link-btn" id="clear-bought">${esc(t("clearBought"))}</button></h3><ul class="shop-list">${got.map(row).join("")}</ul></section>` : ""}`;
}

/* ---------- history + dashboard ---------- */
let H = {events:[], stats:{voice:0}, progress:null};
const histKey = () => "cv_hist_" + userKey();
function loadH(){ H = store.get(histKey(), null) || {events:[], stats:{voice:0}, progress:null}; H.stats = H.stats || {voice:0}; }
function saveH(push=true){ store.set(histKey(), H); if(push) pushHistory(); }
let pushHT = null;
function pushHistory(){
  if(!signedIn()) return;
  clearTimeout(pushHT);
  pushHT = setTimeout(()=>api("/history", {method:"PUT", body:{history:H}}).catch(()=>{}), 1500);
}
async function pullHistory(){
  if(!signedIn()) return;
  try{
    const r = await api("/history");
    if(r.history){ H = r.history; H.stats = H.stats || {voice:0}; saveH(false); onHistoryChange("sync"); }
    else pushHistory();
  }catch(e){}
}
function onHistoryChange(kind){ S.lastUpdate = Date.now(); S.bump = kind; if(S.view==="dash") renderDashboard(); }
function logEvent(ev){ ev.ts = Date.now(); H.events.unshift(ev); H.events = H.events.slice(0,300); saveH(); onHistoryChange(ev.k); }
function bumpStat(name){ H.stats[name] = (H.stats[name]||0) + 1;
  if(name==="voice"){ const d=startOfDay(); if(H.stats.voiceDay!==d){ H.stats.voiceDay=d; H.stats.voiceToday=0; } H.stats.voiceToday++; } saveH(); onHistoryChange(name); }
function logSearch(p, ids){ if(!p || !p.q) return; logEvent({k:"search", q:p.q, via:p.via||"typed", lang:S.lang, ids}); }
function saveProgress(){ if(!S.recipe) return; H.progress = {id:S.recipe.id, step:S.step, total:S.recipe.steps.length, ts:Date.now()}; saveH(); }

function ago(ts){
  const s = Math.round((ts - Date.now())/1000);
  try{
    const rtf = new Intl.RelativeTimeFormat(LANGS[S.lang].speech, {numeric:"auto"});
    const a = Math.abs(s);
    if(a < 45) return rtf.format(0, "second");
    if(a < 3600) return rtf.format(Math.round(s/60), "minute");
    if(a < 86400) return rtf.format(Math.round(s/3600), "hour");
    return rtf.format(Math.round(s/86400), "day");
  }catch(e){ return new Date(ts).toLocaleString(); }
}
const startOfDay = (d=new Date()) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
const recipeById = id => RECIPES.find(r=>r.id===id);

function favRow(r, sub){
  return `<div class="fav"><button class="fav-open" data-recipe="${r.id}"><span class="art" style="background:${r.hue}"><svg><use href="#art-${r.art}"/></svg></span>
      <span style="min-width:0"><b>${esc(L(r.title))}</b><span class="muted" style="font-size:.84rem">${sub}</span></span></button>
      <button class="heart small" data-fav="${r.id}" aria-pressed="${S.favs.has(r.id)}" aria-label="${esc(S.favs.has(r.id)?t("unsaveFav"):t("saveFav"))}"><svg><use href="#i-heart"/></svg></button></div>`;
}
function renderDashboard(){
  const box = $("#dash-inner"); if(!box || !S.user) return;
  if(!CONTENT.includes(S.lang)){
    const need = RECIPES.filter(r=>!r.title[S.lang]).map(r=>r.title.en).filter(s=>!(MT[S.lang]&&MT[S.lang][s]));
    if(need.length && !renderDashboard._busy){ renderDashboard._busy = true; mtMany(need, S.lang).then(()=>{ renderDashboard._busy=false; if(S.view==="dash") renderDashboard(); }); }
  }
  const ev = H.events, today = startOfDay();
  const count = (k, since=0) => ev.filter(e=>e.k===k && e.ts>=since).length;
  const hr = new Date().getHours();
  const greet = hr<12 ? t("gMorning") : hr<17 ? t("gAfternoon") : t("gEvening");
  const first = (S.user.name||"").split(" ")[0];
  const bump = S.bump; S.bump = null;
  const stat = (key, n, d, kinds) => `<div class="stat ${kinds.includes(bump)?"bump":""}"><span class="num">${n}</span><span class="lbl">${esc(t(key))}</span><span class="delta">${d? "+"+d+" "+esc(t("today")) : "&nbsp;"}</span></div>`;
  const voiceToday = H.stats.voiceDay===today ? (H.stats.voiceToday||0) : 0;

  const searches = ev.filter(e=>e.k==="search").slice(0,8);
  const rows = searches.map((e,ix)=>{
    const chips = (e.ids||[]).map(id=>recipeById(id)).filter(Boolean)
      .map(r=>`<button class="chip" data-recipe="${r.id}">${esc(L(r.title))}</button>`).join("");
    return `<li class="search-row ${ix===0 && Date.now()-e.ts<3000 ? "new":""}">
      <span class="via ${e.via==="voice"?"voice":""}" title="${esc(e.via==="voice"?t("viaVoice"):t("viaTyped"))}"><svg><use href="#${e.via==="voice"?"i-mic":"i-keyboard"}"/></svg></span>
      <div style="min-width:0"><div class="q">“${esc(e.q)}”</div>
        <div class="q-meta"><span class="lang-tag">${esc(LANGS[e.lang]?LANGS[e.lang].native:e.lang)}</span>${chips || `<span>${esc(t("noMatch"))}</span>`}</div></div>
      <span class="when">${esc(ago(e.ts))}</span></li>`;
  }).join("");

  // 7-day activity
  const days = [...Array(7)].map((_,k)=>{ const d=new Date(); d.setDate(d.getDate()-(6-k)); const s=startOfDay(d); return {s, e:s+86400000, d}; });
  const vals = days.map(d=>ev.filter(e=>e.ts>=d.s && e.ts<d.e).length);
  const max = Math.max(1, ...vals);
  const bars = days.map((d,k)=>`<div class="bar-col ${k===6?"today":""}"><span class="v">${vals[k]}</span><div class="track"><div class="fill" style="height:${(vals[k]/max*100).toFixed(1)}%"></div></div><span class="d">${esc(d.d.toLocaleDateString(LANGS[S.lang].speech,{weekday:"short"}))}</span></div>`).join("");

  // saved favourites first, then most-opened
  const saved = [...S.favs].map(recipeById).filter(Boolean).slice(0,6);
  const opens = {}; ev.filter(e=>e.k==="open").forEach(e=>opens[e.id]=(opens[e.id]||0)+1);
  const most = Object.entries(opens).sort((a,b)=>b[1]-a[1]).map(([id,n])=>[recipeById(id),n]).filter(([r])=>r && !S.favs.has(r.id)).slice(0,3);
  const favHTML = (saved.length ? saved.map(r=>favRow(r, `${r.time} ${esc(t("mins"))} · ${esc(regionName(r.region))}`)).join("") : `<p class="empty" style="padding:.6rem 0">${esc(t("noFav"))}</p>`)
    + (most.length ? `<div class="eyebrow" style="margin-top:.8rem">${esc(t("mostOpened"))}</div>` + most.map(([r,n])=>favRow(r, `${r.time} ${esc(t("mins"))} · ${n} × ${esc(t("opened"))}`)).join("") : "");

  // continue cooking
  const pr = H.progress && recipeById(H.progress.id);
  const cont = pr ? `<div class="panel continue">
      <div class="eyebrow">${esc(t("continueCooking"))}</div>
      <h3 style="margin:.3rem 0 0">${esc(L(pr.title))}</h3>
      <div class="muted" style="font-size:.88rem">${esc(t("step"))} ${H.progress.step+1} ${esc(t("of"))} ${pr.steps.length} · ${esc(ago(H.progress.ts))}</div>
      <div class="bar"><i style="width:${((H.progress.step+1)/pr.steps.length*100).toFixed(0)}%"></i></div>
      <button class="btn primary small" data-resume="${pr.id}"><svg class="icon" style="width:16px;height:16px"><use href="#i-play"/></svg>${esc(t("resume"))}</button>
    </div>` : `<div class="panel"><div class="eyebrow">${esc(t("justSay"))}</div>
      <div class="chips">${["ex1","ex2","ex3"].map(k=>`<button class="chip" data-ex="${esc(t(k))}">${esc(t(k))}</button>`).join("")}</div></div>`;

  const shopN = S.shop.filter(x=>!x.done).length;
  box.innerHTML = `
    <div class="dash-head">
      <div><div class="eyebrow">${esc(new Date().toLocaleDateString(LANGS[S.lang].speech,{weekday:"long", day:"numeric", month:"long"}))}</div>
        <h1>${esc(greet)}, ${esc(first)}</h1><p>${esc(t("dashSub"))}</p></div>
      <span class="live-pill" role="status"><span class="dot"></span>${esc(t("live"))} <span class="muted">· ${esc(t("updated"))} ${esc(ago(S.lastUpdate||Date.now()))}</span></span>
    </div>
    <div class="stats">
      ${stat("stSearch", count("search"), count("search", today), ["search"])}
      ${stat("stCooked", count("done"), count("done", today), ["done"])}
      ${stat("stVoice", H.stats.voice||0, voiceToday, ["voice"])}
      ${stat("stSwaps", count("sub"), count("sub", today), ["sub"])}
    </div>
    <div class="cta-row">
      <button class="cta" id="dash-start"><span class="mic-sm"><svg><use href="#i-mic"/></svg></span><span><b>${esc(t("startCooking"))}</b><span>${esc(t("startCookingSub"))}</span></span></button>
      ${cont}
    </div>
    <div class="dash-grid">
      <section class="panel">
        <h3>${esc(t("recentSearches"))} ${searches.length?`<button class="link-btn ${S.clearArm?"danger":""}" id="clear-hist">${esc(S.clearArm?t("confirmClear"):t("clearHistory"))}</button>`:""}</h3>
        ${rows ? `<ul class="search-list">${rows}</ul>` : `<p class="empty">${esc(t("noSearches"))}</p>`}
      </section>
      <div class="dash-col">
        <section class="panel"><h3>${esc(t("favourites"))}</h3>${favHTML}</section>
        <button class="panel list-cta" data-view="list"><svg class="icon"><use href="#i-cart"/></svg><span><b>${esc(t("listTitle"))}</b><span class="muted">${shopN} ${esc(t("toBuy"))}</span></span></button>
        <section class="panel"><h3>${esc(t("activity"))}</h3><div class="bars">${bars}</div></section>
      </div>
    </div>`;
}
// keep "x minutes ago" fresh, and pick up changes made in another tab
setInterval(()=>{ if(S.user && S.view==="dash" && !$("#app").hidden) renderDashboard(); }, 15000);
window.addEventListener("storage", (e)=>{ if(S.user && e.key===histKey()){ loadH(); onHistoryChange("sync"); } });

function showView(v){
  S.view = v;
  $("#dash").hidden = v!=="dash"; $("#kitchen").hidden = v!=="kitchen"; $("#list").hidden = v!=="list";
  $$("[data-view]").forEach(b=>{ if(b.classList.contains("nav-btn")) b.setAttribute("aria-current", b.dataset.view===v ? "page" : "false"); });
  document.body.dataset.view = v;
  if(v==="dash"){ S.clearArm = false; renderDashboard(); keepAwake(false); }
  else if(v==="list"){ renderListView(); keepAwake(false); }
  else if(S.recipe) keepAwake(true);
  renderTimers();
  window.scrollTo(0,0);
}
