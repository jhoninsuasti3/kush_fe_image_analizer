/**
 * Image validation constants
 */
export const IMAGE_VALIDATION = {
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'] as const,
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  MIN_WIDTH: 100,
  MIN_HEIGHT: 100,
  MAX_WIDTH: 4096,
  MAX_HEIGHT: 4096,
} as const;

/**
 * Form validation constants
 */
export const FORM_VALIDATION = {
  EMAIL: {
    MIN_LENGTH: 5,
    MAX_LENGTH: 100,
    PATTERN: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 100,
    PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  },
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50,
  },
} as const;
