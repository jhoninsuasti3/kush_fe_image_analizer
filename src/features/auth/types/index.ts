export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface AuthResponse {
  user: AuthUser;
  tokens: AuthTokens;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload extends LoginPayload {
  name: string;
}

export interface AuthApiResponse {
  access_token: string;
  refresh_token?: string;
  user: AuthUser;
  token?: string; // fallback for APIs using token
}

export interface RegisterApiResponse {
  email: string;
  name: string;
  is_active: boolean;
  created_at: string;
  id?: string; // Opcional por si el backend lo incluye en el futuro
}
