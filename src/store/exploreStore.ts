import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Tipos para el store
export interface ExploreFilters {
  query?: string;
  city?: string;
  category?: string;
  subCategory?: string;
  distance?: number;
  priceMin?: number;
  priceMax?: number;
  sortBy?: 'rating' | 'distance' | 'price_asc' | 'price_desc' | 'availability';
  tags?: string[];
  availableToday?: boolean;
  limit?: number;
  offset?: number;
}

export interface ExploreItem {
  id: string;
  type: 'artist' | 'event' | 'venue' | 'artwork';
  name: string;
  category?: string;
  rating?: number;
  price?: number;
  image?: string;
  location?: string;
  [key: string]: any;
}

export interface ExploreState {
  // Estado actual
  category: 'artists' | 'events' | 'venues' | 'gallery';
  data: ExploreItem[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  total: number;
  filters: ExploreFilters;
  
  // Favoritos
  favorites: string[];
  
  // Historial de búsqueda
  searchHistory: string[];
  
  // Acciones
  setCategory: (category: ExploreState['category']) => void;
  setFilters: (filters: Partial<ExploreFilters>) => void;
  setData: (data: ExploreItem[]) => void;
  appendData: (data: ExploreItem[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setPagination: (hasMore: boolean, total: number) => void;
  clearFilters: () => void;
  reset: () => void;
  
  // Favoritos
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  
  // Historial
  addToSearchHistory: (query: string) => void;
  clearSearchHistory: () => void;
}

const initialState = {
  category: 'artists' as const,
  data: [],
  loading: false,
  error: null,
  hasMore: false,
  total: 0,
  filters: {
    limit: 20,
    offset: 0,
    sortBy: 'rating' as const,
  },
  favorites: [],
  searchHistory: [],
};

export const useExploreStore = create<ExploreState>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      // Cambiar categoría
      setCategory: (category) => {
        set((state) => ({
          category,
          data: [],
          filters: { ...initialState.filters, limit: state.filters.limit },
          offset: 0,
        }));
      },
      
      // Actualizar filtros
      setFilters: (newFilters) => {
        set((state) => ({
          filters: { ...state.filters, ...newFilters, offset: 0 },
          data: [],
        }));
      },
      
      // Set de datos
      setData: (data) => set({ data }),
      
      // Append para paginación
      appendData: (newData) => {
        set((state) => ({
          data: [...state.data, ...newData],
        }));
      },
      
      // Loading
      setLoading: (loading) => set({ loading }),
      
      // Error
      setError: (error) => set({ error }),
      
      // Paginación
      setPagination: (hasMore, total) => set({ hasMore, total }),
      
      // Limpiar filtros
      clearFilters: () => {
        set((state) => ({
          filters: { ...initialState.filters, limit: state.filters.limit },
          data: [],
          offset: 0,
        }));
      },
      
      // Reset completo
      reset: () => {
        set(initialState);
      },
      
      // Favoritos
      toggleFavorite: (id) => {
        set((state) => ({
          favorites: state.favorites.includes(id)
            ? state.favorites.filter(favId => favId !== id)
            : [...state.favorites, id],
        }));
      },
      
      isFavorite: (id) => {
        return get().favorites.includes(id);
      },
      
      // Historial de búsqueda
      addToSearchHistory: (query) => {
        if (!query || query.trim().length < 2) return;
        
        set((state) => {
          const history = state.searchHistory.filter(item => item !== query);
          history.unshift(query.trim());
          
          // Mantener solo los últimos 10
          return {
            searchHistory: history.slice(0, 10),
          };
        });
      },
      
      clearSearchHistory: () => {
        set({ searchHistory: [] });
      },
    }),
    {
      name: 'explore-store',
      // Solo persistir algunos campos
      partialize: (state) => ({
        favorites: state.favorites,
        searchHistory: state.searchHistory,
        filters: {
          city: state.filters.city,
          category: state.filters.category,
          sortBy: state.filters.sortBy,
        },
      }),
    }
  )
);

// Selectores optimizados
export const useExploreData = () => useExploreStore(state => state.data);
export const useExploreLoading = () => useExploreStore(state => state.loading);
export const useExploreError = () => useExploreStore(state => state.error);
export const useExploreFilters = () => useExploreStore(state => state.filters);
export const useExploreCategory = () => useExploreStore(state => state.category);
export const useExploreFavorites = () => useExploreStore(state => state.favorites);
export const useExplorePagination = () => useExploreStore(state => ({
  hasMore: state.hasMore,
  total: state.total,
}));
