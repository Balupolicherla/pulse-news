# PULSE — World News (3 Free Options)

Pick the option that suits you. All three share the same UI.

---

## Option 1 — RSS Feeds (`/rss`) ✅ RECOMMENDED
**100% free. No API key. No limits. No sign-up.**
Sources: BBC News, Reuters, The Guardian, NY Times, NPR, TechCrunch, Wired

```bash
cd rss
node server.js
# open http://localhost:3000
```

Docker:
```bash
cd rss && docker compose up -d
```

---

## Option 2 — NewsAPI.org (`/newsapi`)
**Free tier: 100 requests/day. Requires free API key.**
Get key: https://newsapi.org/register

```bash
cd newsapi
cp .env.example .env
# Edit .env → NEWSAPI_KEY=your_key_here
node server.js
```

Docker:
```bash
cd newsapi && docker compose up -d
```

---

## Option 3 — GNews API (`/gnews`)
**Free tier: 100 requests/day, 10 articles/request. Requires free API key.**
Get key: https://gnews.io/

```bash
cd gnews
cp .env.example .env
# Edit .env → GNEWS_KEY=your_key_here
node server.js
```

Docker:
```bash
cd gnews && docker compose up -d
```

---

## Comparison

| Feature            | RSS (Option 1)    | NewsAPI (Option 2) | GNews (Option 3)  |
|--------------------|-------------------|-------------------|-------------------|
| Cost               | FREE forever      | Free (100/day)    | Free (100/day)    |
| API Key needed     | No                | Yes (free)        | Yes (free)        |
| Articles per call  | 12+               | 12                | 10                |
| Images             | Sometimes         | Yes               | Yes               |
| Search             | Yes (client-side) | Yes               | Yes               |
| Sources            | BBC,Reuters,etc.  | 70,000+ sources   | Global sources    |

---

## Requirements
- Node.js 18+ OR Docker
- No npm install needed — zero dependencies
