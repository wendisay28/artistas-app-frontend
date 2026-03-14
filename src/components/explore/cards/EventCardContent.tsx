// ─────────────────────────────────────────────────────────────────────────────
// EventCardContent.v5.tsx — Versión final
// - Título grande visible
// - Meta fecha+ciudad en UNA sola línea horizontal compacta (fontSize 10)
// - Descripción y tags tamaño visible (12/11)
// - Sin espacio blanco muerto: panel usa flexColumn, CTA pegado abajo
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
  Animated,
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useVideoPlayer, VideoView } from 'expo-video';
import { colors } from '../../../constants/colors';
import type { Event } from '../../../types/explore';
import { useFavoritesStore } from '../../../store/favoritesStore';
import VideoUploadModal, { type VideoUploadResult } from '../shared/VideoUploadModal';

type MediaItem = { type: 'image'; uri: string } | { type: 'video'; uri: string; startTime: number };

interface EventCardContentProps {
  event: Event;
  distanceKm?: number;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const getCategoryMeta = (tags?: string[]): { icon: any; label: string } => {
  if (!tags || tags.length === 0) return { icon: 'calendar-outline', label: 'Evento' };
  const t = tags[0].toLowerCase();
  if (t.includes('concierto') || t.includes('música') || t.includes('jazz') || t.includes('band'))
    return { icon: 'musical-notes-outline', label: tags[0] };
  if (t.includes('cerámica') || t.includes('taller') || t.includes('pintura') || t.includes('arte'))
    return { icon: 'color-palette-outline', label: tags[0] };
  if (t.includes('cine') || t.includes('película'))
    return { icon: 'film-outline', label: tags[0] };
  if (t.includes('teatro'))
    return { icon: 'ticket-outline', label: tags[0] };
  if (t.includes('foto'))
    return { icon: 'camera-outline', label: tags[0] };
  if (t.includes('tecnología') || t.includes('digital'))
    return { icon: 'code-slash-outline', label: tags[0] };
  if (t.includes('deporte') || t.includes('yoga') || t.includes('fitness'))
    return { icon: 'barbell-outline', label: tags[0] };
  if (t.includes('gastronomía') || t.includes('cocina'))
    return { icon: 'restaurant-outline', label: tags[0] };
  return { icon: 'calendar-outline', label: tags[0] };
};

const getTagIcon = (tag: string): any => {
  const t = tag.toLowerCase();
  if (t.includes('concierto') || t.includes('música') || t.includes('jazz') || t.includes('band')) return 'musical-notes-outline';
  if (t.includes('cerámica') || t.includes('ceramica') || t.includes('artesanal')) return 'color-palette-outline';
  if (t.includes('taller') || t.includes('workshop')) return 'construct-outline';
  if (t.includes('pintura') || t.includes('arte') || t.includes('galería')) return 'color-palette-outline';
  if (t.includes('cine') || t.includes('película')) return 'film-outline';
  if (t.includes('teatro') || t.includes('clásico')) return 'ticket-outline';
  if (t.includes('foto')) return 'camera-outline';
  if (t.includes('tecnología') || t.includes('digital')) return 'code-slash-outline';
  if (t.includes('gratis') || t.includes('gratuito')) return 'gift-outline';
  if (t.includes('deporte') || t.includes('yoga') || t.includes('fitness')) return 'barbell-outline';
  if (t.includes('gastronomía') || t.includes('cocina')) return 'restaurant-outline';
  return 'pricetag-outline';
};

const formatCOP = (price: number) =>
  `$${price.toLocaleString('es-CO', { maximumFractionDigits: 0 })}`;

// ── Component ─────────────────────────────────────────────────────────────────

export default function EventCardContent({ event, distanceKm }: EventCardContentProps) {
  const [liked,  setLiked]  = useState(false);
  const [imgIdx, setImgIdx] = useState(0);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [cardVideo, setCardVideo] = useState<{ uri: string; startTime: number } | null>(null);
  const { addFavorite, removeFavorite, isFavorited } = useFavoritesStore();
  const isSaved = isFavorited(event.id);
  const heartScale = useRef(new Animated.Value(1)).current;

  const videoPlayer = useVideoPlayer(cardVideo?.uri ?? '', (p) => { p.loop = true; });

  const baseImages = [event.image, ...(event.gallery || []).slice(0, 2)];
  const media: MediaItem[] = [
    ...(cardVideo ? [{ type: 'video' as const, uri: cardVideo.uri, startTime: cardVideo.startTime }] : []),
    ...baseImages.map(uri => ({ type: 'image' as const, uri })),
  ];
  const images = baseImages; // alias

  useEffect(() => {
    if (!cardVideo) return;
    const current = media[imgIdx];
    try {
      if (current?.type === 'video') { videoPlayer.currentTime = current.startTime; videoPlayer.play(); }
      else { videoPlayer.pause(); }
    } catch {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imgIdx, cardVideo]);
  const isFree  = event.price === 0;
  const soldOut = event.ticketsLeft !== undefined && event.ticketsLeft === 0;
  const cat     = getCategoryMeta(event.tags);

  const handleLike = () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.sequence([
      Animated.spring(heartScale, { toValue: 1.4, useNativeDriver: true, speed: 50, bounciness: 14 }),
      Animated.spring(heartScale, { toValue: 1,   useNativeDriver: true, speed: 30, bounciness: 4  }),
    ]).start();
    setLiked(p => !p);
  };

  const handleReserve = () => {
    if (Platform.OS !== 'web' && !soldOut)
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const distLabel = distanceKm !== undefined
    ? (distanceKm < 1 ? `${Math.round(distanceKm * 1000)}m` : `${distanceKm.toFixed(1)}km`)
    : '5 km'; // Valor temporal para prueba - eliminar cuando se pase la prop real

  return (
    <>
    <View style={styles.container}>

      {/* ══════════ IMAGEN / VIDEO 66% ══════════ */}
      <View style={styles.imageSection}>
        {(() => {
          const current = media[imgIdx];
          if (current?.type === 'video') {
            return (
              <VideoView player={videoPlayer} style={StyleSheet.absoluteFill} contentFit="cover" nativeControls={false} />
            );
          }
          const uri = current?.uri ?? images[imgIdx];
          return uri ? <Image source={{ uri }} style={StyleSheet.absoluteFill} contentFit="cover" transition={250} /> : null;
        })()}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.20)']}
          style={styles.imageGradient}
        />

        {/* Categoría top-left */}
        <View style={styles.categoryChip}>
          <Ionicons name={cat.icon as any} size={9} color="#1f2937" />
          <Text style={styles.categoryText}>{cat.label}</Text>
        </View>

        {/* Precio / soldOut top-right */}
        {soldOut ? (
          <View style={styles.soldOutChip}>
            <Ionicons name="lock-closed" size={10} color="#fca5a5" />
            <Text style={styles.soldOutText}>AGOTADO</Text>
          </View>
        ) : (
          <View style={styles.pricePill}>
            <Text style={styles.pricePillText}>
              {isFree ? 'Gratis' : `desde ${formatCOP(event.price)}`}
            </Text>
          </View>
        )}

        {/* Dots centro abajo */}
        {media.length > 1 && (
          <View style={styles.dotsRow}>
            {media.map((item, i) => (
              <Pressable key={i} onPress={() => setImgIdx(i)} style={[styles.dot, i === imgIdx && styles.dotActive]}>
                {item.type === 'video' && (
                  <View style={{ alignSelf: 'center', marginTop: 1 }}>
                    <Ionicons name="videocam" size={5} color="#fff" />
                  </View>
                )}
              </Pressable>
            ))}
          </View>
        )}

        {/* Acciones verticales derecha */}
        <View style={styles.sideActions}>
          {/* Me gusta */}
          <Pressable onPress={handleLike}>
            <Animated.View style={[
              styles.sideBtn,
              liked && styles.sideBtnLiked,
              { transform: [{ scale: heartScale }] },
            ]}>
              <Ionicons name={liked ? 'heart' : 'heart-outline'} size={20} color='#fff' />
            </Animated.View>
          </Pressable>

          {/* Guardar en favoritos */}
          <Pressable
            style={[styles.sideBtn, isSaved && styles.sideBtnSaved]}
            onPress={() => {
              if (Platform.OS !== 'web') Haptics.selectionAsync();
              isSaved ? removeFavorite(event.id) : addFavorite(event);
            }}
          >
            <Ionicons name={isSaved ? 'bookmark' : 'bookmark-outline'} size={20} color='#fff' />
          </Pressable>

          {/* Compartir */}
          <Pressable
            style={({ pressed }) => [styles.sideBtn, pressed && { opacity: 0.7 }]}
            onPress={() => Share.share({ title: event.name, message: `${event.name} — ${event.city ?? ''}\n${event.description ?? ''}` })}
          >
            <Ionicons name="share-social-outline" size={19} color="#fff" />
          </Pressable>

          {/* Subir video */}
          <Pressable
            style={[styles.sideBtn, cardVideo ? styles.sideBtnVideo : undefined]}
            onPress={() => {
              if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setShowVideoModal(true);
            }}
          >
            <Ionicons name={cardVideo ? 'videocam' : 'videocam-outline'} size={20} color="#fff" />
          </Pressable>
        </View>
      </View>

      {/* ══════════ PANEL BLANCO 40% ══════════ */}
      {/* flexDirection column: topBlock ocupa lo que necesita,
          divider + CTA van pegados al fondo naturalmente */}
      <View style={styles.panel}>

        {/* Bloque de texto — sin flex:1, ocupa solo su contenido */}
        <View style={styles.topBlock}>

          {/* Título — grande */}
          <Text style={styles.name} numberOfLines={1}>{event.name}</Text>

          {/* Meta — UNA sola línea horizontal, fuente pequeña */}
          <View style={styles.metaRow}>
            <Ionicons name="calendar-outline" size={11} color={colors.primary} />
            <Text style={styles.metaText} numberOfLines={1}>
              {event.date}{event.time ? ` · ${event.time}` : ''}
            </Text>
            <View style={styles.metaDot} />
            <Ionicons name="location-outline" size={11} color={colors.primary} />
            <Text style={[styles.metaText, { flexShrink: 1 }]} numberOfLines={1}>
              {event.city ?? event.venue}
            </Text>
            {distLabel && (
              <>
                <Text style={styles.metaText}> . </Text>
                <Text style={styles.metaDist} numberOfLines={1}>{distLabel}</Text>
              </>
            )}
          </View>

          {/* Descripción — tamaño visible */}
          {event.description ? (
            <Text style={styles.description} numberOfLines={3}>
              {event.description}
            </Text>
          ) : null}

          {/* Tags — tamaño visible */}
          {event.tags && event.tags.length > 0 && (
            <View style={styles.tagsRow}>
              {event.tags.slice(0, 3).map((tag, i) => (
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
            <Text style={styles.announcementText}>⚡ Últimas 6 entradas disponibles</Text>
          </View>
        </View>

        {/* Línea divisoria — va justo después del bloque de texto */}
        <View style={styles.divider} />

        {/* CTA */}
        <Pressable
          disabled={soldOut}
          onPress={handleReserve}
          style={({ pressed }) => [
            styles.cta,
            soldOut ? styles.ctaSoldOut : styles.ctaActive,
            !soldOut && pressed && { opacity: 0.88, transform: [{ scale: 0.985 }] },
          ]}
        >
          <View style={styles.ctaRight}>
            <Ionicons
              name={soldOut ? 'lock-closed-outline' : isFree ? 'gift-outline' : 'ticket-outline'}
              size={14}
              color={soldOut ? 'rgba(255,255,255,0.35)' : '#fff'}
            />
            <Text style={[styles.ctaLabel, soldOut && styles.ctaLabelSoldOut]}>
              {soldOut ? 'Agotado' : 'Reservar ahora'}
            </Text>
            {!soldOut && (
              <Ionicons name="arrow-forward" size={14} color="rgba(255,255,255,0.75)" />
            )}
          </View>
        </Pressable>

      </View>
    </View>

    <VideoUploadModal
      visible={showVideoModal}
      onClose={() => setShowVideoModal(false)}
      onUploaded={(result: VideoUploadResult) => {
        setCardVideo(result);
        setImgIdx(0);
      }}
    />
    </>
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
    height: '65%',
    backgroundColor: '#e5e7eb',
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    height: '45%',
  },

  // categoría top-left
  categoryChip: {
    position: 'absolute',
    top: 10, left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.88)',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  categoryText: { fontSize: 9, fontFamily: 'PlusJakartaSans_700Bold', color: '#1f2937' },

  // precio top-right
  pricePill: {
    position: 'absolute',
    top: 10, right: 10,
    backgroundColor: colors.primary,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  pricePillText: { fontSize: 11, fontFamily: 'PlusJakartaSans_700Bold', color: '#fff', letterSpacing: -0.2 },

  // sold out top-right
  soldOutChip: {
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
  soldOutText: { fontSize: 11, fontFamily: 'PlusJakartaSans_700Bold', color: '#fff', letterSpacing: 0.8 },

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
    zIndex: 20,
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
  sideBtnSaved: {
    backgroundColor: 'rgba(167,139,250,0.22)',
    borderColor: 'rgba(167,139,250,0.45)',
  },
  sideBtnVideo: {
    backgroundColor: 'rgba(124,58,237,0.45)',
    borderColor: 'rgba(124,58,237,0.7)',
  },

  // ── panel blanco ──────────────────────────────────────────────────────────
  // Contenido flexible que se ajusta sin dejar espacio vacío
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

  name: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#0f0f0f',
    lineHeight: 20,
    letterSpacing: -0.4,
    flexShrink: 1,
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

  // descripción
  description: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#71717a',
    lineHeight: 15,
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
    fontSize: 9,
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

  ctaRight: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  ctaLabel:       { fontSize: 12, fontFamily: 'PlusJakartaSans_700Bold', color: '#fff', letterSpacing: 0.1 },
  ctaLabelSoldOut:{ color: 'rgba(0,0,0,0.3)' },
});