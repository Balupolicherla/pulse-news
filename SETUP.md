# 🚀 How to Push to GitHub & Go Live

Follow these steps exactly — your site will be live in under 5 minutes.

---

## Step 1 — Create a GitHub repo

1. Go to → https://github.com/new
2. Repository name: `pulse-news` (or anything you want)
3. Set to **Public**
4. ❌ Do NOT check "Add a README" (we have our own)
5. Click **Create repository**

---

## Step 2 — Push this code

Open your terminal, `cd` into this folder, then run:

```bash
# Initialize git
git init

# Add all files
git add .

# First commit
git commit -m "🚀 Deploy PULSE news"

# Connect to your GitHub repo (replace YOUR-USERNAME and YOUR-REPO-NAME)
git remote add origin https://github.com/YOUR-USERNAME/pulse-news.git

# Push
git branch -M main
git push -u origin main
```

---

## Step 3 — Enable GitHub Pages

### Option A — GitHub Actions (recommended, auto-deploys on every push)

1. Go to your repo on GitHub
2. Click **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**
4. The `deploy.yml` workflow will run automatically ✅

### Option B — Branch deploy (simple)

1. Go to **Settings** → **Pages**
2. Source: **Deploy from a branch**
3. Branch: `main` → Folder: `/ (root)`
4. Click **Save**

---

## Step 4 — Visit your live site

```
https://YOUR-USERNAME.github.io/pulse-news
```

Takes about 1–2 minutes after the first push. After that, every `git push` auto-deploys.

---

## Updating the site later

```bash
# Make any changes to index.html, then:
git add .
git commit -m "update news site"
git push
```

GitHub Actions will automatically redeploy. Done ✅
