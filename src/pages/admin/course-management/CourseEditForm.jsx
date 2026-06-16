/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext.jsx";
import { useCourseContext } from "../../../contexts/CourseContext.jsx";
import {
  Save,
  Eye,
  CirclePercent,
  Users,
  BookOpen,
  Image,
  AlertCircle,
} from "lucide-react";

import { useCourseForm } from "../../../hooks/admin/useCourseForm.js";
import { useModulesManager } from "../../../hooks/admin/useModulesManager.js";
import {
  createEmptyCourse,
  calculateTotalDuration,
  calculateTotalLessons,
  extractActualCourseId,
  prepareCoursePayload,
  mapCourseDataToForm,
} from "../../../utils/helper/courseHelpers.js";
import {
  getErrorTab,
  getFirstErrorField,
  validateCompleteCourse,
} from "../../../utils/validation/courseFormValidation.js.js";

import BasicInfoTab from "../../../components/Admin/BasicInfoTab.jsx";
import PricingTab from "../../../components/Admin/PricingTab.jsx";
import ContentTab from "../../../components/Admin/ContentTab.jsx";
import MediaTab from "../../../components/Admin/MediaTab.jsx";
import PassingCriteriaTab from "../../../components/Admin/PassingCriteriaTab.jsx";
import PreviewTab from "../../../components/Admin/PreviewTab.jsx";
import QuizEditorModal from "../../../components/Admin/QuizEditorModal.jsx";
import AssignmentEditorModal from "../../../components/Admin/AssignmentEditorModal.jsx";
import PageContainer from "../../../components/layout/PageContainer.jsx";
import PageTitle from "../../../components/ui/PageTitle.jsx";
import ToastNotification from "../../../components/ui/ToastNotification.jsx";
import LoadingSpinner from "../../../components/ui/LoadingSpinner.jsx";

const resolveFirstErrorMessage = (value) => {
  if (!value) return null;
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }
  if (Array.isArray(value)) {
    for (const entry of value) {
      const resolved = resolveFirstErrorMessage(entry);
      if (resolved) return resolved;
    }
    return null;
  }
  if (typeof value === "object") {
    for (const key of Object.keys(value)) {
      const resolved = resolveFirstErrorMessage(value[key]);
      if (resolved) return resolved;
    }
  }
  return null;
};

const extractNestedMessage = (value) => {
  if (!value) return null;
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }
  if (value instanceof Error) {
    return value.message?.trim() || null;
  }
  if (typeof value === "object") {
    return resolveFirstErrorMessage(value);
  }
  return null;
};

