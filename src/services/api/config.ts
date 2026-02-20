// src/services/api/config.ts
import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import { refreshToken, signOutUser } from '../firebase/auth';

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

// ─── Response Interceptor — manejo de 401 (token expirado) ───────────────────
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expirado — cerrar sesión limpiamente
      await signOutUser();
    }
    return Promise.reject(error);
  }
);

export default apiClient;