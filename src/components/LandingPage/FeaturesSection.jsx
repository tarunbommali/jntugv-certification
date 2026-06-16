import { motion } from "framer-motion";
import { BookOpen, Clock, BarChart3, Award, Sparkles } from "lucide-react";
import PageContainer from "../layout/PageContainer";
import AnimatedSectionHeader from "./ui/AnimatedSectionHeader";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const features = [
  {
    icon: BookOpen,
    title: "Courses",
    description: "Access structured learning paths and expert-curated content.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    icon: Clock,
    title: "Assessments",
    description: "Test understanding through quizzes and evaluations.",
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  {
    icon: BarChart3,
    title: "Progress Tracking",
    description: "Monitor learning progress and completion status.",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    icon: Award,
    title: "Certificates",
    description: "Receive verified certificates upon successful completion.",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-20 relative bg-background/50">
      <PageContainer>
        <AnimatedSectionHeader
          badge={{
            icon: Sparkles,
            text: "Platform Features",
          }}
          title="Everything You Need To Learn Effectively"
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12"
        >
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="bg-card p-6 rounded-2xl shadow-sm border border-border/50 hover:shadow-md transition-all group"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${feature.bg} mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </PageContainer>
    </section>
  );
};

export default FeaturesSection;
