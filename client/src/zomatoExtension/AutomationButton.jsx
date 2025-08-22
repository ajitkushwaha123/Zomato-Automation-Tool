import React, { useState } from "react";
import { motion } from "framer-motion";
import { CloudUpload } from "lucide-react";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api`;

const AutomationButton = ({ title, data, platform }) => {
  const [isLoading, setIsLoading] = useState(false);
  console.log("Data:", data);

  const openZomato = async (data) => {
    console.log("Data:", data);
    try {
      const response = await axios.post(`${API_URL}/zomato-verify/data`, {
        data,
        category: data[0]?.category,
        sub_category: data[0]?.sub_category,
      });

      //  const response = await axios.post(`${API_URL}/swiggy/data`, {
      //    data,
      //    category: data[0]?.category,
      //    sub_category: data[0]?.sub_category,
      //  });

      console.log("Zomato Response:", response.data);
    } catch (err) {
      console.error("Zomato API Error:", err);
    }
  };

  const groupByCategory = (data) => {
    return data.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {});
  };

  const openSwiggy = async (categoryData) => {
    try {
      const response = await axios.post(`${API_URL}/swiggy/data`, {
        data: categoryData,
        category: categoryData[0]?.category,
        sub_category: categoryData[0]?.sub_category,
      });
      console.log("Swiggy Response:", response.data);
    } catch (err) {
      console.error("Swiggy API Error:", err);
    }
  };

  const handleFunction = async (data) => {
    if (!data || data.length === 0) {
      console.error("No data provided!");
      return;
    }
    setIsLoading(true);
    try {
      const groupedData = groupByCategory(data);
      for (const category in groupedData) {
        await openSwiggy(groupedData[category]);
      }
    } catch (err) {
      console.error("Automation Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleZomatoFunction = async (data) => {
    if (!data || data.length === 0) {
      console.error("No data provided!");
      return;
    }

    setIsLoading(true);
    try {
      await openZomato(data);
    } catch (err) {
      console.error("Automation Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <motion.button
        onClick={
          platform === "swiggy"
            ? () => handleFunction(data)
            : () => handleZomatoFunction(data)
        }
        whileTap={{ scale: 0.9 }}
        className="flex items-center gap-2 whitespace-nowrap"
        disabled={isLoading}
      >
        <CloudUpload />
        <span>{isLoading ? "Loading..." : title}</span>
      </motion.button>
    </div>
  );
};

export default AutomationButton;
