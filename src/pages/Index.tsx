import { Sparkles, Loader2 } from 'lucide-react';
import { useState } from 'react';

import { AnalysisResults } from '@/components/AnalysisResults';
import { ImageUpload } from '@/components/ImageUpload';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

// URL de tu API backend - configurable mediante variable de entorno
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface Tag {
  label: string;
  confidence: number;
}

interface AnalysisResponse {
  tags: Tag[];
}

const Index = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [tags, setTags] = useState<Tag[]>([]);
  const [analyzedImage, setAnalyzedImage] = useState<File | null>(null);
  const { toast } = useToast();

  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
    setTags([]);
    setAnalyzedImage(null);
  };

  const handleClear = () => {
    setSelectedImage(null);
    setTags([]);
    setAnalyzedImage(null);
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setTags([]);

    try {
      // Crear FormData para enviar la imagen
      const formData = new FormData();
      formData.append('image', selectedImage);

      // Llamar a tu API backend
      const response = await fetch(`${API_URL}/api/analyze`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data: AnalysisResponse = await response.json();

      if (data?.tags && data.tags.length > 0) {
        setTags(data.tags);
        setAnalyzedImage(selectedImage);
        toast({
          title: '¡Análisis completado!',
          description: `Se detectaron ${data.tags.length} etiqueta(s).`,
        });
      } else {
        toast({
          title: 'Análisis completado',
          description: 'No se detectaron etiquetas en la imagen.',
        });
      }
    } catch (error) {
      console.error('Error analyzing image:', error);
      toast({
        title: 'Error en el análisis',
        description:
          error instanceof Error
            ? error.message
            : 'No se pudo analizar la imagen. Intenta nuevamente.',
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-3">Analizador Inteligente de Imágenes</h1>
          <p className="text-lg text-muted-foreground">
            Sube una imagen y descubre su contenido mediante IA
          </p>
        </header>

        <main className="space-y-8">
          <ImageUpload
            onImageSelect={handleImageSelect}
            selectedImage={selectedImage}
            onClear={handleClear}
          />

          {selectedImage && !analyzedImage && (
            <div className="flex justify-center">
              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                size="lg"
                className="min-w-[200px]"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Analizando...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Analizar Imagen
                  </>
                )}
              </Button>
            </div>
          )}

          {analyzedImage && tags.length > 0 && (
            <AnalysisResults tags={tags} image={analyzedImage} />
          )}
        </main>
      </div>
    </div>
  );
};

export default Index;
