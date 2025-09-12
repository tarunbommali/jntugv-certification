import React from "react";
import { CheckCircle } from "lucide-react";
import bg from "./hero_bg.png";

const Hero2 = () => {
  const stats = [
    { text: "Industry-Recognized Certification from JNTU-GV" },
    { text: "Projected 2.5M+ new jobs globally in AI & Emerging Tech by 2027" },
    { text: "80% of enterprises expected to adopt AI-driven solutions by 2026" },
    { text: "53% skill gap in emerging technologies – Economic Times" },
    { text: "Boost employability with practical projects & industry-aligned skills" },
  ];

  return (
    <section
      className="py-4 md:py-16 bg-gradient-to-b from-gray-50 to-gray-100 relative"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-2xl md:text-3xl sm:text-left font-semibold md:text-center text-[#004080] mb-2 md:mb-12">
          JNTU-GV State University Certification Courses in Advanced Technologies
        </h1>

        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left Section: Tech List + Description */}
          <div className="flex-1 space-y-6  text-left md:text-center lg:text-left">
            <h2 className="text-lg md:text-xl font-semibold text-[#000000]">
              Certification in Emerging Technologies
            </h2>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {["Artificial Intelgence", "Machine Learning", "Internet of Things", "Cybersecurity", "Quantum Computing"].map((tech, idx) => (
                <li
                  key={idx}
                  className="bg-[#004080] text-white font-medium rounded-lg py-3 shadow-md text-center"
                >
                  {tech}
                </li>
              ))}
            </ul>

            <p className="text-lg text-gray-700">
              Earn industry-recognized certification from JNTU-GV by completing real-world projects. Boost your practical skills and job readiness in emerging tech domains.
            </p>
          </div>

          {/* Right Section: Stats Cards */}
          <div className="flex-1 grid gap-6 sm:grid-cols-1 ">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="flex items-start bg-white p-2 rounded-lg shadow hover:shadow-lg transition duration-300"
              >
                <div className="p-3 bg-[#004080] rounded-full">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <p className="ml-4 text-gray-800 font-medium text-sm sm:text-base">
                  {stat.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero2;
