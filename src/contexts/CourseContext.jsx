/* eslint-disable no-unused-vars */
// src/contexts/CourseContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  getCourseById,
  deleteCourse as deleteCourseService,
} from "../firebase/services_modular/courseOperations";
import {
  useRealtimeCourses,
  useRealtimeCourseMutations,
} from "../hooks/useRealtimeFirebase";

const CourseContext = createContext(undefined);

// Custom hook for Firebase operations
const useCourseOperations = () => {
  // Use real-time courses hook (onSnapshot under the hood)
  const {
    data: realtimeCourses,
    loading: realtimeLoading,
    error: realtimeError,
  } = useRealtimeCourses({ limitCount: 200, publishedOnly: false });

  const { createCourse: createCourseMut, updateCourse: updateCourseMut } =
    useRealtimeCourseMutations();

  const [error, setError] = useState(null);

  // Fetch all courses
  const fetchCourses = useCallback(
    async (options = {}) => {
      const { forceRefresh = false, limit = 50 } = options;
      // With real-time listener the data is kept in realtimeCourses and
      // automatically updated via onSnapshot. We still keep this method to
      // preserve the previous API surface and allow consumers to force a
      // non-real-time refresh if needed (not implemented here).
      if (!forceRefresh) return;
      // If a forced refresh is requested, fall back to client-side cache
      // refresh by simply clearing any local error state. Caller may chain
      // additional logic if needed.
      setError(null);
    },
    []
  );

  // Fetch single course by ID
  const fetchCourseById = useCallback(async (courseId) => {
    if (!courseId) throw new Error("Course ID is required");
    // One-off fetch for a specific course (useful in admin edit flows).
    setError(null);
    try {
      const result = await getCourseById(courseId);
      if (result.success) return result.data;
      setError(result.error || "Course not found");
      return null;
    } catch (err) {
      setError(err.message || "Failed to fetch course");
      return null;
    }
  }, []);

  // Create new course
  const addCourse = async (courseData) => {
    setError(null);
    try {
      const result = await createCourseMut(courseData);
      if (result?.success) return result.data || { id: result.data?.id };
      setError(result?.error || "Failed to create course");
      return null;
    } catch (err) {
      setError(err.message || "Failed to create course");
      return null;
    }
  };

  // Update existing course
  const updateCourseById = async (courseId, updateData) => {
    if (!courseId) {
      throw new Error("Course ID is required");
    }
    setError(null);
    try {
      const result = await updateCourseMut(courseId, updateData);
      if (result?.success) return true;
      setError(result?.error || "Failed to update course");
      return false;
    } catch (err) {
      setError(err.message || "Failed to update course");
      return false;
    }
  };

  // Delete course
  const removeCourse = async (courseId) => {
    if (!courseId) {
      throw new Error("Course ID is required");
    }
    setError(null);
    try {
      const result = await deleteCourseService(courseId);
      if (result.success) return true;
      setError(result.error || "Failed to delete course");
      return false;
    } catch (err) {
      setError(err.message || "Failed to delete course");
      return false;
    }
  };

  // Toggle course publish status
  const toggleCoursePublish = async (courseId, publishStatus) => {
    return await updateCourseById(courseId, {
      isPublished: publishStatus,
      status: publishStatus ? "published" : "draft",
    });
  };

  // Clear error
  const clearError = () => setError(null);

  return {
    // Use real-time course list as source-of-truth
    courses: realtimeCourses || [],
    loading: realtimeLoading,
    error: error || realtimeError,
    fetchCourses,
    fetchCourseById,
    addCourse,
    updateCourseById,
    removeCourse,
    toggleCoursePublish,
    clearError,
  };
};

export const useCourseContext = () => {
  const ctx = useContext(CourseContext);
  if (!ctx)
    throw new Error("useCourseContext must be used within CourseProvider");
  return ctx;
};

export const CourseProvider = ({ children }) => {
  const courseOperations = useCourseOperations();

  // Auto-fetch courses on provider mount
  useEffect(() => {
    courseOperations.fetchCourses();
  }, []);

  const value = {
    // State
    courses: courseOperations.courses,
    loading: courseOperations.loading,
    error: courseOperations.error,

    // Operations
    refreshCourses: () => courseOperations.fetchCourses({ forceRefresh: true }),
    getCourseById: (id) =>
      courseOperations.courses.find((c) => String(c.id) === String(id)),
    fetchCourseById: courseOperations.fetchCourseById,
    createCourse: courseOperations.addCourse,
    updateCourse: courseOperations.updateCourseById,
    deleteCourse: courseOperations.removeCourse,
    toggleCoursePublish: courseOperations.toggleCoursePublish,
    clearError: courseOperations.clearError,

    // Helper methods
    getPublishedCourses: () =>
      courseOperations.courses.filter((course) => course.isPublished),
    getDraftCourses: () =>
      courseOperations.courses.filter((course) => !course.isPublished),
    getFeaturedCourses: () =>
      courseOperations.courses.filter((course) => course.isFeatured),
    getCoursesByCategory: (category) =>
      courseOperations.courses.filter((course) => course.category === category),
    getCoursesByInstructor: (instructor) =>
      courseOperations.courses.filter((course) =>
        course.instructor?.toLowerCase().includes(instructor.toLowerCase())
      ),

    // Statistics
    getCourseStats: () => ({
      total: courseOperations.courses.length,
      published: courseOperations.courses.filter((c) => c.isPublished).length,
      drafts: courseOperations.courses.filter((c) => !c.isPublished).length,
      featured: courseOperations.courses.filter((c) => c.isFeatured).length,
      totalEnrollments: courseOperations.courses.reduce(
        (sum, course) => sum + (course.totalEnrollments || 0),
        0
      ),
    }),
  };

  return (
    <CourseContext.Provider value={value}>{children}</CourseContext.Provider>
  );
};

export default CourseContext;