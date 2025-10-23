/* eslint-disable no-unused-vars */
import { serverTimestamp } from "firebase/firestore";

export const mapUserToV2 = (raw) => {
  if (!raw) return null;
  return {
    uid: raw.uid ?? raw.id,
    name:
      raw.name ??
      raw.displayName ??
      [raw.firstName, raw.lastName].filter(Boolean).join(" "),
    email: raw.email,
    role: raw.isAdmin ? "admin" : raw.role ?? "user",
    university: raw.university ?? raw.college ?? "",
    skills: Array.isArray(raw.skills) ? raw.skills : [],
    totalCoursesEnrolled:
      typeof raw.totalCoursesEnrolled === "number"
        ? raw.totalCoursesEnrolled
        : 0,
    lastLoginAt: raw.lastLoginAt ?? null,
  };
};

export const mapCourseToV2 = (raw) => {
  if (!raw) return null;
  const modules = Array.isArray(raw.modules) ? raw.modules : [];
  const normalizedModules = modules.map((m, idx) => ({
    moduleKey: m.moduleKey ?? m.id ?? `M${idx + 1}`,
    moduleTitle: m.moduleTitle ?? m.title ?? `Module ${idx + 1}`,
    title: m.title ?? m.moduleTitle ?? `Module ${idx + 1}`,
    videos: Array.isArray(m.videos)
      ? m.videos.map((v, vIdx) => ({
          videoId: v.videoId ?? v.id ?? `V${vIdx + 1}`,
          videoKey: v.videoKey ?? v.url ?? "",
          title: v.title ?? `Video ${vIdx + 1}`,
        }))
      : [],
  }));

  return {
    courseId: raw.courseId ?? raw.id,
    courseTitle: raw.courseTitle ?? raw.title,
    courseDescription:
      raw.courseDescription ?? raw.description ?? raw.shortDescription ?? "",
    originalPrice:
      raw.originalPrice ??
      (typeof raw.price === "number" ? raw.price : undefined),
    coursePrice: raw.coursePrice ?? raw.price ?? 0,
    isPublished: Boolean(raw.isPublished),
    modules: normalizedModules,
  };
};

export const mapEnrollmentToV2 = (raw, id) => {
  if (!raw) return null;
  const enrollmentId = raw.enrollmentId ?? id;
  return {
    enrollmentId,
    userId: raw.userId,
    courseId: raw.courseId,
    courseTitle: raw.courseTitle ?? "",
    status: raw.status,
    paidAmount: raw.paidAmount ?? raw.amount ?? undefined,
    enrolledAt: raw.enrolledAt ?? null,
    paymentDetails:
      raw.paymentDetails ??
      (raw.paymentId
        ? {
            paymentId: raw.paymentId,
            paymentDate: raw.capturedAt ?? raw.createdAt ?? null,
          }
        : undefined),
  };
};

export const mapProgressToV2 = (raw, idKey) => {
  if (!raw) return null;
  const [userId, courseId] = (idKey ?? "").split("_");
  return {
    userCourseKey:
      raw.userCourseKey ?? idKey ?? `${raw.userId}_${raw.courseId}`,
    userId: raw.userId ?? userId,
    courseId: raw.courseId ?? courseId,
    completionPercentage:
      raw.completionPercentage ??
      raw.overallProgress?.completionPercentage ??
      0,
    videosWatched: Array.isArray(raw.videosWatched)
      ? raw.videosWatched
      : raw.moduleProgress?.flatMap(
          (m) =>
            m.videosWatched?.map((v) => ({
              videoId: v.videoId,
              completed: (v.completionPercentage ?? 0) >= 100,
              progress: v.completionPercentage ?? 0,
            })) ?? []
        ) ?? [],
    lastAccessedAt:
      raw.lastAccessedAt ?? raw.overallProgress?.lastAccessedAt ?? null,
  };
};

export const normalizeFirestoreError = (error) => {
  const raw = String(error?.message || error || "Unknown error");
  const lower = raw.toLowerCase();
  if (lower.includes("requires an index"))
    return { code: "INDEX_REQUIRED", message: raw };
  if (lower.includes("permission-denied") || lower.includes("permission"))
    return { code: "PERMISSION_DENIED", message: raw };
  if (lower.includes("unavailable") || lower.includes("network"))
    return { code: "NETWORK_ERROR", message: raw };
  return { code: "UNKNOWN", message: raw };
};

export default {
  mapUserToV2,
  mapCourseToV2,
  mapEnrollmentToV2,
  mapProgressToV2,
  normalizeFirestoreError,
};
