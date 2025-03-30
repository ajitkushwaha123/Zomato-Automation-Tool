import React, { useState } from "react";
import Button from "../components/Button/Button";
import { useFormik } from "formik";
import toast, { Toaster } from "react-hot-toast";
import { useProducts } from "../hooks/useProducts";
import { CloudUpload, PlaneTakeoff } from "lucide-react";
import { handleMenuUpload } from "../redux/slices/productSlice";
import { useDispatch, useSelector } from "react-redux";

const Feature = ({ projectId, stillOpen }) => {
  const { handleDataScraping, loading } = useProducts();
  const [type, setType] = useState("transfer");
  const dispatch = useDispatch();

  const { isLoading } = useSelector((state) => state.menu);

  const handleFileUpload = async (file) => {
    if (!file) return alert("Please select a file to upload.");

    const formData = new FormData();
    formData.append("menu", file);
    formData.append("projectId", projectId);
    await dispatch(handleMenuUpload(formData))
      .unwrap()
      .then((response) => {
        console.log("response", response);
      })
      .catch((error) => console.error("File upload failed", error));
  };

  const formik = useFormik({
    initialValues: {
      resIdFrom: "",
      resIdTo: "",
      projectId: projectId,
      file: null,
    },
    onSubmit: async (values) => {
      try {
        console.log("Submitting values:", values);
        values.projectId = projectId;
        if (type === "transfer") {
          handleDataScraping(values);
        } else {
          await handleFileUpload(values.file);
        }
        stillOpen(false);
      } catch (error) {
        toast.error("Failed to add project");
        console.error(error);
        stillOpen(false);
      }
    },
  });

  const handleTypeChange = (e, value) => {
    e.preventDefault();
    setType(value);
  };

  return (
    <div className="flex justify-center items-center">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="relative bg-[#1E1E1E] rounded-lg shadow-lg border border-gray-700 w-full max-w-lg">
        <div className="flex items-center justify-between p-5 border-b border-gray-700 rounded-t">
          <h3 className="text-lg text-center font-semibold text-white">
            Scrape Products
          </h3>
        </div>

        <form className="p-5" onSubmit={formik.handleSubmit}>
          {/* Category Selection */}
          <div className="col-span-2 mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-300">
              Select Type
            </label>
            <div className="flex space-x-4">
              <button
                onClick={(e) => handleTypeChange(e, "transfer")}
                className={`px-4 py-2 flex justify-center items-center w-[50%] text-sm font-medium rounded-lg transition duration-200 ${
                  type === "transfer"
                    ? "border-blue-500 ring-2 ring-blue-500 text-white bg-gray-700"
                    : "text-gray-300 bg-gray-800 border border-gray-600 hover:bg-gray-700"
                }`}
              >
                <PlaneTakeoff />
                <span className="ml-3">Transfer</span>
              </button>
              <button
                onClick={(e) => handleTypeChange(e, "upload")}
                className={`px-4 py-2 flex justify-center items-center w-[50%] text-sm font-medium rounded-lg transition duration-200 ${
                  type === "upload"
                    ? "border-blue-500 ring-2 ring-blue-500 text-white bg-gray-700"
                    : "text-gray-300 bg-gray-800 border border-gray-600 hover:bg-gray-700"
                }`}
              >
                <CloudUpload />
                <span className="ml-3">Upload</span>
              </button>
            </div>
          </div>

          {/* Form Inputs */}
          <div className="grid gap-4 mb-4 grid-cols-2">
            {type === "transfer" && (
              <div className="col-span-2">
                <label className="block mb-2 text-sm font-medium text-gray-300">
                  Restaurant ID - From
                </label>
                <input
                  type="text"
                  name="resIdFrom"
                  className="bg-[#2A2A2A] border border-gray-600 text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition duration-200"
                  placeholder="resID for scraping products!"
                  onChange={formik.handleChange}
                  value={formik.values.resIdFrom}
                />
              </div>
            )}

            <div className="col-span-2">
              <label className="block mb-2 text-sm font-medium text-gray-300">
                Restaurant ID - To
              </label>
              <input
                type="text"
                name="resIdTo"
                className="bg-[#2A2A2A] border border-gray-600 text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition duration-200"
                placeholder="resID for uploading products!"
                onChange={formik.handleChange}
                value={formik.values.resIdTo}
              />
            </div>

            {type === "upload" && (
              <div className="col-span-2 pb-5">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Upload File
                </label>
                <input
                  onChange={(event) => {
                    const file = event.currentTarget.files[0];
                    if (file) {
                      formik.setFieldValue("file", file);
                    }
                  }}
                  type="file"
                  name="file"
                  accept="image/*"
                  className="w-full text-sm text-gray-300 bg-[#1E1E1E] border border-gray-600 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 file:bg-gray-700 file:border-0 file:px-4 file:py-2 file:rounded-lg file:text-gray-300 hover:file:bg-gray-600 transition"
                />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            title={isLoading ? "Loading..." : "Begin Scraping"}
            disabled={isLoading}
          />
        </form>
      </div>
    </div>
  );
};

export default Feature;
