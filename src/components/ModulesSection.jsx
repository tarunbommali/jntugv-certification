import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { global_classnames } from "../utils/classnames";
import { modules } from "../utils/constants";

const ModulesSection = () => {
  const [openAccordions, setOpenAccordions] = useState([modules[0].id]);

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center mb-10 sm:mb-12">
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4"
            style={{ color: global_classnames.heading.primary }}
          >
            Modules Covered
          </h2>
          <p
            className="text-base sm:text-lg max-w-3xl mx-auto"
            style={{ color: global_classnames.text.secondary }}
          >
            Comprehensive curriculum covering five essential domains of emerging technologies with hands-on practical experience and real-world applications.
          </p>
        </div>

        {/* Modules List */}
        <div className="grid grid-cols-1 gap-6 sm:gap-8">
          {modules.map((module) => {
            const IconComponent = module.icon;
            const isOpen = openAccordions.includes(module.id);

            return (
              <div
                key={module.id}
                className="rounded-xl border transition-shadow hover:shadow-lg shadow-md overflow-hidden"
                style={{
                  borderColor: global_classnames.container.border,
                }}
              >
                {/* Header */}
                <button
                  onClick={() => toggleAccordion(module.id)}
                  className="flex items-center justify-between w-full p-4 sm:p-6 bg-white cursor-pointer"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className="p-2 sm:p-3 rounded-full"
                      style={{
                        backgroundColor: global_classnames.button.primary.bg,
                      }}
                    >
                      <IconComponent className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                    </div>
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
                    maxHeight: isOpen
                      ? `${module.content.length * 3}rem`
                      : "0",
                  }}
                >
                  {module.content.map((item, index) => (
                    <div
                      key={index}
                      className={`flex items-start text-sm sm:text-base p-3 sm:p-4 w-full ${
                        index !== module.content.length - 1
                          ? `border-b`
                          : ""
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
