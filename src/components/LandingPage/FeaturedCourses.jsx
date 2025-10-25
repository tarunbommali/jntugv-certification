/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from "react";
import PageContainer from "../layout/PageContainer";
import { BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { courses, containerVariants } from "./LandingPageConstants";
import AnimatedSectionHeader from "./AnimatedSectionHeader.jsx";
import FeaturedCourseCard from "./FeaturedCourseCard.jsx";
// FeaturedCourseCard component

const FeaturedCourses = () => {
  const [hoveredCourse, setHoveredCourse] = useState(null);
  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 400;
    const newScrollLeft =
      container.scrollLeft +
      (direction === "right" ? scrollAmount : -scrollAmount);

    container.scrollTo({
      left: newScrollLeft,
      behavior: "smooth",
    });

    setTimeout(updateArrowVisibility, 300);
  };

  const updateArrowVisibility = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    updateArrowVisibility();

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", updateArrowVisibility);
      return () =>
        container.removeEventListener("scroll", updateArrowVisibility);
    }
  }, []);

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 " />
      <motion.div
        animate={{
          rotate: 360,
          scale: [1, 1.1, 1],
        }}
        transition={{
          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
          scale: { duration: 8, repeat: Infinity },
        }}
        className="absolute top-10 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          rotate: -360,
          scale: [1.1, 1, 1.1],
        }}
        transition={{
          rotate: { duration: 25, repeat: Infinity, ease: "linear" },
          scale: { duration: 10, repeat: Infinity },
        }}
        className="absolute bottom-10 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
      />

      <PageContainer>
        {/* Header Section */}

        <AnimatedSectionHeader
          badge={{
            icon: BookOpen,
            text: "Featured Courses",
          }}
          title="Explore Our Courses"
          description="Discover industry-relevant certification programs designed by experts to advance your career in the most demanded technology domains."
        />
        {/* Navigation Arrows and Scroll Container */}
        <div className="relative mb-12">
          {/* Left Navigation Arrow */}
          <AnimatePresence>
            {showLeftArrow && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => scroll("left")}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 w-12 h-12 bg-background border border-border rounded-full shadow-2xl flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 group"
              >
                <ChevronLeft className="h-6 w-6 group-hover:scale-110 transition-transform" />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Scroll Container */}
          <div className="relative">
            <motion.div
              ref={scrollContainerRef}
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {/* Add padding to first and last items for better scroll experience */}
              <div className="flex-shrink-0 w-4" />
              {courses.map((course, index) => (
                <FeaturedCourseCard
                  key={course.id}
                  course={course}
                  hoveredCourse={hoveredCourse}
                  setHoveredCourse={setHoveredCourse}
                />
              ))}
              <div className="flex-shrink-0 w-4" />
            </motion.div>

            {/* Gradient fade effects on sides */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent pointer-events-none" />
          </div>

          {/* Right Navigation Arrow */}
          <AnimatePresence>
            {showRightArrow && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => scroll("right")}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 w-12 h-12 bg-background border border-border rounded-full shadow-2xl flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 group"
              >
                <ChevronRight className="h-6 w-6 group-hover:scale-110 transition-transform" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </PageContainer>

      {/* Custom CSS to hide scrollbar */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default FeaturedCourses;
