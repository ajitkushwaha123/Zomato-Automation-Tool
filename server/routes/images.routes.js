import express from "express";
import { v2 as cloudinary } from "cloudinary";
import { upload } from "../middleware/upload.js";
import fs from "fs";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Image from "../models/Image.js";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const image = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const extractValidJsonObjects = (incompleteJson) => {
  let trimmedResponse = incompleteJson.trim();
  const validObjects = [];
  let currentObject = "";
  let braceCount = 0;

  for (const char of trimmedResponse) {
    currentObject += char;
    if (char === "{") braceCount++;
    if (char === "}") braceCount--;

    if (braceCount === 0 && currentObject.trim()) {
      try {
        validObjects.push(JSON.parse(currentObject));
        currentObject = "";
      } catch {
        currentObject = "";
      }
    }
  }

  return validObjects;
};

image.post("/upload", upload.single("menu"), async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    console.log("Request File:", req.file);

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    const { file } = req;

    // Check for allowed file types
    const allowedMimeTypes = [
      "image/png",
      "image/webp",
      "image/jpeg",
      "application/pdf",
    ];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return res.status(400).json({
        error: "Only PNG, WebP, JPEG images, and PDF files are allowed.",
      });
    }

    const filePath = `${file.destination}/${file.filename}`;
    if (!fs.existsSync(filePath)) {
      return res.status(400).json({ error: "Uploaded file not found." });
    }

    // Prepare image data for API request
    const imageContent = {
      inlineData: {
        data: fs.readFileSync(filePath).toString("base64"),
        mimeType: file.mimetype,
      },
    };

    // Define the prompt
    const prompt = `
      Analyze this image and generate the following JSON:
      [
        {
          "title": "Image Title",
          "description": "Image Description",
          "tags": ["tag1", "tag2"],
          "dominantColors": ["#FFFFFF", "#000000"],
          "featureVector": [0.1, 0.2, 0.3]
        }
      ]
    `;

    // Use Google Generative AI to analyze the image
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent([prompt, imageContent]);

    if (!result || !result.response?.text?.()) {
      return res.status(500).json({
        error: "Failed to generate a valid response from Gemini API.",
      });
    }

    const responseText = result.response.text();
    const imageData = extractValidJsonObjects(responseText);

    if (!imageData.length) {
      return res.status(500).json({
        error: "Failed to extract valid JSON objects from Gemini response.",
      });
    }

    const { title, description, tags, dominantColors, featureVector } =
      imageData[0];

    // Upload the file to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      folder: "uploads",
      public_id: file.filename,
      display_url: "auto",
      tags: tags,
      context: `title=${title}|description=${description}`,
      display_name: title,
      resource_type: "auto",
    });

    console.log("Image Data:", imageData);
    console.log("File uploaded to Cloudinary:", uploadResult);

    // Save metadata in the database
    const imageModel = new Image({
      url: uploadResult.secure_url,
      description,
      tags,
      dominantColors,
      featureVector,
      title,
    });

    await imageModel.save();

    // Respond with success
    return res.status(200).json({
      cloudinaryUrl: uploadResult.secure_url,
      imageData,
      message: "File uploaded and processed successfully.",
    });
  } catch (error) {
    console.error("Error processing file upload:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});

image.get("/all", async (req, res) => {
  try {
    const images = await Image.find({});

    if (!images || !images.length) {
      return res.status(404).json({ error: "No images found." });
    }

    return res.status(200).json({ data: images });
  } catch (err) {
    console.error("Error getting all images:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

export default image;
