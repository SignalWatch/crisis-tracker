// File: pages/index.js
// Date: 2026-01-16
import { useEffect, useMemo, useState } from "react";

// Country → Flag map
const COUNTRY_FLAGS = {
  // ======================
  // United States
  // ======================

  "united states": "🇺🇸",
  "united states of america": "🇺🇸",
  "usa": "🇺🇸",
  "u.s.": "🇺🇸",
  "u s": "🇺🇸",
  "us": "🇺🇸",
  "america": "🇺🇸",
  "american": "🇺🇸",

  // ======================
  // Russia / Ukraine region
  // ======================
  "russia": "🇷🇺",
  "russian": "🇷🇺",

  "ukraine": "🇺🇦",
  "ukrainian": "🇺🇦",

  "belarus": "🇧🇾",
  "belarusian": "🇧🇾",

  "moldova": "🇲🇩",
  "moldovan": "🇲🇩",

  "estonia": "🇪🇪",
  "estonian": "🇪🇪",

  "latvia": "🇱🇻",
  "latvian": "🇱🇻",

  "lithuania": "🇱🇹",
  "lithuanian": "🇱🇹",

  "georgia": "🇬🇪",
  "georgian": "🇬🇪",

  "armenia": "🇦🇲",
  "armenian": "🇦🇲",

  "azerbaijan": "🇦🇿",
  "azerbaijani": "🇦🇿",

  "kazakhstan": "🇰🇿",
  "kazakh": "🇰🇿",

  "uzbekistan": "🇺🇿",
  "uzbek": "🇺🇿",

  "turkmenistan": "🇹🇲",
  "turkmen": "🇹🇲",

  "tajikistan": "🇹🇯",
  "tajik": "🇹🇯",

  "kyrgyzstan": "🇰🇬",
  "kyrgyz": "🇰🇬",

  // ======================
  // China / Taiwan / East Asia
  // ======================

  "china": "🇨🇳",
  "chinese": "🇨🇳",

  "japan": "🇯🇵",
  "japanese": "🇯🇵",

  "north korea": "🇰🇵",
  "north korean": "🇰🇵",

  "south korea": "🇰🇷",
  "south korean": "🇰🇷",

  "taiwan": "🇹🇼",
  "taiwanese": "🇹🇼",

  "mongolia": "🇲🇳",
  "mongolian": "🇲🇳",

  "hong kong": "🇭🇰",
  "hongkonger": "🇭🇰",
  "hk": "🇭🇰",

  "macau": "🇲🇴",
  "macaense": "🇲🇴",

  // ======================
  // Middle East
  // ======================

  "bahrain": "🇧🇭",
  "bahraini": "🇧🇭",

  "cyprus": "🇨🇾",
  "cypriot": "🇨🇾",

  "egypt": "🇪🇬",
  "egyptian": "🇪🇬",

  "iran": "🇮🇷",
  "iranian": "🇮🇷",

  "iraq": "🇮🇶",
  "iraqi": "🇮🇶",

  "israel": "🇮🇱",
  "israeli": "🇮🇱",

  "jordan": "🇯🇴",
  "jordanian": "🇯🇴",

  "kuwait": "🇰🇼",
  "kuwaiti": "🇰🇼",

  "lebanon": "🇱🇧",
  "lebanese": "🇱🇧",

  "oman": "🇴🇲",
  "omani": "🇴🇲",

  "palestine": "🇵🇸",
  "palestinian": "🇵🇸",

  "qatar": "🇶🇦",
  "qatari": "🇶🇦",

  "saudi arabia": "🇸🇦",
  "saudi": "🇸🇦",
  "saudi arabian": "🇸🇦",

  "syria": "🇸🇾",
  "syrian": "🇸🇾",

  "turkey": "🇹🇷",
  "turkish": "🇹🇷",

  "united arab emirates": "🇦🇪",
  "uae": "🇦🇪",
  "emirati": "🇦🇪",

  "yemen": "🇾🇪",
  "yemeni": "🇾🇪",

  // ======================
  // South & Central Asia
  // ======================
  "afghanistan": "🇦🇫",
  "afghan": "🇦🇫",

  "pakistan": "🇵🇰",
  "pakistani": "🇵🇰",

  "india": "🇮🇳",
  "indian": "🇮🇳",

  "bangladesh": "🇧🇩",
  "bangladeshi": "🇧🇩",

  "sri lanka": "🇱🇰",
  "sri lankan": "🇱🇰",

  // ======================
  // Europe
  // ======================
  "united kingdom": "🇬🇧",
  "uk": "🇬🇧",
  "britain": "🇬🇧",
  "british": "🇬🇧",

  "france": "🇫🇷",
  "french": "🇫🇷",

  "germany": "🇩🇪",
  "german": "🇩🇪",

  "italy": "🇮🇹",
  "italian": "🇮🇹",

  "spain": "🇪🇸",
  "spanish": "🇪🇸",

  "portugal": "🇵🇹",
  "portuguese": "🇵🇹",

  "netherlands": "🇳🇱",
  "dutch": "🇳🇱",

  "belgium": "🇧🇪",
  "belgian": "🇧🇪",

  "sweden": "🇸🇪",
  "swedish": "🇸🇪",

  "norway": "🇳🇴",
  "norwegian": "🇳🇴",

  "finland": "🇫🇮",
  "finnish": "🇫🇮",

  "denmark": "🇩🇰",
  "danish": "🇩🇰",

  "poland": "🇵🇱",
  "polish": "🇵🇱",

  "czech republic": "🇨🇿",
  "czech": "🇨🇿",

  "slovakia": "🇸🇰",
  "slovak": "🇸🇰",

  "hungary": "🇭🇺",
  "hungarian": "🇭🇺",

  "austria": "🇦🇹",
  "austrian": "🇦🇹",

  "switzerland": "🇨🇭",
  "swiss": "🇨🇭",

  "ireland": "🇮🇪",
  "irish": "🇮🇪",

  "greece": "🇬🇷",
  "greek": "🇬🇷",

  // ======================
  // Africa
  // ======================
  "south africa": "🇿🇦",
  "south african": "🇿🇦",

  "nigeria": "🇳🇬",
  "nigerian": "🇳🇬",

  "ethiopia": "🇪🇹",
  "ethiopian": "🇪🇹",

  "kenya": "🇰🇪",
  "kenyan": "🇰🇪",

  "sudan": "🇸🇩",
  "sudanese": "🇸🇩",

  "somalia": "🇸🇴",
  "somali": "🇸🇴",

  "uganda": "🇺🇬",
  "ugandan": "🇺🇬",

  "ghana": "🇬🇭",
  "ghanaian": "🇬🇭",

  // ======================
  // Americas
  // ======================
  "canada": "🇨🇦",
  "canadian": "🇨🇦",

  "mexico": "🇲🇽",
  "mexican": "🇲🇽",

  "brazil": "🇧🇷",
  "brazilian": "🇧🇷",

  "argentina": "🇦🇷",
  "argentine": "🇦🇷",

  "colombia": "🇨🇴",
  "colombian": "🇨🇴",

  "chile": "🇨🇱",
  "chilean": "🇨🇱",

  "peru": "🇵🇪",
  "peruvian": "🇵🇪",

  // ======================
  // Oceania
  // ======================
  "australia": "🇦🇺",
  "australian": "🇦🇺",

  "new zealand": "🇳🇿",
  "new zealander": "🇳🇿",
};

