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
  ...props 
}) => {
  const [touched, setTouched] = useState(false);
  const showError = touched && error;

  const handleBlur = () => {
    setTouched(true);
  };

  const handleChange = (e) => {
    onChange(e.target.value);
    if (touched) {
      setTouched(false);
    }
  };

  return (
    <div className={cn('space-y-2', className)}>
      <label className="block text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
      
      {type === 'textarea' ? (
        <textarea
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
      ) : type === 'select' ? (
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
          {props.children}
        </select>
      ) : (
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
      )}
      
      {showError && (
        <Alert variant="destructive" className="py-2">
          <AlertDescription className="text-sm">{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default FormField;