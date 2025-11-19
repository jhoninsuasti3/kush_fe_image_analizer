import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

/**
 * User interface
 */
export interface User {
  id: string;
  email: string;
  name: string;
}

/**
 * Auth context interface
 */
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

/**
 * Auth context
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Auth Provider Props
 */
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Auth Provider Component
 *
 * Manages authentication state globally
 */
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (token) {
          // TODO: Validate token with backend
          // const user = await validateToken(token);
          // setUser(user);

          // For now, just set a mock user
          setUser({
            id: '1',
            email: 'user@example.com',
            name: 'Usuario',
          });
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('auth_token');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, _password: string) => {
    setIsLoading(true);
    try {
      // TODO: Call backend API
      // const response = await authService.login(email, _password);
      // localStorage.setItem('auth_token', response.token);
      // setUser(response.user);

      // Mock login for now
      localStorage.setItem('auth_token', 'mock-token');
      setUser({
        id: '1',
        email,
        name: 'Usuario',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, _password: string) => {
    setIsLoading(true);
    try {
      // TODO: Call backend API
      // const response = await authService.register(name, email, _password);
      // localStorage.setItem('auth_token', response.token);
      // setUser(response.user);

      // Mock register for now
      localStorage.setItem('auth_token', 'mock-token');
      setUser({
        id: '1',
        email,
        name,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook to use Auth context
 *
 * @throws Error if used outside AuthProvider
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
