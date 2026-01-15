import Parser from "rss-parser";
const parser = new Parser();

// Keywords to include as relevant headlines
const keywords = [
  "war", "attack", "bomb", "invasion", "massacre",
  "protests", "crisis", "conflict", "sanctions", "tension"
];

export default async function handler(req, res) {
  const feeds = [
    "https://www.reuters.com/world/rss", // Reuters World
    "https://www.aljazeera.com/xml/rss/all.xml", // Al Jazeera All News
    "https://apnews.com/rss" // AP Top Stories
  ];

  let items = [];

  for (const url of feeds) {
    try {
      const feed = await parser.parseURL(url);

      // Filter each feed by keywords in the title or snippet
      const relevantItems = feed.items.filter(item => {
        const text = (item.title + " " + (item.contentSnippet || "")).toLowerCase();
        return keywords.some(word => text.includes(word));
      });

      // Take up to 20 relevant items per feed
      items = items.concat(relevantItems.slice(0, 20));
    } catch (err) {
      console.error("Error fetching feed:", url, err);
    }
  }

  // Remove duplicates by title
  const seenTitles = new Set();
  items = items.filter(item => {
    if (seenTitles.has(item.title)) return false;
    seenTitles.add(item.title);
    return true;
  });

  // Sort by newest first
  items.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

  // Limit total items to 50 for clean display
  items = items.slice(0, 50);

  res.status(200).json(items);
}