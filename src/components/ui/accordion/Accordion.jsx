/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import AccordionItem from "./AccordionItem.jsx";
import VideoPreviewItem from "./VideoPreviewItem.jsx";
import PageContainer from "../../layout/PageContainer.jsx";

// Utility function for conditional class names
const cn = (...classes) => classes.filter(Boolean).join(' ');

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
    defaultOpenFirst && modules.length > 0 ? [modules[0]?.id || modules[0]?.question] : []
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
    <div 
      className={cn("py-6 rounded-md ", className)}
      {...props}
    >
      <div className={cn("overflow-hidden", getVariantStyles())}>
        {modules.map((module, moduleIndex) => {
          const moduleId = module.id || module.question || moduleIndex;
          const isOpen = openAccordions.includes(moduleId);
          
          // Transform data based on accordion type
          let contentItems = [];
          if (accordionType === "faq") {
            contentItems = [module.answer || module.content];
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

          // Return the appropriate component based on accordion type
          return accordionType === "faq" ? (
            <AccordionItem
              key={moduleId}
              faq={module}
              index={moduleIndex}
              isOpen={isOpen}
              onToggle={() => toggleAccordion(moduleId)}
              variant={variant}
              showIcons={showIcons}
              className={itemClassName}
              headerClassName={headerClassName}
              contentClassName={contentClassName}
            />
          ) : (
            <VideoPreviewItem
              key={moduleId}
              module={module}
              index={moduleIndex}
              isOpen={isOpen}
              onToggle={() => toggleAccordion(moduleId)}
              items={contentItems}
              variant={variant}
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
    </div>
  );
};

export default Accordion;