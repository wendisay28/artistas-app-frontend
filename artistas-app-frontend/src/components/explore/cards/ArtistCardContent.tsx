// ─────────────────────────────────────────────────────────────────────────────
// ArtistCardContent.tsx — Versión adaptada de EventCardContent
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
import type { Artist } from '../../../types/explore';


interface ArtistCardContentProps {
  artist: Artist;
  distanceKm?: number;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const getArtistSpecialty = (artist: Artist): string => {
  // Usar la categoría y estilo del artista para determinar la especialidad
  if (artist.category && artist.style) {
    return `${artist.category} - ${artist.style}`;
  }
  return artist.category || artist.style || 'Artista Visual';
};

const getCategoryMeta = (category?: string): { icon: any; label: string } => {
  if (!category) return { icon: 'person-outline', label: 'Artista' };
  const cat = category.toLowerCase();
  if (cat.includes('fotógrafo') || cat.includes('fotografía')) return { icon: 'camera-outline', label: 'Fotografía' };
  if (cat.includes('músico') || cat.includes('música')) return { icon: 'musical-notes-outline', label: 'Música' };
  if (cat.includes('artista') || cat.includes('arte')) return { icon: 'color-palette-outline', label: 'Arte' };
  if (cat.includes('diseñador')) return { icon: 'brush-outline', label: 'Diseño' };
  if (cat.includes('video') || cat.includes('audiovisual')) return { icon: 'videocam-outline', label: 'Video' };
  return { icon: 'person-outline', label: category };
};

const getTagIcon = (tag: string): any => {
  const t = tag.toLowerCase();
  if (t.includes('retratos') || t.includes('foto')) return 'camera-outline';
  if (t.includes('música') || t.includes('concierto')) return 'musical-notes-outline';
  if (t.includes('arte') || t.includes('pintura')) return 'color-palette-outline';
  if (t.includes('diseño')) return 'brush-outline';
  return 'pricetag-outline';
};

const formatCOP = (price: number) =>
  `$${price.toLocaleString('es-CO', { maximumFractionDigits: 0 })}`;

// ── Component ─────────────────────────────────────────────────────────────────

export default function ArtistCardContent({ artist, distanceKm }: ArtistCardContentProps) {
  const [liked, setLiked] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);
  const heartScale = useRef(new Animated.Value(1)).current;

  const images = [artist.image, ...(artist.gallery || [])].slice(0, 3);
  const cat = getCategoryMeta(artist.category);
  const specialty = getArtistSpecialty(artist);

  const distLabel = distanceKm !== undefined
    ? (distanceKm < 1 ? `${Math.round(distanceKm * 1000)}m` : `${distanceKm.toFixed(1)}km`)
    : '3 km'; // Valor temporal para prueba

  const handleLike = () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.sequence([
      Animated.spring(heartScale, { toValue: 1.4, useNativeDriver: true, speed: 50, bounciness: 14 }),
      Animated.spring(heartScale, { toValue: 1,   useNativeDriver: true, speed: 30, bounciness: 4  }),
    ]).start();
    setLiked(p => !p);
  };

  const handleContact = () => {
    if (Platform.OS !== 'web')
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
          <Text style={styles.ratingText}>{artist.rating}</Text>
          <Text style={styles.reviewsText}>({artist.reviews || 0})</Text>
        </View>

        {/* Categoría top-right */}
        <View style={styles.categoryChip}>
          <Ionicons name={cat.icon as any} size={11} color="#1f2937" />
          <Text style={styles.categoryText}>{cat.label}</Text>
        </View>

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

        {/* Especialidad en parte inferior izquierda con efecto espejo */}
        <View style={styles.specialtyContainer}>
          <LinearGradient
            colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.4)', 'transparent']}
            style={styles.specialtyGradient}
            start={{ x: 0, y: 1 }}
            end={{ x: 0, y: 0 }}
          />
          <Text style={styles.specialtyText}>{specialty}</Text>
        </View>
      </View>

      {/* ══════════ PANEL BLANCO 40% ══════════ */}
      <View style={styles.panel}>

        {/* Bloque de texto — sin flex:1, ocupa solo su contenido */}
        <View style={styles.topBlock}>

          {/* Título — grande */}
          <Text style={styles.name} numberOfLines={1}>{artist.name}</Text>

          {/* Meta — UNA sola línea horizontal, fuente pequeña */}
          <View style={styles.metaRow}>
            <Ionicons name="time-outline" size={11} color={colors.primary} />
            <Text style={styles.metaText} numberOfLines={1}>
              {artist.responseTime || 'Lun a Vie 9-18'}
            </Text>
            <View style={styles.metaDot} />
            <Ionicons name="location-outline" size={11} color={colors.primary} />
            <Text style={[styles.metaText, { flexShrink: 1 }]} numberOfLines={1}>
              {artist.location || 'Monterrey'}
            </Text>
            {distLabel && (
              <>
                <Text style={styles.metaText}> . </Text>
                <Text style={styles.metaDist} numberOfLines={1}>{distLabel}</Text>
              </>
            )}
          </View>

          {/* Descripción — tamaño visible */}
          {artist.bio && (
            <Text style={styles.description} numberOfLines={3}>
              {artist.bio}
            </Text>
          )}

          {/* Tags — tamaño visible */}
          {artist.tags && artist.tags.length > 0 && (
            <View style={styles.tagsRow}>
              {artist.tags.slice(0, 3).map((tag, i) => (
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
            <Text style={styles.announcementText}>⚡ Disponible esta semana</Text>
          </View>
        </View>

        {/* Línea divisoria — va justo después del bloque de texto */}
        <View style={styles.divider} />

        {/* CTA */}
        <Pressable
          onPress={handleContact}
          style={({ pressed }) => [
            styles.cta,
            styles.ctaActive,
            pressed && { opacity: 0.88, transform: [{ scale: 0.985 }] },
          ]}
        >
          <View style={styles.ctaLeft}>
            <Text style={styles.ctaPrice}>
              {artist.price ? formatCOP(artist.price) : 'Consultar'}
            </Text>
          </View>
          <View style={styles.ctaSep} />
          <View style={styles.ctaRight}>
            <Ionicons name="chatbubble-outline" size={14} color="#fff" />
            <Text style={styles.ctaLabel}>Contactar</Text>
            <Ionicons name="arrow-forward" size={14} color="rgba(255,255,255,0.75)" />
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

  // especialidad con efecto espejo en parte inferior izquierda
  specialtyContainer: {
    position: 'absolute',
    bottom: 0, left: 0,
    alignItems: 'flex-start',
  },
  specialtyGradient: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    height: 80,
  },
  specialtyText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    position: 'relative',
    zIndex: 1,
  },

  // ── panel blanco ──────────────────────────────────────────────────────────
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

  ctaLeft: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(0,0,0,0.18)',
  },
  ctaPrice:       { fontSize: 14, fontFamily: 'PlusJakartaSans_700Bold', color: '#fff', letterSpacing: -0.2 },

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
});