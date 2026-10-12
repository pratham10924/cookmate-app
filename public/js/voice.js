/* =====================================================================
   VOICE: text-to-speech, always-on recognition, wake word, command parser
   ===================================================================== */

/* ---------- Text to speech (phone voice in the app, Web Speech in browsers) ---------- */
let voices = [];
function loadVoices(){ try{ voices = speechSynthesis.getVoices(); }catch(e){} }
if("speechSynthesis" in window){ loadVoices(); speechSynthesis.onvoiceschanged = loadVoices; }
function pickVoice(code){
  const full = LANGS[code].speech.toLowerCase(), base = code.toLowerCase();
  return voices.find(v=>v.lang.toLowerCase()===full) || voices.find(v=>v.lang.toLowerCase().replace("_","-").startsWith(base+"-")) || voices.find(v=>v.lang.toLowerCase().startsWith(base)) || null;
}
let currentUtter = null;
function speak(text, onend){
  const canWeb = "speechSynthesis" in window;
  if((!NATIVE.tts && !canWeb) || !text){ onend && onend(); return; }
  // The microphone keeps running while CookMate speaks, so the cook can interrupt
  // with "pause", "next" or "back" at any moment (barge-in). Our own echo is filtered.
  const u = {};
  currentUtter = u;
  S.speakingNow = true; S.spoken = norm(text); setMicStatus();
  const finish = () => {
    if(currentUtter!==u) return;
    currentUtter = null; S.speakingNow = false; setMicStatus();
    if(S.listening && !S.recActive) setTimeout(startRec, 200);
    onend && onend();
  };
  if(NATIVE.tts){
    NATIVE.stopSpeaking();
    NATIVE.speak(text, LANGS[S.lang].speech, S.rate).then(finish, finish);
    return;
  }
  speechSynthesis.cancel();
  const w = new SpeechSynthesisUtterance(text);
  w.lang = LANGS[S.lang].speech; const v = pickVoice(S.lang); if(v) w.voice = v;
  w.rate = S.rate;
  w.onend = finish; w.onerror = finish;
  setTimeout(()=>speechSynthesis.speak(w), 60);
}
function stopSpeech(){
  currentUtter = null; S.speakingNow = false;
  NATIVE.stopSpeaking();
  try{ speechSynthesis.cancel(); }catch(e){}
  setMicStatus();
  if(S.listening && !S.recActive) setTimeout(startRec, 200);
}

