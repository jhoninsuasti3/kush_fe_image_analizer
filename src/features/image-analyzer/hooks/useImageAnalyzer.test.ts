import '@testing-library/jest-dom';
import { renderHook, act } from '@testing-library/react';

import * as api from '@/integrations/imageAnalyzer';

import { useImageAnalyzer } from './useImageAnalyzer';

jest.spyOn(api, 'analyzeImage').mockImplementation(async () => ({
  tags: [{ label: 'TestLabel', confidence: 0.75 }],
  analyzed_at: '2025-11-19T10:00:00',
}));

describe('useImageAnalyzer', () => {
  it('should analyze an image and set tags/result', async () => {
    const file = new File(['test'], 'test.png', { type: 'image/png' });
    const { result } = renderHook(() => useImageAnalyzer());
    await act(async () => {
      await result.current.analyze(file);
    });
    expect(result.current.tags[0].label).toBe('TestLabel');
    expect(result.current.analyzedAt).toBe('2025-11-19T10:00:00');
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should clear state with clear()', () => {
    const { result } = renderHook(() => useImageAnalyzer());
    act(() => {
      result.current.clear();
    });
    expect(result.current.tags).toEqual([]);
    expect(result.current.analyzedAt).toBeNull();
    expect(result.current.error).toBeNull();
  });
});
