import { getEnv } from '@/config/env';
import { API_ENDPOINTS, ERROR_MESSAGES } from '@/constants';

import type {
  AuthApiResponse,
  AuthResponse,
  AuthTokens,
  AuthUser,
  LoginPayload,
  RegisterApiResponse,
  RegisterPayload,
} from '../types';

const buildApiUrl = () => {
  const { VITE_API_URL } = getEnv();
  if (!VITE_API_URL) {
    throw new Error('VITE_API_URL no está configurado');
  }

  return VITE_API_URL.replace(/\/$/, '');
};

const parseAuthResponse = (payload: AuthApiResponse): AuthResponse => {
  const tokens: AuthTokens = {
    accessToken: payload.access_token || payload.token || '',
    refreshToken: payload.refresh_token,
  };

  if (!tokens.accessToken) {
    throw new Error('Respuesta inválida: falta access_token');
  }

  return {
    tokens,
    user: payload.user,
  };
};

const handleResponse = async <T>(response: Response): Promise<T> => {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data?.message || data?.error || data?.detail || ERROR_MESSAGES.SERVER_ERROR;
    throw new Error(message);
  }

  return data as T;
};

export const loginRequest = async (credentials: LoginPayload): Promise<AuthResponse> => {
  const baseUrl = buildApiUrl();
  const response = await fetch(`${baseUrl}${API_ENDPOINTS.LOGIN}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  const data = await handleResponse<AuthApiResponse>(response);
  return parseAuthResponse(data);
};

export const registerRequest = async (payload: RegisterPayload): Promise<AuthUser> => {
  const baseUrl = buildApiUrl();
  const response = await fetch(`${baseUrl}${API_ENDPOINTS.REGISTER}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await handleResponse<RegisterApiResponse>(response);

  // El registro solo devuelve el usuario creado, no tokens
  // El ID se obtendrá después del login automático
  return {
    id: data.id || '', // Se actualizará con el login
    email: data.email,
    name: data.name,
  };
};

export const fetchCurrentUser = async (accessToken: string): Promise<AuthUser> => {
  const baseUrl = buildApiUrl();
  const response = await fetch(`${baseUrl}${API_ENDPOINTS.ME}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return handleResponse<AuthUser>(response);
};

export const logoutRequest = async (accessToken?: string): Promise<void> => {
  if (!accessToken) {
    return;
  }

  try {
    const baseUrl = buildApiUrl();
    await fetch(`${baseUrl}${API_ENDPOINTS.LOGOUT}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    // Ignorar errores de logout para no bloquear al usuario
  } catch {
    // Silently fail - logout should not block user
  }
};
