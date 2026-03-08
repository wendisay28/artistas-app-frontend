import { create } from 'zustand';
import type { ExploreCard } from '../types/explore';

interface FavoritesStore {
  favorites: ExploreCard[];
  addFavorite: (card: ExploreCard) => void;
  removeFavorite: (id: string) => void;
  isFavorited: (id: string) => boolean;
}

export const useFavoritesStore = create<FavoritesStore>((set, get) => ({
  favorites: [],

  addFavorite: (card) => {
    if (get().favorites.some(f => f.id === card.id)) return;
    set(state => ({ favorites: [card, ...state.favorites] }));
  },

  removeFavorite: (id) => {
    set(state => ({ favorites: state.favorites.filter(f => f.id !== id) }));
  },

  isFavorited: (id) => get().favorites.some(f => f.id === id),
}));
