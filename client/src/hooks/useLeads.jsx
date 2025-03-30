import { useDispatch, useSelector } from "react-redux";
import {
  addColumn,
  addLead,
  fetchBoard,
  removeLead,
  updateLead,
} from "../redux/slices/leadSlice";
import { useEffect } from "react";
import { useParams } from "react-router";

export const useLeads = () => {
  const { projectId } = useParams();
  const dispatch = useDispatch();
  const { leads, isLoading, message, error, columns, updatedLeads } =
    useSelector((state) => state.leads);

  const addLeads = (lead) => {
    dispatch(addLead(lead));
  };

  useEffect(() => {
    if (projectId) {
      dispatch(fetchBoard(projectId));
    }
  }, [dispatch, projectId]);

  const deleteLeads = (id) => {
    dispatch(removeLead(id));
  };

  const handleUpdateLeads = ({ id, field, value }) => {
    dispatch(updateLead({ id, field, value }));
  };

  const handleAddColumn = (column) => {
    dispatch(addColumn(column));
  };

  return {
    leads,
    isLoading,
    message,
    error,
    addLeads,
    columns,
    deleteLeads,
    handleUpdateLeads,
    updatedLeads,
    handleAddColumn,
  };
};
