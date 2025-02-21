import express from "express";
import { upload } from "../middleware/upload.js";
import fs from "fs";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const gemini = express.Router();
const genAI = new GoogleGenerativeAI(process.env.Gemini_API_KEY);

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
      !important: Extract variant carefully bro Add variants all the variants from the image must, if mentioned. Import variants carefully and strictly follow the pattern. The response must be strictly in JavaScript array format. The data must follow the required structure with the following fields:
      - name // for non-veg category try adding something non-veg in title & description it can be chicken mutton
      - description // shoud be different from title for non-veg category try adding meet type name in the description "chicken" , "mutton"
      - category (capitalize the first letter)
      - sub_category
      - base_price (must be equal to lowest variant price if variants are present else provide simple product price)
      - item_type (Goods or Service)
      - variants (array of objects in the format: [{ "property_name" : "string", "values": [{title : "Small" , price : "499"} , {title : "Large" , price : "999"}] }]) - variants size must be 1
      - food_type

      Add dummy data if something is missing.

      Ensure all fields are fully filled, except for "Variants", which can be left empty for some products. Do not add comments, notes, or any additional information—only provide the array data.

      Extract the product details from the menu and return them as a JavaScript array of objects. For example:
      [
        {
          name: "Product Name",
          description: "Product Description", // Generate yourself
          category: "Category", 
          sub_category: "Subcategory",
          base_price: 100, 
          item_type: "service" // Default if not provided
          variants: [{ property_name : "Size", values : [{title : "Small" , price : "100"} , {title : "Large" , price : "999"}] }] // If variants are provided, add them in this format.
          food_type: "veg" // (String) - options: {"veg", "non_veg", "egg"} // Add yourself if not provided
        },
        ...
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

    const parsedProducts = extractValidJsonObjects(responseText);
    console.log(parsedProducts);

    for (let i = 0; i < parsedProducts.length; i++) {
      parsedProducts[i].id = i + 1;
    }

    return res.status(200).json({
      data: parsedProducts,
      message: "Menu data processed successfully.",
    });
  } catch (err) {
    console.error("Processing Error:", err);
    return res.status(500).send({
      error: `Error during processing: ${err.message}`,
    });
  }
});

gemini.post("/update-menu", async (req, res) => {
  const { data, input } = req.body;
  console.log("Request Body:", req.body);
  
  try {
    if (!data || data.length === 0) {
      return res.status(400).send({
        error: "Invalid data format. 'data' must be a non-empty array.",
      });
    }

    const prompt = input;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(
      prompt +
        "\n" +
        "update the provided data based on my prompt" +
        "\n" +
        JSON.stringify(data)
    );

    if (!result || !result.response?.text) {
      return res.status(500).send({
        error: "Failed to generate a valid response from Gemini API.",
      });
    }

    const responseText = result.response.text();
    console.log("Original Response:", responseText);

    const parsedProducts = extractValidJsonObjects(responseText);
    console.log(parsedProducts);

    return res.status(200).json({
      data: parsedProducts,
      message: "Menu data processed successfully.",
    });
  } catch (err) {
    return res.status(500).send({
      error: `Error during processing: ${err.message}`,
    });
  }
});

export default gemini;
