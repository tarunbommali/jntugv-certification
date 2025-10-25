/* eslint-disable no-unused-vars */
import PageContainer from "../layout/PageContainer";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Users, MessageCircle, Calendar, Award, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import {
  communityFeatures,
  containerVariants,
  itemVariants,
} from "./LandingPageConstants";
import AnimatedSectionHeader from "./AnimatedSectionHeader.jsx";

const JoinCommunity = () => {
  const iconComponents = {
    Users,
    MessageCircle,
    Calendar,
    Award,
    Sparkles,
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
        <AnimatedSectionHeader
          badge={{
            icon: Sparkles,
            text: "Community",
          }}
          title="Join Our Learning Community"
          description="Connect with like-minded learners, share your journey, and grow together in our supportive and inclusive learning environment."
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 relative z-10"
        >
          {communityFeatures.map((feature, index) => {
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
                      <IconComponent className="h-8 w-8 text-primary group-hover:scale-110 transition-transform duration-300" />
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
            );
          })}
        </motion.div>
      </PageContainer>
    </section>
  );
};

export default JoinCommunity;
