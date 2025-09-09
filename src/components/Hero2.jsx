import React from "react";
import { CheckCircle } from "lucide-react";
import { global_classnames } from "../utils/classnames";

import bg from "./hero_bg.png";

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
      text: "53% skill gap in emerging technologies – Economic Times",
    },
    {
      icon: CheckCircle,
      text: "Boost employability with practical projects & industry-aligned skills",
    },
  ];

  return (
    <section
      className="py-12 bg-gradient-to-b from-background to-secondary/30 px-4 sm:px-6 lg:px-8 bg-cover bg-center"
      style={{
        backgroundColor: global_classnames.background?.secondary || "#f3f4f6",
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl  font-bold md:text-center text-primary mb-10">
          JNTU-GV State University is Offering Certification Courses - in
          Advanced Technologies
        </h2>

        {/* Content Flex */}
        <div className="flex flex-col lg:flex-row gap-10 ">
          {/* Left Certification Info */}

          <div className="flex-1 space-y-6 md:text-center lg:text-left">
            <h2
              className="text-2xl font-semibold"
              style={{ color: global_classnames.text.primary }}
            >
              Certification in Emerging Technologies
            </h2>

            <ul className="flex flex-col">
              {["AI", "ML", "IoT", "Cybersecurity", "QuantumComputing"].map(
                (tech, idx) => (
                  <li
                    className="border-l-2 border-amber-600 my-2 px-2 py-2 bg-[#004080] text-white font-bold rounded-r-4xl"
                    id={idx}
                  >
                    {tech}
                  </li>
                )
              )}
            </ul>
            <p
              className="text-base sm:text-lg"
              style={{ color: global_classnames.text.secondary }}
            >
              Get industry-recognized certification from JNTU-GV by completing
              real-world projects that boost your practical skills and
              employability.
            </p>
            {/* <p>
            Assessment Criteria
Project Development & Presentation – 30%
Final MCQ Exam – 30%
Assignments & Quizzes – 40%
           </p> */}
          </div>

          {/* Right Side Stats & Image */}
          <div className="flex-1 flex flex-col items-center space-y-8">
            {/* Image */}

            {/* Stats */}
            <div className="w-full  gap-6">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div
                    key={index}
                    className="flex items-center gap-4 my-2 bg-white rounded-xl p-4 shadow-md transition-shadow hover:shadow-lg"
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
      </div>
    </section>
  );
};

export default Hero2;
