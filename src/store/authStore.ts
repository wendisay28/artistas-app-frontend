// src/store/authStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthState, UserProfile, UserRole } from '../types/User';

interface LocationData {
  country: string;
  state: string;
  city: string;
}

interface TempUserData {
  firebaseUid: string;
  email: string;
  name: string;
  profileImage: string | null;
  userType: 'client' | 'artist';
  location: LocationData | null;
}

interface AuthActions {
  setUser: (user: UserProfile) => void;
  setToken: (token: string | null) => void;
  setLoading: (value: boolean) => void;
  setError: (error: string | null) => void;
  setProfileComplete: (value: boolean) => void;
  logout: () => void;
  setTempUser: (tempUser: TempUserData) => void;
  clearTempUser: () => void;
}

const initialState: AuthState = {
  user: null,
  firebaseToken: null,
  isAuthenticated: false,
  isLoading: true, // true al inicio para verificar sesión persistida
  isProfileComplete: false,
  error: null,
};

export const useAuthStore = create<AuthState & AuthActions & { tempUser: TempUserData | null }>()(
  persist(
    (set) => ({
      ...initialState,
      tempUser: null,

      setUser: (user) =>
        set({ user, isAuthenticated: true, isProfileComplete: user.isProfileComplete }),

      setToken: (firebaseToken) => set({ firebaseToken }),

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error }),

      setProfileComplete: (isProfileComplete) => set({ isProfileComplete }),

      setTempUser: (tempUser) => set({ tempUser }),

      clearTempUser: () => set({ tempUser: null }),

      // Limpia todo el estado al hacer logout
      logout: () => set({ ...initialState, isLoading: false, tempUser: null }),
    }),
    {
      name: 'buscartpro-auth',
      storage: createJSONStorage(() => AsyncStorage),
      // Solo persistir datos no sensibles (token va a SecureStore)
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isProfileComplete: state.isProfileComplete,
        tempUser: state.tempUser,
      }),
    }
  )
);