// src/types/User.ts

export type UserRole = 'artist' | 'client';

export interface UserProfile {
  id: string;
  firebaseUid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  role: UserRole;
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