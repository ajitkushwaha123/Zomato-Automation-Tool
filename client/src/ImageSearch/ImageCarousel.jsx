import React, { useState } from "react";
import { motion } from "framer-motion";

const ImageCarousel = ({ selectedImage, images = [] }) => {
  const [selectedMenu, setSelectedMenu] = useState("");
  const handleCheckboxChange = (url) => {
    setSelectedMenu(url);
    console.log("selectedMenu", selectedMenu);
    selectedImage(url);
  };

  return (
    <div className="p-4 flex mb-5 rounded-md justify-between items-center">
      <ul className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {images.map((img, index) => (
          <motion.li
            key={index}
            className="relative"
            whileTap={{ scale: 0.98 }}
          >
            <input
              type="checkbox"
              id={`img-option-${index}`}
              className="hidden peer"
              onChange={() => handleCheckboxChange(img.url)}
            />
            <label
              htmlFor={`img-option-${index}`}
              className={`flex flex-col items-center justify-between w-full p-4 bg-white border-2 border-gray-200 rounded-lg cursor-pointer shadow-md ${
                selectedMenu.includes(img.url)
                  ? "border-blue-600 bg-blue-50"
                  : "hover:border-gray-400"
              }`}
            >
              <div className="w-full h-[150px] overflow-hidden rounded-t-lg">
                <img
                  className="w-full h-full object-cover"
                  src={img.url}
                  alt={`Menu ${index + 1}`}
                />
              </div>
              <div className="flex items-center justify-between w-full px-2 mt-3">
                <h1 className="truncate text-gray-700 font-medium">
                  {img.title}
                </h1>
              </div>
            </label>
          </motion.li>
        ))}
      </ul>
    </div>
  );
};

export default ImageCarousel;
