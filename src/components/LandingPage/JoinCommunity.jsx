/* eslint-disable no-unused-vars */
import React from "react";
import PageContainer from "../layout/PageContainer";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import Button from "../ui/Button";
import Badge from "../ui/Badge";
import {
  Users,
  MessageCircle,
  Calendar,
  Award,
  Rocket,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";

const JoinCommunity = () => {
  const communityFeatures = [
    {
      icon: Users,
      title: "100+ Active Learners",
      description: "Join a vibrant community of students and professionals",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: MessageCircle,
      title: "24/7 Support",
      description: "Get help from peers and instructors anytime from private discord channels",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: Calendar,
      title: "Live Sessions",
      description: "Attend interactive workshops and Q&A sessions",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: Award,
      title: "Peer Recognition",
      description: "Showcase your projects and get feedback",
      gradient: "from-orange-500 to-red-500",
    },
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

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-primary/5" />
      <motion.div
        animate={{
          rotate: 360,
          scale: [1, 1.1, 1],
        }}
        transition={{
          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
          scale: { duration: 4, repeat: Infinity },
        }}
        className="absolute top-10 right-10 w-32 h-32 bg-primary/10 rounded-full blur-xl"
      />
      <motion.div
        animate={{
          rotate: -360,
          scale: [1.1, 1, 1.1],
        }}
        transition={{
          rotate: { duration: 25, repeat: Infinity, ease: "linear" },
          scale: { duration: 5, repeat: Infinity },
        }}
        className="absolute bottom-10 left-10 w-40 h-40 bg-primary/5 rounded-full blur-xl"
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
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">Community</span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-4">
            Join Our Learning Community
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Connect with like-minded learners, share your journey, and grow
            together in our supportive and inclusive learning environment.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 relative z-10"
        >
          {communityFeatures.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{
                y: -8,
                scale: 1.02,
                transition: { type: "spring", stiffness: 300 },
              }}
            >
              <Card className="group relative h-full bg-gradient-to-br from-background to-muted/50 border-border/50 hover:border-primary/30 transition-all duration-300 shadow-lg hover:shadow-2xl">
                {/* Gradient Overlay on Hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-xl transition-opacity duration-300`}
                />

                <CardHeader className="text-center relative z-10">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="mx-auto w-16 h-16 bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-300"
                  >
                    <feature.icon className="h-8 w-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                  </motion.div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground group-hover:text-foreground transition-colors duration-300 text-center">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </PageContainer>
    </section>
  );
};

export default JoinCommunity;
