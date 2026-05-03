// PULSE — Option 2: RSS Feeds (100% free, no key, no limits)
// Sources: BBC, Reuters, Guardian, NY Times, TechCrunch, Wired, NPR & more
const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;

const FEEDS = {
  "Top Stories":   ["https://feeds.bbci.co.uk/news/rss.xml","https://feeds.reuters.com/reuters/topNews","https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml","https://www.theguardian.com/world/rss","https://feeds.npr.org/1001/rss.xml"],
  "World":         ["https://feeds.bbci.co.uk/news/world/rss.xml","https://feeds.reuters.com/Reuters/worldNews","https://www.theguardian.com/world/rss","https://rss.nytimes.com/services/xml/rss/nyt/World.xml"],
  "Politics":      ["https://feeds.bbci.co.uk/news/politics/rss.xml","https://rss.nytimes.com/services/xml/rss/nyt/Politics.xml","https://www.theguardian.com/politics/rss","https://feeds.reuters.com/Reuters/PoliticsNews"],
  "Technology":    ["https://feeds.bbci.co.uk/news/technology/rss.xml","https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml","https://feeds.wired.com/wired/index","https://techcrunch.com/feed/"],
  "Business":      ["https://feeds.bbci.co.uk/news/business/rss.xml","https://feeds.reuters.com/reuters/businessNews","https://rss.nytimes.com/services/xml/rss/nyt/Business.xml","https://www.theguardian.com/business/rss"],
  "Science":       ["https://feeds.bbci.co.uk/news/science_and_environment/rss.xml","https://rss.nytimes.com/services/xml/rss/nyt/Science.xml","https://www.theguardian.com/science/rss"],
  "Health":        ["https://feeds.bbci.co.uk/news/health/rss.xml","https://rss.nytimes.com/services/xml/rss/nyt/Health.xml","https://www.theguardian.com/society/rss"],
  "Climate":       ["https://feeds.bbci.co.uk/news/science_and_environment/rss.xml","https://www.theguardian.com/environment/climate-crisis/rss","https://rss.nytimes.com/services/xml/rss/nyt/Climate.xml"],
  "AI":            ["https://techcrunch.com/tag/artificial-intelligence/feed/","https://feeds.wired.com/wired/index","https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml"],
  "Sports":        ["https://feeds.bbci.co.uk/sport/rss.xml","https://www.theguardian.com/sport/rss","https://rss.nytimes.com/services/xml/rss/nyt/Sports.xml"],
  "Entertainment": ["https://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml","https://www.theguardian.com/culture/rss","https://rss.nytimes.com/services/xml/rss/nyt/Arts.xml"],
};

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith("https") ? https : http;
    const req = mod.get(url, { headers: { "User-Agent": "Mozilla/5.0 (compatible; PulseBot/1.0)", "Accept": "application/rss+xml,*/*" }, timeout: 8000 }, res => {
      if ([301,302,303,307,308].includes(res.statusCode) && res.headers.location) { fetchUrl(res.headers.location).then(resolve).catch(reject); return; }
      let d = ""; res.on("data", c => d += c); res.on("end", () => resolve(d));
    });
    req.on("error", reject);
    req.on("timeout", () => { req.destroy(); reject(new Error("timeout")); });
  });
}

