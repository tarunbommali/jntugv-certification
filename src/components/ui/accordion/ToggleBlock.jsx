/* eslint-disable no-unused-vars */
import React from "react";

// Utility function for conditional class names
const cn = (...classes) => classes.filter(Boolean).join(' ');

const ToggleBlock = ({ 
  answer, 
  isVisible = true,
  className = "",
  ...props 
}) => {
  if (!isVisible) {
    return null;
  }

  return (
    <div className={cn("italic pb-2", className)} {...props}>
         <div
          className="text-sm leading-relaxed"
          style={{ color: "var(--color-text-medium)" }}
        >
          {answer}
        </div>
     </div>
  );
};

export default ToggleBlock;