// index.js
// Last updated: 2026-01-16
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
  "attack"
];

// Keyword-based urgency colors
const getUrgencyColor = (title) => {
  const high = [
    "war declared",
    "state of war",
    "full-scale invasion",
    "full scale invasion",
    "invasion",
    "airstrike",
    "air strike",
    "missile strike",
    "missile attack",
    "rocket attack",
    "ballistic missile",
    "cruise missile",
    "intercepted missile",
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

    // Attacks & mass casualties
    "attack",
    "bombing",
    "explosion",
    "massacre",
    "mass killing",
    "deadliest",
    "dozens killed",
    "hundreds killed",
    "mass casualties",
    "civilian deaths",
    "terror attack",
    "terrorist attack",
    "suicide bombing",
    "assassination",

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

    // Diplomacy
    "talks collapse",
    "peace talks stall",
    "sanctions threatened",

    // Death baseline
    "killed",
    "dead",
    "death",
    "fatal",
    "fatalities"
  ];

  const text = title.toLowerCase();

  const hasHigh = high.some(word => text.includes(word));
  const hasMedium = medium.some(word => text.includes(word));
  const hasKilled = text.includes("killed") || text.includes("dead");
  const hasRedContext = KILLED_RED_TRIGGERS.some(word => text.includes(word));

  if (hasHigh) return "#ff4d4f";           // RED
  if (hasKilled && hasRedContext) return "#ff4d4f"; // Escalated RED
  if (hasMedium || hasKilled) return "#fa8c16";     // ORANGE
  return "#1890ff";                        // BLUE
};

// Get the NEWEST red headline for breaking
const getBreakingHeadline = (news) => {
  const redItems = news.filter(item => getUrgencyColor(item.title) === "#ff4d4f");
  if (redItems.length === 0) return null;
  return redItems.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate))[0];
};

export default function Home() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [breaking, setBreaking] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch("/api/news");
        const data = await res.json();
        const sorted = data.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
        setNews(sorted);

        // Update breaking headline dynamically
        const latestBreaking = getBreakingHeadline(sorted);
        setBreaking(prev => {
          if (!prev || (latestBreaking && new Date(latestBreaking.pubDate) > new Date(prev.pubDate))) {
            return latestBreaking;
          }
          return prev;
        });

        setLoading(false);
        setLastUpdated(new Date());
      } catch (err) {
        console.error("Failed to fetch news:", err);
      }
    };

    fetchNews();
    const interval = setInterval(fetchNews, 60 * 1000); // every 1 minute for live updates
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: 20, fontFamily: "Arial, sans-serif" }}>
      <header style={{ textAlign: "center", marginBottom: 40 }}>
        <h1 style={{ fontSize: 36, color: "#222" }}>SignalWatchGlobal</h1>
        <p style={{ fontSize: 18, color: "#555" }}>Live Global Crisis Tracker</p>
        {lastUpdated && <p style={{ fontSize: 12, color: "#888" }}>Last updated: {lastUpdated.toLocaleTimeString()}</p>}
      </header>

      {breaking && (
        <a href={breaking.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
          <div style={{
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
          }}>
            <span style={{
              backgroundColor: "#fff",
              color: "#ff4d4f",
              padding: "4px 10px",
              borderRadius: 4,
              fontSize: 12,
              fontWeight: 700
            }}>BREAKING</span>
            <span style={{ fontSize: 15 }}>{breaking.title}</span>
          </div>
        </a>
      )}

      {loading && <p style={{ textAlign: "center" }}>Loading news...</p>}

      <main style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {news.map((item, index) => {
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
                  transition: "transform 0.15s ease, box-shadow 0.15s ease"
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.12)";
                }}
                onMouseLeave={e => {
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