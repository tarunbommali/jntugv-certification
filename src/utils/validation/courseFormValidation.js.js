/* eslint-disable no-unused-vars */
/**
 * Validates a specific form field
 * @param {string} field - The field name to validate
 * @param {any} value - The field value to validate
 * @param {Object} errors - Current errors object
 * @returns {Object} - Updated errors object
 */
export const validateField = (field, value, errors = {}) => {
  const newErrors = { ...errors };

  switch (field) {
    case "title":
      if (!value?.trim()) {
        newErrors.title = "Course title is required";
      } else if (value?.length < 5) {
        newErrors.title = "Title must be at least 5 characters";
      } else if (value?.length > 100) {
        newErrors.title = "Title must be less than 100 characters";
      } else {
        delete newErrors.title;
      }
      break;

    case "shortDescription":
      if (!value?.trim()) {
        newErrors.shortDescription = "Short description is required";
      } else if (value?.length < 10) {
        newErrors.shortDescription = "Short description must be at least 10 characters";
      } else if (value?.length > 200) {
        newErrors.shortDescription = "Short description must be less than 200 characters";
      } else {
        delete newErrors.shortDescription;
      }
      break;

    case "description":
      if (!value?.trim()) {
        newErrors.description = "Description is required";
      } else if (value?.length < 50) {
        newErrors.description = "Description must be at least 50 characters";
      } else if (value?.length > 2000) {
        newErrors.description = "Description must be less than 2000 characters";
      } else {
        delete newErrors.description;
      }
      break;

    case "instructor":
      if (!value?.trim()) {
        newErrors.instructor = "Instructor name is required";
      } else if (value?.length < 2) {
        newErrors.instructor = "Instructor name must be at least 2 characters";
      } else if (value?.length > 50) {
        newErrors.instructor = "Instructor name must be less than 50 characters";
      } else {
        delete newErrors.instructor;
      }
      break;

    case "price":
      if (value === "" || value === null || value === undefined) {
        newErrors.price = "Price is required";
      } else if (isNaN(value)) {
        newErrors.price = "Price must be a valid number";
      } else if (value < 0) {
        newErrors.price = "Price cannot be negative";
      } else if (value > 100000) {
        newErrors.price = "Price seems too high (max: 100,000)";
      } else {
        delete newErrors.price;
      }
      break;

    case "originalPrice":
      if (value !== "" && value !== null && value !== undefined) {
        if (isNaN(value)) {
          newErrors.originalPrice = "Original price must be a valid number";
        } else if (value < 0) {
          newErrors.originalPrice = "Original price must be positive";
        } else if (value > 100000) {
          newErrors.originalPrice = "Original price seems too high (max: 100,000)";
        } else {
          delete newErrors.originalPrice;
        }
      } else {
        delete newErrors.originalPrice;
      }
      break;

    case "duration":
      if (!value?.trim()) {
        newErrors.duration = "Duration is required";
      } else if (value?.length < 2) {
        newErrors.duration = "Duration must be at least 2 characters";
      } else {
        delete newErrors.duration;
      }
      break;

    case "category":
      if (!value?.trim()) {
        newErrors.category = "Category is required";
      } else {
        delete newErrors.category;
      }
      break;

    case "level":
      if (!value?.trim()) {
        newErrors.level = "Level is required";
      } else {
        delete newErrors.level;
      }
      break;

    case "language":
      if (!value?.trim()) {
        newErrors.language = "Language is required";
      } else {
        delete newErrors.language;
      }
      break;

    case "imageUrl":
      if (value?.trim() && !isValidUrl(value)) {
        newErrors.imageUrl = "Please enter a valid URL for the course image";
      } else {
        delete newErrors.imageUrl;
      }
      break;

    case "videoUrl":
      if (value?.trim() && !isValidUrl(value)) {
        newErrors.videoUrl = "Please enter a valid URL for the promo video";
      } else {
        delete newErrors.videoUrl;
      }
      break;

    case "requirements":
      if (Array.isArray(value) && value.length > 0) {
        const invalidRequirements = value.filter(req => !req?.trim());
        if (invalidRequirements.length > 0) {
          newErrors.requirements = "All requirements must have content";
        } else {
          delete newErrors.requirements;
        }
      } else {
        delete newErrors.requirements;
      }
      break;

    case "whatYouLearn":
      if (Array.isArray(value) && value.length > 0) {
        const invalidLearnings = value.filter(learning => !learning?.trim());
        if (invalidLearnings.length > 0) {
          newErrors.whatYouLearn = "All learning points must have content";
        } else {
          delete newErrors.whatYouLearn;
        }
      } else {
        delete newErrors.whatYouLearn;
      }
      break;

    case "tags":
      if (Array.isArray(value) && value.length > 0) {
        const invalidTags = value.filter(tag => !tag?.trim());
        if (invalidTags.length > 0) {
          newErrors.tags = "All tags must have content";
        } else if (value.length > 10) {
          newErrors.tags = "Maximum 10 tags allowed";
        } else {
          delete newErrors.tags;
        }
      } else {
        delete newErrors.tags;
      }
      break;

    default:
      break;
  }

  return newErrors;
};

