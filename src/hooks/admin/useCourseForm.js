import { useState, useCallback } from "react";
import { validateField, validateForm } from "../../utils/validation/courseFormValidation.js";

/**
 * Custom hook for form state management
 */
export const useCourseForm = (initialState) => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const updateField = useCallback((field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when field is updated
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  }, [errors]);

  const markFieldTouched = useCallback((field) => {
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }));
  }, []);

  const validateFieldAndUpdate = useCallback((field, value) => {
    const newErrors = validateField(field, value, errors);
    setErrors(newErrors);
    return !newErrors[field];
  }, [errors]);

  const validateFormAndUpdate = useCallback(() => {
    const newErrors = validateForm(formData);
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  }, [formData]);

  return {
    formData,
    errors,
    touched,
    updateField,
    markFieldTouched,
    validateField: validateFieldAndUpdate,
    validateForm: validateFormAndUpdate,
    setFormData,
    setErrors,
  };
};