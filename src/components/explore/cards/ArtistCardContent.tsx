// ─────────────────────────────────────────────────────────────────────────────
// ArtistCardContent.tsx — Versión FIEL AL DISEÑO ORIGINAL (Sin BlurView)
// - Se mantiene TODA la estructura, espaciados, fuentes y lógica de roles.
// - Único cambio: Reemplazo de BlurView por View + Gradiente exacto.
// ─────────────────────────────────────────────────────────────────────────────
//
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🧪 A/B STRESS TEST — ESCENARIO 1: "GHOST MODE" (CPU Test)
//
// PROPÓSITO: Aislar si el cuello de botella es GPU (imágenes/video) o CPU
//            (re-renders de Zustand, conflicto de gestos, lógica de React).
//
// GHOST_MODE = true  → cero imágenes, cero video. Solo Views con colores sólidos.
//   ✅ Si el scroll vuela  → problema era GPU / decodificación de imágenes.
//   ❌ Si el scroll sigue lento → problema es CPU: Zustand, gestos, re-renders.
//
// GHOST_MODE = false → comportamiento normal (producción).
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const GHOST_MODE = false; // ← true = solo Views sólidos (CPU test), false = producción

import React, { useState, useRef, useEffect, useMemo } from 'react';
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
// Eliminamos BlurView por rendimiento
import { colors } from '../../../constants/colors';
import type { Artist } from '../../../types/explore';
import { portfolioService } from '../../../services/api/portfolio';
import { servicesService, type Service } from '../../../services/api/services';
import { useFavoritesStore } from '../../../store/favoritesStore';
import VideoUploadModal, { type VideoUploadResult } from '../shared/VideoUploadModal';
import { useThemeStore } from '../../../store/themeStore';

type MediaItem = { type: 'image'; uri: string } | { type: 'video'; uri: string; startTime: number };

interface ArtistCardContentProps {
  artist: Artist;
  distanceKm?: number;
  isFollowing?: boolean;
  onFollow?: () => void;
  preloadedServices?: Service[];
  preloadedPortfolio?: string[];
  isActive?: boolean;
}

const _servicesCache = new Map<string, Service[]>();
const _portfolioCache = new Map<string, string[]>();

const AVAILABILITY_OPTS = [
  { label: 'Disponible',    color: '#16a34a', bg: 'rgba(22,163,74,0.08)',   border: 'rgba(22,163,74,0.22)',   dot: '#16a34a', pulse: true  },
  { label: 'Ocupado',        color: '#d97706', bg: 'rgba(217,119,6,0.08)',   border: 'rgba(217,119,6,0.22)',   dot: '#d97706', pulse: false },
  { label: 'Bajo pedido',    color: '#7c3aed', bg: 'rgba(124,58,237,0.08)', border: 'rgba(124,58,237,0.22)', dot: '#7c3aed', pulse: false },
] as const;

function getAvailOpt(label?: string) {
  return AVAILABILITY_OPTS.find(o => o.label === label) ?? AVAILABILITY_OPTS[0];
}

const getTagIcon = (tag: string): string => {
  const t = tag.toLowerCase();
  if (t.includes('foto') || t.includes('retrato')) return 'camera-outline';
  if (t.includes('música') || t.includes('musica') || t.includes('concierto')) return 'musical-notes-outline';
  if (t.includes('boda')) return 'heart-outline';
  if (t.includes('pintura') || t.includes('arte')) return 'color-palette-outline';
  if (t.includes('diseño')) return 'pencil-outline';
  if (t.includes('video') || t.includes('cine')) return 'videocam-outline';
  if (t.includes('event')) return 'calendar-outline';
  if (t.includes('digital')) return 'desktop-outline';
  if (t.includes('abstrac') || t.includes('ilustr')) return 'shapes-outline';
  if (t.includes('mural') || t.includes('graffiti')) return 'brush-outline';
  if (t.includes('baile') || t.includes('danza')) return 'body-outline';
  if (t.includes('teatro') || t.includes('actor')) return 'mic-outline';
  return 'pricetag-outline';
};

