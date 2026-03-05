// src/services/api/endpoints.ts
// BASE_URL ya incluye /api/v1 (definido en .env como EXPO_PUBLIC_BACKEND_URL)
// Todos los paths aquí son relativos a ese base.

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
    ME: '/profile',
    UPDATE: '/profile',
  },
  PROFILE: {
    MY_USER: '/profile',
    UPDATE_USER: '/profile',
    MY_ARTIST: '/artist/me',
    UPDATE_ARTIST: '/artist/me',
    UPDATE_USER_TYPE: '/profile/type',
  },
  SERVICES: {
    ME: '/explorer/services/me',
    USER: (userId: string) => `/explorer/services/user/${userId}`,
    DETAIL: (id: number) => `/explorer/services/${id}`,
    CREATE: '/explorer/services',
    UPDATE: (id: number) => `/explorer/services/${id}`,
    DELETE: (id: number) => `/explorer/services/${id}`,
  },
  PORTFOLIO: {
    ME: '/portfolio/me',
    USER: (userId: string) => `/portfolio/user/${userId}`,
    PHOTOS: '/portfolio/photos',
    VIDEOS: '/portfolio/videos',
    FEATURED: '/portfolio/featured',
    UPDATE_PHOTO: (id: number) => `/portfolio/photos/${id}`,
    DELETE_PHOTO: (id: number) => `/portfolio/photos/${id}`,
    UPDATE_VIDEO: (id: number) => `/portfolio/videos/${id}`,
    DELETE_VIDEO: (id: number) => `/portfolio/videos/${id}`,
    TOGGLE_FEATURED: (id: number) => `/portfolio/photos/${id}/featured`,
    USER_FEATURED: (userId: string) => `/portfolio/user/${userId}/featured`,
  },
  REVIEWS: {
    MY_REVIEWS: '/profile/me/reviews',
    ARTIST_REVIEWS: (artistId: string) => `/profiles/${artistId}/reviews`,
    DETAIL: (id: number) => `/reviews/${id}`,
    CREATE: '/reviews',
    UPDATE: (id: number) => `/reviews/${id}`,
    DELETE: (id: number) => `/reviews/${id}`,
    RESPOND: (id: number) => `/reviews/${id}/respond`,
    VERIFY: (id: number) => `/reviews/${id}/verify`,
    REPORT: (id: number) => `/reviews/${id}/report`,
  },
  STORAGE: {
    UPLOAD_IMAGE: '/upload/image',
    UPLOAD_VIDEO: '/upload/video',
    DELETE_IMAGE: '/storage/delete',
  },
  EVENTS: {
    LIST: '/events',
    DETAIL: (id: string) => `/events/${id}`,
  },
};
