// File: pages/dashboard.js
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

// --- urgency logic (same as index.js, trimmed to stay fast) ---
const KILLED_RED_TRIGGERS = [
  "at least","dozens","scores","hundreds","multiple","mass","massacre","civilians","children",
  "journalists","aid workers","airstrike","air strike","missile","bombing","explosion","shelling",
  "strike","strikes",
];

const DIPLOMACY_RED_TRIGGERS = [
  "extremely tense","urgent talks","crisis meeting","emergency summit","high alert",
  "diplomatic emergency","imminent conflict","potential war","red alert",
];

const GLOBAL_ATTACK_TRIGGERS = [
  "drone attack","drone attacks","drone strike","drone strikes","airstrike","air strike",
  "missile strike","rocket attack","ballistic missile","cruise missile","bombing","suicide bombing",
  "terror attack","terrorist attack","massacre","assassination","explosion","shelling","chemical attack",
  "biological attack","radiological attack","nuclear strike","air raid","armed clash","cross-border attack",
  "siege","bomb threat","terror plot","large-scale raid",
];

const CONFLICT_REGIONS = [
  "ukraine","russia","syria","iran","iraq","lebanon","afghanistan","yemen","palestine","gaza","israel",
  "odessa","kyiv","kiev","donetsk","kharkiv","luhansk","west bank",
];

