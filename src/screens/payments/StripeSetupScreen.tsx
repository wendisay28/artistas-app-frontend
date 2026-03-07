// src/screens/payments/StripeSetupScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { StripeOnboardingProvider, useStripeOnboarding } from './stripe/StripeOnboardingContext';
import StripeSetupFlow from './stripe';

interface StripeSetupScreenProps {
  onClose?: () => void;
}

// Componente interno — tiene acceso al contexto para saber en qué paso está
const StripeSetupContent = ({ onClose }: StripeSetupScreenProps) => {
  const navigation = useNavigation();
  const { state, goPrevStep } = useStripeOnboarding();

  const handleBack = () => {
    if (state.currentStep === 'welcome') {
      // Primer paso → salir del flujo
      if (onClose) onClose();
      else navigation.goBack();
    } else {
      // Cualquier otro paso → volver al paso anterior
      goPrevStep();
    }
  };

  return (
    <SafeAreaView style={s.root} edges={['top', 'left', 'right']}>
      <View style={s.header}>
        <TouchableOpacity onPress={handleBack} style={s.backBtn}>
          <Ionicons name="chevron-back" size={22} color="#4c1d95" />
        </TouchableOpacity>
        <View style={s.logoRow}>
          <Text style={s.logoBusca}>Busc</Text>
          <LinearGradient
            colors={['#7c3aed', '#2563eb']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={s.logoArtBg}
          >
            <Text style={s.logoArt}>Art</Text>
          </LinearGradient>
        </View>
        <View style={s.backBtn} />
      </View>
      <StripeSetupFlow onClose={onClose} />
    </SafeAreaView>
  );
};

const StripeSetupScreen = ({ onClose }: StripeSetupScreenProps) => (
  <StripeOnboardingProvider>
    <StripeSetupContent onClose={onClose} />
  </StripeOnboardingProvider>
);

export default StripeSetupScreen;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(139,92,246,0.1)',
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#faf5ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBusca: {
    fontSize: 20,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: '#1e1b4b',
    letterSpacing: -0.4,
  },
  logoArtBg: {
    borderRadius: 7,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  logoArt: {
    fontSize: 20,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: '#fff',
    letterSpacing: -0.4,
  },
});
