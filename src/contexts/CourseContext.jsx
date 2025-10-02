// src/contexts/CourseContext.jsx

import React, { createContext, useContext, useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Assuming 'db' is exported from '../firebase'

// 🚨 IMPORT FALLBACK DATA 🚨
import { courses as fallbackCourses } from '../utils/fallbackData.js'; 

// NOTE: Assuming these are correctly defined in '../utils/schemas.js'
// import { CourseSchema, safeParseArray } from '../utils/schemas.js';
const safeParseArray = (schema, data) => data; // Mock for this example


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

    // Use useCallback to create a stable fetch function
    const fetchCourses = useCallback(async () => {
        
        // 1. Prevent simultaneous fetches
        if (fetchPromiseRef.current) {
            return fetchPromiseRef.current;
        }

        const run = (async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Fetch from Firestore
                const snapshot = await getDocs(collection(db, 'courses'));
                const courseList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                
                // Assuming CourseSchema is used for validation
                const validated = safeParseArray(null, courseList); 
                
                if (validated.length > 0) {
                    setCourses(validated);
                    return validated;
                }
                
                // Fallback if Firestore is connected but returns empty data
                setCourses(fallbackCourses);
                setError('Database is empty. Showing offline demo courses.');
                return fallbackCourses;

            } catch (err) {
                console.error('Failed to fetch courses from Firestore:', err);
                
                // Fallback on network/database failure
                setError('Failed to load courses. Showing offline demo data.');
                setCourses(fallbackCourses);
                return fallbackCourses;

            } finally {
                setLoading(false);
                fetchPromiseRef.current = null;
            }
        })();
        
        fetchPromiseRef.current = run;
        return run;
    }, []); // fetchCourses is stable as it has no external dependencies

    // Fetch courses once on mount
    useEffect(() => {
        fetchCourses();
    }, [fetchCourses]);

    const value = useMemo(() => ({ 
        courses, 
        loading, 
        error,
        // Helper to manually refresh the list
        refreshCourses: fetchCourses, 
        // Helper to quickly find a course by ID
        getCourseById: (id) => courses.find(c => String(c.id) === String(id)),
    }), [courses, loading, error, fetchCourses]);

    return (
        <CourseContext.Provider value={value}>
            {children}
        </CourseContext.Provider>
    );
};