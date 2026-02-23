// ─────────────────────────────────────────────────────────────────────────────
// AdvancedFiltersPanel.tsx — Panel de filtros avanzados para explore
// Convierte el componente web a React Native con componentes nativos
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../../constants/colors';
import { ARTIST_CATEGORIES, getDisciplinesByCategory, getRolesByDiscipline, getLocalizedCategoryName } from '../../../../constants/artistCategories';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ExploreFilters {
  distance: number;
  price: number;
  category: string;
  subCategory: string;
  format: string;
  sortBy: string;
  selectedDate: Date | null;
  profession: string;
}

interface AdvancedFiltersPanelProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: ExploreFilters) => void;
  initialFilters?: Partial<ExploreFilters>;
  isMobile?: boolean;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function AdvancedFiltersPanel({
  visible,
  onClose,
  onApply,
  initialFilters,
  isMobile = true,
}: AdvancedFiltersPanelProps) {
  const [filters, setFilters] = useState<ExploreFilters>({
    distance: initialFilters?.distance ?? 50,
    price: initialFilters?.price ?? 500000,
    category: initialFilters?.category ?? 'all',
    subCategory: initialFilters?.subCategory ?? 'all',
    format: initialFilters?.format ?? 'all',
    sortBy: initialFilters?.sortBy ?? 'recommended',
    selectedDate: initialFilters?.selectedDate ?? null,
    profession: initialFilters?.profession ?? 'all',
  });

  // Obtener disciplinas según la categoría seleccionada
  const currentDisciplines = filters.category && filters.category !== 'all'
    ? getDisciplinesByCategory(filters.category)
    : [];

  // Obtener roles según la categoría y disciplina seleccionadas
  const currentRoles = filters.category && filters.category !== 'all' && 
    filters.subCategory && filters.subCategory !== 'all'
    ? getRolesByDiscipline(filters.category, filters.subCategory)
    : [];

  const updateFilter = <K extends keyof ExploreFilters>(key: K, value: ExploreFilters[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleCategoryChange = (category: string) => {
    updateFilter('category', category);
    updateFilter('subCategory', 'all');
    updateFilter('profession', 'all');
  };

  const handleSubCategoryChange = (subCategory: string) => {
    updateFilter('subCategory', subCategory);
    updateFilter('profession', 'all');
  };

  const handleReset = () => {
    setFilters({
      distance: 50,
      price: 500000,
      category: 'all',
      subCategory: 'all',
      format: 'all',
      sortBy: 'recommended',
      selectedDate: null,
      profession: 'all',
    });
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle={Platform.OS === 'ios' ? 'pageSheet' : 'fullScreen'}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Filtros Avanzados</Text>
          <TouchableOpacity onPress={handleReset} style={styles.resetBtn}>
            <Text style={styles.resetText}>Limpiar</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Búsqueda */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Búsqueda</Text>

            {/* Categoría */}
            <View style={styles.field}>
              <Text style={styles.label}>Categoría</Text>
              <View style={styles.pickerContainer}>
                <TouchableOpacity
                  style={styles.picker}
                  onPress={() => {
                    // Aquí podrías implementar un modal de selección
                    console.log('Seleccionar categoría');
                  }}
                >
                  <Text style={styles.pickerText}>
                    {filters.category === 'all' 
                      ? 'Todas las categorías' 
                      : getLocalizedCategoryName(filters.category)
                    }
                  </Text>
                  <Ionicons name="chevron-down" size={16} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Disciplina */}
            {currentDisciplines.length > 0 && (
              <View style={styles.field}>
                <Text style={styles.label}>Disciplina</Text>
                <View style={styles.pickerContainer}>
                  <TouchableOpacity
                    style={styles.picker}
                    onPress={() => {
                      console.log('Seleccionar disciplina');
                    }}
                  >
                    <Text style={styles.pickerText}>
                      {filters.subCategory === 'all'
                        ? 'Todas las disciplinas'
                        : currentDisciplines.find(disc => disc.id === filters.subCategory)?.name
                      }
                    </Text>
                    <Ionicons name="chevron-down" size={16} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Rol */}
            {currentRoles.length > 0 && (
              <View style={styles.field}>
                <Text style={styles.label}>Rol / Profesión</Text>
                <View style={styles.pickerContainer}>
                  <TouchableOpacity
                    style={styles.picker}
                    onPress={() => {
                      console.log('Seleccionar rol');
                    }}
                  >
                    <Text style={styles.pickerText}>
                      {filters.profession === 'all'
                        ? 'Todos los roles'
                        : currentRoles.find(role => role.id === filters.profession)?.name
                      }
                    </Text>
                    <Ionicons name="chevron-down" size={16} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          {/* Ubicación */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              <Ionicons name="location-outline" size={16} color={colors.primary} />
              {' '}Ubicación
            </Text>
            <View style={styles.field}>
              <Text style={styles.label}>Distancia máxima</Text>
              <View style={styles.sliderContainer}>
                <Text style={styles.sliderValue}>{filters.distance} km</Text>
                <View style={styles.slider}>
                  {/* Aquí podrías implementar un slider nativo */}
                  <Text style={styles.sliderNote}>Slider de distancia</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Precio */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              <Ionicons name="pricetag-outline" size={16} color={colors.primary} />
              {' '}Precio máximo (COP)
            </Text>
            <View style={styles.field}>
              <View style={styles.priceRange}>
                <Text style={styles.priceLabel}>$0</Text>
                <Text style={styles.priceValue}>${filters.price.toLocaleString()}</Text>
                <Text style={styles.priceLabel}>$1M</Text>
              </View>
              <View style={styles.slider}>
                <Text style={styles.sliderNote}>Slider de precio</Text>
              </View>
            </View>
          </View>

          {/* Disponibilidad */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Disponibilidad</Text>
            <View style={styles.field}>
              <Text style={styles.label}>Fecha específica</Text>
              <TouchableOpacity style={styles.datePicker}>
                <Text style={styles.dateText}>
                  {filters.selectedDate 
                    ? filters.selectedDate.toLocaleDateString('es-ES')
                    : 'Selecciona una fecha'
                  }
                </Text>
                <Ionicons name="calendar-outline" size={16} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Ordenamiento */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ordenar por</Text>
            <View style={styles.field}>
              <View style={styles.optionsContainer}>
                {[
                  { id: 'recommended', label: 'Recomendado' },
                  { id: 'price_low', label: 'Precio: Menor a Mayor' },
                  { id: 'price_high', label: 'Precio: Mayor a Menor' },
                  { id: 'distance', label: 'Distancia' },
                  { id: 'rating', label: 'Mejor Rating' },
                ].map(option => (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.option,
                      filters.sortBy === option.id && styles.optionSelected
                    ]}
                    onPress={() => updateFilter('sortBy', option.id)}
                  >
                    <Text style={[
                      styles.optionText,
                      filters.sortBy === option.id && styles.optionTextSelected
                    ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Footer Actions */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.applyBtn} onPress={handleApply}>
            <Text style={styles.applyBtnText}>Aplicar Filtros</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  closeBtn: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  resetBtn: {
    padding: 8,
  },
  resetText: {
    fontSize: 14,
    color: colors.primary,
    fontFamily: 'PlusJakartaSans_500Medium',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
    fontFamily: 'PlusJakartaSans_500Medium',
  },
  pickerContainer: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceAlt,
  },
  picker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  pickerText: {
    fontSize: 14,
    color: colors.text,
    fontFamily: 'PlusJakartaSans_400Regular',
  },
  sliderContainer: {
    alignItems: 'center',
  },
  sliderValue: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 8,
    fontFamily: 'PlusJakartaSans_500Medium',
  },
  slider: {
    width: '100%',
    height: 40,
    backgroundColor: colors.surfaceAlt,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sliderNote: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: 'PlusJakartaSans_400Regular',
  },
  priceRange: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: 'PlusJakartaSans_400Regular',
  },
  priceValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  datePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceAlt,
  },
  dateText: {
    fontSize: 14,
    color: colors.text,
    fontFamily: 'PlusJakartaSans_400Regular',
  },
  optionsContainer: {
    gap: 8,
  },
  option: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceAlt,
  },
  optionSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionText: {
    fontSize: 14,
    color: colors.text,
    fontFamily: 'PlusJakartaSans_400Regular',
  },
  optionTextSelected: {
    color: colors.white,
    fontFamily: 'PlusJakartaSans_500Medium',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  applyBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  applyBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
});
