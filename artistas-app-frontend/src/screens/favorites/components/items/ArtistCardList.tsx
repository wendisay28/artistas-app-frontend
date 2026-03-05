// ArtistCardList.tsx — Card de lista para artistas en Favoritos (v3 — todo en uno)

import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import type { Artist } from '../../../../types/explore';

// ─── Helper ──────────────────────────────────────────────────────────────────
const formatPrice = (price: number) =>
  price.toLocaleString('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0,
  });

// ─── Props ───────────────────────────────────────────────────────────────────
interface ArtistCardListProps {
  artist: Artist;
  onPress?: () => void;
  onToggleFavorite?: (id: string) => void;
}

// ─── Component ───────────────────────────────────────────────────────────────
export const ArtistCardList: React.FC<ArtistCardListProps> = ({
  artist,
  onPress,
  onToggleFavorite,
}) => {
  const [saved, setSaved] = useState(true);
  const isAvail = artist.availability === 'Disponible';

  const handleToggleFavorite = () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSaved(p => !p);
    onToggleFavorite?.(artist.id);
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [s.card, pressed && s.cardPressed]}
    >
      {/* ── IMAGEN ─────────────────────────────────────────────────────────── */}
      <View style={s.imageContainer}>
        <Image
          source={{ uri: artist.image }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={200}
        />

        {/* Gradiente inferior */}
        <LinearGradient
          colors={['transparent', 'rgba(30,27,75,0.72)']}
          style={s.imageGradient}
        />

        {/* Rating — arriba izquierda */}
        <View style={s.ratingBadge}>
          <Ionicons name="star" size={9} color="#fbbf24" />
          <Text style={s.ratingText}>{artist.rating}</Text>
        </View>

        {/* Corazón — arriba derecha */}
        <Pressable
          onPress={handleToggleFavorite}
          hitSlop={8}
          style={({ pressed }) => [s.heartBtn, pressed && s.heartBtnPressed]}
        >
          <Ionicons
            name={saved ? 'heart' : 'heart-outline'}
            size={15}
            color={saved ? '#ef4444' : 'rgba(255,255,255,0.75)'}
          />
        </Pressable>

        {/* Disponibilidad — abajo izquierda */}
        <View style={[s.availBadge, isAvail ? s.availBadgeGreen : s.availBadgeAmber]}>
          <View style={[s.availDot, { backgroundColor: isAvail ? '#10b981' : '#f59e0b' }]} />
          <Text style={[s.availText, { color: isAvail ? '#d1fae5' : '#fef3c7' }]}>
            {isAvail ? 'Disponible' : 'Ocupado'}
          </Text>
        </View>
      </View>

      {/* ── INFO (panel derecho) ────────────────────────────────────────────── */}
      <View style={s.info}>

        {/* Nombre + verificado */}
        <View style={s.nameRow}>
          <Text style={s.name} numberOfLines={1}>{artist.name}</Text>
          {artist.verified && (
            <LinearGradient
              colors={['#7c3aed', '#2563eb']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={s.verifiedBadge}
            >
              <Ionicons name="checkmark" size={8} color="#fff" />
            </LinearGradient>
          )}
        </View>

        {/* Categoría pill */}
        <View style={s.categoryPill}>
          <Text style={s.categoryText} numberOfLines={1}>{artist.category}</Text>
        </View>

        {/* Ubicación · distancia */}
        <View style={s.metaRow}>
          <Ionicons name="location-outline" size={11} color="#7c3aed" />
          <Text style={s.metaText} numberOfLines={1}>
            {artist.location}{artist.distance ? ` · ${artist.distance}` : ''}
          </Text>
        </View>

        {/* Experiencia */}
        {artist.experience && (
          <View style={s.metaRow}>
            <Ionicons name="briefcase-outline" size={11} color="#7c3aed" />
            <Text style={s.metaText} numberOfLines={1}>{artist.experience} exp.</Text>
          </View>
        )}

        {/* Divisor */}
        <View style={s.divider} />

        {/* Footer: precio + botón */}
        <View style={s.footer}>
          <View style={s.priceBlock}>
            <Text style={s.priceLabel}>Desde</Text>
            <View style={s.priceRow}>
              <Text style={s.price}>{formatPrice(artist.price)}</Text>
              <Text style={s.priceUnit}>/h</Text>
            </View>
          </View>

          <Pressable
            onPress={onPress}
            style={({ pressed }) => [s.ctaBtn, pressed && s.ctaBtnPressed]}
          >
            <LinearGradient
              colors={['#7c3aed', '#2563eb']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={s.ctaGradient}
            >
              <Text style={s.ctaText}>Ver perfil</Text>
              <Ionicons name="chevron-forward" size={13} color="#fff" />
            </LinearGradient>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
};

// ─── Styles ──────────────────────────────────────────────────────────────────
const s = StyleSheet.create({

  /* ── Card wrapper ── */
  card: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.88)',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(167,139,250,0.35)',
    marginHorizontal: 16,
    marginVertical: 7,
    overflow: 'hidden',
    shadowColor: '#5b21b6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.13,
    shadowRadius: 18,
    elevation: 5,
  },
  cardPressed: {
    opacity: 0.96,
    transform: [{ scale: 0.987 }],
    shadowOpacity: 0.07,
  },

  /* ── Imagen ── */
  imageContainer: {
    width: 112,
    alignSelf: 'stretch',         // se estira al alto real del contenido
    overflow: 'hidden',
    borderTopLeftRadius: 28,
    borderBottomLeftRadius: 28,
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 56,
  },
  ratingBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 20,
  },
  ratingText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 10,
    color: '#fff',
  },
  heartBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.38)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartBtnPressed: {
    opacity: 0.6,
  },
  availBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 20,
  },
  availBadgeGreen: { backgroundColor: 'rgba(16,185,129,0.28)' },
  availBadgeAmber: { backgroundColor: 'rgba(245,158,11,0.28)' },
  availDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  availText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 9,
  },

  /* ── Info panel ── */
  info: {
    flex: 1,
    minWidth: 0,                  // KEY: evita overflow en flex children
    paddingTop: 13,
    paddingBottom: 12,
    paddingHorizontal: 13,
    overflow: 'hidden',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 4,
    minWidth: 0,
  },
  name: {
    flex: 1,                      // KEY: shrink correcto con numberOfLines
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 14,
    color: '#1e1b4b',
    lineHeight: 18,
  },
  verifiedBadge: {
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  categoryPill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(124,58,237,0.09)',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginBottom: 6,
    maxWidth: '100%',
  },
  categoryText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 10,
    color: '#7c3aed',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 3,
    minWidth: 0,
  },
  metaText: {
    flex: 1,
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 11,
    color: '#6d28d9',
    lineHeight: 15,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(167,139,250,0.22)',
    marginVertical: 9,
  },

  /* ── Footer ── */
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceBlock: {
    flexShrink: 1,
    marginRight: 8,
  },
  priceLabel: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 9,
    color: '#9ca3af',
    lineHeight: 12,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 1,
  },
  price: {
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 15,
    color: '#1e1b4b',
    lineHeight: 19,
  },
  priceUnit: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 10,
    color: '#6d28d9',
    lineHeight: 19,
  },
  ctaBtn: {
    borderRadius: 14,
    overflow: 'hidden',
    flexShrink: 0,
  },
  ctaBtnPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.96 }],
  },
  ctaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  ctaText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 11,
    color: '#fff',
  },
});