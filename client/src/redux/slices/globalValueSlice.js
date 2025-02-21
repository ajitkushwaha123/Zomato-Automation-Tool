import { createSlice } from "@reduxjs/toolkit";

const globalValueSlice = createSlice({
  name: "globalValue",
  initialState: {
    resIdFrom: "",
    resIdTo: "",
    browserEndPoint: "",
  },
  reducers: {
    updateResIdFrom: (state, action) => {
      state.resIdFrom = action.payload;
    },
    updateResIdTo: (state, action) => {
      state.resIdTo = action.payload;
    },
    updateBrowserEndPoint: (state, action) => {
      state.browserEndPoint = action.payload;
    },
  },
});

export const { updateResIdFrom, updateResIdTo, updateBrowserEndPoint } =
  globalValueSlice.actions;
export default globalValueSlice.reducer;
