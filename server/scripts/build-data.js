// Builds data/seed.json (database seed) and ../public/js/data.js (offline copy bundled with the app)
// from data/src/*. Run:  npm run build:data
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const SRC = path.join(__dirname, "..", "data", "src");
const base = JSON.parse(fs.readFileSync(path.join(SRC, "base.json"), "utf8"));
const { EXTRA, META, DEFAULT_W } = require(path.join(SRC, "ingredients.js"));
const REGION_FILES = ["north", "south", "west", "east", "street", "global"];

const REGIONS = [
  { id: "north",  en: "North India",          hi: "उत्तर भारत",           mr: "उत्तर भारत",            gu: "ઉત્તર ભારત",            ta: "வட இந்தியா" },
  { id: "south",  en: "South India",          hi: "दक्षिण भारत",          mr: "दक्षिण भारत",           gu: "દક્ષિણ ભારત",            ta: "தென்னிந்தியா" },
  { id: "west",   en: "West India",           hi: "पश्चिम भारत",          mr: "पश्चिम भारत",           gu: "પશ્ચિમ ભારત",            ta: "மேற்கு இந்தியா" },
  { id: "east",   en: "East & North-East",    hi: "पूर्व और पूर्वोत्तर",   mr: "पूर्व व ईशान्य भारत",     gu: "પૂર્વ અને ઈશાન ભારત",     ta: "கிழக்கு & வடகிழக்கு" },
  { id: "street", en: "Street food & snacks", hi: "स्ट्रीट फ़ूड और नाश्ते", mr: "स्ट्रीट फूड व खाऊ",       gu: "સ્ટ્રીટ ફૂડ અને નાસ્તા",   ta: "தெரு உணவு & சிற்றுண்டி" },
  { id: "global", en: "Global favourites",    hi: "दुनिया भर से",          mr: "जगभरातील आवडते",        gu: "વિશ્વભરની વાનગીઓ",        ta: "உலக உணவுகள்" },
];

// Region + Marathi/Gujarati/Tamil titles for the original 9 recipes
const ORIGINAL = {
  "paneer-butter-masala": ["north", "पनीर बटर मसाला", "પનીર બટર મસાલા", "பனீர் பட்டர் மசாலா"],
  "masala-chai":          ["north", "मसाला चहा", "મસાલા ચા", "மசாலா டீ"],
  "veg-pulao":            ["north", "व्हेज पुलाव", "વેજ પુલાવ", "வெஜ் புலாவ்"],
  "dal-tadka":            ["north", "डाळ तडका", "દાળ તડકા", "தால் தட்கா"],
  "kanda-poha":           ["west", "कांदे पोहे", "કાંદા પૌંઆ", "கண்டா போஹா"],
  "masala-omelette":      ["street", "मसाला ऑम्लेट", "મસાલા ઓમલેટ", "மசாலா ஆம்லெட்"],
  "tomato-basil-pasta":   ["global", "टोमॅटो बेसिल पास्ता", "ટામેટા બેસિલ પાસ્તા", "தக்காளி பேசில் பாஸ்தா"],
  "jeera-aloo":           ["north", "जिरा आलू", "જીરા આલુ", "ஜீரா ஆலு"],
  "fluffy-pancakes":      ["global", "फ्लफी पॅनकेक्स", "ફ્લફી પેનકેક", "பஞ்சு போன்ற பான்கேக்"],
};

const UNIT_LOCAL = {
  g: ["ग्रॅम", "ગ્રામ", "கி"], kg: ["किलो", "કિલો", "கிலோ"], ml: ["मि.ली.", "મિ.લી.", "மி.லி"], cup: ["कप", "કપ", "கப்"],
  tbsp: ["मोठा चमचा", "મોટી ચમચી", "மேசைக்கரண்டி"], tsp: ["छोटा चमचा", "નાની ચમચી", "தேக்கரண்டி"], pc: ["", "", ""],
  pinch: ["चिमूटभर", "ચપટી", "சிட்டிகை"], taste: ["चवीनुसार", "સ્વાદ મુજબ", "தேவையான அளவு"], sprig: ["काडी", "ડાળી", "கொத்து"],
  handful: ["मूठभर", "મુઠ્ઠી", "கைப்பிடி"], bunch: ["जुडी", "ઝૂડી", "கட்டு"],
};

