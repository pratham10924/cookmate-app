// Recipes, ingredients, history sync, favorites, translation proxy, AI assistant.
const express = require("express");
const db = require("./db");
const { requireAuth, parsePrefs } = require("./auth");

const router = express.Router();

/* ---------------- Recipes + ingredients ---------------- */
const allRecipes = () => db.prepare("SELECT data FROM recipes ORDER BY sort, id").all().map((r) => JSON.parse(r.data));
const allIngredients = () =>
  Object.fromEntries(db.prepare("SELECT key, data FROM ingredients").all().map((r) => [r.key, JSON.parse(r.data)]));

// One call gives the frontend everything it needs to render the catalogue.
const metaVal = (k, d) => { const r = db.prepare("SELECT value FROM meta WHERE key = ?").get(k); return r ? (k === "seed_version" ? r.value : JSON.parse(r.value)) : d; };
router.get("/catalog", (req, res) => {
  res.set("Cache-Control", "no-cache");
  res.json({
    version: metaVal("seed_version", "") + ":" + db.prepare("SELECT COUNT(*) AS n FROM recipes").get().n,
    recipes: allRecipes(), ingredients: allIngredients(),
    units: metaVal("units", {}), regions: metaVal("regions", []), defaultW: metaVal("default_w", {}),
  });
});

router.get("/recipes", (req, res) => {
  let list = allRecipes();
  const { q, tag, maxTime } = req.query;
  if (q) {
    const s = String(q).toLowerCase();
    list = list.filter((r) => r.title.en.toLowerCase().includes(s) || (r.alias || []).some((a) => a.toLowerCase().includes(s)));
  }
  if (tag) list = list.filter((r) => (r.tags || []).includes(String(tag)));
  if (maxTime) list = list.filter((r) => r.time <= Number(maxTime));
  res.json({ recipes: list });
});

router.get("/recipes/:id", (req, res) => {
  const row = db.prepare("SELECT data FROM recipes WHERE id = ?").get(req.params.id);
  if (!row) return res.status(404).json({ error: "not_found" });
  res.json({ recipe: JSON.parse(row.data) });
});

// "What can I cook with X, Y, Z?" — same scoring as the frontend.
router.post("/recipes/match", (req, res) => {
  const have = Array.isArray(req.body.ingredients) ? req.body.ingredients.map(String) : [];
  const scored = allRecipes()
    .map((rc) => ({
      recipe: rc,
      score: have.reduce((s, k) => {
        const ix = rc.ing.findIndex((i) => i[0] === k);
        return s + (ix < 0 ? 0 : ix === 0 ? 3 : ix < 3 ? 2 : 1);
      }, 0),
    }))
    .filter((o) => o.score > 0)
    .sort((a, b) => b.score - a.score || a.recipe.time - b.recipe.time)
    .slice(0, 5);
  res.json({ results: scored });
});

// Admin: add/update a recipe. Protect with ADMIN_KEY header.
function requireAdmin(req, res, next) {
  if (!process.env.ADMIN_KEY || req.headers["x-admin-key"] !== process.env.ADMIN_KEY) return res.status(403).json({ error: "forbidden" });
  next();
}
router.put("/recipes/:id", requireAdmin, (req, res) => {
  const r = req.body;
  const ok = r && r.id === req.params.id && r.title && r.title.en && Array.isArray(r.ing) && Array.isArray(r.steps);
  if (!ok) return res.status(400).json({ error: "invalid_recipe", need: "id, title.en, ing[], steps[]" });
  const missing = r.ing.map((i) => i[0]).filter((k) => !db.prepare("SELECT 1 FROM ingredients WHERE key = ?").get(k));
  if (missing.length) return res.status(400).json({ error: "unknown_ingredients", missing });
  const sort = db.prepare("SELECT COALESCE(MAX(sort), 0) + 1 AS s FROM recipes").get().s;
  if (!r.region) r.region = "global";
  db.prepare("INSERT INTO recipes (id, data, sort) VALUES (?, ?, ?) ON CONFLICT(id) DO UPDATE SET data = excluded.data").run(r.id, JSON.stringify(r), sort);
  res.json({ ok: true });
});
router.put("/ingredients/:key", requireAdmin, (req, res) => {
  const v = req.body;
  if (!v || !v.en || !Array.isArray(v.alias) || !v.sub) return res.status(400).json({ error: "invalid_ingredient", need: "en, alias[], sub{en}" });
  db.prepare("INSERT INTO ingredients (key, data) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET data = excluded.data").run(req.params.key, JSON.stringify(v));
  res.json({ ok: true });
});
router.delete("/recipes/:id", requireAdmin, (req, res) => {
  db.prepare("DELETE FROM recipes WHERE id = ?").run(req.params.id);
  res.json({ ok: true });
});

