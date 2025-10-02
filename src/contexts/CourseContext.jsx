<<<<<<< HEAD
// src/contexts/CourseContext.jsx

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getAllCourses } from '../firebase/services';
import { courses as fallbackCourses } from '../utils/fallbackData';
=======
import React, { createContext, useContext, useState, useEffect, useMemo, useRef } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Assuming 'db' is exported from '../firebase'
import { CourseSchema, safeParseArray } from '../utils/schemas.js';
import { courses as localCourses } from '../utils/constants';
>>>>>>> 73526b557d3535439700f97bb42ab30a62c0095d

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
    const fetchPromiseRef = useRef(null);

<<<<<<< HEAD
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
=======
    // Function to fetch all courses from Firestore
    const fetchCourses = async () => {
        if (fetchPromiseRef.current) {
            return fetchPromiseRef.current;
        }
        const run = (async () => {
            try {
                setLoading(true);
                setError(null);
                const snapshot = await getDocs(collection(db, 'courses'));
                const courseList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                const validated = safeParseArray(CourseSchema, courseList);
                if (validated.length > 0) {
                    setCourses(validated);
                    return validated;
                }
                // Fallback to local constants if Firestore empty
                const fallback = safeParseArray(
                    CourseSchema,
                    (localCourses || []).map((c) => ({ ...c, id: String(c.id) }))
                );
                setCourses(fallback);
                return fallback;
            } catch (err) {
                console.error('Failed to fetch courses:', err);
                setError('Failed to load courses. Showing offline data.');
                const fallback = safeParseArray(
                    CourseSchema,
                    (localCourses || []).map((c) => ({ ...c, id: String(c.id) }))
                );
                setCourses(fallback);
                return fallback;
            } finally {
                setLoading(false);
                fetchPromiseRef.current = null;
            }
        })();
        fetchPromiseRef.current = run;
        return run;
    };

    // Fetch courses once on mount
    useEffect(() => {
        fetchCourses();
>>>>>>> 73526b557d3535439700f97bb42ab30a62c0095d
    }, []);

    const value = useMemo(() => ({ 
        courses, 
        loading, 
        error,
<<<<<<< HEAD
        getCourseById: (courseId) => courses.find(c => String(c.id) === String(courseId)) || null
=======
        // Allow components to manually refresh the list
        refreshCourses: fetchCourses,
        // Helper to quickly find a course by ID
        getCourseById: (id) => courses.find(c => String(c.id) === String(id)),
>>>>>>> 73526b557d3535439700f97bb42ab30a62c0095d
    }), [courses, loading, error]);

    return (
        <CourseContext.Provider value={value}>
            {children}
        </CourseContext.Provider>
    );
};