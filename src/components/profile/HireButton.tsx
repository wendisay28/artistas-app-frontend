// src/components/profile/HireButton.tsx
// Botón de contratación para perfiles de artistas

import React, { useState } from 'react';
import {
  TouchableOpacity, Text, StyleSheet, Modal, View
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import HireModal from '../contracts/HireModal';
import type { PaymentPreference } from '../../types/contracts';

interface HireButtonProps {
  artist: {
    id: string;
    name: string;
    avatar?: string;
    mpUserId?: string; // ID de Mercado Pago del artista
  };
  service?: {
    title: string;
    description?: string;
    price: number;
    currency?: string;
  };
  services?: Array<{
    id: string;
    name: string;
    description?: string;
    price: number;
    currency?: string;
  }>;
  size?: 'small' | 'medium' | 'large';
}

export default function HireButton({ 
  artist, 
  service, 
  services = [],
  size = 'medium' 
}: HireButtonProps) {
  const [showHireModal, setShowHireModal] = useState(false);
  const [selectedService, setSelectedService] = useState(service);

  const handleHire = () => {
    if (services.length > 0 && !selectedService) {
      // Si hay múltiples servicios y no hay seleccionado, mostrar selección
      // Por ahora usamos el primero
      setSelectedService(services[0]);
    }
    setShowHireModal(true);
  };

  const handlePaymentSuccess = (preference: PaymentPreference) => {
    // Redirigir a Mercado Pago
    if (preference.initPoint) {
      // En web, abrir en nueva pestaña
      if (typeof window !== 'undefined') {
        window.open(preference.initPoint, '_blank');
      }
      // En mobile, usar Linking
      else {
        import('expo-linking').then(({ Linking }) => {
          Linking.openURL(preference.initPoint);
        });
      }
    }
  };

  const formatPrice = (price: number, currency = 'COP') => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency
    }).format(price);
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          container: { paddingHorizontal: 16, paddingVertical: 10 },
          text: { fontSize: 14 },
          icon: { size: 16 }
        };
      case 'large':
        return {
          container: { paddingHorizontal: 24, paddingVertical: 16 },
          text: { fontSize: 18 },
          icon: { size: 20 }
        };
      default: // medium
        return {
          container: { paddingHorizontal: 20, paddingVertical: 12 },
          text: { fontSize: 16 },
          icon: { size: 18 }
        };
    }
  };

  const sizeStyles = getSizeStyles();
  const displayService = selectedService || services[0];

  return (
    <>
      <TouchableOpacity
        style={[styles.container, sizeStyles.container]}
        onPress={handleHire}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['#7c3aed', '#2563eb']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          <Ionicons 
            name="checkmark-circle" 
            size={sizeStyles.icon.size} 
            color="#fff" 
          />
          <Text style={[styles.text, sizeStyles.text]}>
            {displayService 
              ? `Contratar - ${formatPrice(displayService.price, displayService.currency)}`
              : 'Contratar'
            }
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Modal de contratación */}
      <HireModal
        visible={showHireModal}
        onClose={() => setShowHireModal(false)}
        artist={artist}
        service={displayService || {
          title: 'Servicio personalizado',
          price: 0,
          currency: 'COP'
        }}
        onSuccess={handlePaymentSuccess}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  text: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#fff',
  },
});
