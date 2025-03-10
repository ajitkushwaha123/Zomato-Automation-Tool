import React from "react";
import clsx from "clsx";
import Icon from "../../helper/Icon";

const Button = ({
  showIcon = false,
  icon = "",
  onSubmit,
  title,
  isLoading = false,
}) => {
  return (
    <button
      onClick={onSubmit}
      className={clsx(
        `w-full ${
          isLoading ? "bg-indigo-400" : "bg-indigo-600 hover:bg-blue-700"
        } px-6 py-2.5 text-sm flex justify-center items-center font-medium tracking-wide text-white capitalize transition-colors duration-300 transform rounded-lg  focus:outline-none focus:ring`
      )}
    >
      {showIcon === true && (
        <span className="ml-3">
          <Icon name={icon} />
        </span>
      )}
      <span>{title}</span>
    </button>
  );
};

export default Button;
