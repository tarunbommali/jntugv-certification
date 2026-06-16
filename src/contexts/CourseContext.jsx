import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { coursesApi } from "../api/index.js";
import { useAuth } from "./AuthContext.jsx";

const CourseContext = createContext(undefined);

const normalizeCourse = (course) => {
  if (!course) return course;
  return {
    ...course,
    modules: Array.isArray(course.modules) ? course.modules : [],
    tags: Array.isArray(course.tags) ? course.tags : [],
    requirements: Array.isArray(course.requirements) ? course.requirements : [],
    whatYouLearn: Array.isArray(course.whatYouLearn) ? course.whatYouLearn : [],
    isPublished: Boolean(course.isPublished),
    isFeatured: Boolean(course.isFeatured),
    isBestseller: Boolean(course.isBestseller),
    contentType: course.contentType || 'modules',
    imageUrl: course.thumbnail || course.imageUrl || null,
  };
};

export const CourseProvider = ({ children }) => {
  const { isAdmin } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const loadingRef = useRef(false);

  const fetchCourses = useCallback(async (options = {}) => {
    const { forceRefresh = false } = options;
    if (loadingRef.current && !forceRefresh) return;

    loadingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const data = isAdmin
        ? await coursesApi.getAdminCourses()
        : await coursesApi.getCourses();
      const normalized = Array.isArray(data) ? data.map(normalizeCourse) : [];
      setCourses(normalized);
      return normalized;
    } catch (err) {
      setError(err?.message || "Failed to load courses");
      setCourses([]);
      return [];
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    // When isAdmin changes (e.g., after auth loads), force a refresh 
    // so we don't skip fetching if it was already loading public courses.
    fetchCourses({ forceRefresh: true });
  }, [fetchCourses]);

  const fetchCourseById = useCallback(async (courseId) => {
    if (!courseId) throw new Error("Course ID is required");

    const cached = courses.find((course) => String(course.id) === String(courseId));
    if (cached) return cached;

    try {
      const course = await coursesApi.getCourseById(courseId);
      const normalized = normalizeCourse(course);
      setError(null);
      setCourses((prev) => {
        const exists = prev.some((item) => String(item.id) === String(courseId));
        return exists ? prev : [normalized, ...prev];
      });
      return normalized;
    } catch (err) {
      setError(err?.message || "Failed to fetch course");
      throw err;
    }
  }, [courses]);

  const createCourse = useCallback(async (payload) => {
    const result = await coursesApi.createCourse(payload);

    if (!result?.success) {
      const message = result?.error || "Failed to create course";
      setError(message);
      return { success: false, error: message, payload: result?.payload, status: result?.status };
    }

    const createdCourse = normalizeCourse(result.data?.course ?? result.data);
    setError(null);
    setCourses((prev) => [createdCourse, ...prev]);
    return { success: true, data: createdCourse, message: result.data?.message };
  }, []);

  const updateCourse = useCallback(async (courseId, payload) => {
    if (!courseId) {
      const message = "Course ID is required";
      setError(message);
      return { success: false, error: message };
    }

    const result = await coursesApi.updateCourse(courseId, payload);

    if (!result?.success) {
      const message = result?.error || "Failed to update course";
      setError(message);
      return { success: false, error: message, payload: result?.payload, status: result?.status };
    }

    const updatedCourse = normalizeCourse(result.data?.course ?? result.data);
    setError(null);
    setCourses((prev) => prev.map((course) => (String(course.id) === String(courseId) ? updatedCourse : course)));
    return { success: true, data: updatedCourse, message: result.data?.message };
  }, []);

  const deleteCourse = useCallback(async (courseId) => {
    if (!courseId) throw new Error("Course ID is required");
    try {
      await coursesApi.deleteCourse(courseId);
      setCourses((prev) => prev.filter((course) => String(course.id) !== String(courseId)));
      return true;
    } catch (err) {
      setError(err?.message || "Failed to delete course");
      throw err;
    }
  }, []);

  const toggleCoursePublish = useCallback(async (courseId, publishStatus) => updateCourse(courseId, {
    isPublished: publishStatus,
    status: publishStatus ? "published" : "draft",
  }), [updateCourse]);

  const clearError = useCallback(() => setError(null), []);

  const value = useMemo(() => ({
    courses,
    loading,
    error,
    refreshCourses: (options) => fetchCourses({ forceRefresh: true, ...options }),
    fetchCourses,
    getCourseById: (courseId) => courses.find((course) => String(course.id) === String(courseId)) || null,
    fetchCourseById,
  createCourse,
  updateCourse,
    deleteCourse,
    toggleCoursePublish,
    clearError,
    getPublishedCourses: () => courses.filter((course) => course.isPublished),
    getDraftCourses: () => courses.filter((course) => !course.isPublished),
    getFeaturedCourses: () => courses.filter((course) => course.isFeatured),
    getCoursesByCategory: (category) => courses.filter((course) => course.category === category),
    getCoursesByInstructor: (instructor) => courses.filter((course) => course.instructor?.toLowerCase().includes(instructor.toLowerCase())),
    getCourseStats: () => ({
      total: courses.length,
      published: courses.filter((course) => course.status === 'published').length,
      drafts: courses.filter((course) => course.status === 'draft').length,
      featured: courses.filter((course) => course.isFeatured).length,
      totalEnrollments: courses.reduce((sum, course) => sum + (course.totalEnrollments || 0), 0),
    }),
  }), [clearError, courses, createCourse, deleteCourse, error, fetchCourseById, fetchCourses, loading, toggleCoursePublish, updateCourse]);

  return (
    <CourseContext.Provider value={value}>{children}</CourseContext.Provider>
  );
};

export const useCourseContext = () => {
  const ctx = useContext(CourseContext);
  if (!ctx) throw new Error("useCourseContext must be used within CourseProvider");
  return ctx;
};

export default CourseContext;