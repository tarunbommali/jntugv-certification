/**
 * Firebase Schema Design for JNTU GV Certification Platform
 * 
 * This file defines the complete database schema structure for:
 * - User management with Google OAuth integration
 * - Course content with modules and videos
 * - Payment processing with Razorpay
 * - Coupon management system
 * - Enrollment tracking
 */

// ============================================================================
// COLLECTION SCHEMAS
// ============================================================================

/**
 * USERS COLLECTION
 * Document ID: user.uid (from Firebase Auth)
 */
export const USER_SCHEMA = {
  // Basic Info (from Firebase Auth)
  uid: "string", // Firebase Auth UID
  email: "string", // User email
  displayName: "string", // Full name
  photoURL: "string", // Google profile picture URL
  
  // Profile Information
  firstName: "string",
  lastName: "string", 
  phone: "string",
  college: "string",
  gender: "string", // "male" | "female" | "other" | "prefer-not-to-say"
  dateOfBirth: "timestamp",
  
  // Skills and Interests
  skills: ["string"], // Array of skill tags
  interests: ["string"], // Array of interest areas
  
  // Account Settings
  isAdmin: "boolean", // Admin privileges
  isActive: "boolean", // Account status
  emailVerified: "boolean",
  
  // Timestamps
  createdAt: "timestamp",
  updatedAt: "timestamp",
  lastLoginAt: "timestamp",
  
  // Preferences
  notifications: {
    email: "boolean",
    sms: "boolean",
    push: "boolean"
  },
  
  // Learning Progress
  totalCoursesEnrolled: "number",
  totalCoursesCompleted: "number",
  learningStreak: "number", // Days of consecutive learning
}

/**
 * COURSES COLLECTION
 * Document ID: auto-generated or custom course slug
 */
export const COURSE_SCHEMA = {
  // Basic Course Info
  title: "string",
  description: "string",
  shortDescription: "string",
  instructor: "string",
  instructorBio: "string",
  
  // Media
  thumbnail: "string", // Image URL
  bannerImage: "string", // Banner image URL
  previewVideo: "string", // Preview video URL
  
  // Pricing
  price: "number", // Current price in paise
  originalPrice: "number", // Original price for discount calculation
  currency: "string", // "INR"
  
  // Course Details
  duration: "number", // Duration in hours
  difficulty: "string", // "beginner" | "intermediate" | "advanced"
  language: "string", // "english" | "hindi" | "telugu"
  category: "string", // "ai-ml" | "web-development" | "cybersecurity" etc.
  
  // Content Structure
  modules: [
    {
      id: "string", // Unique module ID
      title: "string",
      description: "string",
      duration: "number", // Duration in minutes
      order: "number", // Display order
      isLocked: "boolean", // Whether module is locked
      unlockCondition: "string", // Condition to unlock (e.g., "complete_previous")
      
      // Content Types
      videos: [
        {
          id: "string",
          title: "string",
          url: "string", // Video URL (YouTube, Vimeo, or direct)
          duration: "number", // Duration in seconds
          thumbnail: "string",
          isPreview: "boolean", // Free preview video
        }
      ],
      
      resources: [
        {
          id: "string",
          title: "string",
          type: "string", // "pdf" | "doc" | "link" | "code"
          url: "string",
          description: "string"
        }
      ],
      
      quizzes: [
        {
          id: "string",
          title: "string",
          questions: "number",
          passingScore: "number", // Percentage
        }
      ]
    }
  ],
  
  // General Course Access (for courses without structured modules)
  contentAccessURL: "string", // General access link
  contentDescription: "string", // Description of general content
  
  // Course Stats
  totalEnrollments: "number",
  averageRating: "number",
  totalRatings: "number",
  
  // Status
  isPublished: "boolean",
  isFeatured: "boolean",
  status: "string", // "draft" | "published" | "archived"
  
  // SEO and Marketing
  tags: ["string"],
  metaDescription: "string",
  slug: "string", // URL-friendly course identifier
  
  // Timestamps
  createdAt: "timestamp",
  updatedAt: "timestamp",
  publishedAt: "timestamp",
}

