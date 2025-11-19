import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import * as api from '@/integrations/imageAnalyzer';

import ImageAnalyzerPage from '../ImageAnalyzerPage';

jest.spyOn(api, 'analyzeImage').mockImplementation(async () => ({
  tags: [{ label: 'Integración', confidence: 1.0 }],
  analyzed_at: '2025-01-01',
}));

describe('ImageAnalyzerPage integración', () => {
  it('permite cargar imagen, analizar y mostrar resultado', async () => {
    render(<ImageAnalyzerPage />);
    expect(screen.getByText(/Analizador de Imágenes IA/)).toBeInTheDocument();
    const file = new File(['contenido'], 'test.png', { type: 'image/png' });
    const input = screen.getByLabelText(/Seleccionar Imagen/i);
    fireEvent.change(input, { target: { files: [file] } });
    const analyzeBtn = await screen.findByText(/Analizar Imagen/);
    fireEvent.click(analyzeBtn);
    await waitFor(() => {
      expect(screen.getByText('Integración')).toBeInTheDocument();
    });
  });
});
