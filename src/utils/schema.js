// src/firebase/schema.js

/**
 * Schema Validation and Default Data Generation Helpers
 * * NOTE: These functions use basic JS validation for simplicity.
 * For production, replace these with a robust schema validation library (Zod, Yup, Joi).
 */

// Placeholder validation check function
const checkRequiredFields = (data, fields) => {
    for (const field of fields) {
        if (data[field] === undefined || data[field] === null || data[field] === '') {
            throw new Error(`Validation Error: Missing required field '${field}'`);
        }
    }
};

// ============================================================================
// USER SCHEMA
// ============================================================================

/**
 * Validates user data payload.
 */
export const validateUserData = (data) => {
    checkRequiredFields(data, ['uid', 'email', 'name', 'role']);
    if (typeof data.email !== 'string' || !data.email.includes('@')) {
        throw new Error('Validation Error: Invalid email format.');
    }
    // Add more validation rules here (e.g., role must be 'user' or 'admin')
    return true;
};

/**
 * Generates default user data upon creation.
 */
export const generateDefaultUserData = (firebaseUser) => {
    const emailParts = firebaseUser.email ? firebaseUser.email.split('@') : [];
    const defaultName = firebaseUser.displayName || emailParts[0] || 'New User';

    return {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        name: defaultName,
        photoURL: firebaseUser.photoURL || '',
        role: 'user', // Default role
        college: '',
        skills: [],
        totalCoursesEnrolled: 0,
        isAdmin: false,
        createdAt: new Date(), // Will be overwritten by serverTimestamp() in service
    };
};

// ============================================================================
// COURSE SCHEMA
// ============================================================================

/**
 * Validates course data payload.
 */
export const validateCourseData = (data) => {
    checkRequiredFields(data, ['title', 'description', 'price']);
    if (typeof data.price !== 'number' || data.price < 0) {
        throw new Error('Validation Error: Price must be a non-negative number.');
    }
    // Add more validation rules here
    return true;
};

// ============================================================================
// ENROLLMENT SCHEMA
// ============================================================================

/**
 * Validates enrollment data payload.
 */
export const validateEnrollmentData = (data) => {
    checkRequiredFields(data, ['userId', 'courseId', 'courseTitle', 'paymentData']);
    // Add more validation rules here
    return true;
};

/**
 * Generates default enrollment data.
 */
export const generateDefaultEnrollmentData = (userId, courseId, courseTitle, paymentData) => {
    return {
        userId: userId,
        courseId: courseId,
        courseTitle: courseTitle,
        status: 'PENDING', // Will be updated to 'SUCCESS' after payment confirmation
        paymentId: paymentData?.paymentId || 'N/A',
        amount: paymentData?.amount || 0,
        enrolledAt: new Date(), // Will be overwritten by serverTimestamp() in service
        progress: {
            modulesCompleted: 0,
            totalModules: 0, // Should be filled in post-creation or from course data
            completionPercentage: 0,
            timeSpent: 0
        }
    };
};

// ============================================================================
// COUPON SCHEMA
// ============================================================================

/**
 * Validates coupon data payload.
 */
export const validateCouponData = (data) => {
    checkRequiredFields(data, ['code', 'name', 'type', 'value', 'isActive']);
    if (data.type !== 'percent' && data.type !== 'flat') {
        throw new Error('Validation Error: Invalid coupon type.');
    }
    if (typeof data.value !== 'number' || data.value <= 0) {
        throw new Error('Validation Error: Discount value must be a positive number.');
    }
    return true;
};