// Marathi / Gujarati / Tamil words for common ingredients, so voice commands in those
// languages are understood directly (no translation round-trip needed).
const LOCAL_ALIAS = {
  potato:["बटाटा","बटाटे","બટાકા","બટાટા","உருளைக்கிழங்கு","உருளை"], onion:["कांदा","कांदे","ડુંગળી","કાંદા","வெங்காயம்"],
  tomato:["टोमॅटो","ટામેટા","ટામેટું","தக்காளி"], garlic:["लसूण","લસણ","பூண்டு"], ginger:["आलं किसलेलं","આદુ","இஞ்சி"],
  green_chilli:["हिरवी मिरची","લીલું મરચું","લીલા મરચાં","பச்சை மிளகாய்"], coriander:["कोथिंबीर","કોથમીર","கொத்தமல்லி"],
  milk:["दूध","દૂધ","பால்"], curd:["दही","દહીં","தயிர்"], butter:["लोणी","બટર","માખણ","வெண்ணெய்"], ghee:["तूप","ઘી","நெய்"],
  sugar:["साखर","ખાંડ","சர்க்கரை"], salt:["મીઠું","உப்பு"], oil:["तेल","તેલ","எண்ணெய்"], rice:["तांदूळ","ચોખા","அரிசி"],
  cooked_rice:["भात","ભાત","சாதம்"], toor_dal:["तूर डाळ","डाळ","તુવેર દાળ","દાળ","துவரம் பருப்பு","பருப்பு"],
  eggs:["अंडी","अंडं","ઈંડા","ઈંડું","முட்டை"], paneer:["பனீர்","પનીર"], peanuts:["शेंगदाणे","शेंगदाणा","મગફળી","સીંગ","வேர்க்கடலை"],
  turmeric:["हळद","હળદર","மஞ்சள்"], cumin:["जिरे","जिरं","જીરું","சீரகம்"], mustard:["मोहरी","રાઈ","கடுகு"],
  curry_leaves:["कढीपत्ता","મીઠો લીમડો","கறிவேப்பிலை"], lemon:["लिंबू","લીંબુ","எலுமிச்சை"], tea:["चहा पावडर","ચાની ભૂકી","டீ தூள்"],
  spinach:["पालक","પાલક","பசலைக்கீரை","கீரை"], cauliflower:["फ्लॉवर","फुलकोबी","ફ્લાવર","காலிஃபிளவர்"], cabbage:["कोबी","કોબી","முட்டைக்கோஸ்"],
  carrot:["गाजर","ગાજર","கேரட்"], capsicum:["ढोबळी मिरची","શિમલા મરચું","குடைமிளகாய்"], besan:["बेसन","ચણાનો લોટ","கடலை மாவு"],
  atta:["कणिक","गव्हाचे पीठ","ઘઉંનો લોટ","கோதுமை மாவு"], flour:["मैदा","મેંદો","மைதா"], sooji:["रवा","રવો","ரவை"],
  poha:["पोहे","પૌંઆ","அவல்"], coconut:["नारळ","ખોપરું","નાળિયેર","தேங்காய்"], jaggery:["गूळ","ગોળ","வெல்லம்"],
  chicken:["चिकन","ચિકન","கோழி","சிக்கன்"], fish:["मासे","मासा","માછલી","மீன்"], bread:["ब्रेड","બ્રેડ","ரொட்டி"],
  banana:["केळी","केळं","કેળા","வாழைப்பழம்"], tamarind:["चिंच","આંબલી","புளி"], chickpeas:["छोले","ચણા","கொண்டைக்கடலை"],
  cashew:["काजू","કાજુ","முந்திரி"], cardamom:["वेलची","એલચી","ஏலக்காய்"], noodles:["नूडल्स","નૂડલ્સ","நூடுல்ஸ்"]
};

/* ---------- ingredients ---------- */
const ING = { ...base.ING, ...EXTRA };
// fix alias collisions with the new, more specific ingredients
ING.veg.alias = ING.veg.alias.filter((a) => !["carrot", "carrots", "गाजर"].includes(a));
ING.flour.alias = ING.flour.alias.filter((a) => a !== "आटा");
ING.atta.alias.push("आटा");
for (const [k, words] of Object.entries(LOCAL_ALIAS)) {
  if (!ING[k]) throw new Error(`LOCAL_ALIAS for unknown ingredient ${k}`);
  ING[k].alias = [...new Set([...ING[k].alias, ...words])];
}
for (const [k, v] of Object.entries(ING)) {
  const m = META[k];
  if (!m) throw new Error(`No nutrition/allergen META for ingredient "${k}"`);
  v.n = [m[0], m[1]];
  if (m[2] && Object.keys(m[2]).length) v.w = m[2];
  if (m[3]) v.f = m[3];
}

