// components/profile/cards/EventCard.tsx

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../constants/colors';

interface EventCardProps {
  title: string;
  date: string;
  location: string;
  status: 'confirmed' | 'pending';
  onPress?: () => void;
}

export default function EventCard({
  title,
  date,
  location,
  status,
  onPress,
}: EventCardProps) {
  const isConfirmed = status === 'confirmed';
  const [day, month] = date.split(' ');

  return (
    <Pressable
      style={({ pressed }) => [
        styles.eventCard,
        pressed && styles.eventCardPressed,
      ]}
      onPress={onPress}
    >
      <View
        style={[
          styles.eventDateBox,
          {
            backgroundColor: isConfirmed
              ? colors.primary + '15'
              : colors.accent + '15',
          },
        ]}
      >
        <Text
          style={[
            styles.eventDateDay,
            { color: isConfirmed ? colors.primary : colors.accent },
          ]}
        >
          {day}
        </Text>
        <Text
          style={[
            styles.eventDateMonth,
            { color: isConfirmed ? colors.primary : colors.accent },
          ]}
        >
          {month}
        </Text>
      </View>

      <View style={styles.eventInfo}>
        <Text style={styles.eventTitle}>{title}</Text>
        <View style={styles.eventLocationRow}>
          <Ionicons name="location-outline" size={12} color={colors.textSecondary} />
          <Text style={styles.eventLocation}>{location}</Text>
        </View>
      </View>

      <View
        style={[
          styles.statusDot,
          { backgroundColor: isConfirmed ? colors.success : colors.warning },
        ]}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  eventCardPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  eventDateBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventDateDay: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  eventDateMonth: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_500Medium',
  },
  eventInfo: {
    flex: 1,
    marginLeft: 10,
  },
  eventTitle: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: colors.text,
  },
  eventLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 2,
  },
  eventLocation: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textSecondary,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});