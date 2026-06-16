/**
 * Wrapper for async route handlers to pass errors to the centralized error middleware.
 * @param {Function} fn - The asynchronous route handler function
 * @returns {Function} Express middleware function
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
