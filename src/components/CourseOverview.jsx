import { CheckCircle, Clock, Users, DollarSign } from "lucide-react";
import { global_classnames } from "../utils/classnames";

const CourseOverview = () => {
   

  return (
    <section
      id="overview"
      className="py-16 lg:py-20"
      style={{ backgroundColor: global_classnames.background.secondary }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2
            className="text-3xl sm:text-4xl font-bold mb-4"
            style={{ color: global_classnames.heading.primary }}
          >
            Course Overview
          </h2>
          <p
            className="text-lg text-center max-w-3xl mx-auto"
            style={{ color: global_classnames.text.secondary }}
          >
            Comprehensive certification program designed to equip professionals
            with expertise in the most demanding emerging technologies of the
            digital age.
          </p>
        </div>

         {/* About Program Section */}
        <div
          className="p-8 my-4 rounded-2xl border shadow-md bg-white"
          style={{ border: global_classnames.container.border }}
        >
          <h3
            className="text-2xl font-semibold mb-6"
            style={{ color: global_classnames.heading.primary }}
          >
            About the Program
          </h3>
          <div className="prose prose-lg max-w-none">
            <p
              style={{
                color: global_classnames.text.primary,
                lineHeight: "1.8",
              }}
            >
              The Certification in Emerging Technologies is a cutting-edge
              program offered by <strong>JAWAHARLAL NEHRU TECHNOLOGICAL UNIVERSITY - GURAJADA VIZIANAGARAM</strong>
, designed to bridge the
              gap between traditional education and industry requirements. This
              comprehensive course covers five critical domains that are shaping
              the future of technology.
            </p>
            <p
              style={{
                color: global_classnames.text.primary,
                lineHeight: "1.8",
                marginTop: "1rem",
              }}
            >
              Students will gain hands-on experience with Artificial
              Intelligence, Machine Learning algorithms, Internet of Things
              (IoT) systems, Cybersecurity protocols, and Quantum Computing
              principles. The program emphasizes practical implementation
              through real-world projects and case studies.
            </p>
            <p
              style={{
                color: global_classnames.text.primary,
                lineHeight: "1.8",
                marginTop: "1rem",
              }}
            >
              Upon completion, participants will receive an industry-recognized
              certification from JNTU-GV and will be equipped with the skills
              necessary to excel in high-demand technology roles across various
              industries.
            </p>
          </div>
        </div>

       
       
      </div>
    </section>
  );
};

export default CourseOverview;
