import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet, Modal,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { Feather } from '@expo/vector-icons';

// Importa tus constantes de galería (con las mejoras que ya hice)
import {
  GALLERY_CATEGORIES,
  TRANSACTION_TYPES,
  PRODUCT_CONDITIONS,
  getCategoryById,
  getLocalizedGalleryCategoryName,
  getLocalizedGallerySubcategoryName,
  getLocalizedTransactionType,
  getLocalizedCondition,
} from '../../../../constants/galleryCategories';

// ----------------------------------------------------------------------
// Tipos
// ----------------------------------------------------------------------
export type GalleryFiltersProps = {
  isOpen: boolean;
  onToggle: () => void;
  distance: number;
  setDistance: (v: number) => void;
  priceMin: number;
  setPriceMin: (v: number) => void;
  priceMax: number;
  setPriceMax: (v: number) => void;
  category: string;
  setCategory: (v: string) => void;
  subCategory: string;
  setSubCategory: (v: string) => void;
  transactionTypes: string[];
  setTransactionTypes: (updater: string[] | ((prev: string[]) => string[])) => void;
  conditions: string[];
  setConditions: (updater: string[] | ((prev: string[]) => string[])) => void;
  sortBy: string;
  setSortBy: (v: string) => void;
  onResetFilters: () => void;
};

const sortOptions = [
  { value: 'popularity', label: 'Popularidad' },
  { value: 'price', label: 'Precio' },
  { value: 'date', label: 'Fecha' },
];

