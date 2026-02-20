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
  PROFILE: {
    MY_USER: '/users/me',
    UPDATE_USER: '/users/me',
    MY_ARTIST: '/artist/me',
    UPDATE_ARTIST: '/artist/me',
    UPDATE_USER_TYPE: '/profile/type',
  },
  STORAGE: {
    UPLOAD_IMAGE: '/storage/upload',
    DELETE_IMAGE: '/storage/delete',
  },
  EVENTS: {
    LIST: '/events',
    DETAIL: (id: string) => `/events/${id}`,
  },
};
