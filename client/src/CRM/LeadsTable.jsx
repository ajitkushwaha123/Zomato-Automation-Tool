import React from "react";

const LeadsTable = () => {
  const columns = ["Name", "Phone", "Services", "Price", "Status", "Remark"];
  const data = [
    {
      Name: "John Doe",
      Phone: "123-456-7890",
      Services: "Web Development",
      Price: "$2000",
      Status: "New",
      Remark: "Follow up next week",
    },
    {
      Name: "Jane Smith",
      Phone: "987-654-3210",
      Services: "SEO",
      Price: "$1500",
      Status: "In Progress",
      Remark: "Awaiting client feedback",
    },
    {
      Name: "Alice Johnson",
      Phone: "555-666-7777",
      Services: "Graphic Design",
      Price: "$1200",
      Status: "Closed",
      Remark: "Project completed successfully",
    },
  ];

  return (
    <div className="bg-gray-900 text-white p-4 rounded-lg shadow-lg overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-700">
            {columns.map((col, index) => (
              <th
                key={index}
                className="text-gray-300 uppercase text-sm p-3 text-left"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="border-b border-gray-700 hover:bg-gray-800"
            >
              {columns.map((col, colIndex) => (
                <td key={colIndex} className="p-3">
                  {col === "Status" ? (
                    <span
                      className={`px-2 py-1 text-xs rounded ${getStatusColor(
                        row[col]
                      )}`}
                    >
                      {row[col]}
                    </span>
                  ) : (
                    row[col] || "-"
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const getStatusColor = (status) => {
  switch (status) {
    case "New":
      return "bg-blue-500 text-white";
    case "In Progress":
      return "bg-yellow-500 text-black";
    case "Closed":
      return "bg-green-500 text-white";
    default:
      return "bg-gray-500 text-white";
  }
};

export default LeadsTable;
