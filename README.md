# PULSE — World News Intelligence

Real-time AI-powered global news. Powered by Claude with live web search.
Zero npm dependencies — just Node.js and your Anthropic API key.

---

## Step 1 — Add your API key

```bash
cp .env.example .env
```

Open `.env` and replace the placeholder:

```
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxx
```

Get a key at → https://console.anthropic.com/

---

## Option A — Run locally (Node.js)

Requirements: Node.js 18+

```bash
# Start the server
node server.js

# Open in browser
open http://localhost:3000
```

That's it. No npm install needed.

---

## Option B — Run with Docker

```bash
# Build and start
docker compose up -d

# Open in browser
open http://localhost:3000

# View logs
docker compose logs -f

# Stop
docker compose down
```

Or without Compose:

```bash
docker build -t pulse-news .

docker run -d \
  --name pulse-news \
  -p 3000:3000 \
  -e ANTHROPIC_API_KEY=sk-ant-your-key-here \
  pulse-news
```

---

## How it works

```
Browser  →  /api/news  →  server.js  →  api.anthropic.com
                            (holds API key securely)
```

- The browser never touches the Anthropic API directly
- Your API key lives only in `.env` on the server
- Claude searches the live web and returns real-time news as JSON
- The frontend renders it into a newspaper-style layout

---

## Deploy to cloud

### Fly.io (free tier)
```bash
fly auth login
fly launch   # auto-detects Dockerfile, sets port 3000
fly secrets set ANTHROPIC_API_KEY=sk-ant-your-key
fly deploy
```

### Railway
```bash
railway login && railway init && railway up
# Set ANTHROPIC_API_KEY in Railway dashboard → Variables
```

### Render
1. Push to GitHub
2. New Web Service → Docker
3. Add env var: `ANTHROPIC_API_KEY`

### Any VPS
```bash
git clone <your-repo> && cd pulse-news
cp .env.example .env  # add your key
docker compose up -d
```

---

## Project structure

```
pulse-news/
├── server.js          ← Node.js proxy server (no deps)
├── env.js             ← .env file loader (no deps)
├── package.json
├── Dockerfile
├── docker-compose.yml
├── .env.example       ← copy to .env and add your key
├── .gitignore
└── public/
    └── index.html     ← full frontend app
```
