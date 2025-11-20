export const AUTH_STORAGE_KEYS = {
  ACCESS_TOKEN: 'kush_ai_access_token',
  REFRESH_TOKEN: 'kush_ai_refresh_token',
} as const;

export const AUTH_MESSAGES = {
  MISSING_API_URL: 'La URL del backend no está configurada. Define VITE_API_URL en el archivo .env',
} as const;
