import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const sidebarData = [
  { title: "Dashboard", link: "/leads/dashboard" },
  {
    title: "Projects",
    link: "/leads/projects",
    subItems: [
      { title: "Project A", link: "/projects/project-a" },
      { title: "Project B", link: "/projects/project-b" },
    ],
  },
  {
    title: "Teams",
    link: "/teams",
    subItems: [
      { title: "Team Alpha", link: "/teams/team-alpha" },
      { title: "Team Beta", link: "/teams/team-beta" },
    ],
  },
  { title: "Settings", link: "/settings" },
];


const handleItemClick = (title) => {
  console.log("Clicked:", title);
};

const handleSubItemClick = (parentTitle, subTitle) => {
  console.log(`Clicked Sub-item: ${subTitle} in ${parentTitle}`);
};


const CRMLayout = () => {
  return (
    <div className="flex bg-[#0F090C] bg-pattern1 justify-between items-start">
      <div className="w-[20%] h-screen overflow-hidden">
        <Sidebar
          sidebarItems={sidebarData}
          onItemClick={handleItemClick}
          onSubItemClick={handleSubItemClick}
        />
      </div>

      <div className="chalaja h-screen overflow-y-scroll w-[80%] p-4 bg-pattern3 rounded-lg">
        <Outlet />
      </div>
    </div>
  );
};

export default CRMLayout;
