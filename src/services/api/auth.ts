import { api } from './config';
import { API_ENDPOINTS } from './endpoints';
import type { User } from '../../types/User';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

export const authService = {
  // Iniciar sesión
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
    return response.data;
  },

  // Registrar usuario
  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, userData);
    return response.data;
  },

  // Verificar token
  verifyToken: async (token: string): Promise<{ user: User; valid: boolean }> => {
    const response = await api.post(API_ENDPOINTS.AUTH.VERIFY_TOKEN, { token });
    return response.data;
  },

  // Refrescar token
  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await api.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN, { refreshToken });
    return response.data;
  },

  // Recuperar contraseña
  forgotPassword: async (email: string): Promise<{ message: string }> => {
    const response = await api.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
    return response.data;
  },

  // Restablecer contraseña
  resetPassword: async (token: string, newPassword: string): Promise<{ message: string }> => {
    const response = await api.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, { 
      token, 
      newPassword 
    });
    return response.data;
  },

  // Obtener token CSRF
  getCsrfToken: async (): Promise<{ csrfToken: string }> => {
    const response = await api.get(API_ENDPOINTS.AUTH.CSRF_TOKEN);
    return response.data;
  },
};
