import express from "express";
import Image from "../models/Image.js";
import puppeteer from "puppeteer-core";
import ejs from "ejs";

const search = express.Router();

const escapeRegex = (str) => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); 
};

const unwantedPatterns = [/^\[\d+-\d+\]$/, /^\\?\[\d+-\d+\\?\]$/, /^\d+$/]; 
search.get("/", async (req, res) => {
  const { query } = req.query;

  console.log("Search Query:", query);

  if (!query) {
    return res.status(400).json({ error: "Query is required" });
  }

  // console.log("Search Query:", query);

  try {
    const safeQuery = escapeRegex(query.trim());
    let words = safeQuery.split(/\s+/).filter((word) => {
      return !unwantedPatterns.some((pattern) =>
        typeof pattern === "string"
          ? word.toLowerCase() === pattern.toLowerCase()
          : pattern.test(word)
      );
    });

    console.log("Filtered Words:", words);

    if (words.length === 0) {
      return res.status(200).json({ data: [] }); 
    } 

    const productImages = new Map();

    const addImagesWithScore = async (searchTerm, score) => {
      const images = await Image.find({
        $or: [
          { title: { $regex: searchTerm, $options: "i" } },
          { description: { $regex: searchTerm, $options: "i" } },
          { tags: { $regex: searchTerm, $options: "i" } },
          { dominantColors: { $regex: searchTerm, $options: "i" } },
        ],
      });

      images.forEach((image) => {
        if (productImages.has(image._id)) {
          productImages.set(image._id, productImages.get(image._id) + score);
        } else {
          productImages.set(image._id, score);
        }
      });
    };

    await addImagesWithScore(query, 5);

    for (const word of words) {
      await addImagesWithScore(word, 3);
    }

    for (const word of words) {
      if (word.length > 3) {
        await addImagesWithScore(word.substring(0, 3), 2);
      }
    }

    for (const char of query) {
      await addImagesWithScore(char, 1);
    }

    const sortedImages = [...productImages.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([id]) => id);

    const relevantImages = await Image.find({ _id: { $in: sortedImages } });

    const limit = Math.ceil(relevantImages.length * 0.3);
    return res.status(200).json({ data: relevantImages.slice(0, limit) });
  } catch (err) {
    console.error("Search Error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});


search.get("/hello", async (req, res) => {
  try {
    // Connect to your already open Chrome browser
    const browser = await puppeteer.connect({
      browserURL: "http://localhost:9222", // Connect to existing browser
      defaultViewport: null, // Keep the original Chrome window size
    });

    const pages = await browser.pages();
    const page = pages[0]; // Use the first open tab

    // Navigate in the same window
    await page.goto(
      "https://www.zomato.com/php/online_ordering/menu_edit?action=get_content_menu&res_id=1234",
      { waitUntil: "networkidle2" }
    );

    console.log("Final URL:", page.url());

    // Wait for menu content
    await page.waitForSelector(".menu-container, .menu-item", {
      timeout: 10000,
    });

    // Get page content
    const pageContent = await page.evaluate(() => document.body.innerHTML);
    console.log("Page content length:", pageContent.length);

    res
      .status(200)
      .send("Puppeteer navigation successful in your actual Chrome window!");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error accessing Zomato menu");
  }
});


export default search;
