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
      items = items.concat(feed.items.slice(0, 10));
    } catch (err) {
      console.error(err);
    }
  }

  res.status(200).json(items);
}