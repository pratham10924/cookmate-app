// SQLite database: users, recipes, ingredients, per-user history, translation cache.
const path = require("path");
const fs = require("fs");
// Node's built-in SQLite (Node 22.13+): nothing to compile, works on every OS.
process.removeAllListeners("warning"); // hide the "SQLite is experimental" notice on some Node versions
const { DatabaseSync } = require("node:sqlite");

const DB_FILE = process.env.DB_FILE || path.join(__dirname, "..", "data", "cookmate.db");
fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });

const db = new DatabaseSync(DB_FILE);
db.exec("PRAGMA journal_mode = WAL");
db.exec("PRAGMA foreign_keys = ON");

// small helper: run several statements as one all-or-nothing transaction
db.transaction = (fn) => () => {
  db.exec("BEGIN");
  try { const r = fn(); db.exec("COMMIT"); return r; }
  catch (e) { db.exec("ROLLBACK"); throw e; }
};

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  email       TEXT UNIQUE NOT NULL,
  name        TEXT NOT NULL,
  pass_hash   TEXT NOT NULL,
  lang        TEXT NOT NULL DEFAULT 'en',
  langs       TEXT NOT NULL DEFAULT '["en","hi","mr"]',
  created_at  INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS history (
  user_id     INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  data        TEXT NOT NULL,
  updated_at  INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS favorites (
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  recipe_id   TEXT NOT NULL,
  created_at  INTEGER NOT NULL,
  PRIMARY KEY (user_id, recipe_id)
);
CREATE TABLE IF NOT EXISTS recipes (
  id          TEXT PRIMARY KEY,
  data        TEXT NOT NULL,
  sort        INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS ingredients (
  key         TEXT PRIMARY KEY,
  data        TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS shopping (
  user_id     INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  data        TEXT NOT NULL,
  updated_at  INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS meta (
  key         TEXT PRIMARY KEY,
  value       TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS translations (
  src_lang    TEXT NOT NULL,
  dst_lang    TEXT NOT NULL,
  src_text    TEXT NOT NULL,
  dst_text    TEXT NOT NULL,
  PRIMARY KEY (src_lang, dst_lang, src_text)
);
`);

// Light migrations for databases created by older versions.
const userCols = db.prepare("PRAGMA table_info(users)").all().map((c) => c.name);
if (!userCols.includes("prefs")) db.exec("ALTER TABLE users ADD COLUMN prefs TEXT NOT NULL DEFAULT '{}'");

// Seed / refresh recipes, ingredients and units from data/seed.json whenever its
// version changes. Recipes added through the admin API are left untouched.
function seed() {
  const seedFile = path.join(__dirname, "..", "data", "seed.json");
  if (!fs.existsSync(seedFile)) return;
  const { version, REGIONS, UNITS, ING, RECIPES, DEFAULT_W } = JSON.parse(fs.readFileSync(seedFile, "utf8"));
  const cur = db.prepare("SELECT value FROM meta WHERE key = 'seed_version'").get();
  if (cur && cur.value === version) return;
  const upR = db.prepare("INSERT INTO recipes (id, data, sort) VALUES (?, ?, ?) ON CONFLICT(id) DO UPDATE SET data = excluded.data, sort = excluded.sort");
  const upI = db.prepare("INSERT INTO ingredients (key, data) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET data = excluded.data");
  const upM = db.prepare("INSERT OR REPLACE INTO meta (key, value) VALUES (?, ?)");
  db.transaction(() => {
    RECIPES.forEach((r, i) => upR.run(r.id, JSON.stringify(r), i));
    Object.entries(ING).forEach(([k, v]) => upI.run(k, JSON.stringify(v)));
    upM.run("units", JSON.stringify(UNITS));
    upM.run("regions", JSON.stringify(REGIONS));
    upM.run("default_w", JSON.stringify(DEFAULT_W));
    upM.run("seed_version", version);
  })();
  console.log(`[db] recipe data ${version}: ${RECIPES.length} recipes, ${Object.keys(ING).length} ingredients`);
}
seed();

module.exports = db;
