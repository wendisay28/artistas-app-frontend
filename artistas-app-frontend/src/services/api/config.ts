// src/services/api/config.ts
import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import { refreshToken } from '../firebase/auth';

const BASE_URL = process.env.EXPO_PUBLIC_BACKEND_URL!;

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Request Interceptor — adjunta token Firebase en cada request ─────────────
apiClient.interceptors.request.use(
  async (config) => {
    const token = await refreshToken(); // siempre fresco
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor — propagate errors ─────────────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Silenciar errores de API
    return Promise.reject(error);
  }
);

export default apiClient;