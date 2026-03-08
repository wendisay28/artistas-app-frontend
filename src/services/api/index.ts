// src/services/api/index.ts
// Cliente API centralizado con configuración de Mercado Pago

import axios from 'axios';
import { auth } from '../../services/firebase/config';

const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api' 
  : 'https://buscart.com.co/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token de autenticación
apiClient.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado, redirigir a login
      auth.signOut();
    }
    return Promise.reject(error);
  }
);

export default apiClient;
