/**
 * API endpoints constants
 */
export const API_ENDPOINTS = {
  // Image Analyzer
  ANALYZE_IMAGE: '/api/v1/analyze',

  // Authentication
  LOGIN: '/api/v1/auth/login',
  REGISTER: '/api/v1/auth/register',
  LOGOUT: '/api/v1/auth/logout',
  REFRESH_TOKEN: '/api/v1/auth/refresh',
  ME: '/api/v1/auth/me',
} as const;

/**
 * API configuration
 */
export const API_CONFIG = {
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
} as const;
