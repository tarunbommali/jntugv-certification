
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
  gender: "string", 
  dateOfBirth: "timestamp",
     // Account Settings
  isAdmin: "boolean", // Admin privileges
  isActive: "boolean", // Account status
  emailVerified: "boolean",
  skills:["string"],
  bio: "string",
  socialLinks: {
    linkedin: "string",
    github: "string",
  },

  // Timestamps
  createdAt: "timestamp",
  updatedAt: "timestamp",
  lastLoginAt: "timestamp",
  
  
  // Learning Progress
  totalCoursesEnrolled: "number",
  totalCoursesCompleted: "number",
  learningStreak: "number", 
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

/**
 * ENROLLMENTS COLLECTION
 * Document ID: auto-generated
 */
export const ENROLLMENT_SCHEMA = {
  userId: "string",
  courseId: "string",
  courseTitle: "string",
  status: "string", // 'PENDING' | 'SUCCESS' | 'FAILED'
  enrolledAt: "timestamp",
  paymentId: "string",
  amount: "number",
  currency: "string",
  couponCode: "string",
  couponDiscount: "number",
  billingInfo: {
    name: "string",
    email: "string",
    phone: "string",
    address: "string"
  },
  progress: {
    modulesCompleted: "number",
    totalModules: "number",
    completionPercentage: "number",
    lastAccessedAt: "timestamp",
    timeSpent: "number"
  },
  moduleProgress: [
    {
      moduleId: "string",
      isCompleted: "boolean",
      completionPercentage: "number",
      timeSpent: "number"
    }
  ],
  certificateIssued: "boolean",
  createdAt: "timestamp",
  updatedAt: "timestamp"
};

/**
 * PAYMENTS COLLECTION
 */
export const PAYMENT_SCHEMA = {
  paymentId: "string",
  userId: "string",
  courseId: "string",
  amount: "number",
  currency: "string",
  gateway: "string",
  status: "string", // 'INITIATED' | 'SUCCESS' | 'FAILED'
  metadata: "object",
  createdAt: "timestamp",
  updatedAt: "timestamp"
};

/**
 * COUPONS COLLECTION
 */
export const COUPON_SCHEMA = {
  code: "string",
  type: "string", // 'percent' | 'flat'
  value: "number",
  isActive: "boolean",
  expiresAt: "timestamp",
  usageLimit: "number",
  createdAt: "timestamp",
  updatedAt: "timestamp"
};

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
