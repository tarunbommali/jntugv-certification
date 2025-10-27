/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { useCourseContext } from "../../contexts/CourseContext.jsx";
import {
  Save,
  Eye,
  CirclePercent,
  Users,
  BookOpen,
  Image,
  AlertCircle,
} from "lucide-react";

import { useCourseForm } from "../../hooks/admin/useCourseForm.js";
import { useModulesManager } from "../../hooks/admin/useModulesManager.js";
import {
  createEmptyCourse,
  calculateTotalDuration,
  calculateTotalLessons,
  isNewCourseRoute,
  extractActualCourseId,
  prepareCoursePayload,
  mapCourseDataToForm,
} from "../../utils/helper/courseHelpers.js";

import BasicInfoTab from "../../components/Admin/BasicInfoTab.jsx";
import PricingTab from "../../components/Admin/PricingTab.jsx";
import ContentTab from "../../components/Admin/ContentTab.jsx";
import MediaTab from "../../components/Admin/MediaTab.jsx";
import PreviewTab from "../../components/Admin/PreviewTab.jsx";
import PageContainer from "../../components/layout/PageContainer.jsx";
import PageTitle from "../../components/ui/PageTitle.jsx";
import ToastNotification from "../../components/ui/ToastNotification.jsx";
import LoadingSpinner from "../../components/ui/LoadingSpinner.jsx";
 

import { useRealtimeCourse } from "../../hooks/useRealtimeFirebase.js";

