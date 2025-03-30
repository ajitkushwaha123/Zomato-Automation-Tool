import React from "react";
import clsx from "clsx";
import Icon from "../../helper/Icon";

const ClassicBtn = ({
  showIcon = false,
  icon = "",
  onSubmit,
  title,
  isLoading = false,
  size=10
}) => {
  return (
    <button
      onClick={onSubmit}
      className={clsx(
        `${
          isLoading ? "bg-gray-700" : "bg-gray-800 hover:bg-gray-700"
        } px-6 py-2.5 text-nowrap text-sm flex justify-center items-center font-medium tracking-wide text-white capitalize transition-colors duration-300 transform rounded-lg  focus:outline-none`
      )}
    >
      {showIcon === true && (
        <span className="ml-3">
          <Icon size={size} name={icon} />
        </span>
      )}
      <span>{title}</span>
    </button>
  );
};

export default ClassicBtn;
