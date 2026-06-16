import { motion } from "framer-motion";
import { UserPlus, BookOpenCheck, Award, Sparkles } from "lucide-react";
import PageContainer from "../layout/PageContainer";
import AnimatedSectionHeader from "./ui/AnimatedSectionHeader";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const steps = [
  {
    icon: UserPlus,
    title: "Enroll",
    description: "Choose a course and start learning.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: BookOpenCheck,
    title: "Practice",
    description: "Complete lessons and assessments.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Award,
    title: "Get Certified",
    description: "Earn a verified completion certificate.",
    color: "from-amber-400 to-orange-500",
  },
];

const HowItWorksSection = () => {
  return (
    <section className="py-20 relative overflow-hidden bg-background">
      <PageContainer>
        <AnimatedSectionHeader
          badge={{
            icon: Sparkles,
            text: "Simple Process",
          }}
          title="How Learning Works"
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="relative mt-16 max-w-4xl mx-auto"
        >
          {/* Connecting Line (hidden on mobile) */}
          <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-amber-500/20 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className="relative z-10 flex flex-col items-center text-center group"
                >
                  <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${step.color} p-[2px] mb-6 shadow-lg group-hover:scale-105 transition-transform duration-300`}>
                    <div className="w-full h-full bg-card rounded-full flex items-center justify-center">
                      <Icon className="w-10 h-10 text-foreground" />
                    </div>
                  </div>
                  
                  <div className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center font-bold mb-4">
                    {idx + 1}
                  </div>
                  
                  <h3 className="text-xl font-bold text-foreground mb-3">
                    {step.title}
                  </h3>
                  
                  <p className="text-muted-foreground">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </PageContainer>
    </section>
  );
};

export default HowItWorksSection;