// Leader → Country map
const LEADER_TO_COUNTRY = {
  // --- US
  "biden": "🇺🇸",
  "president biden": "🇺🇸",
  "white house": "🇺🇸",
  "pentagon": "🇺🇸",
  "u.s.": "🇺🇸",
  "u.s": "🇺🇸",
  "us": "🇺🇸",

  // --- Russia
  "putin": "🇷🇺",
  "kremlin": "🇷🇺",
  "moscow": "🇷🇺",

  // --- Ukraine
  "zelensky": "🇺🇦",
  "zelenskyy": "🇺🇦",
  "kyiv": "🇺🇦",

  // --- China
  "xi": "🇨🇳",
  "beijing": "🇨🇳",

  // --- North Korea
  "kim jong-un": "🇰🇵",
  "pyongyang": "🇰🇵",

  // --- Israel
  "netanyahu": "🇮🇱",
  "jerusalem": "🇮🇱",

  // --- Iran
  "tehran": "🇮🇷",
  "khamenei": "🇮🇷",

  // --- UK
  "london": "🇬🇧",
  "downing street": "🇬🇧",
};

// Simple helper: detect flags in the title
const getFlagsFromTitle = (title = "") => {
  const flags = new Set();
  const lower = title.toLowerCase();

  // country flags
  for (const key in COUNTRY_FLAGS) {
    if (lower.includes(key)) flags.add(COUNTRY_FLAGS[key]);
  }

  // leader flags
  for (const key in LEADER_TO_COUNTRY) {
    if (lower.includes(key)) flags.add(LEADER_TO_COUNTRY[key]);
  }

  return Array.from(flags);
};

