/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Alert, AlertDescription } from './Alert';
import { cn } from '../../utils/cn';

const FormField = ({ 
  label, 
  type = 'text', 
  placeholder, 
  required = false, 
  value, 
  onChange, 
  error, 
  className,
  rows = 3, // Added rows prop for textarea
  children, // For select options
  ...props 
}) => {
  const [touched, setTouched] = useState(false);
  const showError = touched && error;

  const handleBlur = () => {
    setTouched(true);
  };

  const handleChange = (e) => {
    const newValue = type === 'checkbox' ? e.target.checked : e.target.value;
    onChange(newValue);
    if (touched) {
      setTouched(false);
    }
  };

  const renderField = () => {
    switch (type) {
      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={placeholder}
            required={required}
            rows={rows}
            className={cn(
              'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-colors resize-y min-h-[80px]',
              showError 
                ? 'border-destructive focus:ring-destructive' 
                : 'border-border focus:ring-primary'
            )}
            {...props}
          />
        );
      
      case 'select':
        return (
          <select
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            required={required}
            className={cn(
              'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-colors',
              showError 
                ? 'border-destructive focus:ring-destructive' 
                : 'border-border focus:ring-primary'
            )}
            {...props}
          >
            {children}
          </select>
        );
      
      case 'checkbox':
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={value || false}
              onChange={handleChange}
              onBlur={handleBlur}
              className={cn(
                'h-4 w-4 text-primary focus:ring-primary border-border rounded',
                showError ? 'border-destructive' : 'border-border'
              )}
              {...props}
            />
            {label && (
              <label className="ml-2 block text-sm text-foreground">
                {label}
                {required && <span className="text-destructive ml-1">*</span>}
              </label>
            )}
          </div>
        );
      
      default:
        return (
          <input
            type={type}
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={placeholder}
            required={required}
            className={cn(
              'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-colors',
              showError 
                ? 'border-destructive focus:ring-destructive' 
                : 'border-border focus:ring-primary'
            )}
            {...props}
          />
        );
    }
  };

  return (
    <div className={cn('space-y-2', className)}>
      {/* Don't show label for checkboxes since it's rendered inline */}
      {type !== 'checkbox' && label && (
        <label className="block text-sm font-medium text-foreground">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}
      
      {renderField()}
      
      {showError && (
        <Alert variant="destructive" className="py-2">
          <AlertDescription className="text-sm">{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default FormField;