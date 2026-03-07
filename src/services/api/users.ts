// src/services/api/users.ts
import apiClient from './config';
import { API_ENDPOINTS } from './endpoints';
import { UserRole, UserProfile, CreateUserPayload } from '../../types/User';

// Registra o actualiza usuario en el backend tras el login de Firebase
export const registerOrSyncUser = async (
  _payload?: CreateUserPayload
): Promise<UserProfile> => {
  // El backend sincroniza automáticamente usando el token de Firebase (authMiddleware)
  const { data } = await apiClient.get<{ success: boolean; user: UserProfile }>('/v1/auth/sync');
  return data.user;
};

// Crea el perfil completo (SetupProfile)
export const createUserProfile = async (
  payload: SetupProfilePayload
): Promise<UserProfile> => {
  const { data } = await apiClient.put<UserProfile>('profile', payload);
  return data;
};

// Obtiene el perfil propio
export const getMyProfile = async (): Promise<UserProfile> => {
  const { data } = await apiClient.get<UserProfile>('/profile');
  return data;
};

// Verifica si el usuario ya completó el setup
export const checkProfileComplete = async (): Promise<boolean> => {
  const { data } = await apiClient.get<{ isComplete: boolean }>('users/me/setup-status');
  return data.isComplete;
};

/** Actualiza perfil (foto, portada). */
export const updateMyProfile = async (
  payload: UpdateProfilePayload
): Promise<UserProfile> => {
  const body: Record<string, string> = {};
  if (payload.photoURL != null) body.photoURL = payload.photoURL;
  if (payload.coverImageUrl != null) body.coverImageUrl = payload.coverImageUrl;
  const { data } = await apiClient.put<UserProfile>(API_ENDPOINTS.USERS.UPDATE, body);
  return data;
};

export interface SetupProfilePayload {
  displayName: string;
  username: string;
  photoURL?: string;
  role: UserRole;
  city?: string;
}

export interface UpdateProfilePayload {
  photoURL?: string;
  coverImageUrl?: string;
}