import { useEffect, useState } from "react";

// Keyword-based urgency colors
const getUrgencyColor = (title) => {
  const high = ["war declared",
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
  "strike hits",
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
  "fleeing",
  "border closed",
  "airspace closed",
  "embassy evacuates",
  "embassy closed",
  "emergency departure",
  "citizens urged to leave",
  "do not travel",

  // Government / state emergency alerts
  "security alert",
  "state of emergency",
  "emergency declaration",
  "government warning",
  "official warning",
  "travel alert",
  "travel warning",
  "worldwide caution",
  "highest alert level",
  "red alert",
  "alert level raised",

  // Hostage / terror situations
  "hostages taken",
  "hostage situation",
  "kidnapped",
  "abduction",
  "terror cell",
  "militant attack",

  // Weapons of mass destruction
  "chemical weapons",
  "biological threat",
  "radiological threat",
  "dirty bomb",

  // Infrastructure collapse
  "power grid attacked",
  "communications down",
  "internet blackout",
  "nationwide blackout",
  "critical infrastructure"];
  const medium = ["military buildup",
  "troops massing",
  "troops gathering",
  "forces deployed",
  "naval deployment",
  "warships deployed",
  "fighter jets",
  "military drills",
  "military exercise",
  "combat readiness",
  "heightened readiness",
  "defense posture",
  "border tensions",

  // Rising conflict / instability
  "rising tensions",
  "escalating tensions",
  "conflict intensifies",
  "clashes reported",
  "cross-border clashes",
  "exchange of fire",
  "skirmishes",
  "armed standoff",
  "ceasefire violation",
  "fragile ceasefire",

  // Government actions & warnings (non-evac)
  "security warning",
  "travel advisory",
  "shelter in place",
  "curfew imposed",
  "curfew extended",
  "emergency measures",
  "public safety alert",
  "civil defense warning",

  // Protests, unrest, instability
  "protests erupt",
  "mass protests",
  "violent protests",
  "unrest",
  "civil unrest",
  "riots",
  "crackdown",
  "police clash",
  "crowd dispersal",
  "state violence",

  // Terror & extremism indicators (non-attack)
  "terror threat",
  "credible threat",
  "suspected militants",
  "extremist group",
  "terror warning",
  "radicalization concerns",

  // Cyber & infrastructure incidents
  "cyberattack",
  "cyber attack",
  "cyber incident",
  "hacking incident",
  "communications disrupted",
  "transport disrupted",
  "airport disruption",
  "rail disruption",
  "supply chain disruption",

  // Border, airspace, travel issues
  "border restrictions",
  "border tensions",
  "airspace restrictions",
  "flight suspensions",
  "flights suspended",
  "port closures",
  "shipping disruption",

  // Diplomatic & geopolitical signals
  "diplomatic tensions",
  "relations deteriorate",
  "talks collapse",
  "peace talks stall",
  "talks suspended",
  "envoy recalled",
  "ambassador recalled",
  "sanctions threatened",

  // Intelligence & warnings
  "intelligence warning",
  "threat assessment",
  "risk assessment",
  "monitoring situation",
  "situation developing"];
  const text = title.toLowerCase();

  if (high.some((word) => text.includes(word))) return "#ff4d4f"; // red
  if (medium.some((word) => text.includes(word))) return "#fa8c16"; // orange
  return "#1890ff"; // blue
};

export default function Home() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    const fetchNews = () => {
      fetch("/api/news")
        .then((res) => res.json())
        .then((data) => {
          const sorted = data.sort(
            (a, b) => new Date(b.pubDate) - new Date(a.pubDate)
          );
          setNews(sorted);
          setLoading(false);
          setLastUpdated(new Date());
        })
        .catch((err) => console.error("Failed to fetch news:", err));
    };

    fetchNews();
    const interval = setInterval(fetchNews, 5 * 60 * 1000); // every 5 min
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: 20, fontFamily: "Arial, sans-serif" }}>
      {/* Header */}
      <header style={{ textAlign: "center", marginBottom: 40 }}>
        <h1 style={{ fontSize: 36, color: "#222" }}>SignalWatchGlobal</h1>
        <p style={{ fontSize: 18, color: "#555" }}>Live Global Crisis Tracker</p>
        {lastUpdated && (
          <p style={{ fontSize: 12, color: "#888" }}>
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        )}
      </header>

      {loading && <p style={{ textAlign: "center" }}>Loading news...</p>}

      {/* News feed */}
      <main style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {news.map((item, index) => {
          const color = getUrgencyColor(item.title);
          return (
            <a
              key={index}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none" }}
            >
              <div
                style={{
                  padding: 20,
                  borderLeft: `6px solid ${color}`,
                  borderRadius: 10,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  backgroundColor: "#fff",
                  transition: "transform 0.15s ease, box-shadow 0.15s ease",
                  cursor: "pointer",
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
                <div style={{ fontWeight: 600, fontSize: 16, color: "#111" }}>
                  {item.title}
                </div>
                {item.pubDate && (
                  <div style={{ fontSize: 12, color: "#888", marginTop: 6 }}>
                    {new Date(item.pubDate).toLocaleString()}
                  </div>
                )}
                {item.contentSnippet && (
                  <p style={{ marginTop: 10, color: "#333", lineHeight: 1.5 }}>
                    {item.contentSnippet}
                  </p>
                )}
              </div>
            </a>
          );
        })}
      </main>
    </div>
  );
}