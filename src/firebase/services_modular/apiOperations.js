/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import { auth } from '../../firebase';
import { createErrorResponse } from '../../utils/errorHandling';

const trimTrailingSlash = (value = '') => value.replace(/\/+$/, '');

const joinUrlSegments = (base, endpoint) => {
  if (!base) return endpoint;
  if (base.endsWith('/') && endpoint.startsWith('/')) {
    return `${base}${endpoint.slice(1)}`;
  }
  if (!base.endsWith('/') && !endpoint.startsWith('/')) {
    return `${base}/${endpoint}`;
  }
  return `${base}${endpoint}`;
};

// Determine one or more base URLs. Prefer explicit override, fall back to proxy in dev,
// then to the deployed Cloud Function URL.
const resolveApiBaseCandidates = () => {
  const candidates = [];
  const explicit = import.meta.env.VITE_API_URL?.trim();
  if (explicit) {
    candidates.push(trimTrailingSlash(explicit));
    return candidates;
  }

  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID?.trim();
  const remoteBase = projectId
    ? `https://us-central1-${projectId}.cloudfunctions.net/api`
    : undefined;

  if (import.meta.env.DEV) {
    // Use the Vite proxy when available. Developers can disable it by setting
    // VITE_USE_DEV_PROXY=false in .env if they prefer direct calls.
    const proxyDisabled = import.meta.env.VITE_USE_DEV_PROXY === 'false';
    if (!proxyDisabled) {
      candidates.push('/__api');
    }
    if (remoteBase) {
      candidates.push(trimTrailingSlash(remoteBase));
    }
    if (candidates.length > 0) {
      return candidates;
    }
  }

  if (remoteBase) {
    candidates.push(trimTrailingSlash(remoteBase));
  } else {
    // Helpful fallback, but this will 404 until the developer configures env vars.
    candidates.push('https://us-central1-your-project-id.cloudfunctions.net/api');
  }

  return candidates;
};

const API_BASE_CANDIDATES = resolveApiBaseCandidates();

// Helper function to get auth token
const getAuthToken = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');
  return await user.getIdToken();
};

// Helper function to make API calls
const apiCall = async (endpoint, options = {}) => {
  const token = await getAuthToken();
  const requestHeaders = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
    ...options.headers,
  };

  const errors = [];

  for (const base of API_BASE_CANDIDATES) {
    const url = joinUrlSegments(base, endpoint);

    try {
      const response = await fetch(url, {
        ...options,
        headers: requestHeaders,
      });

      const contentType = response.headers.get('content-type') || '';
      let payload;

      if (contentType.includes('application/json')) {
        payload = await response.json();
      } else {
        const text = await response.text();
        const error = new Error(
          text || `Unexpected response from API (status ${response.status})`
        );
        error.code = contentType.includes('text/html') ? 'invalid-response' : undefined;
        error.status = response.status;
        error.apiBase = base;
        error.rawResponse = text;
        throw error;
      }

      if (!response.ok || payload?.success === false) {
        const error = new Error(
          payload?.error || payload?.message || `HTTP ${response.status}`
        );
        error.code = response.status >= 500 ? 'server-error' : 'client-error';
        error.status = response.status;
        error.apiBase = base;
        error.payload = payload;
        throw error;
      }

      return payload;
    } catch (error) {
      error.apiBase = error.apiBase || base;
      errors.push(error);
      const isRelativeBase = typeof base === 'string' && base.startsWith('/');
      const isClientError = error.status && error.status < 500;
      const shouldRetry = !isClientError || isRelativeBase;

      if (!shouldRetry) {
        break;
      }
    }
  }

  const finalError = errors.pop() || new Error('API request failed');
  return createErrorResponse(finalError, `API Call to ${endpoint}`);
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
// PROFILE API OPERATIONS
// ============================================================================

/**
 * Get current authenticated user's profile via API
 */
export const getProfileViaAPI = async () => {
  return await apiCall('/profile');
};

/**
 * Update current authenticated user's profile via API
 * updateData: object with allowed profile fields
 */
export const updateProfileViaAPI = async (updateData) => {
  return await apiCall('/profile', {
    method: 'PUT',
    body: JSON.stringify(updateData),
  });
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
  getProfileViaAPI,
  updateProfileViaAPI,
  
  // Enrollment operations
  createEnrollmentViaAPI,
  getUserEnrollmentsViaAPI,
  updateEnrollmentViaAPI,
  deleteEnrollmentViaAPI,
  
  // Course operations
  getCoursesViaAPI,
};