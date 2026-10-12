/* =====================================================================
   KITCHEN: commands, recipe info, step player, timers, gallery, recipe view
   ===================================================================== */

/* ---------- recipe facts derived from ingredients: diet, allergens, nutrition ---------- */
function gramsOf(k, q, u){
  const ing = ING[k]; const w = (ing && ing.w && ing.w[u] != null) ? ing.w[u] : DEFAULT_W[u];
  if(u === "taste") return w || 1;
  return q * (w == null ? 50 : w);
}
function nutrition(r){
  let kcal = 0, p = 0;
  r.ing.forEach(([k,q,u])=>{ const ing = ING[k]; if(!ing || !ing.n) return; const g = gramsOf(k,q,u); kcal += g*ing.n[0]/100; p += g*ing.n[1]/100; });
  return { kcal, p, perKcal: kcal / r.serves, perP: p / r.serves };
}
function rInfo(r){
  if(r._i) return r._i;
  const fl = new Set();
  r.ing.forEach(([k])=>((ING[k] && ING[k].f) || "").split(" ").forEach(x=>x && fl.add(x)));
  const honey = r.ing.some(i=>i[0]==="honey");
  const i = { al: ALLERGENS.filter(a=>fl.has(a)), meat: fl.has("meat"), egg: fl.has("egg"), vegan: !fl.has("ani"),
              jain: !fl.has("root") && !fl.has("meat") && !fl.has("egg") && !honey, gf: !fl.has("gluten"), nut: nutrition(r) };
  i.diet = i.meat ? "nonveg" : i.egg ? "egg" : "veg";
  Object.defineProperty(r, "_i", {value:i, enumerable:false, configurable:true});
  return i;
}
function dietOk(r, diet = prefs().diet){
  const i = rInfo(r);
  switch(diet){
    case "veg": return i.diet === "veg";
    case "eggetarian": return !i.meat;
    case "vegan": return i.vegan;
    case "jain": return i.jain;
    default: return true;
  }
}
const allergyHits = r => { const a = prefs().allergies || []; return rInfo(r).al.filter(x=>a.includes(x)); };
const okForUser = r => dietOk(r) && !allergyHits(r).length;
const suggestable = list => { const ok = list.filter(okForUser); return ok.length ? ok : list; };
const allergenIngs = (r, hits) => r.ing.filter(([k])=>hits.some(a=>((ING[k]&&ING[k].f)||"").split(" ").includes(a))).map(([k])=>k);
const regionName = id => { const g = REGIONS.find(x=>x.id===id); return g ? (g[S.lang] || L(g)) : ""; };

/* ---------- handle a command ---------- */
async function handleInput(text, fromVoice=false, pre=null){
  addMsg("user", esc(text));
  if(fromVoice) bumpStat("voice");
  let p = pre || parse(text);
  if(p.type==="unknown" && !CONTENT.includes(S.lang)){
    const en = await mt(text, "en", S.lang);   // translate the command to English and try again
    if(en && en!==text) p = parse(en);
  }
  p.q = text; p.via = fromVoice ? "voice" : "typed";
  await act(p);
}

