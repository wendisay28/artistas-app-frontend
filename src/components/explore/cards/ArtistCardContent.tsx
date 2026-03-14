// ─────────────────────────────────────────────────────────────────────────────
// ArtistCardContent.tsx — Versión adaptada de EventCardContent
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
import { colors } from '../../../constants/colors';
import type { Artist, ArtistCategorySelection } from '../../../types/explore';
import { portfolioService } from '../../../services/api/portfolio';
import { artistsService } from '../../../services/api/artists';
import { servicesService, type Service } from '../../../services/api/services';
import { useProfileStore } from '../../../store/profileStore';
import { useFavoritesStore } from '../../../store/favoritesStore';


interface ArtistCardContentProps {
  artist: Artist;
  distanceKm?: number;
  isFollowing?: boolean;
  onFollow?: () => void;
}

// ── Disponibilidad (misma lógica que ProfileIdentity) ──────────────────────

const AVAILABILITY = {
  available: { label: 'Disponible', bg: 'rgba(16,185,129,0.08)', color: '#16a34a' },
  busy:      { label: 'Ocupado', bg: 'rgba(245,158,11,0.08)', color: '#d97706' },
  'bajo-pedido': { label: 'Bajo pedido', bg: 'rgba(139,92,246,0.08)', color: '#8b5cf6' },
} as const;
type AvailabilityKey = keyof typeof AVAILABILITY;

const getArtistSpecialty = (artist: Artist): string => {
  // Prioridad 1: Usar specialty si está definido (viene del onboarding/perfil)
  if (artist.specialty && artist.specialty.trim() !== '') {
    return artist.specialty;
  }
  
  // Prioridad 2: Usar la categoría y estilo del artista
  if (artist.category && artist.style) {
    const categoryStr = typeof artist.category === 'object' ? artist.category.categoryId : artist.category;
    return `${categoryStr} - ${artist.style}`;
  }
  
  // Prioridad 3: Usar solo la categoría
  if (artist.category) {
    return typeof artist.category === 'object' ? artist.category.categoryId : artist.category;
  }
  
  // Prioridad 4: Usar solo el estilo
  if (artist.style) {
    return artist.style;
  }
  
  // Valor por defecto
  return 'Artista Visual';
};

const getCategoryMeta = (category?: string | ArtistCategorySelection): { icon: any; label: string } => {
  if (!category) return { icon: 'person-outline', label: 'Artista' };
  
  // Extraer el string de categoría si es un objeto
  const categoryStr = typeof category === 'object' ? category.categoryId : category;
  const cat = categoryStr.toLowerCase();
  
  if (cat.includes('fotógrafo') || cat.includes('fotografía')) return { icon: 'camera-outline', label: 'Fotografía' };
  if (cat.includes('músico') || cat.includes('música')) return { icon: 'musical-notes-outline', label: 'Música' };
  if (cat.includes('artista') || cat.includes('arte')) return { icon: 'color-palette-outline', label: 'Arte' };
  if (cat.includes('diseñador')) return { icon: 'brush-outline', label: 'Diseño' };
  if (cat.includes('video') || cat.includes('audiovisual')) return { icon: 'videocam-outline', label: 'Video' };
  return { icon: 'person-outline', label: categoryStr };
};

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
      // Postgres numeric llega como string — convertir
      const n = typeof raw === 'string' ? parseFloat(raw) : Number(raw);
      return isNaN(n) || n <= 0 ? null : n;
    })
    .filter((p): p is number => p !== null);
  return prices.length > 0 ? Math.min(...prices) : null;
};

const formatCOP = (price: number) =>
  `$${price.toLocaleString('es-CO', { maximumFractionDigits: 0 })}`;

