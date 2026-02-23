export type ArtistTag = {
  label: string;
  genre?: boolean;
};

export type Stat = {
  value: string;
  label: string;
};

export type Artist = {
  id: string;
  name: string;
  handle: string;
  location: string;
  avatar: string;
  isVerified: boolean;
  isOnline: boolean;
  bio: string;
  tags: ArtistTag[];
  stats: Stat[];
  socialLinks: { label: string; icon: string; url: string }[];
  info: { label: string; icon: string; value: string }[];
};

export type Service = {
  id: string;
  icon: string;
  name: string;
  description: string;
  price: string;
  deliveryTag: string;
  bgGradient: [string, string];
};

export type PortfolioItem = {
  id: string;
  emoji: string;
  price?: string;
  isNFT?: boolean;
  gradientStart: string;
  gradientEnd: string;
  span?: 'double';
};

export type Review = {
  id: string;
  reviewerName: string;
  reviewerEmoji: string;
  reviewerAvatarGradient: [string, string];
  serviceName: string;
  stars: number;
  text: string;
  date: string;
};

export type Product = {
  id: string;
  emoji: string;
  name: string;
  type: string;
  price: string;
  gradientStart: string;
  gradientEnd: string;
  badge?: 'nft' | 'low' | 'out';
};

export type EventStatus = 'live' | 'upcoming' | 'draft';

export type ArtistEvent = {
  id: string;
  title: string;
  emoji: string;
  dateLabel: string;
  location: string;
  price: string;
  currency?: string;
  status: EventStatus;
  attendees: number;
  capacity: number;
  revenue?: string;
  gradientStart: string;
  gradientEnd: string;
  isFree?: boolean;
  isSoldOut?: boolean;
};

export type ScheduleItem = {
  id: string;
  month: string;
  day: string;
  title: string;
  time: string;
  location: string;
  status: 'confirmed' | 'pending';
};

export type LiveRequest = {
  id: string;
  title: string;
  description: string;
  offerAmount: string;
  currency: string;
  secondsRemaining: number;
};

export type CalendarDay = {
  day: number | null;
  state: 'empty' | 'normal' | 'today' | 'booked' | 'unavailable';
  hasEvent?: boolean;
};

export type MainTab = 'sobre' | 'productos' | 'eventos' | 'agenda';
export type EventSubTab = 'gestionar' | 'publicados';
export type InnerTab = 'servicios' | 'portafolio' | 'resenas';