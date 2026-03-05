import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ProductCard } from './ProductCard';

// El gap entre columnas debe coincidir con lo declarado en favoritos
const COLUMN_GAP = 12;
const H_PADDING = 16;

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
  image?: string;
  availability?: 'Disponible' | 'Ocupado';
  verified?: boolean;
  distance?: string;
  tags?: string[];
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
  return (
    <View style={styles.container}>
      {products.map((item, index) => (
        <View key={item.id} style={styles.productWrapper}>
          <ProductCard
            product={item}
            onPress={() => onProductPress(item)}
          />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: H_PADDING - 8, // Reducir padding para mover tarjetas hacia bordes
    paddingTop: 4,
    paddingBottom: 16,
    justifyContent: 'space-between',
  },
  productWrapper: {
    width: '48%', // Reducir ancho de tarjeta (era 50%)
    marginBottom: COLUMN_GAP,
  },
});