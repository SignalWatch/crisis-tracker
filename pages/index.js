// File: pages/index.js
// Date: 2026-01-16
import { useEffect, useMemo, useState } from "react";

// Country → Flag map
const COUNTRY_FLAGS = {
  // ======================
  // United States
  // ======================

  "united states": "🇺🇸",
  "united states of america": "🇺🇸",
  "usa": "🇺🇸",
  "u.s.": "🇺🇸",
  "u s": "🇺🇸",
  "us": "🇺🇸",
  "america": "🇺🇸",
  "american": "🇺🇸",

  // ======================
  // Russia / Ukraine region
  // ======================
  "russia": "🇷🇺",
  "russian": "🇷🇺",

  "ukraine": "🇺🇦",
  "ukrainian": "🇺🇦",

  "belarus": "🇧🇾",
  "belarusian": "🇧🇾",

  "moldova": "🇲🇩",
  "moldovan": "🇲🇩",

  "estonia": "🇪🇪",
  "estonian": "🇪🇪",

  "latvia": "🇱🇻",
  "latvian": "🇱🇻",

  "lithuania": "🇱🇹",
  "lithuanian": "🇱🇹",

  "georgia": "🇬🇪",
  "georgian": "🇬🇪",

  "armenia": "🇦🇲",
  "armenian": "🇦🇲",

  "azerbaijan": "🇦🇿",
  "azerbaijani": "🇦🇿",

  "kazakhstan": "🇰🇿",
  "kazakh": "🇰🇿",

  "uzbekistan": "🇺🇿",
  "uzbek": "🇺🇿",

  "turkmenistan": "🇹🇲",
  "turkmen": "🇹🇲",

  "tajikistan": "🇹🇯",
  "tajik": "🇹🇯",

  "kyrgyzstan": "🇰🇬",
  "kyrgyz": "🇰🇬",

  // ======================
  // China / Taiwan / East Asia
  // ======================

  "china": "🇨🇳",
  "chinese": "🇨🇳",

  "japan": "🇯🇵",
  "japanese": "🇯🇵",

  "north korea": "🇰🇵",
  "north korean": "🇰🇵",

  "south korea": "🇰🇷",
  "south korean": "🇰🇷",

  "taiwan": "🇹🇼",
  "taiwanese": "🇹🇼",

  "mongolia": "🇲🇳",
  "mongolian": "🇲🇳",

  "hong kong": "🇭🇰",
  "hongkonger": "🇭🇰",
  "hk": "🇭🇰",

  "macau": "🇲🇴",
  "macaense": "🇲🇴",

  // ======================
  // Middle East
  // ======================

  "bahrain": "🇧🇭",
  "bahraini": "🇧🇭",

  "cyprus": "🇨🇾",
  "cypriot": "🇨🇾",

  "egypt": "🇪🇬",
  "egyptian": "🇪🇬",

  "iran": "🇮🇷",
  "iranian": "🇮🇷",

  "iraq": "🇮🇶",
  "iraqi": "🇮🇶",

  "israel": "🇮🇱",
  "israeli": "🇮🇱",

  "jordan": "🇯🇴",
  "jordanian": "🇯🇴",

  "kuwait": "🇰🇼",
  "kuwaiti": "🇰🇼",

  "lebanon": "🇱🇧",
  "lebanese": "🇱🇧",

  "oman": "🇴🇲",
  "omani": "🇴🇲",

  "palestine": "🇵🇸",
  "palestinian": "🇵🇸",

  "qatar": "🇶🇦",
  "qatari": "🇶🇦",

  "saudi arabia": "🇸🇦",
  "saudi": "🇸🇦",
  "saudi arabian": "🇸🇦",

  "syria": "🇸🇾",
  "syrian": "🇸🇾",

  "turkey": "🇹🇷",
  "turkish": "🇹🇷",

  "united arab emirates": "🇦🇪",
  "uae": "🇦🇪",
  "emirati": "🇦🇪",

  "yemen": "🇾🇪",
  "yemeni": "🇾🇪",

  // ======================
  // South & Central Asia
  // ======================
  "afghanistan": "🇦🇫",
  "afghan": "🇦🇫",

  "pakistan": "🇵🇰",
  "pakistani": "🇵🇰",

  "india": "🇮🇳",
  "indian": "🇮🇳",

  "bangladesh": "🇧🇩",
  "bangladeshi": "🇧🇩",

  "sri lanka": "🇱🇰",
  "sri lankan": "🇱🇰",

  // ======================
  // Europe
  // ======================
  "united kingdom": "🇬🇧",
  "uk": "🇬🇧",
  "britain": "🇬🇧",
  "british": "🇬🇧",

  "france": "🇫🇷",
  "french": "🇫🇷",

  "germany": "🇩🇪",
  "german": "🇩🇪",

  "italy": "🇮🇹",
  "italian": "🇮🇹",

  "spain": "🇪🇸",
  "spanish": "🇪🇸",

  "portugal": "🇵🇹",
  "portuguese": "🇵🇹",

  "netherlands": "🇳🇱",
  "dutch": "🇳🇱",

  "belgium": "🇧🇪",
  "belgian": "🇧🇪",

  "switzerland": "🇨🇭",
  "swiss": "🇨🇭",

  "austria": "🇦🇹",
  "austrian": "🇦🇹",

  "poland": "🇵🇱",
  "polish": "🇵🇱",

  "czech republic": "🇨🇿",
  "czech": "🇨🇿",

  "slovakia": "🇸🇰",
  "slovak": "🇸🇰",
  "slovakian": "🇸🇰",

  "hungary": "🇭🇺",
  "hungarian": "🇭🇺",

  "romania": "🇷🇴",
  "romanian": "🇷🇴",

  "bulgaria": "🇧🇬",
  "bulgarian": "🇧🇬",

  "greece": "🇬🇷",
  "greek": "🇬🇷",

  "serbia": "🇷🇸",
  "serbian": "🇷🇸",

  "croatia": "🇭🇷",
  "croatian": "🇭🇷",

  "bosnia": "🇧🇦",
  "bosnian": "🇧🇦",

  "albania": "🇦🇱",
  "albanian": "🇦🇱",

  "slovenia": "🇸🇮",
  "slovenian": "🇸🇮",

  // ======================
  // Nordics
  // ======================
  "norway": "🇳🇴",
  "norwegian": "🇳🇴",

  "sweden": "🇸🇪",
  "swedish": "🇸🇪",

  "finland": "🇫🇮",
  "finnish": "🇫🇮",

  "denmark": "🇩🇰",
  "danish": "🇩🇰",

  "iceland": "🇮🇸",
  "icelandic": "🇮🇸",

  "greenland": "🇬🇱",
  "greenlandic": "🇬🇱",
  "greenlanders": "🇬🇱",

  // ======================
  // Africa
  // ======================
  "algeria": "🇩🇿",
  "algerian": "🇩🇿",

  "angola": "🇦🇴",
  "angolan": "🇦🇴",

  "benin": "🇧🇯",
  "beninese": "🇧🇯",

  "botswana": "🇧🇼",
  "botswanan": "🇧🇼",

  "burkina faso": "🇧🇫",
  "burkinabe": "🇧🇫",

  "burundi": "🇧🇮",
  "burundian": "🇧🇮",

  "cabo verde": "🇨🇻",
  "cape verdean": "🇨🇻",

  "cameroon": "🇨🇲",
  "cameroonian": "🇨🇲",

  "central african republic": "🇨🇫",
  "central african": "🇨🇫",

  "chad": "🇹🇩",
  "chadian": "🇹🇩",

  "comoros": "🇰🇲",
  "comorian": "🇰🇲",

  "congo": "🇨🇬",
  "congolese": "🇨🇬",

  "democratic republic of the congo": "🇨🇩",
  "congolese": "🇨🇩",

  "djibouti": "🇩🇯",
  "djiboutian": "🇩🇯",

  "equatorial guinea": "🇬🇶",
  "equatoguinean": "🇬🇶",

  "eritrea": "🇪🇷",
  "eritrean": "🇪🇷",

  "eswatini": "🇸🇿",
  "swazi": "🇸🇿",

  "ethiopia": "🇪🇹",
  "ethiopian": "🇪🇹",

  "gabon": "🇬🇦",
  "gabonese": "🇬🇦",

  "gambia": "🇬🇲",
  "gambian": "🇬🇲",

  "ghana": "🇬🇭",
  "ghanaian": "🇬🇭",

  "guinea": "🇬🇳",
  "guinean": "🇬🇳",

  "guinea-bissau": "🇬🇼",
  "guinea-bissauan": "🇬🇼",

  "ivory coast": "🇨🇮",
  "côte d'ivoire": "🇨🇮",
  "ivorian": "🇨🇮",

  "kenya": "🇰🇪",
  "kenyan": "🇰🇪",

  "lesotho": "🇱🇸",
  "lesothan": "🇱🇸",

  "liberia": "🇱🇷",
  "liberian": "🇱🇷",

  "libya": "🇱🇾",
  "libyan": "🇱🇾",

  "madagascar": "🇲🇬",
  "malagasy": "🇲🇬",

  "malawi": "🇲🇼",
  "malawian": "🇲🇼",

  "mali": "🇲🇱",
  "malian": "🇲🇱",

  "mauritania": "🇲🇷",
  "mauritanian": "🇲🇷",

  "mauritius": "🇲🇺",
  "mauritian": "🇲🇺",

  "morocco": "🇲🇦",
  "moroccan": "🇲🇦",

  "mozambique": "🇲🇿",
  "mozambican": "🇲🇿",

  "namibia": "🇳🇦",
  "namibian": "🇳🇦",

  "niger": "🇳🇪",
  "nigerien": "🇳🇪",

  "nigeria": "🇳🇬",
  "nigerian": "🇳🇬",

  "rwanda": "🇷🇼",
  "rwandan": "🇷🇼",

  "sao tome and principe": "🇸🇹",
  "sao tomean": "🇸🇹",

  "senegal": "🇸🇳",
  "senegalese": "🇸🇳",

  "seychelles": "🇸🇨",
  "seychellois": "🇸🇨",

  "sierra leone": "🇸🇱",
  "sierra leonean": "🇸🇱",

  "somalia": "🇸🇴",
  "somali": "🇸🇴",

  "south africa": "🇿🇦",
  "south african": "🇿🇦",

  "south sudan": "🇸🇸",
  "south sudanese": "🇸🇸",

  "sudan": "🇸🇩",
  "sudanese": "🇸🇩",

  "tanzania": "🇹🇿",
  "tanzanian": "🇹🇿",

  "togo": "🇹🇬",
  "togolese": "🇹🇬",

  "tunisia": "🇹🇳",
  "tunisian": "🇹🇳",

  "uganda": "🇺🇬",
  "ugandan": "🇺🇬",

  "zambia": "🇿🇲",
  "zambian": "🇿🇲",

  "zimbabwe": "🇿🇼",
  "zimbabwean": "🇿🇼",

  // ======================
  // Southeast Asia
  // ======================
  "philippines": "🇵🇭",
  "philippine": "🇵🇭",
  "filipino": "🇵🇭",

  "thailand": "🇹🇭",
  "thai": "🇹🇭",

  "vietnam": "🇻🇳",
  "vietnamese": "🇻🇳",

  "indonesia": "🇮🇩",
  "indonesian": "🇮🇩",

  "malaysia": "🇲🇾",
  "malaysian": "🇲🇾",

  "singapore": "🇸🇬",
  "singaporean": "🇸🇬",

  "myanmar": "🇲🇲",
  "burma": "🇲🇲",
  "burmese": "🇲🇲",

  "laos": "🇱🇦",
  "laotian": "🇱🇦",

  "timor-leste": "🇹🇱",
  "timorese": "🇹🇱",

  "cambodia": "🇰🇭",
  "cambodian": "🇰🇭",

  // ======================
  // Americas
  // ======================
  "canada": "🇨🇦",
  "canadian": "🇨🇦",

  "mexico": "🇲🇽",
  "mexican": "🇲🇽",

  "brazil": "🇧🇷",
  "brazilian": "🇧🇷",

  "argentina": "🇦🇷",
  "argentine": "🇦🇷",
  "argentenian": "🇦🇷",

  "chile": "🇨🇱",
  "chilean": "🇨🇱",

  "colombia": "🇨🇴",
  "colombian": "🇨🇴",

  "peru": "🇵🇪",
  "peruvian": "🇵🇪",

  "venezuela": "🇻🇪",
  "venezuelan": "🇻🇪",

  "cuba": "🇨🇺",
  "cuban": "🇨🇺",

  "guatemala": "🇬🇹",
  "guatemalan": "🇬🇹",

  "bolivia": "🇧🇴",
  "bolivian": "🇧🇴",

  "uruguay": "🇺🇾",
  "uruguayan": "🇺🇾",

  "ecuador": "🇪🇨",
  "ecuadorian": "🇪🇨",

  "paraguay": "🇵🇾",
  "paraguayan": "🇵🇾",

  "suriname": "🇸🇷",
  "surinamese": "🇸🇷",
};

