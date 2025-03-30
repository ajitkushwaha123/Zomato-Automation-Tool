import React, { useState } from "react";
import Icon from "../helper/Icon";
import Dropdown from "./Dropdown";
import Btn from "../components/Button/Btn";
import { motion } from "framer-motion";
import Modal from "../Modal/Modal";
import AddProject from "./AddProject";
import { useProjects } from "../hooks/useProjects";
import Button from "../components/Button/Button";

const Project = () => {
  const { projects, loading, error } = useProjects();
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);

  const handleModalChange = (val) => {
    setShowAddProjectModal(val);
  };

  return (
    <>
      <div className="p-5 min-h-screen bg-gray-900">
        <div className="flex mb-5 rounded-md p-5 bg-gray-800 shadow-md justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-300">Projects</h1>
          <div onClick={() => handleModalChange(true)}>
            <Btn
              title={"Add Project"}
              frontIcon={"CirclePlus"}
              classNames={"bg-[#6200EA] text-white hover:bg-[#3700B3]"}
            />
          </div>
        </div>

        <ul className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {projects?.map((project, index) => (
            <motion.li key={index} className="relative">
              <label className="flex flex-col items-center justify-between w-full p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 shadow-md bg-gray-800 hover:border-gray-500 border-gray-700">
                <div className="w-full h-[150px] overflow-hidden rounded-lg">
                  <img
                    className="w-full h-full object-cover"
                    src={project.image}
                    alt={`Project ${index + 1}`}
                  />
                </div>

                <div className="flex items-center justify-between w-full px-2 mt-3">
                  <h1 className="truncate text-gray-300 font-medium">
                    {project.name}
                  </h1>

                  <button className="px-3 py-1 flex items-center gap-2 absolute top-2 right-2 text-xs font-medium text-gray-300 bg-gray-900/80 border border-gray-700 rounded-md shadow-md hover:bg-gray-800 hover:border-gray-600 transition duration-200 backdrop-blur-md">
                    {new Date(project.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                    })}
                  </button>

                  <Dropdown
                    title={"Options"}
                    menuOptions={exportOptions}
                    btn={<Icon size={22} name="EllipsisVertical" />}
                    showBtn={true}
                    projectId={project._id}
                    type={project?.crmProject}
                  />
                </div>
              </label>
            </motion.li>
          ))}
        </ul>

        <div className="flex justify-center items-center w-[100%]">
          {projects?.length === 0 && (
            <div className="h-[500px] w-full flex flex-col justify-center items-center text-gray-300 rounded-lg shadow-lg">
              <div className="flex flex-col items-center space-y-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-24 w-24 text-gray-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 6l3-3h12l3 3"></path>
                  <path d="M3 6v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6"></path>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>

                <p className="text-lg text-gray-400">No Project Found.!</p>
                <p className="text-sm text-gray-500">
                  Start by creating a new Project .!
                </p>
                <Button
                  title="Add Project"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {showAddProjectModal && (
        <Modal
          isOpen={showAddProjectModal}
          stillOpen={(val) => handleModalChange(val)}
          content={<AddProject stillOpen={(val) => handleModalChange(val)} />}
        />
      )}
    </>
  );
};

export default Project;

const exportOptions = [
  // { title: "Edit", icon: "SquarePen", value: "edit" },
  { title: "View", value: "view", icon: "Eye" },
  { title: "Delete", value: "delete", icon: "Trash2" },
];
