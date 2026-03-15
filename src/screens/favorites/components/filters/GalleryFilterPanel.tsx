import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  Platform,
  Dimensions
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeStore } from '../../../../store/themeStore';

const { width } = Dimensions.get('window');

// Colores por categoría — misma paleta que FeedPost
const CATEGORY_COLORS: Record<string, [string, string]> = {
  'paintings':     ['#db2777', '#7c3aed'],
  'sculptures':    ['#7c3aed', '#2563eb'],
  'photography':  ['#0891b2', '#7c3aed'],
  'books':         ['#1e40af', '#0891b2'],
  'handicrafts':   ['#7c3aed', '#db2777'],
  'jewelry':      ['#059669', '#0891b2'],
  'literature':   ['#f59e0b', '#ef4444'],
  'fantasy':      ['#db2777', '#7c3aed'],
  'sci_fi':       ['#7c3aed', '#2563eb'],
  'contemporary': ['#0891b2', '#7c3aed'],
  'modern':       ['#1e40af', '#0891b2'],
  'abstract':     ['#7c3aed', '#db2777'],
  'minimalist':   ['#059669', '#0891b2'],
  'bestsellers':  ['#f59e0b', '#ef4444'],
  'new_arrivals': ['#db2777', '#7c3aed'],
  'featured':     ['#7c3aed', '#2563eb'],
};

export function GalleryFilterPanel({
  showFilters,
  selectedCategory,
  selectedBookType,
  selectedStyle,
  selectedTrend,
  priceRange,
  onCategoryChange,
  onBookTypeChange,
  onStyleChange,
  onTrendChange,
  onPriceRangeChange,
  onClearFilters,
  onClose
}: any) {
  const { isDark } = useThemeStore();

  if (!showFilters) return null;

  // Formateador simple para COP
  const formatCurrency = (val: number) => {
    return `$ ${val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
  };

  // Componente para secciones de selección (Tipo Chip Grid con gradientes)
  const FilterSection = ({ title, options, currentValue, onSelect }: any) => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>{title}</Text>
      <View style={styles.chipGrid}>
        {options.map((opt: any) => {
          const isSelected = currentValue === opt.value;
          const colors = CATEGORY_COLORS[opt.value] || ['#7c3aed', '#2563eb'];
          
          return (
            <TouchableOpacity
              key={opt.value}
              onPress={() => onSelect(isSelected ? '' : opt.value)}
              style={[styles.chip, isDark && styles.chipDark]}
            >
              {isSelected && (
                <LinearGradient
                  colors={colors}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={styles.chipSelectedGradient}
                />
              )}
              <Text style={[styles.chipText, isDark && styles.chipTextDark, isSelected && styles.chipTextSelected]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  return (
    <Modal visible={showFilters} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <Feather name="sliders" size={18} color="#9333ea" />
              <Text style={styles.headerTitle}>Filtros de Galería</Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeBtn}>Cerrar</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false}>
            
            {/* Rango de Precio - Visual */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Rango de Precio</Text>
              <View style={styles.priceContainer}>
                <View style={styles.priceBox}>
                  <Text style={styles.priceLabel}>Min</Text>
                  <Text style={styles.priceValue}>{formatCurrency(priceRange[0])}</Text>
                </View>
                <Ionicons name="remove" size={20} color="#94a3b8" />
                <View style={styles.priceBox}>
                  <Text style={styles.priceLabel}>Max</Text>
                  <Text style={styles.priceValue}>{formatCurrency(priceRange[1])}</Text>
                </View>
              </View>
              {/* Aquí se integraría el Slider de terceros o inputs */}
            </View>

            <FilterSection 
              title="Categorías"
              options={[
                { value: 'paintings', label: 'Pinturas' },
                { value: 'sculptures', label: 'Esculturas' },
                { value: 'photography', label: 'Fotografía' },
                { value: 'books', label: 'Libros' },
                { value: 'handicrafts', label: 'Manualidades' },
                { value: 'jewelry', label: 'Joyería' },
              ]}
              currentValue={selectedCategory}
              onSelect={onCategoryChange}
            />

            {selectedCategory === 'books' && (
              <FilterSection 
                title="Tipo de Libro"
                options={[
                  { value: 'literature', label: 'Literatura' },
                  { value: 'fantasy', label: 'Fantasía' },
                  { value: 'sci_fi', label: 'Ciencia Ficción' },
                ]}
                currentValue={selectedBookType}
                onSelect={onBookTypeChange}
              />
            )}

            <FilterSection 
              title="Estilo / Período"
              options={[
                { value: 'contemporary', label: 'Contemporáneo' },
                { value: 'modern', label: 'Moderno' },
                { value: 'abstract', label: 'Abstracto' },
                { value: 'minimalist', label: 'Minimalista' },
              ]}
              currentValue={selectedStyle}
              onSelect={onStyleChange}
            />

            <FilterSection 
              title="Tendencias"
              options={[
                { value: 'bestsellers', label: 'Más vendido' },
                { value: 'new_arrivals', label: 'Novedades' },
                { value: 'featured', label: 'Destacados' },
              ]}
              currentValue={selectedTrend}
              onSelect={onTrendChange}
            />
          </ScrollView>

          {/* Footer Acciones */}
          <View style={styles.footer}>
            <TouchableOpacity onPress={onClearFilters} style={styles.clearBtn}>
              <Text style={styles.clearBtnText}>Limpiar</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onClose} style={styles.applyBtnWrapper}>
              <LinearGradient
                colors={['#9333ea', '#2563eb']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={styles.applyBtn}
              >
                <Text style={styles.applyBtnText}>Aplicar Filtros</Text>
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
    paddingBottom: Platform.OS === 'ios' ? 34 : 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
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
    fontWeight: '700',
    color: '#4c1d95',
  },
  closeBtn: {
    color: '#9333ea',
    fontWeight: '600',
  },
  scrollBody: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionTitleDark: {
    color: '#f5f3ff',
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  chipDark: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderColor: 'rgba(167,139,250,0.25)',
  },
  chipSelected: {
    backgroundColor: '#9333ea',
    borderColor: '#9333ea',
  },
  chipSelectedGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
  },
  chipText: {
    fontSize: 13,
    color: '#64748b',
  },
  chipTextDark: {
    color: 'rgba(255,255,255,0.7)',
  },
  chipTextSelected: {
    color: 'white',
    fontWeight: '600',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  priceBox: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 10,
    color: '#94a3b8',
    marginBottom: 2,
  },
  priceValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    gap: 12,
  },
  clearBtn: {
    flex: 1,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  clearBtnText: {
    color: '#64748b',
    fontWeight: '600',
  },
  applyBtnWrapper: {
    flex: 2,
  },
  applyBtn: {
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
  },
});