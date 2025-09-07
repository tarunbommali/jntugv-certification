import React from "react";
import { global_classnames } from "../utils/classnames";
import { capstoneProjects } from "../utils/constants";


const CapstoneSection = () => {
  return (
    <section
      id="capstone"
      className="py-16 lg:py-20"
      style={{
        backgroundColor: global_classnames.background?.secondary || "#f3f4f6",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center mb-12">
          <h2
            className="text-3xl sm:text-4xl font-bold mb-4"
            style={{ color: global_classnames.heading.primary }}
          >
            Capstone Projects
          </h2>
          <p
            className="text-lg max-w-3xl mx-auto"
            style={{ color: global_classnames.text.secondary }}
          >
            Students will work in interdisciplinary teams to develop innovative
            real-world applications integrating AI, ML, IoT, Cybersecurity, and
            Quantum Computing.
          </p>
        </div>

        {/* Grid of Capstone Projects */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {capstoneProjects.map((project, index) => (
            <div
              key={index}
              className="rounded-xl border bg-white shadow-md overflow-hidden transition-shadow hover:shadow-xl"
              style={{ borderColor: global_classnames.container.border }}
            >
              {/* Placeholder Image with Hover Effect */}
              <div className="overflow-hidden">
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-48 object-cover transform transition-transform duration-500 hover:scale-110"
                />
              </div>

              {/* Project Details */}
              <div className="p-6">
                <h3
                  className="text-xl font-semibold mb-2"
                  style={{ color: global_classnames.text.primary }}
                >
                  {project.title}
                </h3>
                <p
                  className="text-sm"
                  style={{ color: global_classnames.text.primary }}
                >
                  {project.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Assessment Criteria */}
        <div className="mt-10">
          <h4
            className="text-2xl font-semibold mb-4"
            style={{ color: global_classnames.text.primary }}
          >
            Assessment Criteria
          </h4>
          <ul
            className="list-disc list-inside text-base space-y-2"
            style={{ color: global_classnames.text.primary }}
          >
            <li>Project Development & Presentation – 30%</li>
            <li>Final MCQ Exam – 30%</li>
            <li>Assignments & Quizzes – 40%</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default CapstoneSection;
