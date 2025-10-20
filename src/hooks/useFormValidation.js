import { useState, useCallback } from 'react';

export const useFormValidation = (initialValues = {}, validationRules = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = useCallback((name, value) => {
    const rules = validationRules[name];
    if (!rules) return '';

    for (const rule of rules) {
      const error = rule(value, values);
      if (error) return error;
    }
    return '';
  }, [validationRules, values]);

  const validateForm = useCallback(() => {
    const newErrors = {};
    let isValid = true;

    Object.keys(validationRules).forEach(field => {
      const error = validateField(field, values[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [values, validateField, validationRules]);

  const handleChange = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  const handleBlur = useCallback((name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Validate field on blur
    const error = validateField(name, values[name]);
    if (error) {
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  }, [validateField, values]);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  const setFieldError = useCallback((name, error) => {
    setErrors(prev => ({ ...prev, [name]: error }));
  }, []);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    resetForm,
    setFieldError,
    isValid: Object.keys(errors).length === 0 && Object.keys(touched).length > 0
  };
};

// Common validation rules
export const validationRules = {
  required: (message = 'This field is required') => (value) => 
    !value || value.trim() === '' ? message : '',

  email: (message = 'Please enter a valid email address') => (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return value && !emailRegex.test(value) ? message : '';
  },

  minLength: (min, message) => (value) => 
    value && value.length < min ? message || `Must be at least ${min} characters` : '',

  maxLength: (max, message) => (value) => 
    value && value.length > max ? message || `Must be no more than ${max} characters` : '',

  phone: (message = 'Please enter a valid phone number') => (value) => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return value && !phoneRegex.test(value.replace(/\s/g, '')) ? message : '';
  },

  number: (message = 'Please enter a valid number') => (value) => 
    value && isNaN(Number(value)) ? message : '',

  positiveNumber: (message = 'Please enter a positive number') => (value) => 
    value && Number(value) <= 0 ? message : '',

  url: (message = 'Please enter a valid URL') => (value) => {
    try {
      new URL(value);
      return '';
    } catch {
      return value ? message : '';
    }
  },

  match: (fieldName, message) => (value, allValues) => 
    value !== allValues[fieldName] ? message : '',

  custom: (validator, message) => (value) => 
    !validator(value) ? message : ''
};

export default useFormValidation;