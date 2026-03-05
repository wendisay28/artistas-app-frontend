// ─────────────────────────────────────────────────────────────────────────────
// InfoPair.tsx — Label / Value row used in professional info sections
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../../constants/colors';

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
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, valueColor ? { color: valueColor } : null]}>
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
  value: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: colors.text,
  },
});