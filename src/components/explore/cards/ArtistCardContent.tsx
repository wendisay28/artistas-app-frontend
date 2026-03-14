// ─────────────────────────────────────────────────────────────────────────────
// ArtistCardContent.tsx — Versión adaptada con BlurView (Glassmorphism real)
// - Imagen 60% + Panel 40% con misma estructura
// - Título, meta, descripción, tags, anuncio, CTA
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
import HireModal from '../../modals/HireModal';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useVideoPlayer, VideoView } from 'expo-video';
import { BlurView } from 'expo-blur'; // ← Importación añadida
import { colors } from '../../../constants/colors';
import type { Artist, ArtistCategorySelection } from '../../../types/explore';
import { portfolioService } from '../../../services/api/portfolio';
import { artistsService } from '../../../services/api/artists';
import { servicesService, type Service } from '../../../services/api/services';
import { useProfileStore } from '../../../store/profileStore';
import { useFavoritesStore } from '../../../store/favoritesStore';
import VideoUploadModal, { type VideoUploadResult } from '../shared/VideoUploadModal';
import { useThemeStore } from '../../../store/themeStore';

type MediaItem = { type: 'image'; uri: string } | { type: 'video'; uri: string; startTime: number };

interface ArtistCardContentProps {
  artist: Artist;
  distanceKm?: number;
  isFollowing?: boolean;
  onFollow?: () => void;
}

// ── Disponibilidad ───────────────────────────────────────────────────────────

const AVAILABILITY_OPTS = [
  { label: 'Disponible',    color: '#16a34a', bg: 'rgba(22,163,74,0.08)',   border: 'rgba(22,163,74,0.22)',   dot: '#16a34a', pulse: true  },
  { label: 'Ocupado',       color: '#d97706', bg: 'rgba(217,119,6,0.08)',   border: 'rgba(217,119,6,0.22)',   dot: '#d97706', pulse: false },
  { label: 'Bajo pedido',   color: '#7c3aed', bg: 'rgba(124,58,237,0.08)', border: 'rgba(124,58,237,0.22)', dot: '#7c3aed', pulse: false },
] as const;

function getAvailOpt(label?: string) {
  return AVAILABILITY_OPTS.find(o => o.label === label) ?? AVAILABILITY_OPTS[0];
}

const getTagIcon = (tag: string): string => {
  const t = tag.toLowerCase();
  if (t.includes('foto') || t.includes('retrato'))                           return 'camera-outline';
  if (t.includes('música') || t.includes('musica') || t.includes('concierto')) return 'musical-notes-outline';
  if (t.includes('boda'))                                                    return 'heart-outline';
  if (t.includes('pintura') || t.includes('arte'))                           return 'color-palette-outline';
  if (t.includes('diseño'))                                                  return 'pencil-outline';
  if (t.includes('video') || t.includes('cine'))                             return 'videocam-outline';
  if (t.includes('event'))                                                   return 'calendar-outline';
  if (t.includes('digital'))                                                 return 'desktop-outline';
  if (t.includes('abstrac') || t.includes('ilustr'))                         return 'shapes-outline';
  if (t.includes('mural') || t.includes('graffiti'))                         return 'brush-outline';
  if (t.includes('baile') || t.includes('danza'))                            return 'body-outline';
  if (t.includes('teatro') || t.includes('actor'))                           return 'mic-outline';
  return 'pricetag-outline';
};

const getLowestPrice = (services: Service[]): number | null => {
  if (!services?.length) return null;
  const prices = services
    .map((s: any) => {
      const raw = s.price ?? s.pricePerHour ?? s.price_per_hour ??
        s.pricePerSession ?? s.price_per_session ?? s.basePrice ?? s.base_price;
      const n = typeof raw === 'string' ? parseFloat(raw) : Number(raw);
      return isNaN(n) || n <= 0 ? null : n;
    })
    .filter((p): p is number => p !== null);
  return prices.length > 0 ? Math.min(...prices) : null;
};

const formatCOP = (price: number) =>
  `$${price.toLocaleString('es-CO', { maximumFractionDigits: 0 })}`;

// ── Component ─────────────────────────────────────────────────────────────────

