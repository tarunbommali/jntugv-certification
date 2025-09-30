import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Assuming 'db' is exported from '../firebase'

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

    // Function to fetch all courses from Firestore
    const fetchCourses = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const snapshot = await getDocs(collection(db, 'courses'));
            const courseList = snapshot.docs.map(doc => ({ 
                id: doc.id, 
                ...doc.data() 
            }));
            
            setCourses(courseList);
        } catch (err) {
            console.error('Failed to fetch courses:', err);
            setError('Failed to load courses. Please try again.');
            setCourses([]);
        } finally {
            setLoading(false);
        }
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
        getCourseById: (id) => courses.find(c => c.id === id),
    }), [courses, loading, error]);

    return (
        <CourseContext.Provider value={value}>
            {children}
        </CourseContext.Provider>
    );
};