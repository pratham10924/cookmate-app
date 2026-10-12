/* =====================================================================
   NATIVE ADAPTERS (Capacitor). When CookMate runs as the Android / iOS app,
   these use the phone's own speech recogniser, voice, keep-awake and
   notifications. In a normal browser everything here is a no-op and the
   web APIs are used instead.
   ===================================================================== */
const NATIVE = (() => {
  const C = window.Capacitor;
  const isNative = !!(C && typeof C.isNativePlatform === "function" && C.isNativePlatform());
  const P = (isNative && C.Plugins) || {};
  const has = (n) => isNative && !!P[n];
  const platform = isNative && C.getPlatform ? C.getPlatform() : "web";

  /* Speech recognition: an object with the same shape as the Web Speech API
     recogniser (start/abort, onstart/onresult/onerror/onend), so the rest of
     the app doesn't care which one it is talking to. */
  function createRecognizer() {
    if (!has("SpeechRecognition")) return null;
    const SR = P.SpeechRecognition;
    const rec = { lang: "en-IN", continuous: true, interimResults: true, maxAlternatives: 1, onstart: null, onresult: null, onerror: null, onend: null };
    let active = false, last = "", ready = false, perm = null, silenceT = null, watchdogT = null, idx = 0;

    // every spoken phrase gets its own result slot, like the Web Speech API
    const emit = (txt, isFinal) => {
      const alt = [{ transcript: txt }]; alt.isFinal = isFinal;
      const results = new Array(idx + 1); results[idx] = alt;
      rec.onresult && rec.onresult({ resultIndex: idx, results });
      if (isFinal) idx++;
    };
    function finish() {
      clearTimeout(silenceT); clearTimeout(watchdogT);
      if (!active) return;
      active = false;
      if (last) emit(last, true);
      last = "";
      rec.onend && rec.onend();
    }
    async function setup() {
      if (perm === null) {
        try {
          let p = await SR.checkPermissions();
          if (p.speechRecognition !== "granted") p = await SR.requestPermissions();
          perm = p.speechRecognition === "granted";
        } catch (e) { perm = false; }
      }
      if (!ready && perm) {
        ready = true;
        await SR.addListener("partialResults", (d) => {
          const txt = (d && d.matches && d.matches[0]) || "";
          if (!active || !txt) return;
          last = txt; emit(txt, false);
          // iOS keeps listening until told to stop: treat 1.4 s of silence as the end of a phrase
          clearTimeout(silenceT);
          silenceT = setTimeout(() => { SR.stop().catch(() => {}); finish(); }, 1400);
        });
        await SR.addListener("listeningState", (d) => { if (d && d.status === "stopped") finish(); });
      }
      return perm;
    }
    rec.start = async () => {
      if (active) return;
      active = true; last = "";
      if (!(await setup())) {
        active = false;
        rec.onerror && rec.onerror({ error: "not-allowed" });
        rec.onend && rec.onend();
        return;
      }
      rec.onstart && rec.onstart();
      // restart the cycle if the recogniser goes quiet without telling us
      watchdogT = setTimeout(() => { SR.stop().catch(() => {}); finish(); }, 12000);
      try {
        await SR.start({ language: rec.lang, maxResults: 1, partialResults: true, popup: false });
      } catch (e) {
        // "No match" / timeouts end a listening cycle; the app restarts it while hands-free is on
        finish();
      }
    };
    rec.abort = rec.stop = () => { SR.stop().catch(() => {}); finish(); };
    return rec;
  }

  /* Text to speech */
  const tts = has("TextToSpeech");
  function speak(text, lang, rate) {
    return P.TextToSpeech.speak({ text, lang, rate: rate || 1, pitch: 1, volume: 1, category: "playback" });
  }
  function stopSpeaking() { if (tts) P.TextToSpeech.stop().catch(() => {}); }

  /* Keep the screen on while cooking */
  function keepAwake(on) {
    if (!has("KeepAwake")) return false;
    (on ? P.KeepAwake.keepAwake() : P.KeepAwake.allowSleep()).catch(() => {});
    return true;
  }

  /* Timer alarms that fire even when the phone is locked */
  let notifPerm = null;
  async function scheduleAlarm(id, at, title, body) {
    if (!has("LocalNotifications")) return false;
    try {
      if (notifPerm === null) {
        let p = await P.LocalNotifications.checkPermissions();
        if (p.display !== "granted") p = await P.LocalNotifications.requestPermissions();
        notifPerm = p.display === "granted";
      }
      if (!notifPerm) return false;
      await P.LocalNotifications.schedule({ notifications: [{ id, title, body, schedule: { at: new Date(at), allowWhileIdle: true } }] });
      return true;
    } catch (e) { return false; }
  }
  function cancelAlarm(id) { if (has("LocalNotifications")) P.LocalNotifications.cancel({ notifications: [{ id }] }).catch(() => {}); }

  /* Share sheet */
  async function share(title, text) {
    if (!has("Share")) return false;
    try { await P.Share.share({ title, text, dialogTitle: title }); return true; } catch (e) { return true; }
  }

  /* Android back button + status bar */
  function onBack(handler) { if (has("App")) P.App.addListener("backButton", handler); }
  function exitApp() { if (has("App")) P.App.minimizeApp ? P.App.minimizeApp().catch(() => P.App.exitApp()) : P.App.exitApp(); }
  if (has("StatusBar")) { P.StatusBar.setStyle({ style: "DARK" }).catch(() => {}); if (platform === "android") P.StatusBar.setBackgroundColor({ color: "#14110f" }).catch(() => {}); }

  return { isNative, platform, createRecognizer, tts, speak, stopSpeaking, keepAwake, scheduleAlarm, cancelAlarm, share, onBack, exitApp };
})();
