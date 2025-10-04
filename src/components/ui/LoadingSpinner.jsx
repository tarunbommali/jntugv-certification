import React from 'react';
import { cn } from '../../utils/cn';

const LoadingSpinner = ({ className, size = 'md', ...props }) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-current border-t-transparent',
        sizes[size],
        className
      )}
      {...props}
    />
  );
};

export const LoadingScreen = ({ message = 'Loading...', className }) => (
  <div className={cn('min-h-screen flex items-center justify-center bg-gray-50', className)}>
    <div className="flex flex-col items-center gap-4">
      <LoadingSpinner size="lg" />
      <p className="text-gray-600">{message}</p>
    </div>
  </div>
);

export { LoadingSpinner };
export default LoadingSpinner;