async function act(p){
  const r = S.recipe;
  switch(p.type){
    case "recipe": logSearch(p, [p.recipe.id]); await openRecipe(p.recipe.id, p.servings); return;
    case "sub": {
      const inRecipe = r ? p.ings.filter(k=>r.ing.some(i=>i[0]===k)) : [];
      const key = inRecipe[0] || p.ings[0];
      const name = L(ING[key]);
      const entry = r && r.ing.find(i=>i[0]===key);
      const alt = L(entry && entry[3] ? entry[3] : ING[key].sub);
      if(r && !entry){ botSay(await reply("subNotIn", name, alt), {sub:{name, alt, key}}); return; }
      if(r && entry){ S.swapped[key] = true; renderStage(); }
      logEvent({k:"sub", ing:key, id: r ? r.id : null});
      botSay(await reply("sub", name, alt), {sub:{name, alt, key}});
      return;
    }
    case "subAsk": botSay(await reply("subNoMatch")); return;
    case "have": {
      const scored = suggestable(RECIPES.map(rc=>({rc, score: p.ings.reduce((s,k)=>{ const ix=rc.ing.findIndex(i=>i[0]===k); return s + (ix<0?0:(ix===0?3:ix<3?2:1)); },0)}))
        .filter(o=>o.score>0).sort((a,b)=>b.score-a.score || a.rc.time-b.rc.time).map(o=>o.rc)).slice(0,3);
      logSearch(p, scored.map(s=>s.id));
      if(!scored.length){ botSay(await reply("suggestNone"), {chips: suggestable(RECIPES).slice(0,4)}); return; }
      if(!CONTENT.includes(S.lang)) await mtMany(scored.filter(s=>!s.title[S.lang]).map(s=>s.title.en), S.lang);
      botSay(await reply("suggest", scored.map(s=>L(s.title)).join(", ")), {chips: scored});
      return;
    }
    case "tags": {
      let list = RECIPES.filter(rc => (!p.region || rc.region===p.region) && (p.tags||[]).every(tg => tagOk(rc, tg)));
      if(!list.length) list = RECIPES.slice();
      list = suggestable(list).slice(0,5);
      logSearch(p, list.map(s=>s.id));
      if(!CONTENT.includes(S.lang)) await mtMany(list.filter(s=>!s.title[S.lang]).map(s=>s.title.en), S.lang);
      // mirror the request in the gallery filters
      S.f.region = p.region || "all"; S.f.q = "";
      S.f.chips = new Set((p.tags||[]).filter(tg=>CHIPS.some(([k])=>k===tg)));
      if(!S.recipe) renderStage();
      botSay(await reply("tagList", list.map(s=>L(s.title)).join(", ")), {chips:list});
      return;
    }
    case "notfound": logSearch(p, []); botSay(await reply("notFound"), {chips: suggestable(RECIPES).slice(0,5)}); return;
    case "help": botSay(await reply("help")); return;
    case "hello": botSay(await reply("hello"), {chips: suggestable(RECIPES).slice(0,3)}); return;
    case "home": closeRecipe(); showView("kitchen"); return;
    case "dash": showView("dash"); speak(t("navDash")); return;
    case "kitchen": showView("kitchen"); return;
    case "micoff": setListening(false); botSay(await reply("micOff")); return;
    case "timer": {
      const label = p.label || (r ? L(r.title) : t("timerLabel")+" "+(S.timers.length+1));
      newTimer({secs:p.secs, label});
      botSay(await reply("timerSet", fmtDur(p.secs), label));
      if(CONTROL.has(p.type)) flashCmd(p.type, p.q);
      return;
    }
    case "timerStatus": {
      const live = S.timers.filter(x=>!x.done);
      if(!live.length){ botSay(await reply("timerNone")); return; }
      botSay(await reply("timerStatus", live.map(x=>`${x.label} ${fmtDur(x.left)}`).join(", ")));
      return;
    }
    case "timerStop": {
      if(!S.timers.length){ botSay(await reply("timerNone")); return; }
      if(p.all){ clearAllTimers(); botSay(await reply("timerAllStop")); return; }
      const lab = (p.label||"").toLowerCase();
      const tm = (lab && S.timers.find(x=>x.label.toLowerCase().includes(lab))) || (r && stepTimer(S.step)) || S.timers[S.timers.length-1];
      removeTimer(tm.id); botSay(await reply("timerStop", tm.label));
      return;
    }
    case "listAdd": {
      const names = p.ings.map(k=>{ const e = r && r.ing.find(i=>i[0]===k); addToList(k, e ? fmtQty(e) : "", r && e ? r.id : null); return L(ING[k]); });
      botSay(await reply("listAdded", names.join(", ")));
      return;
    }
    case "listAddText": addToList(null, "", null, p.text); botSay(await reply("listAdded", p.text)); return;
    case "listShow": {
      showView("list");
      const items = S.shop.filter(x=>!x.done);
      botSay(items.length ? await reply("listRead", items.map(itemName).join(", ")) : await reply("listEmpty"));
      return;
    }
    case "fav": {
      const rc = p.recipe || r;
      if(!rc){ botSay(await reply("noRecipe"), {chips: suggestable(RECIPES).slice(0,4)}); return; }
      const on = toggleFav(rc.id, true);
      botSay(await reply(on ? "favAdded" : "favRemoved", L(rc.title)));
      return;
    }
    case "unknown": {
      const ai = await askAssistant(p.q || "");
      if(ai){ botSay(ai); return; }
      botSay(await reply("unknown")); return;
    }
  }
  // player commands need a recipe
  if(!r){ botSay(await reply("noRecipe"), {chips: suggestable(RECIPES).slice(0,4)}); return; }
  switch(p.type){
    case "next": nextStep(); break;
    case "prev": prevStep(); break;
    case "pause": pausePlayer(true); break;
    case "play": playPlayer(); break;
    case "repeat": playStep(); break;
    case "goto": goTo(Math.min(Math.max(1,p.n), r.steps.length)-1); break;
    case "servings": S.servings = p.n; renderStage(); botSay(await reply("servings", p.n)); break;
    case "ingredients": {
      const list = r.ing.map(i=>fmtQty(i)+" "+L(ING[i[0]])).join(", ");
      botSay(await reply("ingList", L(r.title), list)); break;
    }
    case "qty": {
      const k = p.ings.find(k=>r.ing.some(i=>i[0]===k)) || p.ings[0];
      const entry = r.ing.find(i=>i[0]===k);
      botSay(entry ? await reply("qty", L(ING[k]), fmtQty(entry)) : await reply("qtyNot", L(ING[k]))); break;
    }
    case "timerStart": {
      const st = r.steps[S.step], cur = stepTimer(S.step);
      if(cur && cur.left>0 && !cur.running){ resumeTimer(cur.id); break; }
      if(st.t && !cur){ const tm = startStepTimer(S.step); botSay(await reply("timerSet", fmtDur(st.t), tm.label)); }
      else if(!st.t) botSay(await reply("noTimer"));
      break;
    }
  }
  if(CONTROL.has(p.type)) flashCmd(p.type, p.q);
}

