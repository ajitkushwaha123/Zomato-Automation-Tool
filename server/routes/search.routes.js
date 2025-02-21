import express from "express";
import Image from "../models/Image.js";

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

export default search;
