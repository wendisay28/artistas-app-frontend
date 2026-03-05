// components/hiring/modals/FilterModal.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import Slider from '@react-native-community/slider'; // TODO: Install this package or replace with alternative
import * as Haptics from 'expo-haptics';
import { colors } from '../../../../constants/colors';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: FilterData) => void;
  initialFilters?: FilterData;
}

interface FilterData {
  types: string[];
  budget_max: number;
  location: string;
  categories: string[];
  urgent_only: boolean;
}

const OFFER_TYPES = [
  { id: 'collaboration', label: 'Colaboración' },
  { id: 'hiring', label: 'Contratación' },
  { id: 'gig', label: 'Gig' },
  { id: 'event', label: 'Evento' },
];

const CATEGORIES = [
  'Músico', 'Fotógrafo', 'Pintor', 'Bailarín', 'DJ', 'Actor', 'Otro'
];

const LOCATIONS = [
  'Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Bilbao', 'Málaga'
];

export default function FilterModal({
  visible,
  onClose,
  onApply,
  initialFilters,
}: FilterModalProps) {
  const insets = useSafeAreaInsets();
  const [filters, setFilters] = useState<FilterData>(
    initialFilters || {
      types: [],
      budget_max: 10000,
      location: '',
      categories: [],
      urgent_only: false,
    }
  );

  const webTopInset = Platform.OS === 'web' ? 67 : 0;
  const webBottomInset = Platform.OS === 'web' ? 34 : 0;

  const handleClose = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onClose();
  };

  const handleApply = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onApply(filters);
  };

  const handleClear = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setFilters({
      types: [],
      budget_max: 10000,
      location: '',
      categories: [],
      urgent_only: false,
    });
  };

  const toggleType = (typeId: string) => {
    if (Platform.OS !== 'web') Haptics.selectionAsync();
    setFilters(prev => ({
      ...prev,
      types: prev.types.includes(typeId)
        ? prev.types.filter(t => t !== typeId)
        : [...prev.types, typeId],
    }));
  };

  const toggleCategory = (category: string) => {
    if (Platform.OS !== 'web') Haptics.selectionAsync();
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category],
    }));
  };

  const activeFiltersCount = 
    filters.types.length +
    filters.categories.length +
    (filters.location ? 1 : 0) +
    (filters.urgent_only ? 1 : 0);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { paddingTop: (insets.top || webTopInset) + 8 }]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Ionicons name="options-outline" size={24} color={colors.primary} />
              <Text style={styles.headerTitle}>Filtros</Text>
              {activeFiltersCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{activeFiltersCount}</Text>
                </View>
              )}
            </View>
            <Pressable
              style={({ pressed }) => [
                styles.closeBtn,
                pressed && styles.closeBtnPressed,
              ]}
              onPress={handleClose}
            >
              <Ionicons name="close" size={24} color={colors.text} />
            </Pressable>
          </View>

          {/* Content */}
          <ScrollView
            style={styles.content}
            contentContainerStyle={{
              paddingBottom: (insets.bottom || webBottomInset) + 20,
            }}
            showsVerticalScrollIndicator={false}
          >
            {/* Type */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tipo de oferta</Text>
              <View style={styles.chipGrid}>
                {OFFER_TYPES.map((type) => (
                  <Pressable
                    key={type.id}
                    style={({ pressed }) => [
                      styles.chip,
                      filters.types.includes(type.id) && styles.chipActive,
                      pressed && styles.chipPressed,
                    ]}
                    onPress={() => toggleType(type.id)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        filters.types.includes(type.id) && styles.chipTextActive,
                      ]}
                    >
                      {type.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Budget */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Presupuesto máximo</Text>
                <Text style={styles.budgetValue}>
                  ${filters.budget_max.toLocaleString()}
                </Text>
              </View>
              {/* TODO: Replace with alternative slider component */}
              <View style={styles.sliderPlaceholder}>
                <Text style={styles.sliderPlaceholderText}>
                  Rango: $500 - $50,000
                </Text>
              </View>
              {/* <Slider
                value={filters.budget_max}
                onValueChange={(val: number) => setFilters(prev => ({ ...prev, budget_max: Math.round(val) }))}
                minimumValue={500}
                maximumValue={50000}
                step={500}
                minimumTrackTintColor={colors.primary}
                maximumTrackTintColor={colors.border}
                thumbTintColor={colors.primary}
              /> */}
              <View style={styles.budgetLabels}>
                <Text style={styles.budgetLabel}>$500</Text>
                <Text style={styles.budgetLabel}>$50,000</Text>
              </View>
            </View>

            {/* Location */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Ubicación</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.locationScroll}
              >
                {LOCATIONS.map((loc) => (
                  <Pressable
                    key={loc}
                    style={({ pressed }) => [
                      styles.locationChip,
                      filters.location === loc && styles.locationChipActive,
                      pressed && styles.chipPressed,
                    ]}
                    onPress={() => {
                      if (Platform.OS !== 'web') Haptics.selectionAsync();
                      setFilters(prev => ({
                        ...prev,
                        location: prev.location === loc ? '' : loc,
                      }));
                    }}
                  >
                    <Ionicons
                      name="location"
                      size={14}
                      color={filters.location === loc ? colors.primary : colors.textSecondary}
                    />
                    <Text
                      style={[
                        styles.locationChipText,
                        filters.location === loc && styles.locationChipTextActive,
                      ]}
                    >
                      {loc}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            {/* Categories */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Categoría de artista</Text>
              <View style={styles.chipGrid}>
                {CATEGORIES.map((cat) => (
                  <Pressable
                    key={cat}
                    style={({ pressed }) => [
                      styles.chip,
                      filters.categories.includes(cat) && styles.chipActive,
                      pressed && styles.chipPressed,
                    ]}
                    onPress={() => toggleCategory(cat)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        filters.categories.includes(cat) && styles.chipTextActive,
                      ]}
                    >
                      {cat}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Urgent */}
            <View style={styles.section}>
              <Pressable
                style={({ pressed }) => [
                  styles.urgentToggle,
                  filters.urgent_only && styles.urgentToggleActive,
                  pressed && styles.urgentTogglePressed,
                ]}
                onPress={() => {
                  if (Platform.OS !== 'web') Haptics.selectionAsync();
                  setFilters(prev => ({ ...prev, urgent_only: !prev.urgent_only }));
                }}
              >
                <View style={styles.urgentLeft}>
                  <Ionicons
                    name="flame"
                    size={20}
                    color={filters.urgent_only ? colors.error : colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.urgentText,
                      filters.urgent_only && styles.urgentTextActive,
                    ]}
                  >
                    Solo ofertas urgentes
                  </Text>
                </View>
                <View
                  style={[
                    styles.urgentCheckbox,
                    filters.urgent_only && styles.urgentCheckboxActive,
                  ]}
                >
                  {filters.urgent_only && (
                    <Ionicons name="checkmark" size={16} color="#fff" />
                  )}
                </View>
              </Pressable>
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={[styles.footer, { paddingBottom: (insets.bottom || webBottomInset) + 16 }]}>
            <Pressable
              style={({ pressed }) => [
                styles.clearBtn,
                pressed && styles.clearBtnPressed,
              ]}
              onPress={handleClear}
            >
              <Text style={styles.clearBtnText}>Limpiar</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.applyBtn,
                pressed && styles.applyBtnPressed,
              ]}
              onPress={handleApply}
            >
              <LinearGradient
                colors={[colors.primary, colors.accent]}
                style={styles.applyBtnGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.applyBtnText}>
                  Aplicar filtros {activeFiltersCount > 0 && `(${activeFiltersCount})`}
                </Text>
              </LinearGradient>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.text,
  },
  badge: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#fff',
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnPressed: {
    opacity: 0.7,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: colors.text,
    marginBottom: 12,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.primary + '15',
    borderColor: colors.primary,
  },
  chipPressed: {
    opacity: 0.7,
  },
  chipText: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: colors.textSecondary,
  },
  chipTextActive: {
    color: colors.primary,
  },
  budgetValue: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.primary,
  },
  budgetLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  budgetLabel: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textSecondary,
  },
  locationScroll: {
    gap: 8,
  },
  locationChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.border,
  },
  locationChipActive: {
    backgroundColor: colors.primary + '15',
    borderColor: colors.primary,
  },
  locationChipText: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: colors.textSecondary,
  },
  locationChipTextActive: {
    color: colors.primary,
  },
  urgentToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
  },
  urgentToggleActive: {
    backgroundColor: colors.error + '10',
    borderColor: colors.error + '30',
  },
  urgentTogglePressed: {
    opacity: 0.7,
  },
  urgentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  urgentText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: colors.textSecondary,
  },
  urgentTextActive: {
    color: colors.error,
  },
  urgentCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  urgentCheckboxActive: {
    backgroundColor: colors.error,
    borderColor: colors.error,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  clearBtn: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearBtnPressed: {
    opacity: 0.7,
  },
  clearBtnText: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: colors.text,
  },
  applyBtn: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  applyBtnPressed: {
    opacity: 0.9,
  },
  applyBtnGradient: {
    paddingVertical: 14,
  },
  applyBtnText: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#fff',
  },
  sliderPlaceholder: {
    height: 40,
    backgroundColor: colors.surfaceAlt,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  sliderPlaceholderText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: colors.textSecondary,
  },
});