import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  Modal, 
  TextInput,
  Platform 
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// Simulamos la constante si no la tienes a mano
// import { ARTIST_CATEGORIES } from "@/constants/artistCategories";

export function FilterPanel({
  showFilters,
  selectedFilter,
  customDate,
  selectedProfession,
  sortByPrice,
  onFilterChange,
  onCustomDateChange,
  onProfessionChange,
  onSortByPrice,
  onClearFilters,
  onClose,
  artistCategories = [] // Pasar ARTIST_CATEGORIES como prop o importar
}: any) {

  const FilterOption = ({ label, isSelected, onPress }: any) => (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      {isSelected ? (
        <LinearGradient
          colors={['rgba(147, 51, 234, 0.1)', 'rgba(37, 99, 235, 0.1)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.optionSelected}
        >
          <Text style={styles.optionTextSelected}>{label}</Text>
          <Feather name="check" size={16} color="#7e22ce" />
        </LinearGradient>
      ) : (
        <View style={styles.optionUnselected}>
          <Text style={styles.optionTextUnselected}>{label}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={showFilters}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <Feather name="sliders" size={18} color="#9333ea" />
              <Text style={styles.headerTitle}>Filtro Avanzado</Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeText}>Cerrar</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Sección Fecha */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Filtrar por fecha</Text>
              <View style={styles.optionsGap}>
                <FilterOption 
                  label="Agregados recientemente" 
                  isSelected={selectedFilter === 'recent'} 
                  onPress={() => onFilterChange('recent')} 
                />
                <FilterOption 
                  label="Agregados hoy" 
                  isSelected={selectedFilter === 'today'} 
                  onPress={() => onFilterChange('today')} 
                />
                <FilterOption 
                  label="Fecha específica" 
                  isSelected={selectedFilter === 'custom'} 
                  onPress={() => onFilterChange('custom')} 
                />
                
                {selectedFilter === 'custom' && (
                  <TextInput
                    style={styles.dateInput}
                    placeholder="AAAA-MM-DD"
                    value={customDate}
                    onChangeText={onCustomDateChange}
                    placeholderTextColor="#9ca3af"
                  />
                )}
              </View>
            </View>

            {/* Sección Categoría */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Filtrar por categoría</Text>
              <View style={styles.pickerSubstitute}>
                <Text style={styles.pickerText}>
                  {selectedProfession || "Todas las categorías"}
                </Text>
                <Feather name="chevron-down" size={18} color="#6b7280" />
              </View>
              {/* Aquí podrías mapear las categorías si prefieres chips */}
            </View>

            {/* Sección Precio */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Ordenar por precio</Text>
              <View style={styles.optionsGap}>
                <FilterOption 
                  label="Menor precio" 
                  isSelected={sortByPrice === 'price_asc'} 
                  onPress={() => onSortByPrice('price_asc')} 
                />
                <FilterOption 
                  label="Mayor precio" 
                  isSelected={sortByPrice === 'price_desc'} 
                  onPress={() => onSortByPrice('price_desc')} 
                />
                <FilterOption 
                  label="Entrada libre" 
                  isSelected={sortByPrice === 'free'} 
                  onPress={() => onSortByPrice('free')} 
                />
              </View>
            </View>
          </ScrollView>

          {/* Footer Botones */}
          <View style={styles.footer}>
            <TouchableOpacity 
              style={styles.clearButton} 
              onPress={onClearFilters}
            >
              <Text style={styles.clearButtonText}>Limpiar filtros</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onClose} style={styles.applyButtonContainer}>
              <LinearGradient
                colors={['#9333ea', '#2563eb']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={styles.applyButton}
              >
                <Text style={styles.applyButtonText}>Aplicar</Text>
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
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingBottom: Platform.OS === 'ios' ? 30 : 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3e8ff',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4c1d95',
  },
  closeText: {
    fontSize: 12,
    color: '#9333ea',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3e8ff',
    paddingBottom: 4,
  },
  optionsGap: {
    gap: 8,
  },
  optionUnselected: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  optionSelected: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
  },
  optionTextUnselected: {
    color: '#374151',
    fontSize: 14,
  },
  optionTextSelected: {
    color: '#581c87',
    fontWeight: '500',
    fontSize: 14,
  },
  dateInput: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#e9d5ff',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    color: '#111827',
  },
  pickerSubstitute: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e9d5ff',
    padding: 12,
    borderRadius: 8,
  },
  pickerText: {
    color: '#374151',
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3e8ff',
  },
  clearButton: {
    flex: 1,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d8b4fe',
  },
  clearButtonText: {
    color: '#7e22ce',
    fontWeight: '500',
  },
  applyButtonContainer: {
    flex: 1,
  },
  applyButton: {
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  applyButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});