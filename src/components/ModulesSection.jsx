import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { global_classnames } from "../utils/classnames";

const ModulesSection = ({ modules }) => {
  const [openAccordions, setOpenAccordions] = useState(
    modules.length > 0 ? [modules[0].id] : []
  );

  const toggleAccordion = (id) => {
    setOpenAccordions((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <section
      id="modules"
      className="py-12 sm:py-16 lg:py-20"
      style={{
        backgroundColor: global_classnames.background?.secondary || "#f3f4f6",
      }}
    >
      <div className="max-w-7xl md:mx-auto px-4  lg:px-8">
        {/* Section Heading */}
        <div className="mb-8">
          <h2
            className="text-lg md:text-2xl font-semibold"
            style={{ color: global_classnames.heading.primary }}
          >
            Modules 
          </h2>
        </div>

        {/* Modules List */}
        <div className="grid grid-cols-1">
          {modules.map((module, index) => {
            const isOpen = openAccordions.includes(module.id);

            const borderRadiusClasses =
              index === 0
                ? "rounded-t-lg"
                : index === modules.length - 1
                ? "rounded-b-lg"
                : "";

            return (
              <div
                key={module.id}
                className={`border transition-shadow hover:shadow-lg shadow-md overflow-hidden ${borderRadiusClasses}`}
                style={{
                  borderColor: global_classnames.container.border,
                }}
              >
                {/* Header */}
                <button
                  onClick={() => toggleAccordion(module.id)}
                  className="flex items-center justify-between w-full p-4 sm:p-6 bg-white cursor-pointer"
                >
                  <div className="text-left">
                    <h3 className="text-lg sm:text-xl font-semibold text-[#132639]">
                      {module.title}
                    </h3>
                    <p
                      className="text-xs sm:text-sm"
                      style={{ color: global_classnames.text.muted }}
                    >
                      {module.description}
                    </p>
                  </div>

                  <ChevronDown
                    className={`h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                    style={{ color: global_classnames.heading.primary }}
                  />
                </button>

                {/* Accordion Content */}
                <div
                  className={`transition-max-height duration-500 ease-in-out overflow-hidden`}
                  style={{
                    maxHeight: isOpen ? `${module.content.length * 3}rem` : "0",
                  }}
                >
                  {module.content.map((item, idx) => (
                    <div
                      key={idx}
                      className={`flex items-start text-sm sm:text-base p-3 sm:p-4 w-full ${
                        idx !== module.content.length - 1 ? `border-b` : ""
                      }`}
                      style={{
                        borderColor: global_classnames.container.border,
                      }}
                    >
                      <p className="px-4 sm:px-6">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ModulesSection;
