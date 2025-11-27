import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { AnalysisResults, ImageUpload, useImageAnalyzer } from '@/features/image-analyzer';

const ImageAnalyzerPage = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const { analyze, loading, error, tags, analyzedAt, clear } = useImageAnalyzer();

  const handleAnalyze = async () => {
    if (selectedImage) {
      await analyze(selectedImage);
    }
  };

  const handleClearAll = () => {
    setSelectedImage(null);
    clear();
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Analizador de Imágenes IA</h1>

      <ImageUpload
        onImageSelect={setSelectedImage}
        selectedImage={selectedImage}
        onClear={handleClearAll}
      />

      {selectedImage && (
        <div className="flex items-center gap-4 mt-6">
          <Button onClick={handleAnalyze} disabled={loading}>
            {loading ? 'Analizando...' : 'Analizar Imagen'}
          </Button>
          <Button variant="secondary" onClick={handleClearAll} disabled={loading}>
            Limpiar
          </Button>
        </div>
      )}

      {error && <div className="text-red-500 mt-4">{error}</div>}

      {tags.length > 0 && selectedImage && (
        <div className="mt-8">
          <AnalysisResults tags={tags} image={selectedImage} />
          {analyzedAt && (
            <p className="text-xs text-muted-foreground mt-2 text-right">
              Analizado el {new Date(analyzedAt).toLocaleString()}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageAnalyzerPage;
