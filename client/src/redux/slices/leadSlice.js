import { createSlice } from "@reduxjs/toolkit";

const data = [
  {
    id: "1",
    name: "John Doe",
    phone: "123-456-7890",
    services: "Web Development",
    price: "$2000",
    status: "New",
    remark: "Follow up next week",
    date: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Jane Smith",
    phone: "987-654-3210",
    services: "SEO",
    price: "$1500",
    status: "In Progress",
    remark: "Awaiting client feedback",
    date: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Alice Johnson",
    phone: "555-666-7777",
    services: "Graphic Design",
    price: "$1200",
    status: "Closed",
    remark: "Project completed successfully , Project completed successfully",
    date: new Date().toISOString(),
  },
];

const columns = [
  { title: "S. No.", uid: "serial" },
  { title: "Date", uid: "date" },
  { title: "Name", uid: "name" },
  { title: "Phone", uid: "phone" },
  { title: "Services", uid: "services" },
  { title: "Price", uid: "price" },
  { title: "Status", uid: "status" },
  { title: "Remark", uid: "remark" },
  { title: "+", uid: "delete" },
];

const leadSlice = createSlice({
  name: "leads",
  initialState: {
    columns: columns,
    leads: data,
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
      console.log(action.payload);
      state.leads = state.leads.filter((lead) => lead.id !== action.payload);
    },
    updateLead: (state, action) => {
      const { id, updatedData } = action.payload;
      const index = state.leads.findIndex((lead) => lead.id === id);

      if (index !== -1) {
        state.leads[index] = {
          ...state.leads[index],
          ...updatedData,
        };
      }
    },
  },
});

export const { addLead, removeLead, updateLead } = leadSlice.actions;
export default leadSlice.reducer;
