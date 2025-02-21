"use client";
import Sidebar from "../../Sidebar/Sidebar";
import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import AutomationButton from "../AutomationButton";

const Category = ({ menuData, selectCategory , finalItems }) => {
  const [openCategory, setOpenCategory] = useState(null);

  const handleCategoryClick = (category) => {
    setOpenCategory(openCategory === category ? null : category);
    selectCategory({ category, subCategory: null });
  };

  const handleSubCategoryClick = (category, subCategory) => {
    selectCategory({ category, subCategory });
  };

  const categoryMap = new Map();
  categoryMap.set("All", new Set());

  (menuData || []).forEach((product) => {
    if (!categoryMap.has(product.category)) {
      categoryMap.set(product.category, new Set());
    }

    const subCategories = product.sub_category
      ? product.sub_category.split(",").map((sub) => sub.trim())
      : [];

    subCategories.forEach((sub) => {
      categoryMap.get(product.category).add(sub);
    });
  });

  const sidebarMenu = Array.from(categoryMap, ([title, subitems]) => ({
    title,
    subitems: [...subitems],
  }));

  return (
    <div className="h-screen overflow-y-scroll chalja relative bg-gray-900 px-4 py-4 text-white">
      {sidebarMenu?.map((category, index) => (
        <div key={index} className="mb-2">
          {category.title != "All" ? (
            <button
              onClick={() => handleCategoryClick(category.title)}
              className="flex items-center justify-between bg-gray-800 hover:bg-gray-700 px-4 py-2 w-full rounded-lg font-semibold transition-all duration-300"
            >
              {category.title}
              {openCategory === category.title ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}
            </button>
          ) : (
            <button
              onClick={() => handleCategoryClick("All")}
              className="flex items-center justify-between bg-gray-800 hover:bg-gray-700 px-4 py-2 w-full rounded-lg font-semibold transition-all duration-300"
            >
              All
              {openCategory === category.title ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}
            </button>
          )}

          {openCategory === category.title && (
            <div className="pl-4 mt-2 space-y-1">
              {category.subitems.length > 0 ? (
                category.subitems.map((subCategory, subIndex) => (
                  <button
                    key={subIndex}
                    onClick={() =>
                      handleSubCategoryClick(category.title, subCategory)
                    }
                    className="bg-gray-700 hover:bg-gray-600 px-3 py-2 w-full rounded-md font-medium transition-all duration-300 text-white"
                  >
                    {subCategory}
                  </button>
                ))
              ) : (
                <p className="text-gray-400 text-sm px-3">No subcategories</p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Category;
