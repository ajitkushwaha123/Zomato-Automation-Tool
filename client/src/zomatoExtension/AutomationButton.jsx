import React, { useState } from "react";
import { motion } from "framer-motion";
import { CloudUpload } from "lucide-react";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api`;

const AutomationButton = ({ data }) => {
  const [isLoading, setIsLoading] = useState(false);

  const openZomato = async (data) => {
    try {
      const response = await axios.post(`${API_URL}/zomato/data`, {
        data,
        category: data[0]?.category,
        sub_category: data[0]?.sub_category,
        browserEndPoint: "fba9dea5-b94d-435a-b9dd-950eeb2a5325",
      });

      console.log("Zomato Response:", response.data);
    } catch (err) {
      console.error("Zomato API Error:", err);
    }
  };

  const handleFunction = async (data) => {
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
        onClick={() => handleFunction(data)}
        whileTap={{ scale: 0.9 }}
        className={`inline-flex ${
          isLoading ? "animate-shimmer" : ""
        } mt-10 h-12 items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors duration-200 ease-in-out hover:bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] hover:text-slate-200`}
        disabled={isLoading}
      >
        <CloudUpload />
        <span className="ml-2">
          {isLoading ? "Loading..." : "Start Automation"}
        </span>
      </motion.button>
    </div>
  );
};

export default AutomationButton;
