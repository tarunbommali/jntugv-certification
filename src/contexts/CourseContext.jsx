import React, { createContext, useContext } from 'react';
import { useCourses } from '../hooks/useFirebase';

const CourseContext = createContext(undefined);

export const useCourseContext = () => {
  const ctx = useContext(CourseContext);
  if (!ctx) throw new Error('useCourseContext must be used within CourseProvider');
  return ctx;
};

export const CourseProvider = ({ children }) => {
  const { courses, loading, error, refreshCourses } = useCourses();

  const value = {
    courses,
    loading,
    error,
    refreshCourses,
    // Helper to quickly find a course by ID
    getCourseById: (id) => courses.find(c => String(c.id) === String(id)),
  };

  return (
    <CourseContext.Provider value={value}>
      {children}
    </CourseContext.Provider>
  );
};