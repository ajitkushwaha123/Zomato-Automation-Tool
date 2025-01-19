import React, { useState } from "react";
import { motion } from "framer-motion";
import { CloudUpload } from "lucide-react";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api`;

const AutomationButton = ({ data }) => {
  const [isLoading, setIsLoading] = useState(false);
  console.log("data", data);

  const openZomato = async ({
    name,
    description,
    category,
    sub_category,
    base_price,
    food_type,
    item_type,
  }) => {
    try {
      const response = await axios.post(`${API_URL}/zomato/data`, {
        data,
        browserEndPoint: "02476bc3-dfe6-430c-a2eb-c2f7bfd91959",
      });

      console.log(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFunction = async () => {
    try {
      // for (let i = 0; i < data?.length; i++) {
      //   console.log(data[i]);
      await openZomato(data);
      // }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <motion.button
        onClick={() => handleFunction()}
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
