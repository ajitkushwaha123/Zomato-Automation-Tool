import React from "react";
import LeadsTable from "./LeadsTable";
import Sidebar from "./Sidebar";

const sidebarData = [
  { title: "Dashboard" , link : "/leads/dashboard" },
  { title: "Projects" , link : "/leads/projects ", subItems: ["Project A", "Project B"] },
  { title: "Teams", subItems: ["Team Alpha", "Team Beta"] },
  { title: "Settings" },
];

const handleItemClick = (title) => {
  console.log("Clicked:", title);
};

const handleSubItemClick = (parentTitle, subTitle) => {
  console.log(`Clicked Sub-item: ${subTitle} in ${parentTitle}`);
};

const handleDelete = (parentTitle, subTitle) => {
  console.log(`Delete ${subTitle} from ${parentTitle}`);
};

const Leads = () => {
  return (
    <div className="flex bg-[#0F090C] bg-pattern1 justify-between items-start">
      <div className="w-[20%] h-screen overflow-hidden">
        <Sidebar
          sidebarItems={sidebarData}
          onItemClick={handleItemClick}
          onSubItemClick={handleSubItemClick}
          onDelete={handleDelete}
        />
      </div>

      <div className="chalaja h-screen overflow-y-scroll w-[80%] p-4 bg-pattern3 rounded-lg">
        {/* <ProductTable filters={filters} /> */}
        <LeadsTable
        //   filters={filters}
        //   filteredProducts={(val) => handleItemsData(val)}
        />
      </div>
    </div>
  );
};

export default Leads;
