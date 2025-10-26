/* eslint-disable no-unused-vars */
import PageContainer from "../../layout/PageContainer.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/Card.jsx";
import {
  GraduationCap,
  Users,
  Award,
  Globe,
  Target,
  Rocket,
  Star,
} from "lucide-react";
import { motion } from "framer-motion";
import { features } from "../../../data/landingPage/features.js";
import { stats } from "../../../data/landingPage/stats.js";
import {
  containerVariants,
  itemVariants,
  floatVariants,
} from "../../../data/landingPage/animationVariants.js";
import AnimatedSectionHeader from "../ui/AnimatedSectionHeader.jsx";
import StatsCard from "./StatsCard.jsx";
import Statement from "./Statement.jsx";

const About = () => {
  const iconComponents = {
    GraduationCap,
    Users,
    Award,
    Globe,
    Target,
    Rocket,
    Star,
  };

  return (
    <section className="py-20 px-2 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 " />
      <motion.div
        animate={{
          rotate: 360,
          scale: [1, 1.2, 1],
        }}
        transition={{
          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
          scale: { duration: 8, repeat: Infinity },
        }}
        className="absolute top-10 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          rotate: -360,
          scale: [1.2, 1, 1.2],
        }}
        transition={{
          rotate: { duration: 25, repeat: Infinity, ease: "linear" },
          scale: { duration: 10, repeat: Infinity },
        }}
        className="absolute bottom-10 -right-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl"
      />

      <PageContainer>
        <AnimatedSectionHeader
          badge={{
            icon: Target,
            text: "About Us",
          }}
          title="Empowering the Next Generation of Tech Professionals"
          description="JNTU-GV Certification Platform is designed to bridge the gap between academic learning and industry requirements, providing students with practical skills and recognized credentials for successful careers in technology."
        />

        {/* Stats Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16 relative z-10"
        >
          {stats.map((stat, index) => (
            <StatsCard
              key={index}
              stat={stat}
              IconComponent={iconComponents[stat.icon]}
              itemsvariant={itemVariants}
              floatVariants={floatVariants}
            />
          ))}
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 relative z-10"
        >
          {features.map((feature, index) => {
            const IconComponent = iconComponents[feature.icon];
            return (
              <motion.div
                key={index}
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
                  className={`absolute -inset-0.5 bg-gradient-to-r ${feature.gradient} rounded-2xl opacity-0 group-hover:opacity-100 blur transition duration-300`}
                />

                <Card className="relative bg-gradient-to-br from-background to-muted/50 rounded-2xl border border-border/50 p-6 shadow-lg hover:shadow-2xl transition-all duration-300 h-full text-center group-hover:border-primary/30">
                  <CardHeader className="p-0 mb-4">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className={`mx-auto w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-4 text-white shadow-lg`}
                    >
                      <IconComponent className="h-6 w-6" />
                    </motion.div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors duration-300">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <p className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Mission Section */}
        <Statement />
      </PageContainer>
    </section>
  );
};

export default About;
