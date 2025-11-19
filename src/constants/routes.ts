/**
 * Application routes
 */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  ANALYZER: '/analyzer',
  NOT_FOUND: '/404',
} as const;

/**
 * Public routes (no authentication required)
 */
export const PUBLIC_ROUTES = [ROUTES.LOGIN, ROUTES.REGISTER, ROUTES.NOT_FOUND] as const;

/**
 * Protected routes (authentication required)
 */
export const PROTECTED_ROUTES = [ROUTES.HOME, ROUTES.ANALYZER] as const;
