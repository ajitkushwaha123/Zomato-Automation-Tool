import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import Button from "../components/Button/Button";
import { updateMenuData } from "../redux/slices/productSlice";
import { useDispatch } from "react-redux";

const ImageUpload = ({ productId, projectId, stillOpen }) => {
  const dispatch = useDispatch();
  const [uploading, setUploading] = useState(false);

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "AI TOOL");

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${
          import.meta.env.VITE_API_CLOUDINARY_CLOUD_NAME
        }/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Upload error:", error);
      return null;
    }
  };

  const formik = useFormik({
    initialValues: {
      file: null,
      img: "",
    },
    onSubmit: async (values) => {
      if (!values.file) {
        toast.error("Please select an image!");
        return;
      }

      setUploading(true);
      const imageUrl = await uploadToCloudinary(values.file);
      setUploading(false);

      if (imageUrl) {
        console.log("Uploaded Image URL:", imageUrl);

        dispatch(
          updateMenuData({ id: productId, field: "img", value: imageUrl })
        );

        toast.success("Image uploaded successfully!");
        stillOpen(false);
      } else {
        toast.error("Image upload failed!");
      }
    },
  });

  return (
    <div className="flex justify-center items-center">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="relative bg-[#1E1E1E] rounded-lg shadow-lg border border-gray-700 w-full max-w-lg">
        <div className="flex items-center justify-between p-5 border-b border-gray-700 rounded-t">
          <h3 className="text-lg text-center font-semibold text-white">
            Upload Image
          </h3>
        </div>

        {formik.values.img && (
          <img
            src={formik.values.img}
            alt="Preview"
            className="w-full h-auto"
          />
        )}

        <form className="p-5" onSubmit={formik.handleSubmit}>
          <div className="col-span-2 pb-5">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Upload File
            </label>
            <input
              type="file"
              name="file"
              accept="image/*"
              className="w-full text-sm text-gray-300 bg-[#1E1E1E] border border-gray-600 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 file:bg-gray-700 file:border-0 file:px-4 file:py-2 file:rounded-lg file:text-gray-300 hover:file:bg-gray-600 transition"
              onChange={(event) => {
                const file = event.currentTarget.files[0];
                if (file) {
                  formik.setFieldValue("file", file);
                }
              }}
            />
          </div>

          <Button
            type="submit"
            title={uploading ? "Uploading..." : "Upload"}
            disabled={uploading}
          />
        </form>
      </div>
    </div>
  );
};

export default ImageUpload;