// --- Urgency logic (same as your original) ---
const KILLED_RED_TRIGGERS = [
  "at least",
  "dozens",
  "scores",
  "hundreds",
  "multiple",
  "mass",
  "massacre",
  "civilians",
  "children",
  "journalists",
  "aid workers",
  "airstrike",
  "air strike",
  "missile",
  "bombing",
  "explosion",
  "shelling",
  "strike",
  "strikes",
];

const DIPLOMACY_RED_TRIGGERS = [
  "extremely tense",
  "urgent talks",
  "crisis meeting",
  "emergency summit",
  "high alert",
  "diplomatic emergency",
  "imminent conflict",
  "potential war",
  "red alert",
];

const GLOBAL_ATTACK_TRIGGERS = [
  "drone attack",
  "drone attacks",
  "drone strike",
  "drone strikes",
  "airstrike",
  "air strike",
  "missile strike",
  "rocket attack",
  "ballistic missile",
  "cruise missile",
  "bombing",
  "suicide bombing",
  "terror attack",
  "terrorist attack",
  "massacre",
  "assassination",
  "explosion",
  "shelling",
  "chemical attack",
  "biological attack",
  "radiological attack",
  "nuclear strike",
  "air raid",
  "armed clash",
  "cross-border attack",
  "siege",
  "bomb threat",
  "terror plot",
  "large-scale raid",
];

const CONFLICT_REGIONS = [
  "ukraine",
  "russia",
  "syria",
  "iran",
  "iraq",
  "lebanon",
  "afghanistan",
  "yemen",
  "palestine",
  "gaza",
  "israel",
  "odessa",
  "kyiv",
  "kiev",
  "donetsk",
  "kharkiv",
  "luhansk",
  "west bank",
];

