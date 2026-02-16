// ─────────────────────────────────────────────────────────────────────────────
// ArtistDetails.tsx — Full scrollable detail view for an Artist
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
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { colors } from '../../../constants/colors';
import InfoPair from '../shared/InfoPair';
import ReviewCard from '../shared/ReviewCard';
import GalleryModal from '../shared/GalleryModal';
import type { Artist, Review } from '../../../types/explore';
import { CARD_WIDTH } from '../cards/SwipeCard';

const MOCK_REVIEWS: Review[] = [
  { id: 'r1', authorName: 'Laura P.',   rating: 5, text: 'Increíble trabajo, muy profesional y puntual. Superó todas mis expectativas.', date: 'Hace 2 semanas' },
  { id: 'r2', authorName: 'Miguel R.',  rating: 4, text: 'Excelente artista, muy creativo y comprometido con el proyecto.',              date: 'Hace 1 mes'     },
  { id: 'r3', authorName: 'Carmen V.',  rating: 5, text: 'Repeat customer. Always delivers stunning results on time.',                   date: 'Hace 2 meses'   },
];

interface ArtistDetailsProps {
  artist: Artist;
  onHire?: () => void;
  onMessage?: () => void;
  onShare?: () => void;
}

const formatCOP = (price: number) =>
  `$${price.toLocaleString('es-CO', { maximumFractionDigits: 0 })}`;

