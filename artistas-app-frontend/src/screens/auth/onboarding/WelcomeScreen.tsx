// src/screens/auth/welcome/index.tsx
// Pantalla de bienvenida — elige rol Artista / Cliente
// Fix: sin BlurView en cards para evitar conflictos de renderizado

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParams } from '../../../navigation/AuthStack';
import { useAuthStore } from '../../../store/authStore';

type Props = NativeStackScreenProps<AuthStackParams, 'Welcome'>;

const { height } = Dimensions.get('window');

// ── Blob animado ─────────────────────────────────────────────────
const AnimatedBlob = ({
  size,
  colors,
  style,
  duration = 7000,
  delay = 0,
}: {
  size: number;
  colors: string[];
  style?: any;
  duration?: number;
  delay?: number;
}) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = (anim: Animated.Value, range: number, dur: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: range,
            duration: dur,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
            delay,
          }),
          Animated.timing(anim, {
            toValue: -range / 2,
            duration: dur * 0.8,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: dur * 0.6,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      );

    loop(translateX, 30, duration).start();
    loop(translateY, 25, duration * 1.1).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.15,
          duration: duration * 1.3,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
          delay,
        }),
        Animated.timing(scale, {
          toValue: 0.9,
          duration: duration * 1.2,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: duration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          opacity: 0.5,
          transform: [{ translateX }, { translateY }, { scale }],
        },
        style,
      ]}
    >
      <LinearGradient
        colors={colors as any}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1, borderRadius: size / 2 }}
      />
    </Animated.View>
  );
};

// ── FadeIn con stagger ───────────────────────────────────────────
const FadeIn = ({
  children,
  delay = 0,
  from = 30,
}: {
  children: React.ReactNode;
  delay?: number;
  from?: number;
}) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(from)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 600,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 600,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      {children}
    </Animated.View>
  );
};

