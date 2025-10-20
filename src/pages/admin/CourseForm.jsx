/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
// src/pages/admin/CourseForm.jsx

import React, { useState, useEffect } from "react";
import {
  useParams,
  useNavigate,
  Navigate,
  useLocation,
  useMatch,
} from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";
import {
  ArrowLeft,
  Save,
  Eye,
  CirclePercent,
  Users,
  BookOpen,
  Image,
  Settings,
} from "lucide-react";
import { global_classnames } from "../../utils/classnames.js";
import BasicInfoTab from "../../components/Admin/BasicInfoTab.jsx";
import PricingTab from "../../components/Admin/PricingTab.jsx";
import ContentTab from "../../components/Admin/ContentTab.jsx";
import MediaTab from "../../components/Admin/MediaTab.jsx";
import PreviewTab from "../../components/Admin/PreviewTab.jsx";
import Breadcrumbs from "../../components/ui/breadcrumbs/Breadcrumbs.jsx";
import PageContainer from "../../components/layout/PageContainer.jsx";
import PageTitle from "../../components/ui/PageTitle.jsx";
  
// Mock API service - replace with actual API calls
const courseService = {
  async getCourseById(id) {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock course data - in real app, this would come from your backend
    const mockCourses = {
      1: {
        id: "1",
        title: "React Masterclass",
        description:
          "Learn React from scratch with hands-on projects. Build real-world applications and master modern React development.",
        shortDescription:
          "Complete React development course with hands-on projects",
        category: "web-development",
        instructor: "John Doe",
        price: 2999,
        originalPrice: 4999,
        duration: "12 hours",
        level: "beginner",
        language: "english",
        isPublished: true,
        isFeatured: false,
        isBestseller: true,
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUwCJYSnbBLMEGWKfSnWRGC_34iCCKkxePpg&s",
        videoUrl: "",
        tags: ["react", "javascript", "frontend"],
        requirements: ["Basic HTML/CSS knowledge", "JavaScript fundamentals"],
        whatYouLearn: [
          "React fundamentals",
          "Hooks",
          "State management",
          "Project building",
        ],
      },
      2: {
        id: "2",
        title: "Node.js Fundamentals",
        description:
          "Master Node.js backend development with Express, MongoDB, and modern tools.",
        shortDescription: "Complete Node.js backend development course",
        category: "backend-development",
        instructor: "Jane Smith",
        price: 1999,
        originalPrice: 2999,
        duration: "8 hours",
        level: "intermediate",
        language: "english",
        isPublished: true,
        isFeatured: true,
        isBestseller: false,
        imageUrl: "https://via.placeholder.com/400x225",
        videoUrl: "",
        tags: ["nodejs", "javascript", "backend"],
        requirements: ["JavaScript basics", "Basic programming knowledge"],
        whatYouLearn: [
          "Node.js fundamentals",
          "Express framework",
          "Database integration",
          "API development",
        ],
      },
    };

    return mockCourses[id] || null;
  },

  async getCourseModules(courseId) {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Mock modules data
    const mockModules = {
      1: [
        {
          id: 1,
          title: "Introduction to React",
          description:
            "Get started with React basics and understand core concepts",
          order: 1,
          duration: "2 hours",
          lessons: [
            {
              id: 1,
              title: "What is React?",
              duration: "15 min",
              type: "video",
              content: "https://example.com/video1",
            },
            {
              id: 2,
              title: "Setting up Environment",
              duration: "30 min",
              type: "video",
              content: "https://example.com/video2",
            },
          ],
        },
        {
          id: 2,
          title: "React Components",
          description: "Learn about components and props in depth",
          order: 2,
          duration: "3 hours",
          lessons: [
            {
              id: 3,
              title: "Functional Components",
              duration: "45 min",
              type: "video",
              content: "https://example.com/video3",
            },
          ],
        },
      ],
      2: [
        {
          id: 1,
          title: "Node.js Basics",
          description: "Learn the fundamentals of Node.js runtime",
          order: 1,
          duration: "2 hours",
          lessons: [
            {
              id: 1,
              title: "Introduction to Node.js",
              duration: "20 min",
              type: "video",
              content: "https://example.com/node-video1",
            },
          ],
        },
      ],
    };

    return mockModules[courseId] || [];
  },

  async saveCourse(courseData, modules, isNew) {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log("Saving course:", { courseData, modules, isNew });

    // In real app, this would return the saved course data
    return {
      ...courseData,
      id: isNew ? Date.now().toString() : courseData.id,
      updatedAt: new Date().toISOString(),
    };
  },
};