/**
 * Validates the entire form
 * @param {Object} formData - The form data to validate
 * @returns {Object} - Errors object
 */
export const validateForm = (formData) => {
  const newErrors = {};

  // Required fields validation
  const requiredFields = [
    "title",
    "shortDescription",
    "description",
    "instructor",
    "category",
    "level",
    "language",
    "duration"
  ];

  requiredFields.forEach((field) => {
    if (!formData[field]?.trim()) {
      newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    }
  });

  // Price validation
  if (formData.price === "" || formData.price === null || formData.price === undefined) {
    newErrors.price = "Price is required";
  } else if (isNaN(formData.price)) {
    newErrors.price = "Price must be a valid number";
  } else if (formData.price < 0) {
    newErrors.price = "Price must be positive";
  } else if (formData.price > 100000) {
    newErrors.price = "Price seems too high (max: 100,000)";
  }

  // Original price validation (optional)
  if (formData.originalPrice !== "" && formData.originalPrice !== null && formData.originalPrice !== undefined) {
    if (isNaN(formData.originalPrice)) {
      newErrors.originalPrice = "Original price must be a valid number";
    } else if (formData.originalPrice < 0) {
      newErrors.originalPrice = "Original price must be positive";
    } else if (formData.originalPrice > 100000) {
      newErrors.originalPrice = "Original price seems too high (max: 100,000)";
    } else if (formData.originalPrice <= formData.price) {
      newErrors.originalPrice = "Original price must be greater than current price";
    }
  }

  // URL validations
  if (formData.imageUrl?.trim() && !isValidUrl(formData.imageUrl)) {
    newErrors.imageUrl = "Please enter a valid URL for the course image";
  }

  if (formData.videoUrl?.trim() && !isValidUrl(formData.videoUrl)) {
    newErrors.videoUrl = "Please enter a valid URL for the promo video";
  }

  // Array field validations
  if (Array.isArray(formData.requirements) && formData.requirements.length > 0) {
    const invalidRequirements = formData.requirements.filter(req => !req?.trim());
    if (invalidRequirements.length > 0) {
      newErrors.requirements = "All requirements must have content";
    }
  }

  if (Array.isArray(formData.whatYouLearn) && formData.whatYouLearn.length > 0) {
    const invalidLearnings = formData.whatYouLearn.filter(learning => !learning?.trim());
    if (invalidLearnings.length > 0) {
      newErrors.whatYouLearn = "All learning points must have content";
    }
  }

  if (Array.isArray(formData.tags) && formData.tags.length > 0) {
    const invalidTags = formData.tags.filter(tag => !tag?.trim());
    if (invalidTags.length > 0) {
      newErrors.tags = "All tags must have content";
    } else if (formData.tags.length > 10) {
      newErrors.tags = "Maximum 10 tags allowed";
    }
  }

  // Custom business logic validations
  if (formData.shortDescription?.length > 200) {
    newErrors.shortDescription = "Short description must be less than 200 characters";
  }

  if (formData.description?.length > 2000) {
    newErrors.description = "Description must be less than 2000 characters";
  }

  if (formData.title?.length > 100) {
    newErrors.title = "Title must be less than 100 characters";
  }

  if (formData.instructor?.length > 50) {
    newErrors.instructor = "Instructor name must be less than 50 characters";
  }

  return newErrors;
};

/**
 * Validates a module
 * @param {Object} module - Module object to validate
 * @returns {Object} - Module errors object
 */
