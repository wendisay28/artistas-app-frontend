// components/contracts/modals/AvailabilityModal.tsx
//
// Modal que aparece al entrar a "Urgentes" para activar disponibilidad
// y recibir ofertas en tiempo real

import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../../../theme/colors';

interface AvailabilityModalProps {
  visible: boolean;
  onActivate: () => void;
  onSkip: () => void;
  onClose: () => void;
}

export default function AvailabilityModal({
  visible,
  onActivate,
  onSkip,
  onClose,
}: AvailabilityModalProps) {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleActivate = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      onActivate();
    });
  };

  const handleSkip = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      onSkip();
    });
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View style={[styles.modalContainer, { opacity: fadeAnim }]}>
          {/* Header con icono */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <LinearGradient
                colors={['#FF6B6B', '#FF8E53']}
                style={styles.iconGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="flash" size={32} color={Colors.white} />
              </LinearGradient>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Contenido */}
          <View style={styles.content}>
            <Text style={styles.title}>¿Activa tu disponibilidad?</Text>
            
            <Text style={styles.description}>
              Recibe ofertas urgentes en tiempo real y sé el primero en responder. 
              Los clientes pueden contactarte inmediatamente si estás disponible.
            </Text>

            {/* Beneficios */}
            <View style={styles.benefits}>
              <View style={styles.benefit}>
                <Ionicons name="time-outline" size={20} color="#10B981" />
                <Text style={styles.benefitText}>Respuesta inmediata</Text>
              </View>
              <View style={styles.benefit}>
                <Ionicons name="star-outline" size={20} color="#F59E0B" />
                <Text style={styles.benefitText}>Más oportunidades</Text>
              </View>
              <View style={styles.benefit}>
                <Ionicons name="cash-outline" size={20} color="#3B82F6" />
                <Text style={styles.benefitText}>Ingresos extra</Text>
              </View>
            </View>
          </View>

          {/* Botones de acción */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, styles.skipButton]}
              onPress={handleSkip}
            >
              <Text style={styles.skipButtonText}>Ahora no</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.activateButton]}
              onPress={handleActivate}
            >
              <LinearGradient
                colors={[Colors.primary, '#2563EB']}
                style={styles.activateGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Ionicons name="flash" size={18} color={Colors.white} />
                <Text style={styles.activateButtonText}>Activar ahora</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Nota informativa */}
          <Text style={styles.note}>
            Puedes activarla o desactivarla en cualquier momento
          </Text>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
  },
  iconContainer: {
    alignItems: 'center',
  },
  iconGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 22,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  benefits: {
    gap: 12,
    marginBottom: 8,
  },
  benefit: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  benefitText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: Colors.text,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  button: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipButton: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  skipButtonText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: Colors.textSecondary,
  },
  activateButton: {
    overflow: 'hidden',
  },
  activateGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 12,
  },
  activateButtonText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: Colors.white,
  },
  note: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
});
