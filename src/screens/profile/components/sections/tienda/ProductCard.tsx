// ─────────────────────────────────────────────────────────────────────
// ProductCard.tsx — Tarjeta de producto (alineada al diseño BuscArt)
// ─────────────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(167,139,250,0.18)',
    overflow: 'hidden',
    shadowColor: '#5b21b6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 16,
    elevation: 4,
  },
  cardPressed: {
    opacity: 0.93,
    transform: [{ scale: 0.975 }],
  },

  // ── imagen ──
  imageWrapper: {
    height: 160,
    backgroundColor: '#e5e7eb',
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
  },

  // badge
  badge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeFeatured: { backgroundColor: 'rgba(124,58,237,0.85)' },
  badgeNew: { backgroundColor: 'rgba(37,99,235,0.85)' },
  badgeText: {
    fontSize: 8,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // disponibilidad
  availBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.55)',
  },
  availDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  availText: {
    fontSize: 9.5,
    fontFamily: 'PlusJakartaSans_700Bold',
    letterSpacing: 0.2,
  },

  // nombre + verificado + reseñas
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 3,
  },
  verifiedBadge: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#7c3aed',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  // fila disponibilidad + proximidad
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 9,
    flexWrap: 'nowrap',
  },
  distanceText: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(109,40,217,0.5)',
    flexShrink: 1,
  },

  // tags
  tagsRow: {
    flexDirection: 'row',
    gap: 5,
    marginBottom: 2,
  },
  tag: {
    backgroundColor: 'rgba(124,58,237,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(124,58,237,0.15)',
    borderRadius: 20,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  tagText: {
    fontSize: 9.5,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#7c3aed',
    letterSpacing: 0.1,
  },

  // precio
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 1,
  },
  priceUnit: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(109,40,217,0.45)',
  },
  heartBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.90)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#5b21b6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },

  // categoría — inferior izquierda
  typePill: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 4,
    maxWidth: '65%',
  },
  typeText: {
    fontSize: 9.5,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#fff',
    letterSpacing: 0.3,
  },

  // rating — inferior derecha
  ratingBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(0,0,0,0.50)',
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 4,
  },
  ratingValue: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: '#fff',
  },

  // ── contenido ──
  content: {
    paddingHorizontal: 12,
    paddingTop: 11,
    paddingBottom: 12,
  },

  // nombre
  name: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: '#1e1b4b',
    lineHeight: 18,
  },

  // divisor
  divider: {
    height: 1,
    backgroundColor: 'rgba(167,139,250,0.15)',
    marginBottom: 9,
  },

  // footer
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceLabel: {
    fontSize: 9.5,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: 'rgba(109,40,217,0.45)',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 1,
  },
  priceValue: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: '#7c3aed',
    lineHeight: 19,
  },

  // botón contratar
  contactBtn: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 3,
  },
  contactBtnPressed: {
    opacity: 0.72,
  },
  contactGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
});

interface Product {
  id: string;
  name: string;
  price: string;
  type: string;
  rating?: number;
  isFeatured?: boolean;
  isNew?: boolean;
  gradientStart: string;
  gradientEnd: string;
  previewColor: string;
  // Campos adicionales para coincidir con FavoriteArtist
  image?: string;
  availability?: 'Disponible' | 'Ocupado';
  verified?: boolean;
  distance?: string;
  tags?: string[];
  bio?: string;
  location?: string;
}

