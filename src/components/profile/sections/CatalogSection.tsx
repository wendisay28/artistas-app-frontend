// components/profile/sections/CatalogSection.tsx

import React from 'react';
import { View, StyleSheet } from 'react-native';
import CatalogCard from '../cards/CatalogCard';
import type { CatalogItem } from '../../../types/profile';

interface CatalogSectionProps {
  items: CatalogItem[];
  onItemPress?: (id: string) => void;
}

export default function CatalogSection({
  items,
  onItemPress,
}: CatalogSectionProps) {
  return (
    <View style={styles.catalogGrid}>
      {items.map((item) => (
        <CatalogCard
          key={item.id}
          title={item.title}
          price={item.price}
          image={item.image}
          tag={item.tag}
          onPress={() => onItemPress?.(item.id)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  catalogGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    gap: 10,
  },
});