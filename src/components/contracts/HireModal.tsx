// src/components/contracts/HireModal.tsx
// Modal de contratación inmediata para servicios

import React, { useState } from 'react';
import {
  View, Text, Modal, StyleSheet, TouchableOpacity,
  TextInput, Alert, ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { contractsService } from '../../services/api/contracts';
import type { CreateContractRequest } from '../../types/contracts';

// Definir tipo local para PaymentPreference
interface PaymentPreference {
  id: string;
  initPoint: string;
  sandboxMode?: boolean;
}

interface HireModalProps {
  visible: boolean;
  onClose: () => void;
  artist: {
    id: string;
    name: string;
    avatar?: string;
  };
  service: {
    title: string;
    description?: string;
    price: number;
    currency?: string;
  };
  onSuccess?: (preference: PaymentPreference) => void;
}

export default function HireModal({
  visible,
  onClose,
  artist,
  service,
  onSuccess
}: HireModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    eventDate: '',
    eventLocation: '',
    technicalSpecs: '',
    notes: ''
  });
  
  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      const date = selectedDate.toISOString().split('T')[0];
      setFormData(prev => ({ ...prev, eventDate: date }));
    }
  };

  const validateForm = () => {
    if (!formData.eventDate) {
      Alert.alert('Error', 'Selecciona la fecha del evento');
      return false;
    }
    if (!formData.eventLocation.trim()) {
      Alert.alert('Error', 'Ingresa la ubicación del evento');
      return false;
    }
    return true;
  };

  const handleHire = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const contractData: CreateContractRequest = {
        artistId: artist.id,
        serviceTitle: service.title,
        serviceDescription: service.description,
        price: service.price,
        currency: service.currency || 'COP',
        eventDate: formData.eventDate,
        eventLocation: formData.eventLocation.trim(),
        technicalSpecs: formData.technicalSpecs.trim(),
        metadata: {
          notes: formData.notes.trim(),
          artistName: artist.name,
          artistAvatar: artist.avatar
        }
      };

      const preference = await contractsService.createContract(contractData);
      
      Alert.alert(
        '¡Contrato creado!',
        'Serás redirigido a Mercado Pago para completar el pago.',
        [
          {
            text: 'OK',
            onPress: () => {
              onSuccess?.(preference);
              onClose();
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error creating contract:', error);
      Alert.alert(
        'Error',
        'No se pudo crear el contrato. Intenta de nuevo.'
      );
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: service.currency || 'COP'
    }).format(price);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>Contratar servicio</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Artist Info */}
        <View style={styles.artistSection}>
          <View style={styles.artistInfo}>
            {artist.avatar && (
              <Image 
              source={{ uri: artist.avatar }} 
              style={styles.artistAvatar} 
            />
            )}
            <View style={styles.artistDetails}>
              <Text style={styles.artistName}>{artist.name}</Text>
              <Text style={styles.serviceTitle}>{service.title}</Text>
            </View>
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>{formatPrice(service.price)}</Text>
          </View>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Fecha del evento */}
          <View style={styles.field}>
            <Text style={styles.label}>Fecha del evento *</Text>
            <TouchableOpacity
              style={styles.dateInput}
              onPress={() => console.log('Selector de fecha - implementar más tarde')}
            >
              <Ionicons name="calendar-outline" size={20} color="#666" />
              <Text style={styles.dateText}>
                {formData.eventDate || 'Seleccionar fecha'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Ubicación */}
          <View style={styles.field}>
            <Text style={styles.label}>Ubicación *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: Cra 45 #67-89, Medellín"
              value={formData.eventLocation}
              onChangeText={(text) => setFormData(prev => ({ ...prev, eventLocation: text }))}
              multiline
              numberOfLines={2}
            />
          </View>

          {/* Especificaciones técnicas */}
          <View style={styles.field}>
            <Text style={styles.label}>Especificaciones técnicas</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: Iluminación natural, fondo blanco, 15 fotos retrato..."
              value={formData.technicalSpecs}
              onChangeText={(text) => setFormData(prev => ({ ...prev, technicalSpecs: text }))}
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Notas adicionales */}
          <View style={styles.field}>
            <Text style={styles.label}>Notas adicionales</Text>
            <TextInput
              style={styles.input}
              placeholder="Cualquier detalle adicional para el artista..."
              value={formData.notes}
              onChangeText={(text) => setFormData(prev => ({ ...prev, notes: text }))}
              multiline
              numberOfLines={2}
            />
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={onClose}
            disabled={loading}
          >
            <Text style={styles.cancelBtnText}>Cancelar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.hireBtn}
            onPress={handleHire}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <LinearGradient
                colors={['#7c3aed', '#2563eb']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.hireBtnGradient}
              >
                <Ionicons name="checkmark-circle" size={18} color="#fff" />
                <Text style={styles.hireBtnText}>Contratar</Text>
              </LinearGradient>
            )}
          </TouchableOpacity>
        </View>

        {/* Date Picker */}
        <TouchableOpacity
          style={styles.dateInput}
          onPress={() => setShowDatePicker(true)}
        >
          <Ionicons name="calendar-outline" size={20} color="#666" />
          <Text style={styles.dateText}>
            {formData.eventDate || 'Seleccionar fecha'}
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  closeBtn: {
    padding: 4,
  },
  placeholder: {
    width: 32,
  },
  title: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#1f2937',
  },
  artistSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#f9fafb',
  },
  artistInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  artistAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
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
  priceContainer: {
    backgroundColor: '#7c3aed',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  price: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#fff',
  },
  form: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#1f2937',
    textAlignVertical: 'top',
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dateText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#1f2937',
    marginLeft: 8,
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#6b7280',
  },
  hireBtn: {
    flex: 2,
  },
  hireBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
  },
  hireBtnText: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#fff',
  },
});
