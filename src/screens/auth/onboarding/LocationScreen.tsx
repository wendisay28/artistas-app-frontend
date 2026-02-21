// src/screens/auth/onboarding/LocationScreen.tsx
// Pantalla de permiso de ubicación

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParams } from '../../../navigation/AuthStack';
import { GradientButton } from '../../../components/ui/GradientButton';

type Props = NativeStackScreenProps<AuthStackParams, 'Location'>;

export const LocationScreen: React.FC<Props> = ({ navigation }) => {
  const [loading, setLoading] = useState(false);

  const handleAllow = async () => {
    setLoading(true);
    // TODO: implementar expo-location permission request
    // const { status } = await Location.requestForegroundPermissionsAsync();
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('ClientHome');
    }, 600);
  };

  const handleSkip = () => {
    navigation.navigate('ClientHome');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Illustration area */}
      <View style={styles.illustrationWrap}>
        <LinearGradient
          colors={['#f3e8ff', '#e9d5ff']}
          style={styles.illustrationCircle}
        >
          <LinearGradient
            colors={['#9333ea', '#2563eb']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.iconCircle}
          >
            <Ionicons name="location" size={48} color="#fff" />
          </LinearGradient>
        </LinearGradient>

        {/* Decorative dots */}
        <View style={[styles.dot, { top: 30, right: 60 }]} />
        <View style={[styles.dot, styles.dotSm, { top: 70, left: 50 }]} />
        <View style={[styles.dot, styles.dotLg, { bottom: 20, right: 40 }]} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>¿Dónde estás?</Text>
        <Text style={styles.subtitle}>
          Usamos tu ubicación para mostrarte{'\n'}los mejores artistas cerca de ti
        </Text>

        {/* Benefits */}
        <View style={styles.benefits}>
          {BENEFITS.map((b, i) => (
            <View key={i} style={styles.benefitRow}>
              <View style={styles.checkCircle}>
                <Ionicons name="checkmark" size={14} color="#7e22ce" />
              </View>
              <Text style={styles.benefitText}>{b}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <GradientButton
          label="Permitir ubicación"
          onPress={handleAllow}
          loading={loading}
          icon={<Ionicons name="navigate" size={18} color="#fff" />}
        />

        <TouchableOpacity onPress={handleSkip} style={styles.skipBtn}>
          <Text style={styles.skipText}>Ahora no, seguir sin ubicación</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const BENEFITS = [
  'Artistas ordenados por distancia en km',
  'Resultados del mapa en tiempo real',
  'Notificaciones de artistas disponibles',
];

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },

  // Illustration
  illustrationWrap: {
    height: 280,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  illustrationCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#d8b4fe',
  },
  dotSm: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#e9d5ff' },
  dotLg: { width: 16, height: 16, borderRadius: 8, backgroundColor: '#9333ea', opacity: 0.3 },

  // Content
  content: { flex: 1, paddingHorizontal: 28 },
  title: {
    fontSize: 30,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: '#4c1d95',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#7e22ce',
    lineHeight: 22,
    marginBottom: 28,
  },

  // Benefits
  benefits: { gap: 14 },
  benefitRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#f3e8ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  benefitText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: '#1f2937',
    flex: 1,
  },

  // Actions
  actions: { paddingHorizontal: 24, paddingBottom: 24, gap: 12 },
  skipBtn: {
    alignItems: 'center',
    paddingVertical: 14,
  },
  skipText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: '#9ca3af',
  },
});
