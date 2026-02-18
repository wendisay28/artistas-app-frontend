// types/profile.ts

export type SectionType = 'gallery' | 'catalog' | 'about' | 'portal';

export interface ProfileUser {
  id: string;
  name: string;
  email: string;
  category: string;
  location: string;
  bio: string;
  coverImage: string;
  avatarImage?: string;
}

export interface ProfileStats {
  works: number;
  rating: number;
  followers: number;
  visits: string;
}

export interface CatalogItem {
  id: string;
  title: string;
  price: string;
  image: string;
  tag?: string;
}

export interface ProfileDetail {
  icon: string;
  value: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  status: 'confirmed' | 'pending';
}

export interface Offer {
  id: string;
  client: string;
  type: string;
  amount: string;
  time: string;
}

export interface PortalStats {
  earnings: {
    value: string;
    sub: string;
  };
  clients: {
    value: string;
    sub: string;
  };
  views: {
    value: string;
    sub: string;
  };
}

export interface ProfileData {
  user: ProfileUser;
  stats: ProfileStats;
  galleryImages: string[];
  catalogItems: CatalogItem[];
  details: ProfileDetail[];
  skills: string[];
  portalStats: PortalStats;
  events: Event[];
  offers: Offer[];
}