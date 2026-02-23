// ─────────────────────────────────────────────────────────────────────────────
// listCardStyles.ts — Estilos compartidos para cards en modo lista de Favoritos
// v2: gradiente en imagen, badge disponibilidad completo, metaSep activo,
//     corazón anclado a imagen, availText visible, botón acción en footer
// ─────────────────────────────────────────────────────────────────────────────

import { StyleSheet } from 'react-native';
import { colors } from '../../../../constants/colors';

export const LIST_CARD_HEIGHT = 130;

export const formatPrice = (price: number) =>
  `$${price.toLocaleString('es-CO', { maximumFractionDigits: 0 })}`;

export const listCardStyles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(167,139,250,0.18)',
    shadowColor: '#5b21b6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    height: LIST_CARD_HEIGHT,
  },

  // ── imagen ──────────────────────────────────────────────────────────────────
  imageContainer: {
    width: LIST_CARD_HEIGHT,
    height: LIST_CARD_HEIGHT,
    backgroundColor: '#e5e7eb',
  },

  // gradiente sobre imagen para anclar los badges con legibilidad
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '55%',
  },

  // rating — arriba izquierda
  ratingBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  ratingText: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#fff',
  },

  // corazón anclado dentro de imageContainer
  heartBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.90)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#5b21b6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },

  // badge disponibilidad completo en imagen
  availBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 20,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.40)',
  },
  availDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  availText: {
    fontSize: 9,
    fontFamily: 'PlusJakartaSans_700Bold',
    letterSpacing: 0.2,
  },

  // ── contenido ───────────────────────────────────────────────────────────────
  info: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    justifyContent: 'space-between',
  },

  infoTop: {
    gap: 2,
  },

  // nombre + verificado en una sola fila
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  name: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#1e1b4b',
    lineHeight: 20,
  },
  verifiedBadge: {
    width: 15,
    height: 15,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  reviews: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: 'rgba(109,40,217,0.52)',
    flexShrink: 0,
  },

  subtitle: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: colors.primary,
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexWrap: 'nowrap',
  },
  metaText: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textSecondary,
    flexShrink: 1,
  },
  metaSep: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: 'rgba(124,58,237,0.22)',
    marginHorizontal: 1,
  },

  // divisor entre meta y footer
  divider: {
    height: 1,
    backgroundColor: 'rgba(167,139,250,0.15)',
    marginVertical: 6,
  },

  // bloque inferior: precio + botón
  infoBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  // precio
  priceLabel: {
    fontSize: 9,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: 'rgba(109,40,217,0.65)',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 1,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 1,
  },
  price: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#1e1b4b',
  },
  priceUnit: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(109,40,217,0.45)',
  },

  // botón "Ver →"
  contactBtn: {
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.22,
    shadowRadius: 6,
    elevation: 3,
  },
  contactBtnPressed: {
    opacity: 0.72,
  },
  contactGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  contactText: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#fff',
    letterSpacing: 0.1,
  },

  // legacy
  heartContainer: { position: 'absolute', top: 10, right: 10 },
});
