// ─────────────────────────────────────────────────────────────────────────────
// VenueCardContent.tsx — Versión adaptada de EventCardContent
// - Imagen 60% + Panel 40% con misma estructura
// - Título, meta, descripción, tags, anuncio, CTA
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { colors } from '../../../constants/colors';
import type { Venue } from '../../../types/explore';

interface VenueCardContentProps {
  venue: Venue;
  distanceKm?: number;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const getCategoryMeta = (venue?: Venue): { icon: any; label: string } => {
  if (!venue) return { icon: 'business-outline', label: 'Sala' };
  const tags = venue.tags || [];
  if (tags.length === 0) return { icon: 'business-outline', label: 'Sala' };
  
  const t = tags[0].toLowerCase();
  if (t.includes('restaurante') || t.includes('comida')) return { icon: 'restaurant-outline', label: 'Restaurante' };
  if (t.includes('evento') || t.includes('fiesta')) return { icon: 'calendar-outline', label: 'Evento' };
  if (t.includes('oficina') || t.includes('trabajo')) return { icon: 'briefcase-outline', label: 'Oficina' };
  if (t.includes('deporte') || t.includes('gimnasio')) return { icon: 'barbell-outline', label: 'Deporte' };
  if (t.includes('tecnología') || t.includes('digital')) return { icon: 'laptop-outline', label: 'Tecnología' };
  if (t.includes('arte') || t.includes('galería')) return { icon: 'color-palette-outline', label: 'Arte' };
  if (t.includes('música') || t.includes('concierto')) return { icon: 'musical-notes-outline', label: 'Música' };
  return { icon: 'business-outline', label: tags[0] };
};

const getTagIcon = (tag: string): any => {
  const t = tag.toLowerCase();
  if (t.includes('restaurante') || t.includes('comida')) return 'restaurant-outline';
  if (t.includes('evento') || t.includes('fiesta')) return 'calendar-outline';
  if (t.includes('oficina') || t.includes('trabajo')) return 'briefcase-outline';
  if (t.includes('deporte') || t.includes('gimnasio')) return 'barbell-outline';
  if (t.includes('tecnología') || t.includes('digital')) return 'laptop-outline';
  if (t.includes('arte') || t.includes('galería')) return 'color-palette-outline';
  if (t.includes('música') || t.includes('concierto')) return 'musical-notes-outline';
  return 'pricetag-outline';
};

const formatCOP = (price: number) =>
  `$${price.toLocaleString('es-CO', { maximumFractionDigits: 0 })}`;

// ── Component ─────────────────────────────────────────────────────────────────

export default function VenueCardContent({ venue, distanceKm }: VenueCardContentProps) {
  const [liked, setLiked] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);
  const heartScale = useRef(new Animated.Value(1)).current;

  const images = [venue.image, ...(venue.gallery || [])].slice(0, 3);
  const cat = getCategoryMeta(venue);
  const isOpen = venue.availability === 'Disponible';

  const distLabel = distanceKm !== undefined
    ? (distanceKm < 1 ? `${Math.round(distanceKm * 1000)}m` : `${distanceKm.toFixed(1)}km`)
    : '2 km'; // Valor temporal para prueba

