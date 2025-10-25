/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Alert, AlertDescription } from './Alert';
import { cn } from '../../utils/cn';
import { useTheme } from '../../contexts/ThemeContext'; // Import your theme context

const FormField = ({ 
  label, 
  type = 'text', 
  placeholder, 
  required = false, 
  value, 
  onChange, 
  error, 
  className,
  rows = 3,
  children,
  ...props 
}) => {
  const [touched, setTouched] = useState(false);
  const { theme, colors } = useTheme(); // Get theme and colors from context
  const showError = touched && error;

  // Get border colors based on theme
  const getBorderColor = () => {
    if (showError) {
      return colors.error; // Use error color from theme
    }
    return colors.border; // Use border color from theme
  };

  const getFocusColor = () => {
    if (showError) {
      return colors.error; // Use error color from theme
    }
    return colors.primary; // Use primary color from theme
  };

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
    const baseStyles = {
      borderColor: getBorderColor(),
    };

    const focusStyles = {
      '--focus-ring-color': getFocusColor(),
    };

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
            style={baseStyles}
            className={cn(
              'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring-color)] transition-colors resize-y min-h-[80px]',
              showError 
                ? 'border-destructive' 
                : 'border-border'
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
            style={baseStyles}
            className={cn(
              'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring-color)] transition-colors',
              showError 
                ? 'border-destructive' 
                : 'border-border'
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
              style={{
                borderColor: showError ? colors.error : colors.border,
                color: colors.primary,
              }}
              className={cn(
                'h-4 w-4 focus:ring-[var(--focus-ring-color)] rounded',
                showError ? 'border-destructive' : 'border-border'
              )}
              {...props}
            />
            {label && (
              <label 
                className="ml-2 block text-sm"
                style={{ color: colors.textMedium }}
              >
                {label}
                {required && (
                  <span 
                    className="ml-1"
                    style={{ color: colors.error }}
                  >
                    *
                  </span>
                )}
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
            style={baseStyles}
            className={cn(
              'w-full px-3 py-2 border outline-none rounded-md focus:ring-2 focus:ring-[var(--focus-ring-color)] transition-colors',
              showError 
                ? 'border-destructive' 
                : 'border-border'
            )}
            {...props}
          />
        );
    }
  };

  return (
    <div 
      className={cn('space-y-2', className)}
      style={type !== 'checkbox' ? { '--focus-ring-color': getFocusColor() } : {}}
    >
      {/* Don't show label for checkboxes since it's rendered inline */}
      {type !== 'checkbox' && label && (
        <label 
          className="block text-sm font-medium"
          style={{ color: colors.textMedium }}
        >
          {label}
          {required && (
            <span 
              className="ml-1"
              style={{ color: colors.error }}
            >
              *
            </span>
          )}
        </label>
      )}
      
      {renderField()}
      
      {showError && (
        <Alert 
          variant="destructive" 
          className="py-2"
          style={{
            backgroundColor: theme === 'dark' ? `${colors.error}20` : `${colors.error}10`,
            borderColor: colors.error,
          }}
        >
          <AlertDescription 
            className="text-sm"
            style={{ color: colors.error }}
          >
            {error}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default FormField;