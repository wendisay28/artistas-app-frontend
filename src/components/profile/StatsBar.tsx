// components/profile/shared/StatsBar.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';

interface StatsBarProps {
  works: number;
  rating: number;
  followers: number;
  visits: string;
}

export default function StatsBar({
  works,
  rating,
  followers,
  visits,
}: StatsBarProps) {
  return (
    <View style={styles.statsBar}>
      <View style={styles.statItem}>
        <Text style={styles.statValue}>{works}</Text>
        <Text style={styles.statLabel}>Trabajos</Text>
      </View>
      
      <View style={styles.statDivider} />
      
      <View style={styles.statItem}>
        <Text style={styles.statValue}>{rating}</Text>
        <Text style={styles.statLabel}>Rating</Text>
      </View>
      
      <View style={styles.statDivider} />
      
      <View style={styles.statItem}>
        <Text style={styles.statValue}>{followers}</Text>
        <Text style={styles.statLabel}>Seguidores</Text>
      </View>
      
      <View style={styles.statDivider} />
      
      <View style={styles.statItem}>
        <Text style={styles.statValue}>{visits}</Text>
        <Text style={styles.statLabel}>Visitas</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  statsBar: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 17,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.text,
  },
  statLabel: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textSecondary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
  },
});