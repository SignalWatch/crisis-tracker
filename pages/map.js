// File: pages/map.js
import dynamic from "next/dynamic";
import { useEffect, useState, useMemo } from "react";

const MapClient = dynamic(() => import("../components/MapClient"), {
  ssr: false,
  loading: () => (
    <div style={{ color: "#fff", padding: 20, textAlign: "center" }}>
      Loading map...
    </div>
  ),
});

// ----------------------------
// Helpers
// ----------------------------
const normalizeText = (s = "") =>
  s
    .toLowerCase()
    .replace(/[^\w\s]/g, " ") // remove punctuation
    .replace(/\s+/g, " ")
    .trim();

// Your urgency logic (same colors as your index page)
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
  "intercepted missile",
  "bombing",
  "suicide bombing",
  "terror attack",
  "terrorist attack",
  "massacre",
  "mass killing",
  "civilian deaths",
  "deadliest",
  "hostage crisis",
  "assassination",
  "explosion",
  "shelling",
  "chemical attack",
  "biological attack",
  "radiological attack",
  "nuclear strike",
  "rocket strike",
  "air raid",
  "armed clash",
  "military engagement",
  "cross-border attack",
  "siege",
  "bomb threat",
  "terror plot",
  "suicide attack",
  "military raid",
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
  "hebron",
  "gaza strip",
  "west bank",
];

const getUrgencyColor = (title = "") => {
  const text = normalizeText(title);

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
    "troop deployment",
    "mobilization",
    "martial law",
    "armed conflict",
    "direct conflict",

    "evacuate immediately",
    "evacuation ordered",
    "mandatory evacuation",
    "leave immediately",
    "get out now",
    "border closed",
    "airspace closed",
    "embassy evacuates",
    "embassy closed",
    "emergency departure",
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
    "hit infrastructure",
    "strikes infrastructure",
    "hits infrastructure",
    "destroys infrastructure",
  ];

  const medium = [
    "military buildup",
    "troops massing",
    "forces deployed",
    "warships deployed",
    "fighter jets",
    "military drills",
    "combat readiness",

    "rising tensions",
    "escalating tensions",
    "clashes reported",
    "exchange of fire",
    "skirmishes",
    "ceasefire violation",

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
    "hack",
    "hackers",
    "hacking",
    "cyber breach",
    "espionage",
    "malware",
    "security breach",
    "targeted attack",
    "data theft",

    "talks collapse",
    "peace talks stall",
    "sanctions threatened",
    "tariff",
    "tariffs",
    "trade sanctions",
    "economic coercion",
    "economic pressure",
    "tense",
    "tensions",
    "extremely tense",
    "diplomatic solution",
    "diplomacy",
    "negotiation",
    "mediate",
    "mediation",
    "discuss",
    "dialogue",
    "urgent talks",
    "crisis talks",
    "high-level meeting",
    "summit",
    "summit talks",
    "diplomatic efforts",
    "conflict resolution",
    "peace negotiations",
    "intense negotiations",

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
    CONFLICT_REGIONS.some((region) =>
      new RegExp(`\\b${trigger}\\b|\\b${region}\\b`, "i").test(title)
    )
  );

  if (hasHigh) return "#ff4d4f";
  if (hasKilled && hasRedContext) return "#ff4d4f";
  if (hasDiplomacyRed) return "#ff4d4f";
  if (isGlobalAttack) return "#ff4d4f";
  if (hasMedium || hasKilled) return "#fa8c16";
  return "#1890ff";
};

// ----------------------------
// Country coords + aliases
// ----------------------------
const COUNTRY_COORDS = {
  ukraine: [48.3794, 31.1656],
  russia: [61.524, 105.3188],
  israel: [31.0461, 34.8516],
  palestine: [31.9522, 35.2332],
  gaza: [31.5017, 34.4668],
  iran: [32.4279, 53.688],
  syria: [34.8021, 38.9968],
  iraq: [33.2232, 43.6793],
  yemen: [15.5527, 48.5164],
  afghanistan: [33.9391, 67.71],
  china: [35.8617, 104.1954],
  "north korea": [40.3399, 127.5101],
  "south korea": [35.9078, 127.7669],
  taiwan: [23.6978, 120.9605],
  france: [46.2276, 2.2137],
  germany: [51.1657, 10.4515],
  "united states": [37.0902, -95.7129],
  mexico: [23.6345, -102.5528],
  brazil: [-14.235, -51.9253],
  "south africa": [-30.5595, 22.9375],

};

