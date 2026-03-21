# PULSE — World News Intelligence

A real-time, AI-powered global news aggregator running as a containerized application.
Powered by Claude AI with live web search. No backend required — the app calls the Anthropic API directly from the browser.

---

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) installed
- An [Anthropic API key](https://console.anthropic.com/) (`sk-ant-…`)

---

## Quick Start (Docker Compose)

```bash
# 1. Clone / unzip this folder
cd pulse-news

# 2. Build and start
docker compose up -d

# 3. Open in your browser
open http://localhost:3000
```

On first load, the app will ask for your Anthropic API key.
Enter it once — it's saved in your browser's localStorage and never leaves your machine except to call Anthropic's API directly.

---

## Docker (without Compose)

```bash
# Build the image
docker build -t pulse-news .

# Run the container
docker run -d \
  --name pulse-news \
  -p 3000:80 \
  --restart unless-stopped \
  pulse-news

# Open
open http://localhost:3000
```

---

## Deploy to Production

### Fly.io (recommended — free tier available)
```bash
# Install flyctl: https://fly.io/docs/hands-on/install-flyctl/
fly auth login
fly launch          # auto-detects Dockerfile
fly deploy
```

### Render.com
1. Push this folder to a GitHub repo
2. New → Web Service → connect repo
3. Runtime: Docker
4. Port: 80
5. Deploy

### Railway
```bash
railway login
railway init
railway up
```

### Any VPS (DigitalOcean, Hetzner, AWS EC2, etc.)
```bash
# On your server:
git clone <your-repo>
cd pulse-news
docker compose up -d
# Then point your domain / reverse proxy to port 3000
```

---

## Features

| Feature | Details |
|---------|---------|
| Live news | Claude AI searches the web in real time |
| 11 categories | Top Stories, World, Politics, Tech, Business, Science, Health, Climate, AI, Sports, Entertainment |
| Search | Type any topic, event, or country |
| Story detail | Click any card to expand full report |
| Breaking ticker | Scrolling headlines |
| API key storage | LocalStorage — never sent to any server |

---

## Project Structure

```
pulse-news/
├── Dockerfile          ← Container definition
├── docker-compose.yml  ← Local dev orchestration
├── nginx.conf          ← Web server config
├── public/
│   └── index.html      ← Entire app (single file)
└── README.md
```

---

## Environment & Security Notes

- Your API key is stored in `localStorage` in the browser — it's only sent to `api.anthropic.com`.
- For a team/public deployment, consider adding a lightweight backend proxy to keep the key server-side.
- The nginx config adds standard security headers.

---

## License

MIT — use freely, modify, and deploy anywhere.
