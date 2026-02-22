import React, { useState, useMemo } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet, Modal, Platform,
} from 'react-native';
import Slider from '@react-native-community/slider';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Feather } from '@expo/vector-icons';

import {
  EVENT_CATEGORIES,
  getEventTypesByCategory,
  getLocalizedEventCategoryName,
  getLocalizedEventTypeName,
} from '../../../../constants/eventCategories';

// ----------------------------------------------------------------------
// Tipos
// ----------------------------------------------------------------------
export type EventFiltersProps = {
  isOpen: boolean;
  onToggle: () => void;
  distance: number;
  setDistance: (v: number) => void;
  price: number;
  setPrice: (v: number) => void;
  category: string;
  setCategory: (v: string) => void;
  subCategory: string;
  setSubCategory: (v: string) => void;
  format: string;
  setFormat: (v: string) => void;
  selectedDate: Date | null;
  setSelectedDate: (d: Date | null) => void;
  onResetFilters: () => void;
};

// Opciones de formato fijas
const formatOptions = [
  { value: 'all', label: 'Todos' },
  { value: 'presencial', label: 'Presencial' },
  { value: 'virtual', label: 'Virtual' },
  { value: 'hibrido', label: 'Híbrido' },
];

// ----------------------------------------------------------------------
// Componente principal
// ----------------------------------------------------------------------
export const EventFiltersPanel = ({
  isOpen,
  onToggle,
  distance, setDistance,
  price, setPrice,
  category, setCategory,
  subCategory, setSubCategory,
  format, setFormat,
  selectedDate, setSelectedDate,
  onResetFilters,
}: EventFiltersProps) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<null | 'category' | 'format'>(null);

  // Tipos de evento según categoría seleccionada
  const eventTypes = category && category !== 'all' ? getEventTypesByCategory(category) : [];

  // Contador de filtros activos
  const activeCount = 
    (category !== 'all' ? 1 : 0) +
    (subCategory !== 'all' ? 1 : 0) +
    (format !== 'all' ? 1 : 0) +
    (price > 0 ? 1 : 0) +
    (selectedDate ? 1 : 0);

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
        <Text style={styles.collapsedText}>Filtrar eventos</Text>
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
        {/* Categoría */}
        <Dropdown
          icon={<Feather name="tag" size={12} color="#9333ea" />}
          label="Categoría"
          value={category}
          options={[
            { value: 'all', label: 'Todas' },
            ...EVENT_CATEGORIES.map(c => ({ value: c.id, label: getLocalizedEventCategoryName(c.id) }))
          ]}
          onSelect={v => { setCategory(v); setSubCategory('all'); }}
        />

        {/* Tipo de evento (subcategoría) */}
        {category !== 'all' && eventTypes.length > 0 && (
          <Dropdown
            icon={<Feather name="calendar" size={12} color="#9333ea" />}
            label="Tipo de evento"
            value={subCategory}
            options={[
              { value: 'all', label: 'Todos' },
              ...eventTypes.map(t => ({ value: t.id, label: getLocalizedEventTypeName(category, t.id) }))
            ]}
            onSelect={setSubCategory}
          />
        )}

        {/* Formato (chips) */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Formato</Text>
          <View style={styles.chipsRow}>
            {formatOptions.map(f => (
              <Chip
                key={f.value}
                label={f.label}
                active={format === f.value}
                onPress={() => setFormat(f.value)}
              />
            ))}
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
        </View>

        {/* Precio máximo */}
        <View style={styles.section}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionLabel}>Precio máximo</Text>
            <Text style={styles.value}>${price.toLocaleString()}</Text>
          </View>
          <Slider
            minimumValue={0}
            maximumValue={1000000}
            step={10000}
            value={price}
            onValueChange={setPrice}
            minimumTrackTintColor="#9333ea"
            maximumTrackTintColor="#E5E7EB"
            thumbTintColor="#9333ea"
          />
          <View style={styles.sliderLimits}>
            <Text style={styles.sliderLimit}>Gratis</Text>
            <Text style={styles.sliderLimit}>$1M</Text>
          </View>
        </View>

        {/* Fecha */}
        <View style={styles.section}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionLabel}>Fecha</Text>
            {selectedDate && (
              <TouchableOpacity onPress={() => setSelectedDate(null)}>
                <Text style={styles.clearDate}>Quitar</Text>
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity style={styles.dateBtn} onPress={() => setShowDatePicker(true)}>
            <Feather name="calendar" size={14} color={selectedDate ? '#9333ea' : '#aaa'} />
            <Text style={[styles.dateBtnText, selectedDate && styles.dateBtnTextActive]}>
              {selectedDate
                ? selectedDate.toLocaleDateString('es-CO', { day: '2-digit', month: 'long', year: 'numeric' })
                : 'Seleccionar fecha'}
            </Text>
          </TouchableOpacity>
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

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(_, date) => { setShowDatePicker(false); if (date) setSelectedDate(date); }}
        />
      )}
    </View>
  );
};

// ----------------------------------------------------------------------
// Estilos
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

  dateBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 10,
  },
  dateBtnText: { fontSize: 13, color: '#9ca3af' },
  dateBtnTextActive: { color: '#7e22ce', fontWeight: '500' },
  clearDate: { fontSize: 11, color: '#ef4444', fontWeight: '500' },

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