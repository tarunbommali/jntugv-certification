/* eslint-disable no-unused-vars */
// src/utils/helper/enrollmentHelpers.js

import {
  CheckCircle,
  AlertCircle,
  XCircle,
} from "lucide-react";

export const getStatusIcon = (status) => {
  switch (status) {
    case "SUCCESS":
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    case "PENDING":
      return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    case "FAILED":
      return <XCircle className="w-4 h-4 text-red-500" />;
    default:
      return <AlertCircle className="w-4 h-4 text-gray-500" />;
  }
};

export const getStatusColor = (status) => {
  switch (status) {
    case "SUCCESS":
      return "bg-green-100 text-green-800";
    case "PENDING":
      return "bg-yellow-100 text-yellow-800";
    case "FAILED":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getUniqueStatuses = (enrollments) => {
  const statuses = [...new Set(enrollments.map(e => e.status))];
  return statuses;
};

export const getPublishedCourses = (courses) => {
  return courses.filter(course => course.isPublished === true);
};

export const filterEnrollments = (enrollments, filters) => {
  const { searchTerm, statusFilter, userFilter, courseFilter } = filters;
  
  return enrollments.filter((enrollment) => {
    const userDisplayName = enrollment.user?.displayName || '';
    const userEmail = enrollment.user?.email || '';
    const courseTitle = enrollment.course?.title || '';
    
    const matchesSearch = 
      userDisplayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      courseTitle.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "ALL" || enrollment.status === statusFilter;
    const matchesUser = userFilter === "ALL" || enrollment.userId === userFilter;
    const matchesCourse = courseFilter === "ALL" || enrollment.courseId === courseFilter;

    return matchesSearch && matchesStatus && matchesUser && matchesCourse;
  });
};

export const calculateStats = (enrollments) => {
  const total = enrollments.length;
  const successful = enrollments.filter(e => e.status === "SUCCESS").length;
  const pending = enrollments.filter(e => e.status === "PENDING").length;
  const totalRevenue = enrollments.reduce((sum, e) => sum + (e.paidAmount || 0), 0);

  return { total, successful, pending, totalRevenue };
};

// New function to clean enrollment data for display
export const getCleanEnrollmentData = (enrollment) => {
  return {
    id: enrollment.id,
    userId: enrollment.userId,
    courseId: enrollment.courseId,
    status: enrollment.status || 'PENDING',
    paidAmount: enrollment.paidAmount || 0,
    enrolledAt: enrollment.enrolledAt,
    paymentDetails: enrollment.paymentDetails || {},
    
    // User data (if available)
    user: enrollment.user ? {
      displayName: enrollment.user.displayName || 'Unknown User',
      email: enrollment.user.email || 'No email',
      uid: enrollment.user.uid
    } : null,
    
    // Course data (if available)
    course: enrollment.course ? {
      title: enrollment.course.title || 'Unknown Course',
      category: enrollment.course.category || 'Uncategorized',
      isPublished: enrollment.course.isPublished || false,
      price: enrollment.course.price || 0
    } : null
  };
};

// Function to validate enrollment has required data
export const isValidEnrollment = (enrollment) => {
  return enrollment && 
         enrollment.id && 
         enrollment.userId && 
         enrollment.courseId &&
         enrollment.status;
};