/* ---------- quantities + time format ---------- */
function fmtNum(n){
  const whole = Math.floor(n), frac = n - whole;
  const fr = frac<0.13?"":frac<0.38?"¼":frac<0.63?"½":frac<0.88?"¾":"";
  const w = frac>=0.88 ? whole+1 : whole;
  return (w? String(w):"") + fr || "0";
}
function fmtQty([k, q, u], recipe=S.recipe, servings=S.servings){
  const unit = UNITS[u] || {en:u};
  const uTxt = unit[S.lang] != null ? unit[S.lang] : unit.en;
  if(u==="taste") return uTxt;
  const scale = servings && recipe ? servings / recipe.serves : 1;
  let v = q*scale;
  if(u==="pinch" || u==="sprig" || u==="handful" || u==="bunch") v = Math.max(1, Math.round(v));
  if(u==="pc") v = Math.max(0.5, Math.round(v*2)/2);
  if(u==="g" && v >= 100) v = Math.round(v/10)*10;
  return (fmtNum(v)+" "+uTxt).trim();
}
function fmtDur(s){
  s = Math.max(0, Math.round(s));
  const h=Math.floor(s/3600), m=Math.floor((s%3600)/60), r=s%60;
  if(h) return `${h}h ${m}m`;
  return m && r ? `${m}m ${r}s` : m ? `${m} ${t("mins")}` : `${r}s`;
}
const clock = s => { s=Math.max(0,s); const h=Math.floor(s/3600), m=Math.floor((s%3600)/60), r=s%60; return (h? h+":"+String(m).padStart(2,"0") : String(m).padStart(2,"0"))+":"+String(r).padStart(2,"0"); };
const fmtInt = n => Math.round(n).toLocaleString(LANGS[S.lang].speech);

/* ---------- step player ---------- */
function stepText(i){ return L(S.recipe.steps[i]); }
function playStep(){
  if(!S.recipe) return;
  S.playing = true; clearAutoNext();
  const i = S.step, st = S.recipe.steps[i];
  renderPlayer(true);
  speak(`${t("step")} ${i+1}. ${stepText(i)}`, ()=>{
    renderPlayer(false);
    if(!S.playing || S.step!==i) return;
    if(st.t){ if(!stepTimer(i)) startStepTimer(i); }
    else if(S.auto){ scheduleAutoNext(); }
  });
}
let autoNextT = null;
function scheduleAutoNext(){ clearAutoNext(); autoNextT = setTimeout(()=>{ if(S.playing) nextStep(); }, 3500); }
function clearAutoNext(){ clearTimeout(autoNextT); autoNextT=null; }
function playPlayer(){
  if(!S.recipe) return;
  const cur = stepTimer(S.step);
  if(cur && cur.left>0 && !cur.running){ S.playing=true; resumeTimer(cur.id); renderPlayer(false); return; }
  playStep();
}
async function pausePlayer(announce){
  S.playing = false; clearAutoNext(); stopSpeech(); renderPlayer(false);
  if(announce){ const m = await reply("paused"); addMsg("bot", esc(m)); }
}
async function nextStep(){
  if(!S.recipe) return;
  if(S.step >= S.recipe.steps.length-1){
    S.playing=false; renderPlayer(false);
    logEvent({k:"done", id:S.recipe.id}); H.progress=null; saveH();
    botSay(await reply("finished")); return;
  }
  goTo(S.step+1);
}
function prevStep(){ if(S.recipe && S.step>0) goTo(S.step-1); else if(S.recipe) goTo(0); }
function goTo(i){
  S.step = i; saveProgress(); clearAutoNext();
  if(S.playing) playStep(); else { stopSpeech(); renderPlayer(false); }
}
function stopAll(){ S.playing=false; clearAutoNext(); stopSpeech(); }

