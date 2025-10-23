/* eslint-disable no-unused-vars */
// src/contexts/CourseContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../firebase/services_modular/courseOperations";

const CourseContext = createContext(undefined);

// Custom hook for Firebase operations
const useCourseOperations = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all courses
  const fetchCourses = useCallback(
    async (options = {}) => {
      const { forceRefresh = false, limit = 50 } = options;

      if (courses.length > 0 && !forceRefresh) return;

      setLoading(true);
      setError(null);

      try {
        const result = await getAllCourses(limit);
        if (result.success) {
          setCourses(result.data || []);
        } else {
          setError(result.error || "Failed to fetch courses");
        }
      } catch (err) {
        setError(err.message || "An error occurred while fetching courses");
      } finally {
        setLoading(false);
      }
    },
    [courses]
  );

  // Fetch single course by ID
  const fetchCourseById = useCallback(async (courseId) => {
    if (!courseId) throw new Error("Course ID is required");

    setLoading(true);
    setError(null);

    try {
      const result = await getCourseById(courseId);
      if (result.success) {
        return result.data;
      } else {
        setError(result.error || "Course not found");
        return null;
      }
    } catch (err) {
      setError(err.message || "Failed to fetch course");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new course
  const addCourse = async (courseData) => {
    setLoading(true);
    setError(null);

    try {
      const result = await createCourse(courseData);

      if (result.success) {
        // Add the new course to local state
        setCourses((prev) => [result.data, ...prev]);
        return result.data;
      } else {
        setError(result.error || "Failed to create course");
        return null;
      }
    } catch (err) {
      setError(err.message || "Failed to create course");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update existing course
  const updateCourseById = async (courseId, updateData) => {
    if (!courseId) {
      throw new Error("Course ID is required");
    }

    setLoading(true);
    setError(null);

    try {
      const result = await updateCourse(courseId, updateData);

      if (result.success) {
        // Update course in local state
        setCourses((prev) =>
          prev.map((course) =>
            course.id === courseId
              ? {
                  ...course,
                  ...updateData,
                  updatedAt: new Date().toISOString(),
                }
              : course
          )
        );
        return true;
      } else {
        setError(result.error || "Failed to update course");
        return false;
      }
    } catch (err) {
      setError(err.message || "Failed to update course");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Delete course
  const removeCourse = async (courseId) => {
    if (!courseId) {
      throw new Error("Course ID is required");
    }

    setLoading(true);
    setError(null);

    try {
      // Note: You'll need to implement deleteCourse in your firebaseService
      const result = await deleteCourse(courseId);

      if (result.success) {
        // Remove course from local state
        setCourses((prev) => prev.filter((course) => course.id !== courseId));
        return true;
      } else {
        setError(result.error || "Failed to delete course");
        return false;
      }
    } catch (err) {
      setError(err.message || "Failed to delete course");
      return false;
    } finally {
      setLoading(false);
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
    courses,
    loading,
    error,
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