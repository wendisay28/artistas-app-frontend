// theme/spacing.ts — Sistema de espaciado unificado

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  section: 48,
  page: 24, // padding horizontal estándar de página
} as const;

export type SpacingKeys = keyof typeof Spacing;
export type SpacingValue = typeof Spacing[SpacingKeys];
