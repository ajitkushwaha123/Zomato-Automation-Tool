import express from "express";
import puppeteer from "puppeteer";

const scrape = express.Router();
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

scrape.get("/", async (req, res) => {
  try {
    const { resId, browserEndPoint } = req.query;
    if (!resId) {
      return res
        .status(400)
        .json({ success: false, message: "Restaurant ID is required." });
    }

    if (!browserEndPoint) {
      return res
        .status(400)
        .json({ success: false, message: "browserEndPoint ID is required." });
    }

    console.log(resId);
    console.log(browserEndPoint);

    //  const browser = await puppeteer.connect({
    //    browserURL: "http://localhost:9222", 
    //    defaultViewport: null, 
    //  });

    const browser = await puppeteer.connect({
      browserURL: "http://127.0.0.1:9222", 
      defaultViewport: null,
    });

    const pages = await browser.pages();
    const page = pages[0];
    
    await page.goto(
      `https://www.zomato.com/php/online_ordering/menu_edit?action=get_content_menu&res_id=${resId}`,
      { waitUntil: "networkidle2" }
    );

    await delay(2000);

    const menu = await page.evaluate(() => {
      const menuElement = document.querySelector("pre");
      if (menuElement) {
        try {
          return JSON.parse(menuElement.textContent);
        } catch (error) {
          console.error("Error parsing menu JSON:", error);
          return null;
        }
      }
      return null;
    });

    console.log("Zomato Menu Data:", menu);

    if (!menu || !menu.data) {
      return res.status(400).json({ error: "No valid menu data found." });
    }

    const { menuResponse } = menu.data || {};
    if (!menuResponse) {
      return res
        .status(400)
        .json({ error: "Invalid menu response structure." });
    }

    const { catalogueWrappers = [], categoryWrappers = [] } = menuResponse;

    const zomatoProduct = catalogueWrappers.map((product, index) => {
      const {
        catalogue = {},
        variantWrappers = [],
        catalogueTags = [],
        cataloguePropertyWrappers = [],
      } = product || {};

      const {
        name = "Unnamed Dish",
        description = "",
        imageUrl = "",
      } = catalogue;

      let base_price = Infinity;
      let variants = [];

      cataloguePropertyWrappers.forEach((property) => {
        const { catalogueProperty = {} } = property;
        let property_name = catalogueProperty?.name || "Unknown";
        const { propertyValues = [] } = catalogueProperty;

        let values = [];

        propertyValues.forEach((propertyValue) => {
          let variant_name = propertyValue?.value || "Unknown";
          const { propertyValueId } = propertyValue;

          variantWrappers.forEach((variant) => {
            const { variantPrices = [], variantPropertyValues = [] } = variant;

            const matchingVariant = variantPropertyValues.find(
              (v) => v.propertyValueId === propertyValueId
            );

            if (matchingVariant) {
              const { variantId } = matchingVariant;

              variantPrices.forEach((priceObj) => {
                if (priceObj.variantId === variantId) {
                  values.push({
                    title: variant_name,
                    price: priceObj.price,
                  });

                  // Update base_price to the lowest price
                  base_price = Math.min(base_price, priceObj.price);
                }
              });
            }
          });
        });

        if (values.length > 0) {
          variants.push({ property_name, values });
        }
      });

      variantWrappers.forEach((variant) => {
        const { variantPrices = [] } = variant;
        variantPrices.forEach((priceObj) => {
          base_price = Math.min(base_price, priceObj.price);
        });
      });

      if (base_price === Infinity) {
        base_price = catalogue?.price || 0;
      }

      let sub_category = "Uncategorized";
      let category_name = "Uncategorized";

      categoryWrappers.forEach((categories) => {
        const { category = {}, subCategoryWrappers = [] } = categories;

        subCategoryWrappers.forEach((subCategories) => {
          const { subCategory = {}, subCategoryEntities = [] } = subCategories;

          subCategoryEntities.forEach((subCat) => {
            if (subCat?.entityId === catalogue?.catalogueId) {
              sub_category = subCategory?.name || "Uncategorized";
              category_name = category?.name || "Uncategorized";
            }
          });
        });
      });

      let food_type = catalogueTags?.[0] || "temp";
      if (food_type === "non-veg") {
        food_type = "non_veg";
      }

      return {
        id: index,
        name,
        description,
        img: imageUrl,
        base_price,
        category: category_name,
        food_type,
        item_type: "Goods",
        sub_category,
        variants,
      };
    });

    console.log("Processed Zomato Products:", zomatoProduct);

    return res.status(200).json({
      data: zomatoProduct,
      message: "Menu data processed successfully.",
    });
  } catch (err) {
    console.error("Error during processing:", err.message);
    return res.status(500).json({
      error: `Error during processing: ${err.message}`,
    });
  }
});

export default scrape;
