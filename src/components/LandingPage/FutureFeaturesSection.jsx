import { motion } from "framer-motion";
import { Sparkles, Zap, BrainCircuit } from "lucide-react";
import PageContainer from "../layout/PageContainer";
import AnimatedSectionHeader from "./ui/AnimatedSectionHeader";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const upcomingFeatures = [
  {
    icon: Zap,
    title: "QuVolt",
    description: "Interactive practice environments.",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
  {
    icon: BrainCircuit,
    title: "Aikya Recall",
    description: "Smart revision and knowledge retention.",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
  },
];

const FutureFeaturesSection = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-background">
      <PageContainer>
        <AnimatedSectionHeader
          badge={{
            icon: Sparkles,
            text: "Upcoming Features",
          }}
          title="Coming Soon"
          description="We are constantly expanding Aikya I/O to provide the best learning experience."
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-16"
        >
          {upcomingFeatures.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                className={`relative overflow-hidden rounded-2xl border ${feature.border} bg-card p-8 shadow-sm`}
              >
                {/* Decorative background element */}
                <div className={`absolute -right-10 -top-10 w-32 h-32 ${feature.bg} rounded-full blur-2xl opacity-50`} />
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-6">
                    <div className={`p-4 rounded-xl ${feature.bg}`}>
                      <Icon className={`h-8 w-8 ${feature.color}`} />
                    </div>
                    <span className="px-3 py-1 bg-muted/50 text-muted-foreground text-xs font-semibold rounded-full border border-border">
                      In Development
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-foreground mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </PageContainer>
    </section>
  );
};

export default FutureFeaturesSection;
