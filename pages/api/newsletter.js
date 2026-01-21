const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

const ALLOWED_FREQUENCIES = new Set(["daily", "weekly", "breaking"]);
const ALLOWED_TOPICS = new Set([
  "conflict",
  "humanitarian",
  "disaster",
  "health",
  "cyber",
]);
const ALLOWED_REGIONS = new Set([
  "global",
  "americas",
  "europe",
  "middle-east",
  "africa",
  "asia-pacific",
]);

const SUBSCRIBERS = new Map();

const normalizeEmail = (email = "") => email.trim().toLowerCase();

const sanitizeTopics = (topics = []) =>
  topics
    .filter((topic) => typeof topic === "string")
    .map((topic) => topic.trim().toLowerCase())
    .filter((topic) => ALLOWED_TOPICS.has(topic));

export default function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, frequency, topics, region, consent } = req.body || {};
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail || !EMAIL_RE.test(normalizedEmail)) {
    return res.status(400).json({ error: "Enter a valid email address." });
  }

  if (!ALLOWED_FREQUENCIES.has(frequency)) {
    return res.status(400).json({ error: "Select a valid newsletter frequency." });
  }

  const safeRegion = ALLOWED_REGIONS.has(region) ? region : "global";
  const safeTopics = sanitizeTopics(Array.isArray(topics) ? topics : []);

  if (safeTopics.length === 0) {
    return res.status(400).json({ error: "Choose at least one topic." });
  }

  if (consent !== true) {
    return res.status(400).json({ error: "Consent is required to subscribe." });
  }

  const now = new Date().toISOString();
  const existing = SUBSCRIBERS.get(normalizedEmail);

  const record = {
    email: normalizedEmail,
    frequency,
    region: safeRegion,
    topics: safeTopics,
    status: "active",
    createdAt: existing?.createdAt || now,
    updatedAt: now,
  };

  SUBSCRIBERS.set(normalizedEmail, record);

  return res.status(200).json({
    status: existing ? "updated" : "subscribed",
    record,
    message: existing
      ? "Preferences updated. You're still on the list."
      : "You're subscribed! Watch for the next briefing.",
  });
}