// Leader → Country map
const LEADER_TO_COUNTRY = {
  "trump": "united states",
  "biden": "united states",

  "putin": "russia",
  "zelensky": "ukraine",

  "xi": "china",
  "jinping": "china",

  "kim jong un": "north korea",
  "netanyahu": "israel",

  "khamenei": "iran",
  "pezeshkian": "iran",

  "erdogan": "turkey",
};

const getFlagsFromTitle = (title) => {
  const text = title.toLowerCase().replace(/[^\w\s]/g, " ");
  const flags = new Set();

  // Country name detection
  Object.entries(COUNTRY_FLAGS).forEach(([country, flag]) => {
    if (text.includes(country)) {
      flags.add(flag);
    }
  });

  // Leader detection → infer country → flag
  Object.entries(LEADER_TO_COUNTRY).forEach(([leader, country]) => {
    if (text.includes(leader)) {
      const flag = COUNTRY_FLAGS[country];
      if (flag) flags.add(flag);
    }
  });

  return Array.from(flags);
};

// Escalation context for deaths → RED
const KILLED_RED_TRIGGERS = [
  "at least",
  "dozens",
  "scores",
  "hundreds",
  "multiple",
  "mass",
  "massacre",
  "civilians",
  "children",
  "journalists",
  "aid workers",
  "airstrike",
  "air strike",
  "missile",
  "bombing",
  "explosion",
  "shelling",
  "strike",
  "strikes",
];

