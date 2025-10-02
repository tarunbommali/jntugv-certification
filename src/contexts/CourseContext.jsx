// src/contexts/CourseContext.jsx

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getAllCourses } from '../firebase/services';
import { courses as fallbackCourses } from '../utils/fallbackData';

const CourseContext = createContext(undefined);

export const useCourseContext = () => {
    const ctx = useContext(CourseContext);
    if (!ctx) throw new Error('useCourseContext must be used within CourseProvider');
    return ctx;
};

export const CourseProvider = ({ children }) => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;
        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const result = await getAllCourses(50);
                if (isMounted) {
                    if (result.success && Array.isArray(result.data) && result.data.length > 0) {
                        setCourses(result.data);
                    } else {
                        setCourses(fallbackCourses);
                        if (!result.success) setError(result.error || 'Failed to fetch courses. Using fallback.');
                    }
                }
            } catch (e) {
                if (isMounted) {
                    setCourses(fallbackCourses);
                    setError('Unable to reach database. Showing demo courses.');
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        load();
        return () => { isMounted = false; };
    }, []);

    const value = useMemo(() => ({ 
        courses, 
        loading, 
        error,
        getCourseById: (courseId) => courses.find(c => String(c.id) === String(courseId)) || null
    }), [courses, loading, error]);

    return (
        <CourseContext.Provider value={value}>
            {children}
        </CourseContext.Provider>
    );
};