/* ---------------- History (dashboard) sync ---------------- */
router.get("/history", requireAuth, (req, res) => {
  const row = db.prepare("SELECT data, updated_at FROM history WHERE user_id = ?").get(req.user.id);
  res.json(row ? { history: JSON.parse(row.data), updatedAt: row.updated_at } : { history: null, updatedAt: 0 });
});
router.put("/history", requireAuth, (req, res) => {
  const h = req.body && req.body.history;
  if (!h || typeof h !== "object") return res.status(400).json({ error: "invalid_history" });
  const clean = {
    events: Array.isArray(h.events) ? h.events.slice(0, 300) : [],
    stats: h.stats && typeof h.stats === "object" ? h.stats : { voice: 0 },
    progress: h.progress || null,
  };
  const now = Date.now();
  db.prepare("INSERT INTO history (user_id, data, updated_at) VALUES (?, ?, ?) ON CONFLICT(user_id) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at")
    .run(req.user.id, JSON.stringify(clean), now);
  res.json({ ok: true, updatedAt: now });
});

/* ---------------- Favorites ---------------- */
router.get("/favorites", requireAuth, (req, res) => {
  res.json({ favorites: db.prepare("SELECT recipe_id FROM favorites WHERE user_id = ? ORDER BY created_at DESC").all(req.user.id).map((r) => r.recipe_id) });
});
router.put("/favorites/:id", requireAuth, (req, res) => {
  db.prepare("INSERT OR IGNORE INTO favorites (user_id, recipe_id, created_at) VALUES (?, ?, ?)").run(req.user.id, req.params.id, Date.now());
  res.json({ ok: true });
});
router.delete("/favorites/:id", requireAuth, (req, res) => {
  db.prepare("DELETE FROM favorites WHERE user_id = ? AND recipe_id = ?").run(req.user.id, req.params.id);
  res.json({ ok: true });
});

/* ---------------- Shopping list ---------------- */
router.get("/shopping", requireAuth, (req, res) => {
  const row = db.prepare("SELECT data, updated_at FROM shopping WHERE user_id = ?").get(req.user.id);
  res.json(row ? { items: JSON.parse(row.data), updatedAt: row.updated_at } : { items: [], updatedAt: 0 });
});
router.put("/shopping", requireAuth, (req, res) => {
  if (!Array.isArray(req.body.items)) return res.status(400).json({ error: "invalid_items" });
  const items = req.body.items.slice(0, 200).map((it) => ({
    id: String(it.id || "").slice(0, 40), ing: it.ing ? String(it.ing).slice(0, 40) : null,
    text: String(it.text || "").slice(0, 120), qty: String(it.qty || "").slice(0, 40),
    from: it.from ? String(it.from).slice(0, 60) : null, done: !!it.done,
  })).filter((it) => it.id && (it.text || it.ing));
  const now = Date.now();
  db.prepare("INSERT INTO shopping (user_id, data, updated_at) VALUES (?, ?, ?) ON CONFLICT(user_id) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at")
    .run(req.user.id, JSON.stringify(items), now);
  res.json({ ok: true, items, updatedAt: now });
});

/* ---------------- Translation proxy with shared cache ---------------- */
// The browser used to call MyMemory directly and cache per device. Now every
// translation is cached once in SQLite and shared by all users.
const getT = db.prepare("SELECT dst_text FROM translations WHERE src_lang = ? AND dst_lang = ? AND src_text = ?");
const putT = db.prepare("INSERT OR REPLACE INTO translations (src_lang, dst_lang, src_text, dst_text) VALUES (?, ?, ?, ?)");
const mmCode = (c) => (c === "zh" ? "zh-CN" : c);