// High-urgency diplomatic escalation → RED
const DIPLOMACY_RED_TRIGGERS = [
  "extremely tense",
  "urgent talks",
  "crisis meeting",
  "emergency summit",
  "high alert",
  "diplomatic emergency",
  "imminent conflict",
  "potential war",
  "red alert",
];

// Global attack triggers → RED
const GLOBAL_ATTACK_TRIGGERS = [
  "drone attack",
  "drone attacks",
  "drone strike",
  "drone strikes",
  "airstrike",
  "air strike",
  "missile strike",
  "rocket attack",
  "ballistic missile",
  "cruise missile",
  "intercepted missile",
  "bombing",
  "suicide bombing",
  "terror attack",
  "terrorist attack",
  "massacre",
  "mass killing",
  "civilian deaths",
  "deadliest",
  "hostage crisis",
  "assassination",
  "explosion",
  "shelling",
  "chemical attack",
  "biological attack",
  "radiological attack",
  "nuclear strike",
  "rocket strike",
  "air raid",
  "armed clash",
  "military engagement",
  "cross-border attack",
  "siege",
  "bomb threat",
  "terror plot",
  "suicide attack",
  "military raid",
  "large-scale raid",
];

// Conflict regions for global attack detection
const CONFLICT_REGIONS = [
  "ukraine",
  "russia",
  "syria",
  "iran",
  "iraq",
  "lebanon",
  "afghanistan",
  "yemen",
  "palestine",
  "gaza",
  "israel",
  "odessa",
  "kyiv",
  "kiev",
  "donetsk",
  "kharkiv",
  "luhansk",
  "hebron",
  "gaza strip",
  "west bank",
];

