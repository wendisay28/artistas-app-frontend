import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
  Dimensions
} from 'react-native';
// Iconos nativos
import {
  MapPin,
  DollarSign,
  Tag,
  Calendar,
  Filter,
  Star,
  ChevronDown,
} from 'lucide-react-native';
import Slider from '@react-native-community/slider';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

/**
 * PASO 1: Importación de constantes
 * Ajusta la ruta si es necesario (ej: '../../../../constants/placeCategories')
 */
import { PLACE_CATEGORIES, PlaceCategory, getLocalizedCategoryName } from '../../../../constants/venueCategories';

/**
 * PASO 2: Interfaces para evitar errores 7006 (any)
 */
interface SubCategory {
  id: string;
  name: string;
}

export type VenueFilterProps = {
  isOpen: boolean;
  onToggle: () => void;
  distance: number;
  setDistance: (value: number) => void;
  price: number;
  setPrice: (value: number) => void;
  category: string;
  setCategory: (value: string) => void;
  subCategory: string;
  setSubCategory: (value: string) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
  onResetFilters: () => void;
};

const sortOptions = [
  { value: 'rating', label: 'Mejor valorados' },
  { value: 'bookings', label: 'Más reservados' },
  { value: 'distance', label: 'Más cercanos' },
];

export const VenueFiltersPanel = ({
  isOpen,
  onToggle,
  distance,
  setDistance,
  price,
  setPrice,
  category,
  setCategory,
  subCategory,
  setSubCategory,
  sortBy,
  setSortBy,
  selectedDate,
  setSelectedDate,
  onResetFilters,
}: VenueFilterProps) => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Obtener subcategorías con tipado correcto
  const currentCategory = (PLACE_CATEGORIES as PlaceCategory[]).find(cat => cat.id === category);
  const currentSubCategories = (currentCategory?.subcategories || []) as SubCategory[];

  const handleDateChange = (event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === 'android') setShowDatePicker(false);
    if (date) setSelectedDate(date);
  };

  if (!isOpen) {
    return (
      <TouchableOpacity style={styles.collapsedHeader} onPress={onToggle}>
        <View style={styles.row}>
          <Filter size={16} color="#666" />
          <Text style={styles.collapsedTitle}>Filtros de Lugares</Text>
        </View>
        <Text style={styles.toggleLabel}>Abrir</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.panelContainer}>
      {/* Header */}
      <TouchableOpacity style={styles.header} onPress={onToggle}>
        <View style={styles.row}>
          <Filter size={18} color="#9333ea" />
          <Text style={styles.headerTitle}>Filtro Avanzado</Text>
        </View>
        <Text style={styles.toggleLabel}>Cerrar</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Sección Búsqueda */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Búsqueda</Text>

          {/* Ordenar por */}
          <Text style={styles.label}><Tag size={12} /> Ordenar por</Text>
          <TouchableOpacity style={styles.fakeSelector}>
            <Text style={styles.selectorText}>
              {sortOptions.find(o => o.value === sortBy)?.label || 'Mejor valorados'}
            </Text>
            <ChevronDown size={16} color="#999" />
          </TouchableOpacity>

          {/* Categoría */}
          <Text style={styles.label}><Tag size={12} /> Categoría</Text>
          <TouchableOpacity style={styles.fakeSelector}>
            <Text style={styles.selectorText}>
              {category === 'all' 
                ? 'Todas las categorías' 
                : getLocalizedCategoryName(category)}
            </Text>
            <ChevronDown size={16} color="#999" />
          </TouchableOpacity>

          {/* Subcategoría (Tipo de Lugar) */}
          {currentSubCategories.length > 0 && (
            <>
              <Text style={styles.label}><Star size={12} /> Tipo de Lugar</Text>
              <TouchableOpacity style={styles.fakeSelector}>
                <Text style={styles.selectorText}>
                  {subCategory === 'all' 
                    ? 'Todos los tipos' 
                    : currentSubCategories.find(s => s.id === subCategory)?.name}
                </Text>
                <ChevronDown size={16} color="#999" />
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Ubicación */}
        <View style={styles.section}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Ubicación</Text>
            <Text style={styles.valueHighlight}>{distance} km</Text>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={100}
            step={1}
            value={distance}
            onValueChange={setDistance}
            minimumTrackTintColor="#9333ea"
            thumbTintColor="#9333ea"
          />
        </View>

        {/* Precio */}
        <View style={styles.section}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Precio máximo (COP)</Text>
            <DollarSign size={14} color="#9333ea" />
          </View>
          <Text style={styles.priceDisplay}>${price.toLocaleString()}</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={1000000}
            step={10000}
            value={price}
            onValueChange={setPrice}
            minimumTrackTintColor="#9333ea"
            thumbTintColor="#9333ea"
          />
        </View>

        {/* Disponibilidad */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Disponibilidad</Text>
          <TouchableOpacity style={styles.fakeSelector} onPress={() => setShowDatePicker(true)}>
            <Calendar size={14} color="#666" />
            <Text style={styles.selectorText}>
              {selectedDate ? selectedDate.toLocaleDateString() : "Fecha específica"}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={selectedDate || new Date()}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
        </View>

        <TouchableOpacity style={styles.resetButton} onPress={onResetFilters}>
          <Text style={styles.resetButtonText}>Limpiar filtros</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  panelContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#eee',
    maxHeight: Dimensions.get('window').height * 0.75,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  collapsedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    margin: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
  headerTitle: { fontSize: 14, fontWeight: 'bold', marginLeft: 8, color: '#1a1a1a' },
  collapsedTitle: { fontSize: 14, marginLeft: 8, color: '#666' },
  toggleLabel: { fontSize: 12, color: '#999' },
  scrollContent: { padding: 15 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 12, fontWeight: 'bold', color: '#333', borderBottomWidth: 1, borderBottomColor: '#f0f0f0', paddingBottom: 5, marginBottom: 10 },
  label: { fontSize: 11, color: '#666', marginBottom: 6 },
  fakeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee'
  },
  selectorText: { fontSize: 13, color: '#333' },
  slider: { width: '100%', height: 40 },
  valueHighlight: { fontSize: 12, color: '#9333ea', fontWeight: 'bold' },
  priceDisplay: { fontSize: 16, fontWeight: 'bold', color: '#1a1a1a', textAlign: 'center', marginVertical: 8 },
  resetButton: {
    backgroundColor: '#9333ea',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 10
  },
  resetButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
});