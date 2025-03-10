import React from "react";
import Button from "../components/Button/Button";
import { useFormik } from "formik";
import toast, { Toaster } from "react-hot-toast";
import { useProjects } from "../hooks/useProjects";
import { useProducts } from "../hooks/useProducts";

const Feature = ({ projectId, stillOpen }) => {
  console.log("projectId", projectId);
  const { projects, handleAddProject, loading } = useProjects();
  const { handleDataScraping } = useProducts();

  const formik = useFormik({
    initialValues: {
      resIdFrom: "",
      resIdTo: "",
      projectId: projectId,
    },
    onSubmit: async (values) => {
      try {
        console.log("Submitting values:", values);
        values.projectId = projectId;
        await handleDataScraping(values);
        stillOpen(false);
      } catch (error) {
        toast.error("Failed to add project");
        console.error(error);
        stillOpen(false);
      }
    },
  });

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
          <div className="grid gap-4 mb-4 grid-cols-2">
            <div className="col-span-2">
              <label className="block mb-2 text-sm font-medium text-gray-300">
                Restaurant ID - From
              </label>
              <input
                type="text"
                name="resIdFrom"
                className="bg-[#2A2A2A] border border-gray-600 text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition duration-200"
                placeholder="resID for scraping products !"
                onChange={formik.handleChange}
                value={formik.values.resIdFrom}
                required
              />
            </div>

            <div className="col-span-2">
              <label className="block mb-2 text-sm font-medium text-gray-300">
                Restaurant ID - To
              </label>
              <input
                type="text"
                name="resIdTo"
                className="bg-[#2A2A2A] border border-gray-600 text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition duration-200"
                placeholder="resID for uploading products !"
                onChange={formik.handleChange}
                value={formik.values.resIdTo}
                required
              />
            </div>
          </div>
          <Button
            type="submit"
            title={loading ? "Loading..." : "Begin Scraping"}
            disabled={loading}
          />
        </form>
      </div>
    </div>
  );
};

export default Feature;
