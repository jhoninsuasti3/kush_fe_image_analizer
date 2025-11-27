import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import { AnalysisResults } from '../AnalysisResults';

describe('AnalysisResults', () => {
  it('renders tags and image preview', () => {
    const mockFile = new File(['123'], 'demo.png', { type: 'image/png' });
    const tags = [
      { label: 'Tag1', confidence: 0.8 },
      { label: 'Tag2', confidence: 0.3 },
    ];
    render(<AnalysisResults tags={tags} image={mockFile} />);
    expect(screen.getByText('Análisis Completado')).toBeInTheDocument();
    expect(screen.getByText('Tag1')).toBeInTheDocument();
    expect(screen.getByText('Tag2')).toBeInTheDocument();
    expect(screen.getByText(/demo.png/)).toBeInTheDocument();
  });
});
