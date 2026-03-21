const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");

// ── Load API key from environment or .env file ──
require("./env");
const API_KEY = process.env.ANTHROPIC_API_KEY;
const PORT = process.env.PORT || 3000;

if (!API_KEY) {
  console.error("\n❌  ANTHROPIC_API_KEY is not set.");
  console.error("    Copy .env.example → .env and add your key.\n");
  process.exit(1);
}

// ── MIME types for static files ──
const MIME = {
  ".html": "text/html",
  ".css":  "text/css",
  ".js":   "application/javascript",
  ".json": "application/json",
  ".png":  "image/png",
  ".ico":  "image/x-icon",
  ".svg":  "image/svg+xml",
};

// ── Simple HTTP server ──
const server = http.createServer((req, res) => {
  // CORS headers for all responses
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204); res.end(); return;
  }

  // ── API proxy route ──
  if (req.method === "POST" && req.url === "/api/news") {
    let body = "";
    req.on("data", chunk => body += chunk);
    req.on("end", () => {
      let payload;
      try { payload = JSON.parse(body); } catch {
        res.writeHead(400); res.end(JSON.stringify({ error: "Invalid JSON" })); return;
      }

      const postData = JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4000,
        system: payload.system,
        tools: [{ type: "web_search_20250305", name: "web_search" }],
        messages: payload.messages,
      });

      const options = {
        hostname: "api.anthropic.com",
        path: "/v1/messages",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
          "anthropic-version": "2023-06-01",
          "Content-Length": Buffer.byteLength(postData),
        },
      };

      const apiReq = https.request(options, apiRes => {
        let data = "";
        apiRes.on("data", chunk => data += chunk);
        apiRes.on("end", () => {
          res.writeHead(apiRes.statusCode, { "Content-Type": "application/json" });
          res.end(data);
        });
      });

      apiReq.on("error", err => {
        console.error("Anthropic API error:", err.message);
        res.writeHead(502); res.end(JSON.stringify({ error: err.message }));
      });

      apiReq.write(postData);
      apiReq.end();
    });
    return;
  }

  // ── Serve static files ──
  let filePath = path.join(__dirname, "public", req.url === "/" ? "index.html" : req.url);
  // prevent directory traversal
  if (!filePath.startsWith(path.join(__dirname, "public"))) {
    res.writeHead(403); res.end("Forbidden"); return;
  }

  fs.readFile(filePath, (err, content) => {
    if (err) {
      // fallback to index.html (SPA)
      fs.readFile(path.join(__dirname, "public", "index.html"), (e2, c2) => {
        if (e2) { res.writeHead(404); res.end("Not found"); return; }
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(c2);
      });
      return;
    }
    const ext = path.extname(filePath);
    res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
    res.end(content);
  });
});

server.listen(PORT, () => {
  console.log(`\n🌍  PULSE is running → http://localhost:${PORT}\n`);
});
