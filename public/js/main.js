/* =====================================================================
   APP START, EVENTS, BOOT
   ===================================================================== */
async function startApp(user){
  user.prefs = user.prefs || {};
  S.user = user; S.lang = user.lang || "en";
  loadH(); loadFavs(); loadShop(); loadTimers();
  S.lastUpdate = Date.now(); S.recipe = null;
  S.f = {region:"all", chips:new Set(), q:""}; applyDietDefault(false);
  pullHistory(); pullFavs(); pullShop();
  $("#auth").hidden = true; $("#app").hidden = false;
  showView("dash");
  $("#user-name").textContent = user.name; $("#avatar").textContent = (user.name||"G").trim()[0].toUpperCase();
  if(!rec) showBanner(t("noSR")); else hideBanner();
  applyI18n(); renderLangPills(); setMicStatus(); renderStage(); renderListBadge();
  $("#chat").innerHTML = "";
  if(!BUILTIN.includes(S.lang) || !CONTENT.includes(S.lang)){
    await ensureUI(S.lang); applyI18n(); renderLangPills(); renderStage(); setMicStatus(); if(S.view==="dash") renderDashboard();
  }
  const v = new URLSearchParams(location.search).get("view");   // home-screen shortcuts
  if(["kitchen","list"].includes(v)) showView(v);
  const w = await reply("welcome", user.name.split(" ")[0]);
  botSay(w, {chips: suggestable(RECIPES).slice(0,3), speakIt:false});
}

document.addEventListener("click", (e)=>{
  const el = e.target.closest("button, li[data-goto], .card[data-recipe]"); if(!el) return;
  const d = el.dataset;
  if(d.fav){ e.stopPropagation(); toggleFav(d.fav); return; }
  if(d.recipe){ openRecipe(d.recipe); return; }
  if(d.region){ S.f.region = d.region; renderGallery(); return; }
  if(d.chip){ S.f.chips.has(d.chip) ? S.f.chips.delete(d.chip) : S.f.chips.add(d.chip); el.setAttribute("aria-pressed", S.f.chips.has(d.chip)); renderResults(); return; }
  if(d.lang){ if(d.lang!==S.lang) setLang(d.lang); return; }
  if(d.view){ showView(d.view); return; }
  if(d.ex){ if(S.view!=="kitchen") showView("kitchen"); handleInput(d.ex); return; }
  if(d.resume){ openRecipe(d.resume, null, H.progress ? H.progress.step : 0); return; }
  if(d.goto!==undefined){ goTo(+d.goto); return; }
  if(d.swap){ const k=d.swap; if(S.swapped[k]){ delete S.swapped[k]; renderStage(); } else act({type:"sub", ings:[k]}); return; }
  if(d.addlist){ const r=S.recipe, e2 = r && r.ing.find(i=>i[0]===d.addlist); addToList(d.addlist, e2 ? fmtQty(e2) : "", r && e2 ? r.id : null); el.disabled = true; return; }
  if(d.addall){ addAllToList(d.addall); return; }
  if(d.tact){ ({pause:pauseTimer, resume:resumeTimer, restart:restartTimer, remove:removeTimer})[d.tact](d.timer); return; }
  if(d.shopdel){ S.shop = S.shop.filter(x=>x.id!==d.shopdel); saveShop(); return; }
  if(d.close){ closeModal(d.close); return; }
  switch(el.id){
    case "tab-login": setAuthMode("login"); break;
    case "tab-signup": setAuthMode("signup"); break;
    case "guest-btn": guestLogin(); break;
    case "logout": case "logout2": logout(); break;
    case "add-lang": case "set-langs": openLangModal(); break;
    case "lm-save": saveLangModal(); break;
    case "avatar-btn": case "nav-profile": openSettings(); break;
    case "settings-save": saveSettings(); break;
    case "set-wake": el.setAttribute("aria-checked", el.getAttribute("aria-checked")!=="true"); break;
    case "install-btn": promptInstall(); break;
    case "mic": case "voice-pill": case "mic-fab": if(el.id==="mic-fab" && S.view!=="kitchen") showView("kitchen"); toggleMic(); break;
    case "hud-on": setListening(true); break;
    case "dash-start": showView("kitchen"); setListening(true); break;
    case "clear-hist": if(S.clearArm){ H = {events:[], stats:{voice:0}, progress:null}; saveH(); S.clearArm=false; onHistoryChange("clear"); } else { S.clearArm=true; renderDashboard(); setTimeout(()=>{ if(S.clearArm){ S.clearArm=false; if(S.view==="dash") renderDashboard(); } }, 4000); } break;
    case "handsfree": S.handsfree = !S.handsfree; el.setAttribute("aria-checked", S.handsfree); if(S.recActive){ stopRec(); } setMicStatus(); break;
    case "to-gallery": closeRecipe(); break;
    case "srv-minus": if(S.servings>1){ S.servings--; renderStage(); } break;
    case "srv-plus": if(S.servings<20){ S.servings++; renderStage(); } break;
    case "c-play": S.playing ? pausePlayer(false) : playPlayer(); break;
    case "c-next": nextStep(); break;
    case "c-prev": prevStep(); break;
    case "c-repeat": playStep(); break;
    case "auto": S.auto = !S.auto; el.setAttribute("aria-checked", S.auto); if(S.auto && S.playing && !S.speakingNow && !S.recipe.steps[S.step].t) scheduleAutoNext(); break;
    case "t-start": { const x = startStepTimer(S.step); reply("timerSet", fmtDur(x.total), x.label).then(m=>addMsg("bot", esc(m))); break; }
    case "server-btn": $("#server-input").value = store.get("cv_server","") || ""; openModal("server-modal"); break;
    case "server-save": {
      const v = $("#server-input").value.trim();
      if(v && !/^https?:\/\/\S+$/i.test(v)){ toast("http(s)://…"); break; }
      if(v) store.set("cv_server", v); else store.del("cv_server");
      closeModal("server-modal");
      initBackend().then(()=>{ $("#offline-note").hidden = API.online; toast(API.online ? t("live") : t("offlineMode")); });
      break;
    }
    case "share-wa": shareList(true); break;
    case "share-list": shareList(false); break;
    case "clear-bought": S.shop = S.shop.filter(x=>!x.done); saveShop(); break;
  }
});
document.addEventListener("change", (e)=>{
  const el = e.target;
  if(el.id==="rate") S.rate = parseFloat(el.value);
  if(el.id==="f-lang"){ const v=el.value; S.lang = BUILTIN.includes(v)?v:"en"; applyI18n(); setAuthMode(S.authMode); }
  if(el.dataset.shopcheck){ const x = S.shop.find(y=>y.id===el.dataset.shopcheck); if(x){ x.done = el.checked; saveShop(); } }
});
document.addEventListener("input", (e)=>{ if(e.target.id==="g-search"){ S.f.q = e.target.value; renderResults(); } });
document.addEventListener("submit", (e)=>{
  if(e.target.id==="add-item-form"){ e.preventDefault(); const v=$("#add-item").value.trim(); if(!v) return;
    const ing = findIngredients(norm(v)); const exact = ing.length===1 && norm(v).trim().length <= (ING[ing[0]].en.length+12);
    addToList(exact ? ing[0] : null, "", null, v); setTimeout(()=>{ const i=$("#add-item"); i && i.focus(); }, 0); }
});
$("#auth-form").addEventListener("submit", onAuthSubmit);
$("#cmd-form").addEventListener("submit", (e)=>{ e.preventDefault(); const v=$("#cmd").value.trim(); if(!v) return; $("#cmd").value=""; handleInput(v); });
$$(".modal-bg").forEach(m=>m.addEventListener("click", (e)=>{ if(e.target===m) m.hidden = true; }));
document.addEventListener("keydown", (e)=>{
  if(e.key==="Escape"){ $$(".modal-bg").forEach(m=>m.hidden=true); return; }
  if((e.key==="Enter" || e.key===" ") && e.target.matches && e.target.matches(".card[data-recipe]")){ e.preventDefault(); openRecipe(e.target.dataset.recipe); return; }
  if($("#app").hidden || /INPUT|SELECT|TEXTAREA/.test(document.activeElement.tagName)) return;
  if(e.code==="Space" && S.recipe && !document.activeElement.closest("button,.card")){ e.preventDefault(); S.playing ? pausePlayer(false) : playPlayer(); }
  else if(e.key==="ArrowRight" && S.recipe) nextStep();
  else if(e.key==="ArrowLeft" && S.recipe) prevStep();
  else if(e.key.toLowerCase()==="m") toggleMic();
});

