// ─────────────────────────────────────────────────────────────────────────────
// FilterModal.tsx — Modal de filtros avanzados para la pantalla Explore
// Opciones: ordenar · distancia · disponibilidad · precio · rating mínimo
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  Platform,
  Animated as RNAnimated,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { colors } from '../../../constants/colors';
import type { ExploreFilters, SortOption } from '../../../types/explore';

// ── Sort options ──────────────────────────────────────────────────────────────

const SORT_OPTIONS: { id: SortOption; label: string; icon: string }[] = [
  { id: 'rating',      label: 'Mejor rating',    icon: 'star-outline'         },
  { id: 'distance',    label: 'Más cercano',      icon: 'location-outline'     },
  { id: 'price_asc',   label: 'Precio: menor',   icon: 'trending-down-outline' },
  { id: 'price_desc',  label: 'Precio: mayor',   icon: 'trending-up-outline'   },
  { id: 'availability',label: 'Disponibles',     icon: 'checkmark-circle-outline'},
];

// ── Rating options ────────────────────────────────────────────────────────────

const RATING_OPTIONS = [0, 3, 3.5, 4, 4.5];

// ── Default filters ───────────────────────────────────────────────────────────

const DEFAULT_FILTERS: ExploreFilters = {
  sort:           'rating',
  nearMe:         false,
  availableToday: false,
  maxPrice:       undefined,
  minRating:      0,
  tags:           [],
};

// ── Props ─────────────────────────────────────────────────────────────────────