const getUrgencyColor = (title = "") => {
  const text = title.toLowerCase().replace(/[^\w\s]/g, " ");

  const high = [
    "war declared",
    "state of war",
    "full-scale invasion",
    "full scale invasion",
    "invasion",
    "nuclear",
    "nuclear threat",
    "nuclear warning",
    "nuclear strike",
    "military escalation",
    "escalation",
    "troops deployed",
    "mobilization",
    "martial law",
    "armed conflict",
    "direct conflict",

    "evacuate immediately",
    "evacuation ordered",
    "mandatory evacuation",
    "leave immediately",
    "border closed",
    "airspace closed",
    "embassy evacuates",
    "citizens urged to leave",
    "do not travel",

    "state of emergency",
    "emergency declaration",
    "red alert",
    "alert level raised",

    "chemical weapons",
    "biological threat",
    "radiological threat",
    "dirty bomb",

    "nationwide blackout",
    "critical infrastructure",
  ];

  const medium = [
    "military buildup",
    "troops massing",
    "forces deployed",
    "warships deployed",
    "fighter jets",
    "military drills",
    "rising tensions",
    "escalating tensions",
    "clashes reported",
    "exchange of fire",
    "skirmishes",
    "travel advisory",
    "security warning",
    "shelter in place",
    "curfew imposed",
    "protests erupt",
    "violent protests",
    "civil unrest",
    "riots",
    "crackdown",
    "cyberattack",
    "communications disrupted",
    "transport disrupted",
    "hacking",
    "malware",
    "security breach",
    "talks collapse",
    "peace talks stall",
    "sanctions threatened",
    "tariffs",
    "trade sanctions",
    "summit",
    "urgent talks",
    "crisis talks",
    "diplomacy",
    "killed",
    "dead",
    "death",
    "fatal",
    "fatalities",
  ];

  const hasHigh = high.some((w) => text.includes(w));
  const hasMedium = medium.some((w) => text.includes(w));
  const hasKilled = text.includes("killed") || text.includes("dead");
  const hasRedContext = KILLED_RED_TRIGGERS.some((w) => text.includes(w));
  const hasDiplomacyRed = DIPLOMACY_RED_TRIGGERS.some((w) => text.includes(w));

  const isGlobalAttack = GLOBAL_ATTACK_TRIGGERS.some((trigger) =>
    CONFLICT_REGIONS.some((region) => new RegExp(`\\b${trigger}\\b|\\b${region}\\b`, "i").test(title))
  );

  if (hasHigh) return "#ff4d4f";
  if (hasKilled && hasRedContext) return "#ff4d4f";
  if (hasDiplomacyRed) return "#ff4d4f";
  if (isGlobalAttack) return "#ff4d4f";
  if (hasMedium || hasKilled) return "#fa8c16";
  return "#1890ff";
};

// Get first red headline for breaking banner
const getBreakingHeadline = (news) => news.find((item) => item.urgencyColor === "#ff4d4f");

const getSourceNameFromLink = (url = "") => {
  try {
    const host = new URL(url).hostname.replace("www.", "");
    if (host.includes("bbc")) return "BBC";
    if (host.includes("aljazeera")) return "Al Jazeera";
    if (host.includes("news.google")) return "Google News";
    return host;
  } catch {
    return "Source";
  }
};

const snippetToBullets = (snippet = "") => {
  const clean = snippet.replace(/\s+/g, " ").trim();
  if (!clean) return [];

  // split on sentence boundaries
  const sentences = clean.split(/(?<=[.!?])\s+/).filter(Boolean);

  // up to 4 bullets
  return sentences.slice(0, 4).map((s) => s.replace(/^[•\-]\s*/, "").trim());
};

// --- Related stories (fast overlap scoring; no heavy NLP) ---
const STOP_WORDS = new Set([
  "the","a","an","and","or","but","to","of","in","on","for","with","at","by","from","as",
  "is","are","was","were","be","been","it","its","this","that","these","those","after",
  "before","over","under","into","out","about","amid","says","say","new","latest","live",
  "update","breaking",
]);

const tokenize = (text = "") =>
  text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .filter((w) => w.length >= 3 && !STOP_WORDS.has(w));

const jaccardSimilarity = (aTokens, bTokens) => {
  const A = new Set(aTokens);
  const B = new Set(bTokens);
  if (A.size === 0 || B.size === 0) return 0;

  let intersection = 0;
  for (const t of A) if (B.has(t)) intersection++;

  const union = A.size + B.size - intersection;
  return union ? intersection / union : 0;
};

