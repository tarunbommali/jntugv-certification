/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import { auth } from '../../firebase';
import { createErrorResponse } from '../../utils/errorHandling';

// Prefer explicit override, otherwise derive from Firebase project id
const API_BASE_URL = import.meta.env.VITE_API_URL || (() => {
  const pid = import.meta.env.VITE_FIREBASE_PROJECT_ID;
  if (!pid) return 'https://us-central1-your-project-id.cloudfunctions.net/api';
  return `https://us-central1-${pid}.cloudfunctions.net/api`;
})();

// Helper function to get auth token
const getAuthToken = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');
  return await user.getIdToken();
};

// Helper function to make API calls
const apiCall = async (endpoint, options = {}) => {
  try {
    const token = await getAuthToken();
    const url = `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      const error = new Error(data.error || `HTTP ${response.status}`);
      error.code = response.status >= 500 ? 'server-error' : 'client-error';
      error.status = response.status;
      throw error;
    }
    
    return data;
  } catch (error) {
    return createErrorResponse(error, `API Call to ${endpoint}`);
  }
};

// ============================================================================
// USER MANAGEMENT API OPERATIONS
// ============================================================================

/**
 * Create a new user via admin API
 */
export const createUserViaAPI = async (userData) => {
  return await apiCall('/admin/createUser', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};

/**
 * Toggle user account status via admin API
 */
export const toggleUserStatusViaAPI = async (uid, action) => {
  return await apiCall('/admin/toggleUser', {
    method: 'POST',
    body: JSON.stringify({ uid, action }),
  });
};

/**
 * Get all users via admin API
 */
export const getUsersViaAPI = async (limit = 100, offset = 0) => {
  return await apiCall(`/admin/users?limit=${limit}&offset=${offset}`);
};

// ============================================================================
// ENROLLMENT MANAGEMENT API OPERATIONS
// ============================================================================

/**
 * Create enrollment via admin API
 */
export const createEnrollmentViaAPI = async (enrollmentData) => {
  return await apiCall('/admin/createEnrollment', {
    method: 'POST',
    body: JSON.stringify(enrollmentData),
  });
};

/**
 * Get user enrollments via admin API
 */
export const getUserEnrollmentsViaAPI = async (userId, status = 'SUCCESS') => {
  return await apiCall(`/admin/enrollments/${userId}?status=${status}`);
};

/**
 * Update enrollment via admin API
 */
export const updateEnrollmentViaAPI = async (enrollmentId, updateData) => {
  return await apiCall(`/admin/enrollments/${enrollmentId}`, {
    method: 'PUT',
    body: JSON.stringify(updateData),
  });
};

/**
 * Delete enrollment via admin API
 */
export const deleteEnrollmentViaAPI = async (enrollmentId) => {
  return await apiCall(`/admin/enrollments/${enrollmentId}`, {
    method: 'DELETE',
  });
};

// ============================================================================
// COURSE MANAGEMENT API OPERATIONS
// ============================================================================

/**
 * Get all courses via admin API
 */
export const getCoursesViaAPI = async () => {
  return await apiCall('/admin/courses');
};

export default {
  // User operations
  createUserViaAPI,
  toggleUserStatusViaAPI,
  getUsersViaAPI,
  
  // Enrollment operations
  createEnrollmentViaAPI,
  getUserEnrollmentsViaAPI,
  updateEnrollmentViaAPI,
  deleteEnrollmentViaAPI,
  
  // Course operations
  getCoursesViaAPI,
};