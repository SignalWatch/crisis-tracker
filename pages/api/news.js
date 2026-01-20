// File: pages/api/news.js
import Parser from "rss-parser";

const parser = new Parser();

/**
 * Feeds (label + url) so we can tag stories with a source name.
 */
const FEEDS = [
  {
    source: "Google News",
    url: "https://news.google.com/rss/search?q=world+crisis&hl=en-US&gl=US&ceid=US:en",
  },
  {
    source: "Al Jazeera",
    url: "https://www.aljazeera.com/xml/rss/all.xml",
  },
  {
    source: "BBC",
    url: "https://feeds.bbci.co.uk/news/world/rss.xml",
  },
];

/**
 * Keywords grouped by crisis category.
 * Tip: keep them lowercase.
 */
const CRISIS_KEYWORDS = {
  military: [
    "ceasefire","truce","mobilization","conscription","draft","martial law",
    "air raid","no-fly zone","ground offensive","counteroffensive",
    "artillery","missile launch","troop movement","naval blockade","border skirmish",
    "armed confrontation","insurgency","rebels","militants","paramilitary",
    "war crimes","genocide","ethnic cleansing","peacekeeping","un peacekeepers",
    "military exercise","drone strike","rocket fire","retaliatory strike",
    "evacuation corridor","human shields","prisoners of war",
    // keep some of your originals
    "war","invasion","attack","strike","clashes","shelling","airstrike","escalation",
  ],
  terrorism_security: [
    "terror threat","terror alert","hostage situation","active shooter","car bomb",
    "roadside bomb","ied","ieds","suicide bomber","security lockdown","sabotage",
    "infrastructure attack","embassy attack","assassination attempt","kidnapping",
    "abduction","ransom demand","terrorist","bombing","assassination",
  ],
  disasters: [
    "aftershocks","richter","magnitude","flash floods","storm surge","flooding emergency",
    "mudslide","landslide","volcanic ash","lava flow","wildfire evacuation",
    "heatwave emergency","blizzard warning","cyclone","state of disaster","dam collapse",
    "levee breach","tsunami warning","extreme weather",
    // keep some of your originals
    "earthquake","hurricane","tsunami","wildfire","storm","tornado","drought","eruption",
    "flood","disaster",
  ],
  public_health: [
    "health emergency","quarantine","quarantine zone","lockdown imposed",
    "outbreak declared","variant detected","public health emergency",
    "biohazard","toxic exposure","radiation leak","contaminated water",
    "cholera outbreak","ebola outbreak",
    // keep some of your originals
    "epidemic","outbreak","pandemic","disease","virus",
  ],
  infrastructure: [
    "power outage","nationwide blackout","grid failure","internet outage",
    "communication blackout","water shortage","fuel shortage","energy crisis",
    "pipeline explosion","port closure","airport closure","transportation shutdown",
    "rail derailment","bridge collapse","building collapse","factory explosion",
    "industrial accident","chemical spill","toxic leak","gas leak",
    // keep some of your originals
    "collapsed","explosion",
  ],
  civil_unrest: [
    "mass protests","violent clashes","police crackdown","state of emergency",
    "curfew declared","civil disorder","rioting","looting","military coup",
    "attempted coup","regime collapse","government resigns","parliament dissolved",
    "constitutional crisis","uprising","insurrection","revolution",
    "border closure","refugee crisis","mass migration",
    // keep some of your originals
    "protests","coup","uprising",
  ],
  economic: [
    "bank run","financial collapse","currency crash","default on debt",
    "stock market crash","trade war escalation","energy embargo","food crisis",
    "hyperinflation","supply chain collapse","shortages reported",
    // keep some of your originals
    "sanctions","embargo",
  ],
  transport: [
    "plane crash","aircraft crash","missing aircraft","ship sinking","ferry disaster",
    "oil spill","maritime collision","submarine accident","hijacked plane",
  ],
};

/**
 * Region / hotspot triggers:
 * If these appear, we still consider the item "relevant" even if keywords are weak.
 * (Helps catch headlines that are vague but important.)
 */
