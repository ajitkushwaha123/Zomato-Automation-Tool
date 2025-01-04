import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api`;
import { apiRequest } from "../../utils/api-request";

export const registerUser = (data) =>
  apiRequest(
    () =>
      axios.post(`${API_URL}/user/register`, data, {
        withCredentials: true,
      }),
    "Error in registering user... !"
  );

export const loginWithEmailOrUsername = (data) =>
  apiRequest(
    () =>
      axios.post(`${API_URL}/user/login`, data, {
        withCredentials: true,
      }),
    "Error in Sign In... !"
  );

export const getUser = () =>
  apiRequest(
    () =>
      axios.get(`${API_URL}/user`, {
        withCredentials: true,
      }),
    "Error in getting user data ...!"
  );

export const refreshToken = () =>
  apiRequest(
    () =>
      axios.get(`${API_URL}/user/refresh`, {
        withCredentials: true,
      }),
    "Error in refreshing token... !"
  );

export const sendOtp = (data) =>
  apiRequest(
    () => axios.post(`${API_URL}/user/send-otp`, data),
    "Error in sending OTP... !"
  );

export const sendLoginOtp = (data) =>
  apiRequest(
    () => axios.post(`${API_URL}/user/send-login-otp`, data),
    "Error in sending OTP... !"
  );

export const loginWithOtp = (data) =>
  apiRequest(
    () =>
      axios.post(`${API_URL}/user/login-otp`, data, {
        withCredentials: true,
      }),
    "Error in Sign In... !"
  );

export const sendResetPasswordEmail = (data) =>
  apiRequest(
    () => axios.post(`${API_URL}/user/forget-password`, data),
    "Error in sending reset password email... !"
  );

export const resetPassword = (data) =>
  apiRequest(
    () => axios.post(`${API_URL}/user/reset-password`, data),
    "Error in resetting password... !"
  );
