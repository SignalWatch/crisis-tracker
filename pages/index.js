import { useEffect, useState } from "react";

export default function Home() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    // Fetch live news from our API route
    fetch("/api/news")
      .then((res) => res.json())
      .then(setNews)
      .catch((err) => console.error("Failed to fetch news:", err));
  }, []);

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 20, fontFamily: "Arial, sans-serif" }}>
      <header style={{ textAlign: "center", marginBottom: 40 }}>
        <h1>SignalWatchGlobal</h1>
        <p style={{ fontSize: 18, color: "#555" }}>Live Global Crisis Tracker</p>
      </header>

      {news.length === 0 && <p>Loading news...</p>}

      <main>
        {news.map((item, index) => (
          <div
            key={index}
            style={{
              marginBottom: 20,
              padding: 15,
              border: "1px solid #ddd",
              borderRadius: 8,
              boxShadow: "0 2px 5px rgba(0,0,0,0.05)"
            }}
          >
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none", color: "#111" }}
            >
              <strong>{item.title}</strong>
            </a>
            {item.pubDate && (
              <div style={{ fontSize: 12, color: "#888", marginTop: 5 }}>
                {new Date(item.pubDate).toLocaleString()}
              </div>
            )}
          </div>
        ))}
      </main>
    </div>
  );
}