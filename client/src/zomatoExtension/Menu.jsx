import React, { useState } from "react";
import axios from "axios";
import ProductTable from "./Table/ProductTable";
import { GridPattern } from "../components/ui/FileUpload";
import { useDispatch, useSelector } from "react-redux";
import { InputFieldPlaceholder } from "../components/ui/InputFieldPlaceholder";
import AutomationButton from "./AutomationButton";

const Menu = () => {
  const api = "http://localhost:2801";
  const dispatch = useDispatch();
  const { menuData, error, message, isLoading } = useSelector(
    (state) => state.menu
  );

  const [productData, setProductData] = useState(menuData);

  const [input, setInput] = useState("");

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const placeholder = [
    "Increase price by 20% ...!",
    "Re-generate the menu ...!",
  ];

  const handleMenuUpdate = async () => {
    try {
      const response = await axios.post(`${api}/api/gemini/update-menu`, {
        data: productData,
        input,
      });

      if (response.data.error) {
        console.error("Error updating menu", response.data.error);
      } else {
        setProductData(response?.data?.data);
        console.log("Menu updated successfully", response.data);
      }
    } catch (error) {
      console.error("Error updating menu", error);
    }
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
    </div>
  );
};

export default Menu;
