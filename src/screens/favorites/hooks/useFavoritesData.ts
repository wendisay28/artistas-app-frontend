import { useState, useEffect, useCallback } from 'react';

interface Artist {
  id: number;
  name: string;
  profession: string;
  image?: string;
  price?: number;
  description?: string;
}

interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
  price?: number;
  image?: string;
  description?: string;
}

interface Site {
  id: number;
  name: string;
  address: string;
  capacity?: number;
  price?: number;
  image?: string;
  description?: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image?: string;
  description?: string;
}

interface FavoritesData {
  artists: Artist[];
  events: Event[];
  sites: Site[];
  gallery: Product[];
  loading: boolean;
  error: string | null;
}

export const useFavoritesData = () => {
  const [data, setData] = useState<FavoritesData>({
    artists: [],
    events: [],
    sites: [],
    gallery: [],
    loading: true,
    error: null,
  });

  const fetchFavoritesData = useCallback(async () => {
    try {
      setData((prev) => ({ ...prev, loading: true, error: null }));

      // Datos mock para mientras - reemplazar con llamada real a API
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockArtists: Artist[] = [
        {
          id: 1,
          name: "DJ Shadow",
          profession: "DJ",
          price: 500,
          description: "DJ profesional con 10 años de experiencia"
        },
        {
          id: 2,
          name: "Banda Luna",
          profession: "Banda",
          price: 800,
          description: "Banda de música en vivo"
        }
      ];

      const mockEvents: Event[] = [
        {
          id: 1,
          title: "Festival de Música",
          date: "2024-03-15",
          location: "Parque Central",
          price: 50,
          description: "Festival anual de música"
        }
      ];

      const mockSites: Site[] = [
        {
          id: 1,
          name: "Salón Imperial",
          address: "Calle Principal 123",
          capacity: 200,
          price: 2000,
          description: "Salón elegante para eventos"
        }
      ];

      const mockGallery: Product[] = [
        {
          id: 1,
          name: "Paquete de Decoración",
          price: 300,
          category: "Decoración",
          description: "Decoración completa para eventos"
        }
      ];

      setData({
        artists: mockArtists,
        events: mockEvents,
        sites: mockSites,
        gallery: mockGallery,
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
