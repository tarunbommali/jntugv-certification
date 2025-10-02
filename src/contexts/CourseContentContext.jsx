import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  getCourseContent, 
  getModuleContent, 
  getUserProgress, 
  updateUserProgress,
  checkUserEnrollment 
} from '../firebase/services';
import { useAuth } from './AuthContext';

const CourseContentContext = createContext(undefined);

export const useCourseContent = () => {
  const ctx = useContext(CourseContentContext);
  if (!ctx) throw new Error('useCourseContent must be used within CourseContentProvider');
  return ctx;
};

export const CourseContentProvider = ({ children }) => {
  const { currentUser, isAuthenticated } = useAuth();
  
  // Course content state
  const [courseContent, setCourseContent] = useState([]);
  const [currentModule, setCurrentModule] = useState(null);
  const [loadingContent, setLoadingContent] = useState(false);
  const [contentError, setContentError] = useState(null);
  
  // User progress state
  const [userProgress, setUserProgress] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(false);
  const [progressError, setProgressError] = useState(null);
  
  // Enrollment state
  const [enrollmentStatus, setEnrollmentStatus] = useState({
    isEnrolled: false,
    enrollment: null,
    loading: false,
    error: null
  });

  // Fetch course content
  const fetchCourseContent = async (courseId) => {
    if (!courseId) return;

    try {
      setLoadingContent(true);
      setContentError(null);

      const result = await getCourseContent(courseId);
      if (result.success) {
        setCourseContent(result.data);
        // Set first module as current if no module is selected
        if (result.data.length > 0 && !currentModule) {
          setCurrentModule(result.data[0]);
        }
      } else {
        setContentError(result.error);
        setCourseContent([]);
      }
    } catch (err) {
      console.error('Failed to fetch course content:', err);
      setContentError('Failed to load course content.');
      setCourseContent([]);
    } finally {
      setLoadingContent(false);
    }
  };

  // Fetch specific module content
  const fetchModuleContent = async (courseId, moduleId) => {
    if (!courseId || !moduleId) return;

    try {
      const result = await getModuleContent(courseId, moduleId);
      if (result.success) {
        setCurrentModule(result.data);
      } else {
        console.error('Failed to fetch module content:', result.error);
      }
    } catch (err) {
      console.error('Failed to fetch module content:', err);
    }
  };

  // Fetch user progress for a course
  const fetchUserProgress = async (courseId) => {
    if (!courseId || !currentUser?.uid) return;

    try {
      setLoadingProgress(true);
      setProgressError(null);

      const result = await getUserProgress(currentUser.uid, courseId);
      if (result.success) {
        setUserProgress(result.data);
      } else {
        setProgressError(result.error);
        setUserProgress(null);
      }
    } catch (err) {
      console.error('Failed to fetch user progress:', err);
      setProgressError('Failed to load learning progress.');
      setUserProgress(null);
    } finally {
      setLoadingProgress(false);
    }
  };

  // Check enrollment status
  const checkEnrollment = async (courseId) => {
    if (!courseId || !currentUser?.uid) {
      setEnrollmentStatus({
        isEnrolled: false,
        enrollment: null,
        loading: false,
        error: null
      });
      return;
    }

    try {
      setEnrollmentStatus(prev => ({ ...prev, loading: true, error: null }));

      const result = await checkUserEnrollment(currentUser.uid, courseId);
      if (result.success) {
        setEnrollmentStatus({
          isEnrolled: result.data.isEnrolled,
          enrollment: result.data.enrollment,
          loading: false,
          error: null
        });
      } else {
        setEnrollmentStatus({
          isEnrolled: false,
          enrollment: null,
          loading: false,
          error: result.error
        });
      }
    } catch (err) {
      console.error('Failed to check enrollment:', err);
      setEnrollmentStatus({
        isEnrolled: false,
        enrollment: null,
        loading: false,
        error: 'Failed to check enrollment status'
      });
    }
  };

  // Update user progress
  const updateProgress = async (courseId, progressData) => {
    if (!courseId || !currentUser?.uid) {
      return { success: false, error: 'Course ID and user authentication required' };
    }

    try {
      const result = await updateUserProgress(currentUser.uid, courseId, progressData);
      if (result.success) {
        // Refresh progress data
        await fetchUserProgress(courseId);
      }
      return result;
    } catch (err) {
      console.error('Failed to update progress:', err);
      return { success: false, error: 'Failed to update learning progress' };
    }
  };

  // Mark video as watched
  const markVideoWatched = async (courseId, moduleId, videoId, watchedDuration, totalDuration) => {
    if (!courseId || !moduleId || !videoId) {
      return { success: false, error: 'Missing required parameters' };
    }

    const completionPercentage = Math.round((watchedDuration / totalDuration) * 100);
    
    const progressData = {
      [`moduleProgress.${moduleId}.videosWatched.${videoId}`]: {
        videoId,
        watchedDuration,
        totalDuration,
        completionPercentage,
        lastWatchedAt: new Date()
      },
      'overallProgress.lastAccessedAt': new Date()
    };

    return await updateProgress(courseId, progressData);
  };

  // Mark module as completed
  const markModuleCompleted = async (courseId, moduleId) => {
    if (!courseId || !moduleId) {
      return { success: false, error: 'Missing required parameters' };
    }

    const progressData = {
      [`moduleProgress.${moduleId}.isCompleted`]: true,
      [`moduleProgress.${moduleId}.completedAt`]: new Date(),
      'overallProgress.modulesCompleted': increment(1),
      'overallProgress.lastAccessedAt': new Date()
    };

    return await updateProgress(courseId, progressData);
  };

  // Get module progress
  const getModuleProgress = (moduleId) => {
    if (!userProgress || !userProgress.moduleProgress) return null;
    return userProgress.moduleProgress.find(mp => mp.moduleId === moduleId);
  };

  // Get video progress
  const getVideoProgress = (moduleId, videoId) => {
    const moduleProgress = getModuleProgress(moduleId);
    if (!moduleProgress || !moduleProgress.videosWatched) return null;
    return moduleProgress.videosWatched.find(vw => vw.videoId === videoId);
  };

  // Check if module is unlocked
  const isModuleUnlocked = (module, index) => {
    if (!module.unlockCondition) return true;
    
    if (module.unlockCondition === 'complete_previous') {
      // Check if previous module is completed
      const previousModule = courseContent[index - 1];
      if (!previousModule) return true;
      
      const previousProgress = getModuleProgress(previousModule.id);
      return previousProgress?.isCompleted || false;
    }
    
    return true;
  };

  // Clear course data (useful when navigating away from course)
  const clearCourseData = () => {
    setCourseContent([]);
    setCurrentModule(null);
    setUserProgress(null);
    setEnrollmentStatus({
      isEnrolled: false,
      enrollment: null,
      loading: false,
      error: null
    });
  };

  const value = useMemo(() => ({
    // Course content
    courseContent,
    currentModule,
    loadingContent,
    contentError,
    fetchCourseContent,
    fetchModuleContent,
    setCurrentModule,
    
    // User progress
    userProgress,
    loadingProgress,
    progressError,
    fetchUserProgress,
    updateProgress,
    markVideoWatched,
    markModuleCompleted,
    getModuleProgress,
    getVideoProgress,
    
    // Enrollment
    enrollmentStatus,
    checkEnrollment,
    
    // Helper functions
    isModuleUnlocked,
    clearCourseData,
    
    // Computed values
    totalModules: courseContent.length,
    completedModules: userProgress?.overallProgress?.modulesCompleted || 0,
    completionPercentage: userProgress?.overallProgress?.completionPercentage || 0,
    timeSpent: userProgress?.overallProgress?.timeSpent || 0,
  }), [
    courseContent,
    currentModule,
    loadingContent,
    contentError,
    userProgress,
    loadingProgress,
    progressError,
    enrollmentStatus,
    currentUser?.uid,
    isAuthenticated
  ]);

  return (
    <CourseContentContext.Provider value={value}>
      {children}
    </CourseContentContext.Provider>
  );
};
