import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormikHook } from "../../hooks/formikHook";
import toast, { Toaster } from "react-hot-toast";
import {
  loginWithEmailOrUsername,
  sendLoginOtp,
  loginWithOtp,
} from "../../helper/helper";
import {
  loginValidate,
  loginWithPasswordValidate,
  loginWithOtpValidate,
} from "../../helper/validator";
import TextField from "../../components/reuseableComponents/TextField";
import Otp from "../Otp";
import { logo } from "../../assets";
import Button from "../../components/Button/Button";

const LoginWithPassword = () => {
  const navigate = useNavigate();
  const [loginWithOTP, setLoginWithOTP] = useState(false);
  const [showOtpField, setShowOtpField] = useState(false);

  const getHelperFunction = () => {
    if (!loginWithOTP) {
      return {
        onValidate: loginWithPasswordValidate,
        func: loginWithEmailOrUsername,
        onSuccess: () => {
          navigate("/profile");
        },
        success: "Logged in Successfully...!",
        loading: "Logging in ...",
      };
    } else if (!showOtpField) {
      return {
        onValidate: loginValidate,
        func: sendLoginOtp,
        onSuccess: () => {
          setShowOtpField(true);
        },
        success: "OTP Sent Successfully...!",
        loading: "Sending OTP ...",
      };
    } else {
      return {
        onValidate: loginWithOtpValidate,
        func: loginWithOtp,
        onSuccess: () => {
          navigate("/profile");
        },
        success: "Logged in Successfully...!",
        loading: "Logging in ...",
      };
    }
  };

  const { func, onSuccess, onValidate, success, loading } = getHelperFunction();

  const { formik, isLoading } = useFormikHook({
    initialValues: {
      usernameOrEmail: "",
      password: "",
      otp: "",
    },
    validate: onValidate,
    validateOnChange: false,
    validateOnBlur: false,
    helperFunction: func,
    onSuccess: onSuccess,
    loadingMsg: loading,
    successMsg: success,
  });

  const handleLoginToggle = () => setLoginWithOTP(!loginWithOTP);

  const setFieldValues = (name, val) => {
    formik.setFieldValue(name, val);
  };

  return (
    <div className="w-full rounded-md font-poppins p-10 bg-white shadow-lg">
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <div className="flex justify-center mx-auto">
        <div className="bg-indigo-500 w-[50px] flex justify-center items-center h-[50px] p-2 rounded-xl">
          <img src={logo} alt="Logo" />
        </div>
      </div>

      <p className="mt-3 font-poppins text-xl text-center text-gray-600">
        Welcome back!
      </p>

      {!showOtpField && (
        <a
          href="#"
          className="flex items-center justify-center mt-4 text-black transition-colors duration-300 transform border rounded-lg dark:text-gray-200 hover:bg-gray-50"
        >
          <span className="w-5/6 px-4 py-3 text-[#2e2e2e] font-bold text-center">
            Login with Google
          </span>
        </a>
      )}

      <div className="flex items-center justify-between mt-4">
        <span className="w-1/5 border-b lg:w-1/4"></span>
        <a
          href="#"
          className="text-xs text-center text-gray-500 uppercase hover:underline"
        >
          or Register with email
        </a>
        <span className="w-1/5 border-b lg:w-1/4"></span>
      </div>

      {!showOtpField ? (
        <div>
          <TextField
            input={(val) => setFieldValues("usernameOrEmail", val)}
            title="USERNAME / EMAIL"
          />
          {!loginWithOTP && (
            <TextField
              input={(val) => setFieldValues("password", val)}
              title="PASSWORD"
              type="password"
            />
          )}
        </div>
      ) : (
        <div className="w-full flex justify-center items-center">
          <Otp otpEntered={(val) => setFieldValues("otp", val)} />
        </div>
      )}

      <div className={`flex ${showOtpField ? "hidden" : ""} mt-4 justify-between items-center`}>
        <p
          onClick={handleLoginToggle}
          className="text-xs cursor-pointer text-gray-500 uppercase hover:underline"
        >
          {loginWithOTP ? "Login with Password" : "Login with OTP"}
        </p>
        <p className="text-xs cursor-pointer text-primary uppercase hover:underline">
          <Link to="/reset-password">Forget Password ?</Link>
        </p>
      </div>

      <div className="mt-6">
        <Button
          onSubmit={isLoading ? "" : formik.handleSubmit}
          title={
            isLoading
              ? "Loading..."
              : loginWithOTP
              ? showOtpField
                ? "LOGIN"
                : "SEND OTP"
              : "LOGIN"
          }
          isLoading={isLoading}
        />
      </div>

      <div className="flex items-center justify-between mt-4">
        <span className="w-1/5 border-b md:w-1/4"></span>
        <Link
          to={showOtpField ? "" : "/register"}
          className="text-xs text-gray-500 uppercase hover:underline"
        >
          {showOtpField ? (
            <>
              <span className="decoration-none">Didn't Receive OTP? </span>
              <button
                onClick={() => {
                  setShowOtpField(false);
                }}
                className="uppercase text-indigo-700"
              >
                Resend
              </button>
            </>
          ) : (
            "or Register"
          )}
        </Link>
        <span className="w-1/5 border-b md:w-1/4"></span>
      </div>
    </div>
  );
};

export default LoginWithPassword;