const HOTSPOT_TERMS = [
  "gaza","west bank","israel","palestine",
  "ukraine","russia","donetsk","kharkiv","kyiv","odessa",
  "syria","iraq","iran","lebanon","yemen",
  "taiwan strait","south china sea",
  "kabul","afghanistan",
].map((s) => s.toLowerCase());

/**
 * Negative filters to reduce obvious false positives.
 * (Keep this list small + safe; you can add more over time.)
 */
const EXCLUDE_TERMS = [
  "celebrity","oscars","grammys","box office","movie",
  "concert","festival","tv show","premiere",
  "football","soccer","nba","nfl","mlb","nhl","ufc",
  "recipe","fashion","giveaway",
].map((s) => s.toLowerCase());

/**
 * Helpers
 */
function normalizeText(item) {
  const title = (item.title || "").toLowerCase();
  const snippet = (item.contentSnippet || item.content || "").toLowerCase();
  return `${title} ${snippet}`.replace(/\s+/g, " ").trim();
}

function safeDate(item) {
  const d = item.isoDate || item.pubDate;
  const parsed = d ? new Date(d) : null;
  return parsed && !Number.isNaN(parsed.getTime()) ? parsed : null;
}

function containsAny(text, terms) {
  return terms.some((t) => text.includes(t));
}

function getMatchedCategories(text) {
  const categories = [];

  for (const [category, terms] of Object.entries(CRISIS_KEYWORDS)) {
    if (containsAny(text, terms)) categories.push(category);
  }

  return categories;
}

function shouldExclude(text) {
  return containsAny(text, EXCLUDE_TERMS);
}

function isRelevant(text, categories) {
  const hasCrisisKeywords = categories.length > 0;
  const hasHotspot = containsAny(text, HOTSPOT_TERMS);

  // Relevant if it hits at least one crisis category OR a hotspot,
  // but reject if it hits the exclude list (unless it’s strongly crisis-tagged).
  if (shouldExclude(text) && categories.length === 0) return false;

  return hasCrisisKeywords || hasHotspot;
}

async function parseWithTimeout(url, timeoutMs = 7000) {
  return await Promise.race([
    parser.parseURL(url),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`Timeout after ${timeoutMs}ms`)), timeoutMs)
    ),
  ]);
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Edge cache headers (Vercel-friendly)
  res.setHeader("Cache-Control", "public, s-maxage=180, stale-while-revalidate=600");

  try {
    // Fetch feeds in parallel
    const results = await Promise.allSettled(
      FEEDS.map((f) => parseWithTimeout(f.url, 7000))
    );

    let items = [];

    for (let i = 0; i < results.length; i++) {
      const r = results[i];
      const feedInfo = FEEDS[i];

      if (r.status !== "fulfilled") {
        console.error("Error fetching feed:", feedInfo.url, r.reason);
        continue;
      }

      const feed = r.value;
      const feedItems = Array.isArray(feed.items) ? feed.items : [];

      // Keep feed from dominating
      const limited = feedItems.slice(0, 40);

      for (const item of limited) {
        if (!item?.title || !item?.link) continue;

        const text = normalizeText(item);
        const categories = getMatchedCategories(text);

        if (!isRelevant(text, categories)) continue;

        items.push({
          ...item,
          __source: feedInfo.source,
          __categories: categories.length ? categories : ["hotspot"],
        });
      }
    }

    // De-dupe: prefer link; if missing, fall back to title
    const seen = new Set();
    items = items.filter((item) => {
      const key = (item.link || "").trim() || (item.title || "").trim();
      if (!key) return false;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    // Sort newest first
    items.sort((a, b) => {
      const da = safeDate(a);
      const db = safeDate(b);
      return (db?.getTime() || 0) - (da?.getTime() || 0);
    });

    // Limit to 50 items
    items = items.slice(0, 50);

    // Sanitize for frontend (+ add useful metadata)
    const sanitized = items.map((item) => {
      const d = safeDate(item);
      return {
        title: item.title,
        link: item.link,
        pubDate: d ? d.toISOString() : item.pubDate || item.isoDate || null,
        contentSnippet: item.contentSnippet || item.content || "",
        source: item.__source || null,
        categories: item.__categories || [],
      };
    });

    return res.status(200).json(sanitized);
  } catch (err) {
    console.error("News API failed:", err);
    return res.status(200).json([]); // graceful empty response
  }
}