// Claude gives far better Marathi/Gujarati/Tamil/etc. than free MT, so it is used when a key is set.
const LANG_NAMES = { en: "English", hi: "Hindi", mr: "Marathi", gu: "Gujarati", bn: "Bengali", ta: "Tamil", te: "Telugu", kn: "Kannada", ml: "Malayalam", pa: "Punjabi", ur: "Urdu", es: "Spanish", fr: "French", de: "German", it: "Italian", pt: "Portuguese", ja: "Japanese", zh: "Chinese", ar: "Arabic", ru: "Russian" };
const ANTHROPIC_URL = () => (process.env.ANTHROPIC_BASE_URL || "https://api.anthropic.com") + "/v1/messages";
const MODEL = () => process.env.ANTHROPIC_MODEL || "claude-sonnet-4-5";

async function claude({ system, messages, max_tokens = 300, timeout = 20000 }) {
  const r = await fetch(ANTHROPIC_URL(), {
    method: "POST",
    headers: { "content-type": "application/json", "x-api-key": process.env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({ model: MODEL(), max_tokens, system, messages }),
    signal: AbortSignal.timeout(timeout),
  });
  const j = await r.json();
  if (!r.ok) throw new Error("claude_" + r.status + " " + JSON.stringify(j && j.error));
  return (j.content || []).filter((c) => c.type === "text").map((c) => c.text).join("").trim();
}

async function translateWithClaude(texts, from, to) {
  const system =
    `You translate short UI strings and recipe text for an Indian home-cooking app from ${LANG_NAMES[from] || from} to ${LANG_NAMES[to] || to}. ` +
    `Use the natural, everyday words home cooks use (it's fine to keep common English food words like paneer, masala, cooker in the target script). ` +
    `Keep numbers, fractions, units and placeholders unchanged. Write in the target language's native script. ` +
    `Reply with ONLY a JSON array of strings, same length and order as the input.`;
  const out = await claude({ system, messages: [{ role: "user", content: JSON.stringify(texts) }], max_tokens: 4000, timeout: 60000 });
  const arr = JSON.parse(out.slice(out.indexOf("["), out.lastIndexOf("]") + 1));
  if (!Array.isArray(arr) || arr.length !== texts.length) throw new Error("bad_translation_shape");
  return arr.map(String);
}

async function translateWithMyMemory(src, from, to) {
  const url = "https://api.mymemory.translated.net/get?q=" + encodeURIComponent(src) + "&langpair=" + mmCode(from) + "|" + mmCode(to) +
    (process.env.MYMEMORY_EMAIL ? "&de=" + encodeURIComponent(process.env.MYMEMORY_EMAIL) : "");
  const r = await fetch(url, { signal: AbortSignal.timeout(8000) });
  const j = await r.json();
  let t = j && j.responseData && j.responseData.translatedText;
  if (!t || /MYMEMORY WARNING|INVALID|QUERY LENGTH/i.test(t)) throw new Error("mt");
  return t.replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, "&");
}