const getLowestPrice = (services: Service[]): number | null => {
  if (!services?.length) return null;
  const prices = services
    .map((s: any) => {
      const raw = s.price ?? s.pricePerHour ?? s.price_per_hour ?? s.pricePerSession ?? s.price_per_session ?? s.basePrice ?? s.base_price;
      const n = typeof raw === 'string' ? parseFloat(raw) : Number(raw);
      return isNaN(n) || n <= 0 ? null : n;
    })
    .filter((p): p is number => p !== null);
  return prices.length > 0 ? Math.min(...prices) : null;
};

const formatCOP = (price: number) =>
  `$${price.toLocaleString('es-CO', { maximumFractionDigits: 0 })}`;

// ── Sub-componente aislado para el video player ───────────────────────────────
// CRÍTICO: useVideoPlayer crea un AVPlayer (iOS) / ExoPlayer (Android) nativo
// en el hilo de JS al montar. Con 3 tarjetas en el stack = 3 players simultáneos
// → bloqueo de ~80-150ms en el JS thread por cada swipe.
// Al aislar aquí, el player solo se crea cuando hay video real Y la tarjeta
// está activa. Por defecto: CERO players nativos en el stack.
function NativeVideoPlayer({ uri, startTime }: { uri: string; startTime: number }) {
  const player = useVideoPlayer(uri, (p) => {
    p.loop = true;
    try { p.currentTime = startTime; p.play(); } catch {}
  });
  return (
    <VideoView
      player={player}
      style={StyleSheet.absoluteFill}
      contentFit="cover"
      nativeControls={false}
    />
  );
}

