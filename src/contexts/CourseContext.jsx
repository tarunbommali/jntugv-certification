import React, { createContext, useContext, useState, useEffect, useMemo, useRef } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Assuming 'db' is exported from '../firebase'
import { CourseSchema, safeParseArray } from '../utils/schemas.js';
import { courses as localCourses } from '../utils/constants';

const CourseContext = createContext(undefined);

export const useCourse = () => {
    const ctx = useContext(CourseContext);
    if (!ctx) throw new Error('useCourse must be used within CourseProvider');
    return ctx;
};

export const CourseProvider = ({ children }) => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const fetchPromiseRef = useRef(null);

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
    }, []);

    const value = useMemo(() => ({
        courses,
        loading,
        error,
        // Allow components to manually refresh the list
        refreshCourses: fetchCourses,
        // Helper to quickly find a course by ID
        getCourseById: (id) => courses.find(c => String(c.id) === String(id)),
    }), [courses, loading, error]);

    return (
        <CourseContext.Provider value={value}>
            {children}
        </CourseContext.Provider>
    );
};