// Extrae del schedule completo solo el horario del día de hoy
// Formato esperado: "Lun 9:00am-6:00pm, Sáb 10:00am-5:00pm, ..."
const getTodaySchedule = (scheduleStr: string): string => {
  if (!scheduleStr) return '';
  const DAY_ABBREVS: Record<number, string[]> = {
    0: ['Dom'],
    1: ['Lun'],
    2: ['Mar'],
    3: ['Mié', 'Mie'],
    4: ['Jue'],
    5: ['Vie'],
    6: ['Sáb', 'Sab'],
  };
  const todayAbbrevs = DAY_ABBREVS[new Date().getDay()] || [];
  for (const part of scheduleStr.split(',')) {
    const trimmed = part.trim();
    if (todayAbbrevs.some(a => trimmed.startsWith(a))) return trimmed;
  }
  return '';
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function ArtistCardContent({ artist, distanceKm, isFollowing = false, onFollow }: ArtistCardContentProps) {
  const [liked, setLiked] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);
  const [services, setServices] = useState<Service[]>([]);
  const [servicesLoaded, setServicesLoaded] = useState(false);
  const [showHireModal, setShowHireModal] = useState(false);
  const heartScale = useRef(new Animated.Value(1)).current;
  const [portfolioImages, setPortfolioImages] = useState<string[]>([]);
  const [, setSchedule] = useState<string>(artist.schedule || '');
  const { artistData } = useProfileStore();
  const { addFavorite, removeFavorite, isFavorited } = useFavoritesStore();
  const isSaved = isFavorited(artist.id);

  // Lógica de disponibilidad igual que ProfileIdentity
  const availKey = (artist.availability as AvailabilityKey) ?? 'available';
  const avail = AVAILABILITY[availKey] ?? AVAILABILITY.available;

  useEffect(() => {
    const userId = artist.userId || artist.id;
    if (!userId) return;

    // Fotos de portafolio — usar destacadas primero, si no hay todas las del portafolio
    if (!artist.gallery || artist.gallery.length === 0) {
      portfolioService.getUserFeatured(String(userId))
        .then(featured => {
          const urls = (featured ?? []).map((p) => p.imageUrl).filter(Boolean) as string[];
          if (urls.length > 0) { setPortfolioImages(urls); return; }
          // Fallback: todas las fotos del portafolio
          return portfolioService.getUserPortfolio(String(userId)).then(res => {
            const all = (res?.photos ?? []).map((p) => p.imageUrl).filter(Boolean) as string[];
            if (all.length > 0) setPortfolioImages(all);
          });
        })
        .catch(() => {});
    }

    // Horario — cargar siempre si no hay schedule válido
    if (!artist.schedule || artist.schedule.trim() === '') {
      
      // Primero intentar usar datos locales del profileStore
      if (artistData?.schedule && artistData.schedule.trim() !== '') {
        setSchedule(artistData.schedule);
        return;
      }
      
      // Si no hay datos locales, intentar API
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

  // Cargar servicios del artista para mostrar precio más bajo
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

  // Solo fotos de portafolio — el avatar nunca se incluye en el carrusel
  const images = galleryUrls.filter(Boolean).slice(0, 5);
  const distLabel = distanceKm !== undefined
    ? (distanceKm < 1 ? `${Math.round(distanceKm * 1000)}m` : `${distanceKm.toFixed(1)}km`)
    : '3 km'; // Valor temporal para prueba


  const handleContact = () => {
    if (Platform.OS !== 'web')
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowHireModal(true);
  };

  const lowestPrice = getLowestPrice(services);

  return (
    <>
    <View style={styles.outerWrapper}>
      <View style={styles.container}>

        {/* ══════════ IMAGEN 70% ══════════ */}
        <View style={styles.imageSection}>
        {images.length > 0 ? (
          <Image
            source={{ uri: images[imgIdx] }}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
            transition={250}
            placeholder="https://via.placeholder.com/400x300/f3f0ff/7c3aed?text=Cargando..."
            placeholderContentFit="cover"
            cachePolicy="memory-disk"
            recyclingKey={artist.id}
            priority="high"
          />
        ) : (
          <View style={[StyleSheet.absoluteFill, styles.noImagePlaceholder]}>
            <Ionicons name="image-outline" size={40} color="rgba(124,58,237,0.2)" />
          </View>
        )}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.20)']}
          style={styles.imageGradient}
        />

        {/* Zonas de toque izq/der para pasar imagen */}
        {images.length > 1 && (
          <>
            <Pressable
              style={styles.navZoneLeft}
              onPress={() => setImgIdx(i => (i - 1 + images.length) % images.length)}
            />
            <Pressable
              style={styles.navZoneRight}
              onPress={() => setImgIdx(i => (i + 1) % images.length)}
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
            <View style={styles.categoryChip}>
              <Ionicons name="ribbon-outline" size={9} color="#1f2937" />
              <Text style={styles.categoryText}>{label}</Text>
            </View>
          );
        })()}

        {/* Dots de navegación — solo si hay más de 1 imagen */}
        {images.length > 1 && (
          <View style={styles.thumbsRow}>
            {images.map((_, i) => (
              <Pressable
                key={i}
                onPress={() => setImgIdx(i)}
                style={[styles.dot, i === imgIdx && styles.dotActive]}
              />
            ))}
          </View>
        )}

        {/* ── Acciones verticales derecha ── */}
        <View style={styles.sideActions}>
          {/* Me gusta */}
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

          {/* Guardar en favoritos */}
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

          {/* Compartir */}
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
        </View>

      </View>

      {/* ══════════ PANEL BLANCO 40% ══════════ */}
      <View style={styles.panel}>

        {/* Bloque de texto — sin flex:1, ocupa solo su contenido */}
        <View style={styles.topBlock}>

          {/* Nombre + verificado + seguir */}
          <View style={styles.titleRow}>
            <Text style={styles.name} numberOfLines={1}>{artist.name}</Text>
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
            <Text style={styles.metaRating}>{artist.rating ?? '5.0'}</Text>

            <Text style={styles.metaSep}>·</Text>

            <Text style={[styles.metaAvail, { color: avail.color }]}>{avail.label}</Text>

            <Text style={styles.metaSep}>·</Text>

            <Ionicons name="location-outline" size={11} color={colors.textSecondary} />
            <Text style={styles.metaCity} numberOfLines={1}>
              {artist.location || 'Colombia'}{distLabel ? `, ${distLabel}` : ''}
            </Text>
          </View>

          {/* Bio del header — mejor espaciado y presentación */}
          {artist.bio && (
            <Text style={styles.description} numberOfLines={3}>
              {artist.bio}
            </Text>
          )}

          {/* Tags — mejor diseño y espaciado */}
          {artist.tags && artist.tags.length > 0 && (
            <View style={styles.tagsRow}>
              {artist.tags.slice(0, 3).map((tag, i) => (
                <View key={i} style={styles.tag}>
                  <Ionicons name={getTagIcon(tag) as any} size={10} color="#7c3aed" />
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Línea divisoria */}
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
          <View style={styles.ctaRight}>
            <Ionicons name="briefcase-outline" size={14} color="#fff" />
            <Text style={styles.ctaLabel}>Contratar ahora</Text>
            <Ionicons name="arrow-forward" size={14} color="rgba(255,255,255,0.75)" />
          </View>
        </Pressable>

      </View>
    </View>
    </View>

    {/* Hire Modal — fuera del card para no quedar clippeado */}
    <HireModal
      visible={showHireModal}
      artist={artist}
      onClose={() => setShowHireModal(false)}
    />
    </>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  // Contenedor externo con fondo para forzar visibilidad de sombra
  outerWrapper: {
    borderRadius: 24,
    padding: 4, // Espacio para mostrar la sombra
    backgroundColor: 'rgba(139, 92, 246, 0.05)', // Fondo morado muy suave
    // Mantener el tamaño original
    flex: 1, // Ocupar todo el espacio disponible
    minHeight: 280, // Altura mínima para mantener tamaño original
  },

  container: {
    flex: 1,
    borderRadius: 32, // ← EXACTAMENTE igual que el modal
    overflow: 'hidden',
    // EXACTAMENTE igual que glassCard del modal
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.95)',
    shadowColor: '#a78bfa',
    shadowOffset: { width: 0, height: 12 },  // ← EXACTAMENTE igual que el modal
    shadowOpacity: 0.3,                      // ← EXACTAMENTE igual que el modal
    shadowRadius: 20,                        // ← EXACTAMENTE igual que el modal
    elevation: 10,                           // ← EXACTAMENTE igual que el modal
  },

  // zonas de navegación izq/der
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

  // imagen
  imageSection: {
    height: '66%',
    backgroundColor: '#e5e7eb',
  },
  noImagePlaceholder: {
    backgroundColor: '#f3f0ff',
    alignItems: 'center',
    justifyContent: 'center',
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

  // categoría top-left
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
  categoryText: {
    fontSize: 9,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#1f2937',
  },

  // dots de navegación
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

  // especialidad con botón cápsula en parte inferior izquierda
  specialtyContainer: {
    position: 'absolute',
    bottom: 36, left: 12,
    alignItems: 'flex-start',
  },
  specialtyButton: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  specialtyButtonText: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#1f2937',
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
    flex: 1,
    gap: 6, // Reducido de 8 a 6 para compensar bio más larga
  },

  // título — grande y visible
  name: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#0f0f0f',
    lineHeight: 20,
    letterSpacing: -0.4,
    flexShrink: 1,
  },

  // fila para título y verificación
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    flexWrap: 'nowrap',
  },

  // badge verificado (círculo violeta con check)
  verifiedBadge: {
    width: 16, height: 16, borderRadius: 8,
    backgroundColor: '#7c3aed',
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },

  // botón seguir inline
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

  verificationText: {
    fontSize: 9,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  verifiedText: {
    color: '#10b981',  // Verde brillante para contraste
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  unverifiedText: {
    color: '#ef4444',  // Rojo brillante para contraste
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  // meta — elementos separados con mejor espaciado
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

  // descripción — mejor espaciado y legibilidad
  description: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#6b7280',
    lineHeight: 15,
    marginTop: 1, // Subido 2 pixels más (de 3 a 1)
    marginBottom: 3, // Reducido de 4 a 3 para tags
  },

  // tags — mejor diseño y espaciado consistente
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6, // Aumentado para mejor separación
    marginTop: 2, // Reducido de 4 a 2 para acercar más a la bio
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(124,58,237,0.08)', // Ligeramente más visible
    borderWidth: 1,
    borderColor: 'rgba(124,58,237,0.2)', // Más definido
    borderRadius: 20, // Redondeado más elegante
    paddingHorizontal: 10,
    paddingVertical: 4, // Ligeramente más alto
  },
  tagText: {
    fontSize: 9,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#7c3aed',
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
  ctaActive: { backgroundColor: colors.primary, borderColor: colors.primary + '55' },

  // precio en imagen top-right
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
});;