/* ---------- units ---------- */
const UNITS = { ...base.UNITS, bunch: { en: "bunch", hi: "गड्डी" } };
for (const [u, [mr, gu, ta]] of Object.entries(UNIT_LOCAL)) Object.assign(UNITS[u], { mr, gu, ta });

/* ---------- recipes ---------- */
const originals = base.RECIPES.map((r) => {
  const [region, mr, gu, ta] = ORIGINAL[r.id];
  return { ...r, region, title: { ...r.title, mr, gu, ta } };
});
const RECIPES = [...originals];
for (const f of REGION_FILES) RECIPES.push(...require(path.join(SRC, `recipes-${f}.js`)));

// diet is derived from ingredients so it can never be wrong
const flags = (r) => r.ing.flatMap(([k]) => (ING[k].f || "").split(" ").filter(Boolean));
for (const r of RECIPES) {
  const fl = flags(r);
  r.diet = fl.includes("meat") ? "nonveg" : fl.includes("egg") ? "egg" : "veg";
}

/* ---------- validation ---------- */
const errors = [];
const ids = new Set();
const regionIds = new Set(REGIONS.map((x) => x.id));
for (const r of RECIPES) {
  if (ids.has(r.id)) errors.push(`duplicate id ${r.id}`);
  ids.add(r.id);
  if (!regionIds.has(r.region)) errors.push(`${r.id}: bad region ${r.region}`);
  for (const key of ["en", "hi", "mr", "gu", "ta"]) if (!r.title[key]) errors.push(`${r.id}: missing title.${key}`);
  for (const key of ["desc", "tip", "level"]) if (!r[key] || !r[key].en || !r[key].hi) errors.push(`${r.id}: missing ${key} en/hi`);
  r.steps.forEach((st, i) => { if (!st.en || !st.hi) errors.push(`${r.id}: step ${i + 1} missing en/hi`); });
  r.ing.forEach(([k, q, u]) => {
    if (!ING[k]) errors.push(`${r.id}: unknown ingredient ${k}`);
    if (!UNITS[u]) errors.push(`${r.id}: unknown unit ${u}`);
    if (typeof q !== "number") errors.push(`${r.id}: bad qty for ${k}`);
  });
  if (!["pot", "cup", "bowl", "pan", "stack", "flat", "glass"].includes(r.art)) errors.push(`${r.id}: bad art ${r.art}`);
}
if (errors.length) { console.error(errors.join("\n")); process.exit(1); }

/* ---------- write ---------- */
const seed = { REGIONS, UNITS, ING, RECIPES, DEFAULT_W };
const json = JSON.stringify(seed);
const version = crypto.createHash("sha1").update(json).digest("hex").slice(0, 12);
fs.writeFileSync(path.join(__dirname, "..", "data", "seed.json"), JSON.stringify({ version, ...seed }, null, 1));

const js = `/* AUTO-GENERATED by server/scripts/build-data.js. Do not edit; edit server/data/src/ instead.
   Offline copy of the recipe database (version ${version}). The app replaces it with
   the live catalogue from the server when it is reachable. */
const DATA_VERSION = ${JSON.stringify(version)};
const REGIONS = ${JSON.stringify(REGIONS)};
const UNITS = ${JSON.stringify(UNITS)};
const DEFAULT_W = ${JSON.stringify(DEFAULT_W)};
const ING = ${JSON.stringify(ING)};
const RECIPES = ${JSON.stringify(RECIPES)};
`;
fs.writeFileSync(path.join(__dirname, "..", "..", "public", "js", "data.js"), js);

const byRegion = {};
RECIPES.forEach((r) => (byRegion[r.region] = (byRegion[r.region] || 0) + 1));
console.log(`Built data v${version}: ${RECIPES.length} recipes, ${Object.keys(ING).length} ingredients`, byRegion);
