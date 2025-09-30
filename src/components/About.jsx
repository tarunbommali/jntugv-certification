import React from "react";
// Replaced CheckCircle, Clock, Users, DollarSign with more specific Lucide icons
import { Award, Code, Globe, Zap, Shield, GitBranch, Users } from "lucide-react"; 
import { global_classnames } from "../utils/classnames";
 
const techFeatures = [
  { 
    title: "Artificial Intelligence & Tools:", 
    description: "Hands-on experience using TensorFlow & PyTorch.", 
    icon: Code,
  },
  { 
    title: "Machine Learning & Deep Learning:", 
    description: "Build predictive models with real datasets.", 
    icon: GitBranch,
  },
  { 
    title: "Internet of Things (IoT):", 
    description: "Design smart solutions with Arduino & Raspberry Pi.", 
    icon: Globe,
  },
  { 
    title: "Cybersecurity & Quantum Computing:", 
    description: "Ethical hacking, network security, and quantum principles.", 
    icon: Shield,
  },
];

// Icons for the 'Why Choose Us?' highlights
const programHighlights = [
    { text: "Hands-on, Real-world Projects", icon: Code, color: "text-red-500" },
    { text: "Continuous Updates & Lifetime Access", icon: Zap, color: "text-green-500" },
    { text: "Private Community for Peer Support", icon: Users, color: "text-purple-500" },
    { text: "University-Recognized Certification", icon: Award, color: "text-yellow-500" },
];


const About = () => {
  return (
    <section
      id="about"
      className="py-16 lg:py-24 bg-white"
      style={{
          backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className={`${global_classnames.width.container}  mx-auto px-4 sm:px-6 lg:px-8 `}>
        
        {/* Heading */}
        <div className="text-center mb-16">
          <h2
            className="text-4xl sm:text-5xl font-bold mb-4 text-white "
            style={{ 
                color: global_classnames.heading?.primary || '#004080',
             }}
          >
            About Our Certification Program
          </h2>
          <p
            className="text-xl max-w-4xl mx-auto font-medium text-white "
            style={{ 
                color: global_classnames.text?.secondary || '#e5e7eb',
             }}
          >
            A comprehensive, industry-focused program designed to equip professionals with expertise in the most demanding emerging technologies of the digital age.
          </p>
        </div>

        {/* Program Details Card - Uses Glassmorphism effect */}
        <div
          className="p-8 sm:p-10 border border-[#d1d9e0] rounded-2xl     relative z-10" // Increased padding and shadow
          style={{
             backdropFilter: "blur(20px)", // Stronger blur effect
          }}
        >
          <div className="space-y-10">
            {/* 1. Introduction & University Branding */}
            <p className="text-xl leading-relaxed text-gray-800">
              The <strong>Certification in Emerging Technologies</strong> is an
              advanced, industry-focused program offered by{" "}
              <strong className="text-blue-700">
                Jawaharlal Nehru Technological University – Gurajada
                Vizianagaram (JNTU-GV)
              </strong>
              . It equips learners with practical skills in AI, ML, IoT,
              Cybersecurity, and Quantum Computing.
            </p>

            <div className="h-px bg-gray-200" /> {/* Divider */}

            {/* 2. Key Technology Coverage (Icon Grid) */}
            <h3 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-3">
                In-Depth Technical Modules
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {techFeatures.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                    <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition">
                      <IconComponent className="w-7 h-7 text-blue-600 flex-shrink-0 mt-1" />
                      <div>
                        <strong className="text-lg text-gray-900">{feature.title}</strong>
                        <p className="text-gray-600 mt-0.5">{feature.description}</p>
                      </div>
                    </div>
                );
              })}
            </div>
            
            <div className="h-px bg-gray-200" /> {/* Divider */}

            {/* 3. Program Highlights (Why Choose This?) */}
            <h3 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-3">
                <Award className="w-7 h-7 text-yellow-500" />
                Why Choose This Program?
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {programHighlights.map((item, index) => {
                    const IconComponent = item.icon;
                    return (
                        <div key={index} className="flex flex-col items-center text-center p-4 bg-white border border-gray-100 rounded-xl shadow-lg">
                            <IconComponent className={`w-8 h-8 ${item.color} mb-3`} />
                            <p className="font-semibold text-gray-800">{item.text}</p>
                        </div>
                    );
                })}
            </div>
            
            {/* 4. Final CTA/Summary */}
            <p className="text-xl text-gray-800 pt-4 border-t border-dashed border-gray-300">
              🌟 Get job-ready skills and confidence to apply emerging
              technologies for real-world solutions in a fast-evolving tech
              industry.
            </p>

          </div>
        </div>
      </div>
    </section>
  );
};

export default About;