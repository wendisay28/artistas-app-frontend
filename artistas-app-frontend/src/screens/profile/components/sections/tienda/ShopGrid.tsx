// ─────────────────────────────────────────────────────────────────────
// ShopGrid.tsx — Grid de productos para la tienda
// ─────────────────────────────────────────────────────────────────────

import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { ProductCard } from './ProductCard';

interface Product {
  id: string;
  name: string;
  price: string;
  type: string;
  rating?: number;
  isFeatured?: boolean;
  isNew?: boolean;
  badge?: string;
  gradientStart: string;
  gradientEnd: string;
  previewColor: string;
}

interface ShopGridProps {
  products: Product[];
  onProductPress: (product: Product) => void;
  onEndReached?: () => void;
}

export const ShopGrid: React.FC<ShopGridProps> = ({
  products,
  onProductPress,
  onEndReached,
}) => {
  const renderProduct = ({ item }: { item: Product }) => (
    <ProductCard
      product={item}
      onPress={() => onProductPress(item)}
    />
  );

  return (
    <FlatList
      data={products}
      renderItem={renderProduct}
      keyExtractor={(item) => item.id}
      numColumns={2}
      contentContainerStyle={styles.container}
      columnWrapperStyle={styles.row}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  row: {
    justifyContent: 'space-between',
  },
});
