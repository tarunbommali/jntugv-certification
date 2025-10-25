/* eslint-disable no-unused-vars */
import React, { useState, useRef } from "react";
import PageContainer from "../layout/PageContainer";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../ui/Card";
import Button from "../ui/Button";
import Badge from "../ui/Badge";
import {
  Clock,
  Users,
  Star,
  ArrowRight,
  BookOpen,
  Zap,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Moved FeaturedCourseCard component outside to fix the hook issue
const FeaturedCourseCard = ({ course, hoveredCourse, setHoveredCourse }) => {
  const itemVariants = {
    hidden: { opacity: 0, x: 30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  const hoverVariants = {
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
      },
    },
  };

  return (
    <motion.div
      key={course.id}
      variants={itemVariants}
      whileHover="hover"
      onHoverStart={() => setHoveredCourse(course.id)}
      onHoverEnd={() => setHoveredCourse(null)}
      className="flex-shrink-0 w-80 group" // Fixed width for consistent cards
    >
      {/* Gradient Border Effect */}
      <div
        className={`absolute -inset-0.5 bg-gradient-to-r ${course.gradient} rounded-2xl opacity-0 group-hover:opacity-100 blur transition duration-300 -z-10`}
      />
      <motion.div
        variants={hoverVariants}
        className="relative bg-gradient-to-br from-background to-muted/50 rounded-2xl border border-border/50 shadow-lg hover:shadow-2xl transition-all duration-300 h-full overflow-hidden group-hover:border-primary/30"
      >
        {/* Course Image */}
        <div className="relative h-40 overflow-hidden">
          <motion.img
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.6 }}
            src={course.image}
            alt={course.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />

          {/* Featured Badge */}
          {course.featured && (
            <div className="absolute top-3 left-3">
              <Badge className="bg-yellow-500 text-primary font-semibold border-0">
                <Zap className="h-3 w-3 mr-1" />
                Featured
              </Badge>
            </div>
          )}

          {/* Category Badge */}
          <div className="absolute top-3 right-3">
            <Badge
              variant="outline"
              className="bg-background/80 backdrop-blur-sm"
            >
              {course.category}
            </Badge>
          </div>

          {/* Level Badge */}
          <div className="absolute bottom-3 left-3">
            <Badge
              variant="secondary"
              className={`${
                course.level === "Beginner"
                  ? "bg-green-500/20 text-green-600"
                  : course.level === "Intermediate"
                  ? "bg-blue-500/20 text-blue-600"
                  : course.level === "Advanced"
                  ? "bg-purple-500/20 text-purple-600"
                  : "bg-red-500/20 text-red-600"
              } border-0`}
            >
              {course.level}
            </Badge>
          </div>
        </div>

        {/* Course Content */}
        <CardContent className="p-5">
          <CardTitle className="text-lg font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-300">
            {course.title}
          </CardTitle>

          <p className="text-muted-foreground text-sm mb-4 line-clamp-2 group-hover:text-foreground transition-colors duration-300">
            {course.description}
          </p>

          {/* Course Stats */}
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{course.students}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>{course.rating}</span>
            </div>
          </div>

          {/* Price Section */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-foreground">
                {course.price}
              </span>
              <span className="text-sm text-muted-foreground line-through">
                {course.originalPrice}
              </span>
            </div>
            <motion.div
              animate={{
                scale: hoveredCourse === course.id ? 1.1 : 1,
                x: hoveredCourse === course.id ? 5 : 0,
              }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <div
                className={`w-8 h-8 rounded-full bg-gradient-to-r ${course.gradient} flex items-center justify-center`}
              >
                <ArrowRight className="h-4 w-4 text-white" />
              </div>
            </motion.div>
          </div>
        </CardContent>

        {/* Course Footer */}
        <CardFooter className="p-5 pt-0">
          <Button
            className="w-full bg-gradient-to-r from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10 text-primary border border-primary/20 hover:border-primary/30 transition-all duration-300 group"
            asChild
          >
            <a href={`/courses/${course.id}`}>
              <span>Enroll Now</span>
              <motion.span
                animate={{ x: hoveredCourse === course.id ? 5 : 0 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <ArrowRight className="h-4 w-4 ml-2" />
              </motion.span>
            </a>
          </Button>
        </CardFooter>
      </motion.div>
    </motion.div>
  );
};

const FeaturedCourses = () => {
  const [hoveredCourse, setHoveredCourse] = useState(null);
  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // Sample courses data
  const courses = [
    {
      id: 1,
      title: "AI & Machine Learning",
      description:
        "Master artificial intelligence and machine learning concepts with hands-on projects.",
      duration: "6 months",
      students: "2.5k",
      rating: 4.9,
      level: "Advanced",
      category: "AI/ML",
      image:
        "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=250&fit=crop",
      gradient: "from-purple-500 to-pink-500",
      price: "₹24,999",
      originalPrice: "₹34,999",
      featured: true,
    },
    
    {
      id: 8,
      title: "Quantum Computing",
      description:
        "Explore quantum algorithms, quantum gates, and programming quantum computers.",
      duration: "7 months",
      students: "600",
      rating: 4.9,
      level: "Expert",
      category: "Quantum",
      image:
        "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=250&fit=crop",
      gradient: "from-violet-500 to-purple-500",
      price: "₹34,999",
      originalPrice: "₹44,999",
      featured: true,
    },
  ];

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 400; // Adjust based on card width + gap
    const newScrollLeft =
      container.scrollLeft +
      (direction === "right" ? scrollAmount : -scrollAmount);

    container.scrollTo({
      left: newScrollLeft,
      behavior: "smooth",
    });

    // Update arrow visibility after scroll
    setTimeout(updateArrowVisibility, 300);
  };

  const updateArrowVisibility = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  };

  // Initialize arrow visibility
  React.useEffect(() => {
    updateArrowVisibility();

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", updateArrowVisibility);
      return () =>
        container.removeEventListener("scroll", updateArrowVisibility);
    }
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 relative z-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4"
          >
            <BookOpen className="h-4 w-4" />
            <span className="text-sm font-medium">Featured Courses</span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text  mb-4">
            Explore Our Courses
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover industry-relevant certification programs designed by
            experts to advance your career in the most demanded technology
            domains.
          </p>
        </motion.div>

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
              <div className="flex-shrink-0 w-4" />{" "}
              {/* Spacer for first item */}
              {courses.map((course, index) => (
                <FeaturedCourseCard 
                  key={course.id} 
                  course={course} 
                  hoveredCourse={hoveredCourse}
                  setHoveredCourse={setHoveredCourse}
                />
              ))}
              <div className="flex-shrink-0 w-4" /> {/* Spacer for last item */}
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