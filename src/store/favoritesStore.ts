import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ExploreCard } from '../types/explore';

interface FavoritesStore {
  favorites: ExploreCard[];
  addFavorite: (card: ExploreCard) => void;
  removeFavorite: (id: string) => void;
  isFavorited: (id: string) => boolean;
  clearFavorites: () => void;
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favorites: [],

      addFavorite: (card) => {
        if (get().favorites.some(f => f.id === card.id)) return;
        set(state => ({ favorites: [card, ...state.favorites] }));
      },

      removeFavorite: (id) => {
        set(state => ({ favorites: state.favorites.filter(f => f.id !== id) }));
      },

      isFavorited: (id) => get().favorites.some(f => f.id === id),

      clearFavorites: () => set({ favorites: [] }),
    }),
    {
      name: 'buscart-favorites',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
