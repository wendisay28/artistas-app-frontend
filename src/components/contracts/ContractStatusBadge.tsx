// src/components/contracts/ContractStatusBadge.tsx
// Badge para mostrar el estado del contrato

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ContractStatus, CONTRACT_STATUS_LABELS, CONTRACT_STATUS_COLORS } from '../../types/contracts';

interface ContractStatusBadgeProps {
  status: ContractStatus;
  size?: 'small' | 'medium' | 'large';
}

export default function ContractStatusBadge({ 
  status, 
  size = 'medium' 
}: ContractStatusBadgeProps) {
  const getIconName = (status: ContractStatus) => {
    switch (status) {
      case 'pending_payment': return 'time-outline';
      case 'escrow_hold': return 'lock-closed-outline';
      case 'in_progress': return 'camera-outline';
      case 'disputed': return 'alert-circle-outline';
      case 'completed': return 'checkmark-circle-outline';
      case 'cancelled': return 'close-circle-outline';
      case 'refunded': return 'refresh-outline';
      default: return 'help-circle-outline';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          container: { paddingHorizontal: 8, paddingVertical: 4 },
          text: { fontSize: 11 },
          icon: { size: 12 }
        };
      case 'large':
        return {
          container: { paddingHorizontal: 16, paddingVertical: 8 },
          text: { fontSize: 14 },
          icon: { size: 16 }
        };
      default: // medium
        return {
          container: { paddingHorizontal: 12, paddingVertical: 6 },
          text: { fontSize: 12 },
          icon: { size: 14 }
        };
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <View style={[
      styles.container,
      { backgroundColor: CONTRACT_STATUS_COLORS[status] },
      sizeStyles.container
    ]}>
      <Ionicons 
        name={getIconName(status)} 
        size={sizeStyles.icon.size} 
        color="#fff" 
      />
      <Text style={[styles.text, sizeStyles.text]}>
        {CONTRACT_STATUS_LABELS[status]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    gap: 6,
    alignSelf: 'flex-start',
  },
  text: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#fff',
  },
});