/* ---------- timers: any number at once; they keep running while you move between steps ---------- */
let timerIv = null;
const timersKey = () => "cv_timers_" + userKey();
function saveTimers(){ store.set(timersKey(), S.timers.filter(x=>!x.done)); }
function loadTimers(){
  S.timers = (store.get(timersKey(), []) || []).filter(x=>x && x.id);
  const now = Date.now();
  S.timers.forEach(x=>{ if(x.running){ x.left = Math.ceil((x.endAt-now)/1000); if(x.left<=0){ x.left=0; x.running=false; x.done=true; } } });
  if(S.timers.some(x=>x.running)) ensureTicker();
  renderTimers();
}
function ensureTicker(){ if(!timerIv) timerIv = setInterval(tickTimers, 500); }
function newTimer({secs, label, step=-1, recipeId=null}){
  const x = { id: uid(), nid: Math.floor(Math.random()*2e9), label, total:secs, left:secs, endAt: Date.now()+secs*1000, running:true, done:false, step, recipeId };
  S.timers.push(x);
  NATIVE.scheduleAlarm(x.nid, x.endAt, "CookMate AI", label + " · " + t("timerDone"));
  if(!NATIVE.isNative && "Notification" in window && Notification.permission==="default") { try{ Notification.requestPermission(); }catch(e){} }
  ensureTicker(); saveTimers(); renderTimers();
  return x;
}
const stepLabel = i => `${L(S.recipe.title)} · ${t("step")} ${i+1}`;
function startStepTimer(i){ return newTimer({secs:S.recipe.steps[i].t, label:stepLabel(i), step:i, recipeId:S.recipe.id}); }
const stepTimer = i => S.recipe ? S.timers.find(x=>x.recipeId===S.recipe.id && x.step===i) : null;
const findTimer = id => S.timers.find(x=>x.id===id);
function tickTimers(){
  const now = Date.now();
  for(const x of S.timers){
    if(!x.running) continue;
    x.left = Math.max(0, Math.ceil((x.endAt-now)/1000));
    if(x.left<=0){ x.running=false; x.done=true; onTimerDone(x); }
  }
  if(!S.timers.some(x=>x.running)){ clearInterval(timerIv); timerIv=null; }
  renderTimers();
}
function onTimerDone(x){
  beep(); try{ navigator.vibrate && navigator.vibrate([400,200,400,200,400]); }catch(e){}
  saveTimers();
  if(!NATIVE.isNative && document.hidden && "Notification" in window && Notification.permission==="granted"){ try{ new Notification("CookMate AI", {body: x.label+" · "+t("timerDone")}); }catch(e){} }
  reply("timerDone", x.label).then(m=>{
    botSay(m, {speakIt:true});
    if(S.playing && S.auto && S.recipe && x.recipeId===S.recipe.id && x.step===S.step) setTimeout(()=>{ if(S.playing) nextStep(); }, 2500);
  });
}
function pauseTimer(id){ const x=findTimer(id); if(x && x.running){ x.running=false; x.left=Math.max(0,Math.ceil((x.endAt-Date.now())/1000)); NATIVE.cancelAlarm(x.nid); saveTimers(); renderTimers(); } }
function resumeTimer(id){ const x=findTimer(id); if(x && !x.running && x.left>0){ x.running=true; x.endAt=Date.now()+x.left*1000; NATIVE.scheduleAlarm(x.nid, x.endAt, "CookMate AI", x.label+" · "+t("timerDone")); ensureTicker(); saveTimers(); renderTimers(); } }
function restartTimer(id){ const x=findTimer(id); if(x){ x.done=false; x.left=x.total; x.running=false; resumeTimer(id); } }
function removeTimer(id){ const x=findTimer(id); if(x) NATIVE.cancelAlarm(x.nid); S.timers = S.timers.filter(y=>y.id!==id); saveTimers(); renderTimers(); }
function clearAllTimers(){ S.timers.forEach(x=>NATIVE.cancelAlarm(x.nid)); S.timers=[]; saveTimers(); renderTimers(); }
function beep(){
  try{
    const ac = new (window.AudioContext||window.webkitAudioContext)();
    [0,0.35,0.7,1.4,1.75,2.1].forEach(d=>{ const o=ac.createOscillator(), g=ac.createGain(); o.frequency.value=880; o.connect(g); g.connect(ac.destination);
      g.gain.setValueAtTime(0.0001, ac.currentTime+d); g.gain.exponentialRampToValueAtTime(0.3, ac.currentTime+d+0.02); g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime+d+0.28);
      o.start(ac.currentTime+d); o.stop(ac.currentTime+d+0.3); });
  }catch(e){}
}
function timerChip(x, big=false){
  const state = x.done ? "done" : x.running ? "running" : "paused";
  const pct = x.total ? Math.min(100, (1 - x.left/x.total)*100) : 0;
  return `<div class="tchip ${state} ${big?"big":""}" role="timer" aria-label="${esc(x.label)}">
    <span class="tring" style="--p:${pct.toFixed(1)}"><svg class="icon"><use href="#i-clock"/></svg></span>
    <span class="tinfo"><span class="tlabel">${esc(x.label)}</span><span class="mono ttime">${x.done ? esc(t("timerDone")) : clock(x.left)}</span></span>
    ${x.done ? `<button class="tbtn" data-tact="restart" data-timer="${x.id}" aria-label="${esc(t("reset"))}"><svg class="icon"><use href="#i-repeat"/></svg></button>`
             : `<button class="tbtn" data-tact="${x.running?"pause":"resume"}" data-timer="${x.id}" aria-label="${esc(x.running?t("pause"):t("resume"))}"><svg class="icon"><use href="#${x.running?"i-pause":"i-play"}"/></svg></button>`}
    <button class="tbtn x" data-tact="remove" data-timer="${x.id}" aria-label="${esc(t("dismiss"))}">×</button>
  </div>`;
}
function renderTimers(){
  const tray = $("#timer-tray");
  if(tray){
    // the current step's own timer is shown in the player, everything else in the tray
    const own = S.view==="kitchen" && S.recipe ? stepTimer(S.step) : null;
    const list = S.timers.filter(x=>x!==own);
    tray.hidden = !list.length;
    document.body.classList.toggle("has-timers", !!list.length);
    tray.innerHTML = list.length ? `<span class="tray-title">${esc(t("timers"))}</span>` + list.map(x=>timerChip(x)).join("") : "";
  }
  const slot = $("#timer-slot"); if(!slot || !S.recipe) return;
  const st = S.recipe.steps[S.step], x = stepTimer(S.step);
  if(x) slot.innerHTML = timerChip(x, true);
  else if(st.t) slot.innerHTML = `<button class="btn small" id="t-start"><svg class="icon" style="width:16px;height:16px"><use href="#i-clock"/></svg>${esc(t("startTimer"))} · ${fmtDur(st.t)}</button>`;
  else slot.innerHTML = "";
}

