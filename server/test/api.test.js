const { test, before, after } = require("node:test");
const assert = require("node:assert");
const os = require("os"), path = require("path"), fs = require("fs");
process.env.DB_FILE = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "cm-")), "test.db");
process.env.ADMIN_KEY = "test-admin";
delete process.env.ANTHROPIC_API_KEY;
// a fake Claude API so translation + assistant can be tested offline
const http = require("http");
let mockCalls = 0;
const mock = http.createServer((q, r) => { let b = ""; q.on("data", (d) => (b += d)); q.on("end", () => {
  mockCalls++; const j = JSON.parse(b); r.setHeader("content-type", "application/json");
  const text = /JSON array/.test(j.system) ? JSON.stringify(JSON.parse(j.messages[0].content).map((x) => "MR:" + x)) : "Mock answer";
  r.end(JSON.stringify({ content: [{ type: "text", text }] }));
}); }).listen(0);
process.env.ANTHROPIC_BASE_URL = "http://localhost:" + mock.address().port;
const app = require("../src/server");

let server, base, token;
before(() => new Promise((r) => { server = app.listen(0, () => { base = `http://localhost:${server.address().port}/api`; r(); }); }));
after(() => { server.close(); mock.close(); });
const call = async (p, { method = "GET", body, tok, headers = {} } = {}) => {
  const res = await fetch(base + p, { method, headers: { "content-type": "application/json", ...(tok ? { authorization: "Bearer " + tok } : {}), ...headers }, body: body && JSON.stringify(body) });
  return { status: res.status, body: await res.json() };
};

test("health + catalog seeded", async () => {
  const h = await call("/health");
  assert.equal(h.body.ok, true); assert.equal(h.body.recipes, 55);
  const c = await call("/catalog");
  assert.equal(c.body.recipes[0].id, "paneer-butter-masala");
  assert.ok(c.body.ingredients.paneer.n, "nutrition data"); assert.equal(c.body.units.tbsp.mr, "मोठा चमचा");
  assert.deepEqual(c.body.regions.map((r) => r.id), ["north", "south", "west", "east", "street", "global"]);
  assert.ok(c.body.recipes.every((r) => r.region && r.title.ta && ["veg", "egg", "nonveg"].includes(r.diet)));
  assert.equal(c.body.recipes.find((r) => r.id === "butter-chicken").diet, "nonveg");
});

test("signup, duplicate, login, wrong password", async () => {
  const s = await call("/auth/signup", { method: "POST", body: { name: "Pratham", email: "P@x.com", password: "secret1", lang: "gu" } });
  assert.equal(s.status, 201); assert.deepEqual(s.body.user.langs, ["en", "hi", "mr", "gu"]);
  assert.equal((await call("/auth/signup", { method: "POST", body: { name: "A", email: "p@x.com", password: "secret1" } })).body.error, "errExists");
  assert.equal((await call("/auth/signup", { method: "POST", body: { name: "A", email: "b@x.com", password: "123" } })).body.error, "errPass");
  assert.equal((await call("/auth/login", { method: "POST", body: { email: "p@x.com", password: "nope00" } })).status, 401);
  const l = await call("/auth/login", { method: "POST", body: { email: "p@x.com", password: "secret1" } });
  token = l.body.token; assert.ok(token);
});

test("profile update + auth required", async () => {
  assert.equal((await call("/auth/me")).status, 401);
  assert.equal((await call("/auth/me", { tok: "garbage" })).status, 401);
  const r = await call("/auth/me", { method: "PATCH", tok: token, body: { lang: "hi", langs: ["hi", "ta", "BAD"] } });
  assert.equal(r.body.user.lang, "hi"); assert.deepEqual(r.body.user.langs, ["en", "hi", "ta"]);
});

test("history sync round-trip", async () => {
  assert.equal((await call("/history", { tok: token })).body.history, null);
  const h = { events: [{ k: "search", q: "chai", ts: 1 }], stats: { voice: 2 }, progress: { id: "masala-chai", step: 1 } };
  assert.equal((await call("/history", { method: "PUT", tok: token, body: { history: h } })).status, 200);
  assert.deepEqual((await call("/history", { tok: token })).body.history, h);
});

