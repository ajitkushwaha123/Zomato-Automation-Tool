import express from "express";
import puppeteer from "puppeteer";
import axios from "axios";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const zomatoRouter = express.Router();
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

zomatoRouter.post("/data", async (req, res) => {
  const { data } = req.body;
  let sub_category = req.body.sub_category;
  let category = req.body.category;
  console.log("Data received:", data);
  console.log("category", category);
  console.log("sub_category", sub_category);

  console.log("Data received:", data);
  try {
    // const browser = await puppeteer.connect({
    //   defaultViewport: null,
    //   headless: false,

    //   browserWSEndpoint: `ws://localhost:9222/devtools/browser/${browserEndPoint}`,
    // });

    const browser = await puppeteer.connect({
      browserURL: "http://localhost:9222",
      defaultViewport: null,
      headless: false, // Run in visible mode for debugging
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-gpu",
        "--disable-dev-shm-usage",
      ],
    });

    // const browser = await puppeteer.connect({
    //   browserURL: "http://127.0.0.1:9222",
    //   defaultViewport: null,
    //   headless: false, // Run in visible mode for debugging
    //   args: [
    //     "--no-sandbox",
    //     "--disable-setuid-sandbox",
    //     "--disable-gpu",
    //     "--disable-dev-shm-usage",
    //   ],
    // });

    const pages = await browser.pages();
    const page = pages[0];
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36"
    );
    await page.setExtraHTTPHeaders({
      "accept-language": "en-US,en;q=0.9",
      "sec-fetch-site": "same-origin",
      "sec-fetch-mode": "navigate",
      "sec-fetch-user": "?1",
      "sec-fetch-dest": "document",
    });

    await page.goto(
      "https://www.zomato.com/partners/onlineordering/menu/?resId=21885165",
      { waitUntil: "networkidle2" }
    );

    // await page.setViewport({ width: 1120, height: 698 });

    let first = 0;

    await delay(2000);

    await page.waitForSelector('[data-tut="GO_TO_MENU_EDITOR"]', {
      visible: true,
    });
    await page.click('[data-tut="GO_TO_MENU_EDITOR"]');
    await delay(2000);

    if (category && !sub_category) {
      sub_category = category;
    }

    if (category && sub_category) {
      await page.waitForSelector('[data-tut="ADD_CATEGORY"]', {
        visible: true,
      });

      await page.click('[data-tut="ADD_CATEGORY"]');
      await delay(2000);

      await page.waitForSelector('[name="categoryName"]', { visible: true });
      delay(1000);
      await page.type('[name="categoryName"]', category);

      await delay(3000);

      await page.evaluate(() => {
        const nextBtn = document.evaluate(
          '//button[contains(normalize-space(), "Next")]',
          document,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null
        ).singleNodeValue;

        console.log("Next button found:", nextBtn);

        if (nextBtn) {
          nextBtn.click();
        } else {
          throw new Error("Next button not found.");
        }
      });

      await delay(2000);

      await page.waitForSelector('[name="subCategoryName"]', { visible: true });
      delay(1000);
      await page.type('[name="subCategoryName"]', sub_category);

      await delay(2000);

      await page.evaluate(() => {
        const doneBtn = document.evaluate(
          '//button[contains(text(), "Done")]',
          document,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null
        ).singleNodeValue;

        if (doneBtn) {
          doneBtn.click();
        } else {
          throw new Error("Image button not found.");
        }
      });

      await delay(2000);
      
      first++;

      await page.evaluate(() => {
        const newItemBtn = document.evaluate(
          '//button[contains(text(), "Add new item")]',
          document,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null
        ).singleNodeValue;

        if (newItemBtn) {
          newItemBtn.click();
        } else {
          throw new Error("Image button not found.");
        }
      });

      await delay(2000);
    }

    for (const item of data) {
      const { name, description, base_price, variants, img } = item;
      let { food_type } = item;
      let itemCategory = item.category;
      let itemSubCategory = item.sub_category;

      if (itemCategory !== category) {
        category = itemCategory;
        sub_category = item.sub_category;
        await delay(2000);
        if (category && !sub_category) {
          sub_category = category;
        }

        await page.waitForSelector('[data-tut="ADD_CATEGORY"]', {
          visible: true,
        });

        await page.click('[data-tut="ADD_CATEGORY"]');
        await delay(2000);

        await page.waitForSelector('[name="categoryName"]', { visible: true });
        delay(1000);
        await page.type('[name="categoryName"]', category);

        await delay(2000);

        await page.evaluate(() => {
          const nextBtn = document.evaluate(
            '//button[contains(text(), "Next")]',
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
          ).singleNodeValue;

          if (nextBtn) {
            nextBtn.click();
          } else {
            throw new Error("Image button not found.");
          }
        });

        await delay(2000);

        await page.waitForSelector('[name="subCategoryName"]', {
          visible: true,
        });
        delay(1000);
        await page.type('[name="subCategoryName"]', sub_category);

        await delay(2000);

        await page.evaluate(() => {
          const doneBtn = document.evaluate(
            '//button[contains(text(), "Done")]',
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
          ).singleNodeValue;

          if (doneBtn) {
            doneBtn.click();
          } else {
            throw new Error("Image button not found.");
          }
        });

        await delay(2000);

        first++;

        await page.evaluate(() => {
          const newItemBtn = document.evaluate(
            '//button[contains(text(), "Add new item")]',
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
          ).singleNodeValue;

          if (newItemBtn) {
            newItemBtn.click();
          } else {
            throw new Error("Image button not found.");
          }
        });

        await delay(2000);
      }

      if (itemSubCategory !== sub_category) {
        await delay(2000);

        sub_category = itemSubCategory;

        await page.evaluate(() => {
          const addSubCatBtn = document.evaluate(
            '//button[contains(text(), "Add Subcategory")]',
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
          ).singleNodeValue;

          if (addSubCatBtn) {
            addSubCatBtn.click();
          } else {
            throw new Error("Image button not found.");
          }
        });

        await page.waitForSelector('[name="subCategoryName"]', {
          visible: true,
        });
        delay(1000);
        await page.type('[name="subCategoryName"]', itemSubCategory);

        await delay(2000);

        await page.evaluate(() => {
          const doneBtn = document.evaluate(
            '//button[contains(text(), "Done")]',
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
          ).singleNodeValue;

          if (doneBtn) {
            doneBtn.click();
          } else {
            throw new Error("Image button not found.");
          }
        });

        await delay(2000);

        first++;

        await page.evaluate(() => {
          const newItemBtn = document.evaluate(
            '//button[contains(text(), "Add new item")]',
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
          ).singleNodeValue;

          if (newItemBtn) {
            newItemBtn.click();
          } else {
            throw new Error("Image button not found.");
          }
        });

        await delay(2000);
      }

      if (food_type === "non_veg") {
        food_type = "non-veg";
      }

      try {
        if(first === 0){
          await page.waitForSelector('[data-tut="ADD_CATALOGUE"]', {
            visible: true,
          });
          await page.click('[data-tut="ADD_CATALOGUE"]');
          await delay(2000);
        }else{
          first--;
        }

        await page.waitForSelector("#item-name", { visible: true });
        await page.type("#item-name", name);
        await delay(1000);

        await page.waitForSelector("#item-description", { visible: true });
        await page.type("#item-description", description);
        await delay(1000);

        await page.waitForSelector("#item-price", { visible: true });
        await page.type("#item-price", base_price.toString());
        await delay(1000);

        if (["veg", "non-veg", "egg"].includes(food_type)) {
          await page.waitForSelector(`label[for="${food_type}"]`, {
            visible: true,
          });
          await page.click(`label[for="${food_type}"]`);
          console.log(`${food_type} selected.`);
        } else {
          throw new Error(`Invalid food type: "${food_type}"`);
        }

        const imageUrl = img || "";
        // const imageUrl = "";

        if (imageUrl) {
          await delay(3000);
          await page.evaluate(() => {
            const imageBtn = document.evaluate(
              '//div[contains(text(), "Upload")]',
              document,
              null,
              XPathResult.FIRST_ORDERED_NODE_TYPE,
              null
            ).singleNodeValue;

            if (imageBtn) {
              imageBtn.click();
            } else {
              throw new Error("Image button not found.");
            }
          });

          await delay(2000);

          await page.evaluate(() => {
            const imageBtn = document.evaluate(
              '//button[contains(text(), "Continue")]',
              document,
              null,
              XPathResult.FIRST_ORDERED_NODE_TYPE,
              null
            ).singleNodeValue;

            if (imageBtn) {
              imageBtn.click();
            } else {
              throw new Error("Image button not found.");
            }
          });

          await delay(2000);

          const fileInputSelector = "#image-input"; // Target by ID
          await page.waitForSelector(fileInputSelector);

          const imagesFolderPath = path.resolve(__dirname, "images");
          if (!fs.existsSync(imagesFolderPath)) {
            fs.mkdirSync(imagesFolderPath);
          }

          const localImagePath = path.resolve(
            imagesFolderPath,
            "downloaded-image.jpg"
          );
          const response = await axios({
            url: imageUrl,
            method: "GET",
            responseType: "stream",
          });
          const writer = fs.createWriteStream(localImagePath);
          response.data.pipe(writer);
          await new Promise((resolve, reject) => {
            writer.on("finish", resolve);
            writer.on("error", reject);
          });

          // const filePath = `C:/Users/Aakash/Desktop/Auth/server/uploads/image.png`;

          // Upload the file directly to the hidden input
          const fileInput = await page.$(fileInputSelector);
          console.log("fileInput", fileInput);
          await fileInput.uploadFile(localImagePath);

          await delay(4000);

          await page.evaluate(() => {
            const imageBtn = document.evaluate(
              '//button[contains(text(), "Map image")]',
              document,
              null,
              XPathResult.FIRST_ORDERED_NODE_TYPE,
              null
            ).singleNodeValue;

            if (imageBtn) {
              imageBtn.click();
            } else {
              throw new Error("Image button not found.");
            }
          });
        }

        await delay(3000);

        await page.evaluate(() => {
          const variantBtn = document.evaluate(
            '//button[.//div[contains(text(), "Variants")]]',
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
          ).singleNodeValue;

          if (variantBtn) {
            variantBtn.click();
          } else {
            throw new Error("Add variants button not found.");
          }
        });

        await delay(2000);

        await page.evaluate(() => {
          const addVariants = document.evaluate(
            '//button[.//div[contains(text(), "Create a new variant")]]',
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
          ).singleNodeValue;

          if (addVariants) {
            addVariants.click();
          } else {
            throw new Error("Add Variants button not found.");
          }
        });

        await delay(2000);

        for (let i = 0; i < variants?.length; i++) {
          const { property_name, values } = variants[i];
          const propertyValues = values;

          await page.evaluate(() => {
            const addProperty = document.evaluate(
              '//button[.//div[contains(text(), "Add new property")]]',
              document,
              null,
              XPathResult.FIRST_ORDERED_NODE_TYPE,
              null
            ).singleNodeValue;

            if (addProperty) {
              addProperty.click();
            } else {
              throw new Error("Add Property button not found.");
            }
          });

          await delay(2000);

          const variantNameInputSelector =
            'input[placeholder="Enter variant name E.g. Size, crust, "]';

          console.log("var", variantNameInputSelector);
          await page.waitForSelector(variantNameInputSelector, {
            visible: true,
          });
          await page.type(variantNameInputSelector, property_name);
          console.log("Variant name entered.");

          await delay(1000);

          await page.keyboard.press("Enter");

          await delay(2000);

          console.log(`Add new ${property_name}`);

          await page.evaluate((property_name) => {
            const addPropertyVariants = document.evaluate(
              `//button[.//div[contains(text(), 'Add new ${property_name}')]]`,
              document,
              null,
              XPathResult.FIRST_ORDERED_NODE_TYPE,
              null
            ).singleNodeValue;

            if (addPropertyVariants) {
              addPropertyVariants.click();
            } else {
              throw new Error("Add Property variants button not found.");
            }
          }, property_name);

          await delay(2000);
          for (let i = 0; i < propertyValues?.length; i++) {
            await page.waitForSelector(
              'input[placeholder="Enter your base variant, Eg: small"][autocomplete="off"]',
              { visible: true }
            );

            const inputElements = await page.$$(
              'input[placeholder="Enter your base variant, Eg: small"][autocomplete="off"]'
            );

            console.log("inputElements", inputElements);

            if (!inputElements[i]) {
              throw new Error(`Input element for iteration ${i} not found.`);
            }

            await inputElements[i].type(propertyValues[i].title);

            await delay(2000);

            if (i < propertyValues.length - 1) {
              await page.evaluate((property_name) => {
                const addPropertyVariants = document.evaluate(
                  `//button[.//div[contains(text(), 'Add new ${property_name}')]]`,
                  document,
                  null,
                  XPathResult.FIRST_ORDERED_NODE_TYPE,
                  null
                ).singleNodeValue;

                if (addPropertyVariants) {
                  addPropertyVariants.click();
                } else {
                  throw new Error("Add Property Variants button not found.");
                }
              }, property_name);
            } else {
              await page.evaluate(() => {
                const enterPrice = document.evaluate(
                  '//button[contains(text(), "Enter prices and review")]',
                  document,
                  null,
                  XPathResult.FIRST_ORDERED_NODE_TYPE,
                  null
                ).singleNodeValue;

                if (enterPrice) {
                  enterPrice.click();
                } else {
                  throw new Error("Enter Price button not found.");
                }
              });
            }
          }

          await delay(2000);

          await page.waitForSelector(
            'input[variantpriceid="variantPriceInputField"]',
            {
              visible: true,
            }
          );

          const inputElements = await page.$$(
            'input[variantpriceid="variantPriceInputField"]'
          );

          console.log("inputElements", inputElements);

          for (let i = 0; i < inputElements.length; i++) {
            if (!inputElements[i]) {
              throw new Error(`Input element for iteration ${i} not found.`);
            }

            await delay(1000);
            console.log("prices", propertyValues[i].price);
            await inputElements[i].type(propertyValues[i].price.toString());
          }

          await delay(1000);
        }

        await delay(2000);

        await page.evaluate(() => {
          const enterPrice = document.evaluate(
            '//button[contains(text(), "Save")]',
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
          ).singleNodeValue;

          if (enterPrice) {
            enterPrice.click();
          } else {
            throw new Error("Save variants button not found.");
          }
        });

        await delay(2000);

        await page.evaluate(() => {
          const saveButton = document.evaluate(
            '//button[contains(text(), "Save Changes")]',
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
          ).singleNodeValue;

          if (saveButton) {
            saveButton.click();
          } else {
            throw new Error("Save Changes button not found.");
          }
        });

        console.log(`Item "${name}" added successfully.`);
      } catch (err) {
        console.error(`Error adding item "${name}": ${err.message}`);
      }
    }

    // return res.status(200).send("Data received and processed successfully!");
    await page.waitForSelector('[data-tut="SUBMIT_CHANGES"]', {
      visible: true,
    });
    await page.click('[data-tut="SUBMIT_CHANGES"]');

    await delay(2000);

    await page.evaluate(() => {
      const confirmButton = document.evaluate(
        '//button[contains(text(), "Yes, I confirm")]',
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      ).singleNodeValue;

      if (confirmButton) {
        confirmButton.click();
      } else {
        throw new Error('"Yes, I confirm" button not found.');
      }
    });

    res.status(200).send("Data received and processed successfully!");
  } catch (err) {
    console.error("Error during automation:", err);
    res.status(500).send(`Error during automation: ${err.message}`);
  }
});

export default zomatoRouter;



