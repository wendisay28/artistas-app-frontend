// ─────────────────────────────────────────────────────────────────────────────
// VenueDetails.tsx — Full scrollable detail view for a Venue (sala/espacio)
// Sections: tags · about · venue specs · amenities · stats · tabs · CTA
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { colors } from '../../../constants/colors';
import InfoPair from '../shared/InfoPair';
import ReviewCard from '../shared/ReviewCard';
import GalleryModal from '../shared/GalleryModal';
import type { Venue, Review } from '../../../types/explore';
import { CARD_WIDTH } from '../cards/SwipeCard';

// ── Mock reviews ──────────────────────────────────────────────────────────────

const MOCK_REVIEWS: Review[] = [
  {
    id: 'r1',
    authorName: 'Diego M.',
    rating: 5,
    text: 'Espacio increíble, el sonido es perfecto y el equipo muy profesional. Repetiremos sin duda.',
    date: 'Hace 1 semana',
  },
  {
    id: 'r2',
    authorName: 'Patricia L.',
    rating: 4,
    text: 'Muy buen espacio para eventos. El estacionamiento es un poco limitado pero todo lo demás es excelente.',
    date: 'Hace 1 mes',
  },
];

// ── Tag color map ─────────────────────────────────────────────────────────────

const TAG_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Teatro:        { bg: 'rgba(99,102,241,.12)',  text: '#a5b4fc', border: 'rgba(99,102,241,.3)' },
  Conciertos:    { bg: 'rgba(239,68,68,.12)',   text: '#fca5a5', border: 'rgba(239,68,68,.3)'  },
  Exposiciones:  { bg: 'rgba(16,185,129,.12)',  text: '#6ee7b7', border: 'rgba(16,185,129,.3)' },
  Conferencias:  { bg: 'rgba(245,158,11,.12)',  text: '#fcd34d', border: 'rgba(245,158,11,.3)' },
  Bodas:         { bg: 'rgba(236,72,153,.12)',  text: '#f9a8d4', border: 'rgba(236,72,153,.3)' },
  Corporativo:   { bg: 'rgba(56,189,248,.12)',  text: '#7dd3fc', border: 'rgba(56,189,248,.3)' },
  'Al aire libre':{ bg:'rgba(16,185,129,.12)',  text: '#6ee7b7', border: 'rgba(16,185,129,.3)' },
};
const defaultTag = { bg: colors.background, text: colors.textSecondary, border: colors.border };

// ── Amenity icon map ──────────────────────────────────────────────────────────

const AMENITY_ICONS: Record<string, string> = {
  'Sonido profesional':  'musical-notes-outline',
  'Camerinos':           'shirt-outline',
  'Iluminación':         'bulb-outline',
  'Estacionamiento':     'car-outline',
  'Bar':                 'wine-outline',
  'Cocina':              'restaurant-outline',
  'Aire acondicionado':  'thermometer-outline',
  'Wifi':                'wifi-outline',
  'Accesible':           'accessibility-outline',
  'Terraza':             'sunny-outline',
  'Proyector':           'film-outline',
  'Piano':               'musical-note-outline',
};
const getAmenityIcon = (a: string) => AMENITY_ICONS[a] ?? 'checkmark-circle-outline';

// ── Props ─────────────────────────────────────────────────────────────────────

