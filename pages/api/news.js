import Parser from "rss-parser";
const parser = new Parser();

export default async function handler(req, res) {
  const feeds = [
    "https://www.reuters.com/world/rss",
    "https://www.aljazeera.com/xml/rss/all.xml",
    "https://apnews.com/rss"
  ];

  let items = [];

  for (const url of feeds) {
    try {
      const feed = await parser.parseURL(url);
      // Take up to 20 items from each feed
      items = items.concat(feed.items.slice(0, 20));
    } catch (err) {
      console.error("Error fetching feed:", url, err);
    }
  }

  // Remove duplicate headlines (based on title)
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