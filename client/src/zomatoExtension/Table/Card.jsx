"use client";

import { motion } from "framer-motion";

const Card = ({ image, index }) => {
  return (
    <motion.figure
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="relative rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900 p-3 shadow-sm hover:shadow-lg transition-all flex flex-col gap-3"
    >
      <div className="relative">
        <img
          loading="lazy"
          width="400"
          height="300"
          src={image.image_url}
          alt={
            image.title
              ? `${image.title} - High Quality Zomato & Swiggy Approved Food Image by Foodsnap`
              : "Premium food image for restaurant menus - Zomato & Swiggy approved"
          }
          className="w-full h-56 sm:h-64 object-cover rounded-lg border border-zinc-200 dark:border-white/10"
        />
      </div>

      {image.title && (
        <figcaption className="text-sm text-gray-600 dark:text-gray-300 mt-1">
          {image.title}
        </figcaption>
      )}
    </motion.figure>
  );
};

export default Card;
