// theme/brand.ts — Componentes de marca globales inspirados en el onboarding
// Logo, blobs y elementos visuales consistentes

import { StyleSheet } from 'react-native';
import { Colors } from './colors';

// ── Logo Component Styles ─────────────────────────────────────────────────────
export const LogoStyles = {
  // Logo "BuscArt" - basado en WelcomeScreen
  container: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  buscText: {
    fontSize: 28,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: Colors.primaryDeep, // #1e1b4b
    letterSpacing: -1,
  },
  artBackground: {
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 1,
    // Gradiente: ['#7c3aed', '#2563eb']
  },
  artText: {
    fontSize: 28,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: Colors.white,
    letterSpacing: -1,
  },
} as const;

// ── Animated Blob Styles ───────────────────────────────────────────────────────
export const BlobStyles = {
  // Configuración base para blobs animados
  base: {
    position: 'absolute' as const,
    borderRadius: 9999, // Circular
    opacity: 0.5,
  },
  
  // Configuraciones específicas de blobs (desde WelcomeScreen)
  blob1: {
    size: 320,
    colors: Colors.blob1,
    duration: 8000,
    delay: 0,
  },
  blob2: {
    size: 260,
    colors: Colors.blob2,
    duration: 9500,
    delay: 1200,
  },
  blob3: {
    size: 180,
    colors: Colors.blob3,
    duration: 7200,
    delay: 600,
  },
  blob4: {
    size: 140,
    colors: Colors.blob4,
    duration: 11000,
    delay: 1800,
  },
} as const;

// ── Card Styles ────────────────────────────────────────────────────────────────
export const CardStyles = {
  // Border radius consistente
  borderRadius: 28,
  
  // Tarjeta oscura (estilo Artista)
  darkGradient: Colors.cardDarkGradient,
  darkShadow: {
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.28,
    shadowRadius: 20,
    elevation: 10,
  },
  
  // Tarjeta clara (estilo Cliente)
  lightBackground: Colors.cardLightBg,
  lightBorder: `rgba(167,139,250,0.35)`,
  lightShadow: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 5,
  },
  
  // Elementos internos de tarjetas
  innerBlob: {
    dark: 'rgba(255,255,255,0.07)',
    light: 'rgba(124,58,237,0.07)',
  },
  arrowWrap: {
    dark: 'rgba(255,255,255,0.15)',
    light: 'rgba(124,58,237,0.1)',
  },
  iconWrap: {
    dark: {
      backgroundColor: 'rgba(255,255,255,0.16)',
      borderColor: 'rgba(255,255,255,0.22)',
    },
    light: {
      backgroundColor: 'rgba(124,58,237,0.1)',
      borderColor: 'rgba(124,58,237,0.18)',
    },
  },
} as const;

// ── Background Styles ───────────────────────────────────────────────────────────
export const BackgroundStyles = {
  // Gradiente principal del fondo
  mainGradient: ['#f0ebff', '#eaf0ff', '#fafafa'],
  
  // Overlay de ruido/sutil
  noiseOverlay: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
} as const;

// ── Typography Brand Styles ─────────────────────────────────────────────────────
export const BrandTypography = {
  // Headlines principales
  headline: {
    fontSize: 28,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: Colors.primaryDeep,
    lineHeight: 35,
    letterSpacing: -0.6,
  },
  
  // Subheadlines
  subheadline: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: Colors.primary,
    lineHeight: 19,
    opacity: 0.85,
  },
  
  // Pills y badges
  pillText: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: Colors.primary,
    letterSpacing: 0.3,
  },
  
  // Títulos de tarjetas
  cardTitle: {
    dark: {
      fontSize: 19,
      fontFamily: 'PlusJakartaSans_700Bold',
      color: Colors.white,
      letterSpacing: -0.3,
    },
    light: {
      fontSize: 19,
      fontFamily: 'PlusJakartaSans_700Bold',
      color: Colors.primaryDeep,
      letterSpacing: -0.3,
    },
  },
} as const;

// ── Export Types ───────────────────────────────────────────────────────────────
export type LogoStyleKeys = keyof typeof LogoStyles;
export type BlobStyleKeys = keyof typeof BlobStyles;
export type CardStyleKeys = keyof typeof CardStyles;