// Android back button in the phone app: close dialogs → close recipe → go home → leave
NATIVE.onBack(()=>{
  const open = $$(".modal-bg").find(m=>!m.hidden);
  if(open){ open.hidden = true; return; }
  if(!S.user) return NATIVE.exitApp();
  if(S.recipe && S.view==="kitchen"){ closeRecipe(); return; }
  if(S.view!=="dash"){ showView("dash"); return; }
  NATIVE.exitApp();
});

/* boot */
(async function boot(){
  document.body.classList.toggle("native", NATIVE.isNative);
  fillLangSelect($("#f-lang"), "en");
  setupRecognizer();
  await initBackend();
  const sess = store.get("cv_session", null);
  if(sess==="api"){
    const cachedUser = store.get("cv_api_user", null);
    if(API.online && API.token){
      try{ const r = await api("/auth/me"); store.set("cv_api_user", r.user); startApp(r.user); return; }
      catch(e){ if(e.status===401){ setToken(null); store.del("cv_session"); store.del("cv_api_user"); showAuth(); return; } }
    }
    if(cachedUser){ startApp(cachedUser); return; }   // offline: keep using the app with the last known profile
    showAuth(); return;
  }
  if(sess==="guest"){ const g=store.get("cv_guest",null); if(g){ startApp(g); return; } }
  else if(sess){ const u=store.get("cv_users",{})[sess]; if(u){ startApp(u); return; } }
  showAuth();
})();

/* offline support + install as an app (browsers only; the native app bundles everything) */
if("serviceWorker" in navigator && !NATIVE.isNative && location.protocol.startsWith("http")){
  window.addEventListener("load", ()=>navigator.serviceWorker.register("sw.js").catch(()=>{}));
}
