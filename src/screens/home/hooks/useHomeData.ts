// src/screens/home/hooks/useHomeData.ts
// Carga artistas reales desde el backend para el Home screen

import { useState, useEffect, useCallback } from 'react';
import { artistsService } from '../../../services/api/artists';
import type { ArtistItem } from '../components/ContentCards';
import { MOCK_ARTISTS, MOCK_EVENTS } from '../data/homeData';
import type { EventItem } from '../components/ContentCards';

const ARTIST_GRADIENTS = [
  ['#7c3aed', '#a78bfa'],
  ['#2563eb', '#7c3aed'],
  ['#db2777', '#7c3aed'],
  ['#0891b2', '#7c3aed'],
  ['#059669', '#7c3aed'],
];

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase() ?? '')
    .join('');
}

function mapToArtistItem(raw: any, index: number): ArtistItem {
  return {
    id: raw.id ?? String(index),
    name: raw.name ?? raw.displayName ?? 'Artista',
    discipline: raw.disciplineName ?? raw.categoryName ?? raw.discipline ?? 'Artista',
    rating: raw.rating ?? 0,
    works: raw.reviews ?? raw.works ?? 0,
    avatarUri: raw.avatar ?? raw.image ?? null,
    available: raw.availability === 'Disponible' || raw.available === true,
    gradients: ARTIST_GRADIENTS[index % ARTIST_GRADIENTS.length],
    initials: getInitials(raw.name ?? raw.displayName ?? '?'),
    latitude: raw.latitude ?? null,
    longitude: raw.longitude ?? null,
    city: raw.city ?? raw.location ?? null,
  };
}

export function useHomeData() {
  const [artists, setArtists] = useState<ArtistItem[]>(MOCK_ARTISTS);
  const [events]  = useState<EventItem[]>(MOCK_EVENTS); // eventos aún sin endpoint real
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadArtists = useCallback(async (city?: string | null) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await artistsService.getExploreArtists({ limit: 10 });
      const data = response.artists ?? [];
      if (data.length > 0) {
        setArtists(data.map(mapToArtistItem));
      }
      // Si API devuelve vacío, mantiene el mock
    } catch (err: any) {
      console.warn('[useHomeData] Error cargando artistas:', err?.message);
      setError(err?.message ?? 'Error');
      // Mantiene mock data como fallback
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadArtists();
  }, [loadArtists]);

  return { artists, events, isLoading, error, refresh: loadArtists };
}
