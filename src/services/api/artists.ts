import apiClient from './config';
import { API_ENDPOINTS } from './endpoints';
import type { Artist } from '../../types/explore'; // Cambiado a explore types
import type { ExploreFilters } from '../../types/explore';
import { getCategoryById } from '../../constants/artistCategories';

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
      console.log('🎯 BuscArt: Llamando a endpoint:', API_ENDPOINTS.ARTISTS.LIST);
      console.log('🎯 BuscArt: Parámetros:', {
        page: params.page || 1,
        limit: params.limit || 20,
        category: params.category !== 'all' ? params.category : undefined,
        sortBy: params.sortBy || 'rating',
      });
      
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

      console.log('🎯 BuscArt: Respuesta del API:', response.data);

      // Normalizar respuesta: algunos endpoints devuelven { artists, total, ... } y otros un array plano.
      const raw = response.data as any;
      const rawArtists: any[] = Array.isArray(raw)
        ? raw
        : (Array.isArray(raw?.artists) ? raw.artists : []);

      const mappedArtists = rawArtists.map((a) => this.mapBackendArtistToFrontend(a));
      const total = typeof raw?.total === 'number' ? raw.total : mappedArtists.length;
      const page = typeof raw?.page === 'number' ? raw.page : (params.page || 1);
      const limit = typeof raw?.limit === 'number' ? raw.limit : (params.limit || 20);
      const hasMore = typeof raw?.hasMore === 'boolean' ? raw.hasMore : false;

      return {
        artists: mappedArtists,
        total,
        page,
        limit,
        hasMore,
      };
    } catch (error) {
      console.error('[artistsService] Error getting explore artists:', error);
      
      // Fallback: retornar datos vacíos para que la app no se rompa
      return {
        artists: [],
        total: 0,
        page: 1,
        limit: 20,
        hasMore: false,
      };
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
    console.log('[artistsService] Mapeando artista del backend:', {
      id: backendArtist.id,
      name: backendArtist.displayName || backendArtist.artistName,
      bio: backendArtist.bio,
      description: backendArtist.description,
      userBio: backendArtist.user?.bio,
      userDescription: backendArtist.user?.description,
    });

    const yearsExp = backendArtist.yearsOfExperience ?? backendArtist.experience;
    const experienceStr = typeof yearsExp === 'number'
      ? `${yearsExp} ${yearsExp === 1 ? 'año' : 'años'}`
      : (yearsExp || '');

    // socialMedia puede venir directo o anidado en user
    const socialMedia = backendArtist.socialMedia || backendArtist.user?.socialMedia;

    const rawCategoryId = backendArtist.categoryId || backendArtist.artistCategory?.categoryId;
    const rawDisciplineId = backendArtist.disciplineId || backendArtist.artistCategory?.disciplineId;
    const rawRoleId = backendArtist.roleId || backendArtist.artistCategory?.roleId;

    const categoryId = typeof rawCategoryId === 'string' && getCategoryById(rawCategoryId)
      ? rawCategoryId
      : undefined;
    const disciplineId = typeof rawDisciplineId === 'string' ? rawDisciplineId : undefined;
    const roleId = typeof rawRoleId === 'string' ? rawRoleId : undefined;

    return {
      // En Explore, `id` se usa como userId (Firebase UID) para cargar servicios/portfolio.
      id: (backendArtist.userId || backendArtist.user?.id || backendArtist.id).toString(),
      type: 'artist' as const,
      userId: backendArtist.userId || backendArtist.user?.id,
      name: backendArtist.displayName || backendArtist.artistName || backendArtist.name || 'Artista',
      // Intentar construir la categoría como objeto si vienen los campos individuales
      category: (categoryId || disciplineId || roleId) ? {
        categoryId: categoryId,
        disciplineId: disciplineId,
        roleId: roleId,
      } : (backendArtist.category || 'Artista'),
      location: backendArtist.city || backendArtist.user?.city || 'Colombia',
      rating: backendArtist.rating || 5.0,
      reviews: backendArtist.reviewsCount || 0,
      responseTime: backendArtist.responseTime || '~2 horas',
      price: Number(backendArtist.pricePerHour ?? backendArtist.hourlyRate ?? 0),
      image: backendArtist.avatarUrl || backendArtist.profileImageUrl || backendArtist.user?.profileImageUrl || '',
      gallery: backendArtist.portfolio?.photos?.map((p: any) => p.imageUrl || p.url) || [],
      tags: backendArtist.tags || [],
      bio: backendArtist.bio || backendArtist.user?.bio || backendArtist.shortBio || '',
      description: backendArtist.description || backendArtist.details?.description || backendArtist.user?.description || '',
      availability: backendArtist.availability || (backendArtist.isAvailable ? 'Disponible' : 'Ocupado'),
      experience: experienceStr,
      style: backendArtist.style || backendArtist.roleId || '',
      services: backendArtist.serviceTypes || [],
      distance: backendArtist.distance ? `${backendArtist.distance.toFixed(1)} km` : undefined,
      verified: backendArtist.isVerified || backendArtist.user?.isVerified || false,
      artistCategory: backendArtist.artistCategory,
      specialty: backendArtist.specialty || backendArtist.user?.specialty,
      niche: backendArtist.niche || backendArtist.user?.niche,
      socialLinks: socialMedia ? {
        instagram: socialMedia.instagram,
        tiktok: socialMedia.tiktok,
        youtube: socialMedia.youtube,
        spotify: socialMedia.spotify,
        facebook: socialMedia.facebook,
        twitter: socialMedia.twitter,
      } as {
        instagram?: string;
        tiktok?: string;
        youtube?: string;
        spotify?: string;
        facebook?: string;
        twitter?: string;
      } : undefined,
      workExperience: backendArtist.workExperience || [],
      education: backendArtist.education || [],
    };
  },

  // Obtener detalle de un artista (acepta userId string o id numérico)
  getArtistById: async (id: string | number) => {
    const response = await apiClient.get(`/artists/${id}`);
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