/**
 * ENROLLMENTS COLLECTION
 * Document ID: auto-generated
 */
export const ENROLLMENT_SCHEMA = {
  // User and Course References
  userId: "string", // Reference to users collection
  courseId: "string", // Reference to courses collection
  courseTitle: "string", // Denormalized for easier queries
  
  // Enrollment Details
  status: "string", // "PENDING" | "SUCCESS" | "FAILED" | "CANCELLED" | "REFUNDED"
  enrolledAt: "timestamp",
  completedAt: "timestamp", // When course was completed
  
  // Payment Information
  paymentId: "string", // Razorpay payment ID
  amount: "number", // Amount paid in paise
  currency: "string", // "INR"
  
  // Coupon Information
  couponCode: "string", // Applied coupon code
  couponDiscount: "number", // Discount amount in paise
  
  // Billing Information
  billingInfo: {
    name: "string",
    email: "string", 
    phone: "string",
    college: "string",
    country: "string"
  },
  
  // Learning Progress
  progress: {
    modulesCompleted: "number",
    totalModules: "number",
    completionPercentage: "number",
    lastAccessedAt: "timestamp",
    timeSpent: "number", // Total time spent in minutes
  },
  
  // Module Progress Tracking
  moduleProgress: [
    {
      moduleId: "string",
      isCompleted: "boolean",
      completedAt: "timestamp",
      timeSpent: "number", // Time spent on this module in minutes
      videosWatched: ["string"], // Array of video IDs watched
      quizzesCompleted: ["string"], // Array of quiz IDs completed
    }
  ],
  
  // Certificate
  certificateIssued: "boolean",
  certificateUrl: "string",
  certificateIssuedAt: "timestamp",
}

/**
 * PAYMENTS COLLECTION
 * Document ID: Razorpay payment ID or auto-generated
 */
export const PAYMENT_SCHEMA = {
  // Payment Identifiers
  paymentId: "string", // Razorpay payment ID
  orderId: "string", // Razorpay order ID
  enrollmentId: "string", // Reference to enrollments collection
  
  // User and Course References
  userId: "string",
  courseId: "string",
  courseTitle: "string",
  
  // Payment Details
  amount: "number", // Amount in paise
  currency: "string", // "INR"
  status: "string", // "created" | "authorized" | "captured" | "refunded" | "failed"
  
  // Razorpay Response Data
  razorpayData: {
    paymentId: "string",
    orderId: "string",
    signature: "string",
    method: "string", // Payment method used
    bank: "string", // Bank name if applicable
    wallet: "string", // Wallet name if applicable
    vpa: "string", // UPI VPA if applicable
  },
  
  // Coupon Information
  couponCode: "string",
  couponDiscount: "number",
  
  // Pricing Breakdown
  pricing: {
    courseAmount: "number",
    platformDiscount: "number",
    couponDiscount: "number",
    subtotal: "number",
    tax: "number",
    total: "number"
  },
  
  // Timestamps
  createdAt: "timestamp",
  capturedAt: "timestamp",
  refundedAt: "timestamp",
  
  // Refund Information
  refund: {
    amount: "number",
    reason: "string",
    processedAt: "timestamp",
    refundId: "string"
  }
}

/**
 * COUPONS COLLECTION
 * Document ID: coupon code (uppercase)
 */
