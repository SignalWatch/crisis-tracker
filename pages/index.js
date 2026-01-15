import { useEffect, useState } from "react";

export default function Home() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    const fetchNews = () => {
      fetch("/api/news")
        .then((res) => res.json())
        .then((data) => {
          setNews(data);
          setLoading(false);
          setLastUpdated(new Date());
        })
        .catch((err) => console.error("Failed to fetch news:", err));
    };

    fetchNews(); // initial fetch
    const interval = setInterval(fetchNews, 5 * 60 * 1000); // every 5 min

    return () => clearInterval(interval);
  }, []);

  // Group news by source
  const groupedNews = news.reduce((acc, item) => {
    const source = item.source || item.link.split("/")[2]; // fallback if source not available
    if (!acc[source]) acc[source] = [];
    acc[source].push(item);
    return acc;
  }, {});

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: 20, fontFamily: "Arial, sans-serif" }}>
      <header style={{ textAlign: "center", marginBottom: 30 }}>
        <h1 style={{ fontSize: 36, color: "#222" }}>SignalWatchGlobal</h1>
        <p style={{ fontSize: 18, color: "#555" }}>Live Global Crisis Tracker</p>
        {lastUpdated && (
          <p style={{ fontSize: 12, color: "#888" }}>
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        )}
      </header>

      {loading && <p style={{ textAlign: "center" }}>Loading news...</p>}

      <main style={{ display: "flex", flexDirection: "column", gap: 30 }}>
        {Object.entries(groupedNews).map(([source, items]) => (
          <section key={source}>
            <h2 style={{ borderBottom: "2px solid #ccc", paddingBottom: 5, color: "#444" }}>
              {source.toUpperCase()}
            </h2>
            <div style={{ display: "grid", gap: 15 }}>
              {items.map((item, index) => (
                <div
                  key={index}
                  style={{
                    padding: 15,
                    border: "1px solid #ddd",
                    borderRadius: 8,
                    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                    backgroundColor: "#fff",
                  }}
                >
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: "none", color: "#111", fontWeight: 600 }}
                  >
                    {item.title}
                  </a>
                  {item.pubDate && (
                    <div style={{ fontSize: 12, color: "#888", marginTop: 5 }}>
                      {new Date(item.pubDate).toLocaleString()}
                    </div>
                  )}
                  {item.contentSnippet && (
                    <p style={{ marginTop: 10, color: "#333" }}>{item.contentSnippet}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}