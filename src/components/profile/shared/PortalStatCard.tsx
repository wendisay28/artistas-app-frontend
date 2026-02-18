// components/profile/shared/PortalStatCard.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../constants/colors';

interface PortalStatCardProps {
  icon: string;
  value: string;
  sub: string;
  color: string;
}

export default function PortalStatCard({
  icon,
  value,
  sub,
  color,
}: PortalStatCardProps) {
  return (
    <View style={styles.portalStatCard}>
      <View
        style={[
          styles.portalStatIconBg,
          { backgroundColor: color + '15' },
        ]}
      >
        <Ionicons name={icon as any} size={18} color={color} />
      </View>
      <Text style={styles.portalStatValue}>{value}</Text>
      <Text style={[styles.portalStatSub, { color }]}>{sub}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  portalStatCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  portalStatIconBg: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  portalStatValue: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.text,
  },
  portalStatSub: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    marginTop: 2,
  },
});