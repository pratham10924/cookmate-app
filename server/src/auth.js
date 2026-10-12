// Accounts + JWT sessions.
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("./db");

const SECRET = process.env.JWT_SECRET || "dev-only-change-me";
if (SECRET === "dev-only-change-me" && process.env.NODE_ENV === "production") {
  throw new Error("Set JWT_SECRET in .env before running in production");
}
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LANG_RE = /^[a-z]{2}$/;

const parsePrefs = (u) => { try { return JSON.parse(u.prefs || "{}"); } catch { return {}; } };
const publicUser = (u) => ({ id: u.id, name: u.name, email: u.email, lang: u.lang, langs: JSON.parse(u.langs), prefs: parsePrefs(u) });

// Only these preference fields are stored, with simple validation.
const ALLERGENS = ["dairy", "nuts", "peanut", "gluten", "egg", "soy", "sesame", "fish", "mustard"];
const DIETS = ["any", "veg", "vegan", "jain", "eggetarian"];
function cleanPrefs(p, prev = {}) {
  if (!p || typeof p !== "object") return prev;
  const out = { ...prev };
  if (Array.isArray(p.allergies)) out.allergies = p.allergies.filter((a) => ALLERGENS.includes(a));
  if (DIETS.includes(p.diet)) out.diet = p.diet;
  if (typeof p.wake === "boolean") out.wake = p.wake;
  if (typeof p.glutenFree === "boolean") out.glutenFree = p.glutenFree;
  return out;
}
const sign = (u) => jwt.sign({ uid: u.id }, SECRET, { expiresIn: "30d" });

// Middleware: attaches req.user when a valid Bearer token is present.
function requireAuth(req, res, next) {
  const m = (req.headers.authorization || "").match(/^Bearer (.+)$/);
  if (!m) return res.status(401).json({ error: "auth_required" });
  try {
    const { uid } = jwt.verify(m[1], SECRET);
    const u = db.prepare("SELECT * FROM users WHERE id = ?").get(uid);
    if (!u) return res.status(401).json({ error: "auth_invalid" });
    req.user = u;
    next();
  } catch {
    res.status(401).json({ error: "auth_invalid" });
  }
}

const router = express.Router();

router.post("/signup", (req, res) => {
  const name = String(req.body.name || "").trim().slice(0, 80);
  const email = String(req.body.email || "").trim().toLowerCase();
  const pass = String(req.body.password || "");
  const lang = LANG_RE.test(req.body.lang) ? req.body.lang : "en";
  if (!name) return res.status(400).json({ error: "errName" });
  if (!EMAIL_RE.test(email)) return res.status(400).json({ error: "errEmail" });
  if (pass.length < 6) return res.status(400).json({ error: "errPass" });
  if (db.prepare("SELECT 1 FROM users WHERE email = ?").get(email)) return res.status(409).json({ error: "errExists" });

  const langs = [...new Set(["en", "hi", "mr", lang])];
  const info = db
    .prepare("INSERT INTO users (email, name, pass_hash, lang, langs, created_at) VALUES (?, ?, ?, ?, ?, ?)")
    .run(email, name, bcrypt.hashSync(pass, 10), lang, JSON.stringify(langs), Date.now());
  const u = db.prepare("SELECT * FROM users WHERE id = ?").get(info.lastInsertRowid);
  res.status(201).json({ token: sign(u), user: publicUser(u) });
});

router.post("/login", (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const pass = String(req.body.password || "");
  const u = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
  if (!u || !bcrypt.compareSync(pass, u.pass_hash)) return res.status(401).json({ error: "errLogin" });
  res.json({ token: sign(u), user: publicUser(u) });
});

router.get("/me", requireAuth, (req, res) => res.json({ user: publicUser(req.user) }));

router.patch("/me", requireAuth, (req, res) => {
  const u = req.user;
  const name = req.body.name ? String(req.body.name).trim().slice(0, 80) : u.name;
  const lang = LANG_RE.test(req.body.lang) ? req.body.lang : u.lang;
  let langs = JSON.parse(u.langs);
  if (Array.isArray(req.body.langs)) langs = [...new Set(["en", ...req.body.langs.filter((l) => LANG_RE.test(l))])].slice(0, 25);
  const prefs = cleanPrefs(req.body.prefs, parsePrefs(u));
  db.prepare("UPDATE users SET name = ?, lang = ?, langs = ?, prefs = ? WHERE id = ?").run(name, lang, JSON.stringify(langs), JSON.stringify(prefs), u.id);
  res.json({ user: publicUser(db.prepare("SELECT * FROM users WHERE id = ?").get(u.id)) });
});

router.delete("/me", requireAuth, (req, res) => {
  db.prepare("DELETE FROM users WHERE id = ?").run(req.user.id);
  res.json({ ok: true });
});

module.exports = { router, requireAuth, parsePrefs };
