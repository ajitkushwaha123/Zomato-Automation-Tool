import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addProject,
  deleteProject,
  fetchProjects,
} from "../redux/slices/projectSlice";

export const useProjects = () => {
  const dispatch = useDispatch();
  const { projects, loading, error } = useSelector((state) => state.projects);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleDeleteProject = (id) => {
    dispatch(deleteProject(id));
  };

  const handleAddProject = (values) => {
    dispatch(addProject(values));
  };
  return { projects, loading, error, handleDeleteProject, handleAddProject };
};
