import { Upload, X, Image as ImageIcon, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useCallback, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { validateImage } from '@/features/image-analyzer/services';

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  selectedImage: File | null;
  onClear: () => void;
}

export const ImageUpload = ({ onImageSelect, selectedImage, onClear }: ImageUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFile = useCallback(
    async (file: File) => {
      setValidationError(null);
      setIsValidating(true);

      try {
        // Validar imagen con todas las comprobaciones de seguridad
        const validation = await validateImage(file);

        if (!validation.valid) {
          setValidationError(validation.message || 'Archivo inválido');
          setIsValidating(false);
          return;
        }

        // Si es válida, seleccionar y crear preview
        onImageSelect(file);

        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
          setIsValidating(false);
        };
        reader.onerror = () => {
          setValidationError('Error al leer el archivo');
          setIsValidating(false);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        setValidationError(error instanceof Error ? error.message : 'Error al procesar la imagen');
        setIsValidating(false);
      }
    },
    [onImageSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      const imageFile = files.find((file) => file.type.startsWith('image/'));

      if (imageFile) {
        handleFile(imageFile);
      } else if (files.length > 0) {
        setValidationError(
          'El archivo no es una imagen válida. Por favor selecciona un archivo JPG, PNG, GIF o WebP.'
        );
      }
    },
    [handleFile]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  const handleClear = () => {
    setPreview(null);
    setValidationError(null);
    onClear();
  };

  return (
    <Card className="overflow-hidden">
      {!selectedImage ? (
        <div className="space-y-4">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              relative border-2 border-dashed rounded-lg p-8 sm:p-12 text-center transition-all duration-200
              ${
                isDragging
                  ? 'border-primary bg-primary/5 scale-[1.02]'
                  : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30'
              }
              ${validationError ? 'border-destructive/50' : ''}
            `}
          >
            <input
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={handleFileInput}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              id="file-upload"
              disabled={isValidating}
              aria-label="Seleccionar imagen"
            />

            <div className="flex flex-col items-center gap-4">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
                  isDragging
                    ? 'bg-primary/20'
                    : validationError
                      ? 'bg-destructive/10'
                      : 'bg-primary/10'
                }`}
              >
                {isValidating ? (
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                ) : validationError ? (
                  <AlertCircle className="w-8 h-8 text-destructive" />
                ) : (
                  <Upload
                    className={`w-8 h-8 ${isDragging ? 'text-primary animate-bounce' : 'text-primary'}`}
                  />
                )}
              </div>

              <div className="max-w-sm">
                <p className="text-base sm:text-lg font-medium mb-1">
                  {isValidating ? 'Validando imagen...' : 'Arrastra una imagen aquí'}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground mb-4">
                  o haz clic para seleccionar un archivo
                </p>
                <Button variant="outline" size="sm" asChild disabled={isValidating}>
                  <label htmlFor="file-upload" className="cursor-pointer inline-flex items-center">
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Seleccionar Imagen
                  </label>
                </Button>
              </div>

              <div className="text-xs text-muted-foreground space-y-1">
                <p className="flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Formatos: JPG, PNG, GIF, WebP
                </p>
                <p className="flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Tamaño máximo: 5MB
                </p>
                <p className="flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Dimensiones: 100-4096px
                </p>
              </div>
            </div>
          </div>

          {validationError && (
            <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg animate-in fade-in slide-in-from-top-1 duration-300">
              <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-destructive">Error de validación</p>
                <p className="text-xs text-destructive/80 mt-1">{validationError}</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="relative">
          {preview && (
            <div className="relative">
              <img
                src={preview}
                alt="Preview de imagen seleccionada"
                className="w-full h-auto max-h-96 object-contain rounded-t-lg bg-muted/20"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-4 right-4 shadow-lg"
                onClick={handleClear}
                aria-label="Eliminar imagen"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
          <div className="p-4 bg-muted/50">
            <p className="text-sm font-medium truncate">{selectedImage.name}</p>
            <p className="text-xs text-muted-foreground">
              {(selectedImage.size / 1024).toFixed(2)} KB
            </p>
          </div>
        </div>
      )}
    </Card>
  );
};
