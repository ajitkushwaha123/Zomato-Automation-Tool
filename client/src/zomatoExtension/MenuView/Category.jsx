import React from "react";

const Category = ({ menuData, selectCategory }) => {
  // Function to handle category selection
  const handleSelectedCategory = (category) => {
    selectCategory({ category, subCategory: null }); // Store category with no subcategory
  };

  // Function to handle subcategory selection
  const handleSelectedSubCategory = (category, subCategory) => {
    selectCategory({ category, subCategory }); // Store both category & subcategory
  };

  // Using a Map to ensure unique categories and subcategories
  const categoryMap = new Map();

  (menuData || []).forEach((product) => {
    if (!categoryMap.has(product.category)) {
      categoryMap.set(product.category, new Set());
    }

    // Convert sub_category from string to array (assuming comma-separated values)
    const subCategories = product.sub_category
      ? product.sub_category.split(",").map((sub) => sub.trim()) // Convert to array and trim spaces
      : [];

    subCategories.forEach((sub) => {
      categoryMap.get(product.category).add(sub);
    });
  });

  return (
    <div>
      {/* Rendering unique categories */}
      {[...categoryMap.keys()].map((category, index) => (
        <div key={index}>
          <button
            onClick={() => handleSelectedCategory(category)}
            className="bg-blue-600 py-2 font-semibold my-1 rounded-lg w-full text-white"
          >
            {category}
          </button>

          {/* Rendering unique subcategories under each category */}
          <div className="pl-4">
            {[...categoryMap.get(category)].map((subCategory, subIndex) => (
              <button
                key={subIndex}
                onClick={() => handleSelectedSubCategory(category, subCategory)}
                className="bg-blue-400 py-1 font-medium my-1 rounded-lg w-full text-white"
              >
                {subCategory}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Category;
