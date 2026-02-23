// src/components/explore/shared/UnifiedFiltersPanel.tsx
// Panel de filtros unificado que muestra el panel adecuado según la categoría

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CategoryId } from '../../../types/explore';

// Importar todos los paneles de filtros
import { ArtistFiltersPanel, type ArtistFiltersProps } from './FiltersPanel';
import { EventFiltersPanel, type EventFiltersProps } from './EventFiltersPanel';
import { VenueFiltersPanel, type VenueFilterProps } from './VenueFiltersPanel';
import { GalleryFiltersPanel, type GalleryFiltersProps } from './GalleryFiltersPanel';

// ── Props unificadas ─────────────────────────────────────────────────────

export interface UnifiedFiltersProps {
  isOpen: boolean;
  onToggle: () => void;
  category: CategoryId;
  
  // Props genéricas que aplican a todos los filtros
  distance: number;
  setDistance: (v: number) => void;
  price: number;
  setPrice: (v: number) => void;
  priceMin: number;
  setPriceMin: (v: number) => void;
  priceMax: number;
  setPriceMax: (v: number) => void;
  selectedDate: Date | null;
  setSelectedDate: (d: Date | null) => void;
  onResetFilters: () => void;
  
  // Props específicas de artistas
  categoryFilter?: string;
  setCategoryFilter?: (v: string) => void;
  subCategory?: string;
  setSubCategory?: (v: string) => void;
  selectedRole?: string;
  setSelectedRole?: (v: string) => void;
  selectedSpecialization?: string;
  setSelectedSpecialization?: (v: string) => void;
  selectedTads?: string[];
  setSelectedTads?: (updater: string[] | ((prev: string[]) => string[])) => void;
  selectedStats?: Record<string, any>;
  setSelectedStats?: (updater: Record<string, any> | ((prev: Record<string, any>) => Record<string, any>)) => void;
  priceType?: 'all' | 'free' | 'paid';
  setPriceType?: (v: 'all' | 'free' | 'paid') => void;
  
  // Props específicas de eventos
  format?: string;
  setFormat?: (v: string) => void;
  
  // Props específicas de venues
  sortBy?: string;
  setSortBy?: (v: string) => void;
  
  // Props específicas de galería
  transactionTypes?: string[];
  setTransactionTypes?: (updater: string[] | ((prev: string[]) => string[])) => void;
  conditions?: string[];
  setConditions?: (updater: string[] | ((prev: string[]) => string[])) => void;
}

// ── Componente ─────────────────────────────────────────────────────────

export const UnifiedFiltersPanel: React.FC<UnifiedFiltersProps> = ({
  isOpen,
  onToggle,
  category,
  
  // Props genéricas
  distance, setDistance,
  price, setPrice,
  priceMin, setPriceMin,
  priceMax, setPriceMax,
  selectedDate, setSelectedDate,
  onResetFilters,
  
  // Props específicas de artistas
  categoryFilter = 'all',
  setCategoryFilter = () => {},
  subCategory = 'all',
  setSubCategory = () => {},
  selectedRole = '',
  setSelectedRole = () => {},
  selectedSpecialization = '',
  setSelectedSpecialization = () => {},
  selectedTads = [],
  setSelectedTads = () => {},
  selectedStats = {},
  setSelectedStats = () => {},
  priceType = 'all',
  setPriceType = () => {},
  
  // Props específicas de eventos
  format = 'all',
  setFormat = () => {},
  
  // Props específicas de venues
  sortBy = 'rating',
  setSortBy = () => {},
  
  // Props específicas de galería
  transactionTypes = [],
  setTransactionTypes = () => {},
  conditions = [],
  setConditions = () => {},
}) => {
  // Renderizar el panel de filtros adecuado según la categoría
  const renderFiltersPanel = () => {
    switch (category) {
      case 'artists':
        return (
          <ArtistFiltersPanel
            isOpen={isOpen}
            onToggle={onToggle}
            distance={distance}
            setDistance={setDistance}
            priceMin={priceMin}
            setPriceMin={setPriceMin}
            priceMax={priceMax}
            setPriceMax={setPriceMax}
            priceType={priceType}
            setPriceType={setPriceType}
            category={categoryFilter}
            setCategory={setCategoryFilter}
            subCategory={subCategory}
            setSubCategory={setSubCategory}
            selectedRole={selectedRole}
            setSelectedRole={setSelectedRole}
            selectedSpecialization={selectedSpecialization}
            setSelectedSpecialization={setSelectedSpecialization}
            selectedTads={selectedTads}
            setSelectedTads={setSelectedTads}
            selectedStats={selectedStats}
            setSelectedStats={setSelectedStats}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            onResetFilters={onResetFilters}
          />
        );
        
      case 'events':
        return (
          <EventFiltersPanel
            isOpen={isOpen}
            onToggle={onToggle}
            distance={distance}
            setDistance={setDistance}
            price={price}
            setPrice={setPrice}
            category={categoryFilter}
            setCategory={setCategoryFilter}
            subCategory={subCategory}
            setSubCategory={setSubCategory}
            format={format}
            setFormat={setFormat}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            onResetFilters={onResetFilters}
          />
        );
        
      case 'venues':
        return (
          <VenueFiltersPanel
            isOpen={isOpen}
            onToggle={onToggle}
            distance={distance}
            setDistance={setDistance}
            price={price}
            setPrice={setPrice}
            category={categoryFilter}
            setCategory={setCategoryFilter}
            subCategory={subCategory}
            setSubCategory={setSubCategory}
            sortBy={sortBy}
            setSortBy={setSortBy}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            onResetFilters={onResetFilters}
          />
        );
        
      case 'gallery':
        return (
          <GalleryFiltersPanel
            isOpen={isOpen}
            onToggle={onToggle}
            distance={distance}
            setDistance={setDistance}
            priceMin={priceMin}
            setPriceMin={setPriceMin}
            priceMax={priceMax}
            setPriceMax={setPriceMax}
            category={categoryFilter}
            setCategory={setCategoryFilter}
            subCategory={subCategory}
            setSubCategory={setSubCategory}
            transactionTypes={transactionTypes}
            setTransactionTypes={setTransactionTypes}
            conditions={conditions}
            setConditions={setConditions}
            sortBy={sortBy}
            setSortBy={setSortBy}
            onResetFilters={onResetFilters}
          />
        );
        
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {renderFiltersPanel()}
    </View>
  );
};

// ── Estilos ────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default UnifiedFiltersPanel;
