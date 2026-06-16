/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
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
  prepareCoursePayload,
} from "../../../utils/helper/courseHelpers.js";
import {
  getErrorTab,
  getFirstErrorField,
} from "../../../utils/validation/courseFormValidation.js.js";

import BasicInfoTab from "../../../components/Admin/BasicInfoTab.jsx";
import PricingTab from "../../../components/Admin/PricingTab.jsx";
import ContentTab from "../../../components/Admin/ContentTab.jsx";
import MediaTab from "../../../components/Admin/MediaTab.jsx";
import PassingCriteriaTab from "../../../components/Admin/PassingCriteriaTab.jsx";
import PreviewTab from "../../../components/Admin/PreviewTab.jsx";
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

const CourseCreateForm = () => {
  const { isAdmin, currentUser } = useAuth();
  const { createCourse } = useCourseContext();
  const navigate = useNavigate();

  // ✅ Stable empty course (prevents re-renders)
  const emptyCourse = useMemo(
    () => createEmptyCourse(currentUser),
    [currentUser]
  );

  const [saving, setSaving] = useState(false);
  const [savingAsDraft, setSavingAsDraft] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
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
      create: { 
        title: isDraft ? "Saving Draft" : "Creating Course", 
        message: isDraft ? "Saving course as draft..." : "Saving your course data..." 
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
      create: { 
        title: isDraft ? "Draft Saved!" : "Course Created!", 
        message: isDraft 
          ? "Your course has been saved as draft." 
          : "Your course has been created successfully and is now live!" 
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

  // Initialize form for new course
  React.useEffect(() => {
    if (isAdmin) {
      setFormData({ ...emptyCourse, createdBy: currentUser?.uid || "" });
      setModules([]);
    }
  }, [isAdmin, currentUser, emptyCourse, setFormData, setModules]);

  // Handle Save as Draft
  const handleSaveDraft = async () => {
    const { isValid, errors: validationErrors } = validateForm();

    if (!isValid) {
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
      return;
    }

    setSavingAsDraft(true);

    try {
      showApiStartToast("create", true);

      const coursePayload = prepareCoursePayload(
        { ...course, isPublished: false },
        modules,
        currentUser,
        true // isNewCourse = true
      );

      console.log("Creating draft course:", coursePayload);

      const result = await createCourse(coursePayload);
      if (result?.success) {
        showApiSuccessToast("create", true);
        setTimeout(() => {
          navigate("/admin/courses");
        }, 1500);
      } else {
        throw new Error(result?.error || "Failed to save draft");
      }
    } catch (error) {
      console.error("Failed to save draft:", error);
      const friendlyMessage = extractErrorMessage(error);
      const prefix = "Draft creation failed";
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

    const { isValid, errors: validationErrors } = validateForm();

    if (!isValid) {
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
      return;
    }

    setSaving(true);

    try {
      showApiStartToast("create", false);

      const coursePayload = prepareCoursePayload(
        { ...course, isPublished: true },
        modules,
        currentUser,
        true // isNewCourse = true
      );

      console.log("Publishing new course:", coursePayload);

      const result = await createCourse(coursePayload);
      if (result?.success) {
        showApiSuccessToast("create", false);
        setTimeout(() => {
          navigate("/admin/courses");
        }, 1500);
      } else {
        throw new Error(result?.error || "Failed to publish course");
      }
    } catch (error) {
      console.error("Failed to publish course:", error);
      const friendlyMessage = extractErrorMessage(error);
      const prefix = "Course publication failed";
      const normalizedFriendly = friendlyMessage?.trim();
      const finalMessage = normalizedFriendly
        ? normalizedFriendly.toLowerCase().includes(prefix.toLowerCase())
          ? normalizedFriendly
          : `${prefix}: ${normalizedFriendly}`
        : prefix;
      
      showToast(finalMessage, "error", "Publish Failed");
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
        onOpenPracticeQuiz={() => showToast("Please save the course first to add assessments.", "info")}
        onOpenAssignment={() => showToast("Please save the course first to add assignments.", "info")}
        onOpenModuleAssessment={() => showToast("Please save the course first to add module assessments.", "info")}
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
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  const breadcrumbItems = [
    { label: "Admin", link: "/admin" },
    { label: "Courses", link: "/admin/courses" },
    { label: "Create Course", link: null },
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
        title="Create New Course"
        description="Add a new course to the platform"
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
                {savingAsDraft ? "Saving Draft..." : "Save as Draft"}
              </button>

              {/* Publish Button */}
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
                {saving ? "Publishing..." : "Publish Course"}
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
    </PageContainer>
  );
};

export default CourseCreateForm;