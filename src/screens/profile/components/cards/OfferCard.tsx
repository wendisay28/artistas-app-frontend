// components/profile/cards/OfferCard.tsx

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../../../constants/colors';

interface OfferCardProps {
  client: string;
  type: string;
  amount: string;
  time: string;
  onPress?: () => void;
}

export default function OfferCard({
  client,
  type,
  amount,
  time,
  onPress,
}: OfferCardProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.offerCard,
        pressed && styles.offerCardPressed,
      ]}
      onPress={onPress}
    >
      <View style={styles.offerIconBg}>
        <MaterialCommunityIcons
          name="briefcase-outline"
          size={18}
          color={colors.accent}
        />
      </View>

      <View style={styles.offerInfo}>
        <Text style={styles.offerClient}>{client}</Text>
        <Text style={styles.offerType}>{type}</Text>
      </View>

      <View style={styles.offerRight}>
        <Text style={styles.offerAmount}>${amount}</Text>
        <Text style={styles.offerTime}>{time}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  offerCard: {
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
  offerCardPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  offerIconBg: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: colors.accent + '12',
    alignItems: 'center',
    justifyContent: 'center',
  },
  offerInfo: {
    flex: 1,
    marginLeft: 10,
  },
  offerClient: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: colors.text,
  },
  offerType: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textSecondary,
    marginTop: 1,
  },
  offerRight: {
    alignItems: 'flex-end',
  },
  offerAmount: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.success,
  },
  offerTime: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textLight,
    marginTop: 1,
  },
});
