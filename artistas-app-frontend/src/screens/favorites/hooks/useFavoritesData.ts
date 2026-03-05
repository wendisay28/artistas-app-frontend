import { useState, useEffect, useCallback } from 'react';
import type { Artist, Event, Venue, GalleryItem } from '../../../types/explore';
import {
  MOCK_ARTISTS,
  MOCK_EVENTS,
  MOCK_VENUES,
  MOCK_GALLERY,
} from '../../../data/explore';

interface FavoritesData {
  artists: Artist[];
  events: Event[];
  venues: Venue[];
  gallery: GalleryItem[];
  loading: boolean;
  error: string | null;
}

export const useFavoritesData = () => {
  const [data, setData] = useState<FavoritesData>({
    artists: [],
    events: [],
    venues: [],
    gallery: [],
    loading: true,
    error: null,
  });

  const fetchFavoritesData = useCallback(async () => {
    try {
      setData((prev) => ({ ...prev, loading: true, error: null }));

      // Datos mock — subconjuntos de los datos de explorar
      await new Promise(resolve => setTimeout(resolve, 500));

      setData({
        artists: MOCK_ARTISTS.slice(0, 2),
        events: MOCK_EVENTS.slice(0, 2),
        venues: MOCK_VENUES.slice(0, 2),
        gallery: MOCK_GALLERY.slice(0, 2),
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error('Error loading favorites:', error);
      setData((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Error de conexión',
      }));
    }
  }, []);

  useEffect(() => {
    fetchFavoritesData();
  }, [fetchFavoritesData]);

  return { ...data, refresh: fetchFavoritesData };
};
