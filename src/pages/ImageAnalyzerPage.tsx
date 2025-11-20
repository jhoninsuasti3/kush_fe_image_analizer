import { LogOut, User } from 'lucide-react';
import { useState } from 'react';

import { AnalysisResults } from '@/components/AnalysisResults';
import { ImageUpload } from '@/components/ImageUpload';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/features/auth';
import { useImageAnalyzer } from '@/hooks/useImageAnalyzer';

const ImageAnalyzerPage = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const { analyze, loading, error, tags, analyzedAt, clear } = useImageAnalyzer();
  const { user, logout } = useAuth();

  const handleAnalyze = async () => {
    if (selectedImage) {
      await analyze(selectedImage);
    }
  };

  const handleClearAll = () => {
    setSelectedImage(null);
    clear();
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b border-border/60 bg-card/95 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/80">
              <span className="text-lg font-bold text-primary-foreground">AI</span>
            </div>
            <div>
              <h1 className="text-lg font-bold">Analizador de Imágenes IA</h1>
              <p className="text-xs text-muted-foreground">Análisis con Inteligencia Artificial</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">{user?.name || user?.email}</span>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar sesión
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto py-10 px-4">
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
    </div>
  );
};

export default ImageAnalyzerPage;
