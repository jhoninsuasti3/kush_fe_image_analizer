import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';

import { ImageUpload } from '../ImageUpload';

describe('ImageUpload', () => {
  it('shows file selector text and triggers onImageSelect', () => {
    const mockOnSelect = jest.fn();
    render(<ImageUpload onImageSelect={mockOnSelect} selectedImage={null} onClear={jest.fn()} />);

    expect(screen.getByText(/Arrastra una imagen/i)).toBeInTheDocument();

    const file = new File(['img'], 'test.png', { type: 'image/png' });
    const input = screen.getByLabelText(/Seleccionar Imagen/i);
    fireEvent.change(input, { target: { files: [file] } });
    expect(mockOnSelect).toHaveBeenCalledWith(file);
  });
});