export default function ArtistCardContent({ artist, distanceKm, isFollowing = false, onFollow }: ArtistCardContentProps) {
  const { isDark } = useThemeStore();
  const [liked, setLiked] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);
  const [services, setServices] = useState<Service[]>([]);
  const [servicesLoaded, setServicesLoaded] = useState(false);
  const [showHireModal, setShowHireModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [cardVideo, setCardVideo] = useState<{ uri: string; startTime: number } | null>(null);
  const heartScale = useRef(new Animated.Value(1)).current;
  const [portfolioImages, setPortfolioImages] = useState<string[]>([]);
  const [, setSchedule] = useState<string>(artist.schedule || '');
  const { artistData } = useProfileStore();
  const { addFavorite, removeFavorite, isFavorited } = useFavoritesStore();
  const isSaved = isFavorited(artist.id);

  const videoPlayer = useVideoPlayer(cardVideo?.uri ?? '', (p) => {
    p.loop = true;
  });

  const availLabel = artist.info?.find(i => i.label === 'Disponibilidad')?.value || 
                     artist.availability || 
                     'Disponible';
  const avail = getAvailOpt(availLabel);

  useEffect(() => {
    const userId = artist.userId || artist.id;
    if (!userId) return;

    if (!artist.gallery || artist.gallery.length === 0) {
      portfolioService.getUserFeatured(String(userId))
        .then(featured => {
          const urls = (featured ?? []).map((p) => p.imageUrl).filter(Boolean) as string[];
          if (urls.length > 0) { setPortfolioImages(urls); return; }
          return portfolioService.getUserPortfolio(String(userId)).then(res => {
            const all = (res?.photos ?? []).map((p) => p.imageUrl).filter(Boolean) as string[];
            if (all.length > 0) setPortfolioImages(all);
          });
        })
        .catch(() => {});
    }

    if (!artist.schedule || artist.schedule.trim() === '') {
      if (artistData?.schedule && artistData.schedule.trim() !== '') {
        setSchedule(artistData.schedule);
        return;
      }
      artistsService.getArtistById(String(userId))
        .then((data: any) => {
          const s = data?.schedule || data?.user?.schedule || data?.artist?.schedule || '';
          if (s && s.trim() !== '') {
            setSchedule(s);
          }
        })
        .catch(() => {
          setSchedule('Disponible de Lunes a Sábado');
        });
    }
  }, [artist.id, artist.userId, artist.schedule, artistData]);

  useEffect(() => {
    const userId = artist.userId || artist.id;
    if (!userId) return;

    servicesService.getUserServices(String(userId))
      .then(res => { if (Array.isArray(res)) setServices(res); })
      .catch(() => {})
      .finally(() => setServicesLoaded(true));
  }, [artist.id, artist.userId]);

  const galleryUrls = artist.gallery && artist.gallery.length > 0
    ? artist.gallery
    : portfolioImages;

  const baseImages = galleryUrls.filter(Boolean).slice(0, 5);
  const media: MediaItem[] = [
    ...(cardVideo ? [{ type: 'video' as const, uri: cardVideo.uri, startTime: cardVideo.startTime }] : []),
    ...baseImages.map(uri => ({ type: 'image' as const, uri })),
  ];
  const images = baseImages;

  useEffect(() => {
    if (!cardVideo) return;
    const current = media[imgIdx];
    try {
      if (current?.type === 'video') {
        videoPlayer.currentTime = current.startTime;
        videoPlayer.play();
      } else {
        videoPlayer.pause();
      }
    } catch {}
  }, [imgIdx, cardVideo]);

  const distLabel = distanceKm !== undefined
    ? (distanceKm < 1 ? `${Math.round(distanceKm * 1000)}m` : `${distanceKm.toFixed(1)}km`)
    : '3 km';

  const handleContact = () => {
    if (Platform.OS !== 'web')
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowHireModal(true);
  };

  const lowestPrice = getLowestPrice(services);

  return (
    <>
    <View style={[styles.outerWrapper, isDark && styles.outerWrapperDark]}>
      {/* ══════════ CONTENEDOR BLUR (GLASSMORPHISM) ══════════ */}
      <BlurView 
        intensity={isDark ? 55 : 60} 
        tint={isDark ? 'systemChromeMaterialDark' : 'light'}
        renderToHardwareTextureAndroid={true} // Optimización clave para Android
        style={[styles.container, isDark && styles.containerDark]}
      >

        {/* ══════════ IMAGEN / VIDEO 70% ══════════ */}
        <View style={styles.imageSection}>
        {(() => {
          const current = media[imgIdx];
          if (current?.type === 'video') {
            return (
              <VideoView
                player={videoPlayer}
                style={StyleSheet.absoluteFill}
                contentFit="cover"
                nativeControls={false}
              />
            );
          }
          if (media.length > 0 || images.length > 0) {
            const uri = current?.uri ?? images[imgIdx];
            return uri ? (
              <Image
                source={{ uri }}
                style={StyleSheet.absoluteFill}
                contentFit="cover"
                transition={250}
                placeholder="https://via.placeholder.com/400x300/f3f0ff/7c3aed?text=Cargando..."
                placeholderContentFit="cover"
                cachePolicy="memory-disk"
                recyclingKey={artist.id}
                priority="high"
              />
            ) : null;
          }
          return (
            <View style={[StyleSheet.absoluteFill, styles.noImagePlaceholder]}>
              <Ionicons name="image-outline" size={40} color="rgba(124,58,237,0.2)" />
            </View>
          );
        })()}
        <LinearGradient
          colors={isDark
            ? ['transparent', 'rgba(10,6,24,0.4)', 'rgba(10,6,24,0.85)', '#0a0618']
            : ['transparent', 'transparent']
          }
          locations={isDark ? [0, 0.4, 0.7, 1] : [0, 1]}
          style={styles.imageGradient}
        />

        {/* Zonas de toque izq/der para pasar imagen */}
        {media.length > 1 && (
          <>
            <Pressable
              style={styles.navZoneLeft}
              onPress={() => setImgIdx(i => (i - 1 + media.length) % media.length)}
            />
            <Pressable
              style={styles.navZoneRight}
              onPress={() => setImgIdx(i => (i + 1) % media.length)}
            />
          </>
        )}

        {/* Precio top-right */}
        {(servicesLoaded && lowestPrice) ? (
          <View style={styles.pricePill}>
            <Text style={styles.pricePillText}>
              <Text style={styles.pricePillDesde}>desde </Text>
              {formatCOP(lowestPrice)}
            </Text>
          </View>
        ) : null}

        {/* Rol del artista top-right */}
        {(() => {
          const roleId =
            artist.artistCategory?.roleId ||
            (typeof artist.category === 'object' ? artist.category?.roleId : null);
          if (!roleId) return null;
          const label = roleId.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());
          return (
            <View style={[styles.categoryChip, isDark && styles.categoryChipDark]}>
              <Ionicons name="ribbon-outline" size={9} color={isDark ? '#fff' : '#1f2937'} />
              <Text style={[styles.categoryText, isDark && styles.categoryTextDark]}>{label}</Text>
            </View>
          );
        })()}

        {/* Dots de navegación */}
        {media.length > 1 && (
          <View style={styles.thumbsRow}>
            {media.map((item, i) => (
              <Pressable
                key={i}
                onPress={() => setImgIdx(i)}
                style={[styles.dot, i === imgIdx && styles.dotActive]}
              >
                {item.type === 'video' && (
                  <View style={{ alignSelf: 'center', marginTop: 1 }}>
                    <Ionicons name="videocam" size={5} color="#fff" />
                  </View>
                )}
              </Pressable>
            ))}
          </View>
        )}

        {/* ── Acciones verticales derecha ── */}
        <View style={styles.sideActions}>
          <Pressable
            style={[styles.sideBtn, liked && styles.sideBtnLiked]}
            onPress={() => {
              if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              Animated.sequence([
                Animated.spring(heartScale, { toValue: 1.4, useNativeDriver: true, speed: 40 }),
                Animated.spring(heartScale, { toValue: 1,   useNativeDriver: true, speed: 40 }),
              ]).start();
              setLiked(v => !v);
            }}
          >
            <Animated.View style={{ transform: [{ scale: heartScale }] }}>
              <Ionicons
                name={liked ? 'heart' : 'heart-outline'}
                size={20}
                color='#fff'
              />
            </Animated.View>
          </Pressable>

          <Pressable
            style={[styles.sideBtn, isSaved && styles.sideBtnSaved]}
            onPress={() => {
              if (Platform.OS !== 'web') Haptics.selectionAsync();
              isSaved ? removeFavorite(artist.id) : addFavorite(artist);
            }}
          >
            <Ionicons
              name={isSaved ? 'bookmark' : 'bookmark-outline'}
              size={20}
              color='#fff'
            />
          </Pressable>

          <Pressable
            style={styles.sideBtn}
            onPress={() => {
              Share.share({
                title: artist.name,
                message: `${artist.name} — artista en BuscArt\n${artist.bio ?? ''}`,
              });
            }}
          >
            <Ionicons name="share-social-outline" size={20} color="#fff" />
          </Pressable>

          <Pressable
            style={[styles.sideBtn, cardVideo ? styles.sideBtnVideo : undefined]}
            onPress={() => {
              if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setShowVideoModal(true);
            }}
          >
            <Ionicons
              name={cardVideo ? 'videocam' : 'videocam-outline'}
              size={20}
              color="#fff"
            />
          </Pressable>
        </View>
        </View>

        {/* ══════════ PANEL BLANCO 40% ══════════ */}
        <View style={[styles.panel, isDark && styles.panelDark]}>

          <View style={styles.topBlock}>
            {/* Nombre + verificado + seguir */}
            <View style={styles.titleRow}>
              <Text style={[styles.name, isDark && styles.nameDark]} numberOfLines={1}>{artist.name}</Text>
              {artist.verified === true && (
                <View style={styles.verifiedBadge}>
                  <Ionicons name="checkmark" size={9} color="#fff" />
                </View>
              )}
              <Pressable
                onPress={onFollow}
                style={[styles.followBtn, isFollowing && styles.followBtnActive]}
              >
                <Ionicons
                  name={isFollowing ? 'checkmark' : 'person-add-outline'}
                  size={11}
                  color={isFollowing ? '#fff' : '#7c3aed'}
                />
                <Text style={[styles.followBtnText, isFollowing && styles.followBtnTextActive]}>
                  {isFollowing ? 'Siguiendo' : 'Seguir'}
                </Text>
              </Pressable>
            </View>

            {/* Meta — rating | disponibilidad | ciudad */}
            <View style={styles.metaRow}>
              <Ionicons name="star" size={11} color="#fbbf24" />
              <Text style={[styles.metaRating, isDark && styles.textDark]}>{artist.rating ?? '5.0'}</Text>

              <Text style={styles.metaSep}>·</Text>

              <Text style={[styles.metaAvail, { color: avail.color }]}>{avail.label}</Text>

              <Text style={styles.metaSep}>·</Text>

              <Ionicons name="location-outline" size={11} color={isDark ? '#9ca3af' : colors.textSecondary} />
              <Text style={[styles.metaCity, isDark && styles.textSubDark]} numberOfLines={1}>
                {artist.location || 'Colombia'}{distLabel ? `, ${distLabel}` : ''}
              </Text>
            </View>

            {/* Bio del header */}
            {artist.bio && (
              <Text style={[styles.description, isDark && styles.textSubDark]} numberOfLines={3}>
                {artist.bio}
              </Text>
            )}

            {/* Tags */}
            {artist.tags && artist.tags.length > 0 && (
              <View style={styles.tagsRow}>
                {artist.tags.slice(0, 3).map((tag, i) => (
                  <View key={i} style={[styles.tag, isDark && styles.tagDark]}>
                    <Ionicons name={getTagIcon(tag) as any} size={10} color={isDark ? '#a78bfa' : '#7c3aed'} />
                    <Text style={[styles.tagText, isDark && styles.tagTextDark]}>{tag}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Línea divisoria */}
          {isDark ? (
            <LinearGradient
              colors={['transparent', 'rgba(139,92,246,0.25)', 'transparent']}
              locations={[0, 0.5, 1]}
              style={[styles.divider, styles.dividerDark]}
            />
          ) : (
            <View style={[styles.divider, isDark && styles.dividerDark]} />
          )}

          {/* CTA */}
          <Pressable
            onPress={handleContact}
            style={({ pressed }) => [{ opacity: pressed ? 0.88 : 1, transform: [{ scale: pressed ? 0.985 : 1 }] }]}
          >
            {/* ⚠️ NO cambiar a morado — diseño intencional:
                · Oscuro → glassmorphism transparente (ctaDark)
                · Claro  → gradiente primario (ctaActive) */}
            {isDark ? (
              <View style={[styles.cta, styles.ctaDark]}>
                <View style={styles.ctaRight}>
                  <Ionicons name="briefcase-outline" size={14} color="#fff" />
                  <Text style={styles.ctaLabel}>Contratar ahora</Text>
                  <Ionicons name="arrow-forward" size={14} color="rgba(255,255,255,0.75)" />
                </View>
              </View>
            ) : (
              <LinearGradient
                colors={['#7c3aed', '#6d28d9']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={[styles.cta, styles.ctaActive]}
              >
                <View style={styles.ctaRight}>
                  <Ionicons name="briefcase-outline" size={14} color="#fff" />
                  <Text style={styles.ctaLabel}>Contratar ahora</Text>
                  <Ionicons name="arrow-forward" size={14} color="rgba(255,255,255,0.75)" />
                </View>
              </LinearGradient>
            )}
          </Pressable>

        </View>
      </BlurView>
    </View>

    {/* Hire Modal */}
    <HireModal
      visible={showHireModal}
      artist={artist}
      onClose={() => setShowHireModal(false)}
    />

    {/* Video Upload Modal */}
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
  outerWrapper: {
    borderRadius: 24,
    padding: 2,
    backgroundColor: 'rgba(139, 92, 246, 0.05)',
    flex: 1,
    minHeight: 280,
  },
  outerWrapperDark: {
    backgroundColor: 'rgba(124, 58, 237, 0.06)',
  },

  container: {
    flex: 1,
    borderRadius: 32,
    overflow: 'hidden',
    // Reducimos la opacidad para que el BlurView haga el trabajo
    backgroundColor: 'rgba(255,255,255,0.4)', 
    shadowColor: '#7c3aed',
    shadowOpacity: 0.14,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 24,
    elevation: 8,
  },
  containerDark: {
    backgroundColor: '#0a0618',
    borderColor: 'rgba(139, 92, 246, 0.45)',
    shadowColor: '#6d28d9',
    shadowOpacity: 0.35,
    shadowRadius: 28,
    elevation: 14,
  },

  navZoneLeft: {
    position: 'absolute',
    top: 0, bottom: 0, left: 0,
    width: '35%',
    zIndex: 2,
  },
  navZoneRight: {
    position: 'absolute',
    top: 0, bottom: 0, right: 0,
    width: '35%',
    zIndex: 2,
  },

  imageSection: {
    height: '66%',
    backgroundColor: 'transparent',
  },
  noImagePlaceholder: {
    backgroundColor: 'rgba(243, 240, 255, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    height: '30%',
  },

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

  categoryChip: {
    position: 'absolute',
    top: 10, left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(255,255,255,0.88)',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  categoryChipDark: {
    backgroundColor: 'rgba(0,0,0,0.65)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  categoryText: {
    fontSize: 9,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#1f2937',
  },
  categoryTextDark: {
    color: 'rgba(255,255,255,0.95)',
  },

  thumbsRow: {
    position: 'absolute',
    bottom: 14,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.45)',
  },
  dotActive: {
    width: 18,
    backgroundColor: '#fff',
  },

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

  panel: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  panelDark: {
    backgroundColor: '#0a0618',
  },

  topBlock: {
    flex: 1,
    gap: 6,
  },

  name: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#0f0f0f',
    lineHeight: 20,
    letterSpacing: -0.4,
    flexShrink: 1,
  },
  nameDark: {
    color: '#ffffff',
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    flexWrap: 'nowrap',
  },

  verifiedBadge: {
    width: 16, height: 16, borderRadius: 8,
    backgroundColor: '#7c3aed',
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },

  followBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    borderWidth: 1, borderColor: '#7c3aed',
    borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3,
    marginLeft: 'auto',
    flexShrink: 0,
  },
  followBtnActive: {
    backgroundColor: '#7c3aed', borderColor: '#7c3aed',
  },
  followBtnText: {
    fontSize: 10, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#7c3aed',
  },
  followBtnTextActive: {
    color: '#fff',
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexWrap: 'nowrap',
    overflow: 'hidden',
  },
  metaRating: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#374151',
  },
  metaSep: {
    fontSize: 11,
    color: '#d1d5db',
    fontFamily: 'PlusJakartaSans_400Regular',
  },
  metaAvail: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  metaCity: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#6b7280',
    flexShrink: 1,
  },
  
  textDark: {
    color: '#f3f4f6',
  },
  textSubDark: {
    color: '#9ca3af',
  },

  description: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#6b7280',
    lineHeight: 15,
    marginTop: 1,
    marginBottom: 3,
  },

  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 2,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.10)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tagDark: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderColor: 'rgba(255,255,255,0.18)',
  },
  tagText: {
    fontSize: 9,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#374151',
    letterSpacing: 0.2,
  },
  tagTextDark: {
    color: '#d1d5db',
  },

  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginTop: 8,
    marginBottom: 6,
  },
  dividerDark: {
    backgroundColor: 'transparent',
  },

  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
  },
  ctaActive: { 
    shadowColor: '#7c3aed',
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 16,
    elevation: 8,
  },
  ctaDark: {
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderColor: 'rgba(255,255,255,0.28)',
  },

  pricePill: {
    position: 'absolute',
    top: 10, right: 10,
    backgroundColor: colors.primary,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  pricePillText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#fff',
    letterSpacing: -0.2,
  },
  pricePillDesde: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(255,255,255,0.8)',
  },

  ctaRight: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  ctaLabel: { fontSize: 12, fontFamily: 'PlusJakartaSans_700Bold', color: '#fff', letterSpacing: 0.1 },
});