import express from "express";
import { upload } from "../middleware/upload.js";
import fs from "fs";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const gemini = express.Router();
const genAI = new GoogleGenerativeAI(process.env.Gemini_API_KEY);

gemini.post("/upload-menu", upload.single("menu"), async (req, res) => {
  console.log("Request Body:", req.body);
  console.log("Request File:", req.file);
  if (!req.file) {
    console.log("No file uploaded.");
    return res.status(400).send({ error: "No file uploaded." });
  }

  const { file } = req;

  // Validate file type
  const allowedMimeTypes = [
    "image/png",
    "image/webp",
    "image/jpeg",
    "application/pdf",
  ];
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return res.status(400).send({
      error: "Only PNG, WebP, JPEG images, and PDF files are allowed.",
    });
  }

  console.log("file", file);

  try {
    const filePath = `${file.destination}/${file.filename}`;
    if (!fs.existsSync(filePath)) {
      return res.status(400).send({ error: "Uploaded file not found." });
    }

    // Prepare image data for API request
    const image = {
      inlineData: {
        data: fs.readFileSync(filePath).toString("base64"),
        mimeType: file.mimetype,
      },
    };

    // Define the prompt
    const prompt = `
      !important: The response must strictly be in a JavaScript array format. The data must follow the required structure with the following fields: 
      - name
      - description
      - category (capitalize the first letter)
      - sub_category
      - base_price
      - item_type (Goods or Service)
      - variants (array of objects in the format: [{ "variant_name": "string", "price": int }])
      - food_type

      Ensure all fields are fully filled, except "Variants" which can be left empty for some products. 
      Do not add comments, notes, or any additional information—only provide the array data.

      Extract the product details from the menu and return them as a JavaScript array of objects. For example:
      [
        {
          name: "Product Name",
          description: "Product Description", // Generate yourself
          category: "Category", 
          sub_category: "Subcategory",
          base_price: 100, 
          item_type: "service" // Default if not provided
          variants: [{ "variant_name": "Small", "price": 50 }, { "variant_name": "Large", "price": 80 }],
          food_type: "veg" (String) ,  optiond (stricly fill this options only take care of case as well) => {"veg" , "non_veg" , "egg"}// Add Yourself if not provided
        }, ...
      ];

      Ensure all fields are completed accurately. Use your knowledge to fill in missing product details, but exclude variants if they are not explicitly mentioned in the menu/image/PDF.
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent([prompt, image]);

    if (!result || !result.response?.text?.()) {
      return res.status(500).send({
        error: "Failed to generate a valid response from Gemini API.",
      });
    }

    const responseText = result.response.text();
    console.log("Original Response:", responseText);

    if (responseText.includes("[")) {
      let trimmedResponse = responseText.substring(responseText.indexOf("["));

      const lastValidIndex = trimmedResponse.lastIndexOf("]");

      if (lastValidIndex === -1) {
        trimmedResponse += "]";
      } else {
        trimmedResponse = trimmedResponse.substring(0, lastValidIndex + 1);
      }

      const openBrackets = (trimmedResponse.match(/\[/g) || []).length;
      const closeBrackets = (trimmedResponse.match(/]/g) || []).length;

      if (openBrackets > closeBrackets) {
        trimmedResponse += "]".repeat(openBrackets - closeBrackets);
      }

      try {
        const parsedData = JSON.parse(trimmedResponse);

        const product = [];
        for (let i = 0; i < parsedData.length; i++) {
          product.push(parsedData[i]);
        }

        console.log("Parsed Data:", product);

        return res.status(200).json({
          data: parsedData,
          message: "Menu data processed successfully.",
        });
      } catch (error) {
        return res.status(400).send({
          error: "Invalid response format. Could not parse data.",
        });
      }
    } else {
      return res.status(400).send({
        error: "Response does not contain a valid array structure.",
      });
    }
  } catch (err) {
    console.error("Processing Error:", err);
    return res.status(500).send({
      error: `Error during processing: ${err.message}`,
    });
  }
});

gemini.post("/update-menu", async (req, res) => {
  const { data, input } = req.body;

  try {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return res
        .status(400)
        .send({
          error: "Invalid data format. 'data' must be a non-empty array.",
        });
    }

    const prompt = input;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt + "\n" + "update the provided data based on my prompt" + "\n" + JSON.stringify(data));

    if (!result || !result.response?.text) {
      return res.status(500).send({
        error: "Failed to generate a valid response from Gemini API.",
      });
    }

    const responseText = result.response.text();

    console.log("Original Response:", responseText);

    if (responseText.includes("[")) {
      let trimmedResponse = responseText.substring(responseText.indexOf("["));
      const lastValidIndex = trimmedResponse.lastIndexOf("]");

      if (lastValidIndex === -1) {
        trimmedResponse += "]";
      } else {
        trimmedResponse = trimmedResponse.substring(0, lastValidIndex + 1);
      }

      const openBrackets = (trimmedResponse.match(/\[/g) || []).length;
      const closeBrackets = (trimmedResponse.match(/]/g) || []).length;

      if (openBrackets > closeBrackets) {
        trimmedResponse += "]".repeat(openBrackets - closeBrackets);
      }

      try {
        const parsedData = JSON.parse(trimmedResponse);
        console.log("Parsed Data:", parsedData);

        return res.status(200).json({
          data: parsedData,
          message: "Menu data processed successfully.",
        });
      } catch (error) {
        return res.status(400).send({
          error: "Invalid response format. Could not parse data.",
        });
      }
    } else {
      return res.status(400).send({
        error: "Response does not contain a valid array structure.",
      });
    }
  } catch (err) {
    return res.status(500).send({
      error: `Error during processing: ${err.message}`,
    });
  }
});

export default gemini;
