// src/services/api/users.ts
import apiClient from './config';
import { UserRole, UserProfile, CreateUserPayload } from '../../types/User';

// Registra o actualiza usuario en el backend tras el login de Firebase
export const registerOrSyncUser = async (
  _payload?: CreateUserPayload
): Promise<UserProfile> => {
  // El backend sincroniza automáticamente usando el token de Firebase (authMiddleware)
  const { data } = await apiClient.get<{ success: boolean; user: UserProfile }>('/auth/sync');
  return data.user;
};

// Crea el perfil completo (SetupProfile)
export const createUserProfile = async (
  payload: SetupProfilePayload
): Promise<UserProfile> => {
  const { data } = await apiClient.put<UserProfile>('/users/profile/setup', payload);
  return data;
};

// Obtiene el perfil propio
export const getMyProfile = async (): Promise<UserProfile> => {
  const { data } = await apiClient.get<UserProfile>('/users/me');
  return data;
};

// Verifica si el usuario ya completó el setup
export const checkProfileComplete = async (): Promise<boolean> => {
  const { data } = await apiClient.get<{ isComplete: boolean }>('/users/me/setup-status');
  return data.isComplete;
};

export interface SetupProfilePayload {
  displayName: string;
  photoURL?: string;
  role: UserRole;
  city?: string;
}