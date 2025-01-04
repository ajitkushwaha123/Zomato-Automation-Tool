import { useFormik } from "formik";
import toast, { Toaster } from "react-hot-toast";

export const formik = useFormik({
  initialValues: {}, // Correct typo: `intitailValues` -> `initialValues`
  onSubmit: async (values) => {
    console.log(values);

    const helperPromise = helperFunction(values);

    await toast
      .promise(helperPromise, {
        loading: loadingMsg || "Loading...",
        success: <b>{successMsg || "Task Done Successfully... !"}</b>,
        error: (err) => <b>{err.message || "Something Went Wrong... !"}</b>,
      })
      .then((onSuccess) => {
        onSuccess();
      })
      .catch((err) => {
        console.error("Promise rejected:", err);
      });
  },
});
