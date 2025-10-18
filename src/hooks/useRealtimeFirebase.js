import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  collection, 
  doc, 
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot,
  writeBatch,
  serverTimestamp,
  increment
} from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

// ============================================================================
// REAL-TIME HOOKS FOR FIREBASE OPERATIONS
// ============================================================================

/**
 * Generic hook for real-time Firestore listeners
 */
export const useRealtimeListener = (queryFn, dependencies = [], options = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const unsubscribeRef = useRef(null);
  const { enabled = true } = options;

  const sanitizeErrorMessage = (rawMsg) => {
    const r = String(rawMsg || '').toLowerCase();
    if (r.includes('requires an index')) {
      return 'Some data requires a Firestore composite index. Showing partial/fallback results where possible.';
    }
    return String(rawMsg || 'Unknown error');
  };

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const q = queryFn();
      if (!q) {
        setLoading(false);
        return;
      }

      unsubscribeRef.current = onSnapshot(
        q,
        (snapshot) => {
          const docs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
          setData(docs);
          setLoading(false);
        },
        async (err) => {
          console.error('Real-time listener error:', err);
          const raw = String(err?.message || err || '').toLowerCase();

          // If Firestore requires an index, and the caller provided a fallback
          // query factory, attempt to subscribe to the fallback and apply any
          // client-side filtering if supplied in options.
          if (raw.includes('requires an index') && typeof options.fallbackQueryFn === 'function') {
            console.warn('[useRealtimeListener] Index required; attempting fallback real-time query');
            try {
              // unsubscribe previous listener
              if (unsubscribeRef.current) {
                try { unsubscribeRef.current(); } catch (e) { /* ignore */ }
                unsubscribeRef.current = null;
              }

              const fallbackQ = options.fallbackQueryFn();
              if (!fallbackQ) {
                setError(sanitizeErrorMessage(err.message || err));
                setLoading(false);
                return;
              }

              unsubscribeRef.current = onSnapshot(
                fallbackQ,
                (snapshot) => {
                  let docs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
                  if (typeof options.clientSideFilter === 'function') {
                    docs = docs.filter(options.clientSideFilter);
                  }
                  setData(docs);
                  setError(null);
                  setLoading(false);
                },
                (fallbackErr) => {
                  console.error('[useRealtimeListener] Fallback real-time listener error:', fallbackErr);
                  setError(sanitizeErrorMessage(fallbackErr.message || fallbackErr));
                  setLoading(false);
                }
              );
              return;
            } catch (fallbackSetupErr) {
              console.error('[useRealtimeListener] Fallback setup failed:', fallbackSetupErr);
              setError(fallbackSetupErr.message || String(fallbackSetupErr));
              setLoading(false);
              return;
            }
          }

          setError(sanitizeErrorMessage(err.message || err));
          setLoading(false);
        }
      );
    } catch (err) {
      console.error('Query setup error:', err);
      setError(err.message || String(err));
      setLoading(false);
    }

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, dependencies);

  return { data, loading, error };
};

/**
 * Real-time courses hook with filtering and sorting
 */
export const useRealtimeCourses = (options = {}) => {
  const { 
    limitCount = 50, 
    publishedOnly = true, 
    featuredOnly = false,
    category = null 
  } = options;

  const queryFn = useCallback(() => {
    const coursesRef = collection(db, 'courses');
    let q = query(coursesRef);

    // Apply filters
    if (publishedOnly) {
      q = query(q, where('isPublished', '==', true));
    }
    
    if (featuredOnly) {
      q = query(q, where('isFeatured', '==', true));
    }
    
    if (category) {
      q = query(q, where('category', '==', category));
    }

    // Apply sorting and limit
    q = query(q, orderBy('createdAt', 'desc'), limit(limitCount));

    return q;
  }, [limitCount, publishedOnly, featuredOnly, category]);

  // Provide a fallback real-time query (ordering only) and client-side filter
  const fallbackQueryFn = useCallback(() => {
    const coursesRef = collection(db, 'courses');
    return query(coursesRef, orderBy('createdAt', 'desc'), limit(limitCount));
  }, [limitCount]);

  const clientSideFilter = useCallback((doc) => {
    if (publishedOnly && !doc.isPublished) return false;
    if (featuredOnly && !doc.isFeatured) return false;
    if (category && doc.category !== category) return false;
    return true;
  }, [publishedOnly, featuredOnly, category]);

  return useRealtimeListener(queryFn, [limitCount, publishedOnly, featuredOnly, category], { fallbackQueryFn, clientSideFilter });
};

/**
 * Real-time single course hook
 */