/* ---------- Command vocabulary (en, hi, mr, gu, ta + Hinglish) ---------- */
const QUICK = {
  next:["next","next step","forward","skip","aage","agla","agla step","अगला","आगे","अगला स्टेप","आगे बढ़ो","अगला कदम","नेक्स्ट","पुढे","पुढची पायरी","पुढची","આગળ","આગળનું","પછીનું","அடுத்து","அடுத்த படி","அடுத்தது"],
  prev:["back","go back","previous","previous step","last step","pichhe","peeche","pichla","पीछे","पिछला","पिछला स्टेप","वापस","बैक","मागे","मागची","मागची पायरी","પાછળ","પાછલું","பின்","முந்தைய","முந்தைய படி"],
  pause:["pause","stop","wait","hold on","ruko","roko","रुको","रोको","ठहरो","रुक जाओ","पॉज़","पॉज","थांब","थांबा","थांबव","થોભો","રોકો","અટકો","நிறுத்து","நில்","காத்திரு"],
  play:["play","resume","continue","start","start cooking","chalao","shuru","चलाओ","शुरू","शुरू करो","जारी रखो","प्ले","चालू करो","सुरू कर","सुरू करा","चालू कर","ચાલુ કરો","શરૂ કરો","ચાલુ","தொடங்கு","தொடர்","ஆரம்பி"],
  repeat:["repeat","again","repeat that","say again","once more","dobara","phir se","दोबारा","फिर से","दोबारा बोलो","फिर से बोलो","रिपीट","पुन्हा","परत सांग","ફરીથી","ફરી બોલો","மீண்டும்","திரும்ப சொல்"]
};
const CONTROL = new Set(["next","prev","pause","play","repeat","goto","timerStop","timerStart","timerStatus","micoff"]);
const KW = {
  next:[...QUICK.next,"agle","अगले","पुढील"],
  prev:[...QUICK.prev,"मागील","અગાઉનું"],
  pause:[...QUICK.pause,"रुकें","बंद करो"],
  play:[...QUICK.play,"begin","चालू","जारी","शुरु"],
  repeat:[...QUICK.repeat,"दुबारा"],
  ingredients:["ingredients","ingredient","what do i need","samagri","सामग्री","क्या चाहिए","क्या क्या चाहिए","साहित्य","काय लागेल","શું જોઈએ","பொருட்கள்","என்ன தேவை"],
  home:["home","all recipes","show recipes","menu","recipe list","सभी रेसिपी","मेनू","होम","सर्व रेसिपी","બધી રેસીપી","எல்லா ரெசிபி"],
  help:["help","what can you do","commands","मदद","सहायता","मदत","મદદ","உதவி"],
  greet:["hello","hi","hey","namaste","नमस्ते","नमस्कार","हेलो","નમસ્તે","வணக்கம்"],
  sub:["don't have","dont have","do not have","haven't got","no","out of","ran out","missing","without","replace","substitute","alternative","alternate","instead of","swap","nahi hai","nahin hai","nahi he","नहीं है","नहीं हैं","नही है","के बिना","की जगह","बदले","विकल्प","खत्म","नहीं","नाही","नाहीये","ऐवजी","નથી","બદલે","இல்லை","பதில்"],
  have:["i have","i've got","i got","with","using","leftover","what can i make","what can i cook","mere paas","mere pas","मेरे पास","से क्या","क्या बना","माझ्याकडे","મારી પાસે","என்னிடம்"],
  want:["make","cook","recipe","prepare","how to","want","banao","banana","बनाओ","बनाना","बनाएं","बनाऊं","बनाऊँ","रेसिपी","बनाने","विधि","बनव","बनवा","बनवायचं","બનાવો","બનાવ","રેસીપી","બનાવવું","செய்","சமை","ரெசிபி","செய்முறை"],
  suggest:["suggest","recommend","ideas","idea","what should i","anything","सुझाव","कुछ बताओ","क्या बनाऊं","क्या बनाऊँ","काय बनवू","સૂચન","શું બનાવું","என்ன செய்யலாம்"],
  timer:["timer","टाइमर","alarm","टायमर","ટાઈમર","டைமர்"],
  timerStatus:["time left","how much time","how long left","how long is left","remaining","kitna time","कितना समय","कितना टाइम","किती वेळ","કેટલો સમય","எவ்வளவு நேரம்"],
  all:["all","every","सारे","सभी","सगळे","બધા","எல்லா"],
  stopWords:["stop","cancel","clear","remove","band","hatao","बंद","रोको","हटाओ","रद्द","थांबव","रद्द कर","બંધ","રદ","நிறுத்து","ரத்து"],
  fav:["favourite","favorite","save this recipe","save recipe","save this","add to favourites","पसंदीदा","सेव करो","आवडत्यांमध्ये","सेव्ह कर","મનપસંદ","સેવ કરો","பிடித்தவை","சேமி"],
  list:["shopping list","grocery list","my list","the list","buy list","शॉपिंग लिस्ट","लिस्ट में","खरेदीच्या यादीत","खरेदीची यादी","यादीत","ખરીદીની યાદી","યાદીમાં","வாங்கும் பட்டியல்","பட்டியலில்"],
  add:["add","put","buy","जोड़ो","जोड़ दो","डालो","डाल दो","लिख लो","जोड","टाक","जोडा","ઉમેરો","ઉમેર","લખો","சேர்","சேர்க்க"],
  read:["read","what's on","whats on","what is on","show","पढ़ो","बताओ","दिखाओ","वाच","सांग","વાંચો","બતાવો","படி","சொல்","காட்டு"]
};
// recipe browsing words → filters (tags, diets, regions)
const TAGS = [
  {tag:"breakfast", words:["breakfast","morning","nashta","नाश्ता","सुबह","न्याहारी","નાસ્તો","காலை உணவு","டிபன்"]},
  {tag:"quick", words:["quick","fast","easy","jaldi","जल्दी","झटपट","आसान","ઝટપટ","விரைவ"]},
  {tag:"sweet", words:["sweet","dessert","meetha","मीठा","मिठाई","गोड","મીઠાઈ","இனிப்பு"]},
  {tag:"dinner", words:["dinner","night","रात","डिनर","रात्री","રાત","இரவு"]},
  {tag:"lunch", words:["lunch","दोपहर","लंच","दुपार","બપોર","மதிய"]},
  {tag:"drink", words:["drink","beverage","पेय","પીણું","பானம்"]},
  {tag:"healthy", words:["healthy","protein","हेल्दी","सेहतमंद","आरोग्यदायी","હેલ્ધી","ஆரோக்கிய"]},
  {tag:"snack", words:["snack","snacks","chaat","starter","चाट","स्नैक","खाऊ","નાસ્તા","சிற்றுண்டி"]},
  {tag:"vegan", words:["vegan","वीगन","व्हीगन","વીગન","வீகன்"]},
  {tag:"jain", words:["jain","without onion","no onion","बिना प्याज","जैन","कांदा लसूण नसलेले","જૈન","ஜைன"]},
  {tag:"gf", words:["gluten free","gluten-free","no gluten","ग्लूटेन फ्री","ગ્લૂટેન","குளூட்டன்"]},
  {tag:"nonveg", words:["non veg","non-veg","nonveg","chicken","fish","मांसाहारी","नॉन वेज","चिकन","मछली","માંસાહારી","அசைவ"]}
];
const REGION_WORDS = {
  north:["north indian","punjabi","उत्तर भारतीय","पंजाबी","ઉત્તર ભારતીય","வட இந்திய"],
  south:["south indian","kerala","tamil","chettinad","दक्षिण भारतीय","साउथ इंडियन","દક્ષિણ ભારતીય","தென்னிந்திய","கேரள"],
  west:["gujarati","maharashtrian","goan","mumbai","गुजराती","महाराष्ट्रीयन","गोवा","मुंबई","ગુજરાતી","மகாராஷ்டிர"],
  east:["bengali","bangali","north east","northeast","बंगाली","पूर्वोत्तर","બંગાળી","வங்காள"],
  street:["street food","street","ठेले","स्ट्रीट","સ્ટ્રીટ","தெரு உணவு"],
  global:["chinese","italian","continental","western","चाइनीज़","चायनीज","ચાઈનીઝ","சைனீஸ்"]
};
const WAKE = ["cookmate","cook mate","cook-mate","cookmet","cook met","kukmate","kook mate","cook made","hey cook","ok cook","कुकमेट","कुक मेट","कुकमैट","कुक-मेट","કુકમેટ","કુક મેટ","குக்மேட்","குக் மேட்"];

