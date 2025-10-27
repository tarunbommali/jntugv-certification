/* eslint-disable no-unused-vars */
import * as user from "./userOperations.js";
import * as course from "./courseOperations.js";
import * as enrollment from "./enrollmentOperations.js";
import * as coupon from "./couponOperations.js";
import * as payment from "./paymentOperations.js";
import * as progress from "./userProgressOperations.js";
import { getProfileViaAPI, updateProfileViaAPI } from "./apiOperations.js";

// Named exports
export const createOrUpdateUser = user.createOrUpdateUser;
export const getUserProfile = user.getUserProfile;
export const updateUserProfile = user.updateUserProfile;
export const getAllUsersData = user.getAllUsersData;

export const getAllCourses = course.getAllCourses;
export const getCourseById = course.getCourseById;
export const createCourse = course.createCourse;
export const updateCourse = course.updateCourse;

export const createEnrollment = enrollment.createEnrollment;
export const getUserEnrollments = enrollment.getUserEnrollments;
export const checkUserEnrollment = enrollment.checkUserEnrollment;
export const updateEnrollmentProgress = enrollment.updateEnrollmentProgress;
export const getUserEnrollmentStats = enrollment.getUserEnrollmentStats;
export const updateEnrollment = enrollment.updateEnrollment;
export const deleteEnrollment = enrollment.deleteEnrollment;

export const getAllActiveCoupons = coupon.getAllActiveCoupons;
export const validateCouponCode = coupon.validateCouponCode;
export const applyCoupon = coupon.applyCoupon;
export const createCoupon = coupon.createCoupon;
export const updateCoupon = coupon.updateCoupon;
export const deleteCoupon = coupon.deleteCoupon;

export const createPaymentRecord = payment.createPaymentRecord;
export const updatePaymentStatus = payment.updatePaymentStatus;
export const getUserPaymentHistory = payment.getUserPaymentHistory;

export const getUserProgress = progress.getUserProgress;
export const updateUserProgress = progress.updateUserProgress;
export const getSecureVideoAccessUrl = progress.getSecureVideoAccessUrl;
export { getProfileViaAPI, updateProfileViaAPI };

// Fallback placeholders for less-used functions
export const getCourseContent = async (...args) => ({
  success: false,
  error: "Not implemented",
});
export const getModuleContent = async (...args) => ({
  success: false,
  error: "Not implemented",
});
export const createEnrollmentWithPayment = async (...args) => ({
  success: false,
  error: "Not implemented",
});

const defaultExport = {
  // User
  createOrUpdateUser,
  getUserProfile,
  updateUserProfile,
  getAllUsersData,

  // Courses
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,

  // Enrollment
  createEnrollment,
  getUserEnrollments,
  checkUserEnrollment,
  updateEnrollmentProgress,
  getUserEnrollmentStats,
  updateEnrollment,
  deleteEnrollment,

  // Coupon
  getAllActiveCoupons,
  validateCouponCode,
  applyCoupon,
  createCoupon,
  updateCoupon,
  deleteCoupon,

  // Payments
  createPaymentRecord,
  updatePaymentStatus,
  getUserPaymentHistory,

  // Progress
  getUserProgress,
  updateUserProgress,
  getSecureVideoAccessUrl,
  // Profile API
  getProfileViaAPI,
  updateProfileViaAPI,

  // Misc
  getCourseContent,
  getModuleContent,
  createEnrollmentWithPayment,
};

export default defaultExport;
