import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { apiRequest } from "../../../utils/api-request";

const API_URL = `${import.meta.env.VITE_API_URL}/api`;

export const fetchProjects = createAsyncThunk("projects/fetchAll", async () => {
  return apiRequest(
    () => axios.get(`${API_URL}/project`),
    "Failed to Fetch project"
  );
});

export const deleteProject = createAsyncThunk(
  "projects/deleteAll",
  async (id) => {
    await apiRequest(
      () => axios.delete(`${API_URL}/project/${id}`),
      "Failed to Delete Project"
    );

    return id;
  }
);

export const addProject = createAsyncThunk(
  "projects/addProject",
  async (values) => {
    console.log(values);

    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("description", values.description);
    formData.append("file", values.file);

    return apiRequest(
      () => axios.post(`${API_URL}/project`, formData),
      "Failed to add project"
    );
  }
);

const projectSlice = createSlice({
  name: "projects",
  initialState: {
    projects: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload.data;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.projects = state.projects.filter((p) => p._id !== action.payload);
      })
      .addCase(addProject.pending, (state) => {
        state.loading = true;
      })
      .addCase(addProject.fulfilled, (state, action) => {
        state.projects.push(action.payload);
        state.loading = false;
      })
      .addCase(addProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default projectSlice.reducer;