/* ---------- normalisation + helpers ---------- */
const DIGITS = {"०१२३४५६७८९":0,"૦૧૨૩૪૫૬૭૮૯":0,"௦௧௨௩௪௫௬௭௮௯":0,"০১২৩৪৫৬৭৮৯":0};
const NUMW = {one:1,two:2,three:3,four:4,five:5,six:6,seven:7,eight:8,nine:9,ten:10,fifteen:15,twenty:20,thirty:30,
  "एक":1,"दो":2,"तीन":3,"चार":4,"पांच":5,"पाँच":5,"छह":6,"सात":7,"आठ":8,"नौ":9,"दस":10,"पंद्रह":15,"बीस":20,
  "दोन":2,"पाच":5,"सहा":6,"नऊ":9,"दहा":10,"पंधरा":15,"वीस":20,
  "એક":1,"બે":2,"ત્રણ":3,"ચાર":4,"પાંચ":5,"છ":6,"સાત":7,"આઠ":8,"નવ":9,"દસ":10,"પંદર":15,"વીસ":20,
  "ஒன்று":1,"ஒரு":1,"இரண்டு":2,"மூன்று":3,"நான்கு":4,"ஐந்து":5,"ஆறு":6,"ஏழு":7,"எட்டு":8,"ஒன்பது":9,"பத்து":10,"பதினைந்து":15,"இருபது":20};
