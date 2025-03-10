"use client";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";

const Sidebar = ({ sidebarMenu }) => {
  const [active, setActive] = useState(3);
  const [expanded, setExpanded] = useState(null);
  const [activeSubItem, setActiveSubItem] = useState(null);

  const toggleSubitems = (index) => {
    setExpanded(expanded === index ? null : index);
  };

  return (
    <div className="overflow-y-scroll chalaja border-r-2 bg-white transition-all duration-300 group hover:w-[276px] w-[80px] group-hover:w-[276px]">
      <div>
        <ul className="m-4">
          {sidebarMenu.map((menu, index) => (
            <div key={index}>
              <Link to={menu?.subitems.length === 0 ? menu.url : "#"}>
                <li>
                  <div
                    className={`flex cursor-pointer ${
                      active === index
                        ? "bg-primary text-white"
                        : "hover:bg-primary hover:text-white"
                    } font-medium justify-between  p-3  my-1 rounded-md items-center`}
                    onClick={() => {
                      setActive(index);
                      toggleSubitems(index);
                    }}
                  >
                    <div className="flex items-start">
                      <span className="group-hover:ml-3 text-start hidden group-hover:block">
                        {menu.title}
                      </span>
                    </div>
                    {menu.subitems && menu.subitems.length > 0 && (
                      <div className="hidden group-hover:block">
                        {expanded === index ? <ChevronUp /> : <ChevronDown />}
                      </div>
                    )}
                  </div>
                  {expanded === index &&
                    menu.subitems &&
                    menu.subitems.length > 0 && (
                      <ul className="ml-3 hidden group-hover:block mt-2">
                        <div className="border-l-2 border-gray-400">
                          {menu.subitems.map((subitem, subIndex) => (
                            <Link to={subitem.url} key={subIndex}>
                              <li
                                className={`flex cursor-pointer ${
                                  activeSubItem === `${index}-${subIndex}`
                                    ? "bg-secondary text-primary"
                                    : "hover:bg-secondary hover:text-primary"
                                } font-medium pl-[10px] pr-[10px] py-2 my-1 rounded-md items-start`}
                                onClick={() =>
                                  setActiveSubItem(`${index}-${subIndex}`)
                                }
                              >
                                <span className="ml-3">{subitem.title}</span>
                              </li>
                            </Link>
                          ))}
                        </div>
                      </ul>
                    )}
                </li>
              </Link>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
