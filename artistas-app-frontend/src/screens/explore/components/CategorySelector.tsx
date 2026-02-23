// ─────────────────────────────────────────────────────────────────────────────
// CategorySelector.tsx — Dropdown overlay para seleccionar categoría
// Aparece desde el botón de menú del header, lista las 4 categorías con iconos
// ─────────────────────────────────────────────────────────────────────────────

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
  Animated as RNAnimated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors } from '../../../constants/colors';
import type { CategoryId } from '../../../types/explore';

// ── Category definitions ──────────────────────────────────────────────────────

const CATEGORIES: {
  id: CategoryId;
  label: string;
  icon: string;
  description: string;
}[] = [
  {
    id:          'artists',
    label:       'Artistas',
    icon:        'brush-outline',
    description: 'Pintores, músicos, fotógrafos…',
  },
  {
    id:          'events',
    label:       'Eventos',
    icon:        'calendar-outline',
    description: 'Conciertos, exposiciones, shows…',
  },
  {
    id:          'venues',
    label:       'Salas',
    icon:        'business-outline',
    description: 'Teatros, galerías, espacios…',
  },
  {
    id:          'gallery',
    label:       'Galería',
    icon:        'images-outline',
    description: 'Obras, pinturas, esculturas…',
  },
];

// ── Props ─────────────────────────────────────────────────────────────────────

interface CategorySelectorProps {
  selected:  CategoryId;
  onChange:  (category: CategoryId) => void;
  topOffset: number;
  onClose:   () => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function CategorySelector({
  selected,
  onChange,
  topOffset,
  onClose,
}: CategorySelectorProps) {
  const fadeAnim  = useRef(new RNAnimated.Value(0)).current;
  const slideAnim = useRef(new RNAnimated.Value(-8)).current;

  // ── Mount animation ────────────────────────────────────────────────────────
  useEffect(() => {
    RNAnimated.parallel([
      RNAnimated.timing(fadeAnim, {
        toValue:         1,
        duration:        180,
        useNativeDriver: true,
      }),
      RNAnimated.spring(slideAnim, {
        toValue:         0,
        tension:         80,
        friction:        10,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleSelect = (id: CategoryId) => {
    if (Platform.OS !== 'web') Haptics.selectionAsync();
    onChange(id);
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      {/* backdrop — closes on tap */}
      <Pressable
        style={StyleSheet.absoluteFill}
        onPress={onClose}
      />

      {/* dropdown panel */}
      <RNAnimated.View
        style={[
          styles.panel,
          {
            top:       topOffset,
            opacity:   fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* header label */}
        <Text style={styles.panelLabel}>Explorar</Text>

        {/* category items */}
        {CATEGORIES.map((cat, i) => {
          const isActive = selected === cat.id;
          return (
            <Pressable
              key={cat.id}
              onPress={() => handleSelect(cat.id)}
              style={({ pressed }) => [
                styles.item,
                isActive  && styles.itemActive,
                pressed   && styles.itemPressed,
                i < CATEGORIES.length - 1 && styles.itemBorder,
              ]}
            >
              {/* icon circle */}
              <View style={[
                styles.iconCircle,
                isActive && styles.iconCircleActive,
              ]}>
                <Ionicons
                  name={cat.icon as any}
                  size={18}
                  color={isActive ? colors.primary : colors.textSecondary}
                />
              </View>

              {/* text */}
              <View style={styles.itemText}>
                <Text style={[
                  styles.itemLabel,
                  isActive && styles.itemLabelActive,
                ]}>
                  {cat.label}
                </Text>
                <Text style={styles.itemDescription}>
                  {cat.description}
                </Text>
              </View>

              {/* active checkmark */}
              {isActive && (
                <Ionicons
                  name="checkmark-circle"
                  size={18}
                  color={colors.primary}
                />
              )}
            </Pressable>
          );
        })}
      </RNAnimated.View>
    </>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  // dropdown panel
  panel: {
    position:        'absolute',
    left:            16,
    width:           220,
    backgroundColor: '#fff',
    borderRadius:    18,
    paddingVertical: 8,
    zIndex:          100,
    shadowColor:     '#000',
    shadowOffset:    { width: 0, height: 8 },
    shadowOpacity:   0.14,
    shadowRadius:    20,
    elevation:       10,
    borderWidth:     1,
    borderColor:     colors.border,
  },

  // header label inside panel
  panelLabel: {
    fontSize:       11,
    fontFamily:     'PlusJakartaSans_600SemiBold',
    color:          colors.textSecondary,
    textTransform:  'uppercase',
    letterSpacing:  0.8,
    paddingHorizontal: 14,
    paddingTop:     6,
    paddingBottom:  8,
  },

  // category item row
  item: {
    flexDirection:  'row',
    alignItems:     'center',
    gap:            12,
    paddingHorizontal: 12,
    paddingVertical:   11,
  },
  itemActive: {
    backgroundColor: colors.primary + '08',
  },
  itemPressed: {
    backgroundColor: colors.background,
  },
  itemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  // icon circle
  iconCircle: {
    width:           38,
    height:          38,
    borderRadius:    19,
    backgroundColor: colors.background,
    alignItems:      'center',
    justifyContent:  'center',
    borderWidth:     1,
    borderColor:     colors.border,
  },
  iconCircleActive: {
    backgroundColor: colors.primary + '12',
    borderColor:     colors.primary + '30',
  },

  // text block
  itemText: {
    flex: 1,
  },
  itemLabel: {
    fontSize:   14,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color:      colors.text,
  },
  itemLabelActive: {
    color:      colors.primary,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  itemDescription: {
    fontSize:   11,
    fontFamily: 'PlusJakartaSans_400Regular',
    color:      colors.textSecondary,
    marginTop:  1,
  },
});