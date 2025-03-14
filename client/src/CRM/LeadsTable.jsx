import React from "react";
import { motion } from "framer-motion";
import { useLeads } from "../hooks/useLeads";
import { formatDate, generateUniqueId, getStatusColor } from "./leadHelper";
import { Trash2 } from "lucide-react";

const LeadsTable = () => {
  const { leads, isLoading, message, error, addLeads, columns, deleteLeads } =
    useLeads();

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

  const handleDeleteLeads = (e, id) => {
    e.preventDefault();

    deleteLeads(id);
  };

  return (
    <div className="bg-gray-900 text-white p-4 rounded-lg shadow-lg overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-700">
            {columns?.map((col, index) => (
              <th
                key={index}
                className="text-gray-300 uppercase text-sm p-3 text-left"
              >
                {col?.title}
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
                <td key={colIndex} className="p-4">
                  {col?.uid === "status" ? (
                    <span
                      className={`px-2 py-1 text-xs rounded ${getStatusColor(
                        row[col?.uid]
                      )}`}
                    >
                      {row[col?.uid]}
                    </span>
                  ) : col?.uid === "serial" ? (
                    <span> {rowIndex + 1} </span>
                  ) : col?.uid === "date" ? (
                    formatDate(row[col?.uid])
                  ) : col?.uid === "delete" ? (
                    <motion.span
                      whileTap={{ scale: 0.9 }}
                      className="cursor-pointer"
                      onClick={(e) => handleDeleteLeads(e, row?.id)}
                    >
                      <Trash2 />
                    </motion.span>
                  ) : col?.uid === "remark" ? (
                    <div className="w-[180px]">
                      <span
                        className="block w-full text-gray-300 text-start 
                  overflow-hidden text-ellipsis line-clamp-2
                  h-[3rem] leading-[1.5rem]"
                      >
                        {row[col?.uid] || "-"}
                      </span>
                    </div>
                  ) : (
                    row[col?.uid] || "-"
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
                            bg-gray-900
                          `}
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
    </div>
  );
};

export default LeadsTable;
