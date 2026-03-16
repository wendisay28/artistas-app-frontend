// ─────────────────────────────────────────────────────────────────────────────
// InfoPair.tsx — Label / Value row used in professional info sections
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../../constants/colors';
import { useThemeStore } from '../../../store/themeStore';

// ── Props ─────────────────────────────────────────────────────────────────────

interface InfoPairProps {
  label: string;
  value: string;
  /** Optional accent color for the value text */
  valueColor?: string;
  /** Extra container styles */
  style?: ViewStyle;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function InfoPair({
  label,
  value,
  valueColor,
  style,
}: InfoPairProps) {
  const { isDark } = useThemeStore();
  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.label, isDark && styles.labelDark]}>{label}</Text>
      <Text style={[styles.value, isDark && styles.valueDark, valueColor ? { color: valueColor } : null]}>
        {value}
      </Text>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 2,
  },
  label: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: colors.textSecondary,
  },
  labelDark: { color: 'rgba(167,139,250,0.65)' },
  value: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: colors.text,
  },
  valueDark: { color: '#f5f3ff' },
});