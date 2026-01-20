// File: pages/api/news.js
import Parser from "rss-parser";

const parser = new Parser();

// Keywords for urgent/global news
const KEYWORDS = [
  "war","attack","bomb","invasion","massacre","protests","conflict","tension",
  "military","strike","clashes","hostage","explosion","siege","assault","occupation",
  "escalation","airstrike","shelling","firefight","sanctions","diplomatic","coup",
  "uprising","resistance","regime","embargo","political","government","leaders",
  "refugee","evacuation","displacement","casualty","injured","fatalities","humanitarian",
  "aid","crisis","starvation","flood","earthquake","hurricane","tsunami","wildfire",
  "storm","tornado","landslide","drought","eruption","epidemic","outbreak","pandemic",
  "disease","virus","terrorist","attackers","bombing","assassination","emergency",
  "alert","disaster","evacuated","collapsed"
].map((k) => k.toLowerCase());

// Simple in-memory cache (works well on warm serverless instances)
const CACHE_TTL_MS = 3 * 60 * 1000; // 3 minutes

function getCache() {
  return globalThis.__signalwatch_news_cache;
}

function setCache(value) {
  globalThis.__signalwatch_news_cache = value;
}

function safeDate(item) {
  // rss-parser commonly provides isoDate; some feeds provide pubDate only
  const d = item.isoDate || item.pubDate;
  const parsed = d ? new Date(d) : null;
  return parsed && !Number.isNaN(parsed.getTime()) ? parsed : null;
}

function isRelevant(item) {
  const title = (item.title || "").toLowerCase();
  const snippet = (item.contentSnippet || item.content || "").toLowerCase();
  const text = `${title} ${snippet}`;
  return KEYWORDS.some((k) => text.includes(k));
}

async function parseWithTimeout(url, timeoutMs = 7000) {
  // rss-parser's parseURL does its own fetching. We can still timeout the whole operation.
  return await Promise.race([
    parser.parseURL(url),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`Timeout after ${timeoutMs}ms`)), timeoutMs)
    ),
  ]);
}

export default async function handler(req, res) {
  // Only allow GET
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  // CDN/serverless cache headers (good for Vercel)
  // - s-maxage: cache at the edge for 180s
  // - stale-while-revalidate: serve stale while refreshing in background (where supported)
  res.setHeader("Cache-Control", "public, s-maxage=180, stale-while-revalidate=600");

  // Serve from in-memory cache if fresh
  const cached = getCache();
  if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
    return res.status(200).json(cached.data);
  }

  // Reliable global news feeds
  const feeds = [
    "https://news.google.com/rss/search?q=world+crisis&hl=en-US&gl=US&ceid=US:en",
    "https://www.aljazeera.com/xml/rss/all.xml",
    "https://feeds.bbci.co.uk/news/world/rss.xml",
  ];

  try {
    // Fetch all feeds in parallel
    const results = await Promise.allSettled(
      feeds.map((url) => parseWithTimeout(url, 7000))
    );

    let items = [];

    for (let i = 0; i < results.length; i++) {
      const r = results[i];
      const url = feeds[i];

      if (r.status === "fulfilled") {
        const feed = r.value;

        // Filter relevant items only
        const relevant = (feed.items || [])
          .filter((item) => item && item.title && item.link)
          .filter(isRelevant)
          .slice(0, 30); // limit per feed so one feed can't dominate

        items = items.concat(relevant);
      } else {
        console.error("Error fetching feed:", url, r.reason);
      }
    }

    // De-dupe: prefer link, fall back to title
    const seen = new Set();
    items = items.filter((item) => {
      const key = (item.link || "").trim() || (item.title || "").trim();
      if (!key) return false;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    // Sort newest first (safe date handling)
    items.sort((a, b) => {
      const da = safeDate(a);
      const db = safeDate(b);
      const ta = da ? da.getTime() : 0;
      const tb = db ? db.getTime() : 0;
      return tb - ta;
    });

    // Limit to 50 items total
    items = items.slice(0, 50);

    // Sanitize / shape for frontend
    const sanitized = items.map((item) => {
      const d = safeDate(item);
      return {
        title: item.title,
        link: item.link,
        pubDate: d ? d.toISOString() : item.pubDate || item.isoDate || null,
        contentSnippet: item.contentSnippet || item.content || "",
      };
    });

    // Store in cache
    setCache({ ts: Date.now(), data: sanitized });

    return res.status(200).json(sanitized);
  } catch (err) {
    console.error("News API failed:", err);

    // If we have stale cache, serve it rather than erroring out
    const cachedFallback = getCache();
    if (cachedFallback?.data?.length) {
      return res.status(200).json(cachedFallback.data);
    }

    return res.status(200).json([]); // graceful empty response
  }
}
