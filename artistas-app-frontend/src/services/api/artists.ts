import apiClient from './config';
import { API_ENDPOINTS } from './endpoints';
import type { Artist } from '../../types/explore'; // Cambiado a explore types
import type { ExploreFilters } from '../../types/explore';

// ── Tipos para la API ─────────────────────────────────────────────────────

export interface ArtistsResponse {
  artists: Artist[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface ExploreArtistsParams {
  page?: number;
  limit?: number;
  category?: string;
  subCategory?: string;
  distance?: number;
  priceMin?: number;
  priceMax?: number;
  priceType?: 'all' | 'free' | 'paid';
  sortBy?: 'rating' | 'distance' | 'price_asc' | 'price_desc' | 'availability';
  location?: {
    latitude: number;
    longitude: number;
  };
  tags?: string[];
  availableToday?: boolean;
}

export const artistsService = {
  // Obtener lista de artistas
  getArtists: async () => {
    const response = await apiClient.get(API_ENDPOINTS.ARTISTS.LIST);
    return response.data;
  },

  /**
   * Obtener artistas para la pantalla de explorar
   */
  async getExploreArtists(params: ExploreArtistsParams = {}): Promise<ArtistsResponse> {
    try {
      const response = await apiClient.get(API_ENDPOINTS.ARTISTS.LIST, {
        params: {
          page: params.page || 1,
          limit: params.limit || 20,
          category: params.category !== 'all' ? params.category : undefined,
          subCategory: params.subCategory !== 'all' ? params.subCategory : undefined,
          distance: params.distance,
          priceMin: params.priceMin,
          priceMax: params.priceMax,
          priceType: params.priceType !== 'all' ? params.priceType : undefined,
          sortBy: params.sortBy || 'rating',
          availableToday: params.availableToday,
          tags: params.tags?.length ? params.tags.join(',') : undefined,
          latitude: params.location?.latitude,
          longitude: params.location?.longitude,
        },
      });

      return response.data;
    } catch (error) {
      console.error('[artistsService] Error getting explore artists:', error);
      throw error;
    }
  },

  /**
   * Obtener artistas cercanos
   */
  async getNearbyArtists(
    latitude: number, 
    longitude: number, 
    radiusKm: number = 10
  ): Promise<ArtistsResponse> {
    return this.getExploreArtists({
      location: { latitude, longitude },
      distance: radiusKm,
      sortBy: 'distance',
    });
  },

  /**
   * Buscar artistas con filtros avanzados
   */
  async searchArtists(filters: ExploreFilters): Promise<ArtistsResponse> {
    const params: ExploreArtistsParams = {
      category: filters.category,
      subCategory: filters.subCategory,
      distance: filters.distance,
      priceMin: filters.priceRange?.[0],
      priceMax: filters.priceRange?.[1],
      sortBy: filters.sortBy,
      availableToday: filters.availability === 'today',
      tags: filters.tags,
    };

    return this.getExploreArtists(params);
  },

  // Obtener artistas destacados
  getFeaturedArtists: async () => {
    const response = await apiClient.get(API_ENDPOINTS.ARTISTS.FEATURED);
    return response.data;
  },

  /**
   * Mapear datos del backend al formato del frontend
   */
  mapBackendArtistToFrontend(backendArtist: any): Artist {
    return {
      id: backendArtist.id.toString(),
      type: 'artist' as const,
      name: backendArtist.displayName || backendArtist.name || 'Artista',
      category: backendArtist.category || 'Artista',
      location: backendArtist.city || 'Monterrey',
      rating: backendArtist.rating || 5.0,
      reviews: backendArtist.reviewsCount || 0,
      responseTime: backendArtist.responseTime || '~2 horas',
      price: backendArtist.pricePerHour || 0,
      image: backendArtist.avatarUrl || backendArtist.profileImageUrl || '',
      gallery: backendArtist.portfolio?.photos?.slice(0, 3).map((p: any) => p.url) || [],
      tags: backendArtist.tags?.slice(0, 3) || [],
      bio: backendArtist.bio || backendArtist.description || '',
      availability: backendArtist.isAvailable ? 'Disponible' : 'Ocupado',
      experience: backendArtist.experience || '',
      style: backendArtist.style || '',
      services: backendArtist.serviceTypes || [],
      distance: backendArtist.distance ? `${backendArtist.distance.toFixed(1)} km` : undefined,
      verified: backendArtist.isVerified || false,
      artistCategory: backendArtist.artistCategory,
    };
  },

  // Obtener detalle de un artista
  getArtistById: async (id: number) => {
    const response = await apiClient.get(API_ENDPOINTS.ARTISTS.DETAIL(id));
    return response.data;
  },

  // Crear perfil de artista
  createArtist: async (artistData: Partial<Artist>) => {
    const response = await apiClient.post(API_ENDPOINTS.ARTISTS.CREATE, artistData);
    return response.data;
  },

  // Actualizar perfil de artista
  updateArtist: async (id: number, artistData: Partial<Artist>) => {
    const response = await apiClient.put(API_ENDPOINTS.ARTISTS.UPDATE(id), artistData);
    return response.data;
  },

  // Eliminar perfil de artista
  deleteArtist: async (id: number) => {
    const response = await apiClient.delete(API_ENDPOINTS.ARTISTS.DELETE(id));
    return response.data;
  },
};