export const COUPON_SCHEMA = {
  // Basic Coupon Info
  code: "string", // Coupon code (uppercase)
  name: "string", // Display name
  description: "string",
  
  // Discount Details
  type: "string", // "percent" | "flat"
  value: "number", // Discount value (percentage or amount in paise)
  minOrderAmount: "number", // Minimum order amount to apply coupon
  maxDiscountAmount: "number", // Maximum discount amount (for percentage coupons)
  
  // Usage Limits
  usageLimit: "number", // Total usage limit (0 = unlimited)
  usedCount: "number", // Number of times used
  usageLimitPerUser: "number", // Usage limit per user (0 = unlimited)
  
  // Validity
  validFrom: "timestamp",
  validUntil: "timestamp",
  isActive: "boolean",
  
  // Applicability
  applicableCourses: ["string"], // Array of course IDs (empty = all courses)
  applicableCategories: ["string"], // Array of course categories
  
  // Admin Information
  createdBy: "string", // Admin user ID
  createdAt: "timestamp",
  updatedAt: "timestamp",
  
  // Analytics
  totalDiscountGiven: "number", // Total discount amount given
  totalOrders: "number", // Total orders using this coupon
}

/**
 * COURSE_CONTENT COLLECTION
 * Document ID: courseId_moduleId format
 * This collection stores detailed content for each module
 */
export const COURSE_CONTENT_SCHEMA = {
  // References
  courseId: "string",
  moduleId: "string",
  
  // Content Details
  title: "string",
  description: "string",
  order: "number",
  
  // Video Content
  videos: [
    {
      id: "string",
      title: "string",
      url: "string",
      duration: "number",
      thumbnail: "string",
      isPreview: "boolean",
      quality: ["string"], // Available quality options
      subtitles: [
        {
          language: "string",
          url: "string"
        }
      ]
    }
  ],
  
  // Additional Resources
  resources: [
    {
      id: "string",
      title: "string",
      type: "string", // "pdf" | "doc" | "link" | "code" | "image"
      url: "string",
      description: "string",
      size: "number", // File size in bytes
      downloadCount: "number"
    }
  ],
  
  // Quizzes and Assessments
  quizzes: [
    {
      id: "string",
      title: "string",
      questions: [
        {
          id: "string",
          question: "string",
          type: "string", // "multiple-choice" | "true-false" | "text"
          options: ["string"], // For multiple choice
          correctAnswer: "string",
          explanation: "string",
          points: "number"
        }
      ],
      passingScore: "number",
      timeLimit: "number", // Time limit in minutes
      attempts: "number", // Number of allowed attempts
    }
  ],
  
  // Learning Objectives
  objectives: ["string"],
  
  // Prerequisites
  prerequisites: ["string"],
  
  // Timestamps
  createdAt: "timestamp",
  updatedAt: "timestamp",
}

/**
 * USER_PROGRESS COLLECTION
 * Document ID: userId_courseId format
 * Tracks detailed learning progress for each user-course combination
 */
export const USER_PROGRESS_SCHEMA = {
  // References
  userId: "string",
  courseId: "string",
  enrollmentId: "string",
  
  // Overall Progress
  overallProgress: {
    modulesCompleted: "number",
    totalModules: "number",
    completionPercentage: "number",
    timeSpent: "number", // Total time in minutes
    lastAccessedAt: "timestamp",
    startedAt: "timestamp",
    completedAt: "timestamp"
  },
  
  // Module-wise Progress
  moduleProgress: [
    {
      moduleId: "string",
      isCompleted: "boolean",
      completionPercentage: "number",
      timeSpent: "number",
      startedAt: "timestamp",
      completedAt: "timestamp",
      
      // Video Progress
      videosWatched: [
        {
          videoId: "string",
          watchedDuration: "number", // Duration watched in seconds
          totalDuration: "number", // Total video duration
          completionPercentage: "number",
          lastWatchedAt: "timestamp"
        }
      ],
      
      // Quiz Progress
      quizAttempts: [
        {
          quizId: "string",
          attemptNumber: "number",
          score: "number",
          maxScore: "number",
          passed: "boolean",
          attemptedAt: "timestamp",
          timeSpent: "number"
        }
      ],
      
      // Resource Access
      resourcesAccessed: [
        {
          resourceId: "string",
          accessedAt: "timestamp",
          downloadCount: "number"
        }
      ]
    }
  ],
  
  // Learning Analytics
  analytics: {
    averageSessionDuration: "number",
    totalSessions: "number",
    longestStreak: "number", // Days
    currentStreak: "number", // Days
    preferredLearningTime: "string", // "morning" | "afternoon" | "evening" | "night"
  },
  
  // Timestamps
  createdAt: "timestamp",
  updatedAt: "timestamp",
}

