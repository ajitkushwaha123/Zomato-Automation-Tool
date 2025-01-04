import { useFormik } from "formik";
import React, { useState } from "react";
import toast from "react-hot-toast";

export const useFormikHook = (config) => {
  const [isLoading, setIsLoading] = useState(false);
  const formik = useFormik({
    ...config,
    onSubmit: async (values) => {
      console.log(values);
      const helperPromise = config?.helperFunction(values);
      setIsLoading(true);

      await toast
        .promise(helperPromise, {
          loading: config?.loadingMsg || "Loading...",
          success: <b>{config?.successMsg || "Done Successfully... !"}</b>,
          error: (err) => <b>{err?.message || "Something Went Wrong... !"}</b>,
        })
        .then(() => {
          setIsLoading(false);
          config?.onSuccess();
        })
        .catch((err) => {
          setIsLoading(false);
          console.error("Promise rejected:", err);
        });
    },
  });

  return {formik , isLoading};
};
