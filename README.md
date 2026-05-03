# 🌍 PULSE — World News

A real-time, free, static news aggregator powered by RSS feeds from the world's top publishers.  
**No API key. No server. No cost. Deploys instantly on GitHub Pages.**

---

## 🔴 Live Demo

> After deploying: `https://YOUR-USERNAME.github.io/pulse-news`

---

## ✨ Features

- 📰 **Real news** from BBC, Reuters, The Guardian, NY Times, NPR, TechCrunch, Wired & more
- 🗂 **11 categories** — Top Stories, World, Politics, Technology, Business, Science, Health, Climate, AI, Sports, Entertainment
- 🔍 **Search** any topic across all feeds
- 🖱 **Click any story** to open a full detail modal
- 📺 **Breaking news ticker** — scrolls latest headlines
- ♻️ **Refresh button** — re-fetches latest news on demand
- 📱 **Fully responsive** — works on mobile, tablet, desktop
- 🆓 **100% free** — uses `allorigins.win` as a CORS proxy to fetch RSS feeds

---

## 🚀 Deploy to GitHub Pages

### Option A — GitHub UI (easiest, no Git needed)

1. Go to [github.com/new](https://github.com/new) → create a public repo named `pulse-news`
2. Click **"uploading an existing file"** → upload `index.html`
3. Go to **Settings → Pages → Branch: main → Save**
4. Visit `https://YOUR-USERNAME.github.io/pulse-news` ✅

---

### Option B — Git CLI

```bash
# Clone your new empty repo
git clone https://github.com/YOUR-USERNAME/pulse-news.git
cd pulse-news

# Copy files in
cp /path/to/downloaded/pulse-github/* .

# Push
git add .
git commit -m "🚀 Initial deploy — PULSE news"
git push origin main
```

Then enable Pages: **Settings → Pages → Branch: main → Save**

---

### Option C — From scratch with this repo

```bash
git clone https://github.com/YOUR-USERNAME/pulse-news.git
cd pulse-news
git add .
git commit -m "first commit"
git push
```

---

## 📁 Project Structure

```
pulse-news/
├── index.html        ← Entire app (single file)
├── README.md         ← This file
├── .gitignore        ← Standard ignores
└── .github/
    └── workflows/
        └── deploy.yml  ← Auto-deploy via GitHub Actions (optional)
```

---

## 🔧 How It Works

```
Browser
  └─► allorigins.win (free CORS proxy)
         └─► BBC News RSS
         └─► Reuters RSS
         └─► The Guardian RSS
         └─► NY Times RSS
         └─► NPR RSS
         └─► TechCrunch RSS
         └─► Wired RSS
         └─► + more...
```

Because RSS feeds don't allow direct browser fetching (CORS), `allorigins.win` acts as a free relay. No rate limits for normal use.

---

## 📡 News Sources

| Source | Categories |
|--------|-----------|
| BBC News | All |
| Reuters | Top, World, Business, Politics, Sports |
| The Guardian | World, Politics, Business, Science, Climate, Sports, Entertainment |
| NY Times | All |
| NPR | Top Stories |
| TechCrunch | Technology, AI |
| Wired | Technology, AI |

---

## 🛠 Customization

Open `index.html` and edit the `FEEDS` object at the top of the `<script>` section to add/remove sources:

```js
const FEEDS = {
  "Technology": [
    "https://techcrunch.com/feed/",
    "https://feeds.wired.com/wired/index",
    // Add your own RSS feed URL here ↓
    "https://example.com/rss.xml",
  ],
  // ...
};
```

---

## 📄 License

MIT — free to use, modify, and deploy anywhere.