export default function ArtistDetails({ artist, onHire, onMessage, onShare }: ArtistDetailsProps) {
  const [activeTab,   setActiveTab]   = useState<'services' | 'portfolio' | 'reviews'>('services');
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIdx,  setGalleryIdx]  = useState(0);
  const [bioExpanded, setBioExpanded] = useState(false);

  const isAvailable = artist.availability === 'Disponible';
  const basePrice   = artist.price ?? null;
  const ctaLabel    = basePrice ? `Contratar · desde ${formatCOP(basePrice)}` : 'Contratar ahora';

  const openGallery = (i: number) => { setGalleryIdx(i); setGalleryOpen(true); };

  const handleTab = (tab: typeof activeTab) => {
    if (Platform.OS !== 'web') Haptics.selectionAsync();
    setActiveTab(tab);
  };

  return (
    <>
      {galleryOpen && (
        <GalleryModal images={artist.gallery} initialIndex={galleryIdx} onClose={() => setGalleryOpen(false)} />
      )}

      <View style={styles.container}>

        {/* ══ MINI HEADER ══ */}
        <View style={styles.miniHeader}>
          {artist.image ? (
            <Image source={{ uri: artist.image }} style={styles.avatar} contentFit="cover" />
          ) : (
            <View style={[styles.avatar, styles.avatarFallback]}>
              <Ionicons name="person" size={22} color={colors.primary} />
            </View>
          )}

          <View style={styles.headerMeta}>
            <View style={styles.nameRow}>
              <Text style={styles.artistName} numberOfLines={1}>{artist.name}</Text>
              {artist.verified && <Ionicons name="checkmark-circle" size={15} color="#818cf8" />}
            </View>
            <Text style={styles.artistCategory} numberOfLines={1}>{artist.category}</Text>
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={11} color={colors.textSecondary} />
              <Text style={styles.locationText} numberOfLines={1}>{artist.location}</Text>
            </View>
          </View>

          <View style={[styles.availPill, { backgroundColor: isAvailable ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)' }]}>
            <View style={[styles.availDot, { backgroundColor: isAvailable ? colors.success : '#f59e0b' }]} />
            <Text style={[styles.availText, { color: isAvailable ? colors.success : '#f59e0b' }]}>
              {isAvailable ? 'Disponible' : 'Ocupado'}
            </Text>
          </View>
        </View>

        {/* ══ ABOUT ══ */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Acerca de mí</Text>
          <Text style={styles.bioText} numberOfLines={bioExpanded ? undefined : 3}>
            {artist.bio}
          </Text>
          <Pressable onPress={() => setBioExpanded(p => !p)} style={styles.readMoreBtn}>
            <Text style={styles.readMoreText}>{bioExpanded ? 'Ver menos' : 'Ver más'}</Text>
            <Ionicons name={bioExpanded ? 'chevron-up' : 'chevron-down'} size={14} color={colors.primary} />
          </Pressable>
        </View>

        {/* ══ PRO INFO ══ */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Información profesional</Text>
          <View style={styles.infoPairs}>
            <InfoPair label="Experiencia"     value={artist.experience} />
            <View style={styles.divider} />
            <InfoPair label="Estilo"          value={artist.style} />
            <View style={styles.divider} />
            <InfoPair label="Disponibilidad"  value={artist.availability} valueColor={isAvailable ? colors.success : '#f59e0b'} />
            <View style={styles.divider} />
            <InfoPair label="Tiempo de resp." value={artist.responseTime || 'No especificado'} />
          </View>
        </View>

        {/* ══ STATS ══ */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Ionicons name="star"        size={22} color={colors.starYellow} />
            <Text style={styles.statValue}>{artist.rating}</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Ionicons name="chatbubble"  size={22} color={colors.primary} />
            <Text style={styles.statValue}>{artist.reviews}</Text>
            <Text style={styles.statLabel}>Reseñas</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Ionicons name="time"        size={22} color={colors.success} />
            <Text style={styles.statValue}>{artist.responseTime}</Text>
            <Text style={styles.statLabel}>Respuesta</Text>
          </View>
        </View>

        {/* ══ TABS ══ */}
        <View style={styles.tabsCard}>
          <View style={styles.tabBar}>
            {([
              { id: 'services',  label: 'Servicios',  icon: 'briefcase'   },
              { id: 'portfolio', label: 'Portafolio', icon: 'grid'        },
              { id: 'reviews',   label: 'Reseñas',    icon: 'chatbubbles' },
            ] as const).map(t => (
              <Pressable
                key={t.id}
                style={[styles.tabItem, activeTab === t.id && styles.tabItemActive]}
                onPress={() => handleTab(t.id)}
              >
                <Ionicons name={t.icon as any} size={15} color={activeTab === t.id ? colors.primary : colors.textSecondary} />
                <Text style={[styles.tabLabel, activeTab === t.id && styles.tabLabelActive]}>{t.label}</Text>
              </Pressable>
            ))}
          </View>

          {/* Servicios con precio */}
          {activeTab === 'services' && (
            <View style={styles.tabContent}>
              {artist.services.map((service: any, i: number) => {
                const name  = typeof service === 'string' ? service : service.name;
                const price = typeof service === 'object' && service.price ? service.price : null;
                return (
                  <View key={i} style={styles.serviceRow}>
                    <View style={styles.serviceLeft}>
                      <View style={styles.serviceIconCircle}>
                        <Ionicons name="checkmark" size={13} color={colors.success} />
                      </View>
                      <Text style={styles.serviceText}>{name}</Text>
                    </View>
                    {price !== null
                      ? <Text style={styles.servicePrice}>{formatCOP(price)}</Text>
                      : <Text style={styles.servicePriceAsk}>Consultar</Text>
                    }
                  </View>
                );
              })}
            </View>
          )}

          {/* Portafolio — overlay fix */}
          {activeTab === 'portfolio' && (
            <View style={styles.tabContent}>
              <View style={styles.galleryGrid}>
                {artist.gallery.map((img: string, i: number) => {
                  const sz = (CARD_WIDTH - 56) / 2;
                  return (
                    <Pressable
                      key={i}
                      onPress={() => openGallery(i)}
                      style={({ pressed }) => [
                        styles.galleryThumb,
                        { width: sz, height: sz },
                        pressed && { opacity: 0.75 },
                      ]}
                    >
                      <Image source={{ uri: img }} style={StyleSheet.absoluteFill} contentFit="cover" transition={200} />
                      <View style={styles.galleryOverlay}>
                        <Ionicons name="expand-outline" size={20} color="#fff" />
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}

          {/* Reseñas */}
          {activeTab === 'reviews' && (
            <View style={styles.tabContent}>
              {MOCK_REVIEWS.map(r => <ReviewCard key={r.id} review={r} />)}
            </View>
          )}
        </View>

        {/* ══ CTA ══ */}
        <View style={styles.ctaRow}>
          <Pressable onPress={onMessage} style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.7 }]}>
            <Ionicons name="chatbubble-outline" size={20} color={colors.text} />
          </Pressable>
          <Pressable onPress={onShare} style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.7 }]}>
            <Ionicons name="share-social-outline" size={20} color={colors.text} />
          </Pressable>
          <Pressable
            onPress={() => {
              if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              onHire?.();
            }}
            style={({ pressed }) => [styles.hireBtn, pressed && { opacity: 0.9, transform: [{ scale: 0.97 }] }]}
          >
            <Ionicons name="briefcase-outline" size={16} color="#fff" />
            <Text style={styles.hireBtnText}>{ctaLabel}</Text>
          </Pressable>
        </View>

      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { width: CARD_WIDTH, gap: 12, paddingBottom: 8 },

  // mini header
  miniHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#fff', borderRadius: 18, padding: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  avatar: { width: 54, height: 54, borderRadius: 27, backgroundColor: colors.background },
  avatarFallback: { alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  headerMeta: { flex: 1, gap: 2 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  artistName: { fontSize: 15, fontFamily: 'PlusJakartaSans_700Bold', color: colors.text, flex: 1 },
  artistCategory: { fontSize: 12, fontFamily: 'PlusJakartaSans_500Medium', color: colors.textSecondary },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 1 },
  locationText: { fontSize: 11, fontFamily: 'PlusJakartaSans_400Regular', color: colors.textSecondary },
  availPill: { flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5 },
  availDot: { width: 7, height: 7, borderRadius: 4 },
  availText: { fontSize: 11, fontFamily: 'PlusJakartaSans_600SemiBold' },

  // card
  card: {
    backgroundColor: '#fff', borderRadius: 18, padding: 18,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  sectionTitle: { fontSize: 15, fontFamily: 'PlusJakartaSans_700Bold', color: colors.text, marginBottom: 12 },
  bioText: { fontSize: 14, fontFamily: 'PlusJakartaSans_400Regular', color: colors.textSecondary, lineHeight: 22 },
  readMoreBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8, alignSelf: 'flex-start' },
  readMoreText: { fontSize: 13, fontFamily: 'PlusJakartaSans_600SemiBold', color: colors.primary },
  infoPairs: { gap: 2 },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 8 },

  // stats
  statsCard: {
    flexDirection: 'row', backgroundColor: '#fff', borderRadius: 18, padding: 18,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  statItem: { flex: 1, alignItems: 'center', gap: 5 },
  statDivider: { width: 1, backgroundColor: colors.border },
  statValue: { fontSize: 20, fontFamily: 'PlusJakartaSans_700Bold', color: colors.text },
  statLabel: { fontSize: 11, fontFamily: 'PlusJakartaSans_500Medium', color: colors.textSecondary },

  // tabs
  tabsCard: {
    backgroundColor: '#fff', borderRadius: 18, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  tabBar: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.border },
  tabItem: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 5, paddingVertical: 13, borderBottomWidth: 2, borderBottomColor: 'transparent',
  },
  tabItemActive: { borderBottomColor: colors.primary },
  tabLabel: { fontSize: 12, fontFamily: 'PlusJakartaSans_500Medium', color: colors.textSecondary },
  tabLabelActive: { fontFamily: 'PlusJakartaSans_700Bold', color: colors.primary },
  tabContent: { padding: 14, gap: 8 },

  // services
  serviceRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 10, paddingHorizontal: 12,
    backgroundColor: colors.background, borderRadius: 12,
    borderWidth: 1, borderColor: colors.border,
  },
  serviceLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  serviceIconCircle: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: 'rgba(16,185,129,0.12)',
    alignItems: 'center', justifyContent: 'center',
  },
  serviceText: { fontSize: 13, fontFamily: 'PlusJakartaSans_500Medium', color: colors.text, flex: 1 },
  servicePrice: { fontSize: 13, fontFamily: 'PlusJakartaSans_700Bold', color: colors.primary },
  servicePriceAsk: { fontSize: 12, fontFamily: 'PlusJakartaSans_500Medium', color: colors.textSecondary },

  // gallery
  galleryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  galleryThumb: { borderRadius: 14, overflow: 'hidden', backgroundColor: colors.background },
  galleryOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.28)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // cta
  ctaRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingTop: 4 },
  iconBtn: {
    width: 48, height: 48, borderRadius: 14,
    backgroundColor: '#f9fafb', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: colors.border,
  },
  hireBtn: {
    flex: 1, height: 48, borderRadius: 14, backgroundColor: colors.primary,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  hireBtnText: { fontSize: 14, fontFamily: 'PlusJakartaSans_700Bold', color: '#fff' },
});