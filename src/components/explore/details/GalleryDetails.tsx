// ─────────────────────────────────────────────────────────────────────────────
// GalleryDetails.tsx — Full scrollable detail view for a GalleryItem (artwork)
// Sections: tags · description · artwork specs · stats · tabs (info/gallery/reviews) · CTA
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
import type { GalleryItem, Review } from '../../../types/explore';
import { CARD_WIDTH } from '../cards/SwipeCard';

// ── Mock reviews ──────────────────────────────────────────────────────────────

const MOCK_REVIEWS: Review[] = [
  {
    id: 'r1',
    authorName: 'Isabel F.',
    rating: 5,
    text: 'Una obra que te deja sin palabras. Los colores y la técnica son excepcionales.',
    date: 'Hace 3 días',
  },
  {
    id: 'r2',
    authorName: 'Roberto C.',
    rating: 5,
    text: 'La adquirí para mi galería y ha sido el centro de atención desde el primer día.',
    date: 'Hace 2 semanas',
  },
];

// ── Tag color map ─────────────────────────────────────────────────────────────

const TAG_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Pintura:       { bg: 'rgba(99,102,241,.12)',  text: '#a5b4fc', border: 'rgba(99,102,241,.3)' },
  Escultura:     { bg: 'rgba(245,158,11,.12)',  text: '#fcd34d', border: 'rgba(245,158,11,.3)' },
  Fotografía:    { bg: 'rgba(236,72,153,.12)',  text: '#f9a8d4', border: 'rgba(236,72,153,.3)' },
  Digital:       { bg: 'rgba(16,185,129,.12)',  text: '#6ee7b7', border: 'rgba(16,185,129,.3)' },
  Acuarela:      { bg: 'rgba(56,189,248,.12)',  text: '#7dd3fc', border: 'rgba(56,189,248,.3)' },
  Abstracto:     { bg: 'rgba(239,68,68,.12)',   text: '#fca5a5', border: 'rgba(239,68,68,.3)'  },
  Contemporáneo: { bg: 'rgba(99,102,241,.12)',  text: '#a5b4fc', border: 'rgba(99,102,241,.3)' },
  'En venta':    { bg: 'rgba(16,185,129,.12)',  text: '#6ee7b7', border: 'rgba(16,185,129,.3)' },
};
const defaultTag = { bg: colors.background, text: colors.textSecondary, border: colors.border };

// ── Props ─────────────────────────────────────────────────────────────────────

