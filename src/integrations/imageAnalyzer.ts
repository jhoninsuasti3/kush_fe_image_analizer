import { getEnv } from '@/config/env';
// Servicio para analizar imágenes mediante API externa
export interface ImageAnalysisTag {
  label: string;
  confidence: number;
}

export interface ImageAnalysisResponse {
  tags: ImageAnalysisTag[];
  analyzed_at?: string;
}

export async function analyzeImage(file: File): Promise<ImageAnalysisResponse> {
  const { VITE_API_URL: apiUrl, VITE_API_TOKEN: apiToken } = getEnv();
  if (!apiUrl) throw new Error('API URL no configurada');
  if (!apiToken) throw new Error('API token no configurado');

  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${apiUrl}/api/v1/analyze`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiToken}`,
      // 'Content-Type' intentionally not set for FormData
    },
    body: formData,
  });

  if (!res.ok) {
    const errMsg = await res.text();
    throw new Error(`Error del servidor (${res.status}): ${errMsg}`);
  }
  const data = await res.json();
  return data;
}
