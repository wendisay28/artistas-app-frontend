// ─────────────────────────────────────────────────────────────────────────────
// ArtistCard.tsx — Card horizontal para lista de Favoritos
// Estilo Airbnb Saved: imagen compacta izquierda + info densa derecha
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { colors } from '../../../constants/colors';
import type { FavoriteArtist } from '../../../data/favorites-mock';

// ── Props ─────────────────────────────────────────────────────────────────────

interface ArtistCardProps {
  artist: FavoriteArtist;
  onPress?: () => void;
  onContact?: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const formatCOP = (price: number) =>
  `$${(price * 1000).toLocaleString('es-CO', { maximumFractionDigits: 0 })}`;

// ── Component ─────────────────────────────────────────────────────────────────

export const ArtistCard: React.FC<ArtistCardProps> = ({
  artist,
  onPress,
  onContact,
  onToggleFavorite,
}) => {
  const [saved, setSaved] = useState(true);
  const isAvail = artist.availability === 'Disponible';

  const handleToggleFavorite = () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSaved(p => !p);
    onToggleFavorite?.(artist.id);
  };

  const handleContact = () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onContact?.(artist.id);
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
      ]}
    >
      {/* ── IMAGEN IZQUIERDA ── */}
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: artist.image || 'https://via.placeholder.com/150' }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={200}
        />
        {/* dot de disponibilidad */}
        <View style={styles.dotOuter}>
          <View style={[
            styles.dotInner,
            { backgroundColor: isAvail ? '#10b981' : '#f59e0b' },
          ]} />
        </View>
      </View>

      {/* ── CONTENIDO DERECHA ── */}
      <View style={styles.content}>

        {/* nombre + verificado + corazón */}
        <View style={styles.topRow}>
          <View style={styles.nameBlock}>
            <Text style={styles.name} numberOfLines={1}>{artist.name}</Text>
            {artist.verified && (
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark" size={9} color="#fff" />
              </View>
            )}
          </View>
          <Pressable
            onPress={handleToggleFavorite}
            hitSlop={8}
            style={({ pressed }) => [
              styles.heartBtn,
              pressed && { opacity: 0.6 },
            ]}
          >
            <Ionicons
              name={saved ? 'heart' : 'heart-outline'}
              size={18}
              color={saved ? '#ef4444' : colors.textSecondary}
            />
          </Pressable>
        </View>

        {/* categoría */}
        <Text style={styles.category} numberOfLines={1}>{artist.type}</Text>

        {/* rating + reseñas + disponibilidad */}
        <View style={styles.metaRow}>
          <Ionicons name="star" size={11} color="#fbbf24" />
          <Text style={styles.ratingText}>{artist.rating}</Text>
          <Text style={styles.reviewsText}>({artist.reviews})</Text>
          <View style={styles.metaSep} />
          <View style={[
            styles.availPill,
            { backgroundColor: isAvail ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)' },
          ]}>
            <View style={[
              styles.availDot,
              { backgroundColor: isAvail ? '#10b981' : '#f59e0b' },
            ]} />
            <Text style={[
              styles.availText,
              { color: isAvail ? '#10b981' : '#f59e0b' },
            ]}>
              {isAvail ? 'Disponible' : 'Ocupado'}
            </Text>
          </View>
        </View>

        {/* separador */}
        <View style={styles.divider} />

        {/* precio + botón */}
        <View style={styles.footer}>
          <View>
            <Text style={styles.priceLabel}>Desde</Text>
            <View style={styles.priceRow}>
              <Text style={styles.priceValue}>{formatCOP(artist.price)}</Text>
              <Text style={styles.priceUnit}>/h</Text>
            </View>
          </View>

          <Pressable
            onPress={handleContact}
            style={({ pressed }) => [
              styles.contactBtn,
              pressed && styles.contactBtnPressed,
            ]}
          >
            <Ionicons name="briefcase-outline" size={13} color="#fff" />
            <Text style={styles.contactText}>Contratar</Text>
          </Pressable>
        </View>

      </View>
    </Pressable>
  );
};

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.07)',
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },
  cardPressed: {
    opacity: 0.93,
    elevation: 1,
  },

  // imagen
  imageWrapper: {
    width: 108,
    alignSelf: 'stretch',
    backgroundColor: colors.background,
  },
  dotOuter: {
    position: 'absolute',
    top: 10, left: 10,
    width: 14, height: 14,
    borderRadius: 7,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  dotInner: {
    width: 8, height: 8,
    borderRadius: 4,
  },

  // contenido
  content: {
    flex: 1,
    paddingHorizontal: 13,
    paddingTop: 12,
    paddingBottom: 11,
  },

  // top
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  nameBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    flex: 1,
    marginRight: 6,
  },
  name: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#111827',
    flexShrink: 1,
  },
  verifiedBadge: {
    width: 16, height: 16,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  heartBtn: {
    width: 30, height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.04)',
  },

  // categoría
  category: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: colors.primary,
    marginBottom: 6,
  },

  // meta
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#111827',
  },
  reviewsText: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textSecondary,
  },
  metaSep: {
    width: 3, height: 3,
    borderRadius: 1.5,
    backgroundColor: '#d1d5db',
    marginHorizontal: 2,
  },
  availPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 20,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  availDot: {
    width: 6, height: 6,
    borderRadius: 3,
  },
  availText: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },

  // divisor
  divider: {
    height: 1,
    backgroundColor: '#f3f4f6',
    marginTop: 8,
    marginBottom: 8,
  },

  // footer
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceLabel: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
  },
  priceValue: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.primary,
    lineHeight: 20,
  },
  priceUnit: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textSecondary,
  },

  // botón — morado suavizado con opacity
  contactBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    opacity: 0.80,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 2,
  },
  contactBtnPressed: {
    opacity: 0.60,
    elevation: 1,
  },
  contactText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#fff',
  },
});