import React from 'react';
import { Ionicons } from '@expo/vector-icons';

// Importar el tipo de selección de categorías
export type ArtistCategorySelection = {
  categoryId: string;
  disciplineId: string;
  roleId: string;
};

// Tipos compartidos para información detallada
export type StudyDetail = {
  institution: string;
  degree: string;
  year: string;
  details: string;
};

export type WorkExperienceDetail = {
  company: string;
  position: string;
  period: string;
  description: string;
};

export type CertificationDetail = {
  name: string;
  issuer: string;
  year: string;
};

export type SocialLink = {
  label: string;
  icon: string;
  url: string;
};

export type MainTab = 'sobre' | 'productos' | 'eventos' | 'agenda';

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
  socialLinks: SocialLink[];
  info: { label: string; icon: string; value: string }[];
  // Additional properties for profile functionality
  coverImage?: string;
  distanceKm?: number;
  isOwner?: boolean;
  role?: string;
  specialty?: string;
  niche?: string;
  rating?: number;
  reviews?: number;
  category?: ArtistCategorySelection;
  // Arrays complejos para información detallada
  studies?: StudyDetail[];
  workExperience?: WorkExperienceDetail[];
  certifications?: CertificationDetail[];
  // Horario disponible
  schedule?: string;
  // Descripción larga (Sobre mí completo, diferente a bio corta del header)
  description?: string;
  // Años de experiencia (numérico para el backend)
  yearsOfExperience?: number;
  // ID interno del artista en el backend
  artistId?: number;
  // Tipo de perfil
  userType?: 'general' | 'artist' | 'company';
  // Datos de empresa (si userType === 'company')
  companyName?: string;
  companyDescription?: string;
  // Disponibilidad del artista
  availability?: 'available' | 'busy' | 'unavailable';
};

export type Service = {
  id: string;
  icon: string;
  name: string;
  description: string;
  price: number; // Cambiado a number para mejor manejo
  currency?: string; // 'COP', 'USD', etc.
  deliveryTag?: string;
  bgGradient?: [string, string];
  // Campos adicionales para servicios fotográficos
  duration?: string; // '1 hora', '2 horas', '30 min'
  category?: string; // 'Maternidad', 'Familia', 'Personal', 'Evento'
  includes?: string[]; // ['Fotos digitales', 'Impresiones', 'Edición']
  location?: string; // 'Estudio', 'Exterior', 'Domicilio'
  maxPeople?: number; // Para sesiones grupales
  revisions?: number; // Número de revisiones incluidas
  deliveryTime?: string; // '24-48 horas', '5-7 días'
  requirements?: string[]; // Requisitos para el servicio
  isAvailable?: boolean;
  tags?: string[]; // Etiquetas para filtrado
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

export type EventSubTab = 'gestionar' | 'publicados';
export type InnerTab = 'servicios' | 'portafolio' | 'resenas';

export type TabItem = {
  key: string;
  label: string;
  /** Nombre de ícono Ionicons (inactivo) */
  icon: React.ComponentProps<typeof Ionicons>['name'];
  /** Nombre de ícono Ionicons activo (opcional — si no se pasa, usa `icon`) */
  iconActive?: React.ComponentProps<typeof Ionicons>['name'];
};
