import { ReactNode } from 'react';
// TODO: Install react-router-dom to enable routing
// import { Navigate } from 'react-router-dom';

import { Loading } from '@/common/components';
import { useAuth } from '@/features/auth/context';

interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

/**
 * Protected Route Component
 *
 * Redirects to login if user is not authenticated
 *
 * @example
 * ```tsx
 * <ProtectedRoute>
 *   <DashboardPage />
 * </ProtectedRoute>
 * ```
 */
export const ProtectedRoute = ({ children, redirectTo = '/login' }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading text="Verificando autenticación..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    // TODO: Install react-router-dom and uncomment this
    // return <Navigate to={redirectTo} replace />;
    console.warn('User not authenticated, redirecting to:', redirectTo);
    return <div>Please log in to access this page.</div>;
  }

  return <>{children}</>;
};
