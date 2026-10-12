/* CookMate AI service worker: makes the web app installable and usable offline. */
const VERSION = "cookmate-v2";
const SHELL = [
  "./", "index.html", "manifest.webmanifest", "css/app.css?v=2",
  "js/config.js", "js/native.js?v=2", "js/data.js?v=2", "js/i18n.js?v=2", "js/core.js?v=2",
  "js/voice.js?v=2", "js/kitchen.js?v=2", "js/lists.js?v=2", "js/main.js?v=2",
  "icons/icon-192.png", "icons/icon-512.png", "icons/favicon-32.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});

const networkFirst = async (req, fallbackUrl) => {
  const cache = await caches.open(VERSION);
  try {
    const res = await fetch(req);
    if (res.ok) cache.put(fallbackUrl || req, res.clone());
    return res;
  } catch (e) {
    return (await cache.match(fallbackUrl || req)) || Response.error();
  }
};

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // pages: fresh when online, cached shell when offline
  if (req.mode === "navigate") { e.respondWith(networkFirst(req, "index.html")); return; }

  if (url.origin === location.origin) {
    if (url.pathname.endsWith("/api/catalog")) { e.respondWith(networkFirst(req)); return; }   // newest recipes, offline copy
    if (url.pathname.includes("/api/")) return;                                                // everything else live only
    // versioned static files: cache first
    e.respondWith(caches.match(req).then((hit) => hit || fetch(req).then((res) => {
      if (res.ok) caches.open(VERSION).then((c) => c.put(req, res.clone()));
      return res;
    })));
    return;
  }
  // Google Fonts: serve cached copy, refresh in the background
  if (/fonts\.(googleapis|gstatic)\.com$/.test(url.hostname)) {
    e.respondWith(caches.open(VERSION).then(async (c) => {
      const hit = await c.match(req);
      const net = fetch(req).then((res) => { c.put(req, res.clone()); return res; }).catch(() => hit);
      return hit || net;
    }));
  }
});
