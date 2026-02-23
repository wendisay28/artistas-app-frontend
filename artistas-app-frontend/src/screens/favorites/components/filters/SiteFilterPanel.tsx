import React from 'react';
import Button from '../../../../components/ui/Button';
import { Ionicons } from '@expo/vector-icons';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';

interface FilterOption {
  value: string;
  label: string;
}

interface FilterDropdownProps {
  title: string;
  options: FilterOption[];
  selectedValue: string;
  onChange: (value: string) => void;
}

interface SiteFilterPanelProps {
  showFilters: boolean;
  selectedService: string;
  selectedCapacity: string;
  selectedCity: string;
  selectedPrice: string;
  onServiceChange: (service: string) => void;
  onCapacityChange: (capacity: string) => void;
  onCityChange: (city: string) => void;
  onPriceChange: (price: string) => void;
  onClearFilters: () => void;
  onClose: () => void;
}

export function SiteFilterPanel({
  showFilters,
  selectedService,
  selectedCapacity,
  selectedCity,
  selectedPrice,
  onServiceChange,
  onCapacityChange,
  onCityChange,
  onPriceChange,
  onClearFilters,
  onClose
}: SiteFilterPanelProps) {
  // Opciones de servicios
  const services = [
    { value: 'restaurant', label: 'Restaurante/Café cultural' },
    { value: 'museum', label: 'Museo/Galería' },
    { value: 'culture_house', label: 'Casa de la Cultura' },
    { value: 'space_rental', label: 'Alquiler de espacios' },
    { value: 'recording', label: 'Grabación de audio/video' },
    { value: 'live_events', label: 'Eventos en vivo' }
  ];

  // Opciones de capacidad
  const capacities = [
    { value: 'small', label: 'Pequeño (1-20)' },
    { value: 'medium', label: 'Mediano (21-50)' },
    { value: 'large', label: 'Grande (51-100)' },
    { value: 'xlarge', label: 'Muy grande (100+)' }
  ];

  // Opciones de ubicación
  const cities = [
    { value: 'medellin', label: 'Medellín' },
    { value: 'bogota', label: 'Bogotá' },
    { value: 'other', label: 'Otras ciudades' }
  ];

  // Opciones de precio
  const prices = [
    { value: 'economic', label: 'Económico' },
    { value: 'moderate', label: 'Moderado' },
    { value: 'high', label: 'Alto' },
    { value: 'premium', label: 'Premium' }
  ];

  if (!showFilters) return null;

  const FilterDropdown = ({ title, options, selectedValue, onChange }: FilterDropdownProps) => (
    <View style={styles.filterSection}>
      <Text style={styles.filterTitle}>{title}</Text>
      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => {}}
        >
          <Text style={styles.dropdownText}>
            {options.find(opt => opt.value === selectedValue)?.label || `Seleccionar ${title.toLowerCase()}`}
          </Text>
          <Ionicons name="chevron-down" size={16} color="#6b7280" />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.optionItem}
          onPress={() => onChange('')}
        >
          <Text style={[styles.optionText, !selectedValue && styles.selectedOptionText]}>
            Todas las opciones
          </Text>
          {!selectedValue && <Ionicons name="checkmark" size={16} color="#7c3aed" />}
        </TouchableOpacity>
        
        {options.map((option: FilterOption) => (
          <TouchableOpacity
            key={option.value}
            style={styles.optionItem}
            onPress={() => onChange(option.value)}
          >
            <Text style={[styles.optionText, selectedValue === option.value && styles.selectedOptionText]}>
              {option.label}
            </Text>
            {selectedValue === option.value && <Ionicons name="checkmark" size={16} color="#7c3aed" />}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Filtro de Sitios</Text>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.closeText}>Cerrar</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.content}>
        <FilterDropdown
          title="Servicio"
          options={services}
          selectedValue={selectedService}
          onChange={onServiceChange}
        />
        <FilterDropdown
          title="Capacidad"
          options={capacities}
          selectedValue={selectedCapacity}
          onChange={onCapacityChange}
        />
        <FilterDropdown
          title="Ubicación"
          options={cities}
          selectedValue={selectedCity}
          onChange={onCityChange}
        />
        <FilterDropdown
          title="Precio"
          options={prices}
          selectedValue={selectedPrice}
          onChange={onPriceChange}
        />
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Limpiar filtros"
          onPress={onClearFilters}
        />
        <Button
          title="Aplicar filtros"
          onPress={onClose}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  closeText: {
    fontSize: 16,
    color: '#7c3aed',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  filterSection: {
    marginBottom: 20,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  optionsContainer: {
    gap: 8,
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  dropdownText: {
    fontSize: 16,
    color: '#1f2937',
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f9fafb',
  },
  optionText: {
    fontSize: 16,
    color: '#1f2937',
  },
  selectedOptionText: {
    color: '#7c3aed',
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
});