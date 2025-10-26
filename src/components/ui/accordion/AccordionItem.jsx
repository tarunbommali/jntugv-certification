/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import ToggleBlock from "./ToggleBlock.jsx";

// Utility function for conditional class names
const cn = (...classes) => classes.filter(Boolean).join(' ');

const AccordionItem = ({ 
  faq, 
  index,
  isOpen, 
  onToggle, 
  variant = "default",
  showIcons = true,
  showAnswer = true, // New prop to control answer visibility
  className = "",
  headerClassName = "",
  contentClassName = "",
}) => {
  const contentRef = useRef(null);
  const [contentHeight, setContentHeight] = useState(0);

  // Calculate content height when FAQ opens or answer visibility changes
  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [isOpen, showAnswer]);

  const getHeaderStyles = () => {
    const baseStyles = "flex items-center justify-between w-full py-4 transition-colors cursor-pointer";
    
    switch (variant) {
      case "card":
        return cn(
          baseStyles,
          "px-6 hover:bg-hover rounded-lg",
          isOpen ? "bg-hover" : "bg-surface"
        );
      case "minimal":
        return cn(baseStyles, "hover:bg-hover px-2");
      case "bordered":
        return cn(baseStyles, "px-6 hover:bg-hover");
      default:
        return cn(baseStyles, "hover:bg-hover px-4");
    }
  };

  const getContentStyles = () => {
    const baseStyles = "transition-all duration-300 ease-in-out overflow-hidden";
    
    switch (variant) {
      case "card":
        return cn(baseStyles, "px-6");
      case "minimal":
        return cn(baseStyles, "px-2");
      case "bordered":
        return cn(baseStyles, "px-6");
      default:
        return cn(baseStyles, "px-4");
    }
  };

  const getItemStyles = () => {
    switch (variant) {
      case "card":
        return "rounded-lg border border-border bg-surfaceElevated";
      case "minimal":
        return "";
      case "bordered":
        return "border-b border-border last:border-b-0";
      default:
        return "";
    }
  };

  return (
    <div className={cn("transition-all duration-300", getItemStyles(), className)}>
      {/* Header */}
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className={cn(getHeaderStyles(), headerClassName)}
        style={{ 
          background: variant === "default" ? "var(--color-surface)" : undefined 
        }}
      >
        <div className="flex items-center gap-3 flex-1 text-left">
          {showIcons && (
            <div className="flex-shrink-0">
              {faq.icon ? (
                <faq.icon className="h-5 w-5 text-primary" />
              ) : (
                <HelpCircle className="h-5 w-5 text-primary" />
              )}
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <h3
              className="text-base font-semibold truncate"
              style={{ color: "var(--color-text-high)" }}
            >
              {faq.question}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <ChevronDown
            className={cn(
              "h-5 w-5 transition-transform duration-300 flex-shrink-0",
              isOpen ? "rotate-180" : ""
            )}
            style={{ color: isOpen ? "var(--color-primary)" : "var(--color-text-low)" }}
          />
        </div>
      </button>

      {/* Content */}
      <div
        ref={contentRef}
        className={getContentStyles()}
        style={{
          maxHeight: isOpen && showAnswer ? `${contentHeight}px` : "0px",
          opacity: isOpen && showAnswer ? 1 : 0,
        }}
      >
        <ToggleBlock
          answer={faq.answer}
          isVisible={showAnswer}
          className={contentClassName}
        />
      </div>
    </div>
  );
};

export default AccordionItem;