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
      <div className="max-w-7xl mx-auto py-4 px-4">
        {/* Two Column Layout for Desktop, Single Column for Mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {/* Left Column - Upload & Controls */}
          <div className="space-y-4">
            <div className="bg-card/95 backdrop-blur-sm border border-border/60 rounded-xl p-4 shadow-lg">
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="text-primary text-sm">1</span>
                </div>
                Selecciona una imagen
              </h2>
              <ImageUpload
                onImageSelect={setSelectedImage}
                selectedImage={selectedImage}
                onClear={handleClearAll}
              />
            </div>

            {selectedImage && (
              <div className="bg-card/95 backdrop-blur-sm border border-border/60 rounded-xl p-4 shadow-lg space-y-3">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                    <span className="text-primary text-sm">2</span>
                  </div>
                  Analiza la imagen
                </h2>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button onClick={handleAnalyze} disabled={loading} className="flex-1">
                    {loading ? 'Analizando...' : 'Analizar Imagen'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleClearAll}
                    disabled={loading}
                    className="flex-1 sm:flex-none"
                  >
                    Limpiar
                  </Button>
                </div>
                {error && (
                  <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-lg p-3 text-sm">
                    {error}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Results */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            {tags.length > 0 && selectedImage ? (
              <div className="bg-card/95 backdrop-blur-sm border border-border/60 rounded-xl p-6 shadow-lg space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <span className="text-primary text-sm">3</span>
                  </div>
                  Resultados del análisis
                </h2>
                <AnalysisResults tags={tags} image={selectedImage} />
                {analyzedAt && (
                  <p className="text-xs text-muted-foreground text-right pt-2 border-t border-border/40">
                    Analizado el {new Date(analyzedAt).toLocaleString()}
                  </p>
                )}
              </div>
            ) : (
              <div className="bg-card/95 backdrop-blur-sm border border-border/60 rounded-xl p-8 shadow-lg">
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto">
                    <span className="text-3xl">🔍</span>
                  </div>
                  <h3 className="text-lg font-medium text-muted-foreground">
                    Resultados aparecerán aquí
                  </h3>
                  <p className="text-sm text-muted-foreground/70">
                    Sube una imagen y presiona "Analizar" para ver las etiquetas generadas por IA
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageAnalyzerPage;
