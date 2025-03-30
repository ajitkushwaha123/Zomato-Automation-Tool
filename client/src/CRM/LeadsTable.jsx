import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useLeads } from "../hooks/useLeads";
import {
  formatDate,
  generateUniqueId,
  getStatusColor,
  statusOptions,
} from "./leadHelper";
import { Search, Trash2 } from "lucide-react";
import Button from "../components/Button/Button";
import { useResizableColumns } from "../hooks/useResizableColumns";
import Datepicker from "react-tailwindcss-datepicker";
import StatusDropdown from "./StatusDropdown";
import ClassicBtn from "../components/Button/ClassicBtn";

const LeadsTable = ({ tableTitle = "Customer Data" }) => {
  const {
    leads,
    isLoading,
    addLeads,
    columns,
    deleteLeads,
    handleUpdateLeads,
    handleAddColumn,
  } = useLeads();

  const [statusFilter, setStatusFilter] = useState([]);

  const [value, setValue] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });

  const [query, setQuery] = useState("");

  const { columnWidths, handleResize } = useResizableColumns({
    delete: 20,
    serial: 30,
    date: 120,
    otherCol: 150,
  });

  const handleAddLeads = (e) => {
    e.preventDefault();

    const newLead = {
      id: generateUniqueId(),
      name: "Michael Scott",
      phone: "111-222-3333",
      services: "Office Management",
      price: "$5000",
      status: "New",
      remark: "Needs a proposal",
    };

    addLeads(newLead);
  };

  const filteredItems = leads?.filter((lead) => {
    console.log(lead);
    if (!value.startDate && !value.endDate) {
      setValue({
        startDate: new Date(),
        endDate: new Date(),
      });
    }

    if (statusFilter?.length > 0) {
      if (!statusFilter.some((filter) => filter.label === lead.status)) {
        return false;
      }
    }

    const leadDate = new Date(lead.date).setHours(0, 0, 0, 0);
    const startDate = new Date(value.startDate).setHours(0, 0, 0, 0);
    const endDate = new Date(value.endDate).setHours(0, 0, 0, 0);
    const isWithinDateRange = leadDate >= startDate && leadDate <= endDate;

    if (!query) {
      return isWithinDateRange;
    }

    const lowerCaseQuery = query.toLowerCase();

    return (
      isWithinDateRange &&
      Object.values(lead).some(
        (value) => value && String(value).toLowerCase().includes(lowerCaseQuery)
      )
    );
  });

  console.log("value", value);
  const handleSelectedStatus = (val) => {
    setStatusFilter(val);
  };

  const handleUpdateColumn = (e) => {
    const col = {
      name: "col_name",
      type: "text",
    };
    console.log(col);

    handleAddColumn(col);
  };

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg overflow-x-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold mb-4 text-gray-200">
          🍽️ {tableTitle}
        </h2>
        <div className="flex justify-between items-center">
          <div className="flex justify-center items-center">
            <div className="justify-center mb-4 mr-4 flex items-center w-[100%] rounded-lg font-semibold transition-all duration-300">
              <Datepicker
                primaryColor="green"
                value={value}
                onChange={(newValue) => setValue(newValue)}
                showShortcuts={true}
                inputClassName={
                  "bg-gray-800 text-white border-gray-600 rounded-md px-4 py-2.5"
                }
              />
            </div>

            <StatusDropdown
              selectedStatus={(val) => handleSelectedStatus(val)}
              statusOptions={statusOptions}
            />

            <div className="flex mb-4 justify-center items-center bg-gray-800 border border-gray-700 rounded-md px-4 py-2 shadow-md backdrop-blur-md">
              <input
                type="text"
                // value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Write a Prompt..."
                className="bg-transparent flex-1 outline-none text-white placeholder-gray-500"
              />
              <button
                // onClick={handleMenuUpdate}
                className="ml-2"
              >
                <Search className="text-gray-400 w-5 h-5 hover:text-gray-200 transition duration-300" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex justify-between items-center">
          <div className="flex justify-center items-center">
            <div className="justify-center mb-4 mr-4 flex items-center w-[100%] rounded-lg font-semibold transition-all duration-300">
              <ClassicBtn
                onSubmit={(e) => {
                  handleUpdateColumn(e);
                }}
                title={"Add Column"}
              />
            </div>

            <StatusDropdown
              selectedStatus={(val) => handleSelectedStatus(val)}
              statusOptions={statusOptions}
            />
          </div>
        </div>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-700">
            {columns?.map((col, index) => (
              <th
                key={index}
                style={{ width: `${columnWidths[col.uid]}px` }}
                className={`relative ${
                  leads?.length ? "border-1" : ""
                } border-gray-800 text-gray-300 uppercase text-sm p-3 text-left`}
              >
                {col?.name}
                <span
                  className="absolute right-0 top-0 h-full w-[1px] bg-gray-800 cursor-col-resize"
                  onMouseDown={(e) => handleResize(e, col.uid)}
                ></span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {leads?.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="border-b border-gray-700 hover:bg-gray-800"
            >
              {columns?.map((col, colIndex) => (
                <td
                  key={colIndex}
                  style={{ width: `${columnWidths[col.uid]}px` }}
                  className="p-4 border-1 border-gray-800"
                >
                  {col.uid === "status" ? (
                    <span
                      className={`px-2 py-1 text-xs rounded ${getStatusColor(
                        row[col.name]
                      )}`}
                    >
                      {row[col.name]}
                    </span>
                  ) : col?.uid === "serial" ? (
                    <span> {rowIndex + 1} </span>
                  ) : col?.uid === "date" ? (
                    formatDate(row[col?.uid])
                  ) : col.uid === "delete" ? (
                    <motion.span
                      whileTap={{ scale: 0.9 }}
                      className="cursor-pointer"
                      onClick={(e) => deleteLeads(row?.id)}
                    >
                      <Trash2 />
                    </motion.span>
                  ) : (
                    <input
                      type="text"
                      className="bg-transparent outline-none w-full"
                      value={row[col?.name] || "-"}
                      onChange={(e) =>
                        handleUpdateLeads({
                          id: row?.id,
                          field: col?.name,
                          value: e.target.value,
                        })
                      }
                    />
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="w-full flex justify-center items-center">
        <div
          className={`hover:bg-gray-800 flex justify-center items-center w-full transition duration-300 
                            bg-gray-900`}
        >
          <div className="p-4 border-b flex w-full justify-center items-center border-gray-700 text-gray-200 font-medium">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                handleAddLeads(e);
              }}
              className="text-sm cursor-pointer justify-center text-center text-gray-400 bg-gray-800 px-3 py-1 rounded-md flex gap-2 items-center"
            >
              <span className="font-semibold text-[20px]">+</span>
              Add Lead
            </motion.button>
          </div>
        </div>
      </div>

      <div className="flex justify-center items-center w-[100%]">
        {filteredItems?.length === 0 && (
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

              <p className="text-lg text-gray-400">No Data found.</p>
              <p className="text-sm text-gray-500">
                Start by scraping / uploading a menu .!
              </p>

              <Button
                onSubmit={(e) => {
                  handleAddLeads(e);
                }}
                title="Add Leads"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadsTable;
