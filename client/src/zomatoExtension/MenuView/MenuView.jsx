"use client";
import React, { useState } from "react";
import Category from "./Category";
import ProductTable from "../Table/ProductTable";
import { useSelector } from "react-redux";
import ItemsTable from "../Table/ItemsTable";
import Toast from "../../Toast/Toast";

const MenuView = () => {
  const [finalItems, setFinalItems] = useState([]);
  const [category, setCategory] = useState({
    category: null,
    subCategory: null,
  });

  const selectedCategory = (val) => {
    console.log("Selected Category:", val);
    setCategory(val);
  };

  const { menuData, message, error } = useSelector((state) => state.menu);

  const filters = {
    category: category.category,
    sub_category: category.subCategory,
  };

  const handleItemsData = (val) => {
    console.log("Items Data:", val);
    setFinalItems(val);
  };

  return (
    <div className="flex bg-[#0F090C] bg-pattern1 justify-between items-start">
      <div className="w-[20%] h-screen overflow-hidden">
        <Category
          menuData={menuData}
          selectCategory={selectedCategory}
          finalItems={finalItems}
        />
      </div>
      <div className="chalaja h-screen overflow-y-scroll w-[80%] p-4 bg-pattern3 rounded-lg">
        {/* <ProductTable filters={filters} /> */}
        <ItemsTable
          filters={filters}
          filteredProducts={(val) => handleItemsData(val)}
        />
      </div>
    </div>
  );
};

export default MenuView;
