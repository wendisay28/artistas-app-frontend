import type { Artist, Event, Venue, GalleryItem } from '../../../types/explore';
import { useFavoritesStore } from '../../../store/favoritesStore';

export const useFavoritesData = () => {
  const favorites = useFavoritesStore(state => state.favorites);

  const artists  = favorites.filter(f => f.type === 'artist')  as Artist[];
  const events   = favorites.filter(f => f.type === 'event')   as Event[];
  const venues   = favorites.filter(f => f.type === 'venue')   as Venue[];
  const gallery  = favorites.filter(f => f.type === 'gallery') as GalleryItem[];

  return {
    artists,
    events,
    venues,
    gallery,
    loading: false,
    error: null,
    refresh: () => {},
  };
};