function norm(s){
  s = s.toLowerCase();
  for(const set of Object.keys(DIGITS)) s = s.replace(new RegExp("["+set+"]","g"), d=>set.indexOf(d));
  s = s.replace(/[’']/g,"'").replace(/[.,!?;:"“”()।]/g," ");
  for(const [w,n] of Object.entries(NUMW)) s = s.replace(new RegExp("(^|\\s)"+w+"(?=\\s|$)","g"), "$1"+n);
  return " "+s.replace(/\s+/g," ").trim()+" ";
}
function hasWord(text, w){
  if(/[a-z]/.test(w)) return new RegExp("(^|[^a-z'])"+w.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+"([^a-z]|$)").test(text);
  return text.includes(w);
}
const anyOf = (text, list) => list.some(w=>hasWord(text,w));
function matchAliases(text, entries){ // entries: [[alias,key]] → keys found (longest first, non-overlapping)
  let s = text; const found = [];
  entries.sort((a,b)=>b[0].length-a[0].length);
  for(const [a,k] of entries){
    if(a && hasWord(s, a)){ if(!found.includes(k)) found.push(k); s = s.split(a).join(" # "); }
  }
  return found;
}
const ING_ALIASES = () => Object.entries(ING).flatMap(([k,v])=>[...(v.alias||[]).map(a=>[a.toLowerCase(),k]), [v.en.toLowerCase(),k], [v.hi,k]]);
const RECIPE_ALIASES = () => RECIPES.flatMap(r=>[...(r.alias||[]).map(a=>[a.toLowerCase(),r.id]), ...Object.values(r.title).map(x=>[String(x).toLowerCase(),r.id])]);
function findIngredients(text){ return matchAliases(text, ING_ALIASES()); }
function findRecipe(text){
  const extra = (!CONTENT.includes(S.lang) && MT[S.lang]) ? RECIPES.map(r=>[ (MT[S.lang][r.title.en]||"").toLowerCase(), r.id]).filter(x=>x[0]) : [];
  const ids = matchAliases(text, [...RECIPE_ALIASES(), ...extra]);
  return ids.length ? RECIPES.find(r=>r.id===ids[0]) : null;
}
function getNumber(text, re){ const m = text.match(re); return m ? parseInt(m[1],10) : null; }