  const handleLike = () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.sequence([
      Animated.spring(heartScale, { toValue: 1.4, useNativeDriver: true, speed: 50, bounciness: 14 }),
      Animated.spring(heartScale, { toValue: 1,   useNativeDriver: true, speed: 30, bounciness: 4  }),
    ]).start();
    setLiked(p => !p);
  };

  const handleReserve = () => {
    if (Platform.OS !== 'web' && !isOpen)
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  return (
    <View style={styles.container}>

      {/* ══════════ IMAGEN 60% ══════════ */}
      <View style={styles.imageSection}>
        <Image
          source={{ uri: images[imgIdx] }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={250}
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.20)']}
          style={styles.imageGradient}
        />

        {/* Rating top-left */}
        <View style={styles.ratingPill}>
          <Ionicons name="star" size={11} color="#fbbf24" />
          <Text style={styles.ratingText}>{venue.rating}</Text>
          <Text style={styles.reviewsText}>({venue.reviews || 0})</Text>
        </View>

        {/* Categoría / cerrado top-right */}
        {!isOpen ? (
          <View style={styles.closedChip}>
            <Ionicons name="lock-closed" size={10} color="#fca5a5" />
            <Text style={styles.closedText}>CERRADO</Text>
          </View>
        ) : (
          <View style={styles.categoryChip}>
            <Ionicons name={cat.icon as any} size={11} color="#1f2937" />
            <Text style={styles.categoryText}>{cat.label}</Text>
          </View>
        )}

        {/* Dots centro abajo */}
        {images.length > 1 && (
          <View style={styles.dotsRow}>
            {images.map((_, i) => (
              <Pressable
                key={i}
                onPress={() => setImgIdx(i)}
                style={[styles.dot, i === imgIdx && styles.dotActive]}
              />
            ))}
          </View>
        )}

        {/* Corazón + compartir vertical derecha */}
        <View style={styles.sideActions}>
          <Pressable onPress={handleLike}>
            <Animated.View style={[
              styles.sideBtn,
              liked && styles.sideBtnLiked,
              { transform: [{ scale: heartScale }] },
            ]}>
              <Ionicons
                name={liked ? 'heart' : 'heart-outline'}
                size={20}
                color={liked ? '#f87171' : '#fff'}
              />
            </Animated.View>
          </Pressable>
          <Pressable style={({ pressed }) => [styles.sideBtn, pressed && { opacity: 0.7 }]}>
            <Ionicons name="share-social-outline" size={19} color="#fff" />
          </Pressable>
        </View>
      </View>

      {/* ══════════ PANEL BLANCO 40% ══════════ */}
      <View style={styles.panel}>

        {/* Bloque de texto — sin flex:1, ocupa solo su contenido */}
        <View style={styles.topBlock}>

          {/* Título — grande */}
          <Text style={styles.name} numberOfLines={1}>{venue.name}</Text>

          {/* Meta — UNA sola línea horizontal, fuente pequeña */}
          <View style={styles.metaRow}>
            <Ionicons name="time-outline" size={11} color={colors.primary} />
            <Text style={styles.metaText} numberOfLines={1}>
              {isOpen ? 'Abierto ahora' : 'Cerrado temporalmente'}
            </Text>
            <View style={styles.metaDot} />
            <Ionicons name="location-outline" size={11} color={colors.primary} />
            <Text style={[styles.metaText, { flexShrink: 1 }]} numberOfLines={1}>
              {venue.location}
            </Text>
            {distLabel && (
              <>
                <Text style={styles.metaText}> . </Text>
                <Text style={styles.metaDist} numberOfLines={1}>{distLabel}</Text>
              </>
            )}
          </View>

          {/* Descripción — tamaño visible */}
          {venue.bio && (
            <Text style={styles.description} numberOfLines={3}>
              {venue.bio}
            </Text>
          )}

          {/* Tags — tamaño visible */}
          {venue.tags && venue.tags.length > 0 && (
            <View style={styles.tagsRow}>
              {venue.tags.slice(0, 3).map((tag, i) => (
                <View key={i} style={styles.tag}>
                  <Ionicons name={getTagIcon(tag)} size={10} color={colors.primary} />
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Anuncio de disponibilidad */}
          <View style={styles.announcementContainer}>
            <Ionicons name="time-outline" size={12} color="#f59e0b" />
            <Text style={styles.announcementText}>
              {isOpen ? '⚡ Reserva ahora' : '🔒 Abre pronto'}
            </Text>
          </View>
        </View>

        {/* Línea divisoria — va justo después del bloque de texto */}
        <View style={styles.divider} />

        {/* CTA */}
        <Pressable
          disabled={!isOpen}
          onPress={handleReserve}
          style={({ pressed }) => [
            styles.cta,
            !isOpen ? styles.ctaSoldOut : styles.ctaActive,
            !isOpen && pressed && { opacity: 0.88, transform: [{ scale: 0.985 }] },
          ]}
        >
          <View style={[styles.ctaLeft, !isOpen && styles.ctaLeftSoldOut]}>
            <Text style={[styles.ctaPrice, !isOpen && styles.ctaPriceSoldOut]}>
              {isOpen ? formatCOP(venue.price) : 'No disponible'}
            </Text>
          </View>
          <View style={styles.ctaSep} />
          <View style={styles.ctaRight}>
            <Ionicons
              name={!isOpen ? 'lock-closed-outline' : 'calendar-outline'}
              size={14}
              color={!isOpen ? 'rgba(255,255,255,0.35)' : '#fff'}
            />
            <Text style={[styles.ctaLabel, !isOpen && styles.ctaLabelSoldOut]}>
              {isOpen ? 'Reservar' : 'No disponible'}
            </Text>
            {isOpen && (
              <Ionicons name="arrow-forward" size={14} color="rgba(255,255,255,0.75)" />
            )}
          </View>
        </Pressable>

      </View>
    </View>
  );
}
          // ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },

  // imagen
  imageSection: {
    height: '60%',
    backgroundColor: '#e5e7eb',
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    height: '45%',
  },

  // rating
  ratingPill: {
    position: 'absolute',
    top: 12, left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.48)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  ratingText:  { fontSize: 12, fontFamily: 'PlusJakartaSans_700Bold', color: '#fbbf24' },
  reviewsText: { fontSize: 10, fontFamily: 'PlusJakartaSans_400Regular', color: 'rgba(255,255,255,0.55)' },

  // categoría top-right
  categoryChip: {
    position: 'absolute',
    top: 12, right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  categoryText: { 
    fontSize: 11, 
    fontFamily: 'PlusJakartaSans_700Bold', 
    color: '#1f2937',
    textShadowColor: 'rgba(255,255,255,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  // cerrado top-right
  closedChip: {
    position: 'absolute',
    top: 12, right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(239,68,68,0.88)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  closedText: { fontSize: 11, fontFamily: 'PlusJakartaSans_700Bold', color: '#fff', letterSpacing: 0.8 },

  // dots
  dotsRow: {
    position: 'absolute',
    bottom: 12, left: 0, right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
  },
  dot:       { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.45)' },
  dotActive: { width: 18, backgroundColor: '#fff' },

  // acciones verticales derecha
  sideActions: {
    position: 'absolute',
    right: 12,
    bottom: 36,
    flexDirection: 'column',
    gap: 10,
    alignItems: 'center',
  },
  sideBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: 'rgba(0,0,0,0.42)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
  },
  sideBtnLiked: {
    backgroundColor: 'rgba(248,113,113,0.22)',
    borderColor: 'rgba(248,113,113,0.45)',
  },

  // ── panel blanco ──────────────────────────────────────────────────────────────────
  panel: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },

  topBlock: {
    gap: 6,
    flex: 1,
  },

  // título — grande y visible
  name: {
    fontSize: 19,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#0f0f0f',
    lineHeight: 24,
    letterSpacing: -0.4,
  },

  // meta — UNA línea, fuente pequeña
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    flexWrap: 'nowrap',
    overflow: 'hidden',
  },
  metaText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#71717a',
    flexShrink: 1,
  },
  metaDot: {
    width: 2.5, height: 2.5,
    borderRadius: 1.5,
    backgroundColor: '#d4d4d8',
    marginHorizontal: 2,
  },
  metaDist: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: colors.primary,
    flexShrink: 0,
  },

  // descripción — visible
  description: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#71717a',
    lineHeight: 17,
  },

  // tags — visibles
  tagsRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'nowrap',
    overflow: 'hidden',
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primary + '12',
    borderWidth: 1,
    borderColor: colors.primary + '30',
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  tagText: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: colors.primary,
  },

  // anuncio de disponibilidad
  announcementContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 2,
    paddingVertical: 2,
  },
  announcementText: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#d97706',
    letterSpacing: 0.2,
  },

  // línea divisoria — separa contenido del CTA sin espacio muerto
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginTop: 8,
    marginBottom: 6,
  },

  // CTA
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
  },
  ctaActive:  { backgroundColor: colors.primary, borderColor: colors.primary + '55' },
  ctaSoldOut: { backgroundColor: 'rgba(0,0,0,0.05)', borderColor: 'rgba(0,0,0,0.08)' },

  ctaLeft: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(0,0,0,0.18)',
  },
  ctaLeftSoldOut: { backgroundColor: 'transparent' },
  ctaPrice:       { fontSize: 14, fontFamily: 'PlusJakartaSans_700Bold', color: '#fff', letterSpacing: -0.2 },
  ctaPriceSoldOut:{ color: 'rgba(0,0,0,0.3)' },

  ctaSep: { width: 1, alignSelf: 'stretch', backgroundColor: 'rgba(255,255,255,0.2)' },

  ctaRight: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
  },
  ctaLabel:       { fontSize: 14, fontFamily: 'PlusJakartaSans_700Bold', color: '#fff', letterSpacing: 0.1 },
  ctaLabelSoldOut:{ color: 'rgba(0,0,0,0.3)' },
});