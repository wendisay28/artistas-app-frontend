// ─────────────────────────────────────────────────────────────────────────────
// explore.ts — All types & interfaces for the Explore feature
// ─────────────────────────────────────────────────────────────────────────────

// ── Category ─────────────────────────────────────────────────────────────────

export type CategoryId = 'artists' | 'events' | 'venues' | 'gallery';

export interface Category {
  id: CategoryId;
  label: string;
  icon: string;
}

// ── Availability ─────────────────────────────────────────────────────────────

export type AvailabilityStatus = 'Disponible' | `Ocupada hasta ${string}` | `Ocupado hasta ${string}`;

// ── Shared base for all swipeable cards ─────────────────────────────────────

export interface BaseCard {
  id: string;
  name: string;
  location: string;
  rating: number;
  reviews: number;
  responseTime: string;
  price: number;
  image: string;
  gallery: string[];
  tags: string[];
  bio: string;
  availability: AvailabilityStatus | string;
  verified?: boolean;
}

// ── Artist ───────────────────────────────────────────────────────────────────

export interface Artist extends BaseCard {
  type: 'artist';
  category: string;           // e.g. "Pintora Contemporánea"
  experience: string;         // e.g. "10 años"
  style: string;              // e.g. "Contemporáneo"
  services: string[];         // e.g. ["Murales", "Retratos"]
  distance?: string;           // e.g. "2.3 km"
  verified?: boolean;           // e.g. true
}

// ── Event ────────────────────────────────────────────────────────────────────

export interface Event extends BaseCard {
  type: 'event';
  date: string;               // e.g. "15 Mar 2025"
  time: string;               // e.g. "20:00"
  venue: string;              // e.g. "Teatro Real"
  city: string;
  description: string;
  shortDescription?: string;
  startDate?: string;
  endDate?: string;
  capacity?: number;
  ticketsLeft?: number;
}

// ── Venue ────────────────────────────────────────────────────────────────────

export interface Venue extends BaseCard {
  type: 'venue';
  category: string;           // e.g. "Teatro / Sala de conciertos"
  capacity: number;
  amenities: string[];        // e.g. ["Sonido profesional", "Camerinos"]
  openingHours: string;
  website?: string;
}

// ── Gallery ──────────────────────────────────────────────────────────────────

export interface GalleryItem extends BaseCard {
  type: 'gallery';
  artistName: string;
  medium: string;             // e.g. "Óleo sobre lienzo"
  dimensions: string;         // e.g. "80 x 100 cm"
  year: number;
  forSale: boolean;
}

// ── Union type (used in the swipe stack) ─────────────────────────────────────

export type ExploreCard = Artist | Event | Venue | GalleryItem;

// ── Swipe result ─────────────────────────────────────────────────────────────

export type SwipeDirection = 'like' | 'nope';

export interface SwipeResult {
  cardId: string;
  direction: SwipeDirection;
  timestamp: number;
}

// ── Tab ──────────────────────────────────────────────────────────────────────

export type TabId = 'services' | 'portfolio' | 'reviews' | 'info';

export interface Tab {
  id: TabId;
  label: string;
  icon: string; // Ionicons name
}

// ── Tag color map ────────────────────────────────────────────────────────────

export interface TagColorEntry {
  bg: string;
  text: string;
  border: string;
}

export type TagColorMap = Record<string, TagColorEntry>;

// ── Review ───────────────────────────────────────────────────────────────────

export interface Review {
  id: string;
  authorName: string;
  authorAvatar?: string;
  rating: number;             // 1–5
  text: string;
  date: string;               // relative string, e.g. "Hace 2 semanas"
}

// ── Stats ────────────────────────────────────────────────────────────────────

export interface StatItem {
  icon: string;               // Ionicons name
  value: string | number;
  label: string;
  color: string;
}

// ── Filter ───────────────────────────────────────────────────────────────────

export type SortOption = 'rating' | 'distance' | 'price_asc' | 'price_desc' | 'availability';

export type ExploreFilters = {
  sortBy?: SortOption;
  distance?: number;
  availability?: 'available' | 'today' | 'any';
  priceRange?: [number, number];
  minRating?: number;
  category?: CategoryId;
  // Nuevos filtros avanzados
  subCategory?: string;
  format?: string;
  selectedDate?: Date | null;
  profession?: string;
};

// ── Explore screen state ─────────────────────────────────────────────────────

export interface ExploreState {
  selectedCategory: CategoryId;
  filters: ExploreFilters;
  swipeHistory: SwipeResult[];
  activeCardIndex: number;
}