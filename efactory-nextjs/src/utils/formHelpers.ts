// Utility functions for form handling
// Extracted from components to improve reusability and maintainability

import type { FormState, FormField } from '@/types/api';

/**
 * Create initial form state
 */
export function createInitialFormState(fields: FormField[]): FormState {
  const values: Record<string, any> = {};
  const errors: Record<string, string> = {};
  const touched: Record<string, boolean> = {};

  fields.forEach(field => {
    values[field.name] = '';
    errors[field.name] = '';
    touched[field.name] = false;
  });

  return {
    values,
    errors,
    touched,
    isSubmitting: false,
    isValid: false,
  };
}

/**
 * Validate form field
 */
export function validateField(
  field: FormField,
  value: any,
  allValues: Record<string, any>
): string | null {
  // Required validation
  if (field.required && (!value || value.toString().trim() === '')) {
    return `${field.label} is required`;
  }

  // Skip other validations if field is empty and not required
  if (!value || value.toString().trim() === '') {
    return null;
  }

  // Min length validation
  if (field.validation?.minLength && value.toString().length < field.validation.minLength) {
    return `${field.label} must be at least ${field.validation.minLength} characters`;
  }

  // Max length validation
  if (field.validation?.maxLength && value.toString().length > field.validation.maxLength) {
    return `${field.label} must be no more than ${field.validation.maxLength} characters`;
  }

  // Pattern validation
  if (field.validation?.pattern && !field.validation.pattern.test(value.toString())) {
    return `${field.label} format is invalid`;
  }

  // Custom validation
  if (field.validation?.custom) {
    return field.validation.custom(value);
  }

  return null;
}

/**
 * Validate entire form
 */
export function validateForm(
  fields: FormField[],
  values: Record<string, any>
): Record<string, string> {
  const errors: Record<string, string> = {};

  fields.forEach(field => {
    const error = validateField(field, values[field.name], values);
    if (error) {
      errors[field.name] = error;
    }
  });

  return errors;
}

/**
 * Check if form is valid
 */
export function isFormValid(
  fields: FormField[],
  values: Record<string, any>
): boolean {
  const errors = validateForm(fields, values);
  return Object.keys(errors).length === 0;
}

/**
 * Update form field value
 */
export function updateFieldValue(
  fieldName: string,
  value: any,
  formState: FormState
): FormState {
  return {
    ...formState,
    values: {
      ...formState.values,
      [fieldName]: value,
    },
    touched: {
      ...formState.touched,
      [fieldName]: true,
    },
  };
}

/**
 * Update form field error
 */
export function updateFieldError(
  fieldName: string,
  error: string,
  formState: FormState
): FormState {
  return {
    ...formState,
    errors: {
      ...formState.errors,
      [fieldName]: error,
    },
  };
}

/**
 * Clear form errors
 */
export function clearFormErrors(formState: FormState): FormState {
  const errors: Record<string, string> = {};
  Object.keys(formState.errors).forEach(key => {
    errors[key] = '';
  });

  return {
    ...formState,
    errors,
  };
}

/**
 * Reset form to initial state
 */
export function resetForm(
  fields: FormField[],
  initialValues?: Record<string, any>
): FormState {
  const values: Record<string, any> = {};
  const errors: Record<string, string> = {};
  const touched: Record<string, boolean> = {};

  fields.forEach(field => {
    values[field.name] = initialValues?.[field.name] || '';
    errors[field.name] = '';
    touched[field.name] = false;
  });

  return {
    values,
    errors,
    touched,
    isSubmitting: false,
    isValid: false,
  };
}

/**
 * Get form field value
 */
export function getFieldValue(
  fieldName: string,
  formState: FormState
): any {
  return formState.values[fieldName];
}

/**
 * Check if field has error
 */
export function hasFieldError(
  fieldName: string,
  formState: FormState
): boolean {
  return !!(formState.errors[fieldName] && formState.touched[fieldName]);
}

/**
 * Get field error message
 */
export function getFieldError(
  fieldName: string,
  formState: FormState
): string {
  return formState.errors[fieldName] || '';
}

/**
 * Check if field is touched
 */
export function isFieldTouched(
  fieldName: string,
  formState: FormState
): boolean {
  return formState.touched[fieldName] || false;
}

/**
 * Set form submitting state
 */
export function setFormSubmitting(
  isSubmitting: boolean,
  formState: FormState
): FormState {
  return {
    ...formState,
    isSubmitting,
  };
}

/**
 * Common form field configurations
 */
export const commonFormFields = {
  email: {
    type: 'email' as const,
    validation: {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
  },
  password: {
    type: 'password' as const,
    validation: {
      minLength: 8,
    },
  },
  required: {
    required: true,
  },
  optional: {
    required: false,
  },
};

/**
 * Create form field with common configurations
 */
export function createFormField(
  name: string,
  label: string,
  type: FormField['type'] = 'text',
  options: Partial<FormField> = {}
): FormField {
  return {
    name,
    label,
    type,
    ...options,
  };
}
