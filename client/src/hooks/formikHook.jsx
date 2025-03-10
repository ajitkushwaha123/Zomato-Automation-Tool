import { useFormik } from "formik";
import React, { useState } from "react";
import toast from "react-hot-toast";

export const useFormikHook = (config) => {
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    ...config,
    onSubmit: async (values) => {
      console.log("Submitting form with values:", values);
      setIsLoading(true);

      try {
        const helperPromise = config?.helperFunction(values);
        if (!(helperPromise instanceof Promise)) {
          throw new Error("helperFunction did not return a Promise");
        }

        await toast.promise(helperPromise, {
          loading: config?.loadingMsg || "Loading...",
          success: <b>{config?.successMsg || "Done Successfully... !"}</b>,
          error: (err) => <b>{err?.message || "Something Went Wrong... !"}</b>,
        });

        config?.onSuccess(); 
      } catch (err) {
        console.error("Error in useFormikHook:", err);
      } finally {
        setIsLoading(false); 
      }
    },
  });

  return { formik, isLoading };
};