// ── Screen ───────────────────────────────────────────────────────
export const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  const { setPendingRole } = useAuthStore();

  const scaleArtist = useRef(new Animated.Value(1)).current;
  const scaleClient = useRef(new Animated.Value(1)).current;

  const pressIn = (anim: Animated.Value) =>
    Animated.spring(anim, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();

  const pressOut = (anim: Animated.Value) =>
    Animated.spring(anim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();

  const handleArtist = () => {
    setPendingRole('artist');
    navigation.navigate('Login');
  };

  const handleClient = () => {
    setPendingRole('client');
    navigation.navigate('Location', { userType: 'client' });
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* ── Fondo ───────────────────────────────────────────── */}
      <LinearGradient
        colors={['#f0ebff', '#eaf0ff', '#fafafa']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <AnimatedBlob size={320} colors={['#a78bfa', '#7c3aed']} style={{ top: -70, left: -90 }} duration={8000} delay={0} />
      <AnimatedBlob size={260} colors={['#60a5fa', '#2563eb']} style={{ top: height * 0.3, right: -110 }} duration={9500} delay={1200} />
      <AnimatedBlob size={180} colors={['#c4b5fd', '#818cf8']} style={{ bottom: height * 0.18, left: -50 }} duration={7200} delay={600} />
      <AnimatedBlob size={140} colors={['#93c5fd', '#6d28d9']} style={{ bottom: 30, right: -30 }} duration={11000} delay={1800} />

      <View style={styles.noiseOverlay} />

      <SafeAreaView style={styles.safe}>

        {/* ── Header ──────────────────────────────────────────── */}
        <FadeIn delay={0}>
          <View style={styles.header}>
            <View style={styles.logoRow}>
              <Text style={styles.logoBusc}>Busc</Text>
              <LinearGradient
                colors={['#7c3aed', '#2563eb']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.logoArtBg}
              >
                <Text style={styles.logoArt}>Art</Text>
              </LinearGradient>
            </View>

            <View style={styles.pill}>
              <View style={styles.pillDot} />
              <Text style={styles.pillText}>Elige tu experiencia</Text>
            </View>

            <Text style={styles.headline}>¿Cómo quieres{'\n'}usar BuscArt?</Text>
            <Text style={styles.subheadline}>
              Cuéntanos quién eres para personalizar{'\n'}todo para ti
            </Text>
          </View>
        </FadeIn>

        {/* ── Cards ────────────────────────────────────────────── */}
        <View style={styles.cardsContainer}>

          {/* Card Artista */}
          <FadeIn delay={200} from={40}>
            <Animated.View style={[styles.cardShadowDark, { transform: [{ scale: scaleArtist }] }]}>
              <TouchableOpacity
                onPress={handleArtist}
                onPressIn={() => pressIn(scaleArtist)}
                onPressOut={() => pressOut(scaleArtist)}
                activeOpacity={1}
                style={styles.cardTouch}
              >
                <LinearGradient
                  colors={['#5b21b6', '#1d4ed8']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.cardDark}
                >
                  <View style={styles.blobInnerDark} />
                  <View style={styles.arrowWrapDark}>
                    <Ionicons name="arrow-forward" size={13} color="#fff" />
                  </View>
                  <View style={styles.cardTop}>
                    <View style={styles.iconWrapDark}>
                      <Ionicons name="sparkles" size={22} color="#fff" />
                    </View>
                    <View style={styles.tagDark}>
                      <Text style={styles.tagTextDark}>Para creadores</Text>
                    </View>
                  </View>
                  <View style={styles.cardBottom}>
                    <Text style={styles.cardTitleDark}>Soy Artista</Text>
                    <Text style={styles.cardDescDark}>
                      Muestra tu trabajo, fija tus tarifas y consigue clientes cerca de ti
                    </Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </FadeIn>

          {/* Card Cliente */}
          <FadeIn delay={350} from={40}>
            <Animated.View style={[styles.cardShadowLight, { transform: [{ scale: scaleClient }] }]}>
              <TouchableOpacity
                onPress={handleClient}
                onPressIn={() => pressIn(scaleClient)}
                onPressOut={() => pressOut(scaleClient)}
                activeOpacity={1}
                style={styles.cardTouch}
              >
                <View style={styles.cardLight}>
                  <View style={styles.blobInnerLight} />
                  <View style={styles.arrowWrapLight}>
                    <Ionicons name="arrow-forward" size={13} color="#7c3aed" />
                  </View>
                  <View style={styles.cardTop}>
                    <View style={styles.iconWrapLight}>
                      <Ionicons name="compass" size={22} color="#7c3aed" />
                    </View>
                    <View style={styles.tagLight}>
                      <Text style={styles.tagTextLight}>Para explorar</Text>
                    </View>
                  </View>
                  <View style={styles.cardBottom}>
                    <Text style={styles.cardTitleLight}>Soy Cliente</Text>
                    <Text style={styles.cardDescLight}>
                      Descubre artistas locales, revisa perfiles y reserva fácilmente
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </Animated.View>
          </FadeIn>

        </View>

        {/* ── Footer ───────────────────────────────────────────── */}
        <FadeIn delay={500}>
          <View style={styles.footer}>
            <Text style={styles.terms}>
              Al continuar aceptas nuestros{' '}
              <Text style={styles.link}>Términos de Servicio</Text>
              {' '}y{' '}
              <Text style={styles.link}>Política de Privacidad</Text>
            </Text>
          </View>
        </FadeIn>

      </SafeAreaView>
    </View>
  );
};

// ── Styles ───────────────────────────────────────────────────────
const CARD_HEIGHT = Math.min(height * 0.235, 200);

const styles = StyleSheet.create({

  root: { flex: 1 },
  noiseOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  safe: { flex: 1 },

  header: {
    paddingHorizontal: 26,
    paddingTop: 18,
    paddingBottom: 10,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoBusc: {
    fontSize: 28,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: '#1e1b4b',
    letterSpacing: -1,
  },
  logoArtBg: {
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 1,
  },
  logoArt: {
    fontSize: 28,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: '#fff',
    letterSpacing: -1,
  },

  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(124,58,237,0.1)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: 14,
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(124,58,237,0.18)',
  },
  pillDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#7c3aed',
  },
  pillText: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#7c3aed',
    letterSpacing: 0.3,
  },

  headline: {
    fontSize: 28,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: '#1e1b4b',
    lineHeight: 35,
    letterSpacing: -0.6,
    marginBottom: 8,
  },
  subheadline: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#6d28d9',
    lineHeight: 19,
    opacity: 0.85,
  },

  cardsContainer: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    gap: 14,
  },

  // Sombras exteriores (Animated.View necesita height explícito)
  cardShadowDark: {
    height: CARD_HEIGHT,
    borderRadius: 28,
    shadowColor: '#5b21b6',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.28,
    shadowRadius: 20,
    elevation: 10,
  },
  cardShadowLight: {
    height: CARD_HEIGHT,
    borderRadius: 28,
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 5,
  },

  // Touch ocupa todo
  cardTouch: {
    flex: 1,
    borderRadius: 28,
    overflow: 'hidden',
  },

  // Card oscura
  cardDark: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },

  // Card clara
  cardLight: {
    flex: 1,
    padding: 20,
    backgroundColor: 'rgba(255,255,255,0.88)',
    borderWidth: 1.5,
    borderColor: 'rgba(167,139,250,0.35)',
    justifyContent: 'space-between',
  },

  blobInnerDark: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(255,255,255,0.07)',
    top: -25,
    right: -25,
  },
  blobInnerLight: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(124,58,237,0.07)',
    top: -25,
    right: -25,
  },

  arrowWrapDark: {
    position: 'absolute',
    top: 18,
    right: 18,
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowWrapLight: {
    position: 'absolute',
    top: 18,
    right: 18,
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: 'rgba(124,58,237,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconWrapDark: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapLight: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(124,58,237,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(124,58,237,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagDark: {
    borderRadius: 20,
    paddingHorizontal: 11,
    paddingVertical: 4,
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  tagLight: {
    borderRadius: 20,
    paddingHorizontal: 11,
    paddingVertical: 4,
    backgroundColor: 'rgba(124,58,237,0.1)',
  },
  tagTextDark: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#fff',
    letterSpacing: 0.2,
  },
  tagTextLight: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#6d28d9',
    letterSpacing: 0.2,
  },

  cardBottom: { gap: 4 },
  cardTitleDark: {
    fontSize: 19,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#fff',
    letterSpacing: -0.3,
  },
  cardTitleLight: {
    fontSize: 19,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#1e1b4b',
    letterSpacing: -0.3,
  },
  cardDescDark: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(255,255,255,0.78)',
    lineHeight: 17,
    maxWidth: '85%',
  },
  cardDescLight: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#6d28d9',
    lineHeight: 17,
    maxWidth: '85%',
  },

  footer: {
    paddingHorizontal: 28,
    paddingVertical: 16,
    alignItems: 'center',
  },
  terms: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 17,
  },
  link: {
    color: '#7c3aed',
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
});