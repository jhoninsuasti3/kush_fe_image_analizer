import { analyzeImage } from '../index';
jest.mock('@/config/env', () => ({
  getEnv: () => ({
    VITE_API_URL: '',
    VITE_API_TOKEN: '',
  }),
}));
describe('analyzeImage', () => {
  it('should throw error when API URL is missing', async () => {
    const file = new File(['dummy'], 'test.png', { type: 'image/png' });
    await expect(analyzeImage(file)).rejects.toThrow('API URL no configurada');
  });
});