const getUrgencyColor = (title = "") => {
  const text = title.toLowerCase().replace(/[^\w\s]/g, " ");

  const high = [
    "war declared","state of war","full-scale invasion","full scale invasion","invasion",
    "nuclear","nuclear threat","nuclear warning","nuclear strike",
    "military escalation","escalation","troops deployed","mobilization","martial law",
    "armed conflict","direct conflict",
    "evacuate immediately","evacuation ordered","mandatory evacuation","leave immediately",
    "border closed","airspace closed","embassy evacuates","citizens urged to leave","do not travel",
    "state of emergency","emergency declaration","red alert","alert level raised",
    "chemical weapons","biological threat","radiological threat","dirty bomb",
    "nationwide blackout","critical infrastructure",
  ];

  const medium = [
    "military buildup","troops massing","forces deployed","warships deployed","fighter jets","military drills",
    "rising tensions","escalating tensions","clashes reported","exchange of fire","skirmishes",
    "travel advisory","security warning","shelter in place","curfew imposed",
    "protests erupt","violent protests","civil unrest","riots","crackdown",
    "cyberattack","communications disrupted","transport disrupted","hacking","malware","security breach",
    "talks collapse","peace talks stall","sanctions threatened","tariffs","trade sanctions",
    "summit","urgent talks","crisis talks","diplomacy",
    "killed","dead","death","fatal","fatalities",
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

// --- lightweight keywords (no NLP) ---
const STOP_WORDS = new Set([
  "the","a","an","and","or","but","to","of","in","on","for","with","at","by","from","as",
  "is","are","was","were","be","been","it","its","this","that","these","those","after","before",
  "over","under","into","out","about","amid","says","say","new","latest","live","update","breaking",
]);

const tokenize = (text = "") =>
  text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .filter((w) => w.length >= 4 && !STOP_WORDS.has(w));

export default function Dashboard() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch("/api/news");
        const data = await res.json();
        const arr = Array.isArray(data) ? data : [];

        const mapped = arr.map((n) => {
          const urgencyColor = getUrgencyColor(n.title);
          const source = n.source || getSourceNameFromLink(n.link);
          return { ...n, urgencyColor, source };
        });

        mapped.sort((a, b) => (new Date(b.pubDate).getTime() || 0) - (new Date(a.pubDate).getTime() || 0));

        setNews(mapped);
        setLastUpdated(new Date());
      } catch (e) {
        console.error("dashboard fetch error", e);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
    const interval = setInterval(fetchNews, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const stats = useMemo(() => {
    const total = news.length;
    let red = 0, orange = 0, blue = 0;

    const sourceCounts = new Map();
    const wordCounts = new Map();

    for (const n of news) {
      if (n.urgencyColor === "#ff4d4f") red++;
      else if (n.urgencyColor === "#fa8c16") orange++;
      else blue++;

      const src = n.source || "Source";
      sourceCounts.set(src, (sourceCounts.get(src) || 0) + 1);

      const tokens = tokenize(`${n.title || ""} ${n.contentSnippet || ""}`);
      for (const t of tokens) {
        wordCounts.set(t, (wordCounts.get(t) || 0) + 1);
      }
    }

    const topSources = Array.from(sourceCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);

    const topTopics = Array.from(wordCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12);

    const latestRed = news.filter((n) => n.urgencyColor === "#ff4d4f").slice(0, 8);

    return { total, red, orange, blue, topSources, topTopics, latestRed };
  }, [news]);

  return (
    <div className="app-container" style={{ minHeight: "100vh", width: "100%", color: "#fff" }}>
      <div style={{ minHeight: "100vh", backgroundColor: "rgba(0,0,0,0.25)", padding: 20 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <div>
              <h1 style={{ fontSize: 34, fontWeight: 900, margin: 0 }}>Dashboard</h1>
              <div style={{ color: "#bbb", fontSize: 12, marginTop: 6 }}>
                {lastUpdated ? `Last updated: ${lastUpdated.toLocaleTimeString()}` : ""}
              </div>
            </div>

            <Link
              href="/"
              style={{
                textDecoration: "none",
                background: "rgba(255,255,255,0.10)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "#fff",
                padding: "10px 14px",
                borderRadius: 10,
                fontWeight: 900,
              }}
            >
              ← Back to feed
            </Link>
          </div>

          {loading && <p style={{ marginTop: 18 }}>Loading dashboard…</p>}

          {!loading && (
            <>
              {/* KPI cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, marginTop: 18 }}>
                <div style={cardStyle}>
                  <div style={kpiLabel}>Total stories</div>
                  <div style={kpiValue}>{stats.total}</div>
                </div>

                <div style={cardStyle}>
                  <div style={kpiLabel}>RED (high urgency)</div>
                  <div style={{ ...kpiValue, color: "#ff4d4f" }}>{stats.red}</div>
                </div>

                <div style={cardStyle}>
                  <div style={kpiLabel}>ORANGE (medium)</div>
                  <div style={{ ...kpiValue, color: "#fa8c16" }}>{stats.orange}</div>
                </div>

                <div style={cardStyle}>
                  <div style={kpiLabel}>BLUE (low)</div>
                  <div style={{ ...kpiValue, color: "#1890ff" }}>{stats.blue}</div>
                </div>
              </div>

              {/* Sources + Topics */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 14, marginTop: 14 }}>
                <div style={cardStyle}>
                  <div style={sectionTitle}>Top sources</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 10 }}>
                    {stats.topSources.map(([src, count]) => (
                      <div key={src} style={{ display: "flex", justifyContent: "space-between", color: "#eee" }}>
                        <span>{src}</span>
                        <span style={{ color: "#bbb" }}>{count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={cardStyle}>
                  <div style={sectionTitle}>Hot topics (quick scan)</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
                    {stats.topTopics.map(([word, count]) => (
                      <span
                        key={word}
                        style={{
                          background: "rgba(255,255,255,0.08)",
                          border: "1px solid rgba(255,255,255,0.12)",
                          borderRadius: 999,
                          padding: "6px 10px",
                          fontSize: 12,
                          color: "#eee",
                        }}
                        title={`Appears ${count} times`}
                      >
                        {word}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Latest RED */}
              <div style={{ marginTop: 14, ...cardStyle }}>
                <div style={sectionTitle}>Latest RED alerts</div>
                {stats.latestRed.length === 0 ? (
                  <p style={{ color: "#bbb", marginTop: 10 }}>No RED items in the latest feed.</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 10 }}>
                    {stats.latestRed.map((n) => (
                      <a
                        key={n.link}
                        href={n.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          textDecoration: "none",
                          color: "#fff",
                          background: "rgba(0,0,0,0.35)",
                          border: "1px solid rgba(255,255,255,0.12)",
                          borderLeft: "6px solid #ff4d4f",
                          borderRadius: 10,
                          padding: 12,
                        }}
                      >
                        <div style={{ fontWeight: 900, fontSize: 13, marginBottom: 6 }}>{n.title}</div>
                        <div style={{ color: "#aaa", fontSize: 12 }}>
                          {n.pubDate ? new Date(n.pubDate).toLocaleString() : ""} • {n.source || "Source"}
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const cardStyle = {
  background: "rgba(0,0,0,0.55)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 14,
  boxShadow: "0 10px 28px rgba(0,0,0,0.35)",
  padding: 14,
};

const kpiLabel = { fontSize: 12, color: "#bbb", fontWeight: 800 };
const kpiValue = { marginTop: 8, fontSize: 32, fontWeight: 900 };
const sectionTitle = { fontSize: 13, color: "#ddd", fontWeight: 900 };
