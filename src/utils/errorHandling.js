/* eslint-disable no-console */

/**
 * Error handling utilities for the application
 */

// Error types
export const ERROR_TYPES = {
  NETWORK: 'NETWORK_ERROR',
  VALIDATION: 'VALIDATION_ERROR',
  AUTHENTICATION: 'AUTHENTICATION_ERROR',
  AUTHORIZATION: 'AUTHORIZATION_ERROR',
  NOT_FOUND: 'NOT_FOUND_ERROR',
  SERVER: 'SERVER_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR',
};

// Error messages mapping
export const ERROR_MESSAGES = {
  [ERROR_TYPES.NETWORK]: 'Network connection failed. Please check your internet connection.',
  [ERROR_TYPES.VALIDATION]: 'Please check your input and try again.',
  [ERROR_TYPES.AUTHENTICATION]: 'Authentication failed. Please sign in again.',
  [ERROR_TYPES.AUTHORIZATION]: 'You do not have permission to perform this action.',
  [ERROR_TYPES.NOT_FOUND]: 'The requested resource was not found.',
  [ERROR_TYPES.SERVER]: 'Server error occurred. Please try again later.',
  [ERROR_TYPES.UNKNOWN]: 'An unexpected error occurred. Please try again.',
};

/**
 * Classify error type based on error object
 */
export const classifyError = (error) => {
  if (!error) return ERROR_TYPES.UNKNOWN;

  // Network errors
  if (error.code === 'NETWORK_ERROR' || 
      error.message?.includes('Network Error') ||
      error.message?.includes('Failed to fetch')) {
    return ERROR_TYPES.NETWORK;
  }

  // Authentication errors
  if (error.code === 'auth/invalid-credential' ||
      error.code === 'auth/user-not-found' ||
      error.code === 'auth/wrong-password' ||
      error.message?.includes('Invalid auth token')) {
    return ERROR_TYPES.AUTHENTICATION;
  }

  // Authorization errors
  if (error.code === 'permission-denied' ||
      error.message?.includes('Insufficient permissions') ||
      error.message?.includes('Admin access required')) {
    return ERROR_TYPES.AUTHORIZATION;
  }

  // Validation errors
  if (error.code === 'validation-error' ||
      error.message?.includes('validation') ||
      error.message?.includes('required') ||
      error.message?.includes('invalid')) {
    return ERROR_TYPES.VALIDATION;
  }

  // Not found errors
  if (error.code === 'not-found' ||
      error.message?.includes('not found') ||
      error.message?.includes('does not exist')) {
    return ERROR_TYPES.NOT_FOUND;
  }

  // Server errors
  if (error.code === 'internal' ||
      error.code === 'server-error' ||
      error.message?.includes('Internal Server Error')) {
    return ERROR_TYPES.SERVER;
  }

  return ERROR_TYPES.UNKNOWN;
};

/**
 * Get user-friendly error message
 */
export const getErrorMessage = (error, customMessages = {}) => {
  const errorType = classifyError(error);
  const message = customMessages[errorType] || ERROR_MESSAGES[errorType];
  
  // If error has a specific message, use it if it's user-friendly
  if (error?.message && !error.message.includes('Error:') && error.message.length < 100) {
    return error.message;
  }
  
  return message;
};

/**
 * Log error for debugging
 */
export const logError = (error, context = '') => {
  const errorType = classifyError(error);
  const message = getErrorMessage(error);
  
  console.error(`[${context}] ${errorType}:`, {
    message,
    originalError: error,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Create standardized error response
 */
export const createErrorResponse = (error, context = '') => {
  const errorType = classifyError(error);
  const message = getErrorMessage(error);
  
  logError(error, context);
  
  return {
    success: false,
    error: message,
    errorType,
    timestamp: new Date().toISOString(),
  };
};

/**
 * Validation helpers
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validateRequired = (value, fieldName) => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    throw new Error(`${fieldName} is required`);
  }
  return true;
};

export const validateEnrollmentData = (data) => {
  const errors = [];
  
  if (!data.userId) errors.push('User ID is required');
  if (!data.courseId) errors.push('Course ID is required');
  if (data.paidAmount < 0) errors.push('Paid amount cannot be negative');
  if (data.status && !['SUCCESS', 'PENDING', 'FAILED'].includes(data.status)) {
    errors.push('Status must be SUCCESS, PENDING, or FAILED');
  }
  
  if (errors.length > 0) {
    throw new Error(errors.join(', '));
  }
  
  return true;
};

/**
 * API error handler wrapper
 */
export const withErrorHandling = (fn, context = '') => {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      return createErrorResponse(error, context);
    }
  };
};

/**
 * React hook for error handling
 */
export const useErrorHandler = () => {
  const handleError = (error, context = '') => {
    const errorResponse = createErrorResponse(error, context);
    return errorResponse;
  };

  const handleAsyncError = async (asyncFn, context = '') => {
    try {
      return await asyncFn();
    } catch (error) {
      return handleError(error, context);
    }
  };

  return { handleError, handleAsyncError };
};

export default {
  ERROR_TYPES,
  ERROR_MESSAGES,
  classifyError,
  getErrorMessage,
  logError,
  createErrorResponse,
  validateEmail,
  validatePassword,
  validateRequired,
  validateEnrollmentData,
  withErrorHandling,
  useErrorHandler,
};