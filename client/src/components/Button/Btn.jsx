import React from "react";
import clsx from "clsx";
import { motion } from "motion/react";
import Icon from "../../helper/Icon"

const Btn = ({
  title,
  rounded = "md",
  classNames,
  showDownArrow = false,
  frontIcon,
  btn,
  padding = "20px",
}) => {
  return (
    <div>
      {btn ? (
        <motion.button
          className={clsx(`${classNames}`)}
          whileTap={{ scale: 0.9 }}
        >
          {btn}
        </motion.button>
      ) : (
        <motion.button
          className={clsx(
            `px-[${padding}] py-1.5 rounded-${rounded} ${classNames} shadow-sm`,
            "flex justify-between items-center"
          )}
          whileTap={{ scale: 0.9 }}
        >
          {frontIcon && (
            <span className="mr-2">
              <Icon name={frontIcon} />
            </span>
          )}
          <span>{title}</span>
          {showDownArrow && (
            <span className="ml-2">
              <Icon name={"ChevronDown"} />
            </span>
          )}
        </motion.button>
      )}
    </div>
  );
};

export default Btn;
