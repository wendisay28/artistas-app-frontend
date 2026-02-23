// ─────────────────────────────────────────────────────────────
// ProductCard.tsx — Tarjeta de producto para la tienda
// ─────────────────────────────────────────────────────────────────────

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// Componente Badge local para evitar errores de importación
interface BadgeProps {
  type: 'featured' | 'new' | string;
  children: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({ type, children }) => {
  const getBadgeStyle = () => {
    switch (type) {
      case 'featured':
        return { backgroundColor: '#FF6B35' };
      case 'new':
        return { backgroundColor: '#0066CC' };
      default:
        return { backgroundColor: '#8B5CF6' };
    }
  };

  return (
    <View style={[styles.badge, getBadgeStyle()]}>
      <Text style={styles.badgeText}>{children}</Text>
    </View>
  );
};

// Tipos locales
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

interface ProductCardProps {
  product: Product;
  onPress: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(product)}
      activeOpacity={0.9}
    >
      {/* Thumbnail con gradiente */}
      <LinearGradient
        colors={[product.gradientStart, product.gradientEnd]}
        style={styles.thumb}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={{ opacity: 0.8 }}>
          <Ionicons
            name="image-outline"
            size={32}
            color={product.previewColor}
          />
        </View>

        {/* Badges top */}
        <View style={styles.badgeTopLeft}>
          {product.isFeatured && <Badge type="featured" />}
          {product.isNew && !product.isFeatured && <Badge type="new" />}
        </View>
        {product.badge && (
          <View style={styles.badgeTopRight}>
            <Badge type={product.badge} />
          </View>
        )}
      </LinearGradient>

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>
        <View style={styles.meta}>
          <Text style={styles.productType}>{product.type}</Text>
          <Text style={styles.price}>{product.price}</Text>
        </View>
        {product.rating !== undefined && (
          <View style={styles.rating}>
            <Ionicons name="star" size={12} color={Colors.starYellow} />
            <Text style={styles.ratingText}>{product.rating}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '48%',
    aspectRatio: 0.8,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  thumb: {
    width: '100%',
    height: '65%',
    borderRadius: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  badgeTopLeft: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    gap: 4,
  },
  badgeTopRight: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  info: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 4,
  },
  name: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: Colors.text,
    flex: 1,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productType: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: Colors.textSecondary,
    backgroundColor: Colors.background,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  price: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: Colors.primary,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: Colors.text,
  },
});
