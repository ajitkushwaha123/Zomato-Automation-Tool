import React, { useState } from "react";
import { LuWifiOff } from "react-icons/lu";
import ImageCarousel from "./ImageCarousel";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../redux/slices/modalSlice";
import { updateMenuDataById } from "../redux/slices/productSlice";

const ImageModal = ({ open = false }) => {
  const [selectedProductImg, setSelectedProductImg] = useState("");
  const { isOpen, id, title, images, isLoading, searchStatus, error } =
    useSelector((state) => state.searchModal);
  const dispatch = useDispatch();
  const handleModalClose = (e) => {
    dispatch(closeModal());
  };

  console.log("ima", images);

  const handleSelectedImage = (val) => {
    console.log("selected image", val);
    setSelectedProductImg(val);
  };

  const applySelectedImage = (e) => {
    console.log("selectedProductImg", selectedProductImg);
    console.log("id", id);
    dispatch(updateMenuDataById({ id: id, url: selectedProductImg }));
    dispatch(closeModal());
  };

  return (
    <>
      {open ? (
        <div>
          <div
            id="popup-modal"
            tabIndex="-1"
            className="fixed inset-0 flex items-center justify-center overflow-y-auto shadow-lg shadow-indigo-500/40 backdrop-blur-sm bg-indigo-500/10"
          >
            <div className="relative p-4 w-full max-w-7xl max-h-full">
              <div className="relative rounded-lg shadow bg-gray-700">
                <button
                  onClick={(e) => handleModalClose(e)}
                  type="button"
                  className="absolute top-3 end-2.5 text-gray-400 bg-transparent  rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center hover:bg-gray-600 hover:text-white"
                  data-modal-hide="popup-modal"
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>

                {!isLoading ? (
                  <div className="p-4 md:p-5 text-center">
                    <ImageCarousel
                      autoplay={true}
                      pauseOnHover={true}
                      images={images || []}
                      selectedImage={(val) => handleSelectedImage(val)}
                    />

                    <div className="flex mt-4 items-center justify-center">
                      <button
                        data-modal-hide="popup-modal"
                        type="button"
                        className="text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
                        onClick={(e) => applySelectedImage(e)}
                      >
                        Apply
                      </button>
                      <button
                        onClick={(e) => handleModalClose(e)}
                        data-modal-hide="popup-modal"
                        type="button"
                        className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-100 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                      >
                        No, cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-white"> Loading... ! </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default ImageModal;
