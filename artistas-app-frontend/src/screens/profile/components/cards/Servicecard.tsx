import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Service } from '../types';
import { Colors } from '../../../../theme/colors';
import { Radius } from '../../../../theme/radius';
import { Spacing } from '../../../../theme/spacing';

type Props = {
  service: Service;
  onPress?: () => void;
};

export const ServiceCard: React.FC<Props> = ({ service, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
    <LinearGradient
      colors={service.bgGradient}
      style={styles.icon}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Ionicons name={service.icon as any} size={22} color="rgba(255,255,255,0.85)" />
    </LinearGradient>

    <View style={styles.body}>
      <Text style={styles.name}>{service.name}</Text>
      <Text style={styles.desc} numberOfLines={2}>{service.description}</Text>
      <View style={styles.footer}>
        <Text style={styles.prtitle}>{service.price}</Text>
        <View style={styles.deliveryTag}>
          <Text style={styles.deliveryText}>{service.deliveryTag}</Text>
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.sm,
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  body: { flex: 1 },
  name: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 3,
  },
  desc: {
    fontSize: 11.5,
    color: Colors.text,
    lineHeight: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 7,
  },
  prtitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.accent,
    fontFamily: 'PlusJakartaSans_700Bold',
  },
  deliveryTag: {
    backgroundColor: Colors.surface2,
    borderRadius: Radius.sm,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  deliveryText: {
    fontSize: 10,
    color: Colors.text,
  },
});