router.post("/translate", async (req, res) => {
  const from = String(req.body.from || "en"), to = String(req.body.to || "");
  const texts = (Array.isArray(req.body.texts) ? req.body.texts : [req.body.text]).filter(Boolean).map((s) => String(s).slice(0, 480)).slice(0, 100);
  if (!/^[a-z]{2}$/.test(from) || !/^[a-z]{2}$/.test(to) || !texts.length) return res.status(400).json({ error: "invalid_request" });

  const out = texts.map((src) => { const hit = getT.get(from, to, src); return hit ? hit.dst_text : null; });
  const missing = [...new Set(texts.filter((_, k) => out[k] == null))];
  const done = new Map();

  if (missing.length && process.env.ANTHROPIC_API_KEY) {
    for (let i = 0; i < missing.length; i += 40) {
      const chunk = missing.slice(i, i + 40);
      try {
        const tr = await translateWithClaude(chunk, from, to);
        chunk.forEach((src, k) => { done.set(src, tr[k]); putT.run(from, to, src, tr[k]); });
      } catch (e) { console.error("[translate] claude:", e.message); }
    }
  }
  const left = missing.filter((m) => !done.has(m));
  let i = 0;
  async function worker() {
    while (i < left.length) {
      const src = left[i++];
      try { const t = await translateWithMyMemory(src, from, to); done.set(src, t); putT.run(from, to, src, t); } catch {}
    }
  }
  await Promise.all(Array.from({ length: 5 }, worker));

  let failed = 0;
  const translations = texts.map((src, k) => out[k] != null ? out[k] : done.has(src) ? done.get(src) : (failed++, src));
  res.json({ translations, failed, engine: process.env.ANTHROPIC_API_KEY ? "claude" : "mymemory" });
});

/* ---------------- AI assistant (optional, Claude) ---------------- */
// Used when the rule-based parser in the browser doesn't understand a question.

router.get("/assistant/status", (req, res) => res.json({ enabled: !!process.env.ANTHROPIC_API_KEY }));

router.post("/assistant", async (req, res) => {
  if (!process.env.ANTHROPIC_API_KEY) return res.status(503).json({ error: "assistant_disabled" });
  const message = String(req.body.message || "").trim().slice(0, 1000);
  if (!message) return res.status(400).json({ error: "empty_message" });
  const lang = LANG_NAMES[req.body.lang] || "English";

  let context = "The user is not cooking a recipe right now.";
  if (req.body.recipeId) {
    const row = db.prepare("SELECT data FROM recipes WHERE id = ?").get(String(req.body.recipeId));
    if (row) {
      const r = JSON.parse(row.data);
      const ing = allIngredients();
      const step = Number.isInteger(req.body.step) ? req.body.step : 0;
      context = `The user is cooking "${r.title.en}" (serves ${req.body.servings || r.serves}). ` +
        `Ingredients: ${r.ing.map((i) => `${i[1]} ${i[2] === "pc" ? "" : i[2]} ${ing[i[0]] ? ing[i[0]].en : i[0]}`).join(", ")}. ` +
        `Steps: ${r.steps.map((s, n) => `${n + 1}. ${s.en}`).join(" ")} They are on step ${step + 1}.`;
    }
  }
  const catalog = allRecipes().map((r) => r.title.en).join(", ");
  const history = Array.isArray(req.body.history) ? req.body.history.slice(-6) : [];
  const allergies = (Array.isArray(req.body.allergies) ? req.body.allergies : []).map(String).filter((a) => /^[a-z]{2,10}$/.test(a)).slice(0, 10);
  const diet = /^[a-z]{2,12}$/.test(req.body.diet || "") ? req.body.diet : "";

  const system =
    `You are CookMate AI, a friendly hands-free cooking assistant. Your replies are read aloud by text-to-speech while the user cooks, ` +
    `so answer in 1-3 short sentences of plain text: no markdown, no lists, no emojis. Reply in ${lang}. ` +
    `Stay on cooking, food, kitchen safety and nutrition; politely steer other topics back to cooking. ` +
    `For food-safety questions (raw meat, storage, allergies) be cautious and concrete. ` +
    (allergies.length ? `The user is allergic to: ${allergies.join(", ")}. Never suggest those, and warn if the current recipe contains them. ` : "") +
    (diet && diet !== "any" ? `The user follows a ${diet} diet. ` : "") +
    `Recipes available in the app: ${catalog}. If one fits, mention it by name so the user can say "make <recipe>". ` + context;

  try {
    const text = await claude({
      system,
      messages: [
        ...history.filter((m) => m && (m.role === "user" || m.role === "assistant") && m.text).map((m) => ({ role: m.role, content: String(m.text).slice(0, 1000) })),
        { role: "user", content: message },
      ],
    });
    res.json({ reply: text });
  } catch (e) {
    console.error("[assistant]", e.message);
    res.status(502).json({ error: "assistant_failed" });
  }
});

module.exports = router;
