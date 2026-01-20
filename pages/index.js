// File: pages/index.js
// Date: 2026-01-16
import { useEffect, useState } from "react";

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

    "egypt": "🇪🇬",
    "egyptian": "🇪🇬",

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

    "venezuela": "🇻🇪",
    "venezuelan": "🇻🇪",

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
  
    "erdogan": "turkey"
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
  "strikes"
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
  "red alert"
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
  "large-scale raid"
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
  "west bank"
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
    "destroys infrastructure"
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
    "fatalities"
  ];

  // Detection flags
  const hasHigh = high.some(word => text.includes(word));
  const hasMedium = medium.some(word => text.includes(word));
  const hasKilled = text.includes("killed") || text.includes("dead");
  const hasRedContext = KILLED_RED_TRIGGERS.some(word => text.includes(word));
  const hasDiplomacyRed = DIPLOMACY_RED_TRIGGERS.some(word => text.includes(word));

  // Improved global attack detection
  const isGlobalAttack = GLOBAL_ATTACK_TRIGGERS.some(trigger =>
    CONFLICT_REGIONS.some(region =>
      new RegExp(`\\b${trigger}\\b|\\b${region}\\b`, 'i').test(title)
    )
  );

  // Priority:
  if (hasHigh) return "#ff4d4f";                    // RED
  if (hasKilled && hasRedContext) return "#ff4d4f"; // Escalated RED
  if (hasDiplomacyRed) return "#ff4d4f";            // Diplomatic crisis → RED
  if (isGlobalAttack) return "#ff4d4f";             // Major global attack → RED
  if (hasMedium || hasKilled) return "#fa8c16";     // ORANGE
  return "#1890ff";                                  // BLUE
};

// Get first red headline for breaking banner
const getBreakingHeadline = (news) => {
  return news.find((item) => getUrgencyColor(item.title) === "#ff4d4f");
};

export default function Home() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [breaking, setBreaking] = useState(null);
  const [showOnlyRed, setShowOnlyRed] = useState(false);

  useEffect(() => {
    const fetchNews = () => {
      fetch("/api/news")
        .then((res) => res.json())
        .then((data) => {
          const sorted = data.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
          setNews(sorted);
          setBreaking(getBreakingHeadline(sorted));
          setLoading(false);
          setLastUpdated(new Date());
        })
        .catch((err) => console.error("Failed to fetch news:", err));
    };

    fetchNews();
    const interval = setInterval(fetchNews, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
        maxWidth: 1000,
        margin: "0 auto",
        padding: 20,
        fontFamily: "Arial, sans-serif",
        backgroundImage: `public/nasa-Q1p7bh3SHj8-unsplash (1).jpg`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        color: "#fff",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* ===== Crosshair HUD (behind content) ===== */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: cursorPos.y,
            left: 0,
            width: "100%",
            height: 1,
            backgroundColor: "rgba(0,255,204,0.2)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: cursorPos.x,
            width: 1,
            height: "100%",
            backgroundColor: "rgba(0,255,204,0.2)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: cursorPos.y - 10,
            left: cursorPos.x - 10,
            width: 20,
            height: 20,
            border: "2px solid rgba(0,255,204,0.2)",
            borderRadius: 2,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background:
              "linear-gradient(rgba(0,255,204,0.02) 1px, transparent 1px)",
            backgroundSize: "100% 4px",
          }}
        />
      </div>

        <header style={{ textAlign: "center", marginBottom: 20 }}>
          <h1 style={{
            fontSize: 42,
            fontWeight: 800,
            color: "#00ffcc",
            textShadow: "0 0 8px #00ffcc, 0 0 12px #00ffcc",
            letterSpacing: 1.2,
          }}>SignalWatchGlobal</h1>
          <p style={{ fontSize: 18, color: "#88ffdd" }}>Live Global Crisis Tracker</p>
          {lastUpdated && <p style={{ fontSize: 12, color: "#aaa" }}>Last updated: {lastUpdated.toLocaleTimeString()}</p>}
        </header>
  
        {/* Red toggle */}
        <div style={{ marginBottom: 30, textAlign: "center" }}>
          <label style={{
            fontSize: 16,
            color: "#fff",
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            cursor: "pointer",
            backgroundColor: "rgba(0,0,0,0.5)",
            padding: "8px 12px",
            borderRadius: 6,
          }}>
            <input
              type="checkbox"
              checked={showOnlyRed}
              onChange={() => setShowOnlyRed(!showOnlyRed)}
              style={{ width: 18, height: 18, cursor: "pointer" }}
            />
            Show only high-urgency news
          </label>
        </div>
  
        {/* Breaking banner */}
        {breaking && (
          <a href={breaking.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
            <div style={{
              backgroundColor: "#ff4d4f",
              color: "#fff",
              padding: "14px 20px",
              borderRadius: 8,
              marginBottom: 30,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 12,
              boxShadow: "0 6px 16px rgba(0,0,0,0.4)"
            }}>
              <span style={{
                backgroundColor: "#fff",
                color: "#ff4d4f",
                padding: "4px 10px",
                borderRadius: 4,
                fontSize: 12,
                fontWeight: 700
              }}>BREAKING</span>
              <span style={{ fontSize: 15 }}>{breaking.title}</span>
            </div>
          </a>
        )}
  
        {loading && <p style={{ textAlign: "center", color: "#fff" }}>Loading news...</p>}
  
        <main style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {news
            .filter(item => !showOnlyRed || getUrgencyColor(item.title) === "#ff4d4f")
            .map((item, index) => {
              const color = getUrgencyColor(item.title);
              const flags = getFlagsFromTitle(item.title);
              return (
                <a key={index} href={item.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                  <div style={{
                    padding: 20,
                    borderLeft: `6px solid ${color}`,
                    borderRadius: 10,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
                    backgroundColor: "rgba(0,0,0,0.6)",
                    transition: "transform 0.15s ease, box-shadow 0.15s ease",
                    cursor: "pointer"
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
                      {flags.length > 0 && (
                        <div style={{ fontSize: 18, marginBottom: 6 }}>
                          {flags.join(" ")}
                        </div>
                      )}
                      {item.title}
                    </div>
                    {item.pubDate && <div style={{ fontSize: 12, color: "#ccc", marginTop: 6 }}>{new Date(item.pubDate).toLocaleString()}</div>}
                    {item.contentSnippet && <p style={{ marginTop: 10, color: "#eee", lineHeight: 1.5 }}>{item.contentSnippet}</p>}
                  </div>
                </a>
              );
            })}
        </main>
  
        {/* HUD animations */}
        <style jsx>{`
          @keyframes hudScan {
            0% { background-position: 0 0, 0 0; }
            100% { background-position: 1000px 0, 0 1000px; }
          }
          @keyframes scanLine {
            0% { top: -2px; }
            100% { top: 100%; }
          }
            @keyframes linePulse {
                0% { opacity: 0.5; }
                100% { opacity: 1; }
            }

                @keyframes squarePulse {
                0% { box-shadow: 0 0 6px #00ffcc; transform: scale(0.95); }
                100% { box-shadow: 0 0 14px #00ffcc; transform: scale(1.05); }
            }

                @keyframes scanLine {
                0% { background-position: 0 0; }
                100% { background-position: 0 100%; }
            }
        `}</style>
      </div>
    );
  }