function extractTag(xml, tag) {
  const re = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>|<${tag}[^>]*>([^<]*)</${tag}>`, "i");
  const m = xml.match(re); return m ? (m[1]||m[2]||"").trim() : "";
}
function stripTags(s) { return s.replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim(); }
function decodeEnt(s) {
  return s.replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"')
          .replace(/&#(\d+);/g,(_,n)=>String.fromCharCode(n)).replace(/&ndash;/g,"–").replace(/&mdash;/g,"—")
          .replace(/&rsquo;/g,"'").replace(/&lsquo;/g,"'").replace(/&rdquo;/g,'"').replace(/&ldquo;/g,'"').replace(/&hellip;/g,"…");
}
function srcName(url) {
  try {
    const h = new URL(url).hostname.replace("www.","").replace("feeds.","");
    return {"bbci.co.uk":"BBC News","reuters.com":"Reuters","nytimes.com":"NY Times","theguardian.com":"The Guardian","npr.org":"NPR","wired.com":"Wired","techcrunch.com":"TechCrunch"}[h]||h;
  } catch { return url; }
}
function timeAgo(str) {
  try {
    const d = new Date(str), diff = Date.now()-d.getTime(), m = Math.floor(diff/60000);
    if (m<1) return "Just now"; if (m<60) return `${m}m ago`;
    const h = Math.floor(m/60); if (h<24) return `${h}h ago`;
    return `${Math.floor(h/24)}d ago`;
  } catch { return "Recently"; }
}
function guessCategory(text, feedUrl) {
  const t = (text+feedUrl).toLowerCase();
  if (/artificial.intelli|\bai\b|openai|chatgpt|deepmind|llm/.test(t)) return "AI";
  if (/tech|software|apple|google|microsoft|startup|silicon|cyber|app/.test(t)) return "Technology";
  if (/climat|environment|emission|carbon|global.warm|renewable/.test(t)) return "Climate";
  if (/health|medicine|cancer|virus|vaccine|hospital|disease/.test(t)) return "Health";
  if (/science|space|nasa|planet|research|discover|biology|physics/.test(t)) return "Science";
  if (/sport|football|soccer|basketball|tennis|cricket|olympic|nba|nfl/.test(t)) return "Sports";
  if (/entertain|movie|music|film|celebrity|oscar|album|concert/.test(t)) return "Entertainment";
  if (/market|stock|economy|trade|gdp|inflation|bank|invest|finance/.test(t)) return "Business";
  if (/election|parliament|congress|president|politic|vote|government/.test(t)) return "Politics";
  return "World";
}
function guessRegion(text) {
  const regions = [["United States",/\bUS\b|\bUSA\b|united states|washington|congress|american/i],["United Kingdom",/\bUK\b|britain|london|parliament/i],["Europe",/europe|european union|\bEU\b|brussels|paris|berlin/i],["Middle East",/middle east|israel|palestin|gaza|iran|iraq|saudi/i],["Asia",/\bchina\b|beijing|india|japan|korea|pakistan/i],["Africa",/africa|nigeria|kenya|ethiopia|egypt/i],["Russia",/russia|moscow|kremlin|ukraine/i]];
  for (const [name,re] of regions) if (re.test(text)) return name;
  return "Global";
}

function parseRSS(xml, feedUrl) {
  const arts = [];
  const itemRe = /<item[\s>]([\s\S]*?)<\/item>/gi;
  let m;
  while ((m = itemRe.exec(xml)) !== null) {
    const item = m[1];
    const title = decodeEnt(stripTags(extractTag(item,"title")||""));
    const link  = extractTag(item,"link")||"";
    const desc  = decodeEnt(stripTags(extractTag(item,"description")||extractTag(item,"summary")||""));
    const pub   = extractTag(item,"pubDate")||extractTag(item,"published")||"";
    const imgM  = item.match(/url="([^"]+\.(jpg|jpeg|png|webp))"/i)||item.match(/<media:content[^>]+url="([^"]+)"/i)||item.match(/src="([^"]+\.(jpg|jpeg|png|webp))"/i);
    if (!title||title.length<5) continue;
    arts.push({ title, summary: desc.slice(0,280)+(desc.length>280?"…":""), link: link.trim(), source: srcName(feedUrl), pubDate: pub?timeAgo(pub):"Recently", category: guessCategory(title+" "+desc, feedUrl), image: imgM?imgM[1]:"", region: guessRegion(title+" "+desc) });
  }
  return arts;
}

async function getArticles(category) {
  const urls = FEEDS[category]||FEEDS["Top Stories"];
  const res = await Promise.allSettled(urls.map(u=>fetchUrl(u)));
  let all = [];
  res.forEach((r,i) => { if (r.status==="fulfilled") { try { all=all.concat(parseRSS(r.value,urls[i])); } catch{} } });
  const seen = new Set();
  return all.filter(a=>{ const k=a.title.slice(0,40).toLowerCase(); if(seen.has(k))return false; seen.add(k); return true; }).sort(()=>Math.random()-0.4).slice(0,12);
}

async function searchArticles(q) {
  const all_urls = [...new Set(Object.values(FEEDS).flat())].sort(()=>Math.random()-0.5).slice(0,8);
  const res = await Promise.allSettled(all_urls.map(u=>fetchUrl(u)));
  let all = [];
  res.forEach((r,i)=>{ if(r.status==="fulfilled"){try{all=all.concat(parseRSS(r.value,all_urls[i]));}catch{}} });
  const lq = q.toLowerCase();
  const seen = new Set();
  return all.filter(a=>a.title.toLowerCase().includes(lq)||a.summary.toLowerCase().includes(lq)).filter(a=>{const k=a.title.slice(0,40).toLowerCase();if(seen.has(k))return false;seen.add(k);return true;}).slice(0,12);
}

const MIME={".html":"text/html",".css":"text/css",".js":"application/javascript",".json":"application/json"};
const server = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin","*");
  if (req.method==="OPTIONS"){res.writeHead(204);res.end();return;}
  if (req.url.startsWith("/api/news")) {
    const u=new URL(req.url,`http://localhost:${PORT}`);
    const cat=u.searchParams.get("category")||"Top Stories", q=u.searchParams.get("q")||"";
    try {
      const articles = q ? await searchArticles(q) : await getArticles(cat);
      res.writeHead(200,{"Content-Type":"application/json"}); res.end(JSON.stringify({articles}));
    } catch(e) { res.writeHead(500,{"Content-Type":"application/json"}); res.end(JSON.stringify({error:e.message})); }
    return;
  }
  const file=path.join(__dirname,"public",req.url==="/"?"index.html":req.url.split("?")[0]);
  if(!file.startsWith(path.join(__dirname,"public"))){res.writeHead(403);res.end();return;}
  fs.readFile(file,(err,content)=>{
    if(err){fs.readFile(path.join(__dirname,"public/index.html"),(_,c)=>{res.writeHead(200,{"Content-Type":"text/html"});res.end(c);});return;}
    res.writeHead(200,{"Content-Type":MIME[path.extname(file)]||"text/plain"});res.end(content);
  });
});
server.listen(PORT, ()=>console.log(`\n📰  PULSE [RSS] → http://localhost:${PORT}\n`));
