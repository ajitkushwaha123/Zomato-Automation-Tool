import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logo } from "../../assets";
import TextField from "../../components/reuseableComponents/TextField";
import { registerUser, sendOtp } from "../../helper/helper";
import toast, { Toaster } from "react-hot-toast";
import Otp from "../Otp";
import {
  registerValidate,
  registerWithOtpValidate,
} from "../../helper/validator";
import { useFormikHook } from "../../hooks/formikHook";

const Register = () => {
  const [showOtpField, setShowOtpField] = useState(false);
  const navigate = useNavigate();

  const getHelperFunction = () => {
    if (!showOtpField) {
      return {
        onValidate: registerValidate,
        func: sendOtp,
        onSuccess: () => {
          setShowOtpField(true);
        },
        success: "OTP Sent Successfully...!",
        loading: "Sending OTP ...",
      };
    } else {
      return {
        onValidate: registerWithOtpValidate,
        func: registerUser,
        onSuccess: () => {
          navigate("/profile");
        },
        success: "Registered Successfully...!",
        loading: "Creating account...",
      };
    }
  };

  const { func, onSuccess, onValidate, success, loading } = getHelperFunction();

  const { formik } = useFormikHook({
    initialValues: {
      username: "",
      email: "",
      password: "",
      otp: "",
      subject: "✨ Verify Your Email for Kravy 🍴🥗 - Your OTP Code is Ready!",
    },
    validate: onValidate,
    validateOnBlur: false,
    validateOnChange: false,
    helperFunction: func,
    onSuccess: onSuccess,
    successMsg: success,
    loadingMsg: loading,
  });

  const setFieldValues = (name, val) => {
    formik.setFieldValue(name, val);
    console.log(formik.values);
  };

  return (
    <div className="w-full rounded-md font-poppins p-10 bg-white shadow-lg">
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <div className="flex justify-center mx-auto">
        <div className="bg-indigo-600 w-[50px] flex justify-center items-center h-[50px] p-2 rounded-xl">
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
          <div className="px-4">
            <svg className="w-6 h-6" viewBox="0 0 40 40">
              <path
                d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.045 27.2142 24.3525 30 20 30C14.4775 30 10 25.5225 10 20C10 14.4775 14.4775 9.99999 20 9.99999C22.5492 9.99999 24.8683 10.9617 26.6342 12.5325L31.3483 7.81833C28.3717 5.04416 24.39 3.33333 20 3.33333C10.7958 3.33333 3.33335 10.7958 3.33335 20C3.33335 29.2042 10.7958 36.6667 20 36.6667C29.2042 36.6667 36.6667 29.2042 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z"
                fill="#FFC107"
              />
              <path
                d="M5.25497 12.2425L10.7308 16.2583C12.2125 12.59 15.8008 9.99999 20 9.99999C22.5491 9.99999 24.8683 10.9617 26.6341 12.5325L31.3483 7.81833C28.3716 5.04416 24.39 3.33333 20 3.33333C13.5983 3.33333 8.04663 6.94749 5.25497 12.2425Z"
                fill="#FF3D00"
              />
              <path
                d="M20 36.6667C24.305 36.6667 28.2167 35.0192 31.1742 32.34L26.0159 27.975C24.3425 29.2425 22.2625 30 20 30C15.665 30 11.9842 27.2359 10.5975 23.3784L5.16254 27.5659C7.92087 32.9634 13.5225 36.6667 20 36.6667Z"
                fill="#4CAF50"
              />
              <path
                d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.7592 25.1975 27.56 26.805 26.0133 27.9758C26.0142 27.975 26.015 27.975 26.0158 27.9742L31.1742 32.3392C30.8092 32.6708 36.6667 28.3333 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z"
                fill="#1976D2"
              />
            </svg>
          </div>

          <span className="w-5/6 px-4 py-3 text-[#2e2e2e] font-bold text-center">
            Register with Google
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

      {showOtpField ? (
        <div className="w-full flex justify-center items-center">
          <Otp otpEntered={(val) => formik.setFieldValue("otp", val)} />
        </div>
      ) : (
        <div>
          <TextField
            input={(val) => setFieldValues("username", val)}
            title="Username"
            type="text"
          />

          <TextField
            input={(val) => setFieldValues("email", val)}
            title="Email Address"
            type="email"
          />

          <TextField
            input={(val) => setFieldValues("password", val)}
            title="Password"
            type="password"
          />
        </div>
      )}

      <div>
        <button
          onClick={formik.handleSubmit}
          className={`w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-primary ${
            showOtpField ? "" : "mt-5"
          } rounded-lg hover:bg-blue-700 bg-indigo-500 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50`}
        >
          {showOtpField ? "REGISTER" : "SEND OTP"}
        </button>
      </div>

      <div className="flex items-center justify-between mt-4">
        <span className="w-1/5 border-b md:w-1/4"></span>
        <div className="text-xs text-gray-500 uppercase hover:underline">
          {showOtpField ? (
            <>
              Didn't Receive OTP?{" "}
              <button
                onClick={() => {
                  setShowOtpField(false);
                }}
                className="uppercase text-primary"
              >
                Resend
              </button>
            </>
          ) : (
            <Link to="/login">SIGN IN</Link>
          )}
        </div>

        <span className="w-1/5 border-b md:w-1/4"></span>
      </div>
    </div>
  );
};

export default Register;
