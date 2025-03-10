import { configureStore, createSlice } from "@reduxjs/toolkit";
import menuSlice from "../redux/slices/productSlice";
import modalSlice from "../redux/slices/modalSlice";
import globalValueSlice from "../redux/slices/globalValueSlice";
import projectReducer from "../redux/slices/projectSlice";

// Auth slice
const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
  },
  reducers: {
    login(state) {
      state.isLoggedIn = true;
    },
    logout(state) {
      state.isLoggedIn = false;
    },
  },
});

export const authActions = authSlice.actions;

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    menu: menuSlice.reducer,
    searchModal: modalSlice.reducer,
    globalValue: globalValueSlice,
    projects: projectReducer,
  },
});