interface VenueDetailsProps {
  venue: Venue;
  onReserve?: () => void;
  onContact?: () => void;
  onShare?: () => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function VenueDetails({
  venue,
  onReserve,
  onContact,
  onShare,
}: VenueDetailsProps) {
  const [activeTab,    setActiveTab]    = useState<'amenities' | 'gallery' | 'reviews'>('amenities');
  const [galleryOpen,  setGalleryOpen]  = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [bioExpanded,  setBioExpanded]  = useState(false);

  const isAvailable = venue.availability === 'Disponible';

  const openGallery = (index: number) => {
    setGalleryIndex(index);
    setGalleryOpen(true);
  };

  const handleTabPress = (tab: typeof activeTab) => {
    if (Platform.OS !== 'web') Haptics.selectionAsync();
    setActiveTab(tab);
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      {galleryOpen && (
        <GalleryModal
          images={venue.gallery}
          initialIndex={galleryIndex}
          onClose={() => setGalleryOpen(false)}
        />
      )}

      <View style={styles.container}>

        {/* ══════════ TAGS ROW ══════════ */}
        <View style={styles.tagsRow}>
          {venue.tags.map((tag: string, i: number) => {
            const c = TAG_COLORS[tag] ?? defaultTag;
            return (
              <View key={i} style={[styles.tag, { backgroundColor: c.bg, borderColor: c.border }]}>
                <Text style={[styles.tagText, { color: c.text }]}>{tag}</Text>
              </View>
            );
          })}
        </View>

        {/* ══════════ ABOUT ══════════ */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Sobre el espacio</Text>
          <Text
            style={styles.bioText}
            numberOfLines={bioExpanded ? undefined : 3}
          >
            {venue.bio}
          </Text>
          <Pressable
            onPress={() => setBioExpanded(p => !p)}
            style={styles.readMoreBtn}
          >
            <Text style={styles.readMoreText}>
              {bioExpanded ? 'Ver menos' : 'Ver más'}
            </Text>
            <Ionicons
              name={bioExpanded ? 'chevron-up' : 'chevron-down'}
              size={14}
              color={colors.primary}
            />
          </Pressable>
        </View>

        {/* ══════════ VENUE SPECS ══════════ */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Información del espacio</Text>
          <View style={styles.infoPairs}>
            <InfoPair label="Categoría"       value={venue.category} />
            <View style={styles.divider} />
            <InfoPair label="Capacidad"       value={`${venue.capacity.toLocaleString('es-CO')} personas`} />
            <View style={styles.divider} />
            <InfoPair label="Horario"         value={venue.openingHours} />
            <View style={styles.divider} />
            <InfoPair label="Ubicación"       value={venue.location} />
            <View style={styles.divider} />
            <InfoPair label="Tiempo de resp." value={venue.responseTime} />
            <View style={styles.divider} />
            <InfoPair
              label="Disponibilidad"
              value={venue.availability}
              valueColor={isAvailable ? colors.success : '#f59e0b'}
            />
          </View>
        </View>

        {/* ══════════ CAPACITY VISUAL ══════════ */}
        <View style={styles.capacityCard}>
          <View style={styles.capacityLeft}>
            <View style={styles.capacityIconCircle}>
              <Ionicons name="people" size={24} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.capacityNumber}>
                {venue.capacity.toLocaleString('es-CO')}
              </Text>
              <Text style={styles.capacityLabel}>personas máx.</Text>
            </View>
          </View>
          <View style={styles.capacityDivider} />
          <View style={styles.capacityRight}>
            <View style={[
              styles.statusDotLarge,
              { backgroundColor: isAvailable ? '#10B981' : '#f59e0b' },
            ]} />
            <View>
              <Text style={[
                styles.capacityNumber,
                { color: isAvailable ? colors.success : '#f59e0b', fontSize: 15 },
              ]}>
                {isAvailable ? 'Disponible' : 'Reservado'}
              </Text>
              <Text style={styles.capacityLabel}>estado actual</Text>
            </View>
          </View>
        </View>

        {/* ══════════ STATS ══════════ */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Ionicons name="star" size={22} color={colors.starYellow} />
            <Text style={styles.statValue}>{venue.rating}</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Ionicons name="chatbubble" size={22} color={colors.primary} />
            <Text style={styles.statValue}>{venue.reviews}</Text>
            <Text style={styles.statLabel}>Reseñas</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Ionicons name="time" size={22} color={colors.success} />
            <Text style={styles.statValue}>{venue.responseTime}</Text>
            <Text style={styles.statLabel}>Respuesta</Text>
          </View>
        </View>

        {/* ══════════ TABS ══════════ */}
        <View style={styles.tabsCard}>

          {/* tab bar */}
          <View style={styles.tabBar}>
            {(
              [
                { id: 'amenities', label: 'Servicios', icon: 'sparkles'   },
                { id: 'gallery',   label: 'Fotos',     icon: 'images'     },
                { id: 'reviews',   label: 'Reseñas',   icon: 'chatbubbles'},
              ] as const
            ).map(t => (
              <Pressable
                key={t.id}
                style={[styles.tabItem, activeTab === t.id && styles.tabItemActive]}
                onPress={() => handleTabPress(t.id)}
              >
                <Ionicons
                  name={t.icon as any}
                  size={15}
                  color={activeTab === t.id ? colors.primary : colors.textSecondary}
                />
                <Text style={[
                  styles.tabLabel,
                  activeTab === t.id && styles.tabLabelActive,
                ]}>
                  {t.label}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* ── Amenities tab ── */}
          {activeTab === 'amenities' && (
            <View style={styles.tabContent}>
              <View style={styles.amenitiesGrid}>
                {venue.amenities.map((amenity: string, i: number) => (
                  <View key={i} style={styles.amenityItem}>
                    <View style={styles.amenityIconCircle}>
                      <Ionicons
                        name={getAmenityIcon(amenity) as any}
                        size={18}
                        color={colors.primary}
                      />
                    </View>
                    <Text style={styles.amenityText}>{amenity}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* ── Gallery tab ── */}
          {activeTab === 'gallery' && (
            <View style={styles.tabContent}>
              <View style={styles.galleryGrid}>
                {venue.gallery.map((img: string, i: number) => {
                  const thumbSize = (CARD_WIDTH - 56) / 2;
                  return (
                    <Pressable
                      key={i}
                      onPress={() => openGallery(i)}
                      style={({ pressed }) => [
                        styles.galleryThumb,
                        { width: thumbSize, height: thumbSize },
                        pressed && { opacity: 0.8 },
                      ]}
                    >
                      <Image
                        source={{ uri: img }}
                        style={StyleSheet.absoluteFill}
                        contentFit="cover"
                        transition={200}
                      />
                      <View style={styles.galleryThumbOverlay}>
                        <Ionicons name="expand-outline" size={18} color="#fff" />
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}

          {/* ── Reviews tab ── */}
          {activeTab === 'reviews' && (
            <View style={styles.tabContent}>
              {MOCK_REVIEWS.map(review => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </View>
          )}

        </View>

        {/* ══════════ WEBSITE LINK (if available) ══════════ */}
        {venue.website && (
          <View style={styles.websiteRow}>
            <Ionicons name="globe-outline" size={16} color={colors.primary} />
            <Text style={styles.websiteText}>{venue.website}</Text>
            <Ionicons name="open-outline" size={14} color={colors.primary} />
          </View>
        )}

        {/* ══════════ BOTTOM CTA ══════════ */}
        <View style={styles.ctaRow}>
          {/* price block */}
          <View style={styles.priceBlock}>
            {venue.price > 0 ? (
              <>
                <Text style={styles.priceValue}>
                  ${venue.price.toLocaleString('es-CO', { maximumFractionDigits: 0 })}
                </Text>
                <Text style={styles.priceLabel}>/hora</Text>
              </>
            ) : (
              <Text style={styles.priceConsult}>Consultar</Text>
            )}
          </View>

          {/* share */}
          <Pressable
            onPress={onShare}
            style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.7 }]}
          >
            <Ionicons name="share-social-outline" size={20} color={colors.text} />
          </Pressable>

          {/* contact */}
          <Pressable
            onPress={onContact}
            style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.7 }]}
          >
            <Ionicons name="chatbubble-outline" size={20} color={colors.text} />
          </Pressable>

          {/* reserve CTA */}
          <Pressable
            onPress={() => {
              if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              onReserve?.();
            }}
            disabled={!isAvailable}
            style={({ pressed }) => [
              styles.reserveBtn,
              !isAvailable && styles.reserveBtnDisabled,
              pressed && isAvailable && { opacity: 0.9, transform: [{ scale: 0.97 }] },
            ]}
          >
            <Ionicons name="calendar-outline" size={16} color="#fff" />
            <Text style={styles.reserveBtnText}>
              {isAvailable ? 'Reservar espacio' : 'No disponible'}
            </Text>
          </Pressable>
        </View>

      </View>
    </>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    gap: 12,
    paddingBottom: 8,
  },

  // tags
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
    paddingHorizontal: 2,
  },
  tag: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  tagText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },

  // shared card
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.text,
    marginBottom: 12,
  },

  // bio
  bioText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textSecondary,
    lineHeight: 22,
  },
  readMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  readMoreText: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: colors.primary,
  },

  // info pairs
  infoPairs: { gap: 2 },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 8,
  },

  // capacity visual card
  capacityCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  capacityLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  capacityIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  capacityNumber: {
    fontSize: 20,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.text,
  },
  capacityLabel: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textSecondary,
    marginTop: 1,
  },
  capacityDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border,
    marginHorizontal: 16,
  },
  capacityRight: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statusDotLarge: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },

  // stats
  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 5,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
  },
  statValue: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.text,
  },
  statLabel: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: colors.textSecondary,
  },

  // tabs card
  tabsCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tabItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 13,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabItemActive: {
    borderBottomColor: colors.primary,
  },
  tabLabel: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: colors.textSecondary,
  },
  tabLabelActive: {
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.primary,
  },
  tabContent: {
    padding: 14,
    gap: 10,
  },

  // amenities grid
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  amenityItem: {
    width: '46%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.background,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  amenityIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  amenityText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: colors.text,
    flex: 1,
  },

  // gallery
  galleryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  galleryThumb: {
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: colors.background,
  },
  galleryThumbOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // website row
  websiteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.primary + '0e',
    borderWidth: 1,
    borderColor: colors.primary + '25',
    borderRadius: 14,
    padding: 14,
  },
  websiteText: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: colors.primary,
  },

  // cta row
  ctaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 4,
  },
  priceBlock: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
    minWidth: 72,
  },
  priceValue: {
    fontSize: 17,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.text,
  },
  priceLabel: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textSecondary,
  },
  priceConsult: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: colors.textSecondary,
  },
  iconBtn: {
    width: 46,
    height: 46,
    borderRadius: 13,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  reserveBtn: {
    flex: 1,
    height: 46,
    borderRadius: 13,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  reserveBtnDisabled: {
    backgroundColor: colors.textSecondary,
    shadowOpacity: 0,
    elevation: 0,
  },
  reserveBtnText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#fff',
  },
});