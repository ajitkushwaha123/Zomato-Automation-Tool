"use client";
import React, { useState } from "react";
import Category from "./Category";
import ProductTable from "../Table/ProductTable";
import { useSelector } from "react-redux";

const MenuView = () => {
  // Initialize category state properly
  const [category, setCategory] = useState({
    category: null,
    subCategory: null,
  });

  const selectedCategory = (val) => {
    console.log("Selected Category:", val);
    setCategory(val);
  };

  const { menuData } = useSelector((state) => state.menu);

  // Apply filters dynamically
  const filters = {
    category: category.category,
    sub_category: category.subCategory,
  };

 

  return (
    <div className="p-4 flex bg-black bg-pattern1 justify-between items-start">
      <div className="h-screen w-[20%] overflow-y-auto">
        <p className="text-white">
          Selected: {category.category}{" "}
          {category.subCategory ? `> ${category.subCategory}` : ""}
        </p>
        <Category menuData={menuData} selectCategory={selectedCategory} />
      </div>
      <div className="chalaja m-4 w-[80%] p-4 bg-pattern3 rounded-lg">
        <ProductTable
          filters={filters}
        />
      </div>
    </div>
  );
};

export default MenuView;
