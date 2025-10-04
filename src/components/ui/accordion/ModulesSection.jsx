// src/components/ModulesSection.jsx
import React, { useState, useRef } from "react";
import { ChevronDown, BookOpen, PlayCircle } from "lucide-react";

const ModulesSection = ({ modules = [] }) => {
  const [openAccordions, setOpenAccordions] = useState(
    modules.length > 0 ? [modules[0]?.id] : []
  );

  const toggleAccordion = (id) => {
    setOpenAccordions((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id) // close if already open
        : [...prev, id] // allow multiple open
    );
  };

  if (!modules || modules.length === 0) {
    return (
      <div className="text-center py-10 text-muted ">
        <p>📘 Course outline coming soon!</p>
      </div>
    );
  }

  return (
    <section id="modules" className="py-6 rounded-md">
      <div
        className="overflow-hidden  divide-y"
      >
        {modules.map((module) => {
          const isOpen = openAccordions.includes(module.id);
          const contentItems =
            module?.content ||
            module?.videos?.map((v) => v?.title || "Video") ||
            module?.lessons ||
            [];

          return <AccordionItem
            key={module.id}
            module={module}
            isOpen={isOpen}
            onToggle={() => toggleAccordion(module.id)}
            items={contentItems}
          />;
        })}
      </div>
    </section>
  );
};

const AccordionItem = ({ module, isOpen, onToggle, items }) => {
  const contentRef = useRef(null);

  return (
    <div className="transition-all duration-300 round-sm ">
      {/* Header */}
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex items-center justify-between w-full py-4  hover:bg-[var(--color-card-hover)] transition-colors"
        style={{ background: "var(--color-card)" }}
      >
        <div className="flex items-center gap-2">
          <h3
            className="text-lg font-semibold"
            style={{ color: "var(--color-text)" }}
          >
            {module.title}
          </h3>
        </div>

        <ChevronDown
          className={`h-5 w-5 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
          style={{ color: isOpen ? "var(--color-primary)" : "var(--color-muted)" }}
        />
      </button>

      {/* Content */}
      <div
        ref={contentRef}
        className="transition-all duration-500 ease-in-out overflow-hidden"
        style={{
          maxHeight: isOpen ? contentRef.current?.scrollHeight : 0,
         }}
      >
        {items.map((title, idx) => (
          <div
            key={idx}
            className="flex items-start gap-2 py-2.5  border-b last:border-b-0"
            style={{ borderColor: "var(--color-border)" }}
          >
             <h2 className="text-sm sm:text-base" style={{ color: "var(--color-text)" }}>
              {title}
            </h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModulesSection;
