import React from "react";
import { global_classnames } from "../../utils/classnames";
import { capstoneProjects } from "../../utils/constants";
import InfiniteMovingCards from "../ui/InfiniteMovingCards";
import bg from './vector_white_bg.png'



const CapstoneSection = () => {
  return (
    <section
      id="capstone"
      className="py-16 lg:py-20"
      style={{
        // backgroundColor: global_classnames.background?.secondary || "#f3f4f6",
        backgroundImage: `url(${bg})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
      }}
    >
      <div className="max-w-7xl md:mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="md:text-center mb-12">
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

        {/* Infinite Moving Cards */}
        <InfiniteMovingCards
          items={capstoneProjects}
          direction="left"
          speed="normal"
          pauseOnHover={false}
          className="my-10"
        />
 
      </div>
    </section>
  );
};

export default CapstoneSection;
