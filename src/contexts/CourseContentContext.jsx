// src/contexts/CourseContentContext.jsx

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { 
    getCourseContent, 
    getUserProgress, 
    updateUserProgress,
    checkUserEnrollment 
} from '../firebase/services'; // Assuming services are defined
import { useAuth } from './AuthContext';
// Using a mock increment since we can't import from firebase/firestore here
const increment = (value) => value; 

// 🚨 FALLBACK IMPORTS (Add these based on your file structure)
import { EMERGING_TECH_COURSE_CONTENT, FALLBACK_ENROLLMENT_STATUS, FALLBACK_COURSE_ID } from '../utils/fallbackData'; 


const CourseContentContext = createContext(undefined);

export const useCourseContent = () => {
    const ctx = useContext(CourseContentContext);
    if (!ctx) throw new Error('useCourseContent must be used within CourseContentProvider');
    return ctx;
};

export const CourseContentProvider = ({ children }) => {
    const { currentUser, isAuthenticated } = useAuth();
    
    const [courseContent, setCourseContent] = useState([]);
    const [currentModule, setCurrentModule] = useState(null);
    const [loadingContent, setLoadingContent] = useState(false);
    const [contentError, setContentError] = useState(null);
    
    const [userProgress, setUserProgress] = useState(null);
    const [loadingProgress, setLoadingProgress] = useState(false);
    const [progressError, setProgressError] = useState(null);
    
    const [enrollmentStatus, setEnrollmentStatus] = useState({
        isEnrolled: false,
        enrollment: null,
        loading: false,
        error: null
    });

    // --- Core Enrollment Check with Fallback ---
    const checkEnrollment = useCallback(async (courseId) => {
        if (!courseId || !currentUser?.uid) {
            return { isEnrolled: false, error: null };
        }

        try {
            const result = await checkUserEnrollment(currentUser.uid, courseId);
            if (result.success) {
                const status = { isEnrolled: result.data.isEnrolled, enrollment: result.data.enrollment, error: null };
                setEnrollmentStatus(status);
                return status;
            } else {
                throw new Error(result.error || 'Enrollment check failed.');
            }
        } catch (err) {
            console.error('Failed to check enrollment from DB:', err);
            
            // 🚨 FALLBACK ENROLLMENT 🚨
            if (courseId === FALLBACK_COURSE_ID) {
                setEnrollmentStatus(FALLBACK_ENROLLMENT_STATUS);
                return FALLBACK_ENROLLMENT_STATUS;
            } else {
                const status = { isEnrolled: false, enrollment: null, error: 'Failed to check enrollment status' };
                setEnrollmentStatus(status);
                return status;
            }
        }
    }, [currentUser?.uid]);

    // --- Core Content Fetch with Enrollment Gate and Fallback ---
    const fetchCourseContent = useCallback(async (courseId) => {
        if (!courseId || !isAuthenticated || !currentUser) {
            setLoadingContent(false);
            return;
        }

        setLoadingContent(true);
        setContentError(null);
        
        // 1. Check Enrollment Status (The Access Gate)
        const currentEnrollmentStatus = await checkEnrollment(courseId);

        if (!currentEnrollmentStatus.isEnrolled) {
            setLoadingContent(false);
            // Don't set content error, let the component redirect.
            return; 
        }

        // 2. Fetch Content (Only if enrolled or in fallback mode)
        try {
            const result = await getCourseContent(courseId);
            
            if (result.success && result.data.length > 0) {
                setCourseContent(result.data);
                if (!currentModule) {
                    setCurrentModule(result.data[0]);
                }
            } else {
                throw new Error(result.error || "No course content found in DB.");
            }
        } catch (err) {
            console.error('Failed to fetch course content:', err);
            
            // 🚨 FALLBACK CONTENT 🚨
            if (courseId === FALLBACK_COURSE_ID && currentEnrollmentStatus.isEnrolled) {
                setCourseContent(EMERGING_TECH_COURSE_CONTENT);
                setCurrentModule(EMERGING_TECH_COURSE_CONTENT[0]);
                setContentError('Using hardcoded demo content due to database error (Index Required).');
            } else {
                setContentError('Failed to load course content.');
                setCourseContent([]);
            }
        } finally {
            setLoadingContent(false);
        }
    }, [isAuthenticated, currentUser, checkEnrollment, currentModule]); 
    
    // Fetch user progress for a course (Wrapped in useCallback)
    const fetchUserProgress = useCallback(async (courseId) => {
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
    }, [currentUser?.uid]);


    // Update user progress
    const updateProgress = useCallback(async (courseId, progressData) => {
        // ... (Update Progress logic)
        return { success: true };
    }, [currentUser?.uid, fetchUserProgress]);

    const markVideoWatched = useCallback(async (courseId, moduleId, videoId, watchedDuration, totalDuration) => updateProgress(courseId, {}), [updateProgress]);
    const markModuleCompleted = useCallback(async (courseId, moduleId) => updateProgress(courseId, {}), [updateProgress]);
    
    // Get module progress (simplified for map)
    const getModuleProgress = useCallback((moduleId) => {
        // You may need to adapt this based on your userProgress structure (e.g., if moduleProgress is an array vs object)
        if (!userProgress || !userProgress.moduleProgress) return null;
        if (Array.isArray(userProgress.moduleProgress)) {
            return userProgress.moduleProgress.find(mp => mp.moduleId === moduleId);
        }
        // Assuming it's an object/map:
        return userProgress.moduleProgress[moduleId]; 
    }, [userProgress]); 

    const getVideoProgress = useCallback((moduleId, videoId) => {
        const moduleProgress = getModuleProgress(moduleId);
        return moduleProgress?.videosWatched?.[videoId] || null;
    }, [getModuleProgress]);

    const isModuleUnlocked = useCallback((module, index) => {
        // Basic demo unlock logic
        if (index === 0) return true;
        
        if (module.unlockCondition === 'complete_previous') {
             const previousModule = courseContent[index - 1];
             if (!previousModule) return true;
             
             const previousProgress = getModuleProgress(previousModule.id);
             return previousProgress?.isCompleted || false;
        }
        return true;
    }, [courseContent, getModuleProgress]);

    // Clear course data (useful when navigating away from course)
    const clearCourseData = useCallback(() => {
        setCourseContent([]);
        setCurrentModule(null);
        setUserProgress(null);
        setEnrollmentStatus({
            isEnrolled: false,
            enrollment: null,
            loading: false,
            error: null
        });
    }, []);

    // 🚨 FIX: Remove direct reference to courseId here 🚨
    useEffect(() => {
        if (isAuthenticated && currentUser && currentModule) {
             // Pass the courseId from the current module or use the fallback ID as a default
             const id = currentModule.courseId || FALLBACK_COURSE_ID; 
             fetchUserProgress(id);
        }
    }, [isAuthenticated, currentUser, currentModule, fetchUserProgress]); 


    const value = useMemo(() => ({
        // Course content
        courseContent,
        currentModule,
        loadingContent: loadingContent || enrollmentStatus.loading,
        contentError,
        fetchCourseContent,
        setCurrentModule,
        
        // User progress
        userProgress,
        loadingProgress,
        progressError,
        fetchUserProgress,
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
        isModuleUnlocked,
        clearCourseData,
        fetchCourseContent,
        fetchUserProgress,
        markVideoWatched,
        markModuleCompleted,
        getModuleProgress,
        getVideoProgress,
    ]);

    return (
        <CourseContentContext.Provider value={value}>
            {children}
        </CourseContentContext.Provider>
    );
};