/* =====================================================================
   RENDERING: gallery + recipe
   ===================================================================== */
function renderExamples(){
  const box = $("#examples"); if(!box) return;
  box.innerHTML = ["ex1","ex2","ex3","ex4","ex5","ex6"].map(k=>`<button type="button" data-ex="${esc(t(k))}">${esc(t(k))}</button>`).join("");
}
function renderStage(){
  if(!S.user) return;
  if(S.recipe) renderRecipe(); else renderGallery();
  renderTimers();
}
const CHIPS = [["fav","fFav"],["veg","fVeg"],["vegan","fVegan"],["jain","fJain"],["gf","fGF"],["quick","fQuick"],["breakfast","fBreakfast"],["sweet","fSweet"]];
function tagOk(r, tag){
  const i = rInfo(r);
  switch(tag){
    case "fav": return S.favs.has(r.id);
    case "veg": return i.diet==="veg";
    case "vegan": return i.vegan;
    case "jain": return i.jain;
    case "gf": return i.gf;
    case "nonveg": return i.meat;
    case "quick": return r.time<=20 || (r.tags||[]).includes("quick");
    case "snack": return ["snack","street","starter"].some(x=>(r.tags||[]).includes(x));
    default: return (r.tags||[]).includes(tag);
  }
}
function applyDietDefault(force){
  const d = prefs().diet, map = {veg:"veg", vegan:"vegan", jain:"jain"};
  if(force) ["veg","vegan","jain"].forEach(k=>S.f.chips.delete(k));
  if(map[d]) S.f.chips.add(map[d]);
}
function searchHit(r, q){
  if(!q) return true;
  const hay = [L(r.title), ...Object.values(r.title), ...(r.alias||[]), ...r.ing.flatMap(([k])=>ING[k]?[ING[k].en, ING[k].hi, L(ING[k])]:[])].join(" ").toLowerCase();
  return q.toLowerCase().split(/\s+/).filter(Boolean).every(w=>hay.includes(w));
}
const filtered = () => RECIPES.filter(r => (S.f.region==="all" || r.region===S.f.region) && [...S.f.chips].every(c=>tagOk(r,c)) && searchHit(r, S.f.q));

