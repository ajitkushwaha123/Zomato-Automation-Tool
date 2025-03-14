import React from "react";
import Category from "../zomatoExtension/MenuView/Category";
import LeadsTable from "./LeadsTable";

const Leads = () => {
  return (
    <div className="flex bg-[#0F090C] bg-pattern1 justify-between items-start">
      <div className="w-[20%] h-screen overflow-hidden">
        <Category
        //   menuData={menuData}
        //   selectCategory={selectedCategory}
        //   finalItems={finalItems}
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
