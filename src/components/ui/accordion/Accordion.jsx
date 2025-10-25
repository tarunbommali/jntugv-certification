/* eslint-disable no-unused-vars */
import React, { useState, useRef } from "react";
import { ChevronDown, BookOpen, PlayCircle, Clock, CheckCircle, HelpCircle } from "lucide-react";

const Accordion = ({ 
  modules = [], 
  type = "single", 
  variant = "default",
  accordionType = "modules", // "modules" | "faq" | "preview"
  showIcons = true,
  showDuration = false,
  showProgress = false,
  defaultOpenFirst = true,
  className = "",
  itemClassName = "",
  headerClassName = "",
  contentClassName = "",
  onItemClick,
  ...props 
}) => {
  const [openAccordions, setOpenAccordions] = useState(
    defaultOpenFirst && modules.length > 0 ? [modules[0]?.id] : []
  );

  const toggleAccordion = (id) => {
    if (type === "single") {
      setOpenAccordions(prev => prev.includes(id) ? [] : [id]);
    } else {
      setOpenAccordions(prev =>
        prev.includes(id)
          ? prev.filter(item => item !== id)
          : [...prev, id]
      );
    }
  };

  const handleItemClick = (module, item, itemIndex) => {
    if (onItemClick) {
      onItemClick(module, item, itemIndex);
    }
  };

  if (!modules || modules.length === 0) {
    return (
      <div className="text-center py-10 text-muted">
        <p>📘 {accordionType === "faq" ? "FAQs coming soon!" : "Course outline coming soon!"}</p>
      </div>
    );
  }

  const getVariantStyles = () => {
    switch (variant) {
      case "minimal":
        return "divide-y divide-border";
      case "card":
        return "space-y-4";
      case "bordered":
        return "border border-border rounded-lg divide-y divide-border";
      default:
        return "divide-y divide-border";
    }
  };

  return (
    <section 
      id={accordionType === "faq" ? "faq" : "modules"} 
      className={cn("py-6 rounded-md", className)}
      {...props}
    >
      <div className={cn("overflow-hidden", getVariantStyles())}>
        {modules.map((module, moduleIndex) => {
          const isOpen = openAccordions.includes(module.id);
          
          // Transform data based on accordion type
          let contentItems = [];
          if (accordionType === "faq") {
            contentItems = [module.answer || module.content]; // For FAQ, answer is the content
          } else {
            contentItems =
              module?.content ||
              module?.videos?.map(v => ({
                title: v?.title || "Video",
                duration: v?.duration,
                type: "video",
                completed: v?.completed
              })) ||
              module?.lessons?.map(lesson => ({
                title: lesson?.title || "Lesson",
                duration: lesson?.duration,
                type: "lesson",
                completed: lesson?.completed
              })) ||
              [];
          }

          return (
            <AccordionItem
              key={module.id}
              module={module}
              moduleIndex={moduleIndex}
              isOpen={isOpen}
              onToggle={() => toggleAccordion(module.id)}
              items={contentItems}
              variant={variant}
              accordionType={accordionType}
              showIcons={showIcons}
              showDuration={showDuration}
              showProgress={showProgress}
              className={itemClassName}
              headerClassName={headerClassName}
              contentClassName={contentClassName}
              onItemClick={handleItemClick}
            />
          );
        })}
      </div>
    </section>
  );
};

const AccordionItem = ({ 
  module, 
  moduleIndex,
  isOpen, 
  onToggle, 
  items = [],
  variant = "default",
  accordionType = "modules",
  showIcons = true,
  showDuration = false,
  showProgress = false,
  className = "",
  headerClassName = "",
  contentClassName = "",
  onItemClick 
}) => {
  const contentRef = useRef(null);

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
    const baseStyles = "transition-all duration-500 ease-in-out overflow-hidden";
    
    switch (variant) {
      case "card":
        return cn(baseStyles, "px-6 pb-4");
      case "minimal":
        return cn(baseStyles, "px-2 pb-2");
      case "bordered":
        return cn(baseStyles, "px-6 pb-4");
      default:
        return cn(baseStyles, "px-4 pb-3");
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
    if (!showProgress || !items.length || accordionType === "faq") return 0;
    const completed = items.filter(item => item.completed).length;
    return (completed / items.length) * 100;
  };

  const progress = getModuleProgress();

  const getDefaultIcon = () => {
    switch (accordionType) {
      case "faq":
        return HelpCircle;
      case "preview":
        return PlayCircle;
      default:
        return BookOpen;
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
              {module.icon ? (
                <module.icon className="h-5 w-5 text-primary" />
              ) : (
                <getDefaultIcon className="h-5 w-5 text-primary" />
              )}
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <h3
              className={cn(
                "font-semibold truncate",
                accordionType === "faq" ? "text-base" : "text-lg"
              )}
              style={{ color: "var(--color-text-high)" }}
            >
              {accordionType === "faq" ? module.question : module.title}
            </h3>
            
            {(module.description || showDuration || showProgress) && accordionType !== "faq" && (
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
          {showProgress && progress === 100 && accordionType !== "faq" && (
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
          maxHeight: isOpen ? contentRef.current?.scrollHeight : 0,
        }}
      >
        {accordionType === "faq" ? (
          // FAQ Content (Single answer)
          <div className={cn("space-y-2", contentClassName)}>
            <div className="py-2 px-3">
              <p 
                className="text-sm leading-relaxed"
                style={{ color: "var(--color-text-medium)" }}
              >
                {items[0]} {/* FAQ answer */}
              </p>
            </div>
          </div>
        ) : (
          // Modules/Preview Content (Multiple items)
          <div className={cn("space-y-2", contentClassName)}>
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
        )}
      </div>
    </div>
  );
};

// Utility function for conditional class names
const cn = (...classes) => classes.filter(Boolean).join(' ');

export default Accordion;