// Keyword-based urgency colors
const getUrgencyColor = (title) => {
  // Remove punctuation to prevent misclassification
  const text = title.toLowerCase().replace(/[^\w\s]/g, " ");

  const high = [
    "war declared",
    "state of war",
    "full-scale invasion",
    "full scale invasion",
    "invasion",
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

    // Evacuation & citizen warnings
    "evacuate immediately",
    "evacuation ordered",
    "mandatory evacuation",
    "leave immediately",
    "get out now",
    "border closed",
    "airspace closed",
    "embassy evacuates",
    "embassy closed",
    "emergency departure",
    "citizens urged to leave",
    "do not travel",

    // State emergency alerts
    "state of emergency",
    "emergency declaration",
    "red alert",
    "alert level raised",

    // WMDs
    "chemical weapons",
    "biological threat",
    "radiological threat",
    "dirty bomb",

    // Infrastructure collapse
    "nationwide blackout",
    "critical infrastructure",
    "hit infrastructure",
    "strikes infrastructure",
    "strikes hit infrastructure",
    "hits infrastructure",
    "destroys infrastructure",
  ];

  const medium = [
    // Military movement
    "military buildup",
    "troops massing",
    "forces deployed",
    "warships deployed",
    "fighter jets",
    "military drills",
    "combat readiness",

    // Rising conflict
    "rising tensions",
    "escalating tensions",
    "clashes reported",
    "exchange of fire",
    "skirmishes",
    "ceasefire violation",

    // Government actions
    "travel advisory",
    "security warning",
    "shelter in place",
    "curfew imposed",

    // Unrest
    "protests erupt",
    "violent protests",
    "civil unrest",
    "riots",
    "crackdown",

    // Cyber / infrastructure
    "cyberattack",
    "communications disrupted",
    "transport disrupted",
    "hack",
    "hackers",
    "hacking",
    "cyber breach",
    "espionage",
    "malware",
    "security breach",
    "targeted attack",
    "data theft",

    // Diplomacy & tension
    "talks collapse",
    "peace talks stall",
    "sanctions threatened",
    "tariff",
    "tariffs",
    "trade sanctions",
    "economic coercion",
    "economic pressure",
    "tense",
    "tensions",
    "extremely tense",
    "diplomatic solution",
    "diplomacy",
    "negotiation",
    "mediate",
    "mediation",
    "discuss",
    "dialogue",
    "urgent talks",
    "crisis talks",
    "high-level meeting",
    "summit",
    "summit talks",
    "diplomatic efforts",
    "conflict resolution",
    "peace negotiations",
    "intense negotiations",

    // Death baseline
    "killed",
    "dead",
    "death",
    "fatal",
    "fatalities",
  ];

  // Detection flags
  const hasHigh = high.some((word) => text.includes(word));
  const hasMedium = medium.some((word) => text.includes(word));
  const hasKilled = text.includes("killed") || text.includes("dead");
  const hasRedContext = KILLED_RED_TRIGGERS.some((word) => text.includes(word));
  const hasDiplomacyRed = DIPLOMACY_RED_TRIGGERS.some((word) => text.includes(word));

  // Improved global attack detection
  const isGlobalAttack = GLOBAL_ATTACK_TRIGGERS.some((trigger) =>
    CONFLICT_REGIONS.some((region) => new RegExp(`\\b${trigger}\\b|\\b${region}\\b`, "i").test(title))
  );

  // Priority:
  if (hasHigh) return "#ff4d4f"; // RED
  if (hasKilled && hasRedContext) return "#ff4d4f"; // Escalated RED
  if (hasDiplomacyRed) return "#ff4d4f"; // Diplomatic crisis → RED
  if (isGlobalAttack) return "#ff4d4f"; // Major global attack → RED
  if (hasMedium || hasKilled) return "#fa8c16"; // ORANGE
  return "#1890ff"; // BLUE
};

