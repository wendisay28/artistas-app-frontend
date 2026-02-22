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
  SERVICES: {
    ME: '/services/me',
    USER: (userId: string) => `/services/user/${userId}`,
    DETAIL: (id: number) => `/services/${id}`,
    CREATE: '/services',
    UPDATE: (id: number) => `/services/${id}`,
    DELETE: (id: number) => `/services/${id}`,
  },
  PORTFOLIO: {
    ME: '/portfolio/me',
    USER: (userId: string) => `/portfolio/user/${userId}`,
    PHOTOS: '/portfolio/photos',
    VIDEOS: '/portfolio/videos',
    UPDATE_PHOTO: (id: number) => `/portfolio/photos/${id}`,
    DELETE_PHOTO: (id: number) => `/portfolio/photos/${id}`,
    UPDATE_VIDEO: (id: number) => `/portfolio/videos/${id}`,
    DELETE_VIDEO: (id: number) => `/portfolio/videos/${id}`,
    TOGGLE_FEATURED: (id: number) => `/portfolio/photos/${id}/featured`,
    USER_FEATURED: (userId: string) => `/portfolio/user/${userId}/featured`,
  },
  REVIEWS: {
    MY_REVIEWS: '/profile/me/reviews',
    ARTIST_REVIEWS: (artistId: string) => `/reviews/artist/${artistId}`,
    DETAIL: (id: number) => `/reviews/${id}`,
    CREATE: '/reviews',
    UPDATE: (id: number) => `/reviews/${id}`,
    DELETE: (id: number) => `/reviews/${id}`,
    RESPOND: (id: number) => `/reviews/${id}/respond`,
    VERIFY: (id: number) => `/reviews/${id}/verify`,
    REPORT: (id: number) => `/reviews/${id}/report`,
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