const CourseForm = () => {
  const { isAdmin, currentUser } = useAuth();
  const { createCourse, updateCourse } = useCourseContext();
  const { courseId } = useParams();
  const navigate = useNavigate();

  const isNewCourse = isNewCourseRoute(courseId);
  const isEditCourse = !isNewCourse;
  const actualCourseId = isEditCourse ? extractActualCourseId(courseId) : null;

  // ✅ Stable empty course (prevents re-renders)
  const emptyCourse = useMemo(
    () => createEmptyCourse(currentUser),
    [currentUser]
  );

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [courseNotFound, setCourseNotFound] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  // Course form hook
  const {
    formData: course,
    errors,
    touched,
    updateField,
    validateForm,
    setFormData,
  } = useCourseForm(emptyCourse);

  // Modules management
  const {
    modules,
    setModules,
    addModule,
    updateModule,
    deleteModule,
    addLesson,
    updateLesson,
    deleteLesson,
  } = useModulesManager([]);

  // Toast utility
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(
      () => setToast({ show: false, message: "", type: "success" }),
      5000
    );
  };

  // ✅ Optimized data fetch effect
  useEffect(() => {
    const fetchCourseData = async () => {
      if (!isAdmin) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setCourseNotFound(false);

      try {
        if (isNewCourse) {
          console.log("🆕 Creating new course");
          setFormData({ ...emptyCourse, createdBy: currentUser?.uid || "" });
          setModules([]);
        } else {
          // Real-time subscription will populate the form; mark loading
          // and let the realtime hook update the form via a separate effect.
          console.log("📘 Subscribing to realtime course with ID:", actualCourseId);
        }
      } catch (err) {
        console.error("❌ Failed to fetch course:", err);
        setCourseNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
    // ⚙️ Only stable dependencies
  }, [isAdmin, isNewCourse, actualCourseId, currentUser]);

  // Subscribe to the single course in real-time when editing
  const { course: realtimeCourse, loading: realtimeCourseLoading, error: realtimeCourseError } =
    useRealtimeCourse(isEditCourse ? actualCourseId : null, { enabled: isEditCourse });

  // When the realtime course data arrives, map it to form and modules
  useEffect(() => {
    if (!isEditCourse) return;

    if (realtimeCourseLoading) {
      setLoading(true);
      return;
    }

    setLoading(false);

    if (realtimeCourseError) {
      console.error("Realtime course error:", realtimeCourseError);
      setCourseNotFound(true);
      return;
    }

    if (!realtimeCourse) {
      setCourseNotFound(true);
      return;
    }

    try {
      const mapped = mapCourseDataToForm(realtimeCourse);
      setFormData(mapped);
      setModules(realtimeCourse.modules || []);
      console.log("✅ Realtime course data loaded into form");
    } catch (err) {
      console.error("Failed to map realtime course data:", err);
    }
  }, [realtimeCourse, realtimeCourseLoading, realtimeCourseError, isEditCourse]);

  /* --- Form Submission --- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      const firstErrorField = Object.keys(errors)[0];
      const errorTabMap = {
        price: "pricing",
        originalPrice: "pricing",
      };
      const firstErrorTab = errorTabMap[firstErrorField] || "basic";
      setActiveTab(firstErrorTab);
      showToast("Please fix the errors before submitting.", "error");
      return;
    }

    setSaving(true);

    try {
      const coursePayload = prepareCoursePayload(
        course,
        modules,
        currentUser,
        isNewCourse
      );
      let result;

      if (isNewCourse) {
        result = await createCourse(coursePayload);
        if (result) {
          showToast("Course created successfully!", "success");
          navigate("/admin/courses");
        } else {
          throw new Error("Failed to create course");
        }
      } else {
        result = await updateCourse(actualCourseId, coursePayload);
        if (result) {
          showToast("Course updated successfully!", "success");
        } else {
          throw new Error("Failed to update course");
        }
      }
    } catch (error) {
      console.error("Failed to save course:", error);
      showToast(`Failed to save course: ${error.message}`, "error");
    } finally {
      setSaving(false);
    }
  };

  // 📊 Course stats
  const totalDuration = calculateTotalDuration(modules);
  const totalLessons = calculateTotalLessons(modules);

  // 🧭 Tabs
  const tabs = [
    { id: "basic", label: "Basic Info", icon: BookOpen },
    { id: "pricing", label: "Pricing", icon: CirclePercent },
    { id: "content", label: "Course Content", icon: Users },
    { id: "media", label: "Media", icon: Image },
    { id: "preview", label: "Preview", icon: Eye },
  ];

  const tabComponents = {
    basic: (
      <BasicInfoTab
        course={course}
        handleCourseChange={updateField}
        errors={errors}
        touched={touched}
      />
    ),
    pricing: (
      <PricingTab
        course={course}
        handleCourseChange={updateField}
        errors={errors}
        touched={touched}
      />
    ),
    content: (
      <ContentTab
        modules={modules}
        handleModuleChange={updateModule}
        handleLessonChange={updateLesson}
        addModule={addModule}
        deleteModule={deleteModule}
        addLesson={addLesson}
        deleteLesson={deleteLesson}
        totalLessons={totalLessons}
        totalDuration={totalDuration}
      />
    ),
    media: <MediaTab course={course} handleCourseChange={updateField} />,
    preview: (
      <PreviewTab
        course={course}
        modules={modules}
        totalLessons={totalLessons}
        totalDuration={totalDuration}
      />
    ),
  };

  // 🚫 Access Control
  if (!isAdmin) return <Navigate to="/" replace />;

  // ⏳ Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" message="Loading course data..." />
      </div>
    );
  }

  // ❌ Course Not Found
  if (courseNotFound || (isEditCourse && !course?.title)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Course Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The course you're looking for doesn't exist or you don't have
            permission to access it.
          </p>
          <button
            onClick={() => navigate("/admin/courses")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }


    const breadcrumbItems = [
    { label: "Admin", link: "/admin" },
    { label: "Courses", link: "/admin/courses" },
    { label: isNewCourse ? "Create Course" : "Edit Course", link: null },
  ];


  return (
    <PageContainer items={breadcrumbItems} className="min-h-screen bg-gray-50">
      <ToastNotification
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />

      <PageTitle
        title={
          isNewCourse ? "Create New Course" : `Edit Course: ${course.title}`
        }
        description={
          isNewCourse
            ? "Add a new course to the platform"
            : `Editing Course ID: ${actualCourseId}`
        }
      />

      <div className="flex gap-8">
        {/* Sidebar */}
        <div className="w-80 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
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

            <div className="space-y-3 border-t border-gray-200 pt-6">
              <button
                type="button"
                onClick={() => navigate("/admin/courses")}
                disabled={saving}
                className="w-full px-4 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium text-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>

              <button
                type="submit"
                form="course-form"
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                {saving
                  ? "Saving..."
                  : isNewCourse
                  ? "Create Course"
                  : "Update Course"}
              </button>
            </div>
          </div>
        </div>

        {/* Main Form Area */}
        <div className="flex-1 min-w-0">
          <form
            id="course-form"
            onSubmit={handleSubmit}
            className="bg-white rounded-lg shadow-sm border border-gray-200"
          >
            <div className="p-8 max-h-[calc(100vh-200px)] overflow-y-auto">
              {tabComponents[activeTab]}
            </div>
          </form>
        </div>
      </div>
    </PageContainer>
  );
};

export default CourseForm;



