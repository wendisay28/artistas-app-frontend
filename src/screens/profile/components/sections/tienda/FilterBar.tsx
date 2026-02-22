// ─────────────────────────────────────────────────────────────────────
// FilterBar.tsx — Barra de filtros para la tienda
// ─────────────────────────────────────────────────────────────────────

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type FilterKey = 'todo' | 'digital' | 'nft' | 'fisico' | 'musica' | 'cursos';

interface FilterDef {
  key: FilterKey;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}

interface FilterBarProps {
  filters: FilterDef[];
  activeFilter: FilterKey;
  onFilterChange: (filter: FilterKey) => void;
}

const FILTERS: FilterDef[] = [
  { key: 'todo',    label: 'Todo',         icon: 'apps-outline'          },
  { key: 'digital',  label: 'Arte digital', icon: 'image-outline'         },
  { key: 'nft',     label: 'NFT',          icon: 'diamond-outline'       },
  { key: 'fisico',  label: 'Físico',       icon: 'cube-outline'          },
  { key: 'musica',  label: 'Música',       icon: 'musical-notes-outline' },
  { key: 'cursos',  label: 'Cursos',       icon: 'school-outline'        },
];

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  activeFilter,
  onFilterChange,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
    >
      {filters.map((filter) => {
        const isActive = filter.key === activeFilter;
        return (
          <TouchableOpacity
            key={filter.key}
            style={[styles.filterChip, isActive && styles.activeFilter]}
            onPress={() => onFilterChange(filter.key)}
          >
            <Ionicons
              name={filter.icon}
              size={14}
              color={isActive ? '#FFFFFF' : '#666666'}
            />
            <Text style={[styles.filterText, isActive && styles.activeText]}>
              {filter.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginRight: 8,
  },
  activeFilter: {
    backgroundColor: '#0066CC',
    borderColor: '#0066CC',
  },
  filterText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: '#666666',
    marginLeft: 6,
  },
  activeText: {
    color: '#FFFFFF',
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
});
