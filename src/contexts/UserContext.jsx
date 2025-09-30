import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './AuthContext'; // Import the primary Auth context

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

    const fetchUserEnrollments = async (uid) => {
        if (!uid) return setEnrollments([]);

        try {
            setLoadingEnrollments(true);
            setEnrollmentsError(null);

            // Query Firestore for enrollments belonging to the current user
            const q = query(
                collection(db, 'enrollments'),
                where('userId', '==', uid),
                where('status', '==', 'SUCCESS') // Only fetching successful enrollments
            );
            
            const snapshot = await getDocs(q);
            const enrollmentList = snapshot.docs.map(doc => ({ 
                id: doc.id, 
                ...doc.data() 
            }));
            
            setEnrollments(enrollmentList);

        } catch (err) {
            console.error('Failed to fetch user enrollments:', err);
            setEnrollmentsError('Failed to load your enrollment history.');
            setEnrollments([]);
        } finally {
            setLoadingEnrollments(false);
        }
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