interface FilterModalProps {
  visible:   boolean;
  filters:   ExploreFilters;
  onApply:   (filters: ExploreFilters) => void;
  onClose:   () => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function FilterModal({
  visible,
  filters,
  onApply,
  onClose,
}: FilterModalProps) {
  const insets = useSafeAreaInsets();

  // local draft — only applied on "Aplicar"
  const [draft, setDraft] = useState<ExploreFilters>(filters);

  const slideAnim = useRef(new RNAnimated.Value(600)).current;

  // ── Sync draft when filters prop changes ──────────────────────────────────
  useEffect(() => {
    setDraft(filters);
  }, [filters]);

  // ── Slide animation ────────────────────────────────────────────────────────
  useEffect(() => {
    if (visible) {
      RNAnimated.spring(slideAnim, {
        toValue:         0,
        tension:         65,
        friction:        11,
        useNativeDriver: true,
      }).start();
    } else {
      RNAnimated.timing(slideAnim, {
        toValue:         600,
        duration:        220,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  // ── Helpers ────────────────────────────────────────────────────────────────

  const haptic = () => {
    if (Platform.OS !== 'web') Haptics.selectionAsync();
  };

  const setSort = (sort: SortOption) => {
    haptic();
    setDraft((d: ExploreFilters) => ({ ...d, sort }));
  };

  const toggleNearMe = () => {
    haptic();
    setDraft((d: ExploreFilters) => ({ ...d, nearMe: !d.nearMe }));
  };

  const toggleAvailableToday = () => {
    haptic();
    setDraft((d: ExploreFilters) => ({ ...d, availableToday: !d.availableToday }));
  };

  const setMinRating = (rating: number) => {
    haptic();
    setDraft((d: ExploreFilters) => ({ ...d, minRating: rating }));
  };

  const handleApply = () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onApply(draft);
    onClose();
  };

  const handleReset = () => {
    haptic();
    setDraft({ ...DEFAULT_FILTERS });
  };

  const activeFiltersCount = [
    draft.sort !== 'rating',
    draft.nearMe,
    draft.availableToday,
    (draft.minRating ?? 0) > 0,
    draft.maxPrice !== undefined,
  ].filter(Boolean).length;

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      {/* backdrop */}
      <Pressable style={styles.backdrop} onPress={onClose} />

      {/* sheet */}
      <RNAnimated.View
        style={[
          styles.sheet,
          {
            paddingBottom: (insets.bottom || 0) + 16,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* handle */}
        <View style={styles.handle} />

        {/* header row */}
        <View style={styles.headerRow}>
          <Text style={styles.title}>Filtros</Text>
          {activeFiltersCount > 0 && (
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{activeFiltersCount}</Text>
            </View>
          )}
          <Pressable
            onPress={handleReset}
            style={({ pressed }) => [styles.resetBtn, pressed && { opacity: 0.6 }]}
          >
            <Text style={styles.resetText}>Limpiar</Text>
          </Pressable>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >

          {/* ── ORDENAR POR ── */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Ordenar por</Text>
            <View style={styles.sortGrid}>
              {SORT_OPTIONS.map(opt => {
                const isActive = draft.sort === opt.id;
                return (
                  <Pressable
                    key={opt.id}
                    onPress={() => setSort(opt.id)}
                    style={({ pressed }) => [
                      styles.sortChip,
                      isActive  && styles.sortChipActive,
                      pressed   && { opacity: 0.75 },
                    ]}
                  >
                    <Ionicons
                      name={opt.icon as any}
                      size={14}
                      color={isActive ? colors.primary : colors.textSecondary}
                    />
                    <Text style={[
                      styles.sortChipText,
                      isActive && styles.sortChipTextActive,
                    ]}>
                      {opt.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.divider} />

          {/* ── QUICK TOGGLES ── */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Opciones rápidas</Text>
            <View style={styles.togglesCol}>

              <Pressable
                onPress={toggleNearMe}
                style={({ pressed }) => [
                  styles.toggleRow,
                  pressed && { opacity: 0.75 },
                ]}
              >
                <View style={styles.toggleLeft}>
                  <View style={[
                    styles.toggleIconCircle,
                    draft.nearMe && styles.toggleIconCircleActive,
                  ]}>
                    <Ionicons
                      name="location-outline"
                      size={16}
                      color={draft.nearMe ? colors.primary : colors.textSecondary}
                    />
                  </View>
                  <View>
                    <Text style={styles.toggleLabel}>Cerca de mí</Text>
                    <Text style={styles.toggleSub}>Resultados en tu zona</Text>
                  </View>
                </View>
                <Toggle active={draft.nearMe} />
              </Pressable>

              <View style={styles.toggleDivider} />

              <Pressable
                onPress={toggleAvailableToday}
                style={({ pressed }) => [
                  styles.toggleRow,
                  pressed && { opacity: 0.75 },
                ]}
              >
                <View style={styles.toggleLeft}>
                  <View style={[
                    styles.toggleIconCircle,
                    draft.availableToday && styles.toggleIconCircleActive,
                  ]}>
                    <Ionicons
                      name="calendar-outline"
                      size={16}
                      color={draft.availableToday ? colors.primary : colors.textSecondary}
                    />
                  </View>
                  <View>
                    <Text style={styles.toggleLabel}>Disponible hoy</Text>
                    <Text style={styles.toggleSub}>Solo los que tienen agenda libre</Text>
                  </View>
                </View>
                <Toggle active={draft.availableToday} />
              </Pressable>

            </View>
          </View>

          <View style={styles.divider} />

          {/* ── RATING MÍNIMO ── */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Rating mínimo</Text>
            <View style={styles.ratingRow}>
              {RATING_OPTIONS.map(r => {
                const isActive = (draft.minRating ?? 0) === r;
                return (
                  <Pressable
                    key={r}
                    onPress={() => setMinRating(r)}
                    style={({ pressed }) => [
                      styles.ratingChip,
                      isActive && styles.ratingChipActive,
                      pressed  && { opacity: 0.75 },
                    ]}
                  >
                    {r === 0 ? (
                      <Text style={[
                        styles.ratingChipText,
                        isActive && styles.ratingChipTextActive,
                      ]}>
                        Todos
                      </Text>
                    ) : (
                      <View style={styles.ratingChipInner}>
                        <Ionicons
                          name="star"
                          size={12}
                          color={isActive ? colors.primary : colors.starYellow}
                        />
                        <Text style={[
                          styles.ratingChipText,
                          isActive && styles.ratingChipTextActive,
                        ]}>
                          {r}+
                        </Text>
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.divider} />

          {/* ── PRECIO MÁXIMO ── */}
          <View style={styles.section}>
            <View style={styles.priceLabelRow}>
              <Text style={styles.sectionLabel}>Precio máximo</Text>
              {draft.maxPrice !== undefined && (
                <Text style={styles.priceValue}>
                  ${draft.maxPrice.toLocaleString('es-CO')}
                </Text>
              )}
            </View>
            <View style={styles.priceChipsRow}>
              {[undefined, 50000, 100000, 200000, 500000].map((price, i) => {
                const isActive = draft.maxPrice === price;
                const label = price === undefined
                  ? 'Sin límite'
                  : `$${(price / 1000).toFixed(0)}k`;
                return (
                  <Pressable
                    key={i}
                    onPress={() => {
                      haptic();
                      setDraft((d: ExploreFilters) => ({ ...d, maxPrice: price }));
                    }}
                    style={({ pressed }) => [
                      styles.priceChip,
                      isActive && styles.priceChipActive,
                      pressed  && { opacity: 0.75 },
                    ]}
                  >
                    <Text style={[
                      styles.priceChipText,
                      isActive && styles.priceChipTextActive,
                    ]}>
                      {label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

        </ScrollView>

        {/* ── CTA ROW ── */}
        <View style={styles.ctaRow}>
          <Pressable
            onPress={onClose}
            style={({ pressed }) => [styles.cancelBtn, pressed && { opacity: 0.7 }]}
          >
            <Text style={styles.cancelText}>Cancelar</Text>
          </Pressable>

          <Pressable
            onPress={handleApply}
            style={({ pressed }) => [
              styles.applyBtn,
              pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
            ]}
          >
            <Ionicons name="checkmark" size={16} color="#fff" />
            <Text style={styles.applyText}>
              Aplicar{activeFiltersCount > 0 ? ` (${activeFiltersCount})` : ''}
            </Text>
          </Pressable>
        </View>

      </RNAnimated.View>
    </Modal>
  );
}

// ── Toggle sub-component ──────────────────────────────────────────────────────

function Toggle({ active }: { active: boolean }) {
  const anim = useRef(new RNAnimated.Value(active ? 1 : 0)).current;

  useEffect(() => {
    RNAnimated.timing(anim, {
      toValue:         active ? 1 : 0,
      duration:        180,
      useNativeDriver: false,
    }).start();
  }, [active]);

  const thumbX = anim.interpolate({
    inputRange:  [0, 1],
    outputRange: [2, 18],
  });
  const trackColor = anim.interpolate({
    inputRange:  [0, 1],
    outputRange: [colors.border, colors.primary],
  });

  return (
    <RNAnimated.View style={[styles.track, { backgroundColor: trackColor }]}>
      <RNAnimated.View style={[styles.thumb, { transform: [{ translateX: thumbX }] }]} />
    </RNAnimated.View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },

  sheet: {
    position:        'absolute',
    bottom:          0,
    left:            0,
    right:           0,
    backgroundColor: '#fff',
    borderTopLeftRadius:  24,
    borderTopRightRadius: 24,
    maxHeight:       '88%',
    shadowColor:     '#000',
    shadowOffset:    { width: 0, height: -4 },
    shadowOpacity:   0.12,
    shadowRadius:    20,
    elevation:       16,
  },

  handle: {
    width:           40,
    height:          4,
    borderRadius:    2,
    backgroundColor: colors.border,
    alignSelf:       'center',
    marginTop:       10,
    marginBottom:    4,
  },

  // header
  headerRow: {
    flexDirection:  'row',
    alignItems:     'center',
    paddingHorizontal: 20,
    paddingVertical:   14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 8,
  },
  title: {
    flex:       1,
    fontSize:   18,
    fontFamily: 'PlusJakartaSans_700Bold',
    color:      colors.text,
  },
  countBadge: {
    width:           22,
    height:          22,
    borderRadius:    11,
    backgroundColor: colors.primary,
    alignItems:      'center',
    justifyContent:  'center',
  },
  countText: {
    fontSize:   11,
    fontFamily: 'PlusJakartaSans_700Bold',
    color:      '#fff',
  },
  resetBtn: {
    paddingHorizontal: 12,
    paddingVertical:    6,
    borderRadius:       20,
    backgroundColor:    colors.background,
    borderWidth:        1,
    borderColor:        colors.border,
  },
  resetText: {
    fontSize:   12,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color:      colors.textSecondary,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop:        4,
    paddingBottom:     8,
  },

  // section
  section: {
    paddingVertical: 16,
    gap:             12,
  },
  sectionLabel: {
    fontSize:   13,
    fontFamily: 'PlusJakartaSans_700Bold',
    color:      colors.text,
    textTransform: 'uppercase',
    letterSpacing:  0.6,
  },
  divider: {
    height:          1,
    backgroundColor: colors.border,
  },

  // sort chips
  sortGrid: {
    flexDirection: 'row',
    flexWrap:      'wrap',
    gap:           8,
  },
  sortChip: {
    flexDirection:   'row',
    alignItems:      'center',
    gap:             6,
    paddingHorizontal: 13,
    paddingVertical:    8,
    borderRadius:    20,
    backgroundColor: colors.background,
    borderWidth:     1,
    borderColor:     colors.border,
  },
  sortChipActive: {
    backgroundColor: colors.primary + '10',
    borderColor:     colors.primary + '50',
  },
  sortChipText: {
    fontSize:   13,
    fontFamily: 'PlusJakartaSans_500Medium',
    color:      colors.textSecondary,
  },
  sortChipTextActive: {
    color:      colors.primary,
    fontFamily: 'PlusJakartaSans_700Bold',
  },

  // toggles
  togglesCol: {
    backgroundColor: colors.background,
    borderRadius:    16,
    borderWidth:     1,
    borderColor:     colors.border,
    overflow:        'hidden',
  },
  toggleRow: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'space-between',
    padding:        14,
  },
  toggleLeft: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           12,
    flex:          1,
  },
  toggleIconCircle: {
    width:           38,
    height:          38,
    borderRadius:    19,
    backgroundColor: '#fff',
    alignItems:      'center',
    justifyContent:  'center',
    borderWidth:     1,
    borderColor:     colors.border,
  },
  toggleIconCircleActive: {
    backgroundColor: colors.primary + '10',
    borderColor:     colors.primary + '30',
  },
  toggleLabel: {
    fontSize:   14,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color:      colors.text,
  },
  toggleSub: {
    fontSize:   11,
    fontFamily: 'PlusJakartaSans_400Regular',
    color:      colors.textSecondary,
    marginTop:  1,
  },
  toggleDivider: {
    height:          1,
    backgroundColor: colors.border,
    marginHorizontal: 14,
  },

  // toggle track + thumb
  track: {
    width:           40,
    height:          24,
    borderRadius:    12,
    justifyContent:  'center',
  },
  thumb: {
    width:           20,
    height:          20,
    borderRadius:    10,
    backgroundColor: '#fff',
    shadowColor:     '#000',
    shadowOffset:    { width: 0, height: 1 },
    shadowOpacity:   0.15,
    shadowRadius:    3,
    elevation:       2,
  },

  // rating chips
  ratingRow: {
    flexDirection: 'row',
    gap:           8,
  },
  ratingChip: {
    flex:            1,
    alignItems:      'center',
    justifyContent:  'center',
    paddingVertical:  10,
    borderRadius:    12,
    backgroundColor: colors.background,
    borderWidth:     1,
    borderColor:     colors.border,
  },
  ratingChipActive: {
    backgroundColor: colors.primary + '10',
    borderColor:     colors.primary + '50',
  },
  ratingChipInner: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           3,
  },
  ratingChipText: {
    fontSize:   12,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color:      colors.textSecondary,
  },
  ratingChipTextActive: {
    color:      colors.primary,
  },

  // price chips
  priceLabelRow: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'space-between',
  },
  priceValue: {
    fontSize:   13,
    fontFamily: 'PlusJakartaSans_700Bold',
    color:      colors.primary,
  },
  priceChipsRow: {
    flexDirection: 'row',
    flexWrap:      'wrap',
    gap:           8,
  },
  priceChip: {
    paddingHorizontal: 14,
    paddingVertical:    9,
    borderRadius:      20,
    backgroundColor:   colors.background,
    borderWidth:       1,
    borderColor:       colors.border,
  },
  priceChipActive: {
    backgroundColor: colors.primary + '10',
    borderColor:     colors.primary + '50',
  },
  priceChipText: {
    fontSize:   13,
    fontFamily: 'PlusJakartaSans_500Medium',
    color:      colors.textSecondary,
  },
  priceChipTextActive: {
    color:      colors.primary,
    fontFamily: 'PlusJakartaSans_700Bold',
  },

  // cta row
  ctaRow: {
    flexDirection:     'row',
    gap:               10,
    paddingHorizontal: 20,
    paddingTop:        12,
    borderTopWidth:    1,
    borderTopColor:    colors.border,
  },
  cancelBtn: {
    flex:            1,
    height:          48,
    borderRadius:    14,
    backgroundColor: colors.background,
    alignItems:      'center',
    justifyContent:  'center',
    borderWidth:     1,
    borderColor:     colors.border,
  },
  cancelText: {
    fontSize:   15,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color:      colors.textSecondary,
  },
  applyBtn: {
    flex:            2,
    height:          48,
    borderRadius:    14,
    backgroundColor: colors.primary,
    flexDirection:   'row',
    alignItems:      'center',
    justifyContent:  'center',
    gap:             7,
    shadowColor:     colors.primary,
    shadowOffset:    { width: 0, height: 4 },
    shadowOpacity:   0.3,
    shadowRadius:    8,
    elevation:       4,
  },
  applyText: {
    fontSize:   15,
    fontFamily: 'PlusJakartaSans_700Bold',
    color:      '#fff',
  },
});