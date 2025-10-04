import { useState, useCallback } from 'react';

export const useFirebaseErrorHandler = () => {
  const [error, setError] = useState(null);
  const [isIndexError, setIsIndexError] = useState(false);

  const handleError = useCallback((error, context = '') => {
    console.error(`Firebase Error in ${context}:`, error);
    
    // Check if it's an index error
    if (error.code === 'failed-precondition' && error.message.includes('index')) {
      setIsIndexError(true);
      setError({
        type: 'index',
        message: 'Database index is being created. Please wait a moment and refresh the page.',
        action: 'refresh'
      });
    } else if (error.code === 'permission-denied') {
      setError({
        type: 'permission',
        message: 'You do not have permission to perform this action.',
        action: 'login'
      });
    } else if (error.code === 'unavailable') {
      setError({
        type: 'network',
        message: 'Network error. Please check your connection and try again.',
        action: 'retry'
      });
    } else {
      setError({
        type: 'general',
        message: error.message || 'An unexpected error occurred.',
        action: 'retry'
      });
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
    setIsIndexError(false);
  }, []);

  return {
    error,
    isIndexError,
    handleError,
    clearError
  };
};

export default useFirebaseErrorHandler;