import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  Platform,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// Simulación de constantes (importar las reales en tu proyecto)
const CITY_OPTIONS = [
  { value: 'medellin', label: 'Medellín' },
  { value: 'bogota', label: 'Bogotá' }
];

const MODALITY_OPTIONS = [
  { value: 'online', label: 'Online' },
  { value: 'presential', label: 'Presencial' }
];

export function EventFilterPanel({
  showFilters,
  customDate,
  selectedCategory,
  sortByPrice,
  onCustomDateChange,
  onCategoryChange,
  onSortByPrice,
  onClearFilters,
  onModalityChange,
  onCityChange,
  onClose,
  categories = [] // Pasar desde EVENT_CATEGORIES
}: any) {
  
  if (!showFilters) return null;

  // Helper para renderizar grupos de opciones tipo "Chip"
  const RenderChips = ({ options, currentValue, onChange }: any) => (
    <View style={styles.chipContainer}>
      {options.map((opt: any) => {
        const isSelected = currentValue === opt.value;
        return (
          <TouchableOpacity
            key={opt.value}
            onPress={() => onChange(isSelected ? '' : opt.value)}
            style={[styles.chip, isSelected && styles.chipSelected]}
          >
            <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
              {opt.label}
            </Text>
            {isSelected && <Ionicons name="checkmark" size={14} color="white" />}
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <Modal visible={showFilters} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleContainer}>
              <Feather name="sliders" size={18} color="#9333ea" />
              <Text style={styles.headerTitle}>Filtro de Eventos</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.clearButton}>
              <Text style={styles.clearButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
            
            {/* Categoría */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Categoría</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                <TouchableOpacity 
                  onPress={() => onCategoryChange('')}
                  style={[styles.chip, !selectedCategory && styles.chipSelected]}
                >
                  <Text style={[styles.chipText, !selectedCategory && styles.chipTextSelected]}>Todas</Text>
                </TouchableOpacity>
                {categories.map((cat: string) => (
                  <TouchableOpacity 
                    key={cat}
                    onPress={() => onCategoryChange(cat)}
                    style={[styles.chip, selectedCategory === cat && styles.chipSelected]}
                  >
                    <Text style={[styles.chipText, selectedCategory === cat && styles.chipTextSelected]}>{cat}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Fecha */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Fecha específica</Text>
              <TouchableOpacity style={styles.datePickerPlaceholder}>
                <Feather name="calendar" size={16} color="#6b7280" />
                <Text style={styles.dateText}>{customDate || 'Seleccionar fecha'}</Text>
              </TouchableOpacity>
            </View>

            {/* Ordenar por Precio */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Ordenar por precio</Text>
              <RenderChips 
                options={[
                  { value: 'free', label: 'Entrada libre' },
                  { value: 'price_asc', label: 'Menor precio' },
                  { value: 'price_desc', label: 'Mayor precio' }
                ]}
                currentValue={sortByPrice}
                onChange={onSortByPrice}
              />
            </View>

            {/* Modalidad */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Modalidad</Text>
              <RenderChips 
                options={MODALITY_OPTIONS}
                currentValue={"" /* Conectar con estado de modalidad */}
                onChange={onModalityChange}
              />
            </View>

            {/* Ciudad */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Ciudad</Text>
              <RenderChips 
                options={CITY_OPTIONS}
                currentValue={"" /* Conectar con estado de ciudad */}
                onChange={onCityChange}
              />
            </View>
          </ScrollView>

          {/* Botones de Acción */}
          <View style={styles.footer}>
            <TouchableOpacity onPress={onClearFilters} style={styles.clearButton}>
              <Text style={styles.clearButtonText}>Limpiar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={onClose} style={styles.applyButtonWrapper}>
              <LinearGradient
                colors={['#9333ea', '#2563eb']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.applyButton}
              >
                <Text style={styles.applyButtonText}>Aplicar Filtros</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f3e8ff',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4c1d95',
  },
  closeButtonText: {
    color: '#9333ea',
    fontSize: 14,
    fontWeight: '500',
  },
  scrollContent: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  horizontalScroll: {
    flexDirection: 'row',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f3ff',
    borderWidth: 1,
    borderColor: '#ddd6fe',
    marginRight: 8,
  },
  chipSelected: {
    backgroundColor: '#9333ea',
    borderColor: '#9333ea',
  },
  chipText: {
    fontSize: 13,
    color: '#6b7280',
  },
  chipTextSelected: {
    color: 'white',
    fontWeight: 'bold',
  },
  datePickerPlaceholder: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  dateText: {
    color: '#374151',
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f3e8ff',
    gap: 12,
  },
  clearButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd6fe',
  },
  clearButtonText: {
    color: '#6b7280',
    fontWeight: '600',
  },
  applyButtonWrapper: {
    flex: 2,
  },
  applyButton: {
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 12,
  },
  applyButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
  },
});