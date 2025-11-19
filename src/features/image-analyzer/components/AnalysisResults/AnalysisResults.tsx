import { CheckCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Tag {
  label: string;
  confidence: number;
}

interface AnalysisResultsProps {
  tags: string[] | Tag[];
  image: File;
}

export const AnalysisResults = ({ tags, image }: AnalysisResultsProps) => {
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(image);
  }, [image]);

  // Normalizar tags para soportar ambos formatos: string[] o Tag[]
  const normalizedTags: Tag[] = tags.map((tag) => {
    if (typeof tag === 'string') {
      return { label: tag, confidence: 0 };
    }
    return tag;
  });

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-primary/5 border-b">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-primary" />
          <CardTitle>Análisis Completado</CardTitle>
        </div>
        <CardDescription>
          Se identificaron {normalizedTags.length} etiqueta(s) en la imagen
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Imagen analizada */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Imagen Analizada
            </h3>
            {imagePreview && (
              <div className="rounded-lg overflow-hidden border">
                <img
                  src={imagePreview}
                  alt="Analyzed"
                  className="w-full h-auto object-contain max-h-64"
                />
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              {image.name} • {(image.size / 1024).toFixed(2)} KB
            </p>
          </div>

          {/* Tags detectados */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Etiquetas Detectadas
            </h3>
            <div className="flex flex-wrap gap-2">
              {normalizedTags.map((tag, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-sm py-1.5 px-3">
                    {tag.label}
                  </Badge>
                  {tag.confidence > 0 && (
                    <span className="text-xs text-muted-foreground">
                      {(tag.confidence * 100).toFixed(0)}%
                    </span>
                  )}
                </div>
              ))}
            </div>

            {normalizedTags.length === 0 && (
              <p className="text-sm text-muted-foreground italic">
                No se detectaron etiquetas en esta imagen.
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
