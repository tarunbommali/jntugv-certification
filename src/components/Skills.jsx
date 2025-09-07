/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";
import { global_classnames } from "../utils/classnames";

const skillsData = [
  { category: "Artificial Intelligence", skills: ["Intelligent Systems", "Search Techniques", "NLP", "Chatbots"] },
  { category: "AI Tools", skills: ["OpenAI", "IBM Watson", "Google AI", "Microsoft Azure AI"] },
  { category: "Machine Learning & Deep Learning", skills: ["Classification", "Clustering", "Neural Networks", "CNN", "RNN", "LSTM"] },
  { category: "ML Tools", skills: ["TensorFlow", "Keras", "PyTorch", "Scikit-learn"] },
  { category: "Internet of Things (IoT)", skills: ["IoT Architecture", "Protocols", "Sensors", "Actuators", "Arduino", "Raspberry Pi", "MQTT"] },
  { category: "Quantum Computing", skills: ["Qubits", "Superposition", "Quantum Gates", "Grover’s Algorithm", "Shor’s Algorithm", "Qiskit", "IBM Q"] },
  { category: "Cybersecurity", skills: ["Cryptography", "Hashing", "Encryption", "Firewalls", "VPNs", "Wireshark", "Metasploit", "Burp Suite"] },
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const badgeVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
};

const Skills = () => {
  return (
    <section
      id="skills"
      className="py-16 lg:py-20"
      style={{ backgroundColor: global_classnames.background?.secondary || "#f3f4f6" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-12">
          <motion.h2
            className="text-3xl sm:text-4xl font-bold mb-4"
            style={{ color: global_classnames.heading.primary }}
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Skills & Technologies
          </motion.h2>
          <motion.p
            className="text-lg max-w-3xl mx-auto"
            style={{ color: global_classnames.text.secondary }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            A comprehensive set of skills covered during the 3-month certification program.
          </motion.p>
        </div>

        {/* Skills Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillsData.map((item, index) => (
            <motion.div
              key={index}
              className={`rounded-xl border shadow-md p-6 transition-shadow hover:shadow-lg border-[${global_classnames.container.border}]`}
             
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={cardVariants}
              transition={{ delay: index * 0.1, duration: 0.6 }}
            >
              <h3 className="text-xl font-semibold mb-4" style={{ color: global_classnames.heading.primary }}>
                {item.category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {item.skills.map((skill, idx) => (
                  <motion.span
                    key={idx}
                    className="px-3 py-1 rounded-full text-sm font-medium"
                    style={{
                      backgroundColor: global_classnames.button.secondary.bg,
                      color: global_classnames.button.secondary.text,
                    }}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={badgeVariants}
                    transition={{ delay: idx * 0.05, duration: 0.3 }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
