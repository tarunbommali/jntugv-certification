/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useRealtime } from "../contexts/RealtimeContext";
import PageContainer from "../components/layout/PageContainer";
import CourseList from "../components/Course/CourseList";
import { Alert, AlertDescription, AlertIcon } from "../components/ui/Alert";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import PageTitle from "../components/ui/PageTitle";

const CoursePage = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const {
    courses,
    coursesLoading,
    coursesError,
    enrollments,
    enrollmentsLoading,
    isEnrolled,
  } = useRealtime();
  const [enrollmentStatus, setEnrollmentStatus] = useState({});
  const [filteredCourses, setFilteredCourses] = useState([]);

  const breadcrumbItems = [
    { label: "Home", link: "/" },
    { label: "Courses", link: "/courses" },
  ];

  // Filter and transform courses data
  useEffect(() => {
    if (!courses || courses.length === 0) {
      setFilteredCourses([]);
      return;
    }

    // Filter only published courses and transform data
    const publishedCourses = courses
      .filter(
        (course) => course.isPublished === true || course.status === "published"
      )
      .map((course) => {
        // Calculate total lessons from modules
        const totalLessons =
          course.modules?.reduce((total, module) => {
            return total + (module.lessons?.length || 0);
          }, 0) || 0;

        // Calculate total duration from modules
        const totalDuration =
          course.modules?.reduce((total, module) => {
            const match = module.duration?.match(/(\d+)\s*hour/i);
            const moduleHours = match ? parseInt(match[1]) : 0;
            return total + moduleHours;
          }, 0) || 0;

        // Transform modules to match the expected format
        const transformedModules =
          course.modules?.map((module) => ({
            moduleKey: module.id,
            moduleTitle: module.title,
            videos:
              module.lessons?.map((lesson) => ({
                title: lesson.title,
                duration: lesson.duration,
                type: lesson.type,
              })) || [],
          })) || [];

        return {
          id: course.id,
          title: course.title,
          description: course.shortDescription,
          courseDescription: course.description,

          // Pricing
          price: course.price || 0,
          originalPrice: course.originalPrice || course.price || 0,

          // Course metadata
          isBestseller: course.isBestseller || false,
          duration:
            totalDuration > 0 ? `${totalDuration} hours` : course.duration,
          mode: "Online",
          rating: course.averageRating || 4.5,
          students: course.totalEnrollments || 0,

          // Visual
          imageUrl: course.imageUrl || "/api/placeholder/400/250",

          // Course modules
          modules: transformedModules,

          // Additional course details
          category: course.category,
          level: course.level,
          instructor: course.instructor,
          language: course.language,
          certificateIncluded: true,
          lastUpdated: course.updatedAt,
          requirements: course.requirements || [],
          learningOutcomes: course.whatYouLearn || [],
          isPublished: course.isPublished,
          status: course.status,
          createdAt: course.createdAt,
        };
      });

    setFilteredCourses(publishedCourses);
  }, [courses]);

  // Calculate enrollment status
  useEffect(() => {
    if (!isAuthenticated || !currentUser || !filteredCourses.length) {
      setEnrollmentStatus({});
      return;
    }

    const status = filteredCourses.reduce((acc, course) => {
      acc[course.id] = isEnrolled(course.id);
      return acc;
    }, {});

    setEnrollmentStatus(status);
  }, [filteredCourses, enrollments, isAuthenticated, currentUser, isEnrolled]);

  // Show loading state
  if (coursesLoading || enrollmentsLoading) {
    return (
      <PageContainer className="min-h-screen" items={breadcrumbItems}>
        <div className="mt-8">
          <LoadingSpinner size="lg" message="Loading courses..." />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="min-h-screen" items={breadcrumbItems}>
      {/* Error Messages */}
      {coursesError && (
        <Alert variant="destructive" className="mt-4">
          <AlertIcon variant="destructive" />
          <AlertDescription>{coursesError}</AlertDescription>
        </Alert>
      )}

      <PageTitle
        title="Available Courses"
        description="Explore our comprehensive certification programs"
      />

      {/* No Courses Message */}
      {!coursesLoading && filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No courses available
            </h3>
            <p className="text-gray-600 mb-4">
              There are no published courses at the moment. Please check back
              later.
            </p>
          </div>
        </div>
      )}

      {/* Course List */}
      {!coursesLoading && filteredCourses.length !== 0 && (
        <CourseList
          courses={filteredCourses}
          loading={coursesLoading}
          error={coursesError}
          enrollmentStatus={enrollmentStatus}
          className="mt-6"
        />
      )}
    </PageContainer>
  );
};

export default CoursePage;
