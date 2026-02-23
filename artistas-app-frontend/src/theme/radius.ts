// theme/radius.ts — Sistema de bordes redondeados unificado

export const Radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 22,
  full: 999,
} as const;

export type RadiusKeys = keyof typeof Radius;
export type RadiusValue = typeof Radius[RadiusKeys];
