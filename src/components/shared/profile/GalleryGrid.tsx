// src/components/shared/profile/GalleryGrid.tsx
// Grid mejorado para portafolio con favoritos animados
import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Pressable, Animated,
  Platform, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { GalleryItem } from '../../../services/api/portfolio';

const MAX_FEATURED = 5;

interface GalleryGridProps {
  items: GalleryItem[];
  onItemPress: (item: GalleryItem, index: number) => void;
  showEdit?: boolean;
  onDelete?: (item: GalleryItem) => void;
  onToggleFeatured?: (item: GalleryItem) => void;
  compactMode?: boolean; // Nuevo: modo compacto vs grande
}

// ── Photo Grid Item simple - sin favoritos ───────────────────────────────────

interface PhotoGridItemProps {
  item: GalleryItem;
  index: number;
  isOwner: boolean;
  onPress: (item: GalleryItem, index: number) => void;
  onDelete: (item: GalleryItem) => void;
  onToggleFeatured: (item: GalleryItem) => void;
}

const PhotoGridItem: React.FC<PhotoGridItemProps> = ({ item, index, isOwner, onPress, onDelete, onToggleFeatured }) => {
  const [pressAnim] = useState(new Animated.Value(1));
  const [showOptions, setShowOptions] = useState(false);

  const handlePressIn = () => {
    Animated.spring(pressAnim, {
      toValue: 0.95,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(pressAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  };

  const handleEditPress = (e: any) => {
    e.stopPropagation();
    setShowOptions(true);
  };

  const handleDeletePhoto = () => {
    setShowOptions(false);
    Alert.alert(
      'Eliminar foto',
      '¿Estás segura de que quieres eliminar esta foto de tu portafolio? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => onDelete(item),
        },
      ]
    );
  };

  const handleToggleFeatured = () => {
    setShowOptions(false);
    onToggleFeatured(item);
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.cell,
        pressed && { opacity: 0.9 }
      ]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={() => onPress(item, index)}
    >
      <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ scale: pressAnim }] }]}>
        <Image
          source={{ uri: item.imageUrl }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
        />
        
        {/* Gradiente sutil para mejor legibilidad */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.3)']}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />

        {/* Sin botón de editar - ahora está en GalleryModal */}

        {/* Estrellita fija para imágenes destacadas - efecto glasmórfico */}
        {item.isFeatured && (
          <View style={styles.featuredStarFixed}>
            <Ionicons name="star" size={16} color="#8b5cf6" />
          </View>
        )}

        {/* Info de la foto */}
        {item.title && (
          <View style={styles.infoBar}>
            <Text style={styles.infoText} numberOfLines={1}>{item.title}</Text>
          </View>
        )}
      </Animated.View>
    </Pressable>
  );
};

// ── Gallery Grid Component ─────────────────────────────────────────────────────

export const EnhancedGalleryGrid: React.FC<GalleryGridProps> = ({
  items,
  onItemPress,
  showEdit = false,
  onDelete,
  onToggleFeatured,
  compactMode = false, // Por defecto modo grande para fácil uso
}) => {
  // Determinar número de columnas según el modo
  const columnsPerRow = compactMode ? 3 : 2;
  const rows: GalleryItem[][] = [];
  for (let i = 0; i < items.length; i += columnsPerRow) {
    rows.push(items.slice(i, i + columnsPerRow));
  }

  const handleItemPress = (item: GalleryItem, index: number) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onItemPress(item, index);
  };

  return (
    <View style={styles.grid}>
      {rows.map((row, rowIdx) => (
        <View key={rowIdx} style={styles.row}>
          {row.map((item, colIdx) => (
            <PhotoGridItem
              key={item.id?.toString() || String(rowIdx * columnsPerRow + colIdx)}
              item={item}
              index={rowIdx * columnsPerRow + colIdx}
              isOwner={showEdit}
              onPress={handleItemPress}
              onDelete={onDelete || (() => {})}
              onToggleFeatured={onToggleFeatured || (() => {})}
            />
          ))}
          {/* Rellenar espacios vacíos para mantener el grid alineado */}
          {row.length === 1 && !compactMode && <View style={[styles.cell, { opacity: 0 }]} pointerEvents="none" />}
          {row.length === 1 && compactMode && (
            <>
              <View style={[styles.cell, { opacity: 0 }]} pointerEvents="none" />
              <View style={[styles.cell, { opacity: 0 }]} pointerEvents="none" />
            </>
          )}
          {row.length === 2 && compactMode && <View style={[styles.cell, { opacity: 0 }]} pointerEvents="none" />}
        </View>
      ))}
    </View>
  );
};

// ── Styles ─────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  grid: { gap: 8 },
  row: { flexDirection: 'row', gap: 8 },
  cell: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#1e1b4b',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
  },
  favoriteBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  favoriteGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cornerIndicator: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderLeftWidth: 20,
    borderBottomWidth: 20,
    borderLeftColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  cornerGradient: {
    position: 'absolute',
    top: -20,
    right: -20,
    width: 40,
    height: 40,
    borderRadius: 20,
    transform: [{ rotate: '45deg' }],
  },
  ownerActions: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    gap: 6,
  },
  featuredBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  disabledBtn: {
    opacity: 0.4,
  },
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  deleteBtn: {
    backgroundColor: 'rgba(239,68,68,0.85)',
    borderColor: 'rgba(239,68,68,0.3)',
  },
  infoBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  infoText: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#fff',
    flex: 1,
  },
  featuredTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: 'rgba(251,191,36,0.2)',
    borderRadius: 8,
    marginLeft: 4,
  },
  featuredText: {
    fontSize: 9,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#fbbf24',
  },
  // Estilos simples - sin favoritos
  ownerActionsSimple: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  actionBtnSimple: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  deleteBtnSimple: {
    backgroundColor: 'rgba(239,68,68,0.9)',
    borderColor: 'rgba(239,68,68,0.4)',
  },
  editBtnSimple: {
    backgroundColor: 'rgba(59,130,246,0.9)',
    borderColor: 'rgba(59,130,246,0.4)',
  },
  // Estrella glasmórfica para destacados
  featuredStarFixed: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    // Efecto espejo/glasmórfico
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