const CourseEditForm = () => {
  const { isAdmin, currentUser } = useAuth();
  const { updateCourse, getCourseById } = useCourseContext();
  const { courseId } = useParams();
  const navigate = useNavigate();

  const actualCourseId = extractActualCourseId(courseId);

  // ✅ Stable empty course (prevents re-renders)
  const emptyCourse = useMemo(
    () => createEmptyCourse(currentUser),
    [currentUser]
  );

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingAsDraft, setSavingAsDraft] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  
  // Modal states
  const [quizModal, setQuizModal] = useState({
    isOpen: false,
    courseId: null,
    moduleId: null,
    lessonId: null,
    isModuleAssessment: false
  });
  const [assignmentModal, setAssignmentModal] = useState({
    isOpen: false,
    courseId: null,
    moduleId: null,
    lessonId: null
  });
  const [courseNotFound, setCourseNotFound] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
    title: "",
  });

  // Course form hook
  const {
    formData: course,
    errors,
    touched,
    updateField,
    setFormData,
    setErrors,
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

  // Enhanced Toast utility with titles and better positioning
  const showToast = (message, type = "success", title = "") => {
    setToast({ 
      show: true, 
      message, 
      type, 
      title,
      position: "bottom-center"
    });
    setTimeout(
      () => setToast({ show: false, message: "", type: "success", title: "" }),
      5000
    );
  };

  // Show API operation start notification
  const showApiStartToast = (operation, isDraft = false) => {
    const operations = {
      update: { 
        title: isDraft ? "Saving Draft" : "Updating Course", 
        message: isDraft ? "Updating draft version..." : "Updating course information..." 
      },
    };
    
    const op = operations[operation] || { 
      title: isDraft ? "Saving Draft" : "Saving", 
      message: "Processing your request..." 
    };
    showToast(op.message, "info", op.title);
  };

  // Show API operation success notification
  const showApiSuccessToast = (operation, isDraft = false) => {
    const operations = {
      update: { 
        title: isDraft ? "Draft Updated!" : "Course Updated!", 
        message: isDraft 
          ? "Your draft has been updated successfully."
          : "Your course has been updated successfully." 
      },
    };
    
    const op = operations[operation] || { 
      title: isDraft ? "Draft Saved!" : "Success!", 
      message: "Operation completed successfully." 
    };
    showToast(op.message, "success", op.title);
  };

  const extractErrorMessage = (err) => {
    if (!err) return "";

    if (typeof err === "string") {
      return err.trim();
    }

    const candidateSources = [
      err.payload,
      err.response?.data ?? err.response,
      err.details,
      err.data,
      err.body,
      err?.payload?.details,
      err,
    ];

    for (const source of candidateSources) {
      const resolved = extractNestedMessage(source);
      if (resolved) {
        return resolved;
      }
    }

    return "";
  };

  // ✅ Data fetch effect for editing
  useEffect(() => {
    const fetchCourseData = async () => {
      if (!isAdmin) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setCourseNotFound(false);

      try {
        console.log("📘 Fetching course with ID:", actualCourseId);
        
        const courseData = await getCourseById(actualCourseId);
        
        if (courseData) {
          const mapped = mapCourseDataToForm(courseData);
          setFormData(mapped);
          setModules(courseData.modules || []);
          console.log("✅ Course data loaded into form");
          showToast("Course data loaded successfully", "success", "Ready to Edit");
        } else {
          setCourseNotFound(true);
          showToast("Course not found", "error", "Not Found");
        }
      } catch (err) {
        console.error("❌ Failed to fetch course:", err);
        setCourseNotFound(true);
        showToast("Failed to load course data", "error", "Loading Error");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [isAdmin, actualCourseId, currentUser, getCourseById]);

  const handleValidationFailure = (validationErrors) => {
    const firstErrorField = getFirstErrorField(validationErrors) || Object.keys(validationErrors || {})[0];
    const firstErrorTab = firstErrorField ? getErrorTab(firstErrorField) : "basic";
    if (firstErrorTab) {
      setActiveTab(firstErrorTab);
    }

    const firstErrorMessage = firstErrorField
      ? resolveFirstErrorMessage(validationErrors?.[firstErrorField])
      : null;

    showToast(
      firstErrorMessage || "Please review the highlighted fields.", 
      "error", 
      "Validation Error"
    );
  };

  const runValidation = () => {
    const { errors: validationErrors, isValid } = validateCompleteCourse(course, modules);
    setErrors(validationErrors);

    if (!isValid) {
      handleValidationFailure(validationErrors);
      return false;
    }

    return true;
  };

  // Handle Save as Draft
  const handleSaveDraft = async () => {
    if (!runValidation()) {
      return;
    }

    setSavingAsDraft(true);

    try {
      showApiStartToast("update", true);

      if (!actualCourseId) {
        throw new Error("Missing course identifier");
      }

      const coursePayload = prepareCoursePayload(
        { ...course, isPublished: false },
        modules,
        currentUser,
        false // isNewCourse = false
      );

      console.log("Updating draft course:", actualCourseId, coursePayload);

      const result = await updateCourse(actualCourseId, coursePayload);
      if (result?.success) {
        showApiSuccessToast("update", true);
      } else {
        throw new Error(result?.error || "Failed to update draft");
      }
    } catch (error) {
      console.error("Failed to save draft:", error);
      const friendlyMessage = extractErrorMessage(error);
      const prefix = "Draft update failed";
      const normalizedFriendly = friendlyMessage?.trim();
      const finalMessage = normalizedFriendly
        ? normalizedFriendly.toLowerCase().includes(prefix.toLowerCase())
          ? normalizedFriendly
          : `${prefix}: ${normalizedFriendly}`
        : prefix;
      
      showToast(finalMessage, "error", "Save Failed");
    } finally {
      setSavingAsDraft(false);
    }
  };

  /* --- Form Submission (Publish) --- */
  const handleSubmit = async (event) => {
    event?.preventDefault?.();

    if (!runValidation()) {
      return;
    }

    setSaving(true);

    try {
      showApiStartToast("update", false);

      if (!actualCourseId) {
        throw new Error("Missing course identifier");
      }

      const coursePayload = prepareCoursePayload(
        { ...course, isPublished: true },
        modules,
        currentUser,
        false // isNewCourse = false
      );

      console.log("Updating course:", actualCourseId, coursePayload);

      const result = await updateCourse(actualCourseId, coursePayload);
      if (result?.success) {
        showApiSuccessToast("update", false);
      } else {
        throw new Error(result?.error || "Failed to update course");
      }
    } catch (error) {
      console.error("Failed to update course:", error);
      const friendlyMessage = extractErrorMessage(error);
      const prefix = "Course update failed";
      const normalizedFriendly = friendlyMessage?.trim();
      const finalMessage = normalizedFriendly
        ? normalizedFriendly.toLowerCase().includes(prefix.toLowerCase())
          ? normalizedFriendly
          : `${prefix}: ${normalizedFriendly}`
        : prefix;
      
      showToast(finalMessage, "error", "Update Failed");
    } finally {
      setSaving(false);
    }
  };

  // Check which save operation is currently in progress
  const isSavingDraft = savingAsDraft;
  const isPublishing = saving && !savingAsDraft;

  // 📊 Course stats
  const totalDuration = calculateTotalDuration(modules);
  const totalLessons = calculateTotalLessons(modules);

  // 🧭 Tabs
  const tabs = [
    { id: "basic", label: "Basic Info", icon: BookOpen },
    { id: "pricing", label: "Pricing", icon: CirclePercent },
    { id: "content", label: "Course Content", icon: Users },
    { id: "media", label: "Media", icon: Image },
    { id: "passing_criteria", label: "Passing Criteria", icon: AlertCircle },
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
        contentType={course?.contentType || 'modules'}
        onContentTypeChange={(val) => updateField('contentType', val)}
        onOpenPracticeQuiz={(moduleId, lessonId) => setQuizModal({ isOpen: true, courseId: actualCourseId, moduleId, lessonId, isModuleAssessment: false })}
        onOpenAssignment={(moduleId, lessonId) => setAssignmentModal({ isOpen: true, courseId: actualCourseId, moduleId, lessonId })}
        onOpenModuleAssessment={(moduleId) => setQuizModal({ isOpen: true, courseId: actualCourseId, moduleId, lessonId: null, isModuleAssessment: true })}
      />
    ),
    media: <MediaTab course={course} handleCourseChange={updateField} />,
    passing_criteria: (
      <PassingCriteriaTab course={course} handleCourseChange={updateField} />
    ),
    preview: (
      <PreviewTab
        course={course}
        modules={modules}
        totalLessons={totalLessons}
        totalDuration={totalDuration}
        contentType={course?.contentType || 'modules'}
      />
    ),
  };

  // 🚫 Access Control
  if (!isAdmin) return <Navigate to="/" replace />;

  // ⏳ Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner size="lg" message="Loading course data..." />
      </div>
    );
  }

  // ❌ Course Not Found
  if (courseNotFound || !course?.title) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Course Not Found
          </h2>
          <p className="text-muted mb-4">
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
    { label: `Edit Course: ${course.title}`, link: null },
  ];

  return (
    <PageContainer items={breadcrumbItems} className="min-h-screen bg-background">
      <ToastNotification
        show={toast.show}
        message={toast.message}
        type={toast.type}
        title={toast.title}
        position={toast.position}
        onClose={() => setToast({ ...toast, show: false })}
      />

      <PageTitle
        title={`Edit Course: ${course.title}`}
        description={`Editing Course ID: ${actualCourseId}`}
      />

      <form
        id="course-form"
        onSubmit={handleSubmit}
        className="flex gap-8"
      >
        {/* Sidebar */}
        <div className="w-80 flex-shrink-0">
          <div className="bg-surface rounded-lg shadow-sm border border-border p-6 sticky top-8">
            <nav className="space-y-2 mb-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "text-muted hover:text-foreground hover:bg-background"
                  }`}
                >
                  <tab.icon className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>

            <div className="space-y-3 border-t border-border pt-6">
              <button
                type="button"
                onClick={() => navigate("/admin/courses")}
                disabled={saving || savingAsDraft}
                className="w-full px-4 py-3 text-muted bg-surface-elevated rounded-lg hover:bg-surface-elevated transition-colors font-medium text-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>

              {/* Save as Draft Button */}
              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={saving || savingAsDraft}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {savingAsDraft ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                {savingAsDraft 
                  ? "Saving Draft..." 
                  : course.isPublished 
                    ? "Unpublish & Save as Draft"
                    : "Save as Draft"
                }
              </button>

              {/* Update/Publish Button */}
              <button
                type="submit"
                disabled={saving || savingAsDraft}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
                {saving 
                  ? "Updating..." 
                  : course.isPublished
                    ? "Update Published Course"
                    : "Publish Course"
                }
              </button>
            </div>
          </div>
        </div>

        {/* Main Form Area */}
        <div className="flex-1 min-w-0">
          <div className="bg-surface rounded-lg shadow-sm border border-border">
            <div className="p-8 max-h-[calc(100vh-200px)] overflow-y-auto">
              {tabComponents[activeTab]}
            </div>
          </div>
        </div>
      </form>
      
      <QuizEditorModal 
        isOpen={quizModal.isOpen} 
        onClose={() => setQuizModal({ ...quizModal, isOpen: false })} 
        courseId={quizModal.courseId}
        moduleId={quizModal.moduleId}
        lessonId={quizModal.lessonId}
        isModuleAssessment={quizModal.isModuleAssessment}
      />
      
      <AssignmentEditorModal
        isOpen={assignmentModal.isOpen}
        onClose={() => setAssignmentModal({ ...assignmentModal, isOpen: false })}
        courseId={assignmentModal.courseId}
        moduleId={assignmentModal.moduleId}
        lessonId={assignmentModal.lessonId}
      />
    </PageContainer>
  );
};

export default CourseEditForm;