// ============================================================================
// HELPER FUNCTIONS FOR SCHEMA VALIDATION AND UTILITIES
// ============================================================================

/**
 * Validate user data against schema
 */
export const validateUserData = (userData) => {
  const requiredFields = ['uid', 'email'];
  const missingFields = requiredFields.filter(field => !userData[field]);
  
  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
  }
  
  return true;
};

/**
 * Validate course data against schema
 */
export const validateCourseData = (courseData) => {
  const requiredFields = ['title', 'description', 'price'];
  const missingFields = requiredFields.filter(field => !courseData[field]);
  
  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
  }
  
  return true;
};

/**
 * Validate enrollment data against schema
 */
export const validateEnrollmentData = (enrollmentData) => {
  const requiredFields = ['userId', 'courseId', 'status'];
  const missingFields = requiredFields.filter(field => !enrollmentData[field]);
  
  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
  }
  
  return true;
};

/**
 * Validate coupon data against schema
 */
export const validateCouponData = (couponData) => {
  const requiredFields = ['code', 'type', 'value'];
  const missingFields = requiredFields.filter(field => !couponData[field]);
  
  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
  }
  
  if (!['percent', 'flat'].includes(couponData.type)) {
    throw new Error('Coupon type must be either "percent" or "flat"');
  }
  
  return true;
};

/**
 * Generate default user data for new users
 */
export const generateDefaultUserData = (firebaseUser) => {
  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: firebaseUser.displayName || '',
    photoURL: firebaseUser.photoURL || '',
    firstName: firebaseUser.displayName?.split(' ')[0] || '',
    lastName: firebaseUser.displayName?.split(' ').slice(1).join(' ') || '',
    phone: '',
    college: '',
    gender: '',
    skills: [],
    interests: [],
    isAdmin: false,
    isActive: true,
    emailVerified: firebaseUser.emailVerified,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastLoginAt: new Date(),
    notifications: {
      email: true,
      sms: false,
      push: true
    },
    totalCoursesEnrolled: 0,
    totalCoursesCompleted: 0,
    learningStreak: 0
  };
};

/**
 * Generate default enrollment data
 */
export const generateDefaultEnrollmentData = (userId, courseId, courseTitle, paymentData) => {
  return {
    userId,
    courseId,
    courseTitle,
    status: 'SUCCESS',
    enrolledAt: new Date(),
    paymentId: paymentData.paymentId,
    amount: paymentData.amount,
    currency: paymentData.currency || 'INR',
    couponCode: paymentData.couponCode || null,
    couponDiscount: paymentData.couponDiscount || 0,
    billingInfo: paymentData.billingInfo,
    progress: {
      modulesCompleted: 0,
      totalModules: 0, // Will be updated when course modules are loaded
      completionPercentage: 0,
      lastAccessedAt: new Date(),
      timeSpent: 0
    },
    moduleProgress: [],
    certificateIssued: false
  };
};

export default {
  USER_SCHEMA,
  COURSE_SCHEMA,
  ENROLLMENT_SCHEMA,
  PAYMENT_SCHEMA,
  COUPON_SCHEMA,
  COURSE_CONTENT_SCHEMA,
  USER_PROGRESS_SCHEMA,
  validateUserData,
  validateCourseData,
  validateEnrollmentData,
  validateCouponData,
  generateDefaultUserData,
  generateDefaultEnrollmentData
};
