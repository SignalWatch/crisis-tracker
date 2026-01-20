import Parser from "rss-parser";

const parser = new Parser({
  timeout: 10000, // rss-parser option (not always enforced by all fetches, but helps)
});

// --- Simple in-memory cache (works great on warm serverless instances) ---
let CACHE = {
  ts: 0,
  data: null,
};

const CACHE_TTL_MS = 3 * 60 * 1000; // 3 minutes

// Utility: Abortable fetch with timeout
async function fetchWithTimeout(url, timeoutMs = 9000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    return await res.text();
  } finally {
    clearTimeout(timer);
  }
}

function getSourceName(url = "") {
  try {
    const host = new URL(url).hostname.replace("www.", "");
    if (host.includes("bbc")) return "BBC";
    if (host.includes("aljazeera")) return "Al Jazeera";
    if (host.includes("news.google")) return "Google News";
    return host;
  } catch {
    return "Source";
  }
}

function normalizeTitle(t = "") {
  return t
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Stable-ish id from title+link (no extra deps)
function makeId(title = "", link = "") {
  const base = `${normalizeTitle(title)}|${link}`;
  let hash = 0;
  for (let i = 0; i < base.length; i++) {
    hash = (hash * 31 + base.charCodeAt(i)) >>> 0;
  }
  return `n_${hash.toString(16)}`;
}

export default async function handler(req, res) {
  // Allow caching at the edge/CDN a bit too (optional)
  res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");

  // Return cached if fresh
  const now = Date.now();
  if (CACHE.data && now - CACHE.ts < CACHE_TTL_MS) {
    return res.status(200).json(CACHE.data);
  }

  // Reliable global news feeds
  const feeds = [
    "https://news.google.com/rss/search?q=world+crisis&hl=en-US&gl=US&ceid=US:en",
    "https://www.aljazeera.com/xml/rss/all.xml",
    "https://feeds.bbci.co.uk/news/world/rss.xml",
  ];

  // Expanded keywords for urgent/global news (keep it focused; too many creates noise)
  const keywords = [
    // conflict / security
    "war","attack","invasion","missile","rocket","drone","airstrike","bombing","explosion","shelling",
    "clashes","raid","assault","siege","hostage","kidnapping","assassination","terror","militant",
    "ceasefire","sanctions","martial law","mobilization",

    // unrest / governance
    "coup","uprising","protests","riot","crackdown","state of emergency","curfew","border closed",

    // humanitarian
    "refugee","evacuation","displacement","casualty","killed","dead","fatalities","injured",
    "humanitarian","aid","famine","starvation",

    // disasters
    "earthquake","hurricane","storm","flood","wildfire","tsunami","landslide","drought","eruption",
    "tornado",

    // health
    "outbreak","epidemic","pandemic","virus","disease",

    // critical infrastructure / cyber
    "blackout","power outage","communications down","cyberattack","ransomware","hack",
  ];

  const keywordSet = new Set(keywords.map(k => k.toLowerCase()));

  // Parse feeds in parallel + safely
  const results = await Promise.allSettled(
    feeds.map(async (url) => {
      // rss-parser parseURL does its own fetching; to control timeouts reliably,
      // we fetch ourselves then parseString.
      const xml = await fetchWithTimeout(url, 9000);
      const feed = await parser.parseString(xml);
      return { url, feed };
    })
  );

  let items = [];

  for (const r of results) {
    if (r.status !== "fulfilled") continue;
    const { url, feed } = r.value;

    const source = getSourceName(url);

    const relevant = (feed.items || []).filter((item) => {
      const text = `${item.title || ""} ${(item.contentSnippet || item.content || "")}`.toLowerCase();
      // quick keyword match
      for (const k of keywordSet) {
        if (text.includes(k)) return true;
      }
      return false;
    });

    items = items.concat(
      relevant.map((it) => ({
        title: it.title || "",
        link: it.link || "",
        pubDate: it.pubDate || it.isoDate || null,
        contentSnippet: it.contentSnippet || "",
        source,
      }))
    );
  }

  // Dedupe: prefer unique by link; fallback to normalized title
  const seenLinks = new Set();
  const seenTitles = new Set();
  items = items.filter((it) => {
    const link = (it.link || "").trim();
    const nt = normalizeTitle(it.title);

    if (link && seenLinks.has(link)) return false;
    if (nt && seenTitles.has(nt)) return false;

    if (link) seenLinks.add(link);
    if (nt) seenTitles.add(nt);
    return true;
  });

  // Sort newest first (handle null dates)
  items.sort((a, b) => {
    const da = a.pubDate ? new Date(a.pubDate).getTime() : 0;
    const db = b.pubDate ? new Date(b.pubDate).getTime() : 0;
    return db - da;
  });

  // Limit items (50 is fine; you can raise to 75 without major impact)
  items = items.slice(0, 50);

  const sanitized = items.map((it) => ({
    id: makeId(it.title, it.link),
    title: it.title,
    link: it.link,
    pubDate: it.pubDate,
    contentSnippet: it.contentSnippet,
    source: it.source,
  }));

  // store cache
  CACHE = { ts: now, data: sanitized };

  return res.status(200).json(sanitized);
}
