import { ErrorBoundary, Loading } from '@/common/components';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider, useAuth } from '@/features/auth';
import AuthPage from '@/pages/AuthPage';
import ImageAnalyzerPage from '@/pages/ImageAnalyzerPage';

const AppContent = () => {
  const { isAuthenticated, isInitializing } = useAuth();

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading text="Cargando tu sesión..." />
      </div>
    );
  }

  return isAuthenticated ? <ImageAnalyzerPage /> : <AuthPage />;
};

const App = () => (
  <ErrorBoundary>
    <AuthProvider>
      <Toaster />
      <AppContent />
    </AuthProvider>
  </ErrorBoundary>
);

export default App;
