import React from "react";
import clsx from "clsx";

const Button = ({ onSubmit, title, isLoading = false }) => {
  return (
    <button
      onClick={onSubmit}
      className={clsx(
        `w-full ${
          isLoading ? "bg-indigo-400" : "bg-indigo-600 hover:bg-blue-700"
        } px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform rounded-lg  focus:outline-none focus:ring`
      )}
    >
      {title}
    </button>
  );
};

export default Button;
