import { CheckCircle, Clock, Users, DollarSign } from "lucide-react";
import { global_classnames } from "../utils/classnames";
import bg from "./image.png";

const About = () => {
  return (
    <section
      id="about"
      className="py-12 lg:py-20"
      style={{
              backgroundColor: global_classnames.background?.secondary || "#f3f4f6",
              backgroundImage: `url(${bg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
     >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-10">
          <h2
            className="text-3xl sm:text-4xl font-bold mb-4"
            style={{ color: global_classnames.heading.primary }}
          >
            About
          </h2>
          <p
            className="text-lg max-w-3xl mx-auto"
            style={{ color: global_classnames.text.secondary }}
          >
            Comprehensive certification program designed to equip professionals
            with expertise in the most demanding emerging technologies of the
            digital age.
          </p>
        </div>

        {/* About Program Card */}
        <div
  className="p-6 sm:p-8 my-4 rounded-2xl border shadow-md"
  style={{
    border: global_classnames.container.border,
    backgroundColor: "rgba(255, 255, 255, 0.8)", // Semi-transparent white
    backdropFilter: "blur(10px)", // Soft blur effect for better contrast
  }}
>


          <div className="space-y-6 prose prose-lg max-w-none text-gray-700">
            <p>
              The <strong>Certification in Emerging Technologies</strong> is an advanced, industry-focused program offered by{" "}
              <strong>Jawaharlal Nehru Technological University – Gurajada Vizianagaram (JNTU-GV)</strong>.
              It equips learners with practical skills in AI, ML, IoT, Cybersecurity, and Quantum Computing.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
                <span><strong>Artificial Intelligence & Tools:</strong> Hands-on experience using TensorFlow & PyTorch.</span>
              </div>

              <div className="flex items-start space-x-3">
                <Clock className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
                <span><strong>Machine Learning & Deep Learning:</strong> Build predictive models with real datasets.</span>
              </div>

              <div className="flex items-start space-x-3">
                <Users className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
                <span><strong>Internet of Things (IoT):</strong> Design smart solutions with Arduino & Raspberry Pi.</span>
              </div>

              <div className="flex items-start space-x-3">
                <DollarSign className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
                <span><strong>Cybersecurity & Quantum Computing:</strong> Ethical hacking, network security, and quantum principles using IBM Quantum Experience.</span>
              </div>
            </div>

            <p>
              🎯 <strong>Why Choose This Program?</strong><br />
              - Hands-on projects.<br />
              - Lifetime access and continuous updates.<br />
              - Private community for peer support.<br />
              - Industry-recognized certification.
            </p>

            <p>
              🌟 Get job-ready skills and confidence to apply emerging technologies for real-world solutions in a fast-evolving tech industry.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
