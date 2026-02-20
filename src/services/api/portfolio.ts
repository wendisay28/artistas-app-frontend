// src/services/api/portfolio.ts
import { apiClient } from './config';
import { API_ENDPOINTS } from './endpoints';

export interface GalleryItem {
  id?: number;
  userId?: string;
  imageUrl: string;
  title?: string;
  description?: string;
  tags?: string[];
  isPublic?: boolean;
  isFeatured?: boolean;
  orderPosition?: number;
  metadata?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}

export interface FeaturedItem {
  id?: number;
  userId?: string;
  url: string;
  title: string;
  description?: string;
  type?: 'youtube' | 'spotify' | 'vimeo' | 'soundcloud' | 'other';
  thumbnailUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PortfolioResponse {
  photos: GalleryItem[];
  videos: FeaturedItem[];
}

export const portfolioService = {
  // Obtener todo el portfolio del usuario autenticado
  getMyPortfolio: async (): Promise<PortfolioResponse> => {
    const response = await apiClient.get(API_ENDPOINTS.PORTFOLIO.ME);
    return response.data.data;
  },

  // Obtener portfolio público de un usuario
  getUserPortfolio: async (userId: string): Promise<PortfolioResponse> => {
    const response = await apiClient.get(API_ENDPOINTS.PORTFOLIO.USER(userId));
    return response.data.data;
  },

  // Obtener trabajos destacados del usuario autenticado
  getMyFeatured: async (): Promise<GalleryItem[]> => {
    const response = await apiClient.get(API_ENDPOINTS.PORTFOLIO.FEATURED);
    return response.data.data;
  },

  // Obtener trabajos destacados de un usuario
  getUserFeatured: async (userId: string): Promise<GalleryItem[]> => {
    const response = await apiClient.get(API_ENDPOINTS.PORTFOLIO.USER_FEATURED(userId));
    return response.data.data;
  },

  // Agregar foto al portfolio
  addPhoto: async (photo: Omit<GalleryItem, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<GalleryItem> => {
    const response = await apiClient.post(API_ENDPOINTS.PORTFOLIO.PHOTOS, photo);
    return response.data.data;
  },

  // Actualizar foto del portfolio
  updatePhoto: async (id: number, photo: Partial<GalleryItem>): Promise<GalleryItem> => {
    const response = await apiClient.patch(API_ENDPOINTS.PORTFOLIO.UPDATE_PHOTO(id), photo);
    return response.data.data;
  },

  // Eliminar foto del portfolio
  deletePhoto: async (id: number): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.PORTFOLIO.DELETE_PHOTO(id));
  },

  // Marcar/desmarcar foto como destacada
  toggleFeatured: async (id: number, isFeatured: boolean, orderPosition?: number): Promise<GalleryItem> => {
    const response = await apiClient.patch(API_ENDPOINTS.PORTFOLIO.TOGGLE_FEATURED(id), {
      isFeatured,
      orderPosition,
    });
    return response.data.data;
  },

  // Agregar video/enlace al portfolio
  addVideo: async (video: Omit<FeaturedItem, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<FeaturedItem> => {
    const response = await apiClient.post(API_ENDPOINTS.PORTFOLIO.VIDEOS, video);
    return response.data.data;
  },

  // Actualizar video/enlace del portfolio
  updateVideo: async (id: number, video: Partial<FeaturedItem>): Promise<FeaturedItem> => {
    const response = await apiClient.patch(API_ENDPOINTS.PORTFOLIO.UPDATE_VIDEO(id), video);
    return response.data.data;
  },

  // Eliminar video/enlace del portfolio
  deleteVideo: async (id: number): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.PORTFOLIO.DELETE_VIDEO(id));
  },
};