export default function Home() {
  const [news, setNews] = useState([]); // precomputed view-model items
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [breaking, setBreaking] = useState(null);
  const [showOnlyRed, setShowOnlyRed] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSource, setSelectedSource] = useState("all");
  const [selectedUrgency, setSelectedUrgency] = useState("all");
  const [timeRange, setTimeRange] = useState("7d");

  useEffect(() => {
    const fetchNews = () => {
      const limit = timeRange === "30d" ? 200 : 100;
      fetch(`/api/news?range=${encodeURIComponent(timeRange)}&limit=${limit}`)
        .then((res) => res.json())
        .then((data) => {
          const mapped = (Array.isArray(data) ? data : []).map((item) => {
            const urgencyColor = getUrgencyColor(item.title);
            const flags = getFlagsFromTitle(item.title);
            const source = item.source || getSourceNameFromLink(item.link);
            const dateText = item.pubDate ? new Date(item.pubDate).toLocaleString() : "";

            // tokens once for related-scoring
            const tokens = tokenize(`${item.title || ""} ${item.contentSnippet || ""}`);

            return {
              ...item,
              urgencyColor,
              flags,
              source,
              dateText,
              tokens,
            };
          });

          // Sort newest first
          mapped.sort((a, b) => {
            const da = a.pubDate ? new Date(a.pubDate).getTime() : 0;
            const db = b.pubDate ? new Date(b.pubDate).getTime() : 0;
            return db - da;
          });

          setNews(mapped);
          setBreaking(getBreakingHeadline(mapped));
          setLoading(false);
          setLastUpdated(new Date());
        })
        .catch((err) => console.error("Failed to fetch news:", err));
    };

    fetchNews();
    const interval = setInterval(fetchNews, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [timeRange]);

  const sources = useMemo(() => {
    const unique = new Set();
    news.forEach((item) => {
      if (item.source) unique.add(item.source);
    });
    return ["all", ...Array.from(unique).sort((a, b) => a.localeCompare(b))];
  }, [news]);

  const filteredNews = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const now = Date.now();
    const timeMs =
      timeRange === "24h" ? 24 * 60 * 60 * 1000
        : timeRange === "30d" ? 30 * 24 * 60 * 60 * 1000
          : 7 * 24 * 60 * 60 * 1000;

    return news.filter((item) => {
      if (showOnlyRed && item.urgencyColor !== "#ff4d4f") return false;

      if (selectedSource !== "all" && item.source !== selectedSource) return false;

      if (selectedUrgency !== "all") {
        const matchesUrgency =
          (selectedUrgency === "red" && item.urgencyColor === "#ff4d4f")
          || (selectedUrgency === "orange" && item.urgencyColor === "#fa8c16")
          || (selectedUrgency === "blue" && item.urgencyColor === "#1890ff");
        if (!matchesUrgency) return false;
      }

      if (timeMs && item.pubDate) {
        const itemTime = new Date(item.pubDate).getTime();
        if (!Number.isNaN(itemTime) && now - itemTime > timeMs) return false;
      }

      if (query) {
        const haystack = `${item.title || ""} ${item.contentSnippet || ""} ${item.source || ""}`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }

      return true;
    });
  }, [news, searchQuery, selectedSource, selectedUrgency, timeRange, showOnlyRed]);

  // Related stories computed only when modal story changes
  const related = useMemo(() => {
    if (!selectedStory) return [];
    const baseTokens = selectedStory.tokens || tokenize(`${selectedStory.title || ""} ${selectedStory.contentSnippet || ""}`);

    const scored = news
      .filter((n) => n && n.link && n.link !== selectedStory.link)
      .map((n) => {
        const score = jaccardSimilarity(baseTokens, n.tokens || []);
        return { ...n, _score: score };
      })
      .filter((n) => n._score > 0.08)
      .sort((a, b) => b._score - a._score)
      .slice(0, 4);

    return scored;
  }, [selectedStory, news]);

  return (
    <div style={{ minHeight: "100vh", width: "100%", color: "#fff" }}>
      <div
        style={{
          minHeight: "100vh",
          width: "100%",
          backgroundColor: "rgba(0,0,0,0.25)",
          padding: 20,
        }}
      >
        <div
          style={{
            maxWidth: 1000,
            margin: "0 auto",
            fontFamily: "Arial, sans-serif",
          }}
        >
          <header style={{ textAlign: "center", marginBottom: 20 }}>
  <h1
    style={{
      fontSize: 42,
      fontWeight: 800,
      color: "#fff",
      textShadow: "0 0 8px #aaa, 0 0 12px #aaa",
      letterSpacing: 1.2,
      margin: 0,
    }}
  >
    Signal Watch Global
  </h1>

  {/* ✅ NAVBAR directly under title */}
  <nav
    style={{
      marginTop: 10,
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      padding: "10px 12px",
      borderRadius: 12,
      background: "rgba(0,0,0,0.45)",
      border: "1px solid rgba(255,255,255,0.12)",
      boxShadow: "0 6px 18px rgba(0,0,0,0.35)",
      backdropFilter: "blur(10px)",
    }}
  >
    <a
      href="/"
      style={{
        color: "#fff",
        textDecoration: "none",
        background: "rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.12)",
        padding: "8px 12px",
        borderRadius: 10,
        fontWeight: 800,
        fontSize: 14,
      }}
    >
      Home
    </a>

    <a
      href="/dashboard"
      style={{
        color: "#fff",
        textDecoration: "none",
        background: "rgba(255,255,255,0.10)",
        border: "1px solid rgba(255,255,255,0.15)",
        padding: "8px 12px",
        borderRadius: 10,
        fontWeight: 800,
        fontSize: 14,
      }}
    >
      Dashboard
    </a>
    <a href="/map" 
    style={{
        color: "#fff",
        textDecoration: "none",
        background: "rgba(255,255,255,0.10)",
        border: "1px solid rgba(255,255,255,0.15)",
        padding: "8px 12px",
        borderRadius: 10,
        fontWeight: 800,
        fontSize: 14,
      }}>
  Map
</a>

  </nav>

  <p style={{ fontSize: 18, color: "#aaa", marginTop: 10, marginBottom: 0 }}>
    Live Global Crisis Tracker
  </p>

  {lastUpdated && (
    <p style={{ fontSize: 12, color: "#aaa", marginTop: 6, marginBottom: 0 }}>
      Last updated: {lastUpdated.toLocaleTimeString()}
    </p>
  )}
</header>


          {/* Filters */}
          <div
            style={{
              marginBottom: 26,
              display: "grid",
              gap: 12,
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              background: "rgba(0,0,0,0.35)",
              padding: 14,
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            <label style={{ color: "#ccc", fontSize: 12, fontWeight: 700 }}>
              Search
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search headlines, snippets, sources"
                style={{
                  marginTop: 6,
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 8,
                  border: "1px solid rgba(255,255,255,0.15)",
                  background: "rgba(0,0,0,0.5)",
                  color: "#fff",
                }}
              />
            </label>

            <label style={{ color: "#ccc", fontSize: 12, fontWeight: 700 }}>
              Source
              <select
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value)}
                style={{
                  marginTop: 6,
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 8,
                  border: "1px solid rgba(255,255,255,0.15)",
                  background: "rgba(0,0,0,0.5)",
                  color: "#fff",
                }}
              >
                {sources.map((source) => (
                  <option key={source} value={source} style={{ color: "#111" }}>
                    {source === "all" ? "All sources" : source}
                  </option>
                ))}
              </select>
            </label>

            <label style={{ color: "#ccc", fontSize: 12, fontWeight: 700 }}>
              Urgency
              <select
                value={selectedUrgency}
                onChange={(e) => setSelectedUrgency(e.target.value)}
                style={{
                  marginTop: 6,
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 8,
                  border: "1px solid rgba(255,255,255,0.15)",
                  background: "rgba(0,0,0,0.5)",
                  color: "#fff",
                }}
              >
                <option value="all" style={{ color: "#111" }}>All urgency</option>
                <option value="red" style={{ color: "#111" }}>High (Red)</option>
                <option value="orange" style={{ color: "#111" }}>Medium (Orange)</option>
                <option value="blue" style={{ color: "#111" }}>Low (Blue)</option>
              </select>
            </label>

            <label style={{ color: "#ccc", fontSize: 12, fontWeight: 700 }}>
              Time range
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                style={{
                  marginTop: 6,
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 8,
                  border: "1px solid rgba(255,255,255,0.15)",
                  background: "rgba(0,0,0,0.5)",
                  color: "#fff",
                }}
              >
                <option value="24h" style={{ color: "#111" }}>Last 24 hours</option>
                <option value="7d" style={{ color: "#111" }}>Last 7 days (Default)</option>
                <option value="30d" style={{ color: "#111" }}>Archive / History (30 days)</option>
              </select>
            </label>

            <label
              style={{
                fontSize: 12,
                color: "#ccc",
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                cursor: "pointer",
                backgroundColor: "rgba(0,0,0,0.5)",
                padding: "8px 12px",
                borderRadius: 6,
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            >
              <input
                type="checkbox"
                checked={showOnlyRed}
                onChange={() => setShowOnlyRed(!showOnlyRed)}
                style={{ width: 18, height: 18, cursor: "pointer" }}
              />
              High urgency only
            </label>
          </div>

          {/* Breaking banner (kept as external link on purpose) */}
          {breaking && (
            <a
              href={breaking.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none" }}
            >
              <div
                style={{
                  backgroundColor: "#ff4d4f",
                  color: "#fff",
                  padding: "14px 20px",
                  borderRadius: 8,
                  marginBottom: 30,
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  boxShadow: "0 6px 16px rgba(0,0,0,0.4)",
                }}
              >
                <span
                  style={{
                    backgroundColor: "#fff",
                    color: "#ff4d4f",
                    padding: "4px 10px",
                    borderRadius: 4,
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  BREAKING
                </span>
                <span style={{ fontSize: 15 }}>{breaking.title}</span>
              </div>
            </a>
          )}

          {loading && <p style={{ textAlign: "center", color: "#fff" }}>Loading news...</p>}

          <main style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {filteredNews.map((item) => {
                return (
                  <div
                    key={item.id || item.link}
                    onClick={() => setSelectedStory(item)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") setSelectedStory(item);
                    }}
                    style={{ textDecoration: "none" }}
                  >
                    <div
                      style={{
                        padding: 20,
                        borderLeft: `6px solid ${item.urgencyColor}`,
                        borderRadius: 10,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
                        backgroundColor: "rgba(0,0,0,0.6)",
                        transition: "transform 0.15s ease, box-shadow 0.15s ease",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-3px)";
                        e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.6)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.5)";
                      }}
                    >
                      <div style={{ fontWeight: 600, fontSize: 16, color: "#fff" }}>
                        {item.flags?.length > 0 && (
                          <div style={{ fontSize: 18, marginBottom: 6 }}>
                            {item.flags.join(" ")}
                          </div>
                        )}
                        {item.title}
                      </div>

                      <div style={{ fontSize: 12, color: "#aaa", marginTop: 6 }}>
                        {item.dateText} {item.source ? `• ${item.source}` : ""}
                      </div>

                      {item.contentSnippet && (
                        <p style={{ marginTop: 10, color: "#eee", lineHeight: 1.5 }}>
                          {item.contentSnippet}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
          </main>
        </div>
      </div>

      {/* --- MODAL: Rundown + Related Stories --- */}
      {selectedStory && (
        <div
          onClick={() => setSelectedStory(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            padding: 16,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "min(760px, 100%)",
              background: "rgba(15,15,15,0.95)",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.12)",
              boxShadow: "0 12px 40px rgba(0,0,0,0.6)",
              padding: 20,
              color: "#fff",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
              <div style={{ fontWeight: 800, fontSize: 18 }}>
                {selectedStory.title}
              </div>
              <button
                onClick={() => setSelectedStory(null)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#fff",
                  fontSize: 18,
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ fontSize: 12, color: "#aaa", marginTop: 6 }}>
              {selectedStory.dateText} {selectedStory.source ? `• ${selectedStory.source}` : ""}
            </div>

            <div style={{ marginTop: 14 }}>
              {snippetToBullets(selectedStory.contentSnippet || "").map((b, i) => (
                <div key={i} style={{ marginBottom: 6 }}>• {b}</div>
              ))}
            </div>

            <div style={{ marginTop: 16 }}>
              <a
                href={selectedStory.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#fff", fontWeight: 700 }}
              >
                Open full article →
              </a>
            </div>

            {related.length > 0 && (
              <div style={{ marginTop: 22 }}>
                <div style={{ fontWeight: 800, marginBottom: 10 }}>Related stories</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {related.map((r) => (
                    <a
                      key={r.id || r.link}
                      href={r.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#fff", textDecoration: "none" }}
                    >
                      <div style={{ padding: 10, borderRadius: 8, background: "rgba(255,255,255,0.06)" }}>
                        {r.title}
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
