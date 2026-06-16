import { motion } from "framer-motion";
import { CheckCircle, Award, ShieldCheck, Share2, Briefcase } from "lucide-react";
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
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
};

const benefits = [
  {
    icon: Award,
    text: "Demonstrate skill achievement",
  },
  {
    icon: ShieldCheck,
    text: "Showcase completed learning",
  },
  {
    icon: Share2,
    text: "Share verified credentials",
  },
  {
    icon: Briefcase,
    text: "Build professional credibility",
  },
];

const CertificationSection = () => {
  return (
    <section className="py-20 relative overflow-hidden bg-background/50">
      <PageContainer>
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* Left: Certificate Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent blur-3xl rounded-full" />
            <div className="relative bg-card border border-border/50 rounded-2xl shadow-2xl p-8 aspect-[4/3] flex flex-col items-center justify-center text-center">
              <div className="w-full max-w-sm mx-auto border-[8px] border-primary/10 p-6 rounded-xl relative overflow-hidden">
                {/* Certificate Details Mockup */}
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-yellow-500/10 rounded-full blur-2xl" />
                <Award className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-xl font-serif font-bold text-foreground mb-2">Certificate of Completion</h3>
                <div className="h-2 w-32 bg-primary/20 mx-auto rounded-full mb-6" />
                <div className="space-y-3">
                  <div className="h-3 w-3/4 bg-muted/50 mx-auto rounded-full" />
                  <div className="h-3 w-1/2 bg-muted/50 mx-auto rounded-full" />
                </div>
                <div className="mt-8 pt-4 border-t border-border flex justify-between px-4">
                  <div className="h-8 w-24 bg-primary/10 rounded-lg" />
                  <div className="h-8 w-16 bg-muted/30 rounded-full" />
                </div>
              </div>
              
              <div className="absolute -bottom-6 -right-6 bg-background rounded-2xl p-4 shadow-xl border border-border flex items-center gap-3">
                <div className="bg-green-500/10 p-2 rounded-full">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
                <div className="text-left">
                  <p className="text-xs text-muted-foreground font-medium">Status</p>
                  <p className="text-sm font-bold text-foreground">Verified</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Benefits List */}
          <div className="w-full lg:w-1/2">
            <AnimatedSectionHeader
              badge={{
                icon: Award,
                text: "Verified Achievement",
              }}
              title="Certification Benefits"
              description="Earning a certificate from Aikya I/O proves your dedication and validates your skills to the world."
              align="left"
            />

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="mt-8 space-y-6"
            >
              {benefits.map((benefit, idx) => {
                const Icon = benefit.icon;
                return (
                  <motion.div
                    key={idx}
                    variants={itemVariants}
                    className="flex items-center gap-4 bg-card p-4 rounded-xl border border-border/50 hover:border-primary/30 transition-colors shadow-sm"
                  >
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <p className="text-lg font-medium text-foreground">
                      {benefit.text}
                    </p>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
          
        </div>
      </PageContainer>
    </section>
  );
};

export default CertificationSection;
