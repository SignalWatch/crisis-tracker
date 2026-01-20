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

// Very simple country → lat/lng lookup for demo
// You can expand this later
const COUNTRY_COORDS = {
  "ukraine": [48.3794, 31.1656],
  "russia": [61.5240, 105.3188],
  "israel": [31.0461, 34.8516],
  "palestine": [31.9522, 35.2332],
  "gaza": [31.5017, 34.4668],
  "iran": [32.4279, 53.6880],
  "syria": [34.8021, 38.9968],
  "iraq": [33.2232, 43.6793],
  "yemen": [15.5527, 48.5164],
  "afghanistan": [33.9391, 67.7100],
  "china": [35.8617, 104.1954],
  "north korea": [40.3399, 127.5101],
  "south korea": [35.9078, 127.7669],
  "taiwan": [23.6978, 120.9605],
  "france": [46.2276, 2.2137],
  "germany": [51.1657, 10.4515],
  "united states": [37.0902, -95.7129],
  "mexico": [23.6345, -102.5528],
  "brazil": [-14.2350, -51.9253],
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

  // Convert news items into map markers
  const markers = useMemo(() => {
    return news
      .filter((item) => {
        const color = item.urgencyColor;

        // ONLY RED and ORANGE
        return color === "#ff4d4f" || color === "#fa8c16";
      })
      .map((item) => {
        const title = item.title.toLowerCase();

        // Find first matching country in title
        let coords = null;

        for (const [country, latlng] of Object.entries(COUNTRY_COORDS)) {
          if (title.includes(country)) {
            coords = latlng;
            break;
          }
        }

        // If no country match, skip it
        if (!coords) return null;

        return {
          title: item.title,
          lat: coords[0],
          lng: coords[1],
          urgency: item.urgencyColor === "#ff4d4f" ? "RED" : "ORANGE",
          link: item.link,
        };
      })
      .filter(Boolean); // remove nulls
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