// ----------------------------------------------------------------------
// Componente principal
// ----------------------------------------------------------------------
export const GalleryFiltersPanel = ({
  isOpen,
  onToggle,
  distance, setDistance,
  priceMin, setPriceMin,
  priceMax, setPriceMax,
  category, setCategory,
  subCategory, setSubCategory,
  transactionTypes, setTransactionTypes,
  conditions, setConditions,
  sortBy, setSortBy,
  onResetFilters,
}: GalleryFiltersProps) => {
  // Obtener subcategorías según categoría seleccionada
  const currentCategory = category && category !== 'all' ? getCategoryById(category) : null;
  const subcategories = currentCategory?.subcategories || [];

  // Contador de filtros activos
  const activeCount = 
    (category !== 'all' ? 1 : 0) +
    (subCategory !== 'all' ? 1 : 0) +
    transactionTypes.length +
    conditions.length +
    (sortBy !== 'popularity' ? 1 : 0) +
    (priceMin > 0 || priceMax < 1000000 ? 1 : 0) +
    (distance !== 10 ? 1 : 0);

  // Handlers para multi-select
  const toggleTransaction = (id: string) => {
    setTransactionTypes(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleCondition = (id: string) => {
    setConditions(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // --------------------------------------------------------------------
  // Subcomponentes internos
  // --------------------------------------------------------------------
  const Chip = ({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) => (
    <TouchableOpacity onPress={onPress} style={[styles.chip, active && styles.chipActive]}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </TouchableOpacity>
  );

  const FilterOption = ({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) => (
    <TouchableOpacity onPress={onPress} style={[styles.optionBase, selected && styles.optionSelected]}>
      <Text style={[styles.optionText, selected && styles.optionTextActive]}>{label}</Text>
      {selected && <Feather name="check" size={16} color="#7e22ce" />}
    </TouchableOpacity>
  );

  const Dropdown = ({
    icon,
    label,
    value,
    options,
    onSelect,
  }: {
    icon: React.ReactNode;
    label: string;
    value: string;
    options: { value: string; label: string }[];
    onSelect: (v: string) => void;
  }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const selected = options.find(o => o.value === value);
    return (
      <>
        <TouchableOpacity style={styles.dropdownBtn} onPress={() => setModalVisible(true)}>
          <View style={styles.dropdownLabelRow}>
            {icon}
            <Text style={styles.dropdownLabel}>{label}</Text>
          </View>
          <View style={styles.dropdownValue}>
            <Text style={styles.dropdownValueText} numberOfLines={1}>
              {selected?.label ?? options[0].label}
            </Text>
            <Feather name="chevron-down" size={14} color="#9333ea" />
          </View>
        </TouchableOpacity>

        <Modal visible={modalVisible} transparent animationType="slide">
          <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setModalVisible(false)}>
            <View style={styles.modalSheet}>
              <View style={styles.modalHandle} />
              <Text style={styles.modalTitle}>{label}</Text>
              {options.map(opt => (
                <TouchableOpacity
                  key={opt.value}
                  style={[styles.modalOption, opt.value === value && styles.modalOptionActive]}
                  onPress={() => { onSelect(opt.value); setModalVisible(false); }}
                >
                  <Text style={[styles.modalOptionText, opt.value === value && styles.modalOptionTextActive]}>
                    {opt.label}
                  </Text>
                  {opt.value === value && <View style={styles.modalDot} />}
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>
      </>
    );
  };

  // --------------------------------------------------------------------
  // Renderizado colapsado
  // --------------------------------------------------------------------
  if (!isOpen) {
    return (
      <TouchableOpacity style={styles.collapsedBtn} onPress={onToggle}>
        <Feather name="sliders" size={15} color="#9333ea" />
        <Text style={styles.collapsedText}>Filtrar galería</Text>
        <View style={[styles.badge, activeCount > 0 && styles.badgeActive]}>
          <Text style={styles.badgeText}>{activeCount > 0 ? activeCount : '•'}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  // --------------------------------------------------------------------
  // Renderizado expandido
  // --------------------------------------------------------------------
  return (
    <View style={styles.panel}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.row}>
          <Feather name="sliders" size={16} color="#9333ea" />
          <Text style={styles.headerTitle}>Filtros</Text>
          {activeCount > 0 && (
            <View style={styles.headerBadge}>
              <Text style={styles.headerBadgeText}>{activeCount}</Text>
            </View>
          )}
        </View>
        <TouchableOpacity onPress={onToggle} style={styles.closeBtn}>
          <Feather name="x" size={16} color="#555" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Ordenar por */}
        <Dropdown
          icon={<Feather name="filter" size={12} color="#9333ea" />}
          label="Ordenar por"
          value={sortBy}
          options={sortOptions}
          onSelect={setSortBy}
        />

        {/* Categoría */}
        <Dropdown
          icon={<Feather name="tag" size={12} color="#9333ea" />}
          label="Categoría"
          value={category}
          options={[
            { value: 'all', label: 'Todas' },
            ...GALLERY_CATEGORIES.map(c => ({ value: c.id, label: getLocalizedGalleryCategoryName(c.id) }))
          ]}
          onSelect={v => { setCategory(v); setSubCategory('all'); }}
        />

        {/* Subcategoría */}
        {category !== 'all' && subcategories.length > 0 && (
          <Dropdown
            icon={<Feather name="layers" size={12} color="#9333ea" />}
            label="Tipo"
            value={subCategory}
            options={[
              { value: 'all', label: 'Todos' },
              ...subcategories.map(s => ({ value: s.id, label: getLocalizedGallerySubcategoryName(category, s.id) }))
            ]}
            onSelect={setSubCategory}
          />
        )}

        {/* Tipo de transacción (multi-select) */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Tipo de transacción</Text>
          <View style={styles.chipsRow}>
            {TRANSACTION_TYPES.map(t => (
              <Chip
                key={t.id}
                label={getLocalizedTransactionType(t.id).name}
                active={transactionTypes.includes(t.id)}
                onPress={() => toggleTransaction(t.id)}
              />
            ))}
          </View>
        </View>

        {/* Condición (multi-select) */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Condición</Text>
          <View style={styles.chipsRow}>
            {PRODUCT_CONDITIONS.map(c => (
              <Chip
                key={c.id}
                label={getLocalizedCondition(c.id)}
                active={conditions.includes(c.id)}
                onPress={() => toggleCondition(c.id)}
              />
            ))}
          </View>
        </View>

        {/* Rango de precio */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Precio</Text>
          <View style={styles.rowBetween}>
            <Text style={styles.value}>${priceMin.toLocaleString()}</Text>
            <Text style={styles.value}>${priceMax.toLocaleString()}</Text>
          </View>
          <View style={styles.priceRangeContainer}>
            <Text style={styles.sliderLimit}>Mínimo</Text>
            <Slider
              minimumValue={0}
              maximumValue={priceMax}
              step={1000}
              value={priceMin}
              onValueChange={setPriceMin}
              minimumTrackTintColor="#9333ea"
              maximumTrackTintColor="#E5E7EB"
              thumbTintColor="#9333ea"
            />
            <Text style={styles.sliderLimit}>Máximo</Text>
            <Slider
              minimumValue={priceMin}
              maximumValue={1000000}
              step={1000}
              value={priceMax}
              onValueChange={setPriceMax}
              minimumTrackTintColor="#9333ea"
              maximumTrackTintColor="#E5E7EB"
              thumbTintColor="#9333ea"
            />
          </View>
        </View>

        {/* Distancia */}
        <View style={styles.section}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionLabel}>Distancia máxima</Text>
            <Text style={styles.value}>{distance} km</Text>
          </View>
          <Slider
            minimumValue={1}
            maximumValue={100}
            step={1}
            value={distance}
            onValueChange={setDistance}
            minimumTrackTintColor="#9333ea"
            maximumTrackTintColor="#E5E7EB"
            thumbTintColor="#9333ea"
          />
          <View style={styles.sliderLimits}>
            <Text style={styles.sliderLimit}>1 km</Text>
            <Text style={styles.sliderLimit}>100 km</Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.resetBtn} onPress={onResetFilters}>
          <Text style={styles.resetBtnText}>Limpiar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.applyBtn} onPress={onToggle}>
          <Text style={styles.applyBtnText}>Aplicar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ----------------------------------------------------------------------
// Estilos (unificados)
// ----------------------------------------------------------------------
const styles = StyleSheet.create({
  collapsedBtn: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#faf5ff',
    borderWidth: 1, borderColor: '#e9d5ff', borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 10, gap: 8,
  },
  collapsedText: { flex: 1, fontSize: 13, color: '#7e22ce', fontWeight: '500' },
  badge: {
    backgroundColor: '#d8b4fe', borderRadius: 10, minWidth: 20, height: 20,
    alignItems: 'center', justifyContent: 'center', paddingHorizontal: 5,
  },
  badgeActive: { backgroundColor: '#9333ea' },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },

  panel: {
    backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: '#ede9fe',
    flexDirection: 'column', maxHeight: '80%', overflow: 'hidden',
    shadowColor: '#7c3aed', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1, shadowRadius: 10, elevation: 4,
  },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: '#f5f3ff',
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  headerTitle: { fontSize: 14, fontWeight: '700', color: '#1a1a1a' },
  headerBadge: {
    backgroundColor: '#9333ea', borderRadius: 8, minWidth: 18, height: 18,
    alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4,
  },
  headerBadgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  closeBtn: { backgroundColor: '#f3f4f6', borderRadius: 8, padding: 5 },

  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 10, gap: 16 },

  section: { marginBottom: 8 },
  sectionLabel: { fontSize: 11, fontWeight: '600', color: '#4b5563', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 },

  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  value: { fontSize: 13, color: '#9333ea', fontWeight: '600' },

  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 13, paddingVertical: 7, borderRadius: 20,
    backgroundColor: '#f3f4f6', borderWidth: 1, borderColor: '#e5e7eb',
  },
  chipActive: { backgroundColor: '#f3e8ff', borderColor: '#9333ea' },
  chipText: { fontSize: 12, color: '#6b7280', fontWeight: '500' },
  chipTextActive: { color: '#7e22ce', fontWeight: '700' },

  dropdownBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#faf5ff', borderWidth: 1, borderColor: '#ddd6fe', borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 8,
  },
  dropdownLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dropdownLabel: { fontSize: 11, fontWeight: '600', color: '#4b5563', textTransform: 'uppercase', letterSpacing: 0.5 },
  dropdownValue: { flexDirection: 'row', alignItems: 'center', gap: 5, maxWidth: '60%' },
  dropdownValueText: { fontSize: 12, color: '#7e22ce', fontWeight: '500' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: '#fff', borderTopLeftRadius: 22, borderTopRightRadius: 22, padding: 20, paddingBottom: 36 },
  modalHandle: { width: 36, height: 4, borderRadius: 2, backgroundColor: '#e5e7eb', alignSelf: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 15, fontWeight: '700', color: '#111827', marginBottom: 12 },
  modalOption: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 13, paddingHorizontal: 12, borderRadius: 10 },
  modalOptionActive: { backgroundColor: '#faf5ff' },
  modalOptionText: { fontSize: 14, color: '#374151' },
  modalOptionTextActive: { color: '#7e22ce', fontWeight: '600' },
  modalDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#9333ea' },

  optionBase: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 12, paddingHorizontal: 12, borderRadius: 8,
  },
  optionSelected: { backgroundColor: '#f9fafb' },
  optionText: { fontSize: 13, color: '#4b5563' },
  optionTextActive: { color: '#111', fontWeight: '600' },

  slider: { width: '100%', height: 36 },
  sliderLimits: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  sliderLimit: { fontSize: 10, color: '#9ca3af' },
  priceRangeContainer: { marginTop: 4 },

  footer: {
    flexDirection: 'row', gap: 10, paddingHorizontal: 14, paddingVertical: 13,
    borderTopWidth: 1, borderTopColor: '#f3f4f6', backgroundColor: '#fff',
  },
  resetBtn: {
    flex: 1, paddingVertical: 11, borderRadius: 10, borderWidth: 1.5, borderColor: '#ddd6fe',
    alignItems: 'center', justifyContent: 'center',
  },
  resetBtnText: { color: '#9333ea', fontWeight: '600', fontSize: 13 },
  applyBtn: {
    flex: 2, paddingVertical: 11, borderRadius: 10, backgroundColor: '#9333ea',
    alignItems: 'center', justifyContent: 'center',
  },
  applyBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },
});