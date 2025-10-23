/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";
import { Code, Cpu, Shield, Cloud, Brain, Network, Key } from "lucide-react";
import { global_classnames } from "../../utils/classnames";

const skillsData = [
  { 
    category: "Artificial Intelligence", 
    skills: ["Intelligent Systems", "Search Techniques", "NLP", "Chatbots"],
    icon: Brain,
    gradient: "from-purple-500 to-pink-500"
  },
  { 
    category: "AI Tools", 
    skills: ["OpenAI", "IBM Watson", "Google AI", "Microsoft Azure AI"],
    icon: Cpu,
    gradient: "from-blue-500 to-cyan-500"
  },
  { 
    category: "Machine Learning & Deep Learning", 
    skills: ["Classification", "Clustering", "Neural Networks", "CNN", "RNN", "LSTM"],
    icon: Brain,
    gradient: "from-green-500 to-emerald-500"
  },
  { 
    category: "ML Tools", 
    skills: ["TensorFlow", "Keras", "PyTorch", "Scikit-learn"],
    icon: Code,
    gradient: "from-orange-500 to-red-500"
  },
  { 
    category: "Internet of Things (IoT)", 
    skills: ["IoT Architecture", "Protocols", "Sensors", "Actuators", "Arduino", "Raspberry Pi", "MQTT"],
    icon: Network,
    gradient: "from-indigo-500 to-purple-500"
  },
  { 
    category: "Quantum Computing", 
    skills: ["Qubits", "Superposition", "Quantum Gates", "Grover's Algorithm", "Shor's Algorithm", "Qiskit", "IBM Q"],
    icon: Cloud,
    gradient: "from-violet-500 to-purple-500"
  },
  { 
    category: "Cybersecurity", 
    skills: ["Cryptography", "Hashing", "Encryption", "Firewalls", "VPNs", "Wireshark", "Metasploit", "Burp Suite"],
    icon: Shield,
    gradient: "from-red-500 to-pink-500"
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
};

const badgeVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 200
    }
  }
};

const Skills = () => {
  return (
    <section id="skills" className="py-20 lg:py-28 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/5" />
      <div className="absolute top-10 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      
      <div className={`${global_classnames.width.container} mx-auto px-4 relative z-10`}>
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4"
          >
            <Key className="h-4 w-4" />
            <span className="text-sm font-medium">Technologies</span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text  mb-4">
            Skills & Technologies
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Master the most in-demand technologies through our comprehensive certification programs
          </p>
        </motion.div>

        {/* Skills Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {skillsData.map((item, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ 
                y: -8,
                scale: 1.02,
                transition: { type: "spring", stiffness: 300 }
              }}
              className="group relative"
            >
              {/* Gradient Border Effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-primary/30 rounded-2xl opacity-0 group-hover:opacity-100 blur transition duration-300" />
              
              <div className="relative bg-gradient-to-br from-background to-muted/50 rounded-2xl border border-border/50 p-6 shadow-lg hover:shadow-2xl transition-all duration-300 h-full">
                {/* Icon */}
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${item.gradient} text-white mb-4`}>
                  <item.icon className="h-6 w-6" />
                </div>

                {/* Category Title */}
                <h3 className="text-xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                  {item.category}
                </h3>

                {/* Skills Badges */}
                <motion.div 
                  className="flex flex-wrap gap-2"
                  layout
                >
                  {item.skills.map((skill, idx) => (
                    <motion.span
                      key={idx}
                      variants={badgeVariants}
                      whileHover={{ scale: 1.05 }}
                      className="px-3 py-1.5 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-white transition-all duration-300 cursor-default"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>

     
      </div>
    </section>
  );
};

export default Skills;