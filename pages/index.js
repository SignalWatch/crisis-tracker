// File: pages/index.js
// Date: 2026-01-16
import { useEffect, useState } from "react";

// Escalation context for deaths → RED
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
  "strikes"
];

// High-urgency diplomatic escalation → RED
const DIPLOMACY_RED_TRIGGERS = [
  "extremely tense",
  "urgent talks",
  "crisis meeting",
  "emergency summit",
  "high alert",
  "diplomatic emergency",
  "imminent conflict",
  "potential war",
  "red alert"
];

// Global attack triggers → RED
const GLOBAL_ATTACK_TRIGGERS = [
  "drone attack",
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
  "suicide attack"
];

// Conflict regions / countries → for context-sensitive global attacks
const CONFLICT_REGIONS = [
  "ukraine",
  "russia",
  "syria",
  "iran",
  "lebanon",
  "gaza",
  "yemen",
  "afghanistan",
  "iraq",
  "venezuela",
  "china",
  "north korea",
  "israel",
  "palestine",
  "saudi arabia",
  "ethiopia",
  "tigray",
  "libya",
  "kyiv",
  "mariupol",
  "donetsk",
  "tehran",
  "damascus",
  "aleppo"
];

// Keyword-based urgency colors
const getUrgencyColor = (title) => {
  // Remove punctuation to prevent misclassification
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
    "troop deployment",
    "mobilization",
    "martial law",
    "armed conflict",
    "direct conflict",

    // Evacuation & citizen warnings
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

    // State emergency alerts
    "state of emergency",
    "emergency declaration",
    "red alert",
    "alert level raised",

    // WMDs
    "chemical weapons",
    "biological threat",
    "radiological threat",
    "dirty bomb",

    // Infrastructure collapse
    "nationwide blackout",
    "critical infrastructure"
  ];

  const medium = [
    // Military movement
    "military buildup",
    "troops massing",
    "forces deployed",
    "warships deployed",
    "fighter jets",
    "military drills",
    "combat readiness",

    // Rising conflict
    "rising tensions",
    "escalating tensions",
    "clashes reported",
    "exchange of fire",
    "skirmishes",
    "ceasefire violation",

    // Government actions
    "travel advisory",
    "security warning",
    "shelter in place",
    "curfew imposed",

    // Unrest
    "protests erupt",
    "violent protests",
    "civil unrest",
    "riots",
    "crackdown",

    // Cyber / infrastructure
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

    // Diplomacy & tension
    "talks collapse",
    "peace talks stall",
    "sanctions threatened",
    "tariff",
    "tariffs",
    "trade sanctions",
    "economic coercion",
    "economic pressure",
    "tense",
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

    // Death baseline
    "killed",
    "dead",
    "death",
    "fatal",
    "fatalities"
  ];

  // Detection flags
  const hasHigh = high.some(word => text.includes(word));
  const hasMedium = medium.some(word => text.includes(word));
  const hasKilled = text.includes("killed") || text.includes("dead");
  const hasRedContext = KILLED_RED_TRIGGERS.some(word => text.includes(word));
  const hasDiplomacyRed = DIPLOMACY_RED_TRIGGERS.some(word => text.includes(word));
  
  // Context-sensitive global attack: only RED if a trigger + conflict region appear
  const isGlobalAttack = GLOBAL_ATTACK_TRIGGERS.some(word => 
    text.includes(word) && CONFLICT_REGIONS.some(region => text.includes(region))
  );

  // Priority:
  if (hasHigh) return "#ff4d4f";                    // RED
  if (hasKilled && hasRedContext) return "#ff4d4f"; // Escalated RED
  if (hasDiplomacyRed) return "#ff4d4f";            // Diplomatic crisis → RED
  if (isGlobalAttack) return "#ff4d4f";            // Major global attack → RED
  if (hasMedium || hasKilled) return "#fa8c16";     // ORANGE
  return "#1890ff";                                  // BLUE
};

// Get first red headline for breaking banner
const getBreakingHeadline = (news) => {
  return news.find((item) => getUrgencyColor(item.title) === "#ff4d4f");
};

export default function Home() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [breaking, setBreaking] = useState(null);
  const [showOnlyRed, setShowOnlyRed] = useState(false);

  useEffect(() => {
    const fetchNews = () => {
      fetch("/api/news")
        .then((res) => res.json())
        .then((data) => {
          const sorted = data.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
          setNews(sorted);
          setBreaking(getBreakingHeadline(sorted));
          setLoading(false);
          setLastUpdated(new Date());
        })
        .catch((err) => console.error("Failed to fetch news:", err));
    };

    fetchNews();
    const interval = setInterval(fetchNews, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: 20, fontFamily: "Arial, sans-serif" }}>
      <header style={{ textAlign: "center", marginBottom: 20 }}>
        <h1 style={{ fontSize: 36, color: "#222" }}>SignalWatchGlobal</h1>
        <p style={{ fontSize: 18, color: "#555" }}>Live Global Crisis Tracker</p>
        {lastUpdated && <p style={{ fontSize: 12, color: "#888" }}>Last updated: {lastUpdated.toLocaleTimeString()}</p>}
      </header>

      {/* Red toggle */}
      <div style={{ marginBottom: 30, textAlign: "center" }}>
        <label
          style={{
            fontSize: 16,
            color: "#222",
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            cursor: "pointer",
            backgroundColor: "#f5f5f5",
            padding: "8px 12px",
            borderRadius: 6,
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
          }}
        >
          <input
            type="checkbox"
            checked={showOnlyRed}
            onChange={() => setShowOnlyRed(!showOnlyRed)}
            style={{ width: 18, height: 18, cursor: "pointer" }}
          />
          Show only high-urgency news
        </label>
      </div>

      {/* Breaking banner */}
      {breaking && (
        <a href={breaking.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
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
              boxShadow: "0 6px 16px rgba(0,0,0,0.15)"
            }}
          >
            <span
              style={{
                backgroundColor: "#fff",
                color: "#ff4d4f",
                padding: "4px 10px",
                borderRadius: 4,
                fontSize: 12,
                fontWeight: 700
              }}
            >
              BREAKING
            </span>
            <span style={{ fontSize: 15 }}>{breaking.title}</span>
          </div>
        </a>
      )}

      {loading && <p style={{ textAlign: "center" }}>Loading news...</p>}

      <main style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {news
          .filter(item => !showOnlyRed || getUrgencyColor(item.title) === "#ff4d4f")
          .map((item, index) => {
            const color = getUrgencyColor(item.title);
            return (
              <a key={index} href={item.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                <div
                  style={{
                    padding: 20,
                    borderLeft: `6px solid ${color}`,
                    borderRadius: 10,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    backgroundColor: "#fff",
                    transition: "transform 0.15s ease, box-shadow 0.15s ease",
                    cursor: "pointer"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: 16, color: "#111" }}>{item.title}</div>
                  {item.pubDate && <div style={{ fontSize: 12, color: "#888", marginTop: 6 }}>{new Date(item.pubDate).toLocaleString()}</div>}
                  {item.contentSnippet && <p style={{ marginTop: 10, color: "#333", lineHeight: 1.5 }}>{item.contentSnippet}</p>}
                </div>
              </a>
            );
          })}
      </main>
    </div>
  );
}