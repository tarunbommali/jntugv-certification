import React, { createContext, useContext, useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Assuming correct path to Firebase instance
import { useAuth } from './AuthContext'; // Import the primary Auth context

// --- NOTE: You must define these utilities in '../utils/schemas.js' ---
// const EnrollmentSchema = { /* Your schema definition */ };
// const safeParseArray = (schema, data) => data; // Mock for this example
const safeParseArray = (schema, data) => data; // Use actual implementation in your project

// Dummy enrollment for fallback/demo purposes
const DummyEnrollment = (uid, courseId) => ({
    id: 'DEMO_ENROLL_ID',
    userId: uid,
    courseId: 'emerging-tech-2025',
    courseTitle: 'Emerging Technologies (Demo Access)',
    status: 'SUCCESS',
    enrolledAt: new Date(),
});



// -----------------------------------------------------------------------


const UserContext = createContext(undefined);

export const useUser = () => {
    const ctx = useContext(UserContext);
    if (!ctx) throw new Error('useUser must be used within UserProvider');
    return ctx;
};

export const UserProvider = ({ children }) => {
    const { currentUser, isAuthenticated } = useAuth();
    const [enrollments, setEnrollments] = useState([]);
    const [loadingEnrollments, setLoadingEnrollments] = useState(false);
    const [enrollmentsError, setEnrollmentsError] = useState(null);
    const fetchPromiseRef = useRef(null);

    // Use useCallback to ensure fetchUserEnrollments has a stable identity
    const fetchUserEnrollments = useCallback(async (uid) => {
        if (!uid) {
            setEnrollments([]);
            return;
        }

        // Prevent redundant simultaneous fetches
        if (fetchPromiseRef.current) {
            return fetchPromiseRef.current;
        }

        const run = (async () => {
            try {
                setLoadingEnrollments(true);
                setEnrollmentsError(null);
                
                // Force fallback (offline mode) - single V2 demo enrollment
                const demo = [DummyEnrollment(uid, 'emerging-tech-2025')];
                setEnrollments(demo);
                return;
                
            } catch (err) {
                console.error('Failed to fetch user enrollments:', err);
                
                // 3. Fallback on database failure (network error, permissions, etc.)
                setEnrollmentsError(null);
                const demo = [DummyEnrollment(uid, 'emerging-tech-2025')];
                setEnrollments(demo);
                
            } finally {
                setLoadingEnrollments(false);
                fetchPromiseRef.current = null;
            }
        })();
        
        fetchPromiseRef.current = run;
        return run;
    }, []); // Dependencies are stable

    // Effect to run when user authentication state changes
    useEffect(() => {
        if (isAuthenticated && currentUser?.uid) {
            fetchUserEnrollments(currentUser.uid);
        } else {
            // Clear enrollments if user logs out
            setEnrollments([]);
            setLoadingEnrollments(false);
            setEnrollmentsError(null);
        }
    }, [isAuthenticated, currentUser?.uid, fetchUserEnrollments]);

    // Memoize the context value for performance
    const value = useMemo(() => ({
        enrollments,
        loadingEnrollments,
        enrollmentsError,
        // Helper to check if user is enrolled in a specific course
        isEnrolled: (courseId) => enrollments.some(e => String(e.courseId) === String(courseId)),
        refreshEnrollments: () => fetchUserEnrollments(currentUser?.uid),
    }), [enrollments, loadingEnrollments, enrollmentsError, currentUser?.uid, fetchUserEnrollments]);

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};