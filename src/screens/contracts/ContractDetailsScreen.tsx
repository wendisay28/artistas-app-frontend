// src/screens/contracts/ContractDetailsScreen.tsx
// Pantalla de detalles de un contrato específico

import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Alert, ActivityIndicator, Linking
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRoute, useNavigation } from '@react-navigation/native';

import { contractsService } from '../../services/api/contracts';
import type { Contract, ContractStatus } from '../../types/contracts';
import ContractStatusBadge from '../../components/contracts/ContractStatusBadge';

export default function ContractDetailsScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  
  const { contractId } = route.params as { contractId: string };
  
  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadContract();
  }, [contractId]);

  const loadContract = async () => {
    try {
      const data = await contractsService.getContractById(contractId);
      setContract(data);
    } catch (error) {
      console.error('Error loading contract:', error);
      Alert.alert('Error', 'No se pudo cargar el contrato');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: ContractStatus, evidence?: any) => {
    try {
      setActionLoading(true);
      await contractsService.updateContractStatus(contractId, newStatus, evidence);
      
      // Recargar datos
      await loadContract();
      
      Alert.alert(
        'Actualizado',
        'El estado del contrato ha sido actualizado correctamente'
      );
    } catch (error) {
      console.error('Error updating status:', error);
      Alert.alert('Error', 'No se pudo actualizar el estado');
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkAsDelivered = () => {
    Alert.prompt(
      'Confirmar entrega',
      '¿Has entregado el servicio? Agrega notas de entrega (opcional):',
      'plain-text',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar entrega',
          onPress: (notes: string | undefined) => {
            handleStatusUpdate('delivered' as ContractStatus, { notes });
          }
        }
      ]
    );
  };

  const handleConfirmReceipt = () => {
    Alert.prompt(
      'Confirmar recepción',
      '¿Recibiste el servicio correctamente? Califica el trabajo (1-5 estrellas):',
      'plain-text',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: (rating: string | undefined) => {
            const ratingNum = parseInt(rating || '0');
            if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
              Alert.alert('Error', 'La calificación debe ser entre 1 y 5');
              return;
            }
            
            Alert.prompt(
              'Deja una reseña (opcional)',
              'Comparte tu experiencia con este servicio:',
              'plain-text',
              [
                { text: 'Omitir', style: 'cancel' },
                {
                  text: 'Enviar',
                  onPress: (review: string | undefined) => {
                    handleStatusUpdate('completed', { 
                      rating: ratingNum, 
                      review: review || '' 
                    });
                  }
                }
              ]
            );
          }
        }
      ]
    );
  };

  const handleStartDispute = () => {
    Alert.prompt(
      'Iniciar disputa',
      'Describe el problema:',
      'plain-text',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Iniciar disputa',
          onPress: (reason: string | undefined) => {
            if (!reason?.trim()) {
              Alert.alert('Error', 'Debes describir el problema');
              return;
            }
            
            handleStatusUpdate('disputed' as ContractStatus, { 
              reason: reason.trim(),
              description: reason.trim()
            });
          }
        }
      ]
    );
  };

  const handleOpenPayment = () => {
    if (contract?.mercadoPagoPreferenceId) {
      Linking.openURL(`https://www.mercadopago.com.co/checkout/v1/redirect?preference_id=${contract.mercadoPagoPreferenceId}`);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: contract?.currency || 'COP'
    }).format(price);
  };

  const getActionButtons = () => {
    if (!contract) return [];

    const buttons = [];

    switch (contract.status) {
      case 'pending_payment':
        buttons.push({
          text: 'Pagar ahora',
          icon: 'card-outline',
          onPress: handleOpenPayment,
          gradient: ['#10b981', '#059669']
        });
        break;

      case 'escrow_hold':
        // Botón para artista
        buttons.push({
          text: 'Iniciar servicio',
          icon: 'play-circle-outline',
          onPress: () => handleStatusUpdate('in_progress'),
          gradient: ['#8b5cf6', '#6366f1']
        });
        break;

      case 'in_progress':
        // Botón para artista
        buttons.push({
          text: 'Marcar como entregado',
          icon: 'checkmark-circle-outline',
          onPress: handleMarkAsDelivered,
          gradient: ['#3b82f6', '#1d4ed8']
        });
        break;

      case 'delivered' as ContractStatus:
        // Botón para cliente
        buttons.push({
          text: 'Confirmar recepción',
          icon: 'checkmark-done-circle-outline',
          onPress: handleConfirmReceipt,
          gradient: ['#10b981', '#059669']
        });
        break;

      case 'disputed':
        buttons.push({
          text: 'Disputa en proceso',
          icon: 'alert-circle-outline',
          onPress: () => {},
          gradient: ['#ef4444', '#dc2626'],
          disabled: true
        });
        break;
    }

    return buttons;
  };

  if (loading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#7c3aed" />
          <Text style={styles.loadingText}>Cargando contrato...</Text>
        </View>
      </View>
    );
  }

  if (!contract) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#ef4444" />
          <Text style={styles.errorTitle}>Contrato no encontrado</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const actionButtons = getActionButtons();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Detalles del Contrato</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Estado */}
        <View style={styles.statusSection}>
          <ContractStatusBadge status={contract.status} size="large" />
        </View>

        {/* Información del servicio */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información del Servicio</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Servicio:</Text>
            <Text style={styles.infoValue}>{contract.serviceTitle}</Text>
          </View>
          
          {contract.serviceDescription && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Descripción:</Text>
              <Text style={styles.infoValue}>{contract.serviceDescription}</Text>
            </View>
          )}
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Precio total:</Text>
            <Text style={styles.priceValue}>{formatPrice(contract.price)}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Comisión plataforma:</Text>
            <Text style={styles.commissionValue}>{formatPrice(contract.commission)}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Monto artista:</Text>
            <Text style={styles.netValue}>{formatPrice(contract.netAmount)}</Text>
          </View>
        </View>

        {/* Información del evento */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detalles del Evento</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Fecha:</Text>
            <Text style={styles.infoValue}>{formatDate(contract.eventDate)}</Text>
          </View>
          
          {contract.eventLocation && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Ubicación:</Text>
              <Text style={styles.infoValue}>{contract.eventLocation}</Text>
            </View>
          )}
          
          {contract.technicalSpecs && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Especificaciones:</Text>
              <Text style={styles.infoValue}>{contract.technicalSpecs}</Text>
            </View>
          )}
        </View>

        {/* Participantes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Participantes</Text>
          
          <View style={styles.participantRow}>
            <View style={styles.participantInfo}>
              <Text style={styles.participantRole}>Cliente</Text>
              <Text style={styles.participantName}>{contract.clientName}</Text>
            </View>
          </View>
          
          <View style={styles.participantRow}>
            <View style={styles.participantInfo}>
              <Text style={styles.participantRole}>Artista</Text>
              <Text style={styles.participantName}>{contract.artistName}</Text>
            </View>
          </View>
        </View>

        {/* Fechas importantes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Timeline</Text>
          
          <View style={styles.timelineRow}>
            <Text style={styles.timelineLabel}>Creado:</Text>
            <Text style={styles.timelineValue}>{formatDate(contract.createdAt)}</Text>
          </View>
          
          {contract.deliveryDate && (
            <View style={styles.timelineRow}>
              <Text style={styles.timelineLabel}>Entregado:</Text>
              <Text style={styles.timelineValue}>{formatDate(contract.deliveryDate)}</Text>
            </View>
          )}
          
          {contract.clientConfirmedAt && (
            <View style={styles.timelineRow}>
              <Text style={styles.timelineLabel}>Confirmado:</Text>
              <Text style={styles.timelineValue}>{formatDate(contract.clientConfirmedAt)}</Text>
            </View>
          )}
        </View>

        {/* Calificación */}
        {contract.rating && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Calificación</Text>
            
            <View style={styles.ratingContainer}>
              <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Ionicons
                    key={star}
                    name={star <= contract.rating ? 'star' : 'star-outline'}
                    size={24}
                    color="#fbbf24"
                  />
                ))}
              </View>
              <Text style={styles.ratingText}>{contract.rating} / 5</Text>
            </View>
            
            {contract.review && (
              <Text style={styles.reviewText}>{contract.review}</Text>
            )}
          </View>
        )}
      </ScrollView>

      {/* Botones de acción */}
      {actionButtons.length > 0 && (
        <View style={styles.actionsContainer}>
          {actionButtons.map((button, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.actionButton,
                button.disabled && styles.actionButtonDisabled
              ]}
              onPress={button.onPress}
              disabled={actionLoading || button.disabled}
            >
              <LinearGradient
                colors={button.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.actionButtonGradient}
              >
                <Ionicons 
                  name={button.icon} 
                  size={18} 
                  color="#fff" 
                />
                <Text style={styles.actionButtonText}>
                  {actionLoading ? 'Procesando...' : button.text}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: '#6b7280',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  errorTitle: {
    fontSize: 20,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#ef4444',
    marginTop: 16,
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#7c3aed',
  },
  placeholder: {
    width: 32,
  },
  title: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#1f2937',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  statusSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#374151',
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#6b7280',
    flex: 2,
    textAlign: 'right',
  },
  priceValue: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#1f2937',
  },
  commissionValue: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#f59e0b',
  },
  netValue: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#10b981',
  },
  participantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  participantInfo: {
    flex: 1,
  },
  participantRole: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#7c3aed',
    marginBottom: 4,
  },
  participantName: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#1f2937',
  },
  timelineRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  timelineLabel: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#6b7280',
  },
  timelineValue: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#374151',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  ratingText: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#1f2937',
  },
  reviewText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#6b7280',
    marginTop: 8,
    fontStyle: 'italic',
  },
  actionsContainer: {
    padding: 16,
    gap: 12,
  },
  actionButton: {
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  actionButtonDisabled: {
    opacity: 0.6,
  },
  actionButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
  },
  actionButtonText: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#fff',
  },
});
