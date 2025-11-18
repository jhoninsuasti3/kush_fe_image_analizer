import { useCallback, useState } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  selectedImage: File | null;
  onClear: () => void;
}

export const ImageUpload = ({ onImageSelect, selectedImage, onClear }: ImageUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      const imageFile = files.find((file) => file.type.startsWith("image/"));

      if (imageFile) {
        handleFile(imageFile);
      }
    },
    [onImageSelect]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFile(file);
      }
    },
    [onImageSelect]
  );

  const handleFile = (file: File) => {
    onImageSelect(file);

    // Crear preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleClear = () => {
    setPreview(null);
    onClear();
  };

  return (
    <Card className="overflow-hidden">
      {!selectedImage ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative border-2 border-dashed rounded-lg p-12 text-center transition-colors
            ${isDragging
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50"
            }
          `}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            id="file-upload"
          />

          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Upload className="w-8 h-8 text-primary" />
            </div>

            <div>
              <p className="text-lg font-medium mb-1">
                Arrastra una imagen aquí
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                o haz clic para seleccionar un archivo
              </p>
              <Button variant="outline" size="sm" asChild>
                <label htmlFor="file-upload" className="cursor-pointer">
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Seleccionar Imagen
                </label>
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              Formatos soportados: JPG, PNG, GIF, WebP
            </p>
          </div>
        </div>
      ) : (
        <div className="relative">
          {preview && (
            <div className="relative">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-auto max-h-96 object-contain rounded-t-lg"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-4 right-4"
                onClick={handleClear}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
          <div className="p-4 bg-muted/50">
            <p className="text-sm font-medium truncate">
              {selectedImage.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {(selectedImage.size / 1024).toFixed(2)} KB
            </p>
          </div>
        </div>
      )}
    </Card>
  );
};