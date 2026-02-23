// src/screens/auth/onboarding/CreatingProfileScreen.tsx
// Pantalla de carga mientras se crea el perfil del artista

import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

// ── Animated Dots ────────────────────────────────────────────────────────────────

const AnimatedDots: React.FC = () => {
  const dot1Scale = React.useRef(new Animated.Value(1)).current;
  const dot2Scale = React.useRef(new Animated.Value(1)).current;
  const dot3Scale = React.useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animate = () => {
      Animated.sequence([
        Animated.parallel([
          Animated.timing(dot1Scale, { toValue: 1.5, duration: 600, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
          Animated.timing(dot1Scale, { toValue: 1, duration: 600, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(dot2Scale, { toValue: 1.5, duration: 600, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
          Animated.timing(dot2Scale, { toValue: 1, duration: 600, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(dot3Scale, { toValue: 1.5, duration: 600, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
          Animated.timing(dot3Scale, { toValue: 1, duration: 600, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        ]),
      ]).start(() => animate());
    };
    animate();
  }, []);

  return (
    <View style={dots.container}>
      <Animated.View style={[dots.dot, { transform: [{ scale: dot1Scale }] }]} />
      <Animated.View style={[dots.dot, { transform: [{ scale: dot2Scale }] }]} />
      <Animated.View style={[dots.dot, { transform: [{ scale: dot3Scale }] }]} />
    </View>
  );
};

// ── Screen ────────────────────────────────────────────────────────────────────

const CreatingProfileScreen: React.FC = () => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={s.root}>
      <LinearGradient
        colors={['#f8f6ff', '#f0edff', '#eef2ff']}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      
      {/* Decorative elements */}
      <View style={s.colorBlotch1} />
      <View style={s.colorBlotch2} />
      <View style={s.colorBlotch3} />

      <SafeAreaView style={s.safe}>
        <Animated.View
          style={[
            s.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Logo */}
          <View style={s.logoContainer}>
            <Text style={s.logoBusca}>Busc</Text>
            <LinearGradient colors={['#7c3aed', '#2563eb']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={s.logoArtBg}>
              <Text style={s.logoArt}>Art</Text>
            </LinearGradient>
          </View>

          {/* Main content */}
          <View style={s.mainContent}>
            {/* Icon with gradient background */}
            <View style={s.iconContainer}>
              <LinearGradient
                colors={['#7c3aed', '#2563eb']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={s.iconBg}
              >
                <Ionicons name="construct-outline" size={48} color="#fff" />
              </LinearGradient>
            </View>

            {/* Title and subtitle */}
            <Text style={s.title}>Creando tu perfil</Text>
            <Text style={s.subtitle}>
              Estamos configurando todo para que empieces a recibir tus primeros clientes
            </Text>

            {/* Animated dots */}
            <AnimatedDots />

            {/* Progress indicator */}
            <View style={s.progressContainer}>
              <View style={s.progressBar}>
                <Animated.View 
                  style={[
                    s.progressFill,
                    {
                      // Simulate progress animation
                      width: '75%',
                    }
                  ]}
                />
              </View>
              <Text style={s.progressText}>Configurando tu cuenta...</Text>
            </View>

            {/* Info cards */}
            <View style={s.infoCards}>
              <View style={s.infoCard}>
                <View style={s.infoIcon}>
                  <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                </View>
                <Text style={s.infoText}>Perfil básico configurado</Text>
              </View>
              
              <View style={s.infoCard}>
                <View style={s.infoIcon}>
                  <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                </View>
                <Text style={s.infoText}>Categoría asignada</Text>
              </View>
              
              <View style={s.infoCard}>
                <View style={s.infoIcon}>
                  <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                </View>
                <Text style={s.infoText}>Ubicación registrada</Text>
              </View>
            </View>

            {/* Bottom message */}
            <View style={s.bottomMessage}>
              <Text style={s.bottomText}>
                Un momento más, estamos preparando tu experiencia personalizada
              </Text>
            </View>
          </View>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
};

// ── Styles ────────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  root: {
    flex: 1,
  },
  safe: {
    flex: 1,
  },
  colorBlotch1: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(167, 139, 250, 0.12)',
    top: -100,
    right: -80,
  },
  colorBlotch2: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(99, 102, 241, 0.08)',
    bottom: 100,
    left: -60,
  },
  colorBlotch3: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(139, 92, 246, 0.06)',
    bottom: 50,
    right: 50,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 60,
  },
  logoBusca: {
    fontSize: 28,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: '#1e1b4b',
    letterSpacing: -0.5,
  },
  logoArtBg: {
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  logoArt: {
    fontSize: 28,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: '#fff',
    letterSpacing: -0.5,
  },
  mainContent: {
    alignItems: 'center',
    width: '100%',
    maxWidth: 320,
  },
  iconContainer: {
    marginBottom: 32,
  },
  iconBg: {
    width: 96,
    height: 96,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: '#1e1b4b',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(109, 40, 217, 0.7)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 40,
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(124, 58, 237, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#7c3aed',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: 'rgba(109, 40, 217, 0.6)',
  },
  infoCards: {
    width: '100%',
    gap: 12,
    marginBottom: 32,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(124, 58, 237, 0.1)',
  },
  infoIcon: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: '#1e1b4b',
  },
  bottomMessage: {
    alignItems: 'center',
  },
  bottomText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(109, 40, 217, 0.5)',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

const dots = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 32,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#7c3aed',
  },
});

export default CreatingProfileScreen;
