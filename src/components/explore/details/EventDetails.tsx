// ─────────────────────────────────────────────────────────────────────────────
// EventDetails.tsx — Full scrollable detail view for an Event
// Sections: tags · about · event info · stats · tabs (info/gallery/reviews) · CTA
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
import InfoPair from '../shared/InfoPair';
import ReviewCard from '../shared/ReviewCard';
import GalleryModal from '../shared/GalleryModal';
import type { Event, Review } from '../../../types/explore';
import { CARD_WIDTH } from '../cards/SwipeCard';

// ── Mock reviews ──────────────────────────────────────────────────────────────

const MOCK_REVIEWS: Review[] = [
  {
    id: 'r1',
    authorName: 'Valentina M.',
    rating: 5,
    text: 'Una experiencia increíble. La organización fue impecable y el ambiente inmejorable.',
    date: 'Hace 1 semana',
  },
  {
    id: 'r2',
    authorName: 'Andrés T.',
    rating: 4,
    text: 'Muy buen evento, el sonido estuvo excelente. Volvería sin dudarlo.',
    date: 'Hace 3 semanas',
  },
];

// ── Tag color map ─────────────────────────────────────────────────────────────

const TAG_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Concierto:    { bg: 'rgba(99,102,241,.12)',  text: '#a5b4fc', border: 'rgba(99,102,241,.3)' },
  Jazz:         { bg: 'rgba(99,102,241,.12)',  text: '#a5b4fc', border: 'rgba(99,102,241,.3)' },
  Flamenco:     { bg: 'rgba(239,68,68,.12)',   text: '#fca5a5', border: 'rgba(239,68,68,.3)'  },
  Exposición:   { bg: 'rgba(16,185,129,.12)',  text: '#6ee7b7', border: 'rgba(16,185,129,.3)' },
  Teatro:       { bg: 'rgba(245,158,11,.12)',  text: '#fcd34d', border: 'rgba(245,158,11,.3)' },
  Fotografía:   { bg: 'rgba(236,72,153,.12)',  text: '#f9a8d4', border: 'rgba(236,72,153,.3)' },
  Arte:         { bg: 'rgba(16,185,129,.12)',  text: '#6ee7b7', border: 'rgba(16,185,129,.3)' },
  Gratuito:     { bg: 'rgba(16,185,129,.12)',  text: '#6ee7b7', border: 'rgba(16,185,129,.3)' },
};
const defaultTag = { bg: colors.background, text: colors.textSecondary, border: colors.border };

// ── Props ─────────────────────────────────────────────────────────────────────

