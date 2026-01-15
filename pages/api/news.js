import Parser from "rss-parser";
const parser = new Parser();

export default async function handler(req, res) {
  // Reliable global news feeds
  const feeds = [
    "https://news.google.com/rss/search?q=world+crisis&hl=en-US&gl=US&ceid=US:en", // Google News search
    "https://www.aljazeera.com/xml/rss/all.xml", // Al Jazeera
    "https://feeds.bbci.co.uk/news/world/rss.xml" // BBC World News
  ];

  // Expanded keywords for urgent/global news
  const keywords = [
    "war","attack","bomb","invasion","massacre","protests","conflict","tension",
    "military","strike","clashes","hostage","explosion","siege","assault","occupation",
    "escalation","airstrike","shelling","firefight","sanctions","diplomatic","coup",
    "uprising","resistance","regime","embargo","political","government","leaders",
    "refugee","evacuation","displacement","casualty","injured","fatalities","humanitarian",
    "aid","crisis","starvation","flood","earthquake","hurricane","tsunami","wildfire",
    "storm","tornado","landslide","drought","eruption","epidemic","outbreak","pandemic",
    "disease","virus","terrorist","attackers","bombing","assassination","emergency",
    "alert","disaster","evacuated","collapsed"
  ];

  let items = [];

  for (const url of feeds) {
    try {
      const feed = await parser.parseURL(url);

      // Keep all items, but only include relevant keywords
      const relevantItems = feed.items.filter(item => {
        const text = (item.title + " " + (item.contentSnippet || "")).toLowerCase();
        return keywords.some(k => text.includes(k));
      });

      items = items.concat(relevantItems);
    } catch (err) {
      console.error("Error fetching feed:", url, err);
    }
  }

  // Remove duplicates by title
  const seen = new Set();
  items = items.filter(item => {
    if (seen.has(item.title)) return false;
    seen.add(item.title);
    return true;
  });

  // Sort newest first
  items.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

  // Limit to 50 items
  items = items.slice(0, 50);

  // Only send clean info to frontend
  const sanitized = items.map(({ title, link, pubDate, contentSnippet }) => ({
    title,
    link,
    pubDate,
    contentSnippet
  }));

  res.status(200).json(sanitized);
}