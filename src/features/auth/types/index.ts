export interface AuthUser {
  id?: string; // Opcional porque algunos backends no lo incluyen
  email: string;
  name: string;
  is_active?: boolean; // Campo adicional del backend
  created_at?: string; // Campo adicional del backend
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface AuthResponse {
  user?: AuthUser; // Opcional porque algunos backends no lo incluyen en login
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
  token_type?: string; // "bearer"
  refresh_token?: string;
  user?: AuthUser; // Opcional porque el backend no lo incluye en login
  token?: string; // fallback for APIs using token
}

export interface RegisterApiResponse {
  email: string;
  name: string;
  is_active: boolean;
  created_at: string;
  id?: string; // Opcional por si el backend lo incluye en el futuro
}
