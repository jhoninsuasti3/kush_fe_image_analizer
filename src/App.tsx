import { ErrorBoundary } from '@/common/components';
import { Toaster } from '@/components/ui/sonner';
import ImageAnalyzerPage from '@/pages/ImageAnalyzerPage';

const App = () => (
  <ErrorBoundary>
    <Toaster />
    <ImageAnalyzerPage />
  </ErrorBoundary>
);

export default App;
