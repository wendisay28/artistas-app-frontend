import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons'; // Equivalentes a Lucide
import { LinearGradient } from 'expo-linear-gradient';

interface FilterControlsProps {
  showFilters: boolean;
  selectedForComparison: number[];
  onShowFilters: () => void;
  onShowComparison: () => void;
  filterPanel?: React.ReactNode;
}

export function FilterControls({
  showFilters,
  selectedForComparison,
  onShowFilters,
  onShowComparison,
  filterPanel
}: FilterControlsProps) {
  const hasComparison = selectedForComparison.length >= 2;

  return (
    <View style={styles.container}>
      {hasComparison && (
        <TouchableOpacity onPress={onShowComparison} activeOpacity={0.8}>
          <LinearGradient
            colors={['#9333ea', '#2563eb']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.compareButton}
          >
            <Ionicons name="git-compare-outline" size={16} color="white" style={styles.icon} />
            <Text style={styles.compareText}>
              Comparar ({selectedForComparison.length})
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        onPress={onShowFilters}
        style={[
          styles.filterButton,
          showFilters ? styles.filterButtonActive : styles.filterButtonInactive
        ]}
      >
        <Feather 
          name="sliders" 
          size={16} 
          color={showFilters ? '#7e22ce' : '#374151'} 
          style={styles.icon} 
        />
        <Text style={[
          styles.filterText,
          showFilters ? styles.filterTextActive : styles.filterTextInactive
        ]}>
          Filtros
        </Text>
      </TouchableOpacity>

      {/* Nota: En móvil, el filterPanel suele ser un Modal o BottomSheet.
         Si es un componente absoluto, asegúrate de manejar el zIndex.
      */}
      {filterPanel}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
    width: '100%',
    position: 'relative',
  },
  compareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    paddingHorizontal: 16,
    borderRadius: 8,
    shadowColor: '#9333ea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  compareText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    transitionProperty: 'all',
    transitionDuration: '200ms',
  },
  filterButtonInactive: {
    backgroundColor: 'white',
    borderColor: '#e9d5ff', // purple-200
  },
  filterButtonActive: {
    backgroundColor: '#f5f3ff', // purple-50
    borderColor: '#a855f7', // purple-500
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  filterTextInactive: {
    color: '#374151', // gray-700
  },
  filterTextActive: {
    color: '#7e22ce', // purple-700
  },
  icon: {
    marginRight: 8,
  }
});