// ─────────────────────────────────────────────────────────────────────────────
// listCardStyles.ts — Estilos compartidos para cards lista en Favoritos
// Usado por ArtistCardList y EventCardList
// ─────────────────────────────────────────────────────────────────────────────

import { StyleSheet } from 'react-native';

// ── Helper para aplicar estilos con dark mode automático ───────────────────────────────────
export const createStyle = <T extends Record<string, any>>(
  baseStyles: T,
  darkStyles: Partial<T> | undefined,
  isDark: boolean
): T => {
  if (!darkStyles) return baseStyles;
  
  const mergedStyles = { ...baseStyles };
  Object.keys(darkStyles).forEach(key => {
    const darkKey = key as keyof typeof darkStyles;
    if (darkStyles[darkKey] !== undefined) {
      (mergedStyles as any)[key] = darkStyles[darkKey];
    }
  });
  
  return mergedStyles as T;
};

// ── Constantes ─────────────────────────────────────────────────────────────────────
export const CARD_HEIGHT = 134;

export const formatPrice = (price: number) =>
  `$${price.toLocaleString('es-CO', { maximumFractionDigits: 0 })}`;

export const listCardStyles = StyleSheet.create({

  // ── Card wrapper ──────────────────────────────────────────────
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(167,139,250,0.18)',
    shadowColor: '#5b21b6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    height: CARD_HEIGHT,
  },
  cardDark: {
    backgroundColor: '#130d2a',
    borderColor: 'rgba(139,92,246,0.20)',
    shadowColor: '#000',
    shadowOpacity: 0.35,
  },
  cardPressed: {
    opacity: 0.96,
    transform: [{ scale: 0.987 }],
  },

  // ── Imagen ───────────────────────────────────────────────────
  imageContainer: {
    width: CARD_HEIGHT,
    height: CARD_HEIGHT,
    backgroundColor: '#1a0f35',
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    height: '55%',
  },

  // Rating top-left
  ratingBadge: {
    position: 'absolute',
    top: 8, left: 8,
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: 'rgba(0,0,0,0.50)',
    borderRadius: 8,
    paddingHorizontal: 6, paddingVertical: 3,
  },
  ratingText: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#fff',
  },

  // Corazón top-right
  heartBtn: {
    position: 'absolute',
    top: 8, right: 8,
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.38)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center', justifyContent: 'center',
  },

  // Disponibilidad bottom-left
  availBadge: {
    position: 'absolute',
    bottom: 8, left: 8,
    flexDirection: 'row', alignItems: 'center', gap: 4,
    borderRadius: 20,
    paddingHorizontal: 7, paddingVertical: 3,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
  },
  availBadgeGreen:  { backgroundColor: 'rgba(16,185,129,0.22)' },
  availBadgeAmber:  { backgroundColor: 'rgba(245,158,11,0.22)' },
  availBadgeMirror: { backgroundColor: 'rgba(255,255,255,0.18)', borderColor: 'rgba(255,255,255,0.38)' },
  availDot: { width: 5, height: 5, borderRadius: 3 },
  availText: { fontSize: 9, fontFamily: 'PlusJakartaSans_600SemiBold' },

  // ── Info panel ───────────────────────────────────────────────
  info: {
    flex: 1, minWidth: 0,
    paddingHorizontal: 12, paddingVertical: 10,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  infoDark: {
    backgroundColor: '#130d2a',
  },

  infoTop: { gap: 2 },

  nameRow: {
    flexDirection: 'row', alignItems: 'center',
    gap: 5, minWidth: 0,
  },
  name: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#1e1b4b', lineHeight: 19,
  },
  nameDark: { color: '#f5f3ff' },

  verifiedBadge: {
    width: 15, height: 15, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },

  // Subtítulo (fecha en eventos, categoría en artistas)
  subtitle: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#7c3aed',
  },
  subtitleDark: { color: '#a78bfa' },

  metaRow: {
    flexDirection: 'row', alignItems: 'center',
    gap: 4, flexWrap: 'nowrap', minWidth: 0,
  },
  metaText: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#9ca3af', flexShrink: 1,
  },
  metaTextDark: { color: '#6b7280' },

  // Divisor
  divider: {
    height: 1,
    backgroundColor: 'rgba(167,139,250,0.15)',
    marginVertical: 6,
  },
  dividerDark: { backgroundColor: 'rgba(139,92,246,0.12)' },

  // ── Footer ───────────────────────────────────────────────────
  infoBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  priceLabel: {
    fontSize: 9,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: 'rgba(109,40,217,0.55)',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 1,
  },
  priceLabelDark: { color: 'rgba(167,139,250,0.55)' },

  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 1 },
  price: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#1e1b4b',
  },
  priceDark: { color: '#f5f3ff' },
  priceUnit: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(109,40,217,0.45)',
  },
  priceUnitDark: { color: 'rgba(167,139,250,0.5)' },

  // Acciones footer
  actions: { flexDirection: 'row', alignItems: 'center', gap: 6 },

  // Botón + Proyecto
  projectBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 10, paddingVertical: 7,
    borderRadius: 14,
    backgroundColor: 'rgba(124,58,237,0.07)',
    borderWidth: 1, borderColor: 'rgba(124,58,237,0.2)',
  },
  projectBtnDark: {
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderColor: 'rgba(255,255,255,0.28)',
  },
  projectBtnText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#7c3aed',
  },
  projectBtnTextDark: { color: '#fff' },

  // Botón Ver → (solo EventCard lo usa)
  viewBtn: {
    borderRadius: 10, overflow: 'hidden',
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.22, shadowRadius: 6, elevation: 3,
  },
  viewBtnPressed: { opacity: 0.8, transform: [{ scale: 0.97 }] },
  viewGradient: {
    alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 10, paddingVertical: 7,
  },
});