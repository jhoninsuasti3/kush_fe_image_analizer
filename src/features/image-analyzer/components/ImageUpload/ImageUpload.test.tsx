import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import { ImageUpload } from '../ImageUpload';

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

describe('ImageUpload', () => {
  it('shows file selector text and triggers onImageSelect', async () => {
    const mockOnSelect = jest.fn();
    render(<ImageUpload onImageSelect={mockOnSelect} selectedImage={null} onClear={jest.fn()} />);

    expect(screen.getByText(/Arrastra una imagen/i)).toBeInTheDocument();

    const file = new File(['img'], 'test.png', { type: 'image/png' });
    const input = screen.getByLabelText(/Seleccionar Imagen/i);
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(mockOnSelect).toHaveBeenCalledWith(file);
    });
  });
});
