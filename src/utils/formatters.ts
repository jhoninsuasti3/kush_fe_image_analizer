/**
 * Formats file size in bytes to human-readable format
 *
 * @param bytes - File size in bytes
 * @returns Formatted file size string
 *
 * @example
 * ```typescript
 * formatFileSize(1024); // "1 KB"
 * formatFileSize(1048576); // "1 MB"
 * ```
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`;
};

/**
 * Formats confidence score to percentage
 *
 * @param confidence - Confidence value between 0 and 1
 * @returns Formatted percentage string
 *
 * @example
 * ```typescript
 * formatConfidence(0.9523); // "95%"
 * ```
 */
export const formatConfidence = (confidence: number): string => {
  return `${(confidence * 100).toFixed(0)}%`;
};

/**
 * Formats date to localized string
 *
 * @param date - Date string or Date object
 * @param locale - Locale string (default: 'es-ES')
 * @returns Formatted date string
 */
export const formatDate = (date: string | Date, locale = 'es-ES'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Formats date to relative time (e.g., "hace 5 minutos")
 *
 * @param date - Date string or Date object
 * @returns Relative time string
 */
export const formatRelativeTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'hace unos segundos';
  if (diffMins < 60) return `hace ${diffMins} minuto${diffMins > 1 ? 's' : ''}`;
  if (diffHours < 24) return `hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
  if (diffDays < 7) return `hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;

  return formatDate(dateObj);
};
