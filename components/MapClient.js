import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const createIcon = (color) =>
  L.divIcon({
    className: "custom-marker",
    html: `<div style="
      background:${color};
      width:14px;
      height:14px;
      border-radius:50%;
      border:2px solid white;
      box-shadow:0 0 6px rgba(0,0,0,0.6);
    "></div>`,
  });

export default function MapClient({ markers = [] }) {
  return (
    <div style={{ height: 520, width: "100%" }}>
      <MapContainer center={[20, 0]} zoom={2} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {markers.map((m, idx) => (
          <Marker
            key={idx}
            position={[m.lat, m.lng]}
            icon={createIcon(m.urgencyColor || "#fa8c16")}
          >
            <Popup>
              <div style={{ fontWeight: 800, marginBottom: 6 }}>{m.title}</div>

              <div style={{ marginBottom: 6 }}>Urgency: {m.urgency}</div>
              {m.source && (
                <div style={{ marginBottom: 6 }}>Source: {m.source}</div>
              )}
              {m.dateText && (
                <div style={{ marginBottom: 8, color: "#555" }}>{m.dateText}</div>
              )}

              <a
                href={m.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontWeight: 800 }}
              >
                Open article →
              </a>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
