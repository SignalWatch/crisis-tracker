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
};

// Aliases that should map to keys in COUNTRY_COORDS
const COUNTRY_ALIASES = {
  // US variants
  "u s": "united states",
  "u s a": "united states",
  usa: "united states",
  "u.s": "united states",
  "u.s.": "united states",
  us: "united states",
  america: "united states",
  american: "united states",

  // Common regional wording
  "gaza strip": "gaza",
  "west bank": "palestine",
};

const findCountryCoordsFromTitle = (rawTitle = "") => {
  const t = normalizeText(rawTitle);

  // 1) direct match on COUNTRY_COORDS keys
  for (const key of Object.keys(COUNTRY_COORDS)) {
    if (t.includes(key)) return { country: key, coords: COUNTRY_COORDS[key] };
  }

  // 2) alias match
  for (const alias of Object.keys(COUNTRY_ALIASES)) {
    if (t.includes(alias)) {
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

  const markers = useMemo(() => {
    return news
      .map((item) => {
        const urgencyColor = getUrgencyColor(item.title || "");
        const isRedOrOrange = urgencyColor === "#ff4d4f" || urgencyColor === "#fa8c16";
        if (!isRedOrOrange) return null;

        const match = findCountryCoordsFromTitle(item.title || "");
        if (!match) return null;

        return {
          title: item.title,
          lat: match.coords[0],
          lng: match.coords[1],
          urgency: urgencyColor === "#ff4d4f" ? "RED" : "ORANGE",
          link: item.link,
          country: match.country,
        };
      })
      .filter(Boolean);
  }, [news]);

  return (
    <div style={{ minHeight: "100vh", color: "#fff", padding: 20 }}>
      <div style={{ maxWidth: 1000, margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <h1 style={{ margin: 0, fontSize: 34, fontWeight: 900 }}>Crisis Map</h1>

          <div style={{ display: "flex", gap: 10 }}>
            <a href="/" style={linkStyle}>Home</a>
            <a href="/dashboard" style={linkStyle}>Dashboard</a>
          </div>
        </div>

        <p style={{ color: "#aaa", marginTop: 6 }}>
          Showing only high urgency (Red) and elevated (Orange) stories
        </p>

        {/* quick debug so you can confirm it’s working */}
        {!loading && (
          <p style={{ color: "#aaa", marginTop: 6, fontSize: 12 }}>
            Stories loaded: <b>{news.length}</b> • Markers plotted: <b>{markers.length}</b>
          </p>
        )}

        {loading && (
          <p style={{ textAlign: "center", marginTop: 20 }}>Loading map data...</p>
        )}

        {!loading && (
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
