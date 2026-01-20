// File: pages/map.js
import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";

// React-Leaflet must be dynamically imported to avoid SSR issues in Next.js
const MapContainer = dynamic(() => import("react-leaflet").then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(m => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(m => m.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then(m => m.Popup), { ssr: false });

// Leaflet default icon fix for Next/Vercel builds
const fixLeafletIcons = async () => {
  const L = await import("leaflet");

  delete L.Icon.Default.prototype._getIconUrl;

  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });
};

const DEFAULT_CENTER = [20, 0]; // world-ish
const DEFAULT_ZOOM = 2;

// Simple region → lat/lng (starter set). We can expand this over time.
const REGION_COORDS = [
  { key: "ukraine", label: "Ukraine", lat: 49.0, lng: 31.0 },
  { key: "russia", label: "Russia", lat: 55.75, lng: 37.62 },
  { key: "israel", label: "Israel", lat: 31.77, lng: 35.21 },
  { key: "gaza", label: "Gaza", lat: 31.5, lng: 34.47 },
  { key: "iran", label: "Iran", lat: 32.0, lng: 53.0 },
  { key: "syria", label: "Syria", lat: 34.8, lng: 38.99 },
  { key: "yemen", label: "Yemen", lat: 15.55, lng: 48.52 },
  { key: "taiwan", label: "Taiwan", lat: 23.7, lng: 121.0 },
  { key: "china", label: "China", lat: 35.8, lng: 104.2 },
  { key: "north korea", label: "North Korea", lat: 40.34, lng: 127.51 },
  { key: "south korea", label: "South Korea", lat: 36.5, lng: 127.9 },
];

const normalize = (s = "") => s.toLowerCase().replace(/[^\w\s]/g, " ");

const inferRegionKey = (title = "") => {
  const t = normalize(title);
  for (const r of REGION_COORDS) {
    if (t.includes(r.key)) return r.key;
  }
  return null;
};

export default function MapPage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fixLeafletIcons();

    fetch("/api/news")
      .then((r) => r.json())
      .then((data) => {
        setNews(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Group stories into regions (basic keyword match)
  const regionBuckets = useMemo(() => {
    const buckets = new Map(); // key -> { region, stories: [] }

    for (const item of news) {
      const key = inferRegionKey(item?.title || "");
      if (!key) continue;

      const region = REGION_COORDS.find(r => r.key === key);
      if (!region) continue;

      if (!buckets.has(key)) buckets.set(key, { region, stories: [] });
      buckets.get(key).stories.push(item);
    }

    // Sort each bucket newest-first
    for (const [, v] of buckets) {
      v.stories.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
      v.stories = v.stories.slice(0, 8); // keep popups short
    }

    return Array.from(buckets.values());
  }, [news]);

  return (
    <div style={{ minHeight: "100vh", width: "100%", color: "#fff", padding: 20 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
        <header style={{ textAlign: "center", marginBottom: 14 }}>
          <h1 style={{ fontSize: 36, fontWeight: 900, margin: 0, textShadow: "0 0 10px rgba(255,255,255,0.25)" }}>
            Crisis Map
          </h1>

          <nav style={{ marginTop: 10, display: "inline-flex", gap: 10 }}>
            <a
              href="/"
              style={{
                color: "#fff",
                textDecoration: "none",
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)",
                padding: "8px 12px",
                borderRadius: 10,
                fontWeight: 800,
                fontSize: 14,
              }}
            >
              Home
            </a>
            <a
              href="/dashboard"
              style={{
                color: "#fff",
                textDecoration: "none",
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)",
                padding: "8px 12px",
                borderRadius: 10,
                fontWeight: 800,
                fontSize: 14,
              }}
            >
              Dashboard
            </a>
            <a
              href="/map"
              style={{
                color: "#000",
                textDecoration: "none",
                background: "#fff",
                border: "1px solid rgba(255,255,255,0.12)",
                padding: "8px 12px",
                borderRadius: 10,
                fontWeight: 900,
                fontSize: 14,
              }}
            >
              Map
            </a>
          </nav>

          <p style={{ color: "#aaa", marginTop: 10, marginBottom: 0 }}>
            Click a marker to see the latest related headlines.
          </p>
        </header>

        <div
          style={{
            height: "72vh",
            borderRadius: 14,
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.12)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.45)",
            background: "rgba(0,0,0,0.35)",
          }}
        >
          {loading ? (
            <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#ddd" }}>
              Loading map…
            </div>
          ) : (
            <MapContainer center={DEFAULT_CENTER} zoom={DEFAULT_ZOOM} style={{ height: "100%", width: "100%" }}>
              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {regionBuckets.map(({ region, stories }) => (
                <Marker key={region.key} position={[region.lat, region.lng]}>
                  <Popup>
                    <div style={{ maxWidth: 260 }}>
                      <div style={{ fontWeight: 900, marginBottom: 6 }}>{region.label}</div>
                      <div style={{ fontSize: 12, color: "#333", marginBottom: 8 }}>
                        Top stories: {stories.length}
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {stories.slice(0, 5).map((s) => (
                          <a
                            key={s.link}
                            href={s.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "#1a73e8", textDecoration: "none", fontSize: 12, fontWeight: 700 }}
                          >
                            {s.title}
                          </a>
                        ))}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          )}
        </div>
      </div>
    </div>
  );
}