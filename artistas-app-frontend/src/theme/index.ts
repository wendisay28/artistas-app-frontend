// theme/index.ts — Punto de entrada principal para el tema global
// Export unificado para todo el proyecto

// Core theme elements
export * from './colors';
export * from './spacing';
export * from './radius';
export * from './shadows';
export * from './typography';

// Import for internal use
import { Colors } from './colors';
import { Spacing } from './spacing';
import { Radius } from './radius';
import { Shadow } from './shadows';
import { Fonts, Typography } from './typography';

// Legacy compatibility exports
export { Colors as colors } from './colors'; // Para compatibilidad con constants/colors.ts

// Theme utilities
export const createTheme = () => ({
  colors: Colors,
  spacing: Spacing,
  radius: Radius,
  shadow: Shadow,
  fonts: Fonts,
  typography: Typography,
});

export type Theme = ReturnType<typeof createTheme>;
