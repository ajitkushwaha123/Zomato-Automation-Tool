import React, { useState } from "react";
import { LuWifiOff } from "react-icons/lu";
import ImageCarousel from "./ImageCarousel";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../redux/slices/modalSlice";
import { updateMenuDataById } from "../redux/slices/productSlice";

const ImageModal = ({ open = true }) => {
  const [selectedProductImg, setSelectedProductImg] = useState("");
  const { isOpen, id, title, images, isLoading, searchStatus, error } =
    useSelector((state) => state.searchModal);
  const dispatch = useDispatch();

  const handleModalClose = () => {
    dispatch(closeModal());
  };

  const handleSelectedImage = (val) => {
    setSelectedProductImg(val);
  };

  const applySelectedImage = () => {
    dispatch(updateMenuDataById({ id: id, url: selectedProductImg }));
    dispatch(closeModal());
  };

  return (
    <>
      {open && (
        <div className="absolute inset-0  flex items-center justify-center z-50">
          <div className="fixed inset-0 backdrop-blur-lg bg-gray-900/70"></div>

          <div className="relative p-6 w-full max-w-5xl bg-gray-800 shadow-xl rounded-2xl">
            {/* Close Button */}
            <button
              onClick={handleModalClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
            >
              <svg
                className="w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Modal Content */}
            <div className="text-center">
              {isLoading ? (
                <div className="text-gray-300 py-6">Loading... 🚀</div>
              ) : (
                <>
                  <h2 className="text-lg font-semibold text-gray-200 mb-4">
                    Select an Image
                  </h2>

                  <ImageCarousel
                    autoplay
                    pauseOnHover
                    images={images || []}
                    selectedImage={handleSelectedImage}
                  />

                  <div className="mt-6 flex justify-center space-x-3">
                    <button
                      onClick={applySelectedImage}
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
                    >
                      Apply
                    </button>
                    <button
                      onClick={handleModalClose}
                      className="px-5 py-2.5 bg-gray-700 hover:bg-gray-600 text-gray-300 border border-gray-500 rounded-lg transition"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageModal;
