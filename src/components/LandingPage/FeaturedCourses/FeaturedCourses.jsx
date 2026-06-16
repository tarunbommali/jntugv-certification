/* eslint-disable no-unused-vars */
import { useMemo } from "react";
import { useRealtime } from "../../../contexts/RealtimeContext";
import { useAuth } from "../../../contexts/AuthContext";
import PageContainer from "../../layout/PageContainer.jsx";
import { BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import AnimatedSectionHeader from "../ui/AnimatedSectionHeader.jsx";
import CourseList from "../../Course/CourseList";

const FeaturedCourses = ({ courses }) => {
  // Prefer courses passed as prop. If not provided, use realtime context so
  // the landing page shows the same course list the app uses elsewhere.
  const { courses: contextCourses, coursesLoading } = useRealtime();

  const courseList = useMemo(() => {
    // Normalize incoming courses (could be raw Firestore docs or plain objects)
    const rawList =
      Array.isArray(courses) && courses.length > 0
        ? courses
        : Array.isArray(contextCourses) && contextCourses.length > 0
          ? contextCourses
          : [];

    return rawList
      .map((c, index) => {
        const data = typeof c?.data === "function" ? c.data() : c?.data || c;
        const derivedId =
          data?.id ||
          c?.id ||
          data?.courseId ||
          data?.uid ||
          (typeof data?.slug === "string" ? data.slug : undefined) ||
          `fallback-${index}`;

        return {
          id: derivedId,
          title: data?.title || data?.name || "Untitled Course",
          description: data?.description || data?.excerpt || "",
          imageUrl: data?.imageUrl || data?.image || data?.thumbnail || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUwCJYSnbBLMEGWKfSnWRGC_34iCCKkxePpg&s",
          featured: Boolean(data?.featured),
          category: data?.category || "General",
          level: data?.level || "Beginner",
          duration: data?.duration || data?.hours || "—",
          students: data?.totalEnrollments || data?.students || 0,
          rating: data?.averageRating || data?.rating || "4.8",
          price: typeof data?.price !== "undefined" ? data.price : data?.paidAmount || "Free",
          originalPrice: data?.originalPrice || data?.mrp || "",
          gradient: data?.gradient || "from-primary/40 to-primary/60",
          isPublished: data?.isPublished === undefined ? true : Boolean(data?.isPublished),
        };
      })
      .filter((c) => c.isPublished);
  }, [contextCourses, courses]);
  const { currentUser, isAuthenticated } = useAuth();
  const { isEnrolled } = useRealtime();
  const enrollmentStatus = useMemo(() => {
    if (!isAuthenticated || !currentUser || !courseList.length) {
      return {};
    }

    return courseList.reduce((acc, course) => {
      try {
        acc[course.id] = Boolean(isEnrolled(course.id));
      } catch {
        acc[course.id] = false;
      }
      return acc;
    }, {});
  }, [courseList, currentUser, isAuthenticated, isEnrolled]);
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
        {/* Courses list — reuse the shared CourseList component for consistency */}
        <div className="mb-12">
          <CourseList
            courses={courseList}
            loading={coursesLoading}
            enrollmentStatus={enrollmentStatus}
            className="mt-6"
          />
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
