import React from "react";
import { CheckCircle } from "lucide-react";
import { global_classnames } from "../utils/classnames";

const Hero2 = () => {
  const stats = [
    {
      icon: CheckCircle,
      text: "Industry-Recognized Certification from JNTU-GV",
    },
    {
      icon: CheckCircle,
      text: "Projected 2.5M+ new jobs globally in AI & Emerging Tech by 2027",
    },
    {
      icon: CheckCircle,
      text: "80% of enterprises expected to adopt AI-driven solutions by 2026",
    },
    {
      icon: CheckCircle,
      text: "53% skill gap in emerging technologies across industries – Economic Times",
    },
    
    {
      icon: CheckCircle,
      text: "Boost your employability and industry readiness with specialized skills",
    },
  ];

  return (
    <section
      className="min-h-screen flex items-center"
      style={{
        backgroundColor: global_classnames.background?.secondary || "#f3f4f6",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col  items-center gap-12">
        {/* Left Content */}
        <h1
          className="text-lg sm:text-lg lg:text-4xl font-bold leading-tight"
          style={{ color: global_classnames.heading.primary }}
        >
          Future Proof Your Career with Emerging Technology Skills
        </h1>
        <div className="flex ">
          <div className="flex-1 text-center lg:text-left space-y-6">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTK5qQv44ws3iBmTRDq_meeSMG3CQLQYcPtQS9WFXafpH6pqKnvuLGWdJq_i3xOAmTsKS0&usqp=CAU"
              alt="Certification"
              className="rounded-xl shadow-lg mt-6 mx-auto lg:mx-0"
            />
            <p
              className="text-lg sm:text-xl max-w-xl mx-auto lg:mx-0"
              style={{ color: global_classnames.text.secondary }}
            >
              Enroll in  <span className="text-black">Jawaharlal Nehru Technological University - Gurajada Vizianagaram</span> Certification in Emerging Technologies and
              gain expertise in AI, ML, IoT, Cybersecurity, and Quantum
              Computing with real-world projects.
            </p>
            <button
              className="px-6 py-3 rounded-md font-medium transition-all"
              style={{
                backgroundColor: global_classnames.button.primary.bg,
                color: global_classnames.button.primary.text,
              }}
            >
              View Full Curriculum
            </button>
          </div>

          {/* Right Stats */}
          <div className="flex-1 space-y-4">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div
                  key={index}
                  className="flex items-center gap-4 bg-card rounded-xl p-4 shadow-md transition-shadow hover:shadow-lg"
                  style={{ borderColor: global_classnames.card.card_border }}
                >
                  <div
                    className="p-2 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor: global_classnames.button.primary.bg,
                    }}
                  >
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <p
                    className="text-sm sm:text-base"
                    style={{ color: global_classnames.text.primary }}
                  >
                    {stat.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero2;