interface ProductCardProps {
  product: Product;
  onPress: (product: Product) => void;
  onToggleFavorite?: (id: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onPress, onToggleFavorite }) => {
  const [saved, setSaved] = useState(false);
  const isAvail = product.availability === 'Disponible';

  const handleToggleFavorite = () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSaved(p => !p);
    onToggleFavorite?.(product.id);
  };

  const handleContact = () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // onContact?.(product.id);
  };

  const formatCOP = (price: string) => price; // Ya viene formateado

  return (
    <Pressable
      onPress={() => onPress(product)}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
      ]}
    >
      {/* ── IMAGEN ── */}
      <View style={styles.imageWrapper}>
        <LinearGradient
          colors={[product.gradientStart, product.gradientEnd]}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={{ opacity: 0.7 }}>
            <Ionicons name="image-outline" size={28} color={product.previewColor} />
          </View>
        </LinearGradient>

        {/* Gradiente inferior sobre imagen */}
        <LinearGradient
          colors={['transparent', 'rgba(30,27,75,0.72)']}
          style={styles.imageGradient}
        />

        {/* Disponibilidad — arriba izquierda */}
        <View style={[
          styles.availBadge,
          { backgroundColor: isAvail ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)' },
        ]}>
          <View style={[
            styles.availDot,
            { backgroundColor: isAvail ? '#10b981' : '#f59e0b' },
          ]} />
          <Text style={[
            styles.availText,
            { color: isAvail ? '#065f46' : '#92400e' },
          ]}>
            {isAvail ? 'Disponible' : 'Ocupado'}
          </Text>
        </View>

        {/* Corazón — arriba derecha */}
        <Pressable
          onPress={handleToggleFavorite}
          hitSlop={8}
          style={({ pressed }) => [
            styles.heartBtn,
            pressed && { opacity: 0.6 },
          ]}
        >
          <Ionicons
            name={saved ? 'heart' : 'heart-outline'}
            size={17}
            color={saved ? '#ef4444' : '#9ca3af'}
          />
        </Pressable>

        {/* Badge */}
        {(product.isFeatured || product.isNew) && (
          <View style={[styles.badge, product.isFeatured ? styles.badgeFeatured : styles.badgeNew]}>
            <Text style={styles.badgeText}>
              {product.isFeatured ? 'Destacado' : 'Nuevo'}
            </Text>
          </View>
        )}

        {/* Categoría — abajo izquierda */}
        <LinearGradient
          colors={['rgba(124,58,237,0.82)', 'rgba(37,99,235,0.82)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.typePill}
        >
          <Text style={styles.typeText} numberOfLines={1}>{product.type}</Text>
        </LinearGradient>

        {/* Rating — abajo derecha */}
        {product.rating !== undefined && (
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={10} color="#fbbf24" />
            <Text style={styles.ratingValue}>{product.rating}</Text>
          </View>
        )}
      </View>

      {/* ── CONTENIDO ── */}
      <View style={styles.content}>

        {/* Nombre + verificado + reseñas */}
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>{product.name}</Text>
          {product.verified && (
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark" size={9} color="#fff" />
            </View>
          )}
        </View>

        {/* Proximidad */}
        {product.distance && (
          <View style={styles.metaRow}>
            <Ionicons name="location-outline" size={10} color="rgba(109,40,217,0.45)" />
            <Text style={styles.distanceText}>Medellín · {product.distance}</Text>
          </View>
        )}

        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <View style={styles.tagsRow}>
            {product.tags.slice(0, 2).map((tag, i) => (
              <View key={i} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Divisor */}
        <View style={styles.divider} />

        {/* Precio + botón contratar */}
        <View style={styles.footer}>
          <View>
            <Text style={styles.priceLabel}>Desde</Text>
            <View style={styles.priceRow}>
              <Text style={styles.priceValue}>{formatCOP(product.price)}</Text>
              <Text style={styles.priceUnit}>/h</Text>
            </View>
          </View>

          <Pressable
            onPress={handleContact}
            style={({ pressed }) => [
              styles.contactBtn,
              pressed && styles.contactBtnPressed,
            ]}
          >
            <LinearGradient
              colors={['#7c3aed', '#2563eb']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.contactGradient}
            >
              <Ionicons name="chevron-forward" size={12} color="#fff" />
            </LinearGradient>
          </Pressable>
        </View>

      </View>
    </Pressable>
  );
};
