// gridCardStyles.ts — Estilos compartidos para cards cuadrícula en Favoritos
// Usado por ArtistCard y EventCard (grid 2 columnas)

import { StyleSheet } from 'react-native';

export const GRID_IMAGE_HEIGHT = 118;

export const formatPrice = (price: number) =>
  `$${price.toLocaleString('es-CO', { maximumFractionDigits: 0 })}`;

export const gridCardStyles = StyleSheet.create({

  // ── Card wrapper ──────────────────────────────────────────────
  card: {
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(167,139,250,0.18)',
    overflow: 'hidden',
    shadowColor: '#5b21b6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 16,
    elevation: 4,
  },
  cardDark: {
    backgroundColor: '#130d2a',
    borderColor: 'rgba(139,92,246,0.20)',
    shadowColor: '#000',
    shadowOpacity: 0.35,
  },
  cardPressed: {
    opacity: 0.93,
    transform: [{ scale: 0.975 }],
  },

  // ── Imagen ───────────────────────────────────────────────────
  imageWrapper: {
    height: GRID_IMAGE_HEIGHT,
    backgroundColor: '#1a0f35',
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    height: '65%',
  },

  // Disponibilidad top-left
  availBadge: {
    position: 'absolute',
    top: 8, left: 8,
    flexDirection: 'row', alignItems: 'center', gap: 4,
    borderRadius: 20,
    paddingHorizontal: 8, paddingVertical: 3,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
  },
  availBadgeGreen:  { backgroundColor: 'rgba(16,185,129,0.22)' },
  availBadgeAmber:  { backgroundColor: 'rgba(245,158,11,0.22)' },
  availBadgeRed:    { backgroundColor: 'rgba(239,68,68,0.18)' },
  availBadgeMirror: { backgroundColor: 'rgba(90,90,90,0.42)', borderColor: 'rgba(180,180,180,0.35)' },
  availDot: { width: 5, height: 5, borderRadius: 3 },
  availText: { fontSize: 9, fontFamily: 'PlusJakartaSans_700Bold' },

  // Corazón top-right
  heartBtn: {
    position: 'absolute',
    top: 8, right: 8,
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center', justifyContent: 'center',
  },

  // Tipo/categoría bottom-left
  typePill: {
    position: 'absolute',
    bottom: 8, left: 8,
    borderRadius: 20,
    paddingHorizontal: 9, paddingVertical: 4,
    maxWidth: '65%',
  },
  typeText: {
    fontSize: 9,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#fff', letterSpacing: 0.3,
  },

  // Rating bottom-right
  ratingBadge: {
    position: 'absolute',
    bottom: 8, right: 8,
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 8,
    paddingHorizontal: 7, paddingVertical: 3,
  },
  ratingText: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: '#fff',
  },

  // ── Contenido ─────────────────────────────────────────────────
  content: {
    paddingHorizontal: 9,
    paddingTop: 7,
    paddingBottom: 8,
  },

  nameRow: {
    flexDirection: 'row', alignItems: 'center',
    gap: 4, marginBottom: 2,
  },
  name: {
    flex: 1,
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: '#1e1b4b', lineHeight: 15,
  },
  nameDark: { color: '#f5f3ff' },

  verifiedBadge: {
    width: 13, height: 13, borderRadius: 7,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },

  // Subtítulo (ubicación o fecha)
  meta: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    marginBottom: 4,
  },
  metaText: {
    fontSize: 9,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(109,40,217,0.5)',
    flexShrink: 1,
  },
  metaTextDark: { color: '#6b7280' },

  // Tags
  tagsRow: {
    flexDirection: 'row', gap: 4,
    marginBottom: 6, flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: 'rgba(124,58,237,0.07)',
    borderWidth: 1, borderColor: 'rgba(124,58,237,0.15)',
    borderRadius: 20,
    paddingHorizontal: 7, paddingVertical: 2,
  },
  tagDark: {
    backgroundColor: 'rgba(124,58,237,0.12)',
    borderColor: 'rgba(139,92,246,0.25)',
  },
  tagText: {
    fontSize: 9,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#7c3aed',
  },
  tagTextDark: { color: '#a78bfa' },

  // Divisor
  divider: {
    height: 1,
    backgroundColor: 'rgba(167,139,250,0.15)',
    marginBottom: 6,
  },
  dividerDark: { backgroundColor: 'rgba(139,92,246,0.12)' },

  // Footer precio (fila etiqueta + valor)
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  priceLabel: {
    fontSize: 9,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: 'rgba(109,40,217,0.45)',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  priceLabelDark: { color: 'rgba(167,139,250,0.55)' },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 1 },
  price: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#1e1b4b',
  },
  priceDark: { color: '#f5f3ff' },
  priceUnit: {
    fontSize: 9,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(109,40,217,0.45)',
  },
  priceUnitDark: { color: 'rgba(167,139,250,0.5)' },
  priceFree: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#10b981',
  },

  // Botón + Proyecto centrado y más grande
  projectBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    paddingHorizontal: 10, paddingVertical: 7,
    borderRadius: 14,
    alignSelf: 'stretch',
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
});