const CourseForm = () => {
  const { isAdmin } = useAuth();
  const { courseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Determine if we're in create or edit mode
  const isNewCourse = courseId === "new" || !courseId;
  const isEditCourse = !isNewCourse;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [activeTab, setActiveTab] = useState("basic");
  const [errors, setErrors] = useState({});

  // Initial empty course state
  const emptyCourse = {
    title: "",
    description: "",
    shortDescription: "",
    category: "web-development",
    instructor: "",
    price: 0,
    originalPrice: 0,
    duration: "",
    level: "beginner",
    language: "english",
    isPublished: false,
    isFeatured: false,
    isBestseller: false,
    imageUrl: "",
    videoUrl: "",
    tags: [],
    requirements: [],
    whatYouLearn: [],
  };

  // Breadcrumb items
  const breadcrumbItems = [
    { label: "Admin", link: "/admin" },
    { label: "Courses", link: "/admin/courses" },
    { label: isNewCourse ? "Create Course" : "Edit Course", link: null },
  ];

  // Tab configuration
  const tabs = [
    { id: "basic", label: "Basic Info", icon: BookOpen },
    { id: "pricing", label: "Pricing", icon: CirclePercent },
    { id: "content", label: "Course Content", icon: Users },
    { id: "media", label: "Media", icon: Image },
    { id: "preview", label: "Preview", icon: Eye },
  ];

  /* --- Data Fetching and Initialization --- */
  useEffect(() => {
    const fetchCourseData = async () => {
      setLoading(true);
      try {
        if (isNewCourse) {
          // Create flow: use empty defaults
          setCourse(emptyCourse);
          setModules([]);
        } else {
          // Edit flow: fetch existing course data
          const [courseData, modulesData] = await Promise.all([
            courseService.getCourseById(courseId),
            courseService.getCourseModules(courseId),
          ]);

          if (!courseData) {
            throw new Error("Course not found");
          }

          setCourse(courseData);
          setModules(modulesData);
        }
      } catch (error) {
        console.error("Failed to fetch course:", error);
        setCourse(null); // Set to null to show "Not Found" message
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId, isNewCourse]);

  /* --- Handlers & Helpers --- */

  const validateForm = () => {
    const newErrors = {};

    if (!course.title?.trim()) newErrors.title = "Course title is required";
    if (!course.shortDescription?.trim())
      newErrors.shortDescription = "Short description is required";
    if (!course.description?.trim())
      newErrors.description = "Description is required";
    if (!course.instructor?.trim())
      newErrors.instructor = "Instructor name is required";
    if (!course.duration?.trim()) newErrors.duration = "Duration is required";
    if (course.price < 0) newErrors.price = "Price must be positive";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCourseChange = (field, value) => {
    setCourse((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleModuleChange = (moduleIndex, field, value) => {
    setModules((prev) =>
      prev.map((module, index) =>
        index === moduleIndex ? { ...module, [field]: value } : module
      )
    );
  };

  const handleLessonChange = (moduleIndex, lessonIndex, field, value) => {
    setModules((prev) =>
      prev.map((module, index) => {
        if (index === moduleIndex) {
          const updatedLessons = module.lessons.map((lesson, lIndex) =>
            lIndex === lessonIndex ? { ...lesson, [field]: value } : lesson
          );
          return { ...module, lessons: updatedLessons };
        }
        return module;
      })
    );
  };

  const addModule = () => {
    const newModule = {
      id: Date.now(),
      title: "New Module",
      description: "",
      order: modules.length + 1,
      duration: "1 hour",
      lessons: [],
    };
    setModules((prev) => [...prev, newModule]);
  };

  const deleteModule = (moduleIndex) => {
    if (window.confirm("Are you sure you want to delete this module?")) {
      setModules((prev) => prev.filter((_, index) => index !== moduleIndex));
    }
  };

  const addLesson = (moduleIndex) => {
    const newLesson = {
      id: Date.now(),
      title: "New Lesson",
      duration: "15 min",
      type: "video",
      content: "",
    };

    setModules((prev) =>
      prev.map((module, index) => {
        if (index === moduleIndex) {
          return {
            ...module,
            lessons: [...module.lessons, newLesson],
          };
        }
        return module;
      })
    );
  };

  const deleteLesson = (moduleIndex, lessonIndex) => {
    if (window.confirm("Are you sure you want to delete this lesson?")) {
      setModules((prev) =>
        prev.map((module, index) => {
          if (index === moduleIndex) {
            return {
              ...module,
              lessons: module.lessons.filter(
                (_, lIndex) => lIndex !== lessonIndex
              ),
            };
          }
          return module;
        })
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      // Switch to first tab with error
      const firstErrorTab =
        Object.keys(errors)[0] === "price" ? "pricing" : "basic";
      setActiveTab(firstErrorTab);
      alert("Please fix the errors before submitting.");
      return;
    }

    setSaving(true);

    try {
      await courseService.saveCourse(course, modules, isNewCourse);

      alert(
        isNewCourse
          ? "Course created successfully!"
          : "Course updated successfully!"
      );
      navigate("/admin/courses");
    } catch (error) {
      console.error("Failed to save course:", error);
      alert("Failed to save course. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Functions for Preview/Content Tabs
  const calculateTotalDuration = () => {
    return modules.reduce((total, module) => {
      const match = module.duration.match(/(\d+)\s*hour/i);
      const moduleHours = match ? parseInt(match[1]) : 0;
      return total + moduleHours;
    }, 0);
  };

  const calculateTotalLessons = () => {
    return modules.reduce((total, module) => total + module.lessons.length, 0);
  };

  /* --- Render Logic --- */

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show not found if course doesn't exist (for edit mode)
  if (isEditCourse && !course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Course Not Found
          </h2>
          <p className="text-gray-600">
            The course you're looking for doesn't exist.
          </p>
          <button
            onClick={() => navigate("/admin/courses")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  const tabComponents = {
    basic: (
      <BasicInfoTab
        course={course}
        handleCourseChange={handleCourseChange}
        errors={errors}
      />
    ),
    pricing: (
      <PricingTab
        course={course}
        handleCourseChange={handleCourseChange}
        errors={errors}
      />
    ),
    content: (
      <ContentTab
        modules={modules}
        handleModuleChange={handleModuleChange}
        handleLessonChange={handleLessonChange}
        addModule={addModule}
        deleteModule={deleteModule}
        addLesson={addLesson}
        deleteLesson={deleteLesson}
        calculateTotalLessons={calculateTotalLessons}
        calculateTotalDuration={calculateTotalDuration}
      />
    ),
    media: <MediaTab course={course} handleCourseChange={handleCourseChange} />,
    preview: (
      <PreviewTab
        course={course}
        modules={modules}
        calculateTotalLessons={calculateTotalLessons}
        calculateTotalDuration={calculateTotalDuration}
      />
    ),
  };

  return (
    <PageContainer items={breadcrumbItems} className="min-h-screen bg-gray-50">
      <PageTitle
        title={
          isNewCourse ? "Create New Course" : `Edit Course: ${course.title}`
        }
        description={
          isNewCourse
            ? "Add a new course to the platform"
            : `Editing Course ID: ${course.id}`
        }
      />

      {/* Main Content Layout */}
      <div className="flex gap-8">
        {/* Left Sidebar - Fixed */}
        <div className="w-80 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
            {/* Navigation Tabs */}
            <nav className="space-y-2 mb-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <tab.icon className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>

            {/* Action Buttons */}
            <div className="space-y-3 border-t border-gray-200 pt-6">
              <button
                type="button"
                onClick={() => navigate("/admin/courses")}
                className="w-full px-4 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium text-center"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="course-form"
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-5 h-5" />
                {saving
                  ? "Saving..."
                  : isNewCourse
                  ? "Create Course"
                  : "Save Changes"}
              </button>
            </div>

            {/* Course Status */}
            {isEditCourse && course && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-3">
                  Course Status
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Created:</span>
                    <span className="text-gray-900">Jan 15, 2024</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Updated:</span>
                    <span className="text-gray-900">Feb 1, 2024</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        course.isPublished
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {course.isPublished ? "Published" : "Draft"}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Content - Scrollable */}
        <div className="flex-1 min-w-0">
          <form
            id="course-form"
            onSubmit={handleSubmit}
            className="bg-white rounded-lg shadow-sm border border-gray-200"
          >
            <div className="p-8 max-h-[calc(100vh-200px)] overflow-y-auto">
              {/* Dynamic Tab Content */}
              {tabComponents[activeTab]}
            </div>
          </form>
        </div>
      </div>
    </PageContainer>
  );
};

export default CourseForm;