export const useRealtimeCourse = (courseId, options = {}) => {
  const { enabled = true } = options;
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const unsubscribeRef = useRef(null);

  useEffect(() => {
    if (!enabled || !courseId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const courseRef = doc(db, 'courses', courseId);
    
    unsubscribeRef.current = onSnapshot(
      courseRef,
      (doc) => {
        if (doc.exists()) {
          setCourse({ id: doc.id, ...doc.data() });
        } else {
          setCourse(null);
        }
        setLoading(false);
      },
      (err) => {
        console.error('Course listener error:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [courseId, enabled]);

  return { course, loading, error };
};

/**
 * Real-time user enrollments hook
 */
export const useRealtimeUserEnrollments = (userId, options = {}) => {
  const { enabled = true } = options;

  const queryFn = useCallback(() => {
    if (!userId) return null;
    
    const enrollmentsRef = collection(db, 'enrollments');
    return query(
      enrollmentsRef,
      where('userId', '==', userId),
      where('status', '==', 'SUCCESS'),
      orderBy('enrolledAt', 'desc')
    );
  }, [userId]);

  const fallbackEnrollmentsQuery = useCallback(() => {
    if (!userId) return null;
    const enrollmentsRef = collection(db, 'enrollments');
    return query(enrollmentsRef, where('userId', '==', userId), limit(200));
  }, [userId]);

  const enrollmentsClientFilter = useCallback((d) => d.status === 'SUCCESS', []);

  const { data: enrollments, loading, error } = useRealtimeListener(
    queryFn,
    [userId],
    { enabled: enabled && !!userId, fallbackQueryFn: fallbackEnrollmentsQuery, clientSideFilter: enrollmentsClientFilter }
  );

  const isEnrolled = useCallback((courseId) => {
    return enrollments.some(e => String(e.courseId) === String(courseId));
  }, [enrollments]);

  return { 
    enrollments, 
    loading, 
    error, 
    isEnrolled,
    enrollmentCount: enrollments.length 
  };
};

/**
 * Real-time enrollment status hook for specific course
 */
export const useRealtimeEnrollmentStatus = (userId, courseId, options = {}) => {
  const { enabled = true } = options;
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const unsubscribeRef = useRef(null);

  useEffect(() => {
    if (!enabled || !userId || !courseId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const enrollmentsRef = collection(db, 'enrollments');
    const q = query(
      enrollmentsRef,
      where('userId', '==', userId),
      where('courseId', '==', courseId),
      where('status', '==', 'SUCCESS'),
      limit(1)
    );

    unsubscribeRef.current = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const doc = snapshot.docs[0];
          setEnrollment({ id: doc.id, ...doc.data() });
        } else {
          setEnrollment(null);
        }
        setLoading(false);
      },
      (err) => {
        console.error('Enrollment status listener error:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [userId, courseId, enabled]);

  return { 
    enrollment, 
    isEnrolled: !!enrollment, 
    loading, 
    error 
  };
};

/**
 * Real-time admin users hook
 */
export const useRealtimeAdminUsers = (options = {}) => {
  const { limitCount = 100, enabled = true } = options;

  const queryFn = useCallback(() => {
    const usersRef = collection(db, 'users');
    return query(
      usersRef,
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
  }, [limitCount]);

  return useRealtimeListener(queryFn, [limitCount], { enabled });
};

/**
 * Real-time admin enrollments hook
 */
export const useRealtimeAdminEnrollments = (options = {}) => {
  const { limitCount = 100, enabled = true } = options;

  const queryFn = useCallback(() => {
    const enrollmentsRef = collection(db, 'enrollments');
    return query(
      enrollmentsRef,
      orderBy('enrolledAt', 'desc'),
      limit(limitCount)
    );
  }, [limitCount]);

  return useRealtimeListener(queryFn, [limitCount], { enabled });
};

/**
 * Real-time admin payments hook
 */
export const useRealtimeAdminPayments = (options = {}) => {
  const { limitCount = 100, enabled = true } = options;

  const queryFn = useCallback(() => {
    const paymentsRef = collection(db, 'payments');
    return query(
      paymentsRef,
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
  }, [limitCount]);

  return useRealtimeListener(queryFn, [limitCount], { enabled });
};

/**
 * Real-time user progress hook
 */
export const useRealtimeUserProgress = (userId, courseId, options = {}) => {
  const { enabled = true } = options;
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const unsubscribeRef = useRef(null);

  useEffect(() => {
    if (!enabled || !userId || !courseId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const progressRef = doc(db, 'user_progress', `${userId}_${courseId}`);
    
    unsubscribeRef.current = onSnapshot(
      progressRef,
      (doc) => {
        if (doc.exists()) {
          setProgress({ id: doc.id, ...doc.data() });
        } else {
          setProgress(null);
        }
        setLoading(false);
      },
      (err) => {
        console.error('Progress listener error:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [userId, courseId, enabled]);

  return { progress, loading, error };
};

/**
 * Real-time coupons hook
 */
export const useRealtimeCoupons = (options = {}) => {
  const { activeOnly = true, enabled = true } = options;

  const queryFn = useCallback(() => {
    const couponsRef = collection(db, 'coupons');
    let q = query(couponsRef);

    if (activeOnly) {
      q = query(q, where('isActive', '==', true));
    }

    return query(q, orderBy('createdAt', 'desc'));
  }, [activeOnly]);

  return useRealtimeListener(queryFn, [activeOnly], { enabled });
};

// ============================================================================
// REAL-TIME MUTATION HOOKS
// ============================================================================

/**
 * Hook for real-time course updates
 */
export const useRealtimeCourseMutations = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateCourse = useCallback(async (courseId, updateData) => {
    if (!currentUser) {
      setError('User not authenticated');
      return { success: false, error: 'User not authenticated' };
    }

    setLoading(true);
    setError(null);

    try {
      const courseRef = doc(db, 'courses', courseId);
      const batch = writeBatch(db);

      batch.update(courseRef, {
        ...updateData,
        updatedAt: serverTimestamp(),
        updatedBy: currentUser.uid
      });

      await batch.commit();
      return { success: true };
    } catch (err) {
      console.error('Course update error:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  const createCourse = useCallback(async (courseData) => {
    if (!currentUser) {
      setError('User not authenticated');
      return { success: false, error: 'User not authenticated' };
    }

    setLoading(true);
    setError(null);

    try {
      const coursesRef = collection(db, 'courses');
      const batch = writeBatch(db);

      const courseRef = doc(coursesRef);
      batch.set(courseRef, {
        ...courseData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: currentUser.uid,
        totalEnrollments: 0,
        averageRating: 0,
        totalRatings: 0,
        isPublished: false,
        isFeatured: false,
        status: 'draft'
      });

      await batch.commit();
      return { success: true, data: { id: courseRef.id } };
    } catch (err) {
      console.error('Course creation error:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  return { updateCourse, createCourse, loading, error };
};

/**
 * Hook for real-time enrollment updates
 */
export const useRealtimeEnrollmentMutations = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createEnrollment = useCallback(async (enrollmentData) => {
    if (!currentUser) {
      setError('User not authenticated');
      return { success: false, error: 'User not authenticated' };
    }

    setLoading(true);
    setError(null);

    try {
      const batch = writeBatch(db);

      // Create enrollment
      const enrollmentRef = doc(collection(db, 'enrollments'));
      batch.set(enrollmentRef, {
        ...enrollmentData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // Update course enrollment count
      const courseRef = doc(db, 'courses', enrollmentData.courseId);
      batch.update(courseRef, {
        totalEnrollments: increment(1),
        updatedAt: serverTimestamp()
      });

      // Update user enrollment count
      const userRef = doc(db, 'users', enrollmentData.userId);
      batch.update(userRef, {
        totalCoursesEnrolled: increment(1),
        updatedAt: serverTimestamp()
      });

      await batch.commit();
      return { success: true, data: { id: enrollmentRef.id } };
    } catch (err) {
      console.error('Enrollment creation error:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  const updateEnrollmentProgress = useCallback(async (enrollmentId, progressData) => {
    setLoading(true);
    setError(null);

    try {
      const enrollmentRef = doc(db, 'enrollments', enrollmentId);
      const batch = writeBatch(db);

      batch.update(enrollmentRef, {
        'progress.modulesCompleted': progressData.modulesCompleted,
        'progress.totalModules': progressData.totalModules,
        'progress.completionPercentage': progressData.completionPercentage,
        'progress.lastAccessedAt': serverTimestamp(),
        'progress.timeSpent': progressData.timeSpent,
        updatedAt: serverTimestamp()
      });

      await batch.commit();
      return { success: true };
    } catch (err) {
      console.error('Progress update error:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  return { createEnrollment, updateEnrollmentProgress, loading, error };
};

export default {
  useRealtimeCourses,
  useRealtimeCourse,
  useRealtimeUserEnrollments,
  useRealtimeEnrollmentStatus,
  useRealtimeAdminUsers,
  useRealtimeAdminEnrollments,
  useRealtimeAdminPayments,
  useRealtimeUserProgress,
  useRealtimeCoupons,
  useRealtimeCourseMutations,
  useRealtimeEnrollmentMutations
};