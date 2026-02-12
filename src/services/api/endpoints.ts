// Endpoints del backend BuscartPro
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    VERIFY_TOKEN: '/auth/verify-token',
    REFRESH_TOKEN: '/auth/refresh-token',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    CSRF_TOKEN: '/auth/csrf-token',
  },
  
  // Artists
  ARTISTS: {
    LIST: '/artists',
    FEATURED: '/artists/featured',
    DETAIL: (id: number) => `/artists/${id}`,
    CREATE: '/artists',
    UPDATE: (id: number) => `/artists/${id}`,
    DELETE: (id: number) => `/artists/${id}`,
  },
  
  // Events
  EVENTS: {
    LIST: '/events',
    DETAIL: (id: number) => `/events/${id}`,
    CREATE: '/events',
    UPDATE: (id: number) => `/events/${id}`,
    DELETE: (id: number) => `/events/${id}`,
  },
  
  // Venues
  VENUES: {
    LIST: '/venues',
    DETAIL: (id: number) => `/venues/${id}`,
    CREATE: '/venues',
    UPDATE: (id: number) => `/venues/${id}`,
    DELETE: (id: number) => `/venues/${id}`,
  },
  
  // Favorites
  FAVORITES: {
    LIST: '/favorites',
    ADD: '/favorites',
    REMOVE: (id: number) => `/favorites/${id}`,
  },
  
  // Hiring/Bookings
  HIRING: {
    REQUESTS: '/hiring/requests',
    RESPONSES: '/hiring/responses',
    CREATE_REQUEST: '/hiring/requests',
    CREATE_RESPONSE: '/hiring/responses',
  },
  
  BOOKINGS: {
    LIST: '/bookings',
    DETAIL: (id: number) => `/bookings/${id}`,
    CREATE: '/bookings',
    UPDATE: (id: number) => `/bookings/${id}`,
  },
  
  // User Profile
  PROFILE: {
    GET: '/profile',
    UPDATE: '/profile',
  },
  
  // Blog/Posts
  BLOG: {
    RECENT: '/blog/recent',
    LIST: '/posts',
    DETAIL: (id: number) => `/posts/${id}`,
  },
  
  // Saved Items
  SAVED_ITEMS: {
    LIST: '/saved-items',
    ADD: '/saved-items',
    UPDATE: (id: number) => `/saved-items/${id}`,
    REMOVE: (id: number) => `/saved-items/${id}`,
  },
};
