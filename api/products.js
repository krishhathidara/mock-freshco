// api/products.js
import fs from "fs/promises";
import path from "path";

let cache = null;

async function loadData() {
  if (cache) return cache;
  const file = path.join(process.cwd(), "data", "products.json");
  const text = await fs.readFile(file, "utf8");
  cache = JSON.parse(text);
  return cache;
}

function cors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

export default async function handler(req, res) {
  cors(res);
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  try {
    const data = await loadData();
    res.status(200).json(data);
  } catch (err) {
    console.error("❌ FreshCo API error:", err);
    res.status(500).json({ error: "Failed to load products" });
  }
}
