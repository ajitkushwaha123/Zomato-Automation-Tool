import React, { useState } from "react";

const TextField = ({ title, type, input }) => {
  const [value, setValue] = useState("");

  const handleInputChange = (e) => {
    setValue(e.target.value);
    input(e.target.value);
  };

  return (
    <div>
      <div className="mt-4">
        <label className="block mb-2 text-sm font-medium text-gray-600">
          {title}
        </label>
        <input
          value={value}
          onChange={handleInputChange}
          className="block w-full px-4 py-2 text-gray-700 bg-white border rounded-lg focus:border-blue-400 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
          type={type}
        />
      </div>
    </div>
  );
};

export default TextField;
