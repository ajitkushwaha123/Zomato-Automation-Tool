import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { apiRequest } from "../../../utils/api-request";

const API_URL = `${import.meta.env.VITE_API_URL}/api`;

// Async action to fetch leads board
export const fetchBoard = createAsyncThunk(
  "leads/fetchBoard",
  async (projectId, { rejectWithValue }) => {
    try {
      if (!projectId) {
        throw new Error("Project ID is required to fetch leads");
      }

      console.log("Fetching board for projectId:", projectId);

      const response = await apiRequest(
        () => axios.get(`${API_URL}/leads?projectId=${projectId}`),
        "Failed to fetch leads"
      );

      return response; // Ensure response is structured as expected
    } catch (error) {
      console.error("Error fetching board:", error);
      return rejectWithValue(error.message || "Failed to fetch leads");
    }
  }
);

const leadSlice = createSlice({
  name: "leads",
  initialState: {
    columns: [],
    leads: [],
    isLoading: false,
    error: null,
    message: "",
    updatedLeads: [],
  },
  reducers: {
    addLead: (state, action) => {
      state.leads.push({
        ...action.payload,
        date: new Date().toISOString(),
      });
    },
    removeLead: (state, action) => {
      console.log("Removing lead with ID:", action.payload);
      state.leads = state.leads.filter((lead) => lead.id !== action.payload);
    },
    updateLead: (state, action) => {
      console.log("Updating lead:", action.payload);
      state.leads = state.leads.map((lead) =>
        lead.id === action.payload.id
          ? { ...lead, [action.payload.field]: action.payload.value }
          : lead
      );

      if (!state.updatedLeads.includes(action.payload.id)) {
        state.updatedLeads.push(action.payload.id);
      }
    },
    addColumn: (state, action) => {
      return {
        ...state,
        columns: [...state.columns, action.payload],
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoard.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchBoard.fulfilled, (state, action) => {
        console.log("Fetched board data:", action.payload);
        state.isLoading = false;
        state.columns = action.payload.data[0].columns;
        state.leads = action.payload.data[0].rows;
      })
      .addCase(fetchBoard.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch leads";
      });
  },
});

export const { addLead, removeLead, updateLead, addColumn } = leadSlice.actions;
export default leadSlice.reducer;
