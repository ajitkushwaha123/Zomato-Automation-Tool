import React from "react";
import Button from "../components/Button/Button";
import { useFormik } from "formik";
import toast, { Toaster } from "react-hot-toast";
import { useProjects } from "../hooks/useProjects";

const AddProject = () => {
  const { projects, handleAddProject, loading } = useProjects();

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      file: null,
    },
    onSubmit: async (values) => {
      try {
        console.log("Submitting values:", values);
        await handleAddProject(values);
      } catch (error) {
        toast.error("Failed to add project");
        console.error(error);
      }
    },
  });

  return (
    <div className="flex justify-center items-center">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="relative bg-[#1E1E1E] rounded-lg shadow-lg border border-gray-700 w-full max-w-lg">
        <div className="flex items-center justify-between p-5 border-b border-gray-700 rounded-t">
          <h3 className="text-lg text-center font-semibold text-white">
            Create New Project
          </h3>
        </div>

        <form className="p-5" onSubmit={formik.handleSubmit}>
          <div className="grid gap-4 mb-4 grid-cols-2">
            <div className="col-span-2">
              <label className="block mb-2 text-sm font-medium text-gray-300">
                Project Name
              </label>
              <input
                type="text"
                name="name"
                className="bg-[#2A2A2A] border border-gray-600 text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition duration-200"
                placeholder="Type project name"
                onChange={formik.handleChange}
                value={formik.values.name}
                required
              />
            </div>

            <div className="col-span-2">
              <label className="block mb-2 text-sm font-medium text-gray-300">
                Description
              </label>
              <textarea
                rows="4"
                name="description"
                className="block p-2.5 w-full text-sm text-gray-300 bg-[#2A2A2A] border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                placeholder="Write project description here"
                onChange={formik.handleChange}
                value={formik.values.description}
              ></textarea>
            </div>
          </div>

          <div className="col-span-2 pb-5">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Upload File
            </label>
            <input
              type="file"
              name="file"
              className="w-full text-sm text-gray-300 bg-[#1E1E1E] border border-gray-600 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 file:bg-gray-700 file:border-0 file:px-4 file:py-2 file:rounded-lg file:text-gray-300 hover:file:bg-gray-600 transition"
              onChange={(event) => {
                formik.setFieldValue("file", event.currentTarget.files[0]);
              }}
            />
          </div>

          <Button
            type="submit"
            title={loading ? "Loading..." : "Add Project"}
            disabled={loading}
          />
        </form>
      </div>
    </div>
  );
};

export default AddProject;
