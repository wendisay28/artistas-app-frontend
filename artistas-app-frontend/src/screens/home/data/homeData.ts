// src/screens/home/data/homeData.ts
// ─── Mock data centralizada — fácil de reemplazar por API calls ───────────────

import { EventItem, ArtistItem, VenueItem } from '../components/ContentCards';

export const EVENT_CATEGORIES: { id: string; label: string; icon: string; }[] = [
  { id: 'todos',      label: 'Todos',  icon: 'apps' },
  { id: 'musica',     label: 'Música', icon: 'musical-notes' },
  { id: 'teatro',     label: 'Teatro', icon: 'mic' },
  { id: 'danza',      label: 'Danza',  icon: 'body' },
  { id: 'arte',       label: 'Arte',   icon: 'color-palette' },
  { id: 'fotografia', label: 'Foto',   icon: 'camera' },
];

export const MOCK_EVENTS: EventItem[] = [
  {
    id: '1', title: 'Noche de Jazz en vivo', category: 'Música',
    date: 'Vie 28 Feb', venue: 'Teatro Metropolitano', price: 'Desde $35.000',
    gradients: ['#7c3aed', '#2563eb'],
    latitude: 6.2442, longitude: -75.5812, city: 'Medellín',
  },
  {
    id: '2', title: 'Exposición Arte Contemporáneo', category: 'Arte',
    date: 'Sáb 1 Mar', venue: 'Museo de Arte Moderno', price: 'Entrada libre',
    gradients: ['#db2777', '#7c3aed'],
    latitude: 6.2518, longitude: -75.5693, city: 'Medellín',
  },
  {
    id: '3', title: 'Festival de Danza Contemporánea', category: 'Danza',
    date: 'Dom 2 Mar', venue: 'Parque Explora', price: 'Desde $20.000',
    gradients: ['#0891b2', '#7c3aed'],
    latitude: 6.2600, longitude: -75.5700, city: 'Medellín',
  },
];

export const MOCK_ARTISTS: ArtistItem[] = [
  {
    id: '1', name: 'Luna Restrepo', discipline: 'Pintora',
    rating: 4.9, works: 47, avatarUri: null, available: true,
    gradients: ['#7c3aed', '#a78bfa'], initials: 'LR',
    latitude: 6.2442, longitude: -75.5812, city: 'Medellín',
  },
  {
    id: '2', name: 'Camilo Torres', discipline: 'Músico',
    rating: 4.8, works: 83, avatarUri: null, available: false,
    gradients: ['#2563eb', '#7c3aed'], initials: 'CT',
    latitude: 6.2518, longitude: -75.5693, city: 'Medellín',
  },
  {
    id: '3', name: 'Sara Múnera', discipline: 'Fotógrafa',
    rating: 4.7, works: 31, avatarUri: null, available: true,
    gradients: ['#db2777', '#7c3aed'], initials: 'SM',
    latitude: 6.2550, longitude: -75.5720, city: 'Medellín',
  },
];

export const MOCK_VENUES: VenueItem[] = [
  {
    id: '1', name: 'Teatro Metropolitano', type: 'Teatro',
    capacity: '1.200 personas', city: 'Medellín',
    gradients: ['#1e1b4b', '#4c1d95'], icon: 'business',
    latitude: 6.2442, longitude: -75.5812,
  },
  {
    id: '2', name: 'Casa de la Música', type: 'Sala de ensayo',
    capacity: '80 personas', city: 'Medellín',
    gradients: ['#7c3aed', '#2563eb'], icon: 'musical-notes',
    latitude: 6.2500, longitude: -75.5750,
  },
  {
    id: '3', name: 'Museo de Arte Moderno', type: 'Museo',
    capacity: '500 personas', city: 'Medellín',
    gradients: ['#db2777', '#7c3aed'], icon: 'color-palette',
    latitude: 6.2518, longitude: -75.5693,
  },
  {
    id: '4', name: 'Parque Explora', type: 'Parque',
    capacity: '2.000 personas', city: 'Medellín',
    gradients: ['#0891b2', '#7c3aed'], icon: 'telescope-outline',
    latitude: 6.2600, longitude: -75.5700,
  },
  {
    id: '5', name: 'Plaza Botero', type: 'Plaza',
    capacity: '1.500 personas', city: 'Medellín',
    gradients: ['#7c3aed', '#2563eb'], icon: 'location-outline',
    latitude: 6.2478, longitude: -75.5678,
  },
  {
    id: '6', name: 'Jardín Botánico', type: 'Jardín',
    capacity: '1.000 personas', city: 'Medellín',
    gradients: ['#059669', '#0891b2'], icon: 'leaf-outline',
    latitude: 6.2650, longitude: -75.5820,
  },
];