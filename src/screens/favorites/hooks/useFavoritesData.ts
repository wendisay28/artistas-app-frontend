import { useState, useCallback } from 'react';
import type { Artist, Event, Venue, GalleryItem } from '../../../types/explore';
import { useFavoritesStore } from '../../../store/favoritesStore';

export const useFavoritesData = () => {
  const favorites = useFavoritesStore(state => state.favorites);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const artists  = favorites.filter(f => f.type === 'artist')  as Artist[];
  const events   = favorites.filter(f => f.type === 'event')   as Event[];
  const venues   = favorites.filter(f => f.type === 'venue')   as Venue[];
  const gallery  = favorites.filter(f => f.type === 'gallery') as GalleryItem[];

  // Refresh fuerza re-render — los datos vienen de AsyncStorage vía zustand/persist
  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // El store ya está sincronizado con AsyncStorage automáticamente.
      // Aquí podrías llamar a una API de sincronización cuando exista.
      await new Promise(r => setTimeout(r, 200)); // pequeña espera visual
    } catch {
      setError('No se pudieron actualizar los favoritos.');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    artists,
    events,
    venues,
    gallery,
    loading,
    error,
    refresh,
  };
};
