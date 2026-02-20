// src/screens/auth/login/components/SocialButton.tsx
import React from 'react';
import { TouchableOpacity, Text, View, ActivityIndicator, StyleSheet } from 'react-native';

interface SocialButtonProps {
  provider: 'google' | 'apple' | 'facebook' | 'temp';
  onPress: () => void;
  isLoading?: boolean;
}

const PROVIDERS = {
  google: { label: 'Continuar con Google', icon: '🔵', bg: '#FFFFFF', border: '#E0E0E0', text: '#3C4043' },
  apple: { label: 'Continuar con Apple', icon: '🍎', bg: '#000000', border: '#000000', text: '#FFFFFF' },
  facebook: { label: 'Continuar con Facebook', icon: '📘', bg: '#1877F2', border: '#1877F2', text: '#FFFFFF' },
  temp: { label: 'Modo Desarrollo (Temp)', icon: '🚀', bg: '#6C5CE7', border: '#6C5CE7', text: '#FFFFFF' },
};

export const SocialButton = ({ provider, onPress, isLoading }: SocialButtonProps) => {
  const config = PROVIDERS[provider];

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: config.bg, borderColor: config.border }]}
      onPress={onPress}
      disabled={isLoading}
      activeOpacity={0.85}
      accessibilityLabel={config.label}
      accessibilityRole="button"
    >
      {isLoading ? (
        <ActivityIndicator color={config.text} size="small" />
      ) : (
        <View style={styles.content}>
          <Text style={styles.icon}>{config.icon}</Text>
          <Text style={[styles.label, { color: config.text }]}>{config.label}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 52,
    borderRadius: 14,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    // Área táctil mínima 44pt (Apple/Google HIG)
    minHeight: 44,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  icon: {
    fontSize: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
  },
});