import express from "express";
import { upload } from "../middleware/upload.js";
import fs from "fs";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { verifyToken } from "../controllers/user.controllers.js";
import Product from "../models/Product.js";

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

gemini.post(
  "/upload-menu",
  upload.single("menu"),
  verifyToken,
  async (req, res) => {
    console.log("Request Body:", req.body);
    console.log("Request File:", req.file);
    const { projectId } = req.query;

    const userId = req.id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Token has been expired login again ...!",
      });
    }

    if (!req.file) {
      console.log("No file uploaded.");
      return res.status(400).send({ error: "No file uploaded." });
    }

    if (!projectId) {
      return res
        .status(400)
        .json({ success: false, message: "Project ID is required." });
    }

    const { file } = req;

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

      const image = {
        inlineData: {
          data: fs.readFileSync(filePath).toString("base64"),
          mimeType: file.mimetype,
        },
      };

      const prompt = `!important generate discription carefully should be simple easy to understand min (5 words) - max(10 words) 5-10 words && description should be different from title
            combine products with variants if provided separtely
            !important: Extract variant carefully bro Add variants all the variants from the image must, if mentioned. Import variants carefully and strictly follow the pattern. The response must be strictly in JavaScript array format. The data must follow the required structure with the following fields:
            - name // for non-veg category try adding something non-veg in title & description it can be chicken mutton
            - description // shoud be different from title for non-veg category try adding meet type name in the description "chicken" , "mutton"
            - category (capitalize the first letter add if missing)
            - sub_category  (capitalize the first letter and if missing same as category)
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
                description: "Product Description", // Generate yourself must add full stop .
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

      //       const prompt = `Extract product details from the menu and return them as a JavaScript array of objects. Follow these strict guidelines:

      // 1. **Description**:
      //    - Should be simple (5-10 words) and easy to understand.
      //    - Must be different from the title.
      //    - For non-veg items, include the meat type (e.g., "chicken", "mutton").

      // 2. **Variants**:
      //    - If provided separately, combine them under a single product.
      //    - Extract all variants carefully and ensure they follow a strict format.
      //    - Structure: [{ "property_name": "string", "values": [{ title: "Small", price: "499" }, { title: "Large", price: "999" }] }]
      //    - Each product can have only one variant type.

      // 3. **Fields Required**:
      //    - **name**: Product name (for non-veg items, try adding meat type).
      //    - **description**: Unique from the title.
      //    - **category**: Capitalize the first letter; add if missing.
      //    - **sub_category**: Capitalize the first letter; default to category if missing.
      //    - **base_price**: Set to the lowest variant price if variants exist; otherwise, use the product price.
      //    - **item_type**: "Goods" or "Service".
      //    - **variants**: Must follow the specified format (empty if not applicable).
      //    - **food_type**: "veg", "non_veg", or "egg" (add if missing).

      // 4. **Data Handling**:
      //    - Fill in missing fields with reasonable dummy data.
      //    - Do not add comments, extra notes, or any information beyond the required structure.

      // ### Expected Output Example:

      // [
      //   {
      //     "name": "Chicken Burger",
      //     "description": "Delicious grilled chicken burger",
      //     "category": "Fast Food",
      //     "sub_category": "Burgers",
      //     "base_price": 150,
      //     "item_type": "Goods",
      //     "variants": [{ "property_name": "Size", "values": [{ "title": "Regular", "price": "150" }, { "title": "Large", "price": "200" }] }],
      //     "food_type": "non_veg"
      //   }
      // ]
      //   `;

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
        parsedProducts[i].id =
          Date.now().toString() + Math.random().toString(36).substr(2, 5);
        parsedProducts[i].userId = userId;
        parsedProducts[i].projectId = projectId;
      }

      if (parsedProducts.length > 0) {
        await Product.insertMany(parsedProducts, { ordered: false }).catch(
          (err) => console.log("Error inserting data:", err.message)
        );
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
  }
);

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
