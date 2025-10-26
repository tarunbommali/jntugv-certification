/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, BookOpen, PlayCircle, Clock, CheckCircle } from "lucide-react";

// Utility function for conditional class names
const cn = (...classes) => classes.filter(Boolean).join(' ');

const VideoPreviewItem = ({ 
  module, 
  index,
  isOpen, 
  onToggle, 
  items = [],
  variant = "default",
  showIcons = true,
  showDuration = false,
  showProgress = false,
  className = "",
  headerClassName = "",
  contentClassName = "",
  onItemClick 
}) => {
  const contentRef = useRef(null);
  const [contentHeight, setContentHeight] = useState(0);

  // Calculate content height when module opens or items change
  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [items, isOpen]);

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

  const getModuleProgress = () => {
    if (!showProgress || !items.length) return 0;
    const completed = items.filter(item => item.completed).length;
    return (completed / items.length) * 100;
  };

  const progress = getModuleProgress();

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
              {module.icon ? (
                <module.icon className="h-5 w-5 text-primary" />
              ) : (
                <BookOpen className="h-5 w-5 text-primary" />
              )}
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <h3
              className="text-lg font-semibold truncate"
              style={{ color: "var(--color-text-high)" }}
            >
              {module.title}
            </h3>
            
            {(module.description || showDuration || showProgress) && (
              <div className="flex items-center gap-4 mt-1">
                {module.description && (
                  <p 
                    className="text-sm truncate"
                    style={{ color: "var(--color-text-low)" }}
                  >
                    {module.description}
                  </p>
                )}
                
                {showDuration && module.duration && (
                  <div className="flex items-center gap-1 text-xs" style={{ color: "var(--color-text-low)" }}>
                    <Clock className="h-3 w-3" />
                    <span>{module.duration}</span>
                  </div>
                )}
                
                {showProgress && (
                  <div className="flex items-center gap-1 text-xs" style={{ color: "var(--color-text-low)" }}>
                    <span>{Math.round(progress)}% complete</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          {showProgress && progress === 100 && (
            <CheckCircle className="h-5 w-5 text-success" />
          )}
          
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
          maxHeight: isOpen ? `${contentHeight}px` : "0px",
          opacity: isOpen ? 1 : 0,
        }}
      >
        <div className={cn("py-4 space-y-2", contentClassName)}>
          {items.map((item, itemIndex) => (
            <div
              key={itemIndex}
              onClick={() => onItemClick?.(module, item, itemIndex)}
              className={cn(
                "flex items-center gap-3 py-2 px-3 rounded-md transition-colors cursor-pointer",
                "hover:bg-hover border border-transparent hover:border-border"
              )}
              style={{ 
                borderColor: item.completed ? "var(--color-success)" : undefined,
                background: item.completed ? "var(--color-success)/10" : undefined
              }}
            >
              {showIcons && (
                <div className="flex-shrink-0">
                  {item.type === "video" ? (
                    <PlayCircle className="h-4 w-4 text-primary" />
                  ) : (
                    <BookOpen className="h-4 w-4 text-primary" />
                  )}
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <h4 
                  className="text-sm font-medium truncate"
                  style={{ color: "var(--color-text-medium)" }}
                >
                  {item.title}
                </h4>
                
                {showDuration && item.duration && (
                  <p 
                    className="text-xs mt-1"
                    style={{ color: "var(--color-text-low)" }}
                  >
                    {item.duration}
                  </p>
                )}
              </div>
              
              {showProgress && (
                <div className="flex-shrink-0">
                  {item.completed ? (
                    <CheckCircle className="h-4 w-4 text-success" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border-2 border-border" />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoPreviewItem;