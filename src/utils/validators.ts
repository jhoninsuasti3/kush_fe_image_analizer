import { IMAGE_VALIDATION, FORM_VALIDATION } from '@/constants';

/**
 * Validates if a file is a valid image
 *
 * @param file - File to validate
 * @returns true if file is valid
 */
export const validateImageFile = (file: File): boolean => {
  const validTypes = IMAGE_VALIDATION.ALLOWED_TYPES;
  const maxSize = IMAGE_VALIDATION.MAX_SIZE;

  return validTypes.includes(file.type as (typeof validTypes)[number]) && file.size <= maxSize;
};

/**
 * Validates image dimensions
 *
 * @param file - Image file to validate
 * @returns Promise that resolves to true if dimensions are valid
 */
export const validateImageDimensions = async (file: File): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const isValid =
        img.width >= IMAGE_VALIDATION.MIN_WIDTH &&
        img.height >= IMAGE_VALIDATION.MIN_HEIGHT &&
        img.width <= IMAGE_VALIDATION.MAX_WIDTH &&
        img.height <= IMAGE_VALIDATION.MAX_HEIGHT;
      resolve(isValid);
    };
    img.onerror = () => resolve(false);
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Validates email format
 *
 * @param email - Email to validate
 * @returns true if email is valid
 */
export const validateEmail = (email: string): boolean => {
  if (
    email.length < FORM_VALIDATION.EMAIL.MIN_LENGTH ||
    email.length > FORM_VALIDATION.EMAIL.MAX_LENGTH
  ) {
    return false;
  }
  return FORM_VALIDATION.EMAIL.PATTERN.test(email);
};

/**
 * Validates password strength
 *
 * @param password - Password to validate
 * @returns true if password meets requirements
 */
export const validatePassword = (password: string): boolean => {
  if (
    password.length < FORM_VALIDATION.PASSWORD.MIN_LENGTH ||
    password.length > FORM_VALIDATION.PASSWORD.MAX_LENGTH
  ) {
    return false;
  }
  return FORM_VALIDATION.PASSWORD.PATTERN.test(password);
};

/**
 * Validates name format
 *
 * @param name - Name to validate
 * @returns true if name is valid
 */
export const validateName = (name: string): boolean => {
  const trimmedName = name.trim();
  return (
    trimmedName.length >= FORM_VALIDATION.NAME.MIN_LENGTH &&
    trimmedName.length <= FORM_VALIDATION.NAME.MAX_LENGTH
  );
};
