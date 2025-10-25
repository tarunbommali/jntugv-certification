/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { itemVariants } from "./LandingPageConstants";

const GradientContactCard = ({ info, IconComponent }) => {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{
        y: -8,
        scale: 1.02,
        transition: { type: "spring", stiffness: 300 },
      }}
      className="group relative"
    >
      {/* Gradient Border Effect */}
      <div
        className={`absolute -inset-0.5 bg-gradient-to-r ${info.gradient} rounded-2xl opacity-0 group-hover:opacity-100 blur transition duration-300`}
      />

      <Card className="relative bg-gradient-to-br from-background to-muted/50 rounded-2xl border border-border/50 p-6 shadow-lg hover:shadow-2xl transition-all duration-300 h-full text-center group-hover:border-primary/30">
        <CardHeader className="p-0 mb-4">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className={`mx-auto w-16 h-16 bg-gradient-to-r ${info.gradient} rounded-2xl flex items-center justify-center mb-4 text-white shadow-lg`}
          >
            <IconComponent className="h-6 w-6" />
          </motion.div>
          <CardTitle className="text-lg group-hover:text-primary transition-colors duration-300">
            {info.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <p className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors duration-300">
            {info.details}
          </p>
          <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
            {info.description}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default GradientContactCard;