// Aliases that should map to keys in COUNTRY_COORDS
const COUNTRY_ALIASES = {
  // US variants
  "u s": "united states",
  "u s a": "united states",
  usa: "united states",
  "u.s": "united states",
  "u.s.": "united states",
  america: "united states",
  american: "united states",

  // Ukraine
  kyiv: "ukraine",
  kiev: "ukraine",
  kharkiv: "ukraine",
  kherson: "ukraine",
  odesa: "ukraine",
  odessa: "ukraine",
  donetsk: "ukraine",
  luhansk: "ukraine",
  mariupol: "ukraine",

  // Israel / Palestine / Gaza
  jerusalem: "israel",
  "tel aviv": "israel",
  haifa: "israel",
  "gaza city": "gaza",
  rafah: "gaza",
  "khan yunis": "gaza",
  hebron: "palestine",
  ramallah: "palestine",
  nablus: "palestine",

  // Russia
  moscow: "russia",
  "st petersburg": "russia",
  "saint petersburg": "russia",
  belgorod: "russia",
  krasnodar: "russia",

  // Iran
  tehran: "iran",
  isfahan: "iran",

  // Syria
  damascus: "syria",
  aleppo: "syria",
  idlib: "syria",

  // Iraq
  baghdad: "iraq",
  mosul: "iraq",

  // Yemen
  sanaa: "yemen",
  aden: "yemen",

  // Afghanistan
  kabul: "afghanistan",
  kandahar: "afghanistan",

  // China / Taiwan
  beijing: "china",
  shanghai: "china",
  wuhan: "china",
  taipei: "taiwan",

  // Common regional wording
  "gaza strip": "gaza",
  "west bank": "palestine",
};

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const hasWholeWord = (text, phrase) => {
  // phrase can be multi-word (e.g., "south africa")
  const pattern = new RegExp(`\\b${escapeRegex(phrase)}\\b`, "i");
  return pattern.test(text);
};

const findCountryCoordsFromTitle = (rawTitle = "") => {
  const t = normalizeText(rawTitle);

  // 1) Prefer the longest direct COUNTRY_COORDS matches first
  const directKeys = Object.keys(COUNTRY_COORDS).sort((a, b) => b.length - a.length);
  for (const key of directKeys) {
    if (hasWholeWord(t, key)) {
      return { country: key, coords: COUNTRY_COORDS[key] };
    }
  }

  // 2) Then aliases (also longest first)
  const aliasKeys = Object.keys(COUNTRY_ALIASES).sort((a, b) => b.length - a.length);
  for (const alias of aliasKeys) {
    if (hasWholeWord(t, alias)) {
      const canonical = COUNTRY_ALIASES[alias];
      const coords = COUNTRY_COORDS[canonical];
      if (coords) return { country: canonical, coords };
    }
  }

  return null;
};