async function renderGallery(){
  if(!CONTENT.includes(S.lang)){
    const need = RECIPES.flatMap(r=>[r.title[S.lang] ? null : r.title.en, r.desc.en]).filter(s=>s && !(MT[S.lang]&&MT[S.lang][s]));
    if(need.length && !renderGallery._busy){ renderGallery._busy = true; mtMany(need, S.lang).then(()=>{ renderGallery._busy=false; if(!S.recipe) renderResults(); }); }
  }
  const counts = {}; RECIPES.forEach(r=>counts[r.region]=(counts[r.region]||0)+1);
  $("#stage-inner").innerHTML = `
    <div class="stage-head">
      <div><div class="eyebrow">${esc(new Date().toLocaleDateString(LANGS[S.lang].speech,{weekday:"long", day:"numeric", month:"long"}))}</div>
      <h2>${esc(t("recipesTitle"))}</h2><p class="muted" style="margin:.3rem 0 0">${esc(t("recipesSub"))}</p></div>
    </div>
    <div class="toolbar">
      <label class="searchbox"><svg class="icon"><use href="#i-search"/></svg><input id="g-search" type="search" autocomplete="off" placeholder="${esc(t("searchPh"))}" value="${esc(S.f.q)}" aria-label="${esc(t("searchPh"))}"></label>
      <div class="chiprow" role="toolbar" aria-label="Regions">
        <button class="filter" data-region="all" aria-pressed="${S.f.region==="all"}">${esc(t("regionAll"))} <span class="cnt">${RECIPES.length}</span></button>
        ${REGIONS.map(g=>`<button class="filter" data-region="${g.id}" aria-pressed="${S.f.region===g.id}">${esc(regionName(g.id))} <span class="cnt">${counts[g.id]||0}</span></button>`).join("")}
      </div>
      <div class="chiprow" role="toolbar" aria-label="Filters">
        ${CHIPS.map(([k,l])=>`<button class="filter chip-f ${k==="fav"?"fav-f":""}" data-chip="${k}" aria-pressed="${S.f.chips.has(k)}">${k==="fav"?`<svg class="icon"><use href="#i-heart"/></svg>`:""}${esc(t(l))}</button>`).join("")}
      </div>
    </div>
    <div id="g-results"></div>`;
  renderResults();
}
function cardHTML(r){
  const i = rInfo(r), hits = allergyHits(r), fav = S.favs.has(r.id);
  const dietCls = i.diet==="nonveg" ? "nonveg" : i.diet==="egg" ? "egg" : "";
  const dietTitle = i.diet==="nonveg" ? t("nonveg") : i.diet==="egg" ? t("egg") : t("veg");
  return `<article class="card" data-recipe="${r.id}" tabindex="0" role="button" aria-label="${esc(L(r.title))}">
    <div class="card-art" style="background:${r.hue};background:linear-gradient(135deg, ${r.hue}, color-mix(in srgb, ${r.hue} 45%, #120e0b))">
      <svg><use href="#art-${r.art}"/></svg>
      <span class="tag">${esc(L(r.level))}</span>
      <button class="heart" data-fav="${r.id}" aria-pressed="${fav}" aria-label="${esc(fav?t("unsaveFav"):t("saveFav"))}"><svg><use href="#i-heart"/></svg></button>
    </div>
    <div class="card-body">
      <h3>${esc(L(r.title))}</h3>
      <div class="meta">
        <span><span class="veg-dot ${dietCls}" title="${esc(dietTitle)}"></span></span>
        <span><svg><use href="#i-clock"/></svg>${r.time} ${esc(t("mins"))}</span>
        <span><svg><use href="#i-users"/></svg>${r.serves}</span>
        <span><svg><use href="#i-flame"/></svg>${fmtInt(i.nut.perKcal)} ${esc(t("kcal"))}</span>
      </div>
      <p class="muted desc">${esc(L(r.desc))}</p>
      ${hits.length ? `<p class="warn-line"><svg class="icon"><use href="#i-alert"/></svg>${esc(t("contains"))}: ${esc(hits.map(a=>t("al_"+a)).join(", "))}</p>` : ""}
    </div>
  </article>`;
}
function renderResults(){
  const box = $("#g-results"); if(!box) return;
  const list = filtered();
  if(!list.length){ box.innerHTML = `<p class="empty">${esc(t("noResults"))}</p>`; return; }
  const grouped = S.f.region==="all" && !S.f.q;
  if(grouped){
    box.innerHTML = REGIONS.map(g=>{
      const items = list.filter(r=>r.region===g.id); if(!items.length) return "";
      return `<section class="region"><h3 class="region-h">${esc(regionName(g.id))} <span class="muted">${items.length}</span></h3><div class="grid">${items.map(cardHTML).join("")}</div></section>`;
    }).join("");
  }else{
    box.innerHTML = `<p class="muted count">${list.length} ${esc(t("recipesWord"))}</p><div class="grid">${list.map(cardHTML).join("")}</div>`;
  }
}

async function openRecipe(id, servings, startStep=0){
  const r = RECIPES.find(x=>x.id===id); if(!r) return;
  stopAll();
  S.recipe = r; S.step = Math.min(startStep, r.steps.length-1); S.swapped = {}; S.servings = servings || r.serves;
  showView("kitchen");
  logEvent({k:"open", id:r.id, lang:S.lang}); saveProgress();
  // hands-free: switch the microphone on automatically once a recipe is open
  if(rec && !S.listening && !S.micDenied) setListening(true);
  keepAwake(true);
  renderStage();
  $("#stage").scrollTop = 0; window.scrollTo(0,0);
  if(needsTranslation(r, S.lang)){ await translateCurrent(); }
  let msg = await reply("loaded", L(r.title), S.servings, r.time);
  const hits = allergyHits(r);
  if(hits.length) msg = (await reply("allergy", hits.map(a=>t("al_"+a)).join(", "))) + " " + msg;
  if(S.listening && !S.voiceIntro){ S.voiceIntro = true; msg += " " + await reply(wakeOn() ? "voiceReadyWake" : "voiceReady"); }
  botSay(msg);
}
async function translateCurrent(){
  const r = S.recipe, lang = S.lang;
  await ensureRecipe(r, lang);
  if(S.recipe===r && S.lang===lang){ renderStage(); if(mtFailed[lang]) toast(t("mtFail")); }
}
function closeRecipe(){ stopAll(); S.recipe=null; keepAwake(false); renderStage(); }