interface EventDetailsProps {
  event: Event;
  onBuyTicket?: () => void;
  onShare?: () => void;
  onViewDetails?: () => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function EventDetails({
  event,
  onBuyTicket,
  onShare,
  onViewDetails,
}: EventDetailsProps) {
  const [activeTab,    setActiveTab]    = useState<'info' | 'gallery' | 'reviews'>('info');
  const [galleryOpen,  setGalleryOpen]  = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [descExpanded, setDescExpanded] = useState(false);

  const isFree  = event.price === 0;
  const soldOut = event.ticketsLeft !== undefined && event.ticketsLeft === 0;
  const lowStock = event.ticketsLeft !== undefined
    && event.ticketsLeft > 0
    && event.ticketsLeft <= 20;

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
          images={event.gallery}
          initialIndex={galleryIndex}
          onClose={() => setGalleryOpen(false)}
        />
      )}

      <View style={styles.container}>

        {/* ══════════ TAGS ROW ══════════ */}
        <View style={styles.tagsRow}>
          {event.tags.map((tag: string, i: number) => {
            const c = TAG_COLORS[tag] ?? defaultTag;
            return (
              <View key={i} style={[styles.tag, { backgroundColor: c.bg, borderColor: c.border }]}>
                <Text style={[styles.tagText, { color: c.text }]}>{tag}</Text>
              </View>
            );
          })}
        </View>

        {/* ══════════ DESCRIPTION ══════════ */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Sobre el evento</Text>
          <Text
            style={styles.descText}
            numberOfLines={descExpanded ? undefined : 3}
          >
            {event.description}
          </Text>
          <Pressable
            onPress={() => setDescExpanded(p => !p)}
            style={styles.readMoreBtn}
          >
            <Text style={styles.readMoreText}>
              {descExpanded ? 'Ver menos' : 'Ver más'}
            </Text>
            <Ionicons
              name={descExpanded ? 'chevron-up' : 'chevron-down'}
              size={14}
              color={colors.primary}
            />
          </Pressable>
        </View>

        {/* ══════════ EVENT INFO ══════════ */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Detalles del evento</Text>
          <View style={styles.infoPairs}>
            <InfoPair label="Fecha"        value={event.date} />
            <View style={styles.divider} />
            {event.time && (
              <>
                <InfoPair label="Hora"     value={event.time} />
                <View style={styles.divider} />
              </>
            )}
            <InfoPair label="Lugar"        value={event.venue} />
            <View style={styles.divider} />
            {event.city && (
              <>
                <InfoPair label="Ciudad"   value={event.city} />
                <View style={styles.divider} />
              </>
            )}
            <InfoPair
              label="Ubicación"
              value={event.location}
            />
            <View style={styles.divider} />
            <InfoPair
              label="Tiempo de respuesta"
              value={event.responseTime}
            />
          </View>
        </View>

        {/* ══════════ STATS ══════════ */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Ionicons name="star" size={22} color={colors.starYellow} />
            <Text style={styles.statValue}>{event.rating}</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Ionicons name="chatbubble" size={22} color={colors.primary} />
            <Text style={styles.statValue}>{event.reviews}</Text>
            <Text style={styles.statLabel}>Reseñas</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Ionicons
              name="ticket"
              size={22}
              color={soldOut ? colors.primary : colors.success}
            />
            <Text style={[
              styles.statValue,
              soldOut && { color: colors.primary },
            ]}>
              {soldOut
                ? 'Agotado'
                : event.ticketsLeft !== undefined
                  ? event.ticketsLeft
                  : '∞'}
            </Text>
            <Text style={styles.statLabel}>Entradas</Text>
          </View>
        </View>

        {/* ══════════ LOW STOCK ALERT ══════════ */}
        {lowStock && (
          <View style={styles.alertRow}>
            <Ionicons name="alert-circle" size={16} color="#fbbf24" />
            <Text style={styles.alertText}>
              ¡Solo quedan {event.ticketsLeft} entradas disponibles!
            </Text>
          </View>
        )}

        {/* ══════════ TABS ══════════ */}
        <View style={styles.tabsCard}>

          {/* tab bar */}
          <View style={styles.tabBar}>
            {(
              [
                { id: 'info',    label: 'Info',       icon: 'information-circle' },
                { id: 'gallery', label: 'Galería',    icon: 'images'             },
                { id: 'reviews', label: 'Reseñas',    icon: 'chatbubbles'        },
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

          {/* ── Info tab ── */}
          {activeTab === 'info' && (
            <View style={styles.tabContent}>
              {/* organizer row */}
              <View style={styles.organizerRow}>
                <View style={styles.organizerAvatar}>
                  <Ionicons name="person" size={18} color={colors.primary} />
                </View>
                <View style={styles.organizerMeta}>
                  <Text style={styles.organizerLabel}>Organizado por</Text>
                  <Text style={styles.organizerName}>{event.name}</Text>
                </View>
                <Ionicons name="checkmark-circle" size={18} color="#818cf8" />
              </View>

              <View style={styles.infoChipsGrid}>
                {[
                  { icon: 'calendar-outline',  text: event.date },
                  { icon: 'time-outline',      text: event.time ?? 'Por confirmar' },
                  { icon: 'location-outline',  text: event.city ?? 'Por confirmar' },
                  { icon: 'walk-outline',      text: '2.5 km' },
                ].map((item, i) => (
                  <View key={i} style={styles.infoChip}>
                    <Ionicons name={item.icon as any} size={15} color={colors.primary} />
                    <Text style={styles.infoChipText} numberOfLines={1}>{item.text}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* ── Gallery tab ── */}
          {activeTab === 'gallery' && (
            <View style={styles.tabContent}>
              <View style={styles.galleryGrid}>
                {event.gallery.map((img: string, i: number) => {
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

        {/* ══════════ BOTTOM CTA ══════════ */}
        <View style={styles.ctaRow}>
          {/* price block */}
          <View style={styles.priceBlock}>
            {isFree ? (
              <Text style={styles.priceFree}>Gratis</Text>
            ) : (
              <>
                <Text style={styles.priceValue}>
                  ${event.price.toLocaleString('es-CO', { maximumFractionDigits: 0 })}
                </Text>
                <Text style={styles.priceLabel}>/entrada</Text>
              </>
            )}
          </View>

          {/* share button */}
          <Pressable
            onPress={onShare}
            style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.7 }]}
          >
            <Ionicons name="share-social-outline" size={20} color={colors.text} />
          </Pressable>

          {/* detail button */}
          <Pressable
            onPress={onViewDetails}
            style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.7 }]}
          >
            <Ionicons name="information-circle-outline" size={20} color={colors.text} />
          </Pressable>

          {/* buy ticket CTA */}
          <Pressable
            onPress={() => {
              if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              onBuyTicket?.();
            }}
            disabled={soldOut}
            style={({ pressed }) => [
              styles.buyBtn,
              soldOut && styles.buyBtnDisabled,
              pressed && !soldOut && { opacity: 0.9, transform: [{ scale: 0.97 }] },
            ]}
          >
            <Ionicons name="ticket-outline" size={16} color="#fff" />
            <Text style={styles.buyBtnText}>
              {soldOut ? 'Agotado' : 'Conseguir entrada'}
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

  // description
  descText: {
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

  // low stock alert
  alertRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(245,158,11,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(245,158,11,0.3)',
    borderRadius: 12,
    padding: 12,
  },
  alertText: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#d97706',
    flex: 1,
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

  // organizer row (info tab)
  organizerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: 4,
  },
  organizerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '18',
    alignItems: 'center',
    justifyContent: 'center',
  },
  organizerMeta: { flex: 1 },
  organizerLabel: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textSecondary,
  },
  organizerName: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: colors.text,
  },

  // info chips grid (info tab)
  infoChipsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  infoChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.border,
    minWidth: '45%',
    flex: 1,
  },
  infoChipText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: colors.textSecondary,
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
    minWidth: 70,
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
  priceFree: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.success,
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
  buyBtn: {
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
  buyBtnDisabled: {
    backgroundColor: colors.textSecondary,
    shadowOpacity: 0,
    elevation: 0,
  },
  buyBtnText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#fff',
  },
});