export default function MapPage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSource, setSelectedSource] = useState("all");
  const [selectedUrgency, setSelectedUrgency] = useState("all");
  const [timeRange, setTimeRange] = useState("all");

  useEffect(() => {
    fetch("/api/news")
      .then((res) => res.json())
      .then((data) => {
        setNews(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Map fetch error:", err);
        setLoading(false);
      });
  }, []);

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
        : timeRange === "7d" ? 7 * 24 * 60 * 60 * 1000
          : null;

    return news.filter((item) => {
      if (selectedSource !== "all" && item.source !== selectedSource) return false;

      const urgencyColor = getUrgencyColor(item.title || "");
      if (selectedUrgency !== "all") {
        const matchesUrgency =
          (selectedUrgency === "red" && urgencyColor === "#ff4d4f")
          || (selectedUrgency === "orange" && urgencyColor === "#fa8c16")
          || (selectedUrgency === "blue" && urgencyColor === "#1890ff");
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
  }, [news, searchQuery, selectedSource, selectedUrgency, timeRange]);

  const markers = useMemo(() => {
    return filteredNews
      .map((item) => {
        const urgencyColor = getUrgencyColor(item.title || "");
        const match = findCountryCoordsFromTitle(item.title || "");
        if (!match) return null;

        const urgencyLabel =
          urgencyColor === "#ff4d4f" ? "High"
            : urgencyColor === "#fa8c16" ? "Elevated"
              : "Low";

        return {
          title: item.title,
          lat: match.coords[0],
          lng: match.coords[1],
          urgency: urgencyLabel,
          urgencyColor,
          link: item.link,
          country: match.country,
          source: item.source,
          dateText: item.pubDate ? new Date(item.pubDate).toLocaleString() : "",
        };
      })
      .filter(Boolean);
  }, [filteredNews]);

  const matchedCount = markers.length;
  const totalCount = news.length;
  const filteredCount = filteredNews.length;

  return (
    <div style={{ minHeight: "100vh", color: "#fff", padding: 20 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <h1 style={{ margin: 0, fontSize: 34, fontWeight: 900 }}>Crisis Map</h1>

          <div style={{ display: "flex", gap: 10 }}>
            <a href="/" style={linkStyle}>Home</a>
            <a href="/dashboard" style={linkStyle}>Dashboard</a>
            <a href="/newsletter" style={linkStyle}>Newsletter</a>
          </div>
        </div>

        <p style={{ color: "#aaa", marginTop: 6 }}>
          Filter and explore urgent stories plotted by country mentions in headlines.
        </p>

        <div
          style={{
            marginTop: 16,
            display: "grid",
            gap: 12,
            gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
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
              style={controlInputStyle}
            />
          </label>

          <label style={{ color: "#ccc", fontSize: 12, fontWeight: 700 }}>
            Source
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              style={controlInputStyle}
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
              style={controlInputStyle}
            >
              <option value="all" style={{ color: "#111" }}>All urgency</option>
              <option value="red" style={{ color: "#111" }}>High (Red)</option>
              <option value="orange" style={{ color: "#111" }}>Elevated (Orange)</option>
              <option value="blue" style={{ color: "#111" }}>Low (Blue)</option>
            </select>
          </label>

          <label style={{ color: "#ccc", fontSize: 12, fontWeight: 700 }}>
            Time range
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              style={controlInputStyle}
            >
              <option value="all" style={{ color: "#111" }}>All time</option>
              <option value="24h" style={{ color: "#111" }}>Last 24 hours</option>
              <option value="7d" style={{ color: "#111" }}>Last 7 days</option>
            </select>
          </label>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
              color: "#bbb",
              fontSize: 12,
              background: "rgba(0,0,0,0.4)",
              borderRadius: 10,
              padding: "10px 12px",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            <div>Stories loaded: <b>{totalCount}</b></div>
            <div>After filters: <b>{filteredCount}</b></div>
            <div>Mapped markers: <b>{matchedCount}</b></div>
          </div>
        </div>

        {loading && (
          <p style={{ textAlign: "center", marginTop: 20 }}>Loading map data...</p>
        )}

        {!loading && (
          <>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 16, color: "#aaa", fontSize: 12 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff4d4f" }} />
                High urgency
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#fa8c16" }} />
                Elevated urgency
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#1890ff" }} />
                Low urgency
              </span>
            </div>

            {markers.length === 0 ? (
              <div
                style={{
                  marginTop: 16,
                  padding: 20,
                  borderRadius: 12,
                  background: "rgba(0,0,0,0.35)",
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
              >
                <strong>No markers match these filters.</strong>
                <div style={{ color: "#aaa", marginTop: 6 }}>
                  Try broadening the search, selecting “All urgency,” or expanding the time range.
                </div>
              </div>
            ) : (
              <div
                style={{
                  marginTop: 16,
                  borderRadius: 14,
                  overflow: "hidden",
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
              >
                <MapClient markers={markers} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const linkStyle = {
  color: "#fff",
  textDecoration: "none",
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.12)",
  padding: "8px 12px",
  borderRadius: 10,
  fontWeight: 800,
  fontSize: 14,
};

const controlInputStyle = {
  marginTop: 6,
  width: "100%",
  padding: "10px 12px",
  borderRadius: 8,
  border: "1px solid rgba(255,255,255,0.15)",
  background: "rgba(0,0,0,0.5)",
  color: "#fff",
};
