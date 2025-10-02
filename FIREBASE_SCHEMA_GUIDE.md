# JNTU GV Certification Platform - Firebase Schema & Implementation Guide

## Overview

This document provides a comprehensive guide to the Firebase schema and implementation for the JNTU GV Certification Platform. The system is designed to be minimalistic yet comprehensive, supporting user management, course content delivery, payment processing, and coupon management.

## 🏗️ Firebase Schema Design

### Collections Overview

The platform uses the following Firebase collections:

1. **users** - User profiles and authentication data
2. **courses** - Course information and metadata
3. **enrollments** - User course enrollments and progress
4. **payments** - Payment records and transaction history
5. **coupons** - Discount codes and promotional offers
6. **course_content** - Detailed course modules and content
7. **user_progress** - Individual learning progress tracking

### 1. Users Collection

**Document ID**: `user.uid` (from Firebase Auth)

```javascript
{
  // Basic Info (from Firebase Auth)
  uid: "string",
  email: "string",
  displayName: "string",
  photoURL: "string", // Google profile picture URL
  
  // Profile Information
  firstName: "string",
  lastName: "string", 
  phone: "string",
  college: "string",
  gender: "string",
  dateOfBirth: "timestamp",
  
  // Skills and Interests
  skills: ["string"],
  interests: ["string"],
  
  // Account Settings
  isAdmin: "boolean",
  isActive: "boolean",
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
  learningStreak: "number"
}
```

### 2. Courses Collection

**Document ID**: Auto-generated or custom course slug

```javascript
{
  // Basic Course Info
  title: "string",
  description: "string",
  shortDescription: "string",
  instructor: "string",
  instructorBio: "string",
  
  // Media
  thumbnail: "string",
  bannerImage: "string",
  previewVideo: "string",
  
  // Pricing
  price: "number", // Current price in paise
  originalPrice: "number",
  currency: "string",
  
  // Course Details
  duration: "number", // Duration in hours
  difficulty: "string", // "beginner" | "intermediate" | "advanced"
  language: "string",
  category: "string",
  
  // Content Structure
  modules: [
    {
      id: "string",
      title: "string",
      description: "string",
      duration: "number",
      order: "number",
      isLocked: "boolean",
      unlockCondition: "string",
      
      videos: [
        {
          id: "string",
          title: "string",
          url: "string",
          duration: "number",
          thumbnail: "string",
          isPreview: "boolean"
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
          passingScore: "number"
        }
      ]
    }
  ],
  
  // General Course Access
  contentAccessURL: "string",
  contentDescription: "string",
  
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
  slug: "string",
  
  // Timestamps
  createdAt: "timestamp",
  updatedAt: "timestamp",
  publishedAt: "timestamp"
}
```

### 3. Enrollments Collection

**Document ID**: Auto-generated

```javascript
{
  // User and Course References
  userId: "string",
  courseId: "string",
  courseTitle: "string",
  
  // Enrollment Details
  status: "string", // "PENDING" | "SUCCESS" | "FAILED" | "CANCELLED" | "REFUNDED"
  enrolledAt: "timestamp",
  completedAt: "timestamp",
  
  // Payment Information
  paymentId: "string",
  amount: "number",
  currency: "string",
  
  // Coupon Information
  couponCode: "string",
  couponDiscount: "number",
  
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
    timeSpent: "number"
  },
  
  // Module Progress Tracking
  moduleProgress: [
    {
      moduleId: "string",
      isCompleted: "boolean",
      completedAt: "timestamp",
      timeSpent: "number",
      videosWatched: ["string"],
      quizzesCompleted: ["string"]
    }
  ],
  
  // Certificate
  certificateIssued: "boolean",
  certificateUrl: "string",
  certificateIssuedAt: "timestamp"
}
```

### 4. Payments Collection

**Document ID**: Razorpay payment ID or auto-generated

```javascript
{
  // Payment Identifiers
  paymentId: "string",
  orderId: "string",
  enrollmentId: "string",
  
  // User and Course References
  userId: "string",
  courseId: "string",
  courseTitle: "string",
  
  // Payment Details
  amount: "number",
  currency: "string",
  status: "string", // "created" | "authorized" | "captured" | "refunded" | "failed"
  
  // Razorpay Response Data
  razorpayData: {
    paymentId: "string",
    orderId: "string",
    signature: "string",
    method: "string",
    bank: "string",
    wallet: "string",
    vpa: "string"
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
```

### 5. Coupons Collection

**Document ID**: Coupon code (uppercase)

