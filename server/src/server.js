require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
const path = require("path");
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const db = require("./db");
const { router: authRouter } = require("./auth");
const apiRouter = require("./api");

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.disable("x-powered-by");
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        connectSrc: ["'self'", "https://api.mymemory.translated.net"],
        imgSrc: ["'self'", "data:", "https://images.unsplash.com"],
        mediaSrc: ["'self'", "data:", "blob:"],
        // only force https in production; locally the app is often tested over http://<laptop-ip>:3000
        upgradeInsecureRequests: process.env.NODE_ENV === "production" ? [] : null,
      },
    },
  })
);
// Allow the page to call the API when opened from another origin (e.g. a dev server).
app.use(cors({ origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",") : true }));
app.use(express.json({ limit: "512kb" }));

// Rate limits: tight on login/signup, looser on the rest, tight on the paid AI endpoint.
app.use("/api/auth/login", rateLimit({ windowMs: 15 * 60e3, limit: 20 }));
app.use("/api/auth/signup", rateLimit({ windowMs: 60 * 60e3, limit: 10 }));
app.use("/api/assistant", rateLimit({ windowMs: 60e3, limit: 15 }));
app.use("/api", rateLimit({ windowMs: 60e3, limit: 300 }));

app.get("/api/health", (req, res) => {
  const recipes = db.prepare("SELECT COUNT(*) AS n FROM recipes").get().n;
  res.json({ ok: true, recipes, assistant: !!process.env.ANTHROPIC_API_KEY });
});
app.use("/api/auth", authRouter);
app.use("/api", apiRouter);
app.use("/api", (req, res) => res.status(404).json({ error: "not_found" }));

// Serve the CookMate frontend (also an installable PWA).
// Versioned assets (?v=...) are cached for a week; the page, manifest and service worker are always revalidated.
const PUBLIC = path.join(__dirname, "..", "..", "public");
app.use(express.static(PUBLIC, {
  setHeaders(res, file) {
    if (file.endsWith(".webmanifest")) res.setHeader("Content-Type", "application/manifest+json");
    if (/\.(html|webmanifest)$/.test(file) || file.endsWith("sw.js") || file.endsWith("config.js")) res.setHeader("Cache-Control", "no-cache");
    else res.setHeader("Cache-Control", "public, max-age=604800");
  },
}));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.type === "entity.parse.failed" ? "invalid_json" : "server_error" });
});

if (require.main === module) {
  app.listen(PORT, () => console.log(`CookMate AI running at http://localhost:${PORT}`));
}
module.exports = app;
