// theme/typography.ts — Sistema de tipografía unificado

export const Fonts = {
  serif: 'Georgia',
  sans: 'System',
} as const;

export const Typography = {
  // Headings
  h1: {
    fontSize: 32,
    fontWeight: '900' as const,
    fontFamily: Fonts.serif,
    lineHeight: 36,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 24,
    fontWeight: '800' as const,
    fontFamily: Fonts.serif,
    lineHeight: 28,
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: 20,
    fontWeight: '800' as const,
    fontFamily: Fonts.serif,
    lineHeight: 24,
    letterSpacing: -0.3,
  },
  
  // Body
  bodyLarge: {
    fontSize: 16,
    fontWeight: '500' as const,
    fontFamily: Fonts.sans,
    lineHeight: 22,
  },
  body: {
    fontSize: 14,
    fontWeight: '400' as const,
    fontFamily: Fonts.sans,
    lineHeight: 20,
  },
  bodySmall: {
    fontSize: 12,
    fontWeight: '400' as const,
    fontFamily: Fonts.sans,
    lineHeight: 16,
  },
  
  // UI elements
  caption: {
    fontSize: 11,
    fontWeight: '500' as const,
    fontFamily: Fonts.sans,
    lineHeight: 14,
    letterSpacing: 0.2,
  },
  label: {
    fontSize: 10,
    fontWeight: '700' as const,
    fontFamily: Fonts.sans,
    lineHeight: 12,
    letterSpacing: 0.5,
    textTransform: 'uppercase' as const,
  },
} as const;

export type FontKeys = keyof typeof Fonts;
export type FontValue = typeof Fonts[FontKeys];
export type TypographyKeys = keyof typeof Typography;
