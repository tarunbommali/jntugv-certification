/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
// src/pages/admin/AdminCourses.jsx

import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { useCourseContext } from "../../contexts/CourseContext.jsx";
import { Navigate, Link } from "react-router-dom";
import {
  Plus,
  Search,
  BookOpen,
  Users,
  Star,
  Clock,
  Eye,
  EyeOff
} from "lucide-react";
import CourseCard from "../../components/Course/CourseCard.jsx";
import PageContainer from "../../components/layout/PageContainer.jsx";
import PageTitle from "../../components/ui/PageTitle.jsx";
import LoadingSpinner from "../../components/ui/LoadingSpinner.jsx";
import ToastNotification from "../../components/ui/ToastNotification.jsx";

const CourseManagement = () => {
  const { isAdmin, currentUser } = useAuth();
  const { 
    courses, 
    coursesLoading, 
    coursesError, 
    deleteCourse,
    getCourseStats 
  } = useCourseContext();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const [deletingCourseId, setDeletingCourseId] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    drafts: 0,
    totalEnrollments: 0
  });

  const breadcrumbItems = [
    { label: "Admin", link: "/admin" },
    { label: "Courses", link: "/admin/courses" },
  ];

  // Update stats when courses change
  useEffect(() => {
    if (courses) {
      const courseStats = getCourseStats();
      setStats(courseStats);
    }
  }, [courses, getCourseStats]);

  // Toast notification helper
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(
      () => setToast({ show: false, message: "", type: "success" }),
      5000
    );
  };

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  console.log("All Courses:", courses);

  // Transform and filter courses based on search term
  const transformedCourses = courses?.map(course => {
    // Handle both old and new data structures
    const title = course.title || course.courseTitle || "Untitled Course";
    const description = course.description || course.courseDescription || "";
    const shortDescription = course.shortDescription || description.substring(0, 100) + "...";
    const price = course.price || course.coursePrice || 0;
    const originalPrice = course.originalPrice || course.coursePrice || price;
    
    // Calculate total lessons from modules
    const totalLessons = course.modules?.reduce((total, module) => {
      return total + (module.lessons?.length || module.videos?.length || 0);
    }, 0) || 0;

    // Calculate total duration from modules
    const totalDuration = course.modules?.reduce((total, module) => {
      const match = module.duration?.match(/(\d+)\s*hour/i);
      const moduleHours = match ? parseInt(match[1]) : 0;
      return total + moduleHours;
    }, 0) || 0;

    return {
      id: course.id || course.courseId,
      title: title,
      description: shortDescription,
      courseDescription: description,
      price: price,
      originalPrice: originalPrice,
      isBestseller: course.isBestseller || false,
      duration: totalDuration > 0 ? `${totalDuration} hours` : course.duration || "Not specified",
      mode: "Online",
      rating: course.averageRating || 0,
      students: course.totalEnrollments || 0,
      imageUrl: course.imageUrl || "/api/placeholder/400/250",
      category: course.category || "Uncategorized",
      level: course.level || "Beginner",
      instructor: course.instructor || "Unknown Instructor",
      language: course.language || "English",
      status: course.isPublished ? "published" : "draft",
      isPublished: course.isPublished || false,
      isFeatured: course.isFeatured || false,
      createdAt: course.createdAt || new Date().toISOString(),
      updatedAt: course.updatedAt || new Date().toISOString(),
      modules: course.modules || [],
      // Include original course data for debugging
      _original: course
    };
  }) || [];

  const filteredCourses = transformedCourses.filter(
    (course) =>
      course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditCourse = (course) => {
    // Navigation is handled by the Link in CourseCard
    console.log("Edit course:", course);
  };

  const handleDeleteCourse = async (course) => {
    if (
      !window.confirm(
        `Are you sure you want to delete "${course.title}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    setDeletingCourseId(course.id);
    try {
      const success = await deleteCourse(course.id);
      if (success) {
        showToast(`Course "${course.title}" deleted successfully`, "success");
      } else {
        throw new Error("Failed to delete course");
      }
    } catch (error) {
      console.error("Error deleting course:", error);
      showToast(`Failed to delete course: ${error.message}`, "error");
    } finally {
      setDeletingCourseId(null);
    }
  };

  const handleViewCourse = (course) => {
    // Navigate to course preview or public page
    window.open(`/course/${course.id}`, "_blank");
  };

  console.log("Transformed Courses:", transformedCourses);
  console.log("Filtered Courses:", filteredCourses);
  console.log("Course Stats:", stats);

  return (
    <PageContainer
      items={breadcrumbItems}
      className="min-h-screen bg-gray-50 py-8"
    >
      <ToastNotification
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />

      <PageTitle
        title="Course Management"
        description="Create and manage platform courses"
      />

      {/* Search and Create Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search courses by title, instructor, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <Link
          to="/admin/courses/create/new"
          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Create Course</span>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200 text-center">
          <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Courses</div>
          <div className="text-xs text-gray-500 mt-1">
            ({stats.published} published + {stats.drafts} drafts)
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200 text-center">
          <Eye className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">
            {stats.published}
          </div>
          <div className="text-sm text-gray-600">Published</div>
          <div className="text-xs text-gray-500 mt-1">
            Live on platform
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200 text-center">
          <EyeOff className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">
            {stats.drafts}
          </div>
          <div className="text-sm text-gray-600">Drafts</div>
          <div className="text-xs text-gray-500 mt-1">
            Not published yet
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200 text-center">
          <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">
            {stats.totalEnrollments}
          </div>
          <div className="text-sm text-gray-600">Total Students</div>
          <div className="text-xs text-gray-500 mt-1">
            Across all courses
          </div>
        </div>
      </div>

      {/* Status Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setSearchTerm("")}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            searchTerm === "" 
              ? "bg-blue-600 text-white" 
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          All Courses ({stats.total})
        </button>
        <button
          onClick={() => setSearchTerm("status:published")}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            searchTerm === "status:published" 
              ? "bg-green-600 text-white" 
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Published ({stats.published})
        </button>
        <button
          onClick={() => setSearchTerm("status:draft")}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            searchTerm === "status:draft" 
              ? "bg-yellow-600 text-white" 
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Drafts ({stats.drafts})
        </button>
      </div>

      {/* Loading State */}
      {coursesLoading && (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" message="Loading courses..." />
        </div>
      )}

      {/* Error State */}
      {coursesError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error loading courses
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{coursesError}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* No Courses State */}
      {!coursesLoading && !coursesError && filteredCourses.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? "No courses found" : "No courses yet"}
          </h3>
          <p className="text-gray-600 mb-4 max-w-md mx-auto">
            {searchTerm
              ? `No courses match "${searchTerm}". Try adjusting your search terms.`
              : "Get started by creating your first course."}
          </p>
          {!searchTerm && (
            <Link
              to="/admin/courses/create/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Your First Course
            </Link>
          )}
        </div>
      )}

      {/* Courses Grid */}
      {!coursesLoading && filteredCourses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              showAdminOptions={true}
              onEdit={handleEditCourse}
              onDelete={handleDeleteCourse}
              onView={handleViewCourse}
              isDeleting={deletingCourseId === course.id}
            />
          ))}
        </div>
      )}
    </PageContainer>
  );
};

export default CourseManagement;