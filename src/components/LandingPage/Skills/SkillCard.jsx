/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";
import {
  cardVariants,
  badgeVariants,
} from "../../../data/landingPage/animationVariants.js";

const SkillCard = ({ item, index, IconComponent }) => {
  return (
    <motion.div
      key={index}
      variants={cardVariants}
      whileHover={{
        y: -8,
        scale: 1.02,
        transition: { type: "spring", stiffness: 300 },
      }}
      className="group relative"
    >
      {/* Gradient Border Effect */}
      <div className="absolute -inset-0.5  bg-gradient-to-r from-primary to-primary/30 rounded-2xl opacity-0 group-hover:opacity-100 blur transition duration-300" />

      <div className="relative bg-gradient-to-br from-background to-muted/50 rounded-2xl border border-border/50 p-6  transition-all duration-300 h-full">
        {/* Icon */}
        <div
          className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${item.gradient} text-white mb-4`}
        >
          <IconComponent className="h-6 w-6" />
        </div>

        {/* Category Title */}
        <h3 className="text-xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
          {item.category}
        </h3>

        {/* Skills Badges */}
        <motion.div className="flex flex-wrap gap-2" layout>
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
  );
};

export default SkillCard;
