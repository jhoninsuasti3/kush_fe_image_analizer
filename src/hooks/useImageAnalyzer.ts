import { useState, useCallback } from 'react';

import { analyzeImage, ImageAnalysisTag } from '@/integrations/imageAnalyzer';

interface UseImageAnalyzerReturn {
  analyze: (file: File) => Promise<void>;
  loading: boolean;
  error: string | null;
  tags: ImageAnalysisTag[];
  analyzedAt: string | null;
  clear: () => void;
}

export function useImageAnalyzer(): UseImageAnalyzerReturn {
  const [tags, setTags] = useState<ImageAnalysisTag[]>([]);
  const [analyzedAt, setAnalyzedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = useCallback(async (file: File) => {
    setLoading(true);
    setError(null);
    setTags([]);
    setAnalyzedAt(null);
    try {
      const result = await analyzeImage(file);
      setTags(result.tags || []);
      setAnalyzedAt(result.analyzed_at || null);
    } catch (err: any) {
      setError(err.message || 'Error inesperado en el análisis.');
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setTags([]);
    setAnalyzedAt(null);
    setError(null);
    setLoading(false);
  }, []);

  return { analyze, loading, error, tags, analyzedAt, clear };
}
