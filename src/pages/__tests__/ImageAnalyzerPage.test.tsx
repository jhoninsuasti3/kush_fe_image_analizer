import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import { AuthProvider } from '@/features/auth';
import * as api from '@/integrations/imageAnalyzer';

import ImageAnalyzerPage from '../ImageAnalyzerPage';

// Mock URL.createObjectURL and revokeObjectURL
globalThis.URL.createObjectURL = jest.fn(() => 'mock-url');
globalThis.URL.revokeObjectURL = jest.fn();

// Mock Image constructor para validaciones
class MockImage {
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  src = '';
  width = 800;
  height = 600;

  constructor() {
    setTimeout(() => {
      if (this.onload) this.onload();
    }, 0);
  }
}

globalThis.Image = MockImage as unknown as typeof Image;

jest.spyOn(api, 'analyzeImage').mockImplementation(async () => ({
  tags: [{ label: 'Integración', confidence: 1.0 }],
  analyzed_at: '2025-01-01',
}));

// Mock fetch for auth
globalThis.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ email: 'test@test.com', name: 'Test User' }),
  } as Response)
);

describe('ImageAnalyzerPage integración', () => {
  it('permite cargar imagen, analizar y mostrar resultado', async () => {
    render(
      <AuthProvider>
        <ImageAnalyzerPage />
      </AuthProvider>
    );
    expect(screen.getByText(/Analizador de Imágenes IA/)).toBeInTheDocument();
    const file = new File(['contenido'], 'test.png', { type: 'image/png' });
    const input = screen.getByLabelText(/Seleccionar Imagen/i);
    fireEvent.change(input, { target: { files: [file] } });

    // Esperar a que la validación asíncrona termine
    const analyzeBtn = await screen.findByText(/Analizar Imagen/, {}, { timeout: 3000 });
    fireEvent.click(analyzeBtn);

    await waitFor(() => {
      expect(screen.getByText('Integración')).toBeInTheDocument();
    });
  });
});
