/* eslint-disable no-unused-vars */
import React from "react";
import PageContainer from "../layout/PageContainer";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import Badge from "../ui/Badge";
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

const About = () => {
  const features = [
    {
      icon: GraduationCap,
      title: "Industry-Recognized Certificates",
      description:
        "Get certified by JNTU-GV with credentials recognized by top companies worldwide.",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: Users,
      title: "Expert Instructors",
      description:
        "Learn from industry professionals with years of real-world experience and proven expertise.",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: Award,
      title: "Hands-On Projects",
      description:
        "Build real projects and portfolios that showcase your skills to employers and clients.",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: Globe,
      title: "Global Community",
      description:
        "Join thousands of learners from around the world in our supportive and collaborative community.",
      gradient: "from-orange-500 to-red-500",
    },
  ];

  const stats = [
    { number: "100+", label: "Students Enrolled" },
    { number: "95%", label: "Completion Rate" },
    { number: "50+", label: "Industry Partners" },
    { number: "24/7", label: "Support Available" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  const floatVariants = {
    float: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <section className="py-20 relative overflow-hidden">
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
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 relative z-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4"
          >
            <Target className="h-4 w-4" />
            <span className="text-sm font-medium">About Us</span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-4">
            Empowering the Next Generation of Tech Professionals
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl text-left md:mx-auto">
            JNTU-GV Certification Platform is designed to bridge the gap between
            academic learning and industry requirements, providing students with
            practical skills and recognized credentials for successful careers
            in technology.
          </p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16 relative z-10"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{
                y: -5,
                scale: 1.05,
                transition: { type: "spring", stiffness: 300 },
              }}
              className="text-center group"
            >
              <div className="bg-gradient-to-br from-background to-muted/50 rounded-2xl border border-border/50 p-6 shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:border-primary/30">
                <motion.div
                  variants={floatVariants}
                  animate="float"
                  
                  className="text-3xl md:text-4xl font-bold text-gradient-to-r from-[var(--gradient-from)] to-[var(--gradient-to)]   mb-2"
                >
                  {stat.number}
                </motion.div>
                <p className="text-muted-foreground group-hover:text-foreground transition-colors duration-300 font-medium">
                  {stat.label}
                </p>
              </div>
            </motion.div>
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
          {features.map((feature, index) => (
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
                    <feature.icon className="h-6 w-6" />
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
          ))}
        </motion.div>

        {/* Mission Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative z-10"
        >
          <Card className="max-w-full mx-auto bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 shadow-2xl group">
            {/* Animated Border */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-primary/30 rounded-2xl opacity-0 group-hover:opacity-100 blur transition duration-500" />

            <div className="relative bg-background rounded-2xl p-8">
              <CardContent className="text-center p-0">
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="inline-flex items-center gap-3 mb-6"
                >
                  <div className="p-3 bg-primary/10 rounded-2xl">
                    <Rocket className="h-8 w-8 text-primary" />
                  </div>
                </motion.div>

                <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-200 bg-clip-text text-transparent mb-6">
                  Our Mission & Vision
                </h3>

                <div className="grid md:grid-cols-2 gap-8 text-left">
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="space-y-4"
                  >
                    <h4 className="text-xl font-semibold text-foreground flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
                      Our Mission
                    </h4>
                    <p className="text-muted-foreground leading-relaxed">
                      To democratize access to high-quality technical education
                      and certification, enabling students from all backgrounds
                      to acquire industry-relevant skills and advance their
                      careers in the rapidly evolving technology landscape
                      through innovative learning experiences and industry
                      partnerships.
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="space-y-4"
                  >
                    <h4 className="text-xl font-semibold text-foreground flex items-center gap-2">
                      <Star className="h-5 w-5 text-primary" />
                      Our Vision
                    </h4>
                    <p className="text-muted-foreground leading-relaxed">
                      To become the leading platform for industry-aligned
                      technical education, empowering millions of learners
                      worldwide to achieve their career aspirations and drive
                      innovation in the global technology ecosystem through
                      accessible, practical, and transformative learning
                      experiences.
                    </p>
                  </motion.div>
                </div>

               
              </CardContent>
            </div>
          </Card>
        </motion.div>
      </PageContainer>
    </section>
  );
};

export default About;
