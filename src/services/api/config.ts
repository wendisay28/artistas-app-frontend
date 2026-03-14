// src/services/api/config.ts
import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import { refreshToken } from '../firebase/auth';

const BASE_URL = process.env.EXPO_PUBLIC_BACKEND_URL!;

export const API_BASE_URL = BASE_URL;

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // Aumentado a 30 segundos
  headers: { 'Content-Type': 'application/json' },
});

// ─── Request Interceptor — adjunta token Firebase en cada request ─────────────
apiClient.interceptors.request.use(
  async (config) => {
    const token = await refreshToken(); // siempre fresco
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn('⚠️ No hay token de autenticación disponible');
      // No enviar la petición si no hay token para endpoints protegidos
      if (config.url?.includes('/me') || config.url?.includes('/create') || config.url?.includes('/update') || config.url?.includes('/delete')) {
        throw new Error('No autenticado');
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor — mejor manejo de errores ────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // No loguear 404s ni errores de red en desarrollo (backend no levantado)
    const isNetworkError = error.code === 'ERR_NETWORK' || !error.response;
    const is404 = error.response?.status === 404;
    if (!is404 && !isNetworkError) {
      console.error('[API Error]', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        message: error.message,
        code: error.code,
      });
    } else if (isNetworkError) {
      console.warn('[API] Backend no disponible — usando datos locales');
    }
    return Promise.reject(error);
  }
);

export default apiClient;