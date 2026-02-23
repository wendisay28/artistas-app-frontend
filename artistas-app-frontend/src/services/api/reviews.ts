// src/services/api/reviews.ts
// Servicio para gestionar reseñas de artistas
import { apiClient } from './config';
import { API_ENDPOINTS } from './endpoints';

export interface Review {
  id?: number;
  userId?: string;
  artistId?: string;
  reviewerName?: string;
  reviewerEmail?: string;
  reviewerAvatar?: string;
  rating?: number; // 1-5
  title?: string;
  text?: string;
  serviceName?: string;
  isVerified?: boolean;
  isPublic?: boolean;
  responseFromArtist?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ReviewResponse {
  reviews: Review[];
  averageRating?: number;
  totalReviews?: number;
  ratingDistribution?: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export const reviewsService = {
  // Obtener reseñas del perfil del usuario autenticado
  getMyReviews: async (): Promise<ReviewResponse> => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.REVIEWS.MY_REVIEWS);
      const body = response.data;
      // El backend retorna { reviews, stats: { averageRating, totalReviews } }
      return {
        reviews: body.reviews ?? [],
        averageRating: body.stats?.averageRating ?? body.averageRating ?? 0,
        totalReviews: body.stats?.totalReviews ?? body.totalReviews ?? 0,
        ratingDistribution: body.stats?.ratingDistribution ?? body.ratingDistribution ?? { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      };
    } catch (e: any) {
      // 404 = perfil aún no existe en backend (usuario nuevo) — retornar vacío silenciosamente
      if (e?.response?.status === 404 || e?.response?.status === 401) {
        return { reviews: [], averageRating: 0, totalReviews: 0, ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } };
      }
      throw e;
    }
  },

  // Obtener reseñas de un artista específico
  getArtistReviews: async (artistId: string): Promise<ReviewResponse> => {
    const response = await apiClient.get(API_ENDPOINTS.REVIEWS.ARTIST_REVIEWS(artistId));
    return response.data.data;
  },

  // Obtener una reseña por ID
  getReviewById: async (id: number): Promise<Review> => {
    const response = await apiClient.get(API_ENDPOINTS.REVIEWS.DETAIL(id));
    return response.data.data;
  },

  // Crear una nueva reseña
  createReview: async (review: Omit<Review, 'id' | 'createdAt' | 'updatedAt'>): Promise<Review> => {
    const response = await apiClient.post(API_ENDPOINTS.REVIEWS.CREATE, review);
    return response.data.data;
  },

  // Actualizar una reseña existente
  updateReview: async (id: number, review: Partial<Review>): Promise<Review> => {
    const response = await apiClient.patch(API_ENDPOINTS.REVIEWS.UPDATE(id), review);
    return response.data.data;
  },

  // Responder a una reseña como artista
  respondToReview: async (id: number, artistResponse: string): Promise<Review> => {
    const response = await apiClient.patch(API_ENDPOINTS.REVIEWS.RESPOND(id), {
      responseFromArtist: artistResponse,
    });
    return response.data.data;
  },

  // Eliminar una reseña (propietario)
  deleteReview: async (id: number): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.REVIEWS.DELETE(id));
  },

  // Marcar reseña como verificada
  verifyReview: async (id: number): Promise<Review> => {
    const response = await apiClient.patch(API_ENDPOINTS.REVIEWS.VERIFY(id), {
      isVerified: true,
    });
    return response.data.data;
  },

  // Reportar una reseña
  reportReview: async (id: number, reason: string): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.REVIEWS.REPORT(id), { reason });
  },
};
