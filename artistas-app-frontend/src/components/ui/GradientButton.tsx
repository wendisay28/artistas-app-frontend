// src/components/ui/GradientButton.tsx
// Botón con gradiente #9333ea → #2563eb — componente reutilizable BuscArt

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface GradientButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

export const GradientButton: React.FC<GradientButtonProps> = ({
  label,
  onPress,
  loading = false,
  disabled = false,
  size = 'lg',
  fullWidth = true,
  icon,
}) => {
  const height = size === 'lg' ? 56 : size === 'md' ? 48 : 40;
  const fontSize = size === 'lg' ? 16 : size === 'md' ? 15 : 14;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.85}
      style={[styles.wrapper, fullWidth && styles.fullWidth, { height }, (disabled || loading) && styles.disabled]}
    >
      <LinearGradient
        colors={['#9333ea', '#2563eb']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.gradient, { height }]}
      >
        {loading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <View style={styles.row}>
            {icon && <View style={styles.iconWrap}>{icon}</View>}
            <Text style={[styles.label, { fontSize }]}>{label}</Text>
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  fullWidth: {
    width: '100%',
  },
  gradient: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconWrap: {
    marginRight: 2,
  },
  label: {
    color: '#fff',
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.5,
  },
});
