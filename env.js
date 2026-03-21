// Minimal .env loader — no dependencies needed
const fs = require("fs");
const path = require("path");

const envFile = path.join(__dirname, ".env");
if (fs.existsSync(envFile)) {
  const lines = fs.readFileSync(envFile, "utf8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const [key, ...rest] = trimmed.split("=");
    const value = rest.join("=").trim().replace(/^["']|["']$/g, "");
    if (key && value && !process.env[key]) {
      process.env[key] = value;
    }
  }
}
