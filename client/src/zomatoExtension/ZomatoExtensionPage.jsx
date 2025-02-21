import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UploadMenu } from "./UploadMenu";
import { CloudUpload } from "lucide-react";
import { motion } from "framer-motion";
import {
  handleMenuUpload,
  handleScrapeData,
} from "../redux/slices/productSlice";
import { useSearchParams } from "react-router-dom";
import { loadingGif } from "../assets";
import { useNavigate } from "react-router-dom";
import Modal from "../Modal/Modal";

const ZomatoExtensionPage = () => {
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);

  const handleFileChange = (file) => setFile(file);
  const navigate = useNavigate();

  const handleFileUpload = async () => {
    if (!file) return alert("Please select a file to upload.");

    const formData = new FormData();
    formData.append("menu", file[0]);
    await dispatch(handleMenuUpload(formData))
      .unwrap()
      .then((response) => {
        console.log("response", response);
        navigate("/products");
      })
      .catch((error) => console.error("File upload failed", error));
  };

  const { menuData, message, isLoading, error } = useSelector(
    (state) => state.menu
  );

  return (
    <div>
      {isLoading ? (
        <div className="w-full h-screen bg-[#121212] flex items-center justify-center">
          <img src={loadingGif} alt="Loading..." className="" />
        </div>
      ) : (
        <div className="min-h-screen bg-[#000] flex items-center justify-center p-10">
          <div className="w-full max-w-2xl p-6 bg-[#000] rounded-xl shadow-md text-white flex flex-col items-center">
            <div className="w-full flex flex-col items-center">
              <UploadMenu onUpload={handleFileChange} />
              <motion.button
                onClick={handleFileUpload}
                whileTap={{ scale: 0.95 }}
                className="mt-6 px-6 py-3 rounded-lg border border-slate-800 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-slate-300 hover:text-white transition-all duration-200 flex items-center gap-2"
              >
                <CloudUpload /> Upload
              </motion.button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ZomatoExtensionPage;
