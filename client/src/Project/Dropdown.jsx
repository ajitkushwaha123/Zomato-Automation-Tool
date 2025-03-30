import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import Icon from "../helper/Icon";
import { motion } from "framer-motion";
import clsx from "clsx";
import { useProjects } from "../hooks/useProjects";
import { useNavigate } from "react-router-dom";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function DropDown({
  title,
  menuOptions,
  btn,
  showBtn = false,
  selectedDropdown,
  projectId,
  type,
}) {
  const handleSelectedDropdownOption = (val) => {
    selectedDropdown(val);
    console.log("Selected:", val);
  };

  const navigate = useNavigate();

  const { projects, loading, error, handleDeleteProject } = useProjects();
  const handleViewProject = (projectId) => {
    if (type == true) {
      navigate(`/leads/projects/${projectId}`);
    }else{
      navigate(`/projects/${projectId}`);
    }
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button>
          {showBtn ? (
            <div className="text-white">{btn}</div>
          ) : (
            <motion.button
              whileTap={{ scale: 0.95 }}
              className={clsx(
                `flex justify-center items-center w-full rounded-md border border-gray-700 shadow-sm px-3 py-2 
                bg-[#292929] text-sm font-medium text-gray-300 hover:bg-[#3700B3] hover:text-white outline-none transition-all duration-200`
              )}
            >
              <div className="flex items-center">
                <Icon size={18} name={"FileClock"} />
                <span className="mx-1">{title}</span>
              </div>
            </motion.button>
          )}
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-150"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-100"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="origin-top-right z-50 absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-[#1E1E1E] border border-gray-700 divide-y divide-gray-700 focus:outline-none">
          {menuOptions.map((option, index) => (
            <motion.div whileTap={{ scale: 0.95 }} key={index} className="py-1">
              <Menu.Item
                // onClick={() => handleSelectedDropdownOption(option.value)}
                onClick={
                  option.value == "delete"
                    ? () => handleDeleteProject(projectId)
                    : option.value == "view"
                    ? () => handleViewProject(projectId)
                    : ""
                }
              >
                {({ active }) => (
                  <a
                    href="#"
                    className={classNames(
                      active ? "bg-[#292929] text-white" : "text-gray-300",
                      "group flex items-center px-4 py-2 text-sm transition-all duration-200"
                    )}
                  >
                    <span className="mr-3 h-5 w-5 text-gray-500 group-hover:text-white transition-all duration-200">
                      <Icon size={18} name={option.icon} />
                    </span>
                    {option.title}
                  </a>
                )}
              </Menu.Item>
            </motion.div>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
