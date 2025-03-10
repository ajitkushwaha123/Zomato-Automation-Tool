"use client";
import Sidebar from "../../Sidebar/Sidebar";
import React, { useState } from "react";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import AutomationButton from "../AutomationButton";
import { useProducts } from "../../hooks/useProducts";
import { useParams } from "react-router";

const Category = ({ selectCategory, finalItems }) => {
  const [openCategory, setOpenCategory] = useState(null);
  const { projectId } = useParams();

  const { menuData, deleteBySubCategory } = useProducts(projectId);

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

  const handleCategoryNameChange = (e , index) => {
    const value = e.target.value;
  }

  return (
    <div className="h-screen overflow-y-scroll chalja relative bg-gray-900 px-4 py-4 text-white">
      {sidebarMenu?.map((category, index) => (
        <div key={index} className="mb-2">
          {category.title != "All" ? (
            <button
              onClick={() => handleCategoryClick(category.title)}
              className="flex items-center justify-between bg-gray-800 hover:bg-gray-700 px-4 py-2 w-full rounded-lg font-semibold transition-all duration-300"
            >
              <input
                className="outline-none bg-transparent
               text-white"
                type="text"
                value={category.title}
                onChange={(e) => handleCategoryNameChange(e , index)}
              />
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
                    className="bg-gray-700 flex justify-between items-center
                     hover:bg-gray-600 px-3 py-2 w-full rounded-md font-medium transition-all duration-300 text-white"
                  >
                    <span
                      className="
                    min-w-0 truncate"
                    >
                      {subCategory}
                    </span>
                    <Trash2
                      onClick={() =>
                        deleteBySubCategory({
                          projectId: projectId,
                          subCategory: subCategory,
                        })
                      }
                      size={"18"}
                    />
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
