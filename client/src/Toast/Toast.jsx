import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SpotlightCard from "./SpotLightCard";

const Toast = ({ title, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose && onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="z-20 absolute bg-black right-10 top-10 w-[400px] shadow-lg"
        >
          <SpotlightCard
            className="custom-spotlight-card rounded-sm"
            spotlightColor="rgba(0, 229, 255, 0.2)"
          >
            <h3 className="text-white">{title}</h3>
          </SpotlightCard>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
