// src/services/api/endpoints.ts

export const API_ENDPOINTS = {
  ARTISTS: {
    LIST: '/artists',
    FEATURED: '/artists/featured',
    DETAIL: (id: number) => `/artists/${id}`,
    CREATE: '/artists',
    UPDATE: (id: number) => `/artists/${id}`,
    DELETE: (id: number) => `/artists/${id}`,
  },
  USERS: {
    ME: '/users/me',
    UPDATE: '/users/me',
  },
};
