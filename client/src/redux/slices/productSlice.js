import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api`;

export const handleMenuUpload = createAsyncThunk(
  "product/handleMenuUpload",
  async (formData, thunkAPI) => {
    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });
    try {
      const response = await axios.post(
        `${API_URL}/gemini/upload-menu`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("response" , response.data.data);
      return response?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to upload menu"
      );
    }
  }
);

const menuSlice = createSlice({
  name: "menu",
  initialState: {
    menuData: [],
    message: "",
    isLoading: false,
    error: null,
  },
  reducers: {
    updateMenuData: (state, action) => {
      state.menuData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(handleMenuUpload.pending, (state) => {
        state.isLoading = true;
        state.message = "";
        state.error = null;
      })
      .addCase(handleMenuUpload.fulfilled, (state, action) => {
        const { message, error, data } = action.payload;

        state.isLoading = false;

        if (message) {
          state.message = message;
        }

        if (error) {
          state.error = error;
        }

        if (data) {
          state.menuData = data;
        }
      })
      .addCase(handleMenuUpload.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { updateMenuData } = menuSlice.actions
export default menuSlice;
