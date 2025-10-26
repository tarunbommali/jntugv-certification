/* eslint-disable no-unused-vars */
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../../ui/Card";
import Button from "../../ui/Button";
import Badge from "../../ui/Badge";
import { Clock, Users, Star, ArrowRight, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { itemVariants } from "../../../data/landingPage/animationVariants.js";
  

const FeaturedCourseCard = ({ course, hoveredCourse, setHoveredCourse }) => {
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
      className="flex-shrink-0 w-80 group"
    >
      {/* Gradient Border Effect */}
      <div
        className={`absolute -inset-0.5 bg-gradient-to-r ${course.gradient} rounded-2xl opacity-0 group-hover:opacity-100 blur transition duration-300 -z-10`}
      />
      <motion.div
        variants={hoverVariants}
        className="relative bg-gradient-to-br from-background to-muted/50 rounded-2xl border border-border/50 shadow-lg  transition-all duration-300 h-full overflow-hidden group-hover:border-primary/30"
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

export default FeaturedCourseCard;