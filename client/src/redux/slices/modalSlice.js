import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api`;

export const handleSearchResult = createAsyncThunk(
  "search/handleSearchResult",
  async (searchQuery, thunkApi) => {
    console.log("searchQuery", searchQuery);
    try {
      const response = await axios.get(
        `${API_URL}/search?query=${searchQuery}`
      );
      console.log("response", response.data.data);
      return response.data.data;
    } catch (error) {
      return thunkApi.rejectWithValue(
        error.response?.data?.message || "Failed to get search results"
      );
    }
  }
);

const modalSlice = createSlice({
  name: "searchModal",
  initialState: {
    isOpen: false,
    title: "",
    images: [],
    searchStatus: "idle",
    error: null,
    isLoading: false, 
  },
  reducers: {
    openModal: (state, action) => {
      state.isOpen = true;
      state.title = action.payload.title;
      state.images = action.payload.images || [];
      state.id = action.payload.id;
    },
    closeModal: (state) => {
      state.isOpen = false;
      state.title = "";
      state.images = [];
      state.searchStatus = "idle";
      state.error = null;
      state.isLoading = false; 
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(handleSearchResult.pending, (state) => {
        state.searchStatus = "loading";
        state.isLoading = true; 
        state.error = null;
      })
      .addCase(handleSearchResult.fulfilled, (state, action) => {
        state.searchStatus = "succeeded";
        state.images = action.payload;
        state.isLoading = false;
      })
      .addCase(handleSearchResult.rejected, (state, action) => {
        state.searchStatus = "failed";
        state.error = action.payload;
        state.isLoading = false; 
      });
  },
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice;
