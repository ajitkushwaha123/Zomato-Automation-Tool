import express from "express";
import Image from "../models/Image.js";
const search = express.Router();

search.get("/", async (req, res) => {
  const { query } = req.query;

  const words = query.split(" ");
  console.log("Words:", words);

  if (!query) {
    return res.status(400).json({ error: "Query is required" });
  }

  console.log("Query:", query);
  try {
    const productImages = [];
    for (let i = 0; i < words.length; i++) {
      const images = await Image.find({
        $or: [
          { title: { $regex: words[i], $options: "i" } },
          { description: { $regex: words[i], $options: "i" } },
          { tags: { $regex: words[i], $options: "i" } },
          { dominantColors: { $regex: words[i], $options: "i" } },
        ],
      });

      console.log("Images:", images);
      productImages.push(...images);
    }

    return res.status(200).json({ data: productImages });
  } catch (err) {
    return res.json({ message: err });
  }
});

export default search;
