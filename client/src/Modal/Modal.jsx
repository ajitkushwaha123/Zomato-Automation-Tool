import React, { useState } from "react";
import { LuWifiOff } from "react-icons/lu";

const Modal = ({ isOpen = false, content, stillOpen }) => {
  const [open, setOpen] = useState(isOpen);

  return (
    <>
      {open ? (
        <div>
          <div
            id="popup-modal"
            tabIndex="-1"
            className="fixed inset-0 flex items-center justify-center overflow-y-auto shadow-lg shadow-indigo-500/40 backdrop-blur-sm bg-indigo-500/10"
          >
            <div className="relative p-4 w-full max-w-md max-h-full">
              <div className="relative bg-black rounded-lg shadow dark:bg-gray-700">
                <button
                  onClick={() => {
                    setOpen(false), stillOpen(false);
                  }}
                  type="button"
                  className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
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
                <div className="p-4 my-5 md:p-5 text-center">
                  {content}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Modal;