```javascript
{
  // Basic Coupon Info
  code: "string",
  name: "string",
  description: "string",
  
  // Discount Details
  type: "string", // "percent" | "flat"
  value: "number",
  minOrderAmount: "number",
  maxDiscountAmount: "number",
  
  // Usage Limits
  usageLimit: "number",
  usedCount: "number",
  usageLimitPerUser: "number",
  
  // Validity
  validFrom: "timestamp",
  validUntil: "timestamp",
  isActive: "boolean",
  
  // Applicability
  applicableCourses: ["string"],
  applicableCategories: ["string"],
  
  // Admin Information
  createdBy: "string",
  createdAt: "timestamp",
  updatedAt: "timestamp",
  
  // Analytics
  totalDiscountGiven: "number",
  totalOrders: "number"
}
```

## 🔧 Implementation Details

### Context Architecture

The platform uses a layered context architecture to prevent unnecessary API calls and implement proper caching:

1. **AuthContext** - Handles authentication and user profile management
2. **CourseContext** - Manages course data and caching
3. **UserContext** - Handles user-specific data like enrollments
4. **PaymentContext** - Manages payment history and coupon validation
5. **CourseContentContext** - Handles course content and learning progress

### Key Features Implemented

#### 1. Google OAuth Integration
- Automatic profile creation with Google data
- Profile picture and display name storage
- Seamless authentication flow

#### 2. Course Content Management
- Structured module-based content delivery
- Video player with progress tracking
- Resource downloads and access control
- Learning path progression

#### 3. Payment Processing
- Razorpay integration for secure payments
- Coupon validation and application
- Payment history tracking
- Refund management

#### 4. Admin Dashboard
- Coupon creation and management
- Usage analytics and monitoring
- Bulk operations support

#### 5. Progress Tracking
- Real-time learning progress
- Module completion tracking
- Time spent analytics
- Certificate generation

## 🚀 Usage Examples

### Creating a User Profile

```javascript
import { createOrUpdateUser } from '../firebase/services';

// After Google OAuth sign-in
const result = await createOrUpdateUser(firebaseUser, {
  firstName: 'John',
  lastName: 'Doe',
  college: 'JNTU-GV',
  skills: ['JavaScript', 'React', 'Node.js']
});
```

### Validating a Coupon

```javascript
import { validateCouponCode } from '../firebase/services';

const result = await validateCouponCode('WELCOME10', courseId, userId);
if (result.success) {
  const discount = calculateDiscount(result.data, subtotal);
}
```

### Tracking Learning Progress

```javascript
import { updateUserProgress } from '../firebase/services';

await updateUserProgress(userId, courseId, {
  'moduleProgress.module1.isCompleted': true,
  'moduleProgress.module1.completedAt': new Date(),
  'overallProgress.modulesCompleted': increment(1)
});
```

## 📁 File Structure

```
src/
├── firebase/
│   ├── schema.js          # Schema definitions and validation
│   └── services.js        # Database operations
├── contexts/
│   ├── AuthContext.jsx    # Authentication management
│   ├── CourseContext.jsx  # Course data management
│   ├── UserContext.jsx    # User-specific data
│   ├── PaymentContext.jsx # Payment and coupon management
│   └── CourseContentContext.jsx # Learning progress tracking
├── components/
│   └── VideoPlayer.jsx    # Custom video player component
└── pages/
    ├── CourseContent.jsx  # Course learning interface
    ├── CheckoutPage.jsx   # Payment processing
    └── AdminCouponDashboard.jsx # Admin coupon management
```

## 🔒 Security Considerations

1. **Firestore Security Rules**: Implement proper security rules to protect user data
2. **Admin Access Control**: Verify admin privileges before allowing coupon management
3. **Payment Security**: Use Razorpay's secure payment processing
4. **Data Validation**: Validate all inputs using the schema validation functions

## 📊 Performance Optimizations

1. **Context Caching**: Contexts prevent unnecessary API calls
2. **Batch Operations**: Use Firestore batch writes for related operations
3. **Pagination**: Implement pagination for large data sets
4. **Lazy Loading**: Load course content on demand

## 🧪 Testing Recommendations

1. **Unit Tests**: Test schema validation functions
2. **Integration Tests**: Test Firebase service functions
3. **E2E Tests**: Test complete user flows
4. **Payment Testing**: Use Razorpay test mode for payment testing

## 📈 Future Enhancements

1. **Real-time Updates**: Implement Firestore listeners for real-time updates
2. **Offline Support**: Add offline capability for course content
3. **Analytics Dashboard**: Enhanced analytics for course performance
4. **Mobile App**: React Native implementation
5. **AI Recommendations**: Personalized course recommendations

## 🛠️ Setup Instructions

1. **Firebase Configuration**: Set up Firebase project and enable Firestore
2. **Environment Variables**: Configure Firebase and Razorpay keys
3. **Security Rules**: Implement Firestore security rules
4. **Admin Setup**: Create admin user accounts
5. **Course Data**: Populate initial course data

## 📞 Support

For technical support or questions about the implementation, please refer to the Firebase documentation or contact the development team.

---

**Note**: This implementation is designed to be minimalistic yet comprehensive, perfect for a beginner launching their first course platform. The schema is extensible and can be modified based on specific requirements.
