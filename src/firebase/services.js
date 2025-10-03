/**
 * Firebase Service Functions
 * * This file contains all the database operations for the JNTU GV Certification Platform
 * Organized by collection with proper error handling and validation
 */

import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter,
  writeBatch,
  serverTimestamp,
  increment
} from 'firebase/firestore';
import { db } from '../firebase';
import { 
  validateUserData, 
  validateCourseData, 
  validateEnrollmentData, 
  validateCouponData,
  generateDefaultUserData,
  generateDefaultEnrollmentData
} from './schema'; // Assuming correct path to schema functions
import { v4 as uuidv4 } from 'uuid';

// ----------------------------------------------------------------------------
// V2 Shape Mappers (normalizes Firestore docs to requested UI contract)
// ----------------------------------------------------------------------------

const mapUserToV2 = (raw) => {
    if (!raw) return null;
    return {
        uid: raw.uid ?? raw.id,
        name: raw.name ?? raw.displayName ?? [raw.firstName, raw.lastName].filter(Boolean).join(' '),
        email: raw.email,
        role: raw.isAdmin ? 'admin' : (raw.role ?? 'user'),
        university: raw.university ?? raw.college ?? '',
        skills: Array.isArray(raw.skills) ? raw.skills : [],
        totalCoursesEnrolled: typeof raw.totalCoursesEnrolled === 'number' ? raw.totalCoursesEnrolled : 0,
        lastLoginAt: raw.lastLoginAt ?? null,
    };
};

const mapCourseToV2 = (raw) => {
    if (!raw) return null;
    // Try to infer modules/videos to new structure if present
    const modules = Array.isArray(raw.modules) ? raw.modules : [];
    const normalizedModules = modules.map((m, idx) => ({
        moduleKey: m.moduleKey ?? m.id ?? `M${idx + 1}`,
        moduleTitle: m.moduleTitle ?? m.title ?? `Module ${idx + 1}`,
        title: m.title ?? m.moduleTitle ?? `Module ${idx + 1}`,
        videos: Array.isArray(m.videos)
            ? m.videos.map((v, vIdx) => ({
                videoId: v.videoId ?? v.id ?? `V${vIdx + 1}`,
                videoKey: v.videoKey ?? v.url ?? '',
                title: v.title ?? `Video ${vIdx + 1}`,
            }))
            : [],
    }));

    return {
        courseId: raw.courseId ?? raw.id,
        courseTitle: raw.courseTitle ?? raw.title,
        courseDescription: raw.courseDescription ?? raw.description ?? raw.shortDescription ?? '',
        originalPrice: raw.originalPrice ?? (typeof raw.price === 'number' ? raw.price : undefined),
        coursePrice: raw.coursePrice ?? raw.price ?? 0,
        isPublished: Boolean(raw.isPublished),
        modules: normalizedModules,
    };
};

const mapEnrollmentToV2 = (raw, id) => {
    if (!raw) return null;
    const enrollmentId = raw.enrollmentId ?? id;
    return {
        enrollmentId,
        userId: raw.userId,
        courseId: raw.courseId,
        courseTitle: raw.courseTitle ?? '',
        status: raw.status,
        paidAmount: raw.paidAmount ?? raw.amount ?? undefined,
        enrolledAt: raw.enrolledAt ?? null,
        paymentDetails: raw.paymentDetails ?? (raw.paymentId ? { paymentId: raw.paymentId, paymentDate: raw.capturedAt ?? raw.createdAt ?? null } : undefined)
    };
};

const mapProgressToV2 = (raw, idKey) => {
    if (!raw) return null;
    const [userId, courseId] = (idKey ?? '').split('_');
    return {
        userCourseKey: raw.userCourseKey ?? idKey ?? `${raw.userId}_${raw.courseId}`,
        userId: raw.userId ?? userId,
        courseId: raw.courseId ?? courseId,
        completionPercentage: raw.completionPercentage ?? raw.overallProgress?.completionPercentage ?? 0,
        videosWatched: Array.isArray(raw.videosWatched)
            ? raw.videosWatched
            : (
                raw.moduleProgress?.flatMap(m => (
                    m.videosWatched?.map(v => ({
                        videoId: v.videoId,
                        completed: (v.completionPercentage ?? 0) >= 100,
                        progress: v.completionPercentage ?? 0,
                    })) ?? []
                )) ?? []
            ),
        lastAccessedAt: raw.lastAccessedAt ?? raw.overallProgress?.lastAccessedAt ?? null,
    };
};

