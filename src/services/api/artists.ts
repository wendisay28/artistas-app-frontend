import apiClient from './config';
import { API_ENDPOINTS } from './endpoints';
import type { Artist } from '../../types/Artist';

export const artistsService = {
  // Obtener lista de artistas
  getArtists: async () => {
    const response = await apiClient.get(API_ENDPOINTS.ARTISTS.LIST);
    return response.data;
  },

  // Obtener artistas destacados
  getFeaturedArtists: async () => {
    const response = await apiClient.get(API_ENDPOINTS.ARTISTS.FEATURED);
    return response.data;
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
