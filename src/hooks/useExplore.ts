import { useState, useCallback, useEffect } from 'react';
import { debounce } from 'lodash';

// Tipos para el explorador
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

export interface ExploreState {
  data: any[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  total: number;
  filters: ExploreFilters;
  category: 'artists' | 'events' | 'venues' | 'gallery';
}

export interface ExploreActions {
  setCategory: (category: ExploreState['category']) => void;
  setFilters: (filters: Partial<ExploreFilters>) => void;
  loadMore: () => void;
  refresh: () => void;
  search: (query: string) => void;
  clearFilters: () => void;
}

const initialState: ExploreState = {
  data: [],
  loading: false,
  error: null,
  hasMore: false,
  total: 0,
  filters: {
    limit: 20,
    offset: 0,
    sortBy: 'rating',
  },
  category: 'artists',
};

// Cache simple en memoria
const cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

const getCacheKey = (category: string, filters: ExploreFilters) => {
  return `explore:${category}:${JSON.stringify(filters)}`;
};

const getFromCache = (key: string) => {
  const cached = cache.get(key);
  if (!cached) return null;
  
  if (Date.now() - cached.timestamp > cached.ttl) {
    cache.delete(key);
    return null;
  }
  
  return cached.data;
};

const setCache = (key: string, data: any, ttl: number = 5 * 60 * 1000) => {
  cache.set(key, { data, timestamp: Date.now(), ttl });
};

// API optimizada
const exploreAPI = {
  async fetchArtists(filters: ExploreFilters) {
    const response = await fetch(`/api/v1/explorer/artists?${new URLSearchParams(filters as any).toString()}`);
    if (!response.ok) throw new Error('Error al cargar artistas');
    return response.json();
  },
  
  async fetchEvents(filters: ExploreFilters) {
    const response = await fetch(`/api/v1/explorer/events?${new URLSearchParams(filters as any).toString()}`);
    if (!response.ok) throw new Error('Error al cargar eventos');
    return response.json();
  },
  
  async fetchVenues(filters: ExploreFilters) {
    const response = await fetch(`/api/v1/explorer/venues?${new URLSearchParams(filters as any).toString()}`);
    if (!response.ok) throw new Error('Error al cargar venues');
    return response.json();
  },
  
  async fetchGallery(filters: ExploreFilters) {
    const response = await fetch(`/api/v1/explorer/artworks?${new URLSearchParams(filters as any).toString()}`);
    if (!response.ok) throw new Error('Error al cargar galería');
    return response.json();
  },
};

export const useExplore = (): ExploreState & ExploreActions => {
  const [state, setState] = useState<ExploreState>(initialState);

  // Fetch principal con memoización
  const fetchData = useCallback(async (category: ExploreState['category'], filters: ExploreFilters, append = false) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const cacheKey = getCacheKey(category, filters);
      const cached = getFromCache(cacheKey);
      
      let result;
      if (cached && !append) {
        result = cached;
      } else {
        const apiMap = {
          artists: exploreAPI.fetchArtists,
          events: exploreAPI.fetchEvents,
          venues: exploreAPI.fetchVenues,
          gallery: exploreAPI.fetchGallery,
        };
        
        result = await apiMap[category](filters);
        
        if (!append) {
          setCache(cacheKey, result, 5 * 60 * 1000); // 5 minutos
        }
      }

      setState(prev => ({
        ...prev,
        data: append ? [...prev.data, ...result.data] : result.data,
        loading: false,
        hasMore: result.pagination?.hasMore || false,
        total: result.pagination?.total || 0,
        error: null,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      }));
    }
  }, []);

  // Debounce para búsqueda
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      setState(prev => ({
        ...prev,
        filters: { ...prev.filters, query, offset: 0 },
      }));
    }, 300),
    []
  );

  // Efecto para cargar datos cuando cambian filtros o categoría
  useEffect(() => {
    if (state.filters.offset === 0) {
      fetchData(state.category, state.filters);
    }
  }, [state.category, state.filters.query, state.filters.city, state.filters.category, state.filters.sortBy]);

  // Efecto para paginación
  useEffect(() => {
    if (state.filters.offset > 0) {
      fetchData(state.category, state.filters, true);
    }
  }, [state.filters.offset]);

  const actions: ExploreActions = {
    setCategory: useCallback((category) => {
      setState(prev => ({
        ...prev,
        category,
        filters: { ...initialState.filters, limit: prev.filters.limit },
        data: [],
        offset: 0,
      }));
    }, []),

    setFilters: useCallback((newFilters) => {
      setState(prev => ({
        ...prev,
        filters: { ...prev.filters, ...newFilters, offset: 0 },
        data: [],
      }));
    }, []),

    loadMore: useCallback(() => {
      if (!state.loading && state.hasMore) {
        setState(prev => ({
          ...prev,
          filters: { ...prev.filters, offset: prev.filters.offset + (prev.filters.limit || 20) },
        }));
      }
    }, [state.loading, state.hasMore]),

    refresh: useCallback(() => {
      const currentFilters = { ...state.filters, offset: 0 };
      setState(prev => ({ ...prev, filters: currentFilters, data: [] }));
      
      // Limpiar caché de esta categoría
      const cacheKey = getCacheKey(state.category, currentFilters);
      cache.delete(cacheKey);
      
      fetchData(state.category, currentFilters);
    }, [state.category, state.filters, fetchData]),

    search: useCallback((query: string) => {
      debouncedSearch(query);
    }, [debouncedSearch]),

    clearFilters: useCallback(() => {
      setState(prev => ({
        ...prev,
        filters: { ...initialState.filters, limit: prev.filters.limit },
        data: [],
        offset: 0,
      }));
    }, []),
  };

  return { ...state, ...actions };
};
