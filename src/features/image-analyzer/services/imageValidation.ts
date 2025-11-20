import { IMAGE_VALIDATION } from '@/constants';

/**
 * Validation error types for images
 */
export enum ImageValidationError {
  INVALID_TYPE = 'INVALID_TYPE',
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',
  DIMENSIONS_TOO_SMALL = 'DIMENSIONS_TOO_SMALL',
  DIMENSIONS_TOO_LARGE = 'DIMENSIONS_TOO_LARGE',
  CORRUPTED_FILE = 'CORRUPTED_FILE',
  SUSPICIOUS_CONTENT = 'SUSPICIOUS_CONTENT',
}

/**
 * Validation result interface
 */
export interface ImageValidationResult {
  valid: boolean;
  error?: ImageValidationError;
  message?: string;
  details?: {
    width?: number;
    height?: number;
    size?: number;
    type?: string;
  };
}

/**
 * Validates file type against allowed MIME types
 */
export const validateImageType = (file: File): ImageValidationResult => {
  const allowedTypes = IMAGE_VALIDATION.ALLOWED_TYPES;
  const isValidType = Array.from(allowedTypes).some((type) => type === file.type);

  if (!isValidType) {
    return {
      valid: false,
      error: ImageValidationError.INVALID_TYPE,
      message: `Tipo de archivo no permitido. Solo se aceptan: ${allowedTypes.map((t) => t.split('/')[1].toUpperCase()).join(', ')}`,
      details: { type: file.type },
    };
  }

  return { valid: true };
};

/**
 * Validates file size
 */
export const validateImageSize = (file: File): ImageValidationResult => {
  if (file.size > IMAGE_VALIDATION.MAX_SIZE) {
    const maxSizeMB = (IMAGE_VALIDATION.MAX_SIZE / (1024 * 1024)).toFixed(1);
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);

    return {
      valid: false,
      error: ImageValidationError.FILE_TOO_LARGE,
      message: `El archivo es demasiado grande (${fileSizeMB}MB). Tamaño máximo: ${maxSizeMB}MB`,
      details: { size: file.size },
    };
  }

  return { valid: true };
};

/**
 * Validates image dimensions
 */
export const validateImageDimensions = async (file: File): Promise<ImageValidationResult> => {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      const { width, height } = img;
      const { MIN_WIDTH, MIN_HEIGHT, MAX_WIDTH, MAX_HEIGHT } = IMAGE_VALIDATION;

      // Check minimum dimensions
      if (width < MIN_WIDTH || height < MIN_HEIGHT) {
        resolve({
          valid: false,
          error: ImageValidationError.DIMENSIONS_TOO_SMALL,
          message: `La imagen es demasiado pequeña (${width}x${height}px). Mínimo: ${MIN_WIDTH}x${MIN_HEIGHT}px`,
          details: { width, height },
        });
        return;
      }

      // Check maximum dimensions
      if (width > MAX_WIDTH || height > MAX_HEIGHT) {
        resolve({
          valid: false,
          error: ImageValidationError.DIMENSIONS_TOO_LARGE,
          message: `La imagen es demasiado grande (${width}x${height}px). Máximo: ${MAX_WIDTH}x${MAX_HEIGHT}px`,
          details: { width, height },
        });
        return;
      }

      resolve({ valid: true, details: { width, height } });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({
        valid: false,
        error: ImageValidationError.CORRUPTED_FILE,
        message: 'El archivo de imagen está corrupto o no se puede leer',
      });
    };

    img.src = url;
  });
};

/**
 * Validates file extension matches MIME type (prevents spoofing)
 */
export const validateFileExtension = (file: File): ImageValidationResult => {
  const extension = file.name.split('.').pop()?.toLowerCase();
  const mimeType = file.type.split('/')[1];

  const validExtensions: Record<string, string[]> = {
    jpeg: ['jpg', 'jpeg'],
    png: ['png'],
    gif: ['gif'],
    webp: ['webp'],
  };

  if (!extension || !mimeType) {
    return {
      valid: false,
      error: ImageValidationError.INVALID_TYPE,
      message: 'No se pudo determinar el tipo de archivo',
    };
  }

  const expectedExtensions = validExtensions[mimeType];
  const isValidExtension = expectedExtensions && expectedExtensions.indexOf(extension) !== -1;

  if (!isValidExtension) {
    return {
      valid: false,
      error: ImageValidationError.SUSPICIOUS_CONTENT,
      message: `La extensión del archivo (.${extension}) no coincide con el tipo real (${mimeType})`,
    };
  }

  return { valid: true };
};

/**
 * Checks for suspicious file names that could indicate malicious intent
 */
export const validateFileName = (file: File): ImageValidationResult => {
  const suspiciousPatterns = [
    /\.(php|exe|sh|bat|cmd|com|pif|application|gadget|msi|msp|scr|hta|cpl|jar|vb|vbs|vbe|js|jse|ws|wsf|wsc|wsh|ps1|ps1xml|ps2|ps2xml|psc1|psc2|msh|msh1|msh2|mshxml|msh1xml|msh2xml)$/i,
    /[<>:"|?*]/,
    /(\.\.\/|\.\.\\)/,
    /^(con|prn|aux|nul|com[0-9]|lpt[0-9])(\..*)?$/i,
  ];

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(file.name)) {
      return {
        valid: false,
        error: ImageValidationError.SUSPICIOUS_CONTENT,
        message: 'El nombre del archivo contiene caracteres o patrones sospechosos',
      };
    }
  }

  return { valid: true };
};

/**
 * Comprehensive image validation
 *
 * Performs all security checks on an image file
 */
export const validateImage = async (file: File): Promise<ImageValidationResult> => {
  // 1. Validate file name
  const nameValidation = validateFileName(file);
  if (!nameValidation.valid) {
    return nameValidation;
  }

  // 2. Validate file type
  const typeValidation = validateImageType(file);
  if (!typeValidation.valid) {
    return typeValidation;
  }

  // 3. Validate extension matches MIME type
  const extensionValidation = validateFileExtension(file);
  if (!extensionValidation.valid) {
    return extensionValidation;
  }

  // 4. Validate file size
  const sizeValidation = validateImageSize(file);
  if (!sizeValidation.valid) {
    return sizeValidation;
  }

  // 5. Validate image dimensions (async)
  const dimensionsValidation = await validateImageDimensions(file);
  if (!dimensionsValidation.valid) {
    return dimensionsValidation;
  }

  return {
    valid: true,
    details: dimensionsValidation.details,
  };
};
