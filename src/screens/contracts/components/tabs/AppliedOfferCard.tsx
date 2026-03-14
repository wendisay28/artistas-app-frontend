// components/hiring/tabs/AppliedOfferCard.tsx
//
// Card para mostrar ofertas que ya han sido aplicadas o aceptadas
// Muestra el estado actual y acciones disponibles según el estado

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Offer } from '../../../../types/hiring';
import { Colors } from '../../../../theme/colors';

interface AppliedOfferCardProps {
  offer: Offer;
  applicationStatus?: 'pending' | 'accepted' | 'rejected' | 'in_progress' | 'completed';
  appliedDate?: string;
  onViewDetails?: () => void;
  onMessage?: () => void;
  onCancel?: () => void;
}

export default function AppliedOfferCard({
  offer,
  applicationStatus = 'pending',
  appliedDate,
  onViewDetails,
  onMessage,
  onCancel,
}: AppliedOfferCardProps) {
  // Configuración según estado
  const getStatusConfig = () => {
    switch (applicationStatus) {
      case 'pending':
        return {
          color: '#F59E0B',
          bgColor: '#FEF3C7',
          icon: 'time-outline',
          label: 'Aplicación enviada',
          description: 'Esperando respuesta del cliente',
          showActions: true,
          showCancel: true,
        };
      case 'accepted':
        return {
          color: '#10B981',
          bgColor: '#D1FAE5',
          icon: 'checkmark-circle-outline',
          label: 'Oferta aceptada',
          description: 'El cliente ha aceptado tu aplicación',
          showActions: true,
          showCancel: false,
        };
      case 'rejected':
        return {
          color: '#EF4444',
          bgColor: '#FEE2E2',
          icon: 'close-circle-outline',
          label: 'Aplicación rechazada',
          description: 'El cliente ha seleccionado a otro artista',
          showActions: false,
          showCancel: false,
        };
      case 'in_progress':
        return {
          color: '#3B82F6',
          bgColor: '#DBEAFE',
          icon: 'play-circle-outline',
          label: 'En progreso',
          description: 'Trabajo actualmente en curso',
          showActions: true,
          showCancel: false,
        };
      case 'completed':
        return {
          color: '#8B5CF6',
          bgColor: '#EDE9FE',
          icon: 'checkmark-done-circle-outline',
          label: 'Completado',
          description: 'Trabajo finalizado exitosamente',
          showActions: false,
          showCancel: false,
        };
      default:
        return {
          color: Colors.textSecondary,
          bgColor: Colors.background,
          icon: 'help-circle-outline',
          label: 'Estado desconocido',
          description: 'Contacta soporte',
          showActions: false,
          showCancel: false,
        };
    }
  };

  const statusConfig = getStatusConfig();

  const formatBudget = () => {
    if (offer.budget_min && offer.budget_max) {
      return `€${offer.budget_min} - €${offer.budget_max}`;
    }
    if (offer.budget_max) {
      return `Hasta €${offer.budget_max}`;
    }
    if (offer.budget_min) {
      return `Desde €${offer.budget_min}`;
    }
    return 'Presupuesto no especificado';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <View style={styles.container}>
      {/* Header con estado */}
      <View style={styles.header}>
        <View style={[styles.statusBadge, { backgroundColor: statusConfig.bgColor }]}>
          <Ionicons 
            name={statusConfig.icon} 
            size={16} 
            color={statusConfig.color} 
          />
          <Text style={[styles.statusText, { color: statusConfig.color }]}>
            {statusConfig.label}
          </Text>
        </View>
        
        {appliedDate && (
          <Text style={styles.appliedDate}>
            Aplicado: {formatDate(appliedDate)}
          </Text>
        )}
      </View>

      {/* Contenido principal */}
      <View style={styles.content}>
        <View style={styles.mainInfo}>
          <Text style={styles.title}>{offer.title}</Text>
          <Text style={styles.description} numberOfLines={2}>
            {offer.description}
          </Text>
          
          <View style={styles.details}>
            <View style={styles.detailItem}>
              <Ionicons name="cash-outline" size={14} color={Colors.textSecondary} />
              <Text style={styles.detailText}>{formatBudget()}</Text>
            </View>
            
            {offer.location && (
              <View style={styles.detailItem}>
                <Ionicons name="location-outline" size={14} color={Colors.textSecondary} />
                <Text style={styles.detailText}>{offer.location}</Text>
              </View>
            )}
            
            {offer.date && (
              <View style={styles.detailItem}>
                <Ionicons name="calendar-outline" size={14} color={Colors.textSecondary} />
                <Text style={styles.detailText}>{offer.date}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Información del cliente */}
        <View style={styles.clientInfo}>
          <Text style={styles.clientLabel}>Publicado por:</Text>
          <Text style={styles.clientName}>{offer.poster_name || 'Cliente'}</Text>
        </View>
      </View>

      {/* Descripción del estado */}
      <View style={[styles.statusDescription, { backgroundColor: statusConfig.bgColor }]}>
        <Ionicons name={statusConfig.icon} size={20} color={statusConfig.color} />
        <Text style={[styles.statusDescriptionText, { color: statusConfig.color }]}>
          {statusConfig.description}
        </Text>
      </View>

      {/* Acciones disponibles */}
      {statusConfig.showActions && (
        <View style={styles.actions}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.primaryButton]}
            onPress={onViewDetails}
          >
            <Ionicons name="eye-outline" size={16} color={Colors.white} />
            <Text style={styles.actionButtonText}>Ver detalles</Text>
          </TouchableOpacity>

          {onMessage && (
            <TouchableOpacity 
              style={[styles.actionButton, styles.secondaryButton]}
              onPress={onMessage}
            >
              <Ionicons name="chatbubble-outline" size={16} color={Colors.primary} />
              <Text style={[styles.actionButtonText, { color: Colors.primary }]}>
                Mensaje
              </Text>
            </TouchableOpacity>
          )}

          {statusConfig.showCancel && onCancel && (
            <TouchableOpacity 
              style={[styles.actionButton, styles.cancelButton]}
              onPress={onCancel}
            >
              <Ionicons name="close-outline" size={16} color="#EF4444" />
              <Text style={[styles.actionButtonText, { color: '#EF4444' }]}>
                Cancelar
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  appliedDate: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: Colors.textSecondary,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  mainInfo: {
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: Colors.text,
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  details: {
    gap: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: Colors.textSecondary,
  },
  clientInfo: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  clientLabel: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  clientName: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: Colors.text,
  },
  statusDescription: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 8,
    gap: 8,
  },
  statusDescriptionText: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_500Medium',
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
    flex: 1,
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: Colors.primary,
  },
  secondaryButton: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  cancelButton: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  actionButtonText: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: Colors.white,
  },
});
