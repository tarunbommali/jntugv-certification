import React, { createContext, useContext, useState, useEffect, useMemo, useRef } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './AuthContext'; // Import the primary Auth context
import { EnrollmentSchema, safeParseArray, DummyEnrollment } from '../utils/schemas.js';

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

    const fetchUserEnrollments = async (uid) => {
        if (!uid) {
            setEnrollments([]);
            return [];
        }
        if (fetchPromiseRef.current) {
            return fetchPromiseRef.current;
        }
        const run = (async () => {
            try {
                setLoadingEnrollments(true);
                setEnrollmentsError(null);
                const qRef = query(
                    collection(db, 'enrollments'),
                    where('userId', '==', uid),
                    where('status', '==', 'SUCCESS')
                );
                const snapshot = await getDocs(qRef);
                const enrollmentList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                const validated = safeParseArray(EnrollmentSchema, enrollmentList);
                // If Firestore has no data, seed with a single dummy enrollment to allow demo content
                if (validated.length === 0) {
                    const demo = [DummyEnrollment(uid, '1')];
                    setEnrollments(demo);
                    return demo;
                }
                setEnrollments(validated);
                return validated;
            } catch (err) {
                console.error('Failed to fetch user enrollments:', err);
                setEnrollmentsError('Failed to load your enrollment history. Showing demo data.');
                const demo = [DummyEnrollment(uid, '1')];
                setEnrollments(demo);
                return demo;
            } finally {
                setLoadingEnrollments(false);
                fetchPromiseRef.current = null;
            }
        })();
        fetchPromiseRef.current = run;
        return run;
    };

    // Effect to run when user authentication state changes
    useEffect(() => {
        if (isAuthenticated && currentUser?.uid) {
            fetchUserEnrollments(currentUser.uid);
        } else {
            // Clear enrollments if user logs out
            setEnrollments([]);
            setLoadingEnrollments(false);
        }
    }, [isAuthenticated, currentUser?.uid]);

    const value = useMemo(() => ({
        enrollments,
        loadingEnrollments,
        enrollmentsError,
        // Helper to check if user is enrolled in a specific course
        isEnrolled: (courseId) => enrollments.some(e => e.courseId === courseId),
        refreshEnrollments: () => fetchUserEnrollments(currentUser?.uid),
    }), [enrollments, loadingEnrollments, enrollmentsError, currentUser?.uid]);

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};