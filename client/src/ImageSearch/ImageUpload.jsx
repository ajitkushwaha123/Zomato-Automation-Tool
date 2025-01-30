import React, { useState } from "react";
import { UploadMenu } from "../zomatoExtension/UploadMenu";
import { CloudUpload } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import ImageCarousel from "./ImageCarousel";

const ImageUpload = () => {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const handleFileChange = (file) => {
    console.log("file", file);
    setFile(file);
  };

  const handleFileUpload = async () => {
    if (file) {
      console.log("file", file);
    } else {
      alert("Please select a file to upload.");
    }

    try {
      const formData = new FormData();
      formData.append("menu", file[0]);
      console.log("formData", formData);

      const response = await axios.post(
        "http://localhost:2801/api/image/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("File uploaded successfully", response);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const images = [
    "https://res.cloudinary.com/dgq1vz3n5/image/upload/v1633093093/uploads/2021-10-01T17:51:33.000Z-menu.jpg",
    "https://res.cloudinary.com/dgq1vz3n5/image/upload/v1633093093/uploads/2021-10-01T17:51:33.000Z-menu.jpg",
  ];

  return (
    <div className="min-h-screen p-20 w-full flex flex-col bg-[#000] items-center justify-center">
      <UploadMenu onUpload={handleFileChange} />

      <motion.button
        onClick={handleFileUpload}
        whileTap={{ scale: 0.9 }}
        className={`inline-flex ${
          isLoading ? "animate-shimmer" : ""
        } mt-10 h-12 items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors duration-200 ease-in-out hover:bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] hover:text-slate-200`}
        disabled={isLoading}
      >
        <CloudUpload />
        <span className="ml-2">{isLoading ? "Loading..." : "Upload"}</span>
      </motion.button>
    </div>
  );
};

export default ImageUpload;
