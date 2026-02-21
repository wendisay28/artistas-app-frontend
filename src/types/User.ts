// src/types/User.ts
// En el login/registro solo existen dos tipos: artista y cliente.
// Una vez dentro de la app, ambos pueden crecer a empresa (isCompany).

export type UserRole = 'artist' | 'client';

export interface UserProfile {
  id: string;
  firebaseUid: string;
  email: string;
  displayName: string;
  username: string;
  photoURL: string | null;
  role: UserRole;
  /** Dentro de la app, artista o cliente pueden pasar a empresa. */
  isCompany: boolean;
  city: string | null;
  bio: string | null;
  isProfileComplete: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserPayload {
  firebaseUid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  provider: 'google' | 'apple' | 'facebook' | 'temp';
}

export interface AuthState {
  user: UserProfile | null;
  firebaseToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isProfileComplete: boolean;
  error: string | null;
}