/* ---------- the parser ---------- */
const MIN_RE = /(\d+)\s*(minutes|minute|mins|min|मिनट|मिनिटां|मिनिटे|मिनिटं|मिनिट|મિનિટ|நிமிடம்|நிமிட|நிமி|seconds|second|secs|sec|सेकंड|सेकंद|સેકન્ડ|வினாடி)/;
const HR_RE = /(\d+)\s*(hours|hour|hr|घंटा|घंटे|तास|કલાક|மணி)/;
function timerLabelFrom(x){
  const ings = findIngredients(x);
  if(ings.length){
    const ing = ING[ings[0]];
    const said = [...(ing.alias||[]), ing.en.toLowerCase(), ing.hi].filter(a=>a && hasWord(x, a.toLowerCase())).sort((a,b)=>b.length-a.length)[0];
    return said ? said.charAt(0).toUpperCase()+said.slice(1) : L(ing);
  }
  const r = findRecipe(x); if(r) return L(r.title);
  const m = x.match(/\bfor (?:the |my )?([a-z][a-z ]{1,20}?)\s*$/); if(m && !/\d|minute|second|hour/.test(m[1])) return m[1].trim();
  return null;
}
function parse(raw){
  const x = norm(raw);
  const out = {};
  out.servings = getNumber(x, /(\d+)\s*(people|persons|person|servings|serving|log|logo|लोग|लोगों|लोगो|व्यक्ति|जन|जणांसाठी|जणांना|जण|લોકો|பேருக்கு|பேர்)/) || getNumber(x, /\bfor\s+(\d+)\b(?!\s*(min|sec|hour))/);
  out.gotoStep = getNumber(x, /(?:step|स्टेप|चरण|steps|पायरी|સ્ટેપ|படி)\s*(?:number|no|नंबर|क्रमांक)?\s*(\d+)/);

  // timers
  if(anyOf(x, KW.timerStatus) && (S.timers.length || anyOf(x, KW.timer))) return {type:"timerStatus"};
  const tm = x.match(MIN_RE), hr = x.match(HR_RE);
  if(anyOf(x, KW.timer) && (tm || hr)){
    let secs = 0;
    if(hr) secs += +hr[1]*3600;
    if(tm) secs += /sec|सेकंड|सेकंद|સેકન્ડ|வினாடி/.test(tm[2]) ? +tm[1] : +tm[1]*60;
    return {type:"timer", secs, label: timerLabelFrom(x)};
  }
  if(anyOf(x, KW.timer)){
    if(anyOf(x, KW.stopWords)) return {type:"timerStop", all: anyOf(x, KW.all), label: timerLabelFrom(x)};
    return {type:"timerStart"};
  }
  if(anyOf(x, ["stop listening","voice off","mic off","turn off voice","turn off mic","सुनना बंद","माइक बंद","वॉइस बंद","ऐकणं बंद","માઇક બંધ","மைக்கை நிறுத்து"])) return {type:"micoff"};
  if(anyOf(x, ["dashboard","my history","history","recent searches","डैशबोर्ड","इतिहास","ઇતિહાસ","வரலாறு"])) return {type:"dash"};

  const ings = findIngredients(x);
  // shopping list
  if(anyOf(x, KW.list)){
    if(ings.length && !anyOf(x, KW.read)) return {type:"listAdd", ings};
    if(!ings.length && anyOf(x, KW.add)){ const m = x.match(/\badd (.+?) to (?:my |the )?(?:shopping |grocery )?list/); if(m) return {type:"listAddText", text:m[1].trim()}; }
    return {type:"listShow"};
  }
  // favourites
  if(anyOf(x, KW.fav)) return {type:"fav", recipe: findRecipe(x)};

  if(anyOf(x, ["kitchen","किचन","रसोई","स्वयंपाकघर","રસોડું","சமையலறை"]) && !findRecipe(x)) return {type:"kitchen"};
  if(anyOf(x, ["how much","how many","quantity","kitna","kitni","kitne","कितना","कितनी","कितने","मात्रा","किती","કેટલું","કેટલા","எவ்வளவு"]) && ings.length) return {type:"qty", ings};
  if(anyOf(x, KW.sub) && ings.length) return {type:"sub", ings};
  if(anyOf(x, ["substitute","alternative","alternate","replace","विकल्प","की जगह","पर्याय","વિકલ્પ","மாற்று"]) && !ings.length) return {type:"subAsk"};

  const recipe = findRecipe(x);
  const haveIntent = anyOf(x, KW.have);
  if(haveIntent && ings.length >= 1 && !(recipe && anyOf(x, KW.want) && !/(i have|मेरे पास|mere paas|माझ्याकडे|મારી પાસે|என்னிடம்)/.test(x))) return {type:"have", ings};
  if(recipe) return {type:"recipe", recipe, servings: out.servings};

  if(out.gotoStep) return {type:"goto", n: out.gotoStep};
  if(out.servings && S.recipe) return {type:"servings", n: out.servings};
  if(anyOf(x, KW.ingredients)) return {type:"ingredients"};
  if(anyOf(x, KW.repeat)) return {type:"repeat"};
  if(anyOf(x, KW.prev)) return {type:"prev"};
  if(anyOf(x, KW.next)) return {type:"next"};
  if(anyOf(x, KW.pause)) return {type:"pause"};
  if(anyOf(x, KW.play)) return {type:"play"};
  if(anyOf(x, KW.home)) return {type:"home"};

  const tags = TAGS.filter(tg=>anyOf(x, tg.words)).map(tg=>tg.tag);
  const region = Object.keys(REGION_WORDS).find(k=>anyOf(x, REGION_WORDS[k])) || null;
  if(tags.length || region) return {type:"tags", tags, region};
  if(ings.length >= 2) return {type:"have", ings};
  if(anyOf(x, KW.suggest)) return {type:"tags", tags:[]};
  if(anyOf(x, KW.help)) return {type:"help"};
  if(anyOf(x, KW.want)) return {type:"notfound"};
  if(ings.length === 1 && anyOf(x, KW.sub)) return {type:"sub", ings};
  if(anyOf(x, KW.greet)) return {type:"hello"};
  return {type:"unknown"};
}

