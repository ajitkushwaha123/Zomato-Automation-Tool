
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api`;

// AsyncThunk for uploading the menu
export const handleMenuUpload = createAsyncThunk(
  "product/handleMenuUpload",
  async (formData, thunkAPI) => {
    try {
      formData.forEach((value, key) => console.log(`${key}:`, value));
      const response = await axios.post(
        `${API_URL}/gemini/upload-menu`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log("response", response.data.data);
      return response?.data || {};
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to upload menu"
      );
    }
  }
);

// AsyncThunk for scraping data
export const handleScrapeData = createAsyncThunk(
  "product/handleScrapeData",
  async (data, thunkAPI) => {
    try {
      console.log("resId", data);
      const response = await axios.get(
        `${API_URL}/scrape?resId=${data.resIdFrom}&browserEndPoint=${data.browserEndPoint}`
      );

      console.log(response.data);
      return response?.data?.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to scrape data"
      );
    }
  }
);

// AsyncThunk for updating menu using AI
export const handleMenuAIUpdate = createAsyncThunk(
  "product/handleMenuAIUpdate",
  async ({ productData, input }, thunkAPI) => {
    try {
      const response = await axios.post(`${API_URL}/gemini/update-menu`, {
        data: productData,
        input,
      });
      console.log("response", response?.data);
      return response?.data?.data || [];
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update menu"
      );
    }
  }
);

// Menu slice
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
    updateMenuDataById: (state, action) => {
      const { id, url } = action.payload;
      const index = state.menuData.findIndex((item) => item.id === id);
      if (index !== -1) state.menuData[index].img = url;
    },
    deleteMenuData: (state, action) => {
      const { id } = action.payload;
      state.menuData = state.menuData.filter((item) => item.id !== id);
    },
    updateMenuDataPortion: (state, action) => {
      const updatedItems = action.payload; // Expecting an array of updated items

      console.log("updatedItems", updatedItems);
      updatedItems?.forEach((updatedItem) => {
        const index = state.menuData.findIndex(
          (item) => item.id === updatedItem.id
        );
        if (index !== -1) {
          state.menuData[index] = { ...state.menuData[index], ...updatedItem };
        }
      });
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
        const { message, error, data } = action.payload || {};
        state.isLoading = false;
        state.message = message || "";
        state.error = error || null;
        if (data) state.menuData = data;
      })
      .addCase(handleMenuUpload.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(handleScrapeData.pending, (state) => {
        state.isLoading = true;
        state.message = "";
        state.error = null;
      })
      .addCase(handleScrapeData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.menuData = action.payload || [];
        state.message =  "Data scraped successfully.";
      })
      .addCase(handleScrapeData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
        console.log(action);
        state.message = action.payload || "Failed to scrape data";
      })
      .addCase(handleMenuAIUpdate.pending, (state) => {
        state.isLoading = true;
        state.message = "";
        state.error = null;
      })
      .addCase(handleMenuAIUpdate.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload || "";
        state.menuData = action.payload || [];
      })
      .addCase(handleMenuAIUpdate.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
        state.message = action.payload || "Failed to update menu";
      });
  },
});

export const {
  updateMenuData,
  updateMenuDataById,
  deleteMenuData,
  updateMenuDataPortion,
} = menuSlice.actions;
export default menuSlice;
