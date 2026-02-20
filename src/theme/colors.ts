// theme/colors.ts — Paleta de colores global unificada
// Combina constants/colors.ts con components/profile/theme.ts

export const Colors = {
  // Base
  bg: '#FFFFFF',
  bgSoft: '#F4F4F6',
  surface: '#FAFAFA',
  surface2: '#F0F0F3',
  surface3: '#E8E8EC',

  // Borders
  border: '#E2E2E8',
  border2: '#D0D0D8',

  // Brand / Accent (purple — primary brand color)
  primary: '#7C3AED',       // violet-600
  secondary: '#8B5CF6',     // violet-500
  accent: '#7C3AED',        // alias de primary para compatibilidad
  accent2: '#8B5CF6',       // violet-500
  accentLight: '#EDE9FE',   // violet-100
  accentMid: '#A78BFA',     // violet-400
  accentDim: 'rgba(124,58,237,0.08)',

  // Secondary warm tone (ratings, highlights)
  warm: '#F59E0B',          // amber star / rating
  warmDim: 'rgba(245,158,11,0.12)',

  // Text
  text: '#111118',          // casi negro
  text2: '#6B6B7E',         // gris medio
  text3: '#A0A0B4',         // gris claro

  // Status colors
  green: '#10B981',
  greenDim: 'rgba(16,185,129,0.10)',
  red: '#EF4444',
  redDim: 'rgba(239,68,68,0.10)',
  blue: '#3B82F6',
  blueDim: 'rgba(59,130,246,0.10)',

  // Legacy compatibility (para constants/colors.ts)
  background: '#FFFFFF',
  backgroundSecondary: '#F3F4F6',
  textSecondary: '#6B7280',
  white: '#FFFFFF',
  black: '#000000',
  error: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
  starYellow: '#FCD34D',
  surfaceAlt: '#F3F4F6',
  borderLight: '#F0F0F0',
  textLight: '#9CA3AF',
} as const;

// Type definitions para mejor autocompletado
export type ColorKeys = keyof typeof Colors;
export type ColorValue = typeof Colors[ColorKeys];