function nutritionHTML(r){
  const n = rInfo(r).nut, k = S.servings / r.serves;
  return `<div class="nutri" aria-label="${esc(t("nutrition"))}">
    <span class="eyebrow">${esc(t("nutrition"))}</span>
    <span><b class="mono">${fmtInt(n.perKcal)}</b> ${esc(t("kcal"))} · <b class="mono">${fmtInt(n.perP)} g</b> ${esc(t("protein"))} <span class="muted">${esc(t("perServing"))}</span></span>
    <span class="muted">${esc(t("totalFor"))} ${S.servings} ${esc(t("people"))}: <b class="mono">${fmtInt(n.kcal*k)}</b> ${esc(t("kcal"))} · <b class="mono">${fmtInt(n.p*k)} g</b> ${esc(t("protein"))}</span>
  </div>`;
}
function badgesHTML(r){
  const i = rInfo(r), b = [];
  b.push(`<span class="badge ${i.diet}"><span class="veg-dot ${i.diet==="nonveg"?"nonveg":i.diet==="egg"?"egg":""}"></span>${esc(i.diet==="nonveg"?t("nonveg"):i.diet==="egg"?t("egg"):t("veg"))}</span>`);
  if(i.vegan) b.push(`<span class="badge">${esc(t("fVegan"))}</span>`);
  if(i.jain) b.push(`<span class="badge">${esc(t("fJain"))}</span>`);
  if(i.gf) b.push(`<span class="badge">${esc(t("fGF"))}</span>`);
  b.push(`<span class="badge region-b">${esc(regionName(r.region))}</span>`);
  return `<div class="badges">${b.join("")}</div>`;
}
function renderRecipe(){
  const r = S.recipe;
  const pending = needsTranslation(r, S.lang);
  const hits = allergyHits(r), bad = new Set(allergenIngs(r, hits));
  const fav = S.favs.has(r.id);
  $("#stage-inner").innerHTML = `
    <button class="back-link" id="to-gallery"><svg class="icon" style="width:18px;height:18px"><use href="#i-back"/></svg>${esc(t("allRecipes"))}</button>
    <div class="recipe-hero">
      <div style="min-width:0">
        <div class="eyebrow">${esc(L(r.level))} · ${r.time} ${esc(t("mins"))} ${pending?`<span class="translating" style="margin-left:.6rem"><span class="spinner"></span>${esc(t("translating"))}</span>`:""}</div>
        <h2>${esc(L(r.title))} <button class="heart inline" data-fav="${r.id}" aria-pressed="${fav}" aria-label="${esc(fav?t("unsaveFav"):t("saveFav"))}"><svg><use href="#i-heart"/></svg></button></h2>
        <p class="desc">${esc(L(r.desc))}</p>
        ${badgesHTML(r)}
      </div>
      <div class="servings" aria-label="${esc(t("serves"))}">
        <button id="srv-minus" aria-label="Fewer servings">−</button>
        <b class="mono">${S.servings} <span style="font-family:var(--font-body);font-weight:500">${esc(t("people"))}</span></b>
        <button id="srv-plus" aria-label="More servings">+</button>
      </div>
    </div>
    ${hits.length ? `<div class="allergy-banner" role="alert"><svg class="icon"><use href="#i-alert"/></svg><div><b>${esc(t("allergyBanner"))}</b> ${esc(hits.map(a=>t("al_"+a)).join(", "))} (${esc([...bad].map(k=>L(ING[k])).join(", "))}). <span class="muted">${esc(t("swapHint"))}</span></div></div>` : ""}
    ${nutritionHTML(r)}
    <div class="recipe-layout">
      <section class="panel">
        <h3>${esc(t("ingredients"))} <span class="muted mono" style="font-size:.8rem;font-weight:500">${r.ing.length}</span></h3>
        <ul class="ing-list">${r.ing.map(i=>{
          const [k,,,ov] = i, sw = S.swapped[k], onList = S.shop.some(x=>x.ing===k && !x.done);
          if(!ING[k]) return "";
          return `<li class="ing ${sw?"swapped":""} ${bad.has(k)?"allergen":""}">
            <span class="qty">${esc(fmtQty(i))}</span>
            <span class="name">${bad.has(k)?`<svg class="icon warn-i"><use href="#i-alert"/></svg>`:""}${esc(L(ING[k]))}</span>
            <button class="swap" data-swap="${k}">${sw?"✓":esc(t("dontHave"))}</button>
            ${sw?`<span class="alt">${esc(t("useInstead"))} ${esc(L(ov||ING[k].sub))}
              <button class="mini-add" data-addlist="${k}" ${onList?"disabled":""}>${onList?"✓ "+esc(t("listTitle")):"+ "+esc(t("addToList"))}</button></span>`:""}
          </li>`;}).join("")}</ul>
        <button class="btn small ghost add-all" data-addall="${r.id}"><svg class="icon"><use href="#i-cart"/></svg>${esc(t("addAllToList"))}</button>
      </section>
      <section style="display:grid;gap:1.2rem;min-width:0">
        <div class="panel now" id="now"></div>
        <div class="panel">
          <h3>${esc(t("steps"))}</h3>
          <ol class="steps" id="steps"></ol>
          <div class="tip"><b>${esc(t("tip"))}</b><span>${esc(L(r.tip))}</span></div>
        </div>
      </section>
    </div>`;
  renderPlayer(false);
}
function renderPlayer(speaking){
  const r = S.recipe; const now = $("#now"); if(!r || !now) return;
  const n = r.steps.length, i = S.step;
  now.innerHTML = `
    <div class="now-top">
      <span class="step-count">${esc(t("step"))} ${i+1} ${esc(t("of"))} ${n}</span>
      <span id="timer-slot"></span>
    </div>
    <div class="now-text ${speaking?"speaking":""}">${esc(stepText(i))}</div>
    <div class="progress">${r.steps.map((_,k)=>`<button data-goto="${k}" class="${k<i?"done":k===i?"current":""}" aria-label="${esc(t("step"))} ${k+1}"></button>`).join("")}</div>
    <div class="voice-hud" id="hud"></div>
    <div class="controls">
      <div class="ctrl-wrap"><button class="ctrl" id="c-prev" ${i===0?"disabled":""} aria-label="${esc(t("back"))}"><svg><use href="#i-prev"/></svg></button><span class="ctrl-label">${esc(t("back"))}</span></div>
      <div class="ctrl-wrap"><button class="ctrl" id="c-repeat" aria-label="${esc(t("repeat"))}"><svg><use href="#i-repeat"/></svg></button><span class="ctrl-label">${esc(t("repeat"))}</span></div>
      <div class="ctrl-wrap"><button class="ctrl play" id="c-play" aria-label="${esc(S.playing?t("pause"):t("play"))}"><svg><use href="#${S.playing?"i-pause":"i-play"}"/></svg></button><span class="ctrl-label">${esc(S.playing?t("pause"):t("play"))}</span></div>
      <div class="ctrl-wrap"><button class="ctrl" id="c-next" aria-label="${esc(t("next"))}"><svg><use href="#i-next"/></svg></button><span class="ctrl-label">${esc(t("next"))}</span></div>
    </div>
    <div class="sub-controls">
      <label><button class="switch" id="auto" role="switch" aria-checked="${S.auto}" aria-label="${esc(t("autoAdvance"))}"></button>${esc(t("autoAdvance"))}</label>
      <label for="rate">${esc(t("speed"))}
        <select class="input" id="rate" style="width:auto;padding:.25rem .5rem">${[0.8,1,1.2,1.4].map(v=>`<option value="${v}" ${v===S.rate?"selected":""}>${v}×</option>`).join("")}</select></label>
    </div>`;
  const ol = $("#steps");
  renderHud();
  ol.innerHTML = r.steps.map((s,k)=>`<li class="step ${k<i?"done":k===i?"current":""}" data-goto="${k}"><span class="n">${k<i?"✓":k+1}</span><span>${esc(L(s))}${s.t?` <span class="mono" style="color:var(--herb);font-size:.82rem;white-space:nowrap">· ${fmtDur(s.t)}</span>`:""}</span></li>`).join("");
  renderTimers();
}

