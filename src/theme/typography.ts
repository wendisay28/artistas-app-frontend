// theme/typography.ts — Sistema de tipografía unificado
// Fuente principal del proyecto: PlusJakartaSans

export const Fonts = {
  regular: 'PlusJakartaSans_400Regular',
  medium: 'PlusJakartaSans_500Medium',
  semiBold: 'PlusJakartaSans_600SemiBold',
  bold: 'PlusJakartaSans_700Bold',
  extraBold: 'PlusJakartaSans_800ExtraBold',
} as const;

export const Typography = {
  // Headings
  h1: {
    fontSize: 32,
    fontWeight: '800' as const,
    fontFamily: Fonts.extraBold,
    lineHeight: 38,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 24,
    fontWeight: '700' as const,
    fontFamily: Fonts.bold,
    lineHeight: 30,
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: 20,
    fontWeight: '700' as const,
    fontFamily: Fonts.bold,
    lineHeight: 26,
    letterSpacing: -0.2,
  },
  h4: {
    fontSize: 17,
    fontWeight: '600' as const,
    fontFamily: Fonts.semiBold,
    lineHeight: 22,
  },

  // Body
  bodyLarge: {
    fontSize: 16,
    fontWeight: '500' as const,
    fontFamily: Fonts.medium,
    lineHeight: 24,
  },
  body: {
    fontSize: 14,
    fontWeight: '400' as const,
    fontFamily: Fonts.regular,
    lineHeight: 20,
  },
  bodySmall: {
    fontSize: 12,
    fontWeight: '400' as const,
    fontFamily: Fonts.regular,
    lineHeight: 18,
  },

  // UI elements
  button: {
    fontSize: 16,
    fontWeight: '600' as const,
    fontFamily: Fonts.semiBold,
    lineHeight: 20,
  },
  buttonSmall: {
    fontSize: 14,
    fontWeight: '600' as const,
    fontFamily: Fonts.semiBold,
    lineHeight: 18,
  },
  caption: {
    fontSize: 11,
    fontWeight: '500' as const,
    fontFamily: Fonts.medium,
    lineHeight: 14,
    letterSpacing: 0.2,
  },
  label: {
    fontSize: 10,
    fontWeight: '700' as const,
    fontFamily: Fonts.bold,
    lineHeight: 12,
    letterSpacing: 0.5,
    textTransform: 'uppercase' as const,
  },
} as const;

export type FontKeys = keyof typeof Fonts;
export type FontValue = typeof Fonts[FontKeys];
export type TypographyKeys = keyof typeof Typography;
