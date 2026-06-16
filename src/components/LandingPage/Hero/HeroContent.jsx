/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { CheckCircle, PlayCircle, Award, BookOpen, Clock, Search, ArrowDown } from "lucide-react";
import Button from "../../ui/Button";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

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

const HeroContent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleTagClick = (tag) => {
    navigate(`/courses?category=${encodeURIComponent(tag)}`);
  };

  return (
    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-10 relative ">
      {/* LEFT SECTION: VALUE PROPOSITION & CTAS */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full lg:w-1/2 space-y-8"
      >
        <motion.div variants={itemVariants}>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
            Input Knowledge.<br />
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-secondary">
              Output Mastery.
            </span>
          </h1>

          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-lg"
          >
            Structured courses, assessments, learning notes, and verified certificates designed for real-world skill development.
          </motion.p>
        </motion.div>

        {/* CTAs */}
        <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4">
          <Button size="lg" className="px-8 text-white text-base shadow-lg" asChild>
            <Link to="/courses">Explore Courses</Link>
          </Button>
          <Button size="lg" variant="outline" className="px-8 text-base border-primary text-primary hover:bg-primary/5" asChild>
            <Link to="/certificates">View Certifications</Link>
          </Button>
        </motion.div>
      </motion.div>

      {/* RIGHT SECTION: LEARNING JOURNEY VISUAL */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="w-full lg:w-1/2 relative flex justify-center lg:justify-end"
      >
        <div className="relative w-full max-w-md py-10">
          {/* Connecting Vertical Line */}
          <div className="absolute left-8 top-16 bottom-16 w-1 bg-gradient-to-b from-primary/30 via-primary/50 to-primary/30 rounded-full" />

          <div className="space-y-6 relative z-10">
            {/* Step 1: Course */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-card backdrop-blur-md p-4 rounded-2xl shadow-xl border border-border/80 flex items-center gap-4 relative ml-4 hover:border-primary/50 transition-colors"
            >
              <div className="p-3 bg-blue-500/10 rounded-xl relative z-10 shadow-sm border border-blue-500/20">
                <PlayCircle className="h-6 w-6 text-blue-500" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-1">Step 1</p>
                <h4 className="font-semibold text-sm text-foreground">Course Progress</h4>
                <div className="mt-2 h-1.5 w-full bg-secondary/30 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
            </motion.div>

            {/* Step 2: Assessment */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-card backdrop-blur-md p-4 rounded-2xl shadow-xl border border-border/80 flex items-center gap-4 relative ml-12 hover:border-green-500/50 transition-colors"
            >
              <div className="p-3 bg-green-500/10 rounded-xl relative z-10 shadow-sm border border-green-500/20">
                <Clock className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-1">Step 2</p>
                <h4 className="font-semibold text-sm text-foreground">Assessment Passed</h4>
                <p className="text-xs text-green-600 font-bold mt-0.5">Score: 92%</p>
              </div>
            </motion.div>

            {/* Step 3: Notes */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0 }}
              className="bg-card backdrop-blur-md p-4 rounded-2xl shadow-xl border border-border/80 flex items-center gap-4 relative ml-16 hover:border-amber-500/50 transition-colors"
            >
              <div className="p-3 bg-amber-500/10 rounded-xl relative z-10 shadow-sm border border-amber-500/20">
                <BookOpen className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-1">Step 3</p>
                <h4 className="font-semibold text-sm text-foreground">Notes Reviewed</h4>
                <p className="text-xs text-muted-foreground mt-0.5">Summary Available</p>
              </div>
            </motion.div>

            {/* Step 4: Certificate */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 }}
              className="bg-card backdrop-blur-md p-5 rounded-2xl shadow-xl border border-border/80 flex items-center gap-4 relative ml-8 hover:border-yellow-500/50 transition-colors bg-gradient-to-r from-card to-yellow-500/5"
            >
              <div className="p-3 bg-yellow-500/10 rounded-full relative z-10 shadow-sm border border-yellow-500/20">
                <Award className="h-8 w-8 text-yellow-500" />
              </div>
              <div>
                <p className="text-[10px] text-yellow-600 font-bold uppercase tracking-wider mb-1">Goal Achieved</p>
                <h4 className="font-bold text-sm text-foreground">Certificate Earned</h4>
                <div className="mt-1 flex items-center gap-1 text-xs text-green-600 font-semibold bg-green-500/10 w-fit px-2 py-0.5 rounded-full">
                  <CheckCircle className="h-3 w-3" />
                  Verified
                </div>
              </div>
            </motion.div>
          </div>

          {/* Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 md:w-80 md:h-80 bg-gradient-to-tr from-primary/10 to-primary/20 rounded-full blur-3xl z-0 pointer-events-none" />
        </div>
      </motion.div>
    </div>
  );
};

export default HeroContent;