// Get first red headline for breaking banner
const getBreakingHeadline = (news) => news.find((item) => item.urgencyColor === "#ff4d4f");

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

const snippetToBullets = (snippet = "") => {
  const clean = snippet.replace(/\s+/g, " ").trim();
  if (!clean) return [];

  // split on sentence boundaries
  const sentences = clean.split(/(?<=[.!?])\s+/).filter(Boolean);

  // up to 4 bullets
  return sentences.slice(0, 4).map((s) => s.replace(/^[•\-]\s*/, "").trim());
};

// --- Related stories (fast overlap scoring; no heavy NLP) ---
const STOP_WORDS = new Set([
  "the","a","an","and","or","but","to","of","in","on","for","with","at","by","from","as",
  "is","are","was","were","be","been","it","its","this","that","these","those","after",
  "before","over","under","into","out","about","amid","says","say","new","latest","live",
  "update","breaking",
]);

const tokenize = (text = "") =>
  text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .filter((w) => w.length >= 3 && !STOP_WORDS.has(w));

const jaccardSimilarity = (aTokens, bTokens) => {
  const A = new Set(aTokens);
  const B = new Set(bTokens);
  if (A.size === 0 || B.size === 0) return 0;

  let intersection = 0;
  for (const t of A) if (B.has(t)) intersection++;

  const union = A.size + B.size - intersection;
  return union ? intersection / union : 0;
};