// ----------------------------------------------------------------------------
// Shared Firestore error normalizer for stable error codes across the app
// ----------------------------------------------------------------------------
const normalizeFirestoreError = (error) => {
    const raw = String(error?.message || error || 'Unknown error');
    const lower = raw.toLowerCase();
    if (lower.includes('requires an index')) return { code: 'INDEX_REQUIRED', message: raw };
    if (lower.includes('permission-denied') || lower.includes('permission')) return { code: 'PERMISSION_DENIED', message: raw };
    if (lower.includes('unavailable') || lower.includes('network')) return { code: 'NETWORK_ERROR', message: raw };
    return { code: 'UNKNOWN', message: raw };
};

// ============================================================================
// USER OPERATIONS
// ============================================================================

/**
 * Create or update user profile
 */
export const createOrUpdateUser = async (firebaseUser, additionalData = {}) => {
    try {
        const userRef = doc(db, 'users', firebaseUser.uid);
        const userSnap = await getDoc(userRef);
        
        const baseData = generateDefaultUserData(firebaseUser);
        const userData = {
            ...baseData,
            ...additionalData,
            updatedAt: serverTimestamp(),
            lastLoginAt: serverTimestamp()
        };
        
        validateUserData(userData);
        
        if (userSnap.exists()) {
            // Update existing user
            await updateDoc(userRef, {
                ...additionalData,
                updatedAt: serverTimestamp(),
                lastLoginAt: serverTimestamp()
            });
        } else {
            // Create new user
            await setDoc(userRef, userData);
        }
        
        return { success: true, data: userData };
    } catch (error) {
        console.error('Error creating/updating user:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Get user profile by UID
 */
export const getUserProfile = async (uid) => {
    try {
        const userRef = doc(db, 'users', uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
            return { success: true, data: { id: userSnap.id, ...userSnap.data() } };
        } else {
            return { success: false, error: 'User not found' };
        }
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (uid, updateData) => {
    try {
        const userRef = doc(db, 'users', uid);
        const updatePayload = {
            ...updateData,
            updatedAt: serverTimestamp()
        };
        
        await updateDoc(userRef, updatePayload);
        return { success: true };
    } catch (error) {
        console.error('Error updating user profile:', error);
        return { success: false, error: error.message };
    }
};

/**
 * 🚨 NEW FUNCTION: Get all user data for the Admin Dashboard 🚨
 */
export const getAllUsersData = async (limitCount = 100) => {
    try {
        const usersRef = collection(db, 'users');
        // Fetch users ordered by creation date, not filtering by anything
        const q = query(
            usersRef,
            orderBy('createdAt', 'desc'),
            limit(limitCount)
        );
        
        const snapshot = await getDocs(q);
        const users = snapshot.docs.map(doc => ({
            uid: doc.id,
            ...doc.data()
        }));
        
        // NOTE: In a real app, you would batch user and enrollment data 
        // retrieval here to minimize calls in the AdminUserDashboard.
        
        return { success: true, data: users };
    } catch (error) {
        const norm = normalizeFirestoreError(error);
        console.warn('[getAllUsersData]', norm.code, norm.message);
        // Using PERMISSION_DENIED as a common issue for admin calls
        return { success: false, error: norm.code, message: `Failed to fetch user list: ${norm.message}` };
    }
};

// ============================================================================
// COURSE OPERATIONS
// ============================================================================

/**
 * Get all published courses
 */
export const getAllCourses = async (limitCount = 50) => {
    try {
        const coursesRef = collection(db, 'courses');
        const q = query(
            coursesRef,
            where('isPublished', '==', true),
            orderBy('createdAt', 'desc'),
            limit(limitCount)
        );
        
        const snapshot = await getDocs(q);
        const courses = snapshot.docs.map(doc => mapCourseToV2({ id: doc.id, ...doc.data() }));
        return { success: true, data: courses };
    } catch (error) {
        const norm = normalizeFirestoreError(error);
        console.warn('[getAllCourses]', norm.code, norm.message);
        return { success: false, error: norm.code, message: norm.message };
    }
};

/**
 * Get course by ID
 */
export const getCourseById = async (courseId) => {
    try {
        const courseRef = doc(db, 'courses', courseId);
        const courseSnap = await getDoc(courseRef);
        
        if (courseSnap.exists()) {
            return { success: true, data: mapCourseToV2({ id: courseSnap.id, ...courseSnap.data() }) };
        } else {
            return { success: false, error: 'Course not found' };
        }
    } catch (error) {
        console.error('Error fetching course:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Create new course (Admin only)
 */
export const createCourse = async (courseData) => {
    try {
        validateCourseData(courseData);
        
        const coursePayload = {
            ...courseData,
            totalEnrollments: 0,
            averageRating: 0,
            totalRatings: 0,
            isPublished: false,
            isFeatured: false,
            status: 'draft',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        };
        
        const docRef = await addDoc(collection(db, 'courses'), coursePayload);
        return { success: true, data: { id: docRef.id, ...coursePayload } };
    } catch (error) {
        console.error('Error creating course:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Update course (Admin only)
 */
export const updateCourse = async (courseId, updateData) => {
    try {
        const courseRef = doc(db, 'courses', courseId);
        const updatePayload = {
            ...updateData,
            updatedAt: serverTimestamp()
        };
        
        await updateDoc(courseRef, updatePayload);
        return { success: true };
    } catch (error) {
        console.error('Error updating course:', error);
        return { success: false, error: error.message };
    }
};

// ============================================================================
// ENROLLMENT OPERATIONS
// ============================================================================

/**
 * Create enrollment record
 */
export const createEnrollment = async (enrollmentData) => {
    try {
        // Create V2 enrollment with explicit enrollmentId
        const enrollmentId = enrollmentData.enrollmentId ?? uuidv4();
        const enrollmentPayload = {
            enrollmentId,
            userId: enrollmentData.userId,
            courseId: enrollmentData.courseId,
            courseTitle: enrollmentData.courseTitle,
            status: enrollmentData.status ?? 'SUCCESS',
            paidAmount: enrollmentData.paymentData?.amount,
            enrolledAt: new Date(),
            paymentDetails: {
                paymentId: enrollmentData.paymentData?.paymentId ?? '',
                paymentDate: new Date(),
            },
        };
        validateEnrollmentData(enrollmentPayload);

        const docRef = await addDoc(collection(db, 'enrollments'), enrollmentPayload);
        
        // Update course enrollment count
        const courseRef = doc(db, 'courses', enrollmentData.courseId);
        await updateDoc(courseRef, {
            totalEnrollments: increment(1)
        });
        
        // Update user enrollment count
        const userRef = doc(db, 'users', enrollmentData.userId);
        await updateDoc(userRef, {
            totalCoursesEnrolled: increment(1)
        });
        
        return { success: true, data: { id: docRef.id, ...enrollmentPayload } };
    } catch (error) {
        console.error('Error creating enrollment:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Get user enrollments
 */
export const getUserEnrollments = async (userId) => {
    try {
        const enrollmentsRef = collection(db, 'enrollments');
        const q = query(
            enrollmentsRef,
            where('userId', '==', userId),
            where('status', '==', 'SUCCESS'),
            orderBy('enrolledAt', 'desc')
        );
        
        const snapshot = await getDocs(q);
        const enrollments = snapshot.docs.map(doc => mapEnrollmentToV2(doc.data(), doc.id));
        return { success: true, data: enrollments };
    } catch (error) {
        const norm = normalizeFirestoreError(error);
        console.warn('[getUserEnrollments]', norm.code, norm.message);
        return { success: false, error: norm.code, message: norm.message };
    }
};

/**
 * Check if user is enrolled in course
 */
export const checkUserEnrollment = async (userId, courseId) => {
    try {
        const enrollmentsRef = collection(db, 'enrollments');
        const q = query(
            enrollmentsRef,
            where('userId', '==', userId),
            where('courseId', '==', courseId),
            where('status', '==', 'SUCCESS')
        );
        
        const snapshot = await getDocs(q);
        return {
            success: true,
            data: {
                isEnrolled: !snapshot.empty,
                enrollment: snapshot.empty ? null : mapEnrollmentToV2(snapshot.docs[0].data(), snapshot.docs[0].id)
            }
        };
    } catch (error) {
        console.error('Error checking enrollment:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Update enrollment progress
 */
export const updateEnrollmentProgress = async (enrollmentId, progressData) => {
    try {
        const enrollmentRef = doc(db, 'enrollments', enrollmentId);
        const updatePayload = {
            'progress.modulesCompleted': progressData.modulesCompleted,
            'progress.totalModules': progressData.totalModules,
            'progress.completionPercentage': progressData.completionPercentage,
            'progress.lastAccessedAt': serverTimestamp(),
            'progress.timeSpent': progressData.timeSpent,
            updatedAt: serverTimestamp()
        };
        
        await updateDoc(enrollmentRef, updatePayload);
        return { success: true };
    } catch (error) {
        console.error('Error updating enrollment progress:', error);
        return { success: false, error: error.message };
    }
};

// ============================================================================
// PAYMENT OPERATIONS
// ============================================================================

/**
 * Create payment record
 */
export const createPaymentRecord = async (paymentData) => {
    try {
        const paymentPayload = {
            ...paymentData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        };
        
        const docRef = await addDoc(collection(db, 'payments'), paymentPayload);
        return { success: true, data: { id: docRef.id, ...paymentPayload } };
    } catch (error) {
        console.error('Error creating payment record:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Update payment status
 */
export const updatePaymentStatus = async (paymentId, status, additionalData = {}) => {
    try {
        const paymentRef = doc(db, 'payments', paymentId);
        const updatePayload = {
            status,
            updatedAt: serverTimestamp(),
            ...additionalData
        };
        
        if (status === 'captured') {
            updatePayload.capturedAt = serverTimestamp();
        }
        
        await updateDoc(paymentRef, updatePayload);
        return { success: true };
    } catch (error) {
        console.error('Error updating payment status:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Get user payment history
 */
export const getUserPaymentHistory = async (userId) => {
    try {
        const paymentsRef = collection(db, 'payments');
        const q = query(
            paymentsRef,
            where('userId', '==', userId),
            orderBy('createdAt', 'desc')
        );
        
        const snapshot = await getDocs(q);
        const payments = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        
        return { success: true, data: payments };
    } catch (error) {
        const norm = normalizeFirestoreError(error);
        console.warn('[getUserPaymentHistory]', norm.code, norm.message);
        return { success: false, error: norm.code, message: norm.message };
    }
};

// ============================================================================
// COUPON OPERATIONS
// ============================================================================

/**
 * Get all active coupons
 */
export const getAllActiveCoupons = async () => {
    try {
        const couponsRef = collection(db, 'coupons');
        const q = query(
            couponsRef,
            where('isActive', '==', true),
            where('validUntil', '>', new Date()),
            orderBy('validUntil', 'asc')
        );
        
        const snapshot = await getDocs(q);
        const coupons = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        
        return { success: true, data: coupons };
    } catch (error) {
        const norm = normalizeFirestoreError(error);
        console.warn('[getAllActiveCoupons]', norm.code, norm.message);
        return { success: false, error: norm.code, message: norm.message };
    }
};

/**
 * Validate coupon code
 */
export const validateCouponCode = async (couponCode, courseId, userId) => {
    try {
        const couponRef = doc(db, 'coupons', couponCode.toUpperCase());
        const couponSnap = await getDoc(couponRef);
        
        if (!couponSnap.exists()) {
            return { success: false, error: 'Invalid coupon code' };
        }
        
        const coupon = couponSnap.data();
        const now = new Date();
        
        // Check if coupon is active
        if (!coupon.isActive) {
            return { success: false, error: 'Coupon is not active' };
        }
        
        // Check validity period
        if (coupon.validFrom && now < coupon.validFrom.toDate()) {
            return { success: false, error: 'Coupon is not yet valid' };
        }
        
        if (coupon.validUntil && now > coupon.validUntil.toDate()) {
            return { success: false, error: 'Coupon has expired' };
        }
        
        // Check usage limits
        if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
            return { success: false, error: 'Coupon usage limit exceeded' };
        }
        
        // Check course applicability
        if (coupon.applicableCourses && coupon.applicableCourses.length > 0) {
            if (!coupon.applicableCourses.includes(courseId)) {
                return { success: false, error: 'Coupon not applicable for this course' };
            }
        }
        
        return { success: true, data: coupon };
    } catch (error) {
        console.error('Error validating coupon:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Apply coupon and update usage count
 */
export const applyCoupon = async (couponCode, courseId, userId) => {
    try {
        const validation = await validateCouponCode(couponCode, courseId, userId);
        
        if (!validation.success) {
            return validation;
        }
        
        const couponRef = doc(db, 'coupons', couponCode.toUpperCase());
        await updateDoc(couponRef, {
            usedCount: increment(1),
            totalOrders: increment(1),
            updatedAt: serverTimestamp()
        });
        
        return { success: true, data: validation.data };
    } catch (error) {
        console.error('Error applying coupon:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Create coupon (Admin only)
 */
export const createCoupon = async (couponData) => {
    try {
        validateCouponData(couponData);
        
        const couponPayload = {
            ...couponData,
            code: couponData.code.toUpperCase(),
            usedCount: 0,
            totalDiscountGiven: 0,
            totalOrders: 0,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        };
        
        const docRef = await addDoc(collection(db, 'coupons'), couponPayload);
        return { success: true, data: { id: docRef.id, ...couponPayload } };
    } catch (error) {
        console.error('Error creating coupon:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Update coupon (Admin only)
 */
export const updateCoupon = async (couponId, updateData) => {
    try {
        const couponRef = doc(db, 'coupons', couponId);
        const updatePayload = {
            ...updateData,
            updatedAt: serverTimestamp()
        };
        
        await updateDoc(couponRef, updatePayload);
        return { success: true };
    } catch (error) {
        console.error('Error updating coupon:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Delete coupon (Admin only)
 */
export const deleteCoupon = async (couponId) => {
    try {
        const couponRef = doc(db, 'coupons', couponId);
        await deleteDoc(couponRef);
        return { success: true };
    } catch (error) {
        console.error('Error deleting coupon:', error);
        return { success: false, error: error.message };
    }
};

// ============================================================================
// COURSE CONTENT OPERATIONS
// ============================================================================

/**
 * Get course content by course ID
 */
export const getCourseContent = async (courseId) => {
    try {
        const contentRef = collection(db, 'course_content');
        // Remove orderBy to avoid composite index; we'll sort client-side
        const q = query(
            contentRef,
            where('courseId', '==', courseId)
        );
        
        const snapshot = await getDocs(q);
        const content = snapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        
        return { success: true, data: content };
    } catch (error) {
        console.error('Error fetching course content:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Get specific module content
 */
export const getModuleContent = async (courseId, moduleId) => {
    try {
        const contentRef = doc(db, 'course_content', `${courseId}_${moduleId}`);
        const contentSnap = await getDoc(contentRef);
        
        if (contentSnap.exists()) {
            return { success: true, data: { id: contentSnap.id, ...contentSnap.data() } };
        } else {
            return { success: false, error: 'Module content not found' };
        }
    } catch (error) {
        console.error('Error fetching module content:', error);
        return { success: false, error: error.message };
    }
};

// ============================================================================
// USER PROGRESS OPERATIONS
// ============================================================================

/**
 * Get user progress for a course
 */
export const getUserProgress = async (userId, courseId) => {
    try {
        const progressRef = doc(db, 'user_progress', `${userId}_${courseId}`);
        const progressSnap = await getDoc(progressRef);
        
        if (progressSnap.exists()) {
            return { success: true, data: mapProgressToV2(progressSnap.data(), progressSnap.id) };
        } else {
            return { success: false, error: 'Progress not found' };
        }
    } catch (error) {
        console.error('Error fetching user progress:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Update user progress
 */
export const updateUserProgress = async (userId, courseId, progressData) => {
    try {
        const progressRef = doc(db, 'user_progress', `${userId}_${courseId}`);
        const updatePayload = { ...progressData, updatedAt: serverTimestamp() };
        
        await updateDoc(progressRef, updatePayload);
        return { success: true };
    } catch (error) {
        console.error('Error updating user progress:', error);
        return { success: false, error: error.message };
    }
};

// ============================================================================
// BATCH OPERATIONS
// ============================================================================

/**
 * Create enrollment with payment record in batch
 */
export const createEnrollmentWithPayment = async (enrollmentData, paymentData) => {
    try {
        const batch = writeBatch(db);
        
        // Create enrollment
        const enrollmentRef = doc(collection(db, 'enrollments'));
        const enrollmentPayload = {
            enrollmentId: enrollmentRef.id,
            userId: enrollmentData.userId,
            courseId: enrollmentData.courseId,
            courseTitle: enrollmentData.courseTitle,
            status: enrollmentData.status ?? 'SUCCESS',
            paidAmount: paymentData?.amount,
            enrolledAt: serverTimestamp(),
            paymentDetails: {
                paymentId: paymentData?.paymentId ?? '',
                paymentDate: serverTimestamp(),
            },
        };
        batch.set(enrollmentRef, enrollmentPayload);
        
        // Create payment record
        const paymentRef = doc(collection(db, 'payments'));
        const paymentPayload = {
            ...paymentData,
            enrollmentId: enrollmentRef.id,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        };
        batch.set(paymentRef, paymentPayload);
        
        // Update course enrollment count
        const courseRef = doc(db, 'courses', enrollmentData.courseId);
        batch.update(courseRef, {
            totalEnrollments: increment(1)
        });
        
        // Update user enrollment count
        const userRef = doc(db, 'users', enrollmentData.userId);
        batch.update(userRef, {
            totalCoursesEnrolled: increment(1)
        });
        
        await batch.commit();
        
        return { 
            success: true, 
            data: { 
                enrollmentId: enrollmentRef.id,
                paymentId: paymentRef.id
            }
        };
    } catch (error) {
        console.error('Error creating enrollment with payment:', error);
        return { success: false, error: error.message };
    }
};

// ============================================================================
// SECURE VIDEO ACCESS (Backend validation gate simulated here)
// ============================================================================

export const getSecureVideoAccessUrl = async (userId, courseId, videoKey) => {
    try {
        const check = await checkUserEnrollment(userId, courseId);
        if (!check.success || !check.data.isEnrolled) {
            return { success: false, error: 'ACCESS_DENIED' };
        }
        // In real backend, sign and return a time-limited URL from private storage
        // Here we just echo the key as a stand-in
        return { success: true, data: { signedUrl: String(videoKey) } };
    } catch (error) {
        return { success: false, error: 'UNKNOWN' };
    }
};

export default {
    // User operations
    createOrUpdateUser,
    getUserProfile,
    updateUserProfile,
    getAllUsersData, // 🚨 Now included in the services object
    
    // Course operations
    getAllCourses,
    getCourseById,
    createCourse,
    updateCourse,
    
    // Enrollment operations
    createEnrollment,
    getUserEnrollments,
    checkUserEnrollment,
    updateEnrollmentProgress,
    
    // Payment operations
    createPaymentRecord,
    updatePaymentStatus,
    getUserPaymentHistory,
    
    // Coupon operations
    getAllActiveCoupons,
    validateCouponCode,
    applyCoupon,
    createCoupon,
    updateCoupon,
    deleteCoupon,
    
    // Course content operations
    getCourseContent,
    getModuleContent,
    
    // User progress operations
    getUserProgress,
    updateUserProgress,
    getSecureVideoAccessUrl,
    
    // Batch operations
    createEnrollmentWithPayment
};