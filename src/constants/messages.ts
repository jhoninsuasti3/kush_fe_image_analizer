/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  // Image Analyzer
  UPLOAD_FAILED: 'No se pudo cargar la imagen. Intenta nuevamente.',
  ANALYSIS_FAILED: 'Error al analizar la imagen.',
  INVALID_FILE_TYPE: 'Tipo de archivo no válido. Solo se permiten imágenes.',
  FILE_TOO_LARGE: 'El archivo es demasiado grande. Máximo 5MB.',

  // Authentication
  LOGIN_FAILED: 'Credenciales incorrectas. Intenta nuevamente.',
  REGISTER_FAILED: 'No se pudo crear la cuenta. Intenta nuevamente.',
  SESSION_EXPIRED: 'Tu sesión ha expirado. Inicia sesión nuevamente.',
  UNAUTHORIZED: 'No tienes autorización para realizar esta acción.',

  // Network
  NETWORK_ERROR: 'Error de conexión. Verifica tu internet.',
  SERVER_ERROR: 'Error del servidor. Intenta más tarde.',
  TIMEOUT_ERROR: 'La solicitud tardó demasiado. Intenta nuevamente.',
} as const;

/**
 * Success messages
 */
export const SUCCESS_MESSAGES = {
  // Image Analyzer
  ANALYSIS_COMPLETE: '¡Análisis completado!',
  IMAGE_UPLOADED: 'Imagen cargada correctamente.',

  // Authentication
  LOGIN_SUCCESS: '¡Bienvenido!',
  REGISTER_SUCCESS: 'Cuenta creada exitosamente.',
  LOGOUT_SUCCESS: 'Sesión cerrada correctamente.',
} as const;

/**
 * Info messages
 */
export const INFO_MESSAGES = {
  LOADING: 'Cargando...',
  ANALYZING: 'Analizando imagen...',
  PROCESSING: 'Procesando...',
} as const;
