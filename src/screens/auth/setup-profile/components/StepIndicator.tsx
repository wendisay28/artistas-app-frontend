// src/screens/auth/setup-profile/components/StepIndicator.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';

interface Props {
  total: number;
  current: number;
}

export const StepIndicator = ({ total, current }: Props) => (
  <View style={styles.row}>
    {Array.from({ length: total }).map((_, i) => (
      <View
        key={i}
        style={[styles.dot, i + 1 === current ? styles.dotActive : styles.dotInactive]}
      />
    ))}
  </View>
);

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8, justifyContent: 'center', marginBottom: 32 },
  dot: { height: 8, borderRadius: 4 },
  dotActive: { width: 24, backgroundColor: '#6C5CE7' },
  dotInactive: { width: 8, backgroundColor: '#DFE6E9' },
});