export default function Home() {
  const [news, setNews] = useState([]); // precomputed view-model items
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [breaking, setBreaking] = useState(null);
  const [showOnlyRed, setShowOnlyRed] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);

  useEffect(() => {
    const fetchNews = () => {
      fetch("/api/news")
        .then((res) => res.json())
        .then((data) => {
          const mapped = (Array.isArray(data) ? data : []).map((item) => {
            const urgencyColor = getUrgencyColor(item.title);
            const flags = getFlagsFromTitle(item.title);
            const source = item.source || getSourceNameFromLink(item.link);
            const dateText = item.pubDate ? new Date(item.pubDate).toLocaleString() : "";

            // tokens once for related-scoring
            const tokens = tokenize(`${item.title || ""} ${item.contentSnippet || ""}`);

            return {
              ...item,
              urgencyColor,
              flags,
              source,
              dateText,
              tokens,
            };
          });

          // Sort newest first
          mapped.sort((a, b) => {
            const da = a.pubDate ? new Date(a.pubDate).getTime() : 0;
            const db = b.pubDate ? new Date(b.pubDate).getTime() : 0;
            return db - da;
          });

          setNews(mapped);
          setBreaking(getBreakingHeadline(mapped));
          setLoading(false);
          setLastUpdated(new Date());
        })
        .catch((err) => console.error("Failed to fetch news:", err));
    };

    fetchNews();
    const interval = setInterval(fetchNews, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Related stories computed only when modal story changes
  const related = useMemo(() => {
    if (!selectedStory) return [];
    const baseTokens = selectedStory.tokens || tokenize(`${selectedStory.title || ""} ${selectedStory.contentSnippet || ""}`);

    const scored = news
      .filter((n) => n && n.link && n.link !== selectedStory.link)
      .map((n) => {
        const score = jaccardSimilarity(baseTokens, n.tokens || []);
        return { ...n, _score: score };
      })
      .filter((n) => n._score > 0.08)
      .sort((a, b) => b._score - a._score)
      .slice(0, 4);

    return scored;
  }, [selectedStory, news]);

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
            maxWidth: 1000,
            margin: "0 auto",
            fontFamily: "Arial, sans-serif",
          }}
        >
          <header style={{ textAlign: "center", marginBottom: 20 }}>
            <h1
              style={{
                fontSize: 42,
                fontWeight: 800,
                color: "#fff",
                textShadow: "0 0 8px #aaa, 0 0 12px #aaa",
                letterSpacing: 1.2,
              }}
            >
              Signal Watch Global
            </h1>
            <div style={{ marginTop: 10 }}>
  <a
    href="/dashboard"
    style={{
      color: "#fff",
      textDecoration: "none",
      background: "rgba(255,255,255,0.10)",
      border: "1px solid rgba(255,255,255,0.15)",
      padding: "2px 3px",
      borderRadius: 5,
      fontWeight: 700,
      fontSize: 25,
    }}
  >
    Dashboard
  </a>
</div>

            <p style={{ fontSize: 18, color: "#aaa" }}>Live Global Crisis Tracker</p>
            {lastUpdated && (
              <p style={{ fontSize: 12, color: "#aaa" }}>
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </header>

          {/* Red toggle */}
          <div style={{ marginBottom: 30, textAlign: "center" }}>
            <label
              style={{
                fontSize: 16,
                color: "#fff",
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                cursor: "pointer",
                backgroundColor: "rgba(0,0,0,0.5)",
                padding: "8px 12px",
                borderRadius: 6,
              }}
            >
              <input
                type="checkbox"
                checked={showOnlyRed}
                onChange={() => setShowOnlyRed(!showOnlyRed)}
                style={{ width: 18, height: 18, cursor: "pointer" }}
              />
              Show only high-urgency news
            </label>
          </div>

          {/* Breaking banner (kept as external link on purpose) */}
          {breaking && (
            <a
              href={breaking.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none" }}
            >
              <div
                style={{
                  backgroundColor: "#ff4d4f",
                  color: "#fff",
                  padding: "14px 20px",
                  borderRadius: 8,
                  marginBottom: 30,
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  boxShadow: "0 6px 16px rgba(0,0,0,0.4)",
                }}
              >
                <span
                  style={{
                    backgroundColor: "#fff",
                    color: "#ff4d4f",
                    padding: "4px 10px",
                    borderRadius: 4,
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  BREAKING
                </span>
                <span style={{ fontSize: 15 }}>{breaking.title}</span>
              </div>
            </a>
          )}

          {loading && <p style={{ textAlign: "center", color: "#fff" }}>Loading news...</p>}

          <main style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {news
              .filter((item) => !showOnlyRed || item.urgencyColor === "#ff4d4f")
              .map((item) => {
                return (
                  <div
                    key={item.id || item.link}
                    onClick={() => setSelectedStory(item)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") setSelectedStory(item);
                    }}
                    style={{ textDecoration: "none" }}
                  >
                    <div
                      style={{
                        padding: 20,
                        borderLeft: `6px solid ${item.urgencyColor}`,
                        borderRadius: 10,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
                        backgroundColor: "rgba(0,0,0,0.6)",
                        transition: "transform 0.15s ease, box-shadow 0.15s ease",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-3px)";
                        e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.6)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.5)";
                      }}
                    >
                      <div style={{ fontWeight: 600, fontSize: 16, color: "#fff" }}>
                        {item.flags?.length > 0 && (
                          <div style={{ fontSize: 18, marginBottom: 6 }}>
                            {item.flags.join(" ")}
                          </div>
                        )}
                        {item.title}
                      </div>

                      <div style={{ fontSize: 12, color: "#aaa", marginTop: 6 }}>
                        {item.dateText} {item.source ? `• ${item.source}` : ""}
                      </div>

                      {item.contentSnippet && (
                        <p style={{ marginTop: 10, color: "#eee", lineHeight: 1.5 }}>
                          {item.contentSnippet}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
          </main>
        </div>
      </div>

      {/* --- MODAL: Rundown + Related Stories --- */}
      {selectedStory && (
        <div
          onClick={() => setSelectedStory(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            padding: 16,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "min(760px, 100%)",
              background: "rgba(15,15,15,0.95)",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.12)",
              boxShadow: "0 12px 40px rgba(0,0,0,0.6)",
              padding: 20,
              color: "#fff",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "4px 10px",
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 800,
                      background: selectedStory.urgencyColor || "#333",
                      color: "#fff",
                    }}
                  >
                    RUNDOWN
                  </span>

                  <span style={{ fontSize: 12, color: "#bbb" }}>
                    {selectedStory.source || getSourceNameFromLink(selectedStory.link)}
                  </span>
                </div>

                <div style={{ fontSize: 18, fontWeight: 800, lineHeight: 1.3 }}>
                  {selectedStory.title}
                </div>

                <div style={{ marginTop: 8, color: "#aaa", fontSize: 12 }}>
                  {selectedStory.dateText || (selectedStory.pubDate ? new Date(selectedStory.pubDate).toLocaleString() : "")}
                </div>
              </div>

              <button
                onClick={() => setSelectedStory(null)}
                style={{
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.2)",
                  color: "#fff",
                  borderRadius: 10,
                  padding: "8px 12px",
                  cursor: "pointer",
                  height: 40,
                }}
              >
                Close
              </button>
            </div>

            <div style={{ marginTop: 12, fontSize: 20 }}>
              {(selectedStory.flags || getFlagsFromTitle(selectedStory.title)).join(" ")}
            </div>

            {/* Quick rundown bullets */}
            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#ddd", marginBottom: 8 }}>
                Quick rundown
              </div>
              <ul style={{ margin: 0, paddingLeft: 18, color: "#eee", lineHeight: 1.6 }}>
                {snippetToBullets(selectedStory.contentSnippet || "").map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
                {!selectedStory.contentSnippet && <li>No snippet available for this story.</li>}
              </ul>
            </div>

            {/* Related stories */}
            {related.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#ddd", marginBottom: 8 }}>
                  Related stories
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {related.map((r) => (
                    <button
                      key={r.id || r.link}
                      onClick={() => setSelectedStory(r)}
                      style={{
                        textAlign: "left",
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        borderLeft: `6px solid ${r.urgencyColor || getUrgencyColor(r.title)}`,
                        color: "#fff",
                        borderRadius: 10,
                        padding: "10px 12px",
                        cursor: "pointer",
                      }}
                    >
                      <div style={{ fontWeight: 800, fontSize: 13, marginBottom: 4 }}>
                        {r.title}
                      </div>
                      <div style={{ fontSize: 12, color: "#aaa" }}>
                        {(r.dateText || (r.pubDate ? new Date(r.pubDate).toLocaleString() : ""))} • {r.source || getSourceNameFromLink(r.link)}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div style={{ display: "flex", gap: 10, marginTop: 18, flexWrap: "wrap" }}>
              <a
                href={selectedStory.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  textDecoration: "none",
                  background: "#fff",
                  color: "#000",
                  padding: "10px 14px",
                  borderRadius: 10,
                  fontWeight: 900,
                }}
              >
                Read full article →
              </a>

              <button
                onClick={() => setSelectedStory(null)}
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "#fff",
                  padding: "10px 14px",
                  borderRadius: 10,
                  cursor: "pointer",
                  fontWeight: 800,
                }}
              >
                Back to feed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
