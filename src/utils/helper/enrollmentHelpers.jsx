/* eslint-disable no-unused-vars */
// src/utils/helper/enrollmentHelpers.jsx

import {
  CheckCircle,
  AlertCircle,
  XCircle,
} from "lucide-react";

export const getStatusIcon = (status) => {
  switch (status) {
    case "SUCCESS":
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    case "PENDING":
      return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    case "FAILED":
      return <XCircle className="w-4 h-4 text-red-500" />;
    default:
      return <AlertCircle className="w-4 h-4 text-muted" />;
  }
};

export const getStatusColor = (status) => {
  switch (status) {
    case "SUCCESS":
      return "bg-green-100 text-green-800";
    case "PENDING":
      return "bg-yellow-100 text-yellow-800";
    case "FAILED":
      return "bg-red-100 text-red-800";
    default:
      return "bg-surface-elevated text-foreground";
  }
};

export const getUniqueStatuses = (enrollments) => {
  const statuses = [...new Set(enrollments.map((e) => e.status))];
  return statuses;
};

export const getPublishedCourses = (courses) => {
  return courses.filter((course) => course.isPublished === true);
};

export const filterEnrollments = (enrollments, filters) => {
  const { searchTerm, statusFilter, userFilter, courseFilter } = filters;

  return enrollments.filter((enrollment) => {
    const userDisplayName = enrollment.user?.username || "";
    const userEmail = enrollment.user?.email || "";
    const courseTitle = enrollment.course?.title || "";

    const matchesSearch =
      userDisplayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      courseTitle.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "ALL" || enrollment.status === statusFilter;
    const matchesUser =
      userFilter === "ALL" || String(enrollment.userId) === String(userFilter);
    const matchesCourse =
      courseFilter === "ALL" || String(enrollment.courseId) === String(courseFilter);

    return matchesSearch && matchesStatus && matchesUser && matchesCourse;
  });
};

export const calculateStats = (enrollments) => {
  const total = enrollments.length;
  const successful = enrollments.filter((e) => e.status === "SUCCESS").length;
  const pending = enrollments.filter((e) => e.status === "PENDING").length;
  const totalRevenue = enrollments.reduce((sum, e) => sum + (e.paidAmount || 0), 0);

  return { total, successful, pending, totalRevenue };
};

const clampPercentage = (value, min = 0, max = 100) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return min;
  return Math.min(max, Math.max(min, numeric));
};

const parseObject = (value, fallback = {}) => {
  if (!value) return { ...fallback };
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return parsed && typeof parsed === 'object' ? parsed : { ...fallback };
    } catch {
      return { ...fallback };
    }
  }
  if (typeof value === 'object') return { ...value };
  return { ...fallback };
};

const normalizeTaskProgress = (rawProgress = {}) => {
  const toInt = (value) => {
    const num = Number.parseInt(value, 10);
    return Number.isFinite(num) ? Math.max(0, num) : 0;
  };

  const source = parseObject(rawProgress);

  const totalTasks = toInt(source.totalTasks ?? source.total ?? 0);
  const completedTasksRaw = toInt(source.completedTasks ?? source.completed ?? 0);
  const completedTasks = Math.min(totalTasks, completedTasksRaw);
  const completionDerived = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const completionSource = Number(source.completionPercentage ?? completionDerived);
  const completionPercentage = clampPercentage(
    Number.isFinite(completionSource) ? completionSource : completionDerived
  );

  return {
    totalTasks,
    completedTasks,
    completionPercentage: Number(Number(completionPercentage).toFixed(2)),
    validated: Boolean(source.validated ?? source.manualValidation ?? false),
    manualNotes: typeof source.manualNotes === 'string'
      ? source.manualNotes.trim()
      : null,
    validatedAt: source.validatedAt || null,
    validatedBy: source.validatedBy || null,
  };
};

const normalizeVideoProgress = (rawProgress = {}) => {
  const source = parseObject(rawProgress);

  const toInt = (value) => {
    const num = Number.parseInt(value, 10);
    return Number.isFinite(num) ? Math.max(0, num) : 0;
  };

  const totalVideos = toInt(
    source.totalVideos ?? source.totalLessons ?? source.total ?? source.videoCount ?? 0
  );
  const completedVideos = Math.min(
    totalVideos,
    toInt(source.completedVideos ?? source.completedLessons ?? source.completed ?? 0)
  );
  const totalModules = toInt(source.totalModules ?? source.modulesTotal ?? 0);
  const modulesCompleted = Math.min(
    totalModules,
    toInt(source.modulesCompleted ?? source.completedModules ?? 0)
  );

  const completionFromVideos = totalVideos > 0
    ? (completedVideos / totalVideos) * 100
    : (totalModules > 0 ? (modulesCompleted / totalModules) * 100 : 0);

  const completionSource = Number(
    source.completionPercentage ?? source.percent ?? completionFromVideos
  );

  const completionPercentage = clampPercentage(
    Number.isFinite(completionSource) ? completionSource : completionFromVideos
  );

  return {
    totalVideos,
    completedVideos,
    totalModules,
    modulesCompleted,
    completionPercentage: Number(Number(completionPercentage).toFixed(2)),
    lastPlayed: source.lastPlayed ?? null,
    raw: source,
  };
};

// New function to clean enrollment data for display
export const getCleanEnrollmentData = (enrollment) => {
  const taskProgress = normalizeTaskProgress(enrollment.taskProgress || enrollment.progress?.tasks || {});
  const progress = normalizeVideoProgress(enrollment.progress || {});

  return {
    id: enrollment.id,
    userId: enrollment.userId,
    courseId: enrollment.courseId,
    courseTitle: enrollment.courseTitle || enrollment.course?.title || null,
    status: enrollment.status || "PENDING",
    paidAmount: enrollment.paidAmount || 0,
    enrolledAt: enrollment.enrolledAt,
    paymentDetails: enrollment.paymentDetails || {},
    taskProgress,
    progress,
    certificateDownloadable: Boolean(enrollment.certificateDownloadable),
    certificateUnlockedAt: enrollment.certificateUnlockedAt || null,
    certificateIssued: Boolean(enrollment.certificateIssued),

    // User data (if available)
    user: enrollment.user
      ? {
          username: enrollment.user.username || "Unknown User",
          email: enrollment.user.email || "No email",
          uid: enrollment.user.uid,
        }
      : null,

    // Course data (if available)
    course: enrollment.course
      ? {
          title: enrollment.course.title || "Unknown Course",
          category: enrollment.course.category || "Uncategorized",
          isPublished: enrollment.course.isPublished || false,
          price: enrollment.course.price || 0,
        }
      : null,
  };
};

// Function to validate enrollment has required data
export const isValidEnrollment = (enrollment) => {
  return (
    enrollment &&
    enrollment.id &&
    enrollment.userId &&
    enrollment.courseId &&
    enrollment.status
  );
};
