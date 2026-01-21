import { useState } from "react";

const NEWSLETTER_TOPICS = [
  { value: "conflict", label: "Conflict alerts" },
  { value: "humanitarian", label: "Humanitarian updates" },
  { value: "disaster", label: "Natural disasters" },
  { value: "health", label: "Health emergencies" },
  { value: "cyber", label: "Cyber & infrastructure" },
];

const NEWSLETTER_REGIONS = [
  { value: "global", label: "Global focus" },
  { value: "americas", label: "Americas" },
  { value: "europe", label: "Europe" },
  { value: "middle-east", label: "Middle East" },
  { value: "africa", label: "Africa" },
  { value: "asia-pacific", label: "Asia-Pacific" },
];

export default function Newsletter() {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterFrequency, setNewsletterFrequency] = useState("daily");
  const [newsletterTopics, setNewsletterTopics] = useState(["conflict", "humanitarian"]);
  const [newsletterRegion, setNewsletterRegion] = useState("global");
  const [newsletterConsent, setNewsletterConsent] = useState(false);
  const [newsletterStatus, setNewsletterStatus] = useState({ state: "idle", message: "" });
  const [newsletterError, setNewsletterError] = useState("");

  const toggleNewsletterTopic = (topicValue) => {
    setNewsletterTopics((prev) => (
      prev.includes(topicValue)
        ? prev.filter((item) => item !== topicValue)
        : [...prev, topicValue]
    ));
  };

  const submitNewsletter = async (event) => {
    event.preventDefault();
    setNewsletterError("");
    setNewsletterStatus({ state: "loading", message: "" });

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: newsletterEmail,
          frequency: newsletterFrequency,
          topics: newsletterTopics,
          region: newsletterRegion,
          consent: newsletterConsent,
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error || "Unable to subscribe right now.");
      }

      setNewsletterStatus({ state: "success", message: payload?.message || "Subscribed!" });
    } catch (error) {
      setNewsletterStatus({ state: "error", message: "" });
      setNewsletterError(error?.message || "Unable to subscribe right now.");
    }
  };

  return (
    <div style={{ minHeight: "100vh", width: "100%", color: "#fff" }}>
      <div
        style={{
          minHeight: "100vh",
          width: "100%",
          backgroundColor: "rgba(0,0,0,0.25)",
          padding: 20,
        }}
      >
        <div
          style={{
            maxWidth: 900,
            margin: "0 auto",
            fontFamily: "Arial, sans-serif",
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          <header style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
              <div>
                <div style={{ fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: "#9aa4b2" }}>
                  Signal Watch Global
                </div>
                <h1 style={{ margin: "6px 0 0", fontSize: 32, fontWeight: 900 }}>
                  Newsletter Preferences
                </h1>
                <p style={{ color: "#b8c0cc", margin: "6px 0 0" }}>
                  Get curated crisis briefings tuned to your region, cadence, and focus areas.
                </p>
              </div>

              <nav style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <a href="/" style={navLinkStyle}>Home</a>
                <a href="/dashboard" style={navLinkStyle}>Dashboard</a>
                <a href="/map" style={navLinkStyle}>Map</a>
                <span style={navLinkActiveStyle}>Newsletter</span>
              </nav>
            </div>
          </header>

          <section
            style={{
              padding: 24,
              borderRadius: 16,
              border: "1px solid rgba(255,255,255,0.15)",
              background: "rgba(0,0,0,0.55)",
              boxShadow: "0 6px 18px rgba(0,0,0,0.45)",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ fontSize: 22, fontWeight: 800 }}>Join the crisis briefing newsletter</div>
              <div style={{ color: "#cbd5f0", fontSize: 14 }}>
                Tell us what you monitor and how often you want a briefing. We will deliver only verified alerts.
              </div>
            </div>

            <form onSubmit={submitNewsletter} style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
                <label style={labelStyle}>
                  Work email
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(event) => setNewsletterEmail(event.target.value)}
                    placeholder="you@example.com"
                    required
                    style={inputStyle}
                  />
                </label>

                <label style={labelStyle}>
                  Delivery cadence
                  <select
                    value={newsletterFrequency}
                    onChange={(event) => setNewsletterFrequency(event.target.value)}
                    style={inputStyle}
                  >
                    <option value="daily" style={{ color: "#111" }}>Daily brief</option>
                    <option value="weekly" style={{ color: "#111" }}>Weekly pulse</option>
                    <option value="breaking" style={{ color: "#111" }}>Breaking-only alerts</option>
                  </select>
                </label>

                <label style={labelStyle}>
                  Regional focus
                  <select
                    value={newsletterRegion}
                    onChange={(event) => setNewsletterRegion(event.target.value)}
                    style={inputStyle}
                  >
                    {NEWSLETTER_REGIONS.map((region) => (
                      <option key={region.value} value={region.value} style={{ color: "#111" }}>
                        {region.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div style={{ display: "grid", gap: 10 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#cbd5f0" }}>Focus areas</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  {NEWSLETTER_TOPICS.map((topic) => {
                    const selected = newsletterTopics.includes(topic.value);
                    return (
                      <label
                        key={topic.value}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 8,
                          padding: "8px 12px",
                          borderRadius: 999,
                          border: "1px solid rgba(255,255,255,0.2)",
                          background: selected ? "rgba(59,130,246,0.3)" : "rgba(0,0,0,0.5)",
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() => toggleNewsletterTopic(topic.value)}
                          style={{ width: 16, height: 16 }}
                        />
                        {topic.label}
                      </label>
                    );
                  })}
                </div>
              </div>

              <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12, color: "#cbd5f0" }}>
                <input
                  type="checkbox"
                  checked={newsletterConsent}
                  onChange={(event) => setNewsletterConsent(event.target.checked)}
                  style={{ width: 16, height: 16 }}
                  required
                />
                I agree to receive the Signal Watch Global newsletter and understand I can unsubscribe anytime.
              </label>

              {newsletterError && (
                <div style={{ color: "#ffb3b3", fontSize: 12 }}>{newsletterError}</div>
              )}
              {newsletterStatus.state === "success" && (
                <div style={{ color: "#8ef0c4", fontSize: 12 }}>{newsletterStatus.message}</div>
              )}

              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <button
                  type="submit"
                  disabled={newsletterStatus.state === "loading"}
                  style={{
                    padding: "12px 18px",
                    borderRadius: 12,
                    border: "none",
                    background: newsletterStatus.state === "loading" ? "rgba(255,255,255,0.35)" : "#3b82f6",
                    color: "#fff",
                    fontWeight: 700,
                    cursor: newsletterStatus.state === "loading" ? "not-allowed" : "pointer",
                  }}
                >
                  {newsletterStatus.state === "loading" ? "Saving..." : "Subscribe"}
                </button>
                <span style={{ fontSize: 12, color: "#94a3b8" }}>
                  No spam. Only verified briefings and urgent alerts.
                </span>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}

const navLinkStyle = {
  color: "#fff",
  textDecoration: "none",
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.12)",
  padding: "8px 12px",
  borderRadius: 10,
  fontWeight: 800,
  fontSize: 14,
};

const navLinkActiveStyle = {
  ...navLinkStyle,
  background: "rgba(59,130,246,0.35)",
  borderColor: "rgba(59,130,246,0.65)",
};

const labelStyle = {
  display: "flex",
  flexDirection: "column",
  gap: 8,
  fontSize: 12,
  fontWeight: 700,
};

const inputStyle = {
  padding: "12px 14px",
  borderRadius: 10,
  border: "1px solid rgba(255,255,255,0.2)",
  background: "rgba(0,0,0,0.6)",
  color: "#fff",
};