/* voice HUD + "heard" feedback on the step player */
const HUD_CMDS = [["next","sNext"],["prev","sBack"],["pause","sPause"],["play","sPlay"],["repeat","sRepeat"],["ingredients","sIng"],["timerStart","sTimer"],["qty","sHowMuch"]];
function renderHud(){
  const hud = $("#hud"); if(!hud) return;
  const on = S.listening, w = wakeOn();
  hud.className = "voice-hud" + (on ? "" : " off");
  hud.innerHTML = `<span class="state"><span class="dot"></span>${esc(on?t("voiceCtrlOn"):t("voiceCtrlOff"))}</span>`
    + (on ? `<span class="muted">${esc(w ? t("wakeHint")+":" : t("justSay"))}</span>` + HUD_CMDS.map(([c,k])=>`<button class="cmd-chip" data-cmd="${c}" data-ex="${esc(t(k))}">“${w?"CookMate, ":""}${esc(t(k))}”</button>`).join("")
          : `<button class="btn small primary" id="hud-on"><svg class="icon" style="width:16px;height:16px"><use href="#i-mic"/></svg>${esc(t("turnOnVoice"))}</button>`)
    + `<span class="heard-text" id="heard-text"></span>`;
}
function flashCmd(type, q){
  setTimeout(()=>{
    const map = {next:"#c-next", prev:"#c-prev", pause:"#c-play", play:"#c-play", repeat:"#c-repeat"};
    const els = [map[type] && $(map[type]), document.querySelector(`.cmd-chip[data-cmd="${type}"]`)].filter(Boolean);
    els.forEach(el=>el.classList.add("heard"));
    const ht = $("#heard-text"); if(ht && q) ht.textContent = `${t("heard")}: “${q}”`;
    setTimeout(()=>{ els.forEach(el=>el.classList.remove("heard")); }, 1300);
  }, 40);
}
