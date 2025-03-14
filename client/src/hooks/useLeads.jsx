import { useDispatch, useSelector } from "react-redux";
import { addLead, removeLead } from "../redux/slices/leadSlice";

export const useLeads = () => {
  const dispatch = useDispatch();
  const { leads, isLoading, message, error, columns } = useSelector(
    (state) => state.leads
  );

  const addLeads = (lead) => {
    dispatch(addLead(lead));
  };

  const deleteLeads = (id) => {
    dispatch(removeLead(id));
  };

  return { leads, isLoading, message, error, addLeads, columns, deleteLeads };
};
