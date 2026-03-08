// src/components/contracts/ContractCard.tsx
// Tarjeta para mostrar información de un contrato

import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import type { Contract } from '../../types/contracts';
import ContractStatusBadge from './ContractStatusBadge';

interface ContractCardProps {
  contract: Contract;
  onPress: (contract: Contract) => void;
  showActions?: boolean;
}

export default function ContractCard({ 
  contract, 
  onPress, 
  showActions = true 
}: ContractCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: contract.currency
    }).format(price);
  };

  const getActionText = () => {
    switch (contract.status) {
      case 'pending_payment':
        return 'Pagar ahora';
      case 'escrow_hold':
        return 'Ver detalles';
      case 'in_progress':
        return 'En progreso';
      case 'disputed':
        return 'En disputa';
      case 'completed':
        return 'Completado';
      default:
        return 'Ver detalles';
    }
  };

  const getActionIcon = () => {
    switch (contract.status) {
      case 'pending_payment':
        return 'card-outline';
      case 'escrow_hold':
        return 'lock-closed-outline';
      case 'in_progress':
        return 'camera-outline';
      case 'disputed':
        return 'alert-circle-outline';
      case 'completed':
        return 'checkmark-circle-outline';
      default:
        return 'information-circle-outline';
    }
  };

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={() => onPress(contract)}
      activeOpacity={0.8}
    >
      {/* Header con avatar y estado */}
      <View style={styles.header}>
        <View style={styles.artistInfo}>
          {contract.artistAvatar && (
            <Image source={{ uri: contract.artistAvatar }} style={styles.avatar} />
          )}
          <View style={styles.artistDetails}>
            <Text style={styles.artistName}>{contract.artistName}</Text>
            <Text style={styles.serviceTitle}>{contract.serviceTitle}</Text>
          </View>
        </View>
        <ContractStatusBadge status={contract.status} size="small" />
      </View>

      {/* Detalles del evento */}
      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={16} color="#666" />
          <Text style={styles.detailText}>
            {formatDate(contract.eventDate)}
          </Text>
        </View>
        {contract.eventLocation && (
          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={16} color="#666" />
            <Text style={styles.detailText} numberOfLines={1}>
              {contract.eventLocation}
            </Text>
          </View>
        )}
      </View>

      {/* Precio y comisión */}
      <View style={styles.priceSection}>
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Total:</Text>
          <Text style={styles.price}>{formatPrice(contract.price)}</Text>
        </View>
        <View style={styles.commissionRow}>
          <Text style={styles.commissionText}>
            Incluye comisión plataforma ({formatPrice(contract.commission)})
          </Text>
        </View>
      </View>

      {/* Botón de acción */}
      {showActions && (
        <View style={styles.actionSection}>
          <LinearGradient
            colors={['#7c3aed', '#2563eb']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.actionButton}
          >
            <Ionicons 
              name={getActionIcon()} 
              size={16} 
              color="#fff" 
            />
            <Text style={styles.actionText}>
              {getActionText()}
            </Text>
          </LinearGradient>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  artistInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  artistDetails: {
    flex: 1,
  },
  artistName: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#1f2937',
    marginBottom: 2,
  },
  serviceTitle: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: '#6b7280',
  },
  details: {
    marginBottom: 16,
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#4b5563',
    flex: 1,
  },
  priceSection: {
    marginBottom: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  priceLabel: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#374151',
  },
  price: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#1f2937',
  },
  commissionRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  commissionText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#6b7280',
    textAlign: 'center',
  },
  actionSection: {
    marginTop: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
  },
  actionText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#fff',
  },
});
