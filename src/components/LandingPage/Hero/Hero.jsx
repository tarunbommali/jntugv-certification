/* eslint-disable no-unused-vars */
import { Rocket } from "lucide-react";
import { motion } from "framer-motion";
import AnimatedSectionHeader from "../ui/AnimatedSectionHeader.jsx";
import HeroContent from "./HeroContent.jsx";
import PageContainer from "../../layout/PageContainer.jsx";
import { heroStats } from "../../../data/landingPage/heroData.js";

const Hero = () => {
  const pieData = [
    { name: "AI Adoption", value: 80 },
    { name: "Not Adopted", value: 20 },
  ];

  return (
    <section className="pt-20 px-2 pb-16 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-primary/5" />
      <motion.div
        animate={{
          rotate: 360,
          scale: [1, 1.2, 1],
        }}
        transition={{
          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
          scale: { duration: 8, repeat: Infinity },
        }}
        className="absolute top-1/4 -left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl"
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
        className="absolute bottom-1/4 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
      />

      <PageContainer>
        {/* Main Title */}

        <AnimatedSectionHeader
          badge={{
            icon: Rocket,
            text: "Future-Ready Education",
          }}
          title="Jawaharlal Nehru Technological University-Gurajada, Vizianagaram"
          description="State University Certification in Advanced Technologies."
        />

        <HeroContent stats={heroStats} pieData={pieData} />
      </PageContainer>
    </section>
  );
};

export default Hero;
