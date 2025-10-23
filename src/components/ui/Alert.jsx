/* eslint-disable no-unused-vars */
import React from 'react';
import { cn } from '../../utils/cn';
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';

const Alert = React.forwardRef(({ className, variant = 'default', ...props }, ref) => {
  const variants = {
    default: 'bg-background text-foreground',
    destructive: 'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive',
    success: 'border-green-200 bg-green-50 text-green-800 [&>svg]:text-green-600',
    warning: 'border-yellow-200 bg-yellow-50 text-yellow-800 [&>svg]:text-yellow-600',
    info: 'border-blue-200 bg-blue-50 text-blue-800 [&>svg]:text-blue-600'
  };

  return (
    <div
      ref={ref}
      role="alert"
      className={cn(
        'relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground',
        variants[variant],
        className
      )}
      {...props}
    />
  );
});
Alert.displayName = 'Alert';

const AlertTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn('mb-1 font-medium leading-none tracking-tight', className)}
    {...props}
  />
));
AlertTitle.displayName = 'AlertTitle';

const AlertDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-sm [&_p]:leading-relaxed', className)}
    {...props}
  />
));
AlertDescription.displayName = 'AlertDescription';

const AlertIcon = ({ variant = 'default' }) => {
  const icons = {
    default: Info,
    destructive: XCircle,
    success: CheckCircle,
    warning: AlertTriangle,
    info: Info
  };

  const Icon = icons[variant];
  return <Icon className="h-4 w-4" />;
};

export { Alert, AlertTitle, AlertDescription, AlertIcon };