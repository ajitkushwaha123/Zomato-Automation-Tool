import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { logo } from "../../assets";
import TextField from "../../components/reuseableComponents/TextField";
import { sendResetPasswordEmail, resetPassword } from "../../helper/helper";
import { useFormikHook } from "../../hooks/formikHook";
import Button from "../../components/Button/Button";
import { loginValidate, resetPasswordValidate } from "../../helper/validator";

const ForgetPassword = () => {
  const [token, setToken] = useState(null);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const navigate = useNavigate();

  const getHelperFunction = () => {
    if (resetEmailSent) {
      return {
        onValidate: resetPasswordValidate,
        func: resetPassword,
        onSuccess: () => {
          navigate("/login");
        },
        success : "Password Reset Successfully... !",
        loading : "Resetting Password..."
      };
    } else {
      return {
        onValidate: loginValidate,
        func: sendResetPasswordEmail,
        onSuccess: () => {
          // setShowOtpField(true);
        },
        success: "Email Sent Successfully...!",
        loading: "Sending Email ...",
      };
    }
  };

  const { func, onSuccess, onValidate , success , loading } = getHelperFunction();

  const { formik, isLoading } = useFormikHook({
    initialValues: {
      usernameOrEmail: "",
      password: "",
      confirmPassword: "",
      resetPasswordToken: "",
    },
    // helperFunction: resetEmailSent ? resetPassword : sendResetPasswordEmail,

    loadingMsg: resetEmailSent ? "Resetting Password..." : "Sending Email...",
    successMsg: resetEmailSent
      ? "Password Reset Successfully!"
      : "Email Sent Successfully!",
    validate: onValidate,
    validateOnChange: false,
    validateOnBlur: false,
    helperFunction: func,
    onSuccess: onSuccess,
    successMsg: success,
    loadingMsg: loading,
  });

  const getQueryParams = (search) => {
    const params = new URLSearchParams(search);
    return params.get("token");
  };

  useEffect(() => {
    const queryToken = getQueryParams(window.location.search);
    setToken(queryToken);

    formik.setFieldValue("resetPasswordToken", queryToken || "");

    setResetEmailSent(!!queryToken);
  }, []);

  const setFieldValues = (name, val) => {
    formik.setFieldValue(name, val);
    console.log(formik.values);
  };

  return (
    <div className="w-full rounded-md font-poppins p-10 bg-white shadow-lg">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="flex justify-center mx-auto">
        <div className="bg-indigo-500 w-[50px] flex justify-center items-center h-[50px] p-2 rounded-xl">
          <img src={logo} alt="Logo" />
        </div>
      </div>

      <p className="mt-3 font-poppins text-xl text-center text-gray-600">
        Welcome back!
      </p>

      <div className="flex items-center justify-between mt-4">
        <span className="w-1/5 border-b lg:w-1/4"></span>
        <a
          href="#"
          className="text-xs text-center text-gray-500 uppercase hover:underline"
        >
          {!resetEmailSent ? "Forget Password" : "Set New Password"}
        </a>
        <span className="w-1/5 border-b lg:w-1/4"></span>
      </div>

      {!resetEmailSent ? (
        <div>
          <TextField
            input={(val) => setFieldValues("usernameOrEmail", val)}
            title="USERNAME OR EMAIL"
          />
        </div>
      ) : (
        <div>
          <TextField
            input={(val) => setFieldValues("password", val)}
            title="NEW PASSWORD"
            type="password"
          />
          <TextField
            input={(val) => setFieldValues("confirmPassword", val)}
            title="CONFIRM PASSWORD"
            type="password"
          />
        </div>
      )}

      <div className="flex mt-4 justify-between items-center">
        <Link to={'/login'} className="text-xs cursor-pointer text-gray-500 uppercase hover:underline">
          Login With Email
        </Link>
        <Link to={!resetEmailSent ? "/register" : "/reset-pasword"} className="text-xs cursor-pointer text-primary uppercase hover:underline">
          {!resetEmailSent ? "Register" : "Forget Password"}
        </Link>
      </div>

      <div className="mt-6">
        <Button
          onSubmit={isLoading ? "" : formik.handleSubmit}
          title={
            isLoading
              ? "Loading..."
              : !resetEmailSent
              ? "SEND RESET LINK"
              : "Set New Password"
          }
          isLoading={isLoading}
        />
      </div>

      <div className="flex items-center justify-between mt-4">
        <span className="w-1/5 border-b md:w-1/4"></span>
        <Link
          to="/register"
          className="text-xs text-gray-500 uppercase hover:underline"
        >
          or Register
        </Link>
        <span className="w-1/5 border-b md:w-1/4"></span>
      </div>
    </div>
  );
};

export default ForgetPassword;