export const validateModule = (module) => {
  const errors = {};

  if (!module.title?.trim()) {
    errors.title = "Module title is required";
  } else if (module.title.length < 2) {
    errors.title = "Module title must be at least 2 characters";
  }

  if (!module.duration?.trim()) {
    errors.duration = "Module duration is required";
  }

  if (module.order <= 0) {
    errors.order = "Module order must be greater than 0";
  }

  return errors;
};

/**
 * Validates a lesson
 * @param {Object} lesson - Lesson object to validate
 * @returns {Object} - Lesson errors object
 */
export const validateLesson = (lesson) => {
  const errors = {};

  if (!lesson.title?.trim()) {
    errors.title = "Lesson title is required";
  } else if (lesson.title.length < 2) {
    errors.title = "Lesson title must be at least 2 characters";
  }

  if (!lesson.duration?.trim()) {
    errors.duration = "Lesson duration is required";
  }

  if (!lesson.type?.trim()) {
    errors.type = "Lesson type is required";
  }

  if (!lesson.content?.trim()) {
    errors.content = "Lesson content is required";
  }

  if (lesson.order <= 0) {
    errors.order = "Lesson order must be greater than 0";
  }

  return errors;
};

/**
 * Validates all modules and lessons
 * @param {Array} modules - Array of modules to validate
 * @returns {Object} - Modules validation result
 */
export const validateModules = (modules) => {
  const errors = {};
  let isValid = true;

  modules.forEach((module, moduleIndex) => {
    const moduleErrors = validateModule(module);
    if (Object.keys(moduleErrors).length > 0) {
      errors[module.id] = moduleErrors;
      isValid = false;
    }

    // Validate lessons in this module
    module.lessons.forEach((lesson, lessonIndex) => {
      const lessonErrors = validateLesson(lesson);
      if (Object.keys(lessonErrors).length > 0) {
        if (!errors[module.id]) {
          errors[module.id] = {};
        }
        errors[module.id][lesson.id] = lessonErrors;
        isValid = false;
      }
    });
  });

  return {
    errors,
    isValid
  };
};

/**
 * Comprehensive form validation including modules
 * @param {Object} formData - Course form data
 * @param {Array} modules - Course modules
 * @returns {Object} - Complete validation result
 */
export const validateCompleteCourse = (formData, modules = []) => {
  const formErrors = validateForm(formData);
  const modulesValidation = validateModules(modules);

  const allErrors = {
    ...formErrors,
    modules: modulesValidation.errors
  };

  const isValid = Object.keys(formErrors).length === 0 && modulesValidation.isValid;

  return {
    errors: allErrors,
    isValid,
    hasFormErrors: Object.keys(formErrors).length > 0,
    hasModuleErrors: !modulesValidation.isValid
  };
};

/**
 * Helper function to validate URL
 * @param {string} url - URL to validate
 * @returns {boolean} - Whether URL is valid
 */
const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Gets the first error field to focus on
 * @param {Object} errors - Errors object
 * @returns {string|null} - First error field name
 */
export const getFirstErrorField = (errors) => {
  if (!errors || Object.keys(errors).length === 0) {
    return null;
  }

  // Priority order for error fields
  const priorityFields = [
    'title',
    'shortDescription',
    'description',
    'instructor',
    'price',
    'category',
    'level',
    'duration',
    'language'
  ];

  // Try to find first priority field with error
  for (const field of priorityFields) {
    if (errors[field]) {
      return field;
    }
  }

  // Return first error field if no priority field found
  return Object.keys(errors)[0];
};

/**
 * Maps error field to tab ID for navigation
 * @param {string} field - Error field name
 * @returns {string} - Tab ID to navigate to
 */
export const getErrorTab = (field) => {
  const tabMap = {
    price: 'pricing',
    originalPrice: 'pricing',
    imageUrl: 'media',
    videoUrl: 'media',
    tags: 'media'
  };

  // Check if field belongs to modules
  if (field === 'modules' || field.startsWith('module_')) {
    return 'content';
  }

  return tabMap[field] || 'basic';
};

/**
 * Clears specific field error
 * @param {Object} errors - Current errors object
 * @param {string} field - Field to clear error for
 * @returns {Object} - Updated errors object
 */
export const clearFieldError = (errors, field) => {
  const newErrors = { ...errors };
  delete newErrors[field];
  return newErrors;
};