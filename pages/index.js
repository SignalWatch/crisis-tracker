import { useEffect, useState } from "react";

// Keyword-based urgency colors
const getUrgencyColor = (title) => {
  const high = ["war", "attack", "bomb", "massacre", "invasion"];
  const medium = ["tension", "protests", "crisis", "sanctions"];
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