test("favorites", async () => {
  await call("/favorites/dal-tadka", { method: "PUT", tok: token });
  assert.deepEqual((await call("/favorites", { tok: token })).body.favorites, ["dal-tadka"]);
  await call("/favorites/dal-tadka", { method: "DELETE", tok: token });
  assert.deepEqual((await call("/favorites", { tok: token })).body.favorites, []);
});

test("recipe search + ingredient match", async () => {
  assert.ok((await call("/recipes?q=chai")).body.recipes.some((r) => r.id === "masala-chai"));
  assert.ok((await call("/recipes?maxTime=15")).body.recipes.every((r) => r.time <= 15));
  const m = await call("/recipes/match", { method: "POST", body: { ingredients: ["paneer", "tomato"] } });
  assert.equal(m.body.results[0].recipe.id, "paneer-butter-masala");
  assert.equal((await call("/recipes/nope")).status, 404);
});

test("admin recipe upsert is protected and validated", async () => {
  const r = { id: "lemon-water", title: { en: "Lemon Water" }, time: 2, serves: 1, tags: ["drink"], alias: ["nimbu pani"], ing: [["lemon", 1, "tbsp"], ["water", 250, "ml"]], steps: [{ en: "Mix." }], level: { en: "Easy" }, desc: { en: "x" }, tip: { en: "x" } };
  assert.equal((await call("/recipes/lemon-water", { method: "PUT", body: r })).status, 403);
  assert.equal((await call("/recipes/lemon-water", { method: "PUT", body: { ...r, ing: [["unicorn", 1, "g"]] }, headers: { "x-admin-key": "test-admin" } })).body.error, "unknown_ingredients");
  assert.equal((await call("/recipes/lemon-water", { method: "PUT", body: r, headers: { "x-admin-key": "test-admin" } })).status, 200);
  assert.equal((await call("/health")).body.recipes, 56);
});

test("preferences are validated and saved", async () => {
  const r = await call("/auth/me", { method: "PATCH", tok: token, body: { prefs: { diet: "jain", allergies: ["dairy", "bogus", "nuts"], wake: true, evil: 1 } } });
  assert.deepEqual(r.body.user.prefs, { diet: "jain", allergies: ["dairy", "nuts"], wake: true });
  assert.equal((await call("/auth/me", { method: "PATCH", tok: token, body: { prefs: { diet: "carnivore" } } })).body.user.prefs.diet, "jain");
});

test("shopping list sync", async () => {
  assert.deepEqual((await call("/shopping", { tok: token })).body.items, []);
  const items = [{ id: "a1", ing: "milk", text: "Milk", qty: "1 cup", done: false }, { id: "a2", text: "Dish soap", done: true }, { id: "", text: "dropped" }];
  const r = await call("/shopping", { method: "PUT", tok: token, body: { items } });
  assert.equal(r.body.items.length, 2);
  assert.equal((await call("/shopping", { tok: token })).body.items[1].text, "Dish soap");
  assert.equal((await call("/shopping")).status, 401);
});

test("translation uses Claude when a key is set, and caches", async () => {
  process.env.ANTHROPIC_API_KEY = "test";
  const before = mockCalls;
  const r1 = await call("/translate", { method: "POST", body: { texts: ["Boil the milk.", "Add sugar."], from: "en", to: "mr" } });
  assert.deepEqual(r1.body.translations, ["MR:Boil the milk.", "MR:Add sugar."]);
  const r2 = await call("/translate", { method: "POST", body: { texts: ["Add sugar."], from: "en", to: "mr" } });
  assert.equal(r2.body.translations[0], "MR:Add sugar.");
  assert.equal(mockCalls - before, 1, "second request served from cache");
  const a = await call("/assistant", { method: "POST", body: { message: "is this safe?", allergies: ["dairy"], recipeId: "masala-chai" } });
  assert.equal(a.body.reply, "Mock answer");
  delete process.env.ANTHROPIC_API_KEY;
});

test("assistant disabled without key", async () => {
  assert.equal((await call("/assistant/status")).body.enabled, false);
  assert.equal((await call("/assistant", { method: "POST", body: { message: "hi" } })).status, 503);
});

test("account delete cascades", async () => {
  await call("/auth/me", { method: "DELETE", tok: token });
  assert.equal((await call("/auth/me", { tok: token })).status, 401);
});
