import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  getAllCourses, 
  getCourseById, 
  getUserEnrollments, 
  checkUserEnrollment,
  getUserProfile,
  getAllUsersData,
  createEnrollment,
  updateUserProfile
} from '../firebase/services';

// Generic hook for Firebase operations with loading states
export const useFirebaseOperation = (operation, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fetchPromiseRef = useRef(null);

  const execute = useCallback(async (...args) => {
    if (fetchPromiseRef.current) {
      return fetchPromiseRef.current;
    }

    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await operation(...args);
        
        if (result.success) {
          setData(result.data);
          return result.data;
        } else {
          setError(result.error);
          return null;
        }
      } catch (err) {
        console.error('Firebase operation error:', err);
        setError(err.message);
        return null;
      } finally {
        setLoading(false);
        fetchPromiseRef.current = null;
      }
    };

    fetchPromiseRef.current = run;
    return run();
  }, dependencies);

  return { data, loading, error, execute };
};

// Hook for courses data
export const useCourses = () => {
  const { data: courses, loading, error, execute } = useFirebaseOperation(getAllCourses);
  
  useEffect(() => {
    execute();
  }, [execute]);

  return { courses: courses || [], loading, error, refreshCourses: execute };
};

// Hook for single course data
export const useCourse = (courseId) => {
  const { data: course, loading, error, execute } = useFirebaseOperation(getCourseById);
  
  useEffect(() => {
    if (courseId) {
      execute(courseId);
    }
  }, [courseId, execute]);

  return { course, loading, error, refreshCourse: () => execute(courseId) };
};

// Hook for user enrollments
export const useUserEnrollments = (userId) => {
  const { data: enrollments, loading, error, execute } = useFirebaseOperation(getUserEnrollments);
  
  useEffect(() => {
    if (userId) {
      execute(userId);
    }
  }, [userId, execute]);

  const isEnrolled = useCallback((courseId) => {
    return enrollments?.some(e => String(e.courseId) === String(courseId)) || false;
  }, [enrollments]);

  return { 
    enrollments: enrollments || [], 
    loading, 
    error, 
    isEnrolled,
    refreshEnrollments: () => execute(userId)
  };
};

// Hook for enrollment status check
export const useEnrollmentStatus = (userId, courseId) => {
  const { data, loading, error, execute } = useFirebaseOperation(checkUserEnrollment);
  
  useEffect(() => {
    if (userId && courseId) {
      execute(userId, courseId);
    }
  }, [userId, courseId, execute]);

  return { 
    isEnrolled: data?.isEnrolled || false, 
    enrollment: data?.enrollment || null,
    loading, 
    error 
  };
};

// Hook for user profile
export const useUserProfile = (userId) => {
  const { data: profile, loading, error, execute } = useFirebaseOperation(getUserProfile);
  
  useEffect(() => {
    if (userId) {
      execute(userId);
    }
  }, [userId, execute]);

  return { profile, loading, error, refreshProfile: () => execute(userId) };
};

// Hook for admin users data
export const useAdminUsers = (limit = 100) => {
  const { data: users, loading, error, execute } = useFirebaseOperation(getAllUsersData);
  
  useEffect(() => {
    execute(limit);
  }, [execute, limit]);

  return { users: users || [], loading, error, refreshUsers: () => execute(limit) };
};

// Hook for enrollment creation
export const useCreateEnrollment = () => {
  const { data, loading, error, execute } = useFirebaseOperation(createEnrollment);
  
  const createEnrollmentRecord = useCallback(async (enrollmentData) => {
    return await execute(enrollmentData);
  }, [execute]);

  return { 
    createEnrollment: createEnrollmentRecord, 
    enrollment: data, 
    loading, 
    error 
  };
};

// Hook for profile updates
export const useUpdateProfile = () => {
  const { loading, error, execute } = useFirebaseOperation(updateUserProfile);
  
  const updateProfile = useCallback(async (userId, updateData) => {
    return await execute(userId, updateData);
  }, [execute]);

  return { updateProfile, loading, error };
};