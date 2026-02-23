import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Product } from '../types';
import { Badge } from '../shared';
import { Colors } from '../../../../theme/colors';
import { Radius } from '../../../../theme/radius';
import { Spacing } from '../../../../theme/spacing';

type Props = {
  product: Product;
  onPress?: () => void;
  onAddToCart?: () => void;
};

export const ProductCard: React.FC<Props> = ({ product, onPress, onAddToCart }) => {
  const isOut = product.badge === 'out';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <LinearGradient
        colors={[product.gradientStart, product.gradientEnd]}
        style={styles.thumb}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {product.badge && (
          <View style={styles.badgePos}>
            <Badge
              variant={product.badge}
              label={product.badge === 'nft' ? 'NFT' : product.badge === 'low' ? 'Últimas' : 'Agotado'}
            />
          </View>
        )}
      </LinearGradient>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{product.name}</Text>
        <Text style={styles.type} numberOfLines={1}>{product.type}</Text>
        <View style={styles.bottom}>
          <Text style={styles.prtitle}>{product.price}</Text>
          <TouchableOpacity
            style={[styles.addBtn, isOut && styles.addBtnDisabled]}
            onPress={isOut ? undefined : onAddToCart}
            activeOpacity={isOut ? 1 : 0.7}
            disabled={isOut}
          >
            <Text style={[styles.addBtnText, isOut && styles.addBtnTextDisabled]}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    flex: 1,
  },
  thumb: {
    height: 130,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badgePos: {
    position: 'absolute',
    top: 8,
    left: 8,
  },
  info: { padding: Spacing.sm + 2 },
  name: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 3,
  },
  type: {
    fontSize: 10.5,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  bottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  prtitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.accent,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  addBtn: {
    width: 28,
    height: 28,
    backgroundColor: Colors.accent,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnDisabled: { opacity: 0.35 },
  addBtnText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.bg,
    lineHeight: 22,
  },
  addBtnTextDisabled: { color: Colors.text },
});