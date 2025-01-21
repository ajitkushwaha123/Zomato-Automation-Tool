import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UploadMenu } from "./UploadMenu";
import { CloudUpload } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import ProductTable from "../zomatoExtension/Table/ProductTable";
import AutomationButton from "./AutomationButton";
import { handleMenuUpload, updateMenuData } from "../redux/slices/productSlice";
import { JsonData } from "./JsonData";
import CodeEditor from "./CodeEditor";

// const data = [
//   {
//     name: "Hot Tea",
//     description: "A cup of hot tea",
//     category: "Beverages",
//     sub_category: "Tea",
//     base_price: 100,
//     item_type: "Goods",
//     variants: [{ property_name: "Size", values: ["Small"], prices : [100] }],
//     food_type: "veg",
//   },
//   {
//     name: "Cold Coffee",
//     description: "A cup of cold coffee",
//     category: "Beverages",
//     sub_category: "Coffee",
//     base_price: 120,
//     item_type: "Goods",
//     variants: [],
//     food_type: "veg",
//   },
//   {
//     name: "Hot Coffee",
//     description: "A cup of hot coffee",
//     category: "Beverages",
//     sub_category: "Coffee",
//     base_price: 120,
//     item_type: "Goods",
//     variants: [
//       {
//         property_name: "Size",
//         values: ["Small", "Medium", "Large"],
//         prices : [250, 300, 350],
//       },
//     ],
//     food_type: "veg",
//   },
// ];

const ZomatoExtensionPage = () => {
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);

  const handleFileChange = (file) => {
    console.log("file", file);
    setFile(file);
  };

  const handleFileUpload = async () => {
    if (file) {
      const formData = new FormData();
      formData.append("menu", file[0]);

      await dispatch(handleMenuUpload(formData))
        .unwrap()
        .then((response) => {
          console.log("File uploaded successfully", response);
        })
        .catch((error) => {
          console.error("File upload failed", error);
        });
    } else {
      alert("Please select a file to upload.");
    }
  };

  const { menuData, message, isLoading, error } = useSelector(
    (state) => state.menu
  );

  return (
    <div className="min-h-screen p-20 w-full flex flex-col bg-[#000] items-center justify-center">
      <UploadMenu onUpload={handleFileChange} />

      <motion.button
        onClick={handleFileUpload}
        whileTap={{ scale: 0.9 }}
        className={`inline-flex ${
          isLoading ? "animate-shimmer" : ""
        } mt-10 h-12 items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors duration-200 ease-in-out hover:bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] hover:text-slate-200`}
        disabled={isLoading}
      >
        <CloudUpload />
        <span className="ml-2">{isLoading ? "Loading..." : "Upload"}</span>
      </motion.button>

      {/* <JsonData /> */}
      <CodeEditor code={menuData}/>

      {/* <div>  </div> */}

      {message && <div className="mt-4 text-slate-200">{message}</div>}

      <div className="pt-20 pb-8 flex flex-col justify-center items-center w-full">
        <div className=" w-full">
          <ProductTable users={menuData} />
        </div>

        <AutomationButton data={menuData} />

        <Link to={`/menu`}>
          <motion.button
            whileTap={{ scale: 0.9 }}
            className={`inline-flex ${
              isLoading ? "animate-shimmer" : ""
            } mt-10 h-12 items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors duration-200 ease-in-out hover:bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] hover:text-slate-200`}
          >
            <CloudUpload />
            <span className="ml-2">
              {isLoading ? "Loading..." : "View Menu"}
            </span>
          </motion.button>
        </Link>
      </div>
    </div>
  );
};

export default ZomatoExtensionPage;
