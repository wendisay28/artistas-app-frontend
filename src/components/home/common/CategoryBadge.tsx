// src/components/common/CategoryBadge.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export type CategoryType =
  | 'music'
  | 'photography'
  | 'design'
  | 'video'
  | 'voice'
  | 'art'
  | 'performance'
  | 'writing';

interface CategoryBadgeProps {
  category: CategoryType;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
  style?: ViewStyle;
}

const CATEGORY_CONFIG = {
  music: {
    icon: 'musical-notes-outline' as const,
    label: 'Música en Vivo',
    colors: ['#a855f7', '#ec4899'],
    gradient: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
  },
  photography: {
    icon: 'camera-outline' as const,
    label: 'Fotografía',
    colors: ['#3b82f6', '#06b6d4'],
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
  },
  design: {
    icon: 'brush-outline' as const,
    label: 'Diseño Gráfico',
    colors: ['#f97316', '#ef4444'],
    gradient: 'linear-gradient(135deg, #f97316 0%, #ef4444 100%)',
  },
  video: {
    icon: 'videocam-outline' as const,
    label: 'Video & Producción',
    colors: ['#8b5cf6', '#6366f1'],
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
  },
  voice: {
    icon: 'mic-outline' as const,
    label: 'Locución & Audio',
    colors: ['#06b6d4', '#0891b2'],
    gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
  },
  art: {
    icon: 'color-palette-outline' as const,
    label: 'Arte & Decoración',
    colors: ['#f59e0b', '#f97316'],
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
  },
  performance: {
    icon: 'sparkles-outline' as const,
    label: 'Performance & Show',
    colors: ['#ec4899', '#d946ef'],
    gradient: 'linear-gradient(135deg, #ec4899 0%, #d946ef 100%)',
  },
  writing: {
    icon: 'pencil-outline' as const,
    label: 'Escritura',
    colors: ['#10b981', '#059669'],
    gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  },
};

const SIZE_CONFIG = {
  small: {
    container: 20,
    icon: 10,
    fontSize: 9,
    padding: 6,
  },
  medium: {
    container: 28,
    icon: 14,
    fontSize: 11,
    padding: 8,
  },
  large: {
    container: 40,
    icon: 20,
    fontSize: 13,
    padding: 12,
  },
};

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({
  category,
  size = 'medium',
  showLabel = false,
  style,
}) => {
  const config = CATEGORY_CONFIG[category];
  const sizeConfig = SIZE_CONFIG[size];
  const iconName = config.icon;

  if (!config) {
    console.warn(`Unknown category: ${category}`);
    return null;
  }

  if (showLabel) {
    return (
      <View style={[styles.labelContainer, style]}>
        <View
          style={[
            styles.labelBadge,
            {
              backgroundColor: config.colors[0],
              paddingVertical: sizeConfig.padding / 2,
              paddingHorizontal: sizeConfig.padding,
            },
          ]}
        >
          <Ionicons name={iconName} size={sizeConfig.icon} color="#fff" />
          <Text
            style={[
              styles.labelText,
              { fontSize: sizeConfig.fontSize },
            ]}
          >
            {config.label}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.iconBadge,
        {
          width: sizeConfig.container,
          height: sizeConfig.container,
          borderRadius: sizeConfig.container / 2,
          backgroundColor: config.colors[0],
        },
        style,
      ]}
    >
      <Ionicons name={iconName} size={sizeConfig.icon} color="#fff" />
    </View>
  );
};

// Helper function to get category color
export const getCategoryColor = (category: CategoryType): string => {
  return CATEGORY_CONFIG[category]?.colors[0] || '#8b5cf6';
};

// Helper function to get category gradient colors
export const getCategoryGradient = (category: CategoryType): string[] => {
  return CATEGORY_CONFIG[category]?.colors || ['#8b5cf6', '#6366f1'];
};

// Helper function to get category label
export const getCategoryLabel = (category: CategoryType): string => {
  return CATEGORY_CONFIG[category]?.label || 'Categoría';
};

// Helper function to get category icon component
export const getCategoryIcon = (category: CategoryType) => {
  return CATEGORY_CONFIG[category]?.icon || 'sparkles-outline';
};

const styles = StyleSheet.create({
  iconBadge: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  labelContainer: {
    alignSelf: 'flex-start',
  },
  labelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  labelText: {
    fontWeight: '700',
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});