/* ---------- speech recognition: always-on, hands-free, optional wake word ---------- */
const SR_WEB = window.SpeechRecognition || window.webkitSpeechRecognition;
let rec = null, handled = new Set();
function quickControl(txt){
  const s = norm(txt).trim();
  if(!s || s.split(" ").length > 4) return null;
  for(const [type, list] of Object.entries(QUICK)) if(list.includes(s)) return type;
  return null;
}
function stripWake(txt){
  const s = norm(txt);
  for(const w of WAKE){
    const i = s.indexOf(" "+w);
    if(i >= 0) return {woke:true, rest: s.slice(i+w.length+1).replace(/^[\s,]+/,"").trim()};
  }
  return {woke:false, rest:txt};
}
const wakeOn = () => !!prefs().wake && S.handsfree;
function armWake(){
  S.armedUntil = Date.now() + 7000;
  chime();
  const el = $("#interim"); if(el) el.textContent = t("wakeArmed");
  setMicStatus();
  setTimeout(()=>{ if(S.armedUntil && Date.now()>=S.armedUntil){ S.armedUntil = 0; setMicStatus(); } }, 7100);
}
function isEcho(txt){ const s = norm(txt).trim(); return S.speakingNow && s.length > 1 && (S.spoken||"").includes(" "+s+" "); }
function processHeard(txt, quickType){
  if(S.speakingNow){
    // while speaking, only accept short control commands that are not an echo of our own voice
    const p = quickType ? {type:quickType} : parse(txt);
    if(!CONTROL.has(p.type) || isEcho(txt) || norm(txt).trim().split(" ").length > 5) return;
  }
  const el = $("#interim"); if(el) el.textContent = "";
  if(!S.handsfree){ S.listening = false; stopRec(); setMicStatus(); }
  handleInput(txt, true, quickType ? {type:quickType} : null);
}
// gate every recognised phrase through the wake word when it's switched on
function heardFinal(txt){
  if(!wakeOn()) return processHeard(txt, null);
  const {woke, rest} = stripWake(txt);
  if(woke){ if(rest) processHeard(rest, null); else armWake(); return; }
  if(S.armedUntil && Date.now() < S.armedUntil){ S.armedUntil = 0; setMicStatus(); return processHeard(txt, null); }
  const el = $("#interim"); if(el) el.textContent = t("wakeHint");
}
function heardInterim(txt){
  if(!S.recipe) return false;
  if(!wakeOn()){ const q = quickControl(txt); if(q){ processHeard(txt, q); return true; } return false; }
  const {woke, rest} = stripWake(txt);
  const armed = S.armedUntil && Date.now() < S.armedUntil;
  const q = woke ? (rest && quickControl(rest)) : armed ? quickControl(txt) : null;
  if(q){ S.armedUntil = 0; processHeard(woke ? rest : txt, q); return true; }
  return false;
}
function chime(){
  try{
    const ac = new (window.AudioContext||window.webkitAudioContext)();
    const o=ac.createOscillator(), g=ac.createGain(); o.frequency.value=1320; o.connect(g); g.connect(ac.destination);
    g.gain.setValueAtTime(0.0001, ac.currentTime); g.gain.exponentialRampToValueAtTime(0.15, ac.currentTime+0.02); g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime+0.18);
    o.start(); o.stop(ac.currentTime+0.2);
  }catch(e){}
}
function setupRecognizer(){
  rec = NATIVE.createRecognizer() || (SR_WEB ? new SR_WEB() : null);
  if(!rec) return;
  rec.interimResults = true; rec.maxAlternatives = 1;
  rec.onstart = ()=>{ S.recActive = true; handled = new Set(); setMicStatus(); };
  rec.onresult = (e)=>{
    let interim = "";
    for(let i=e.resultIndex;i<e.results.length;i++){
      if(handled.has(i)) continue;
      const r = e.results[i], txt = r[0].transcript.trim();
      if(!txt) continue;
      if(r.isFinal){ handled.add(i); heardFinal(txt); }
      else if(heardInterim(txt)) handled.add(i);
      else interim += txt+" ";
    }
    const el = $("#interim"); if(el && interim.trim() && !S.speakingNow) el.textContent = "“"+interim.trim()+"”";
  };
  rec.onerror = (e)=>{
    if(e.error==="not-allowed" || e.error==="service-not-allowed"){ S.listening=false; S.micDenied=true; showBanner(t("micDenied")); setMicStatus(); }
    else if(e.error==="network"){ S.listening=false; showBanner(t("netErr")); setMicStatus(); }
  };
  rec.onend = ()=>{ S.recActive = false; setMicStatus(); if(S.listening) setTimeout(startRec, NATIVE.isNative ? 120 : 250); };
}
function startRec(){
  if(!rec || S.recActive || !S.listening) return;
  rec.lang = LANGS[S.lang].speech; rec.continuous = S.handsfree;
  try{ const p = rec.start(); if(p && p.catch) p.catch(()=>{}); }catch(e){}
}
function stopRec(){ if(rec && S.recActive){ try{ rec.abort(); }catch(e){} } }
function setListening(on){
  if(!rec){ showBanner(t("noSR")); return false; }
  S.listening = on;
  if(on){ S.micDenied = false; hideBanner(); startRec(); } else { stopRec(); S.armedUntil = 0; const el=$("#interim"); if(el) el.textContent=""; }
  setMicStatus(); if(S.recipe) renderHud();
  return true;
}
function toggleMic(){ setListening(!S.listening); }
function setMicStatus(){
  const on = S.listening;
  const pill = $("#voice-pill");
  if(pill){ pill.classList.toggle("on", on); pill.setAttribute("aria-pressed", on); $("#voice-pill-text").textContent = on ? t("voiceOn") : t("voiceOffShort"); }
  const fab = $("#mic-fab"); if(fab){ fab.classList.toggle("listening", on); }
  const mic = $("#mic"); if(!mic) return;
  mic.classList.toggle("listening", on);
  mic.setAttribute("aria-label", on ? "Stop listening" : "Start listening");
  const armed = S.armedUntil && Date.now() < S.armedUntil;
  $("#mic-status").textContent = S.speakingNow ? t("speaking") : armed ? t("wakeArmed") : on ? (wakeOn() ? t("wakeHint") : t("listening")) : t("tapToSpeak");
}

/* keep the screen awake while cooking */
let wakeLock = null;
async function keepAwake(on){
  if(NATIVE.keepAwake(on)) return;
  try{
    if(on && "wakeLock" in navigator && !wakeLock){ wakeLock = await navigator.wakeLock.request("screen"); wakeLock.addEventListener("release", ()=>{ wakeLock=null; }); }
    if(!on && wakeLock){ await wakeLock.release(); wakeLock = null; }
  }catch(e){ wakeLock = null; }
}
document.addEventListener("visibilitychange", ()=>{ if(document.visibilityState==="visible" && S.recipe && S.view==="kitchen") keepAwake(true); });
function showBanner(m){ const b=$("#sr-banner"); b.textContent=m; b.hidden=false; }
function hideBanner(){ $("#sr-banner").hidden=true; }