interface GalleryDetailsProps {
  item: GalleryItem;
  onBuy?: () => void;
  onContact?: () => void;
  onShare?: () => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function GalleryDetails({
  item,
  onBuy,
  onContact,
  onShare,
}: GalleryDetailsProps) {
  const [activeTab,    setActiveTab]    = useState<'info' | 'gallery' | 'reviews'>('info');
  const [galleryOpen,  setGalleryOpen]  = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [bioExpanded,  setBioExpanded]  = useState(false);

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
          images={item.gallery}
          initialIndex={galleryIndex}
          onClose={() => setGalleryOpen(false)}
        />
      )}

      <View style={styles.container}>

        {/* ══════════ TAGS ROW ══════════ */}
        <View style={styles.tagsRow}>
          {item.tags.map((tag: string, i: number) => {
            const c = TAG_COLORS[tag] ?? defaultTag;
            return (
              <View key={i} style={[styles.tag, { backgroundColor: c.bg, borderColor: c.border }]}>
                <Text style={[styles.tagText, { color: c.text }]}>{tag}</Text>
              </View>
            );
          })}
          {item.forSale && (
            <View style={[styles.tag, {
              backgroundColor: 'rgba(16,185,129,.12)',
              borderColor: 'rgba(16,185,129,.3)',
            }]}>
              <Ionicons name="pricetag-outline" size={11} color="#6ee7b7" />
              <Text style={[styles.tagText, { color: '#6ee7b7', marginLeft: 4 }]}>En venta</Text>
            </View>
          )}
        </View>

        {/* ══════════ ABOUT THE WORK ══════════ */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Sobre la obra</Text>
          <Text
            style={styles.bioText}
            numberOfLines={bioExpanded ? undefined : 3}
          >
            {item.bio}
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

        {/* ══════════ ARTIST STRIP ══════════ */}
        <View style={styles.artistStrip}>
          <View style={styles.artistAvatarCircle}>
            <Ionicons name="person" size={20} color={colors.primary} />
          </View>
          <View style={styles.artistMeta}>
            <Text style={styles.artistLabel}>Artista</Text>
            <Text style={styles.artistName}>{item.artistName}</Text>
          </View>
          {item.verified && (
            <Ionicons name="checkmark-circle" size={18} color="#818cf8" />
          )}
          <Pressable
            onPress={onContact}
            style={({ pressed }) => [styles.contactArtistBtn, pressed && { opacity: 0.7 }]}
          >
            <Text style={styles.contactArtistText}>Ver perfil</Text>
            <Ionicons name="arrow-forward" size={13} color={colors.primary} />
          </Pressable>
        </View>

        {/* ══════════ ARTWORK SPECS ══════════ */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Ficha técnica</Text>
          <View style={styles.infoPairs}>
            <InfoPair label="Técnica"      value={item.medium} />
            <View style={styles.divider} />
            <InfoPair label="Dimensiones"  value={item.dimensions} />
            <View style={styles.divider} />
            <InfoPair label="Año"          value={String(item.year)} />
            <View style={styles.divider} />
            <InfoPair label="Ubicación"    value={item.location} />
            <View style={styles.divider} />
            <InfoPair
              label="Disponibilidad"
              value={item.availability}
              valueColor={item.availability === 'Disponible' ? colors.success : '#f59e0b'}
            />
          </View>
        </View>

        {/* ══════════ STATS ══════════ */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Ionicons name="star" size={22} color={colors.starYellow} />
            <Text style={styles.statValue}>{item.rating}</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Ionicons name="eye" size={22} color={colors.primary} />
            <Text style={styles.statValue}>{item.reviews}</Text>
            <Text style={styles.statLabel}>Vistas</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Ionicons
              name={item.forSale ? 'pricetag' : 'lock-closed'}
              size={22}
              color={item.forSale ? colors.success : colors.textSecondary}
            />
            <Text style={[
              styles.statValue,
              { color: item.forSale ? colors.success : colors.textSecondary, fontSize: 13 },
            ]}>
              {item.forSale ? 'En venta' : 'No disponible'}
            </Text>
            <Text style={styles.statLabel}>Estado</Text>
          </View>
        </View>

        {/* ══════════ TABS ══════════ */}
        <View style={styles.tabsCard}>

          {/* tab bar */}
          <View style={styles.tabBar}>
            {(
              [
                { id: 'info',    label: 'Detalles', icon: 'information-circle' },
                { id: 'gallery', label: 'Galería',  icon: 'images'             },
                { id: 'reviews', label: 'Reseñas',  icon: 'chatbubbles'        },
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
              <View style={styles.specsChipsGrid}>
                {[
                  { icon: 'brush-outline',   label: 'Técnica',     value: item.medium      },
                  { icon: 'resize-outline',  label: 'Dimensiones', value: item.dimensions  },
                  { icon: 'time-outline',    label: 'Año',         value: String(item.year)},
                  { icon: 'location-outline',label: 'Origen',      value: item.location    },
                ].map((spec, i) => (
                  <View key={i} style={styles.specChip}>
                    <View style={styles.specIconCircle}>
                      <Ionicons name={spec.icon as any} size={16} color={colors.primary} />
                    </View>
                    <View style={styles.specMeta}>
                      <Text style={styles.specLabel}>{spec.label}</Text>
                      <Text style={styles.specValue} numberOfLines={1}>{spec.value}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* ── Gallery tab ── */}
          {activeTab === 'gallery' && (
            <View style={styles.tabContent}>
              <View style={styles.galleryGrid}>
                {item.gallery.map((img: string, i: number) => {
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
            {item.price > 0 ? (
              <>
                <Text style={styles.priceValue}>
                  ${item.price.toLocaleString('es-CO', { maximumFractionDigits: 0 })}
                </Text>
                <Text style={styles.priceLabel}>COP</Text>
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

          {/* contact artist */}
          <Pressable
            onPress={onContact}
            style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.7 }]}
          >
            <Ionicons name="chatbubble-outline" size={20} color={colors.text} />
          </Pressable>

          {/* buy / inquire CTA */}
          <Pressable
            onPress={() => {
              if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              onBuy?.();
            }}
            disabled={!item.forSale}
            style={({ pressed }) => [
              styles.buyBtn,
              !item.forSale && styles.buyBtnDisabled,
              pressed && item.forSale && { opacity: 0.9, transform: [{ scale: 0.97 }] },
            ]}
          >
            <Ionicons
              name={item.forSale ? 'bag-handle-outline' : 'lock-closed-outline'}
              size={16}
              color="#fff"
            />
            <Text style={styles.buyBtnText}>
              {item.forSale ? 'Adquirir obra' : 'No disponible'}
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
    flexDirection: 'row',
    alignItems: 'center',
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

  // artist strip
  artistStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  artistAvatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary + '18',
    alignItems: 'center',
    justifyContent: 'center',
  },
  artistMeta: { flex: 1 },
  artistLabel: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textSecondary,
  },
  artistName: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.text,
  },
  contactArtistBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primary + '12',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: colors.primary + '30',
  },
  contactArtistText: {
    fontSize: 12,
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
    textAlign: 'center',
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

  // specs chips grid (info tab)
  specsChipsGrid: {
    gap: 8,
  },
  specChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.background,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  specIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  specMeta: { flex: 1 },
  specLabel: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textSecondary,
  },
  specValue: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: colors.text,
    marginTop: 1,
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
    gap: 3,
    minWidth: 70,
  },
  priceValue: {
    fontSize: 16,
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