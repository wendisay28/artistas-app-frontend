// theme/colors.ts — Paleta de colores global unificada BuscArt
// FUENTE DE VERDAD para todos los colores del proyecto

export const Colors = {
  // ── Brand principal (violeta → azul) ─────────────────────────────────────────
  primary: '#9333ea',          // violet-600 — botones e iconos
  primaryDark: '#7e22ce',      // violet-800 — checks y texto secundario
  primaryDeep: '#4c1d95',      // violet-950 — títulos
  primarySelected: '#581c87',  // entre 900-950 — texto en estado seleccionado
  blue: '#2563eb',             // blue-600 — combinado en gradiente

  // ── Gradiente principal ───────────────────────────────────────────────────────
  // Usar con LinearGradient: ['#9333ea', '#2563eb'] → horizontal (x:0→1)
  gradientStart: '#9333ea',
  gradientEnd: '#2563eb',

  // ── Fondos claros (light mode) ────────────────────────────────────────────────
  bgPurple: '#f3e8ff',         // purple-100 — fondos de secciones suaves
  bgPurpleMid: '#e9d5ff',      // purple-200 — bordes, fondos de inputs
  bgPurpleStrong: '#d8b4fe',   // purple-300 — acentos visuales

  // ── Estado seleccionado ───────────────────────────────────────────────────────
  selectedBg: 'rgba(147,51,234,0.10)',   // primary con 10% opacidad
  selectedBgBlue: 'rgba(37,99,235,0.10)', // blue con 10% opacidad

  // ── Fondos base ──────────────────────────────────────────────────────────────
  bg: '#FFFFFF',
  bgSoft: '#faf5ff',           // fondo muy suave con tono lila
  surface: '#FAFAFA',
  surface2: '#F3F4F6',

  // ── Texto ────────────────────────────────────────────────────────────────────
  text: '#4c1d95',             // títulos — deep purple
  textBody: '#1f2937',         // cuerpo — gray-800
  textSecondary: '#7e22ce',    // secundario — purple-800
  textSelected: '#581c87',     // seleccionado
  textMuted: '#6b7280',        // gris neutro
  textLight: '#9ca3af',        // placeholder

  // ── Bordes ───────────────────────────────────────────────────────────────────
  border: '#e9d5ff',           // borde estándar
  borderStrong: '#d8b4fe',     // borde con más presencia
  borderLight: '#f3e8ff',      // borde sutil

  // ── Estados ──────────────────────────────────────────────────────────────────
  green: '#10b981',
  greenDim: 'rgba(16,185,129,0.10)',
  red: '#ef4444',
  redDim: 'rgba(239,68,68,0.10)',
  yellow: '#f59e0b',
  yellowDim: 'rgba(245,158,11,0.12)',
  starYellow: '#fcd34d',

  // ── Base ─────────────────────────────────────────────────────────────────────
  white: '#FFFFFF',
  black: '#000000',

  // ── Aliases para compatibilidad con código existente ─────────────────────────
  accent: '#9333ea',
  accent2: '#8b5cf6',
  accentLight: '#f3e8ff',
  accentMid: '#a78bfa',
  accentDim: 'rgba(147,51,234,0.08)',
  secondary: '#8b5cf6',
  background: '#FFFFFF',
  backgroundSecondary: '#F3F4F6',
  error: '#ef4444',
  success: '#10b981',
  warning: '#f59e0b',
  surfaceAlt: '#F3F4F6',
  warm: '#f59e0b',
  warmDim: 'rgba(245,158,11,0.12)',
} as const;

export type ColorKeys = keyof typeof Colors;
export type ColorValue = typeof Colors[ColorKeys];
