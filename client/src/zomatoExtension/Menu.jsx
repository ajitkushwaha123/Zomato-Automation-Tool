import React, { useState } from "react";
import axios from "axios";
import ProductTable from "./Table/ProductTable";
import { GridPattern } from "../components/ui/FileUpload";
import { useDispatch, useSelector } from "react-redux";
import { InputFieldPlaceholder } from "../components/ui/InputFieldPlaceholder";
import AutomationButton from "./AutomationButton";
import { handleMenuAIUpdate } from "../redux/slices/productSlice";
import { Link } from "react-router-dom";
import { CloudUpload } from "lucide-react";
import { motion } from "framer-motion";

const API_URL = `${import.meta.env.VITE_API_URL}/api`;

const Menu = () => {
  const dispatch = useDispatch();
  const { menuData, error, message, isLoading } = useSelector(
    (state) => state.menu
  );

  const [productData, setProductData] = useState(menuData);
  console.log("productData", productData);

  const [input, setInput] = useState("");

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const placeholder = [
    "Increase price by 20% ...!",
    "Re-generate the menu ...!",
  ];

  const handleMenuUpdate = async () => {
    await dispatch(handleMenuAIUpdate({ productData, input }));
  };

  return (
    <div className="flex flex-col  bg-bg1 justify-center w-full bg-[#000] min-h-screen">
      {/* <div className="inset-0 h-[100%] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]">
        <GridPattern />
      </div> */}

      <div className="my-10">
        <InputFieldPlaceholder
          onChange={handleInputChange}
          placeholders={placeholder}
          onSubmit={handleMenuUpdate}
        />
      </div>

      <div className="bg-[#0d0d0d] w-[100%] flex justify-center bg-bg1 px-5 pt-8 rounded-lg shadow-lg">
        <ProductTable users={productData} className="bg-bg2 w-[90%]" />
      </div>

      <div className="w-full flex justify-center mb-10 items-center">
        <AutomationButton data={productData} />
      </div>

      <div className="flex justify-center items-center w-full mb-10">
        <Link to={`/products`}>
          <motion.button
            whileTap={{ scale: 0.9 }}
            className={`inline-flex 
           mt-10 h-12 items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors duration-200 ease-in-out hover:bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] hover:text-slate-200`}
          >
            <CloudUpload />
            <span className="ml-2">View Detailed Menu</span>
          </motion.button>
        </Link>
      </div>
    </div>
  );
};

export default Menu;