function ArtistCardContentInner({ artist, distanceKm, isFollowing = false, onFollow, preloadedServices, preloadedPortfolio, isActive = true }: ArtistCardContentProps) {
  const { isDark } = useThemeStore();
  const [liked, setLiked] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);
  const artistId = String(artist.userId || artist.id);

  const [services, setServices] = useState<Service[]>(() => preloadedServices ?? _servicesCache.get(artistId) ?? []);
  const [servicesLoaded, setServicesLoaded] = useState(() => !!preloadedServices || _servicesCache.has(artistId));
  const [portfolioImages, setPortfolioImages] = useState<string[]>(() => preloadedPortfolio ?? _portfolioCache.get(artistId) ?? []);

  const [showHireModal, setShowHireModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [cardVideo, setCardVideo] = useState<{ uri: string; startTime: number } | null>(null);
  const heartScale = useRef(new Animated.Value(1)).current;
  const { addFavorite, removeFavorite, isFavorited } = useFavoritesStore();
  const isSaved = isFavorited(artist.id);
  // useVideoPlayer eliminado de aquí — vive en NativeVideoPlayer, solo monta cuando hay video real

  const availLabel = useMemo(() => artist.info?.find(i => i.label === 'Disponibilidad')?.value || artist.availability || 'Disponible', [artist.info, artist.availability]);
  const avail = useMemo(() => getAvailOpt(availLabel), [availLabel]);

  useEffect(() => {
    if (!preloadedServices) return;
    _servicesCache.set(artistId, preloadedServices);
    setServices(preloadedServices);
    setServicesLoaded(true);
  }, [preloadedServices, artistId]);

  useEffect(() => {
    if (!preloadedPortfolio) return;
    _portfolioCache.set(artistId, preloadedPortfolio);
    setPortfolioImages(preloadedPortfolio);
  }, [preloadedPortfolio, artistId]);

  // ── Fallback self-fetch — solo si la tarjeta está activa y no hay datos en caché ──
  useEffect(() => {
    if (!isActive) return;                        // no fetch para tarjetas del fondo
    if (_servicesCache.has(artistId)) return;
    if (preloadedServices !== undefined) return;
    servicesService.getUserServices(artistId).then(res => { if (Array.isArray(res)) { _servicesCache.set(artistId, res); setServices(res); } }).catch(() => {}).finally(() => setServicesLoaded(true));
  }, [artistId, isActive]);

  useEffect(() => {
    if (!isActive) return;                        // no fetch para tarjetas del fondo
    if (_portfolioCache.has(artistId)) return;
    if (preloadedPortfolio !== undefined) return;
    if (artist.gallery && artist.gallery.length > 0) return;
    portfolioService.getUserFeatured(artistId).then(featured => {
      const urls = (featured ?? []).map((p: any) => p.imageUrl).filter(Boolean) as string[];
      if (urls.length > 0) { _portfolioCache.set(artistId, urls); setPortfolioImages(urls); return; }
      return portfolioService.getUserPortfolio(artistId).then(res => {
        const all = (res?.photos ?? []).map((p: any) => p.imageUrl).filter(Boolean) as string[];
        if (all.length > 0) { _portfolioCache.set(artistId, all); setPortfolioImages(all); }
      });
    }).catch(() => {});
  }, [artistId, isActive]);

  // artist.image es el avatar del perfil — no debe aparecer en la sección de galería/portafolio.
  // Solo usamos gallery (del explore response) o portfolioImages (cargado del API de portafolio).
  const galleryUrls = artist.gallery && artist.gallery.length > 0 ? artist.gallery : portfolioImages;
  const baseImages = galleryUrls.filter(Boolean).slice(0, 5);
  const media: MediaItem[] = [
    ...(cardVideo ? [{ type: 'video' as const, uri: cardVideo.uri, startTime: cardVideo.startTime }] : []),
    ...baseImages.map(uri => ({ type: 'image' as const, uri })),
  ];
  const images = baseImages;
  // El efecto de sincronización del player se eliminó — NativeVideoPlayer maneja su propio ciclo de vida

  const distLabel = useMemo(() => distanceKm !== undefined ? (distanceKm < 1 ? `${Math.round(distanceKm * 1000)}m` : `${distanceKm.toFixed(1)}km`) : '3 km', [distanceKm]);

  const handleContact = () => { if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); setShowHireModal(true); };

  const lowestPrice = useMemo(() => getLowestPrice(services) ?? (artist.price > 0 ? artist.price : null), [services, artist.price]);
  const tagIcons = useMemo(() => (artist.tags ?? []).slice(0, 3).map(tag => getTagIcon(tag)), [artist.tags]);

  return (
    <>
    {/* shouldRasterizeIOS/renderToHardwareTextureAndroid: convierte las tarjetas del fondo  */}
    {/* en un bitmap plano — cero recálculo de layout por frame mientras están quietas.     */}
    <View
      shouldRasterizeIOS={Platform.OS === 'ios' && !isActive}
      renderToHardwareTextureAndroid={Platform.OS === 'android' && !isActive}
      style={[styles.outerWrapper, isDark && styles.outerWrapperDark]}
    >
      {/* Sombras eliminadas en tarjetas del fondo (isActive=false) para reducir GPU.     */}
      {/* Solo la tarjeta superior recibe la sombra completa.                             */}
      <View style={[
        styles.container,
        isDark && styles.containerDark,
        !isActive && styles.containerNoShadow,
      ]}>
        
        {/* Fondo Glassmorphism FIEL - Sin BlurView pero con Gradiente de Profundidad */}
        <LinearGradient
          colors={isDark ? ['#130d2a', '#0a0618'] : ['#ffffff', 'rgba(237,233,255,0.7)']}
          style={StyleSheet.absoluteFill}
        />

        {/* ══════════ IMAGEN / VIDEO 70% ══════════ */}
        {/* isActive=true  → video decoder + priority="high" en imagen actual  */}
        {/* isActive=false → primera imagen con priority="low", sin video decode */}
        <View style={styles.imageSection}>
        {GHOST_MODE ? (
          /* 🧪 GHOST MODE: cero GPU — View sólido sin imagen ni video.
             Colores distintos por artista para identificar cada tarjeta visualmente. */
          <View style={[StyleSheet.absoluteFill, {
            backgroundColor: isActive ? '#7c3aed' : '#4c1d95',
            alignItems: 'center', justifyContent: 'center',
          }]}>
            <Text style={{ color: '#fff', opacity: 0.5, fontSize: 11, fontFamily: 'PlusJakartaSans_600SemiBold' }}>
              GHOST MODE{isActive ? ' · ACTIVA' : ' · FONDO'}
            </Text>
          </View>
        ) : isActive ? (() => {
          const current = media[imgIdx];
          if (current?.type === 'video') {
            // NativeVideoPlayer monta el AVPlayer/ExoPlayer solo aquí — cero costo para las otras 2 tarjetas del stack
            return <NativeVideoPlayer uri={current.uri} startTime={current.startTime} />;
          }
          const uri = current?.uri ?? images[imgIdx];
          return uri ? (
            <Image
              source={{ uri }}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
              transition={200}
              cachePolicy="memory-disk"
              priority="high"
            />
          ) : (
            <View style={[StyleSheet.absoluteFill, styles.noImagePlaceholder]}>
              <Ionicons name="image-outline" size={40} color="rgba(124,58,237,0.2)" />
            </View>
          );
        })() : (
          /* Tarjeta del fondo: imagen estática, baja prioridad, sin decode de video */
          images[0] ? (
            <Image
              source={{ uri: images[0] }}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
              transition={0}
              cachePolicy="memory-disk"
              priority="low"
            />
          ) : (
            <View style={[StyleSheet.absoluteFill, { backgroundColor: '#e5e7eb' }]} />
          )
        )}
        
        <LinearGradient
          colors={isDark ? ['transparent', 'rgba(10,6,24,0.4)', 'rgba(10,6,24,0.85)', '#0a0618'] : ['transparent', 'transparent']}
          locations={isDark ? [0, 0.4, 0.7, 1] : [0, 1]}
          style={styles.imageGradient}
        />

        {media.length > 1 && (
          <>
            <Pressable style={styles.navZoneLeft} onPress={() => setImgIdx(i => (i - 1 + media.length) % media.length)} />
            <Pressable style={styles.navZoneRight} onPress={() => setImgIdx(i => (i + 1) % media.length)} />
          </>
        )}

        {lowestPrice && (
          <View style={styles.pricePill}>
            <Text style={styles.pricePillText}><Text style={styles.pricePillDesde}>desde </Text>{formatCOP(lowestPrice)}</Text>
          </View>
        )}

        {/* LÓGICA DE ROL RE-ESTABLECIDA */}
        {(() => {
          const roleId = artist.artistCategory?.roleId || (typeof artist.category === 'object' ? artist.category?.roleId : null);
          if (!roleId) return null;
          const label = roleId.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());
          return (
            <View style={[styles.categoryChip, isDark && styles.categoryChipDark]}>
              <Ionicons name="ribbon-outline" size={9} color={isDark ? '#fff' : '#1f2937'} />
              <Text style={[styles.categoryText, isDark && styles.categoryTextDark]}>{label}</Text>
            </View>
          );
        })()}

        {media.length > 1 && (
          <View style={styles.thumbsRow}>
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

        <View style={styles.sideActions}>
          <Pressable style={[styles.sideBtn, liked && styles.sideBtnLiked]} onPress={() => {
            if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            Animated.sequence([ Animated.spring(heartScale, { toValue: 1.4, useNativeDriver: true, speed: 40 }), Animated.spring(heartScale, { toValue: 1, useNativeDriver: true, speed: 40 }), ]).start();
            setLiked(v => !v);
          }}>
            <Animated.View style={{ transform: [{ scale: heartScale }] }}>
              <Ionicons name={liked ? 'heart' : 'heart-outline'} size={20} color='#fff' />
            </Animated.View>
          </Pressable>

          <Pressable style={[styles.sideBtn, isSaved && styles.sideBtnSaved]} onPress={() => isSaved ? removeFavorite(artist.id) : addFavorite(artist)}>
            <Ionicons name={isSaved ? 'bookmark' : 'bookmark-outline'} size={20} color='#fff' />
          </Pressable>

          <Pressable style={styles.sideBtn} onPress={() => Share.share({ title: artist.name, message: `${artist.name} — artista en BuscArt\n${artist.bio ?? ''}` })}>
            <Ionicons name="share-social-outline" size={20} color="#fff" />
          </Pressable>

          <Pressable style={[styles.sideBtn, cardVideo ? styles.sideBtnVideo : undefined]} onPress={() => setShowVideoModal(true)}>
            <Ionicons name={cardVideo ? 'videocam' : 'videocam-outline'} size={20} color="#fff" />
          </Pressable>
        </View>
        </View>

        {/* ══════════ PANEL BLANCO 40% ══════════ */}
        <View style={[styles.panel, isDark && styles.panelDark]}>
          <View style={styles.topBlock}>
            <View style={styles.titleRow}>
              <Text style={[styles.name, isDark && styles.nameDark]} numberOfLines={1}>{artist.name}</Text>
              {artist.verified === true && (
                <View style={styles.verifiedBadge}><Ionicons name="checkmark" size={9} color="#fff" /></View>
              )}
              <Pressable onPress={onFollow} style={[styles.followBtn, isFollowing && styles.followBtnActive]}>
                <Ionicons name={isFollowing ? 'checkmark' : 'person-add-outline'} size={11} color={isFollowing ? '#fff' : '#7c3aed'} />
                <Text style={[styles.followBtnText, isFollowing && styles.followBtnTextActive]}>{isFollowing ? 'Siguiendo' : 'Seguir'}</Text>
              </Pressable>
            </View>

            <View style={styles.metaRow}>
              <Ionicons name="star" size={11} color="#fbbf24" />
              <Text style={[styles.metaRating, isDark && styles.textDark]}>{artist.rating ?? '5.0'}</Text>
              <Text style={styles.metaSep}>·</Text>
              <Text style={[styles.metaAvail, { color: avail.color }]}>{avail.label}</Text>
              <Text style={styles.metaSep}>·</Text>
              <Ionicons name="location-outline" size={11} color={isDark ? '#9ca3af' : colors.textSecondary} />
              <Text style={[styles.metaCity, isDark && styles.textSubDark]} numberOfLines={1}>{artist.location || 'Colombia'}{distLabel ? `, ${distLabel}` : ''}</Text>
            </View>

            {artist.bio && (
              <Text style={[styles.description, isDark && styles.textSubDark]} numberOfLines={3}>{artist.bio}</Text>
            )}

            {artist.tags && artist.tags.length > 0 && (
              <View style={styles.tagsRow}>
                {artist.tags.slice(0, 3).map((tag, i) => (
                  <View key={i} style={[styles.tag, isDark && styles.tagDark]}>
                    <Ionicons name={tagIcons[i] as any} size={10} color={isDark ? '#a78bfa' : '#7c3aed'} />
                    <Text style={[styles.tagText, isDark && styles.tagTextDark]}>{tag}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {isDark ? (
            <LinearGradient colors={['transparent', 'rgba(139,92,246,0.25)', 'transparent']} locations={[0, 0.5, 1]} style={[styles.divider, styles.dividerDark]} />
          ) : (
            <View style={styles.divider} />
          )}

          <Pressable onPress={handleContact} style={({ pressed }) => [{ opacity: pressed ? 0.88 : 1, transform: [{ scale: pressed ? 0.985 : 1 }] }]}>
            {isDark ? (
              <View style={[styles.cta, styles.ctaDark]}>
                <View style={styles.ctaRight}>
                  <Ionicons name="briefcase-outline" size={14} color="#fff" />
                  <Text style={styles.ctaLabel}>Contratar ahora</Text>
                  <Ionicons name="arrow-forward" size={14} color="rgba(255,255,255,0.75)" />
                </View>
              </View>
            ) : (
              <LinearGradient colors={['#7c3aed', '#6d28d9']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[styles.cta, styles.ctaActive]}>
                <View style={styles.ctaRight}>
                  <Ionicons name="briefcase-outline" size={14} color="#fff" />
                  <Text style={styles.ctaLabel}>Contratar ahora</Text>
                  <Ionicons name="arrow-forward" size={14} color="rgba(255,255,255,0.75)" />
                </View>
              </LinearGradient>
            )}
          </Pressable>
        </View>
      </View>
    </View>

    <HireModal visible={showHireModal} artist={artist} onClose={() => setShowHireModal(false)} />
    <VideoUploadModal visible={showVideoModal} onClose={() => setShowVideoModal(false)} onUploaded={(result) => { setCardVideo(result); setImgIdx(0); }} />
    </>
  );
}

// React.memo con comparador ESTRICTO:
// Solo se permite re-render cuando cambia el artista, el estado de seguimiento,
// o si la tarjeta pasa de activa a inactiva (o viceversa).
// preloadedServices / preloadedPortfolio son referencias estables del caché —
// no se necesitan en la comparación porque artist.id no cambia entre renders del padre.
const ArtistCardContent = React.memo(ArtistCardContentInner, (prev, next) => {
  return (
    prev.artist.id   === next.artist.id   &&
    prev.isFollowing === next.isFollowing &&
    prev.isActive    === next.isActive
  );
});

export default ArtistCardContent;

const styles = StyleSheet.create({
  outerWrapper: { borderRadius: 24, padding: 2, backgroundColor: 'rgba(139, 92, 246, 0.05)', flex: 1, minHeight: 280 },
  outerWrapperDark: { backgroundColor: 'rgba(124, 58, 237, 0.06)' },
  // Tarjeta activa (top): sombra completa para el efecto visual de elevación
  container: { flex: 1, borderRadius: 32, overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.98)', shadowColor: '#7c3aed', shadowOpacity: 0.14, shadowOffset: { width: 0, height: 6 }, shadowRadius: 16, elevation: 6 },
  containerDark: { backgroundColor: '#130d2a', borderColor: 'rgba(139, 92, 246, 0.2)', shadowColor: '#6d28d9', shadowOpacity: 0.30, shadowRadius: 18, elevation: 10 },
  // Tarjetas del fondo: sin sombra — están ocultas detrás de la activa, cero GPU para shadows
  containerNoShadow: { shadowOpacity: 0, shadowRadius: 0, elevation: 0 },
  navZoneLeft: { position: 'absolute', top: 0, bottom: 0, left: 0, width: '35%', zIndex: 2 },
  navZoneRight: { position: 'absolute', top: 0, bottom: 0, right: 0, width: '45%', zIndex: 2 },
  imageSection: { height: '66%' },
  noImagePlaceholder: { backgroundColor: 'rgba(243, 240, 255, 0.5)', alignItems: 'center', justifyContent: 'center' },
  imageGradient: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '30%' },
  categoryChip: { position: 'absolute', top: 10, left: 10, flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: 'rgba(255,255,255,0.88)', borderRadius: 20, paddingHorizontal: 8, paddingVertical: 4 },
  categoryChipDark: { backgroundColor: 'rgba(0,0,0,0.65)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)' },
  categoryText: { fontSize: 10, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#1f2937' },
  categoryTextDark: { color: 'rgba(255,255,255,0.95)' },
  thumbsRow: { position: 'absolute', bottom: 14, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: 5 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.45)' },
  dotActive: { width: 18, backgroundColor: '#fff' },
  sideActions: { position: 'absolute', right: 12, bottom: 36, flexDirection: 'column', gap: 10, alignItems: 'center', zIndex: 20 },
  sideBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(0,0,0,0.42)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)' },
  sideBtnLiked: { backgroundColor: 'rgba(248,113,113,0.22)', borderColor: '#f87171' },
  sideBtnSaved: { backgroundColor: 'rgba(167,139,250,0.22)', borderColor: '#a78bfa' },
  sideBtnVideo: { backgroundColor: 'rgba(124,58,237,0.45)', borderColor: '#7c3aed' },
  panel: { flex: 1, backgroundColor: 'rgba(255,255,255,0.7)', paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8, flexDirection: 'column', justifyContent: 'flex-start' },
  panelDark: { backgroundColor: '#0a0618' },
  topBlock: { flex: 1, gap: 6 },
  name: { fontSize: 15, fontFamily: 'PlusJakartaSans_700Bold', color: '#0f0f0f', lineHeight: 20, letterSpacing: -0.4 },
  nameDark: { color: '#ffffff' },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  verifiedBadge: { width: 16, height: 16, borderRadius: 8, backgroundColor: '#7c3aed', alignItems: 'center', justifyContent: 'center' },
  followBtn: { flexDirection: 'row', alignItems: 'center', gap: 3, borderWidth: 1, borderColor: '#7c3aed', borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3, marginLeft: 'auto' },
  followBtnActive: { backgroundColor: '#7c3aed' },
  followBtnText: { fontSize: 10, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#7c3aed' },
  followBtnTextActive: { color: '#fff' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaRating: { fontSize: 11, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#374151' },
  metaSep: { fontSize: 11, color: '#d1d5db' },
  metaAvail: { fontSize: 11, fontFamily: 'PlusJakartaSans_600SemiBold' },
  metaCity: { fontSize: 11, fontFamily: 'PlusJakartaSans_400Regular', color: '#6b7280' },
  description: { fontSize: 14, fontFamily: 'PlusJakartaSans_400Regular', color: '#6b7280', lineHeight: 15, marginTop: 1, marginBottom: 3 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 2 },
  tag: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(0,0,0,0.04)', borderWidth: 1, borderColor: 'rgba(0,0,0,0.10)', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  tagDark: { backgroundColor: 'rgba(255,255,255,0.07)', borderColor: 'rgba(255,255,255,0.18)' },
  tagText: { fontSize: 10, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#374151' },
  tagTextDark: { color: '#d1d5db' },
  divider: { height: 1, backgroundColor: '#f0f0f0', marginTop: 8, marginBottom: 6 },
  dividerDark: { backgroundColor: 'transparent' },
  cta: { flexDirection: 'row', alignItems: 'center', borderRadius: 14, overflow: 'hidden', borderWidth: 1 },
  ctaActive: { shadowColor: '#7c3aed', shadowOpacity: 0.25, shadowOffset: { width: 0, height: 4 }, shadowRadius: 10, elevation: 5 },
  ctaDark: { backgroundColor: 'rgba(255,255,255,0.10)', borderColor: 'rgba(255,255,255,0.28)' },
  pricePill: { position: 'absolute', top: 10, right: 10, backgroundColor: '#7c3aed', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5, zIndex: 10 },
  pricePillText: { fontSize: 12, fontFamily: 'PlusJakartaSans_700Bold', color: '#fff' },
  pricePillDesde: { fontSize: 10, fontFamily: 'PlusJakartaSans_400Regular', color: 'rgba(255,255,255,0.8)' },
  ctaRight: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 12 },
  ctaLabel: { fontSize: 12, fontFamily: 'PlusJakartaSans_700Bold', color: '#fff' },
  textDark: { color: '#f3f4f6' },
  textSubDark: { color: '#9ca3af' },
});