import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
  ReactNode,
} from 'react';

import { AUTH_STORAGE_KEYS } from '@/features/auth/constants';
import {
  fetchCurrentUser,
  loginRequest,
  logoutRequest,
  registerRequest,
} from '@/features/auth/services';

import type { AuthTokens, AuthUser } from '@/features/auth/types';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitializing: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const getStoredTokens = (): AuthTokens | null => {
  const accessToken = localStorage.getItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
  if (!accessToken) {
    return null;
  }

  const refreshToken = localStorage.getItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN);

  return {
    accessToken,
    refreshToken: refreshToken || undefined,
  };
};

const persistTokens = ({ accessToken, refreshToken }: AuthTokens) => {
  localStorage.setItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN, accessToken);
  if (refreshToken) {
    localStorage.setItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
  }
};

const clearTokens = () => {
  localStorage.removeItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN);
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      const tokens = getStoredTokens();
      if (!tokens?.accessToken) {
        setIsInitializing(false);
        return;
      }

      try {
        const currentUser = await fetchCurrentUser(tokens.accessToken);
        setUser(currentUser);
      } catch (error) {
        console.error('Auth bootstrap failed', error);
        clearTokens();
        setUser(null);
      } finally {
        setIsInitializing(false);
      }
    };

    bootstrap();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    console.log('Login function called');
    setIsLoading(true);
    try {
      const response = await loginRequest({ email, password });
      console.log('Login successful, response:', response);
      persistTokens(response.tokens);

      // Si el backend no devuelve el usuario, lo obtenemos usando el token
      if (!response.user) {
        console.log('User not in response, fetching current user...');
        const currentUser = await fetchCurrentUser(response.tokens.accessToken);
        console.log('Fetched current user:', currentUser);
        setUser(currentUser);
      } else {
        setUser(response.user);
        console.log('User state updated to:', response.user);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    console.log('Register function called');
    setIsLoading(true);
    try {
      // Paso 1: Registrar usuario (solo crea el usuario, no devuelve tokens)
      await registerRequest({ name, email, password });
      console.log('Registration successful, now logging in...');

      // Paso 2: Hacer login automáticamente para obtener tokens
      const loginResponse = await loginRequest({ email, password });
      console.log('Auto-login successful, response:', loginResponse);
      persistTokens(loginResponse.tokens);

      // Si el backend no devuelve el usuario, lo obtenemos usando el token
      if (!loginResponse.user) {
        console.log('User not in response, fetching current user...');
        const currentUser = await fetchCurrentUser(loginResponse.tokens.accessToken);
        console.log('Fetched current user:', currentUser);
        setUser(currentUser);
      } else {
        setUser(loginResponse.user);
        console.log('User state updated to:', loginResponse.user);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    const tokens = getStoredTokens();
    clearTokens();
    setUser(null);
    await logoutRequest(tokens?.accessToken).catch(() => undefined);
  }, []);

  const value: AuthContextType = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      isInitializing,
      login,
      register,
      logout,
    }),
    [user, isLoading, isInitializing, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
