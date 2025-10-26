/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { Code, Cpu, Shield, Cloud, Brain, Network, Key } from "lucide-react";
import { skillsData } from "../../../data/landingPage/skillData.js";
import { containerVariants } from "../../../data/landingPage/animationVariants.js";

import PageContainer from "../../layout/PageContainer.jsx";
import AnimatedSectionHeader from "../ui/AnimatedSectionHeader.jsx";
import SkillCard from "./SkillCard.jsx";
const Skills = () => {
  const iconComponents = {
    Code,
    Cpu,
    Shield,
    Cloud,
    Brain,
    Network,
    Key,
  };

  return (
    <PageContainer className="px-2 py-20 mx-auto relative overflow-x-hidden">
      {/* Heading */}
      <AnimatedSectionHeader
        badge={{
          icon: Key,
          text: "Technologies",
        }}
        title="Skills & Technologies"
        description="Master the most in-demand technologies through our comprehensive certification programs"
      />

      {/* Skills Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-hidden p-8"
      >
        {skillsData.map((item, index) => {
          const IconComponent = iconComponents[item.icon];
          return (
            <SkillCard
              key={index}
              item={item}
              index={index}
              IconComponent={IconComponent}
            />
          );
        })}
      </motion.div>
    </PageContainer>
  );
};

export default Skills;
