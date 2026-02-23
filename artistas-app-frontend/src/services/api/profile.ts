// src/services/api/profile.ts
// Capa de servicio centralizada para el perfil del artista
import apiClient from './config';
import { API_ENDPOINTS } from './endpoints';

// ── Tipos de respuesta del backend ─────────────────────────────────────────────

export interface BackendUser {
  id: string;
  firebaseUid?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  displayName?: string;
  profileImageUrl?: string;
  coverImageUrl?: string;
  bio?: string;
  city?: string;
  userType?: 'general' | 'artist' | 'company';
  isVerified?: boolean;
  isProfileComplete?: boolean;
  companyName?: string;
  companyDescription?: string;
  companyLogoUrl?: string;
  taxId?: string;
  // Estadísticas del usuario
  followersCount?: number;
  viewsCount?: number;
  worksCount?: number;
  rating?: number;
  reviewsCount?: number;
}

/** Categorías de artista usan IDs string (slugs), alineados con constants/artistCategories. */
export interface BackendArtist {
  id: number;
  userId: string;
  artistName?: string;
  stageName?: string;
  categoryId?: string;
  disciplineId?: string;
  roleId?: string;
  tags?: string[];
  description?: string;
  availability?: Record<string, any>;
  isAvailable?: boolean;
  yearsOfExperience?: number;
  workExperience?: WorkExperienceItem[];
  education?: EducationItem[];
  certifications?: CertificationItem[];
  languages?: string[];
  pricePerHour?: string;
  hourlyRate?: string;
  experience?: number;
  artistType?: string;
}

export interface WorkExperienceItem {
  company: string;
  position: string;
  period: string;
  description: string;
}

export interface EducationItem {
  institution: string;
  degree: string;
  year: string;
  details: string;
}

export interface CertificationItem {
  name: string;
  issuer: string;
  year: string;
}

export interface ArtistProfileResponse {
  artist: BackendArtist;
  user: BackendUser;
  category?: { id: string; name: string };
}

// ── Payload para actualizar el usuario ────────────────────────────────────────

export interface UpdateUserPayload {
  firstName?: string;
  lastName?: string;
  username?: string;
  bio?: string;
  city?: string;
  profileImageUrl?: string;
  coverImageUrl?: string;
  userType?: 'general' | 'artist' | 'company';
  companyName?: string;
  companyDescription?: string;
  companyLogoUrl?: string;
  taxId?: string;
  // Social links
  instagramUrl?: string;
  twitterUrl?: string;
  youtubeUrl?: string;
  spotifyUrl?: string;
}

// ── Payload para actualizar el artista ────────────────────────────────────────

/** categoryId, disciplineId, roleId son IDs string (slugs) de constants/artistCategories. */
export interface UpdateArtistPayload {
  artistName?: string;
  stageName?: string;
  description?: string;
  tags?: string[];
  yearsOfExperience?: number;
  workExperience?: WorkExperienceItem[];
  education?: EducationItem[];
  certifications?: CertificationItem[];
  isAvailable?: boolean;
  categoryId?: string;
  disciplineId?: string;
  roleId?: string;
  pricePerHour?: number;
  hourlyRate?: number;
}

// ── Servicios ─────────────────────────────────────────────────────────────────

/**
 * Obtiene el perfil del usuario autenticado (datos de usuario)
 */
export const getMyUserProfile = async (): Promise<BackendUser> => {
  const { data } = await apiClient.get<BackendUser>(API_ENDPOINTS.PROFILE.MY_USER);
  return data;
};

/**
 * Obtiene el perfil de artista del usuario autenticado
 */
export const getMyArtistProfile = async (): Promise<ArtistProfileResponse | null> => {
  try {
    const { data } = await apiClient.get<ArtistProfileResponse>(API_ENDPOINTS.PROFILE.MY_ARTIST);
    return data;
  } catch (e: any) {
    if (e?.response?.status === 404) return null;
    throw e;
  }
};

/**
 * Actualiza los campos del usuario (nombre, bio corta, ciudad, imagen, etc.)
 */
export const updateUserProfile = async (payload: UpdateUserPayload): Promise<BackendUser> => {
  const { data } = await apiClient.patch<BackendUser>(API_ENDPOINTS.PROFILE.UPDATE_USER, payload);
  return data;
};

/**
 * Actualiza los campos del perfil artista (descripción larga, tags, experiencia, etc.)
 */
export const updateArtistProfile = async (payload: UpdateArtistPayload): Promise<BackendArtist> => {
  const { data } = await apiClient.put<BackendArtist>(API_ENDPOINTS.PROFILE.UPDATE_ARTIST, payload);
  return data;
};

/**
 * Cambia el tipo de perfil (artist → company, etc.)
 */
export const updateUserType = async (userType: 'general' | 'artist' | 'company'): Promise<BackendUser> => {
  const { data } = await apiClient.patch<BackendUser>(API_ENDPOINTS.PROFILE.UPDATE_USER_TYPE, { userType });
  return data;
};
