// src/screens/auth/login/index.tsx
// Pantalla de login — Google / Apple / email. Conectada a useLogin.
// Rediseño: glassmorphism + blobs orgánicos animados + microinteracciones

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../../store/authStore';
import { useLogin } from './hooks/useLogin';
import { GradientButton } from '../../../components/ui/GradientButton';

const { width, height } = Dimensions.get('window');

// ── Blob animado ────────────────────────────────────────────────
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
          opacity: 0.55,
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

// ── Fade-in stagger ──────────────────────────────────────────────
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
export const LoginScreen = ({ navigation }: any) => {
  const { error } = useAuthStore();
  const {
    handleGoogleLogin,
    handleAppleLogin,
    isGoogleLoading,
    isAppleLoading,
  } = useLogin();

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* ── Fondo: blobs orgánicos ──────────────────────────── */}
      <LinearGradient
        colors={['#f0ebff', '#eaf0ff', '#fafafa']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <AnimatedBlob
        size={340}
        colors={['#a78bfa', '#7c3aed']}
        style={{ top: -80, left: -100 }}
        duration={8000}
        delay={0}
      />
      <AnimatedBlob
        size={280}
        colors={['#60a5fa', '#2563eb']}
        style={{ top: height * 0.25, right: -120 }}
        duration={9500}
        delay={1500}
      />
      <AnimatedBlob
        size={200}
        colors={['#c4b5fd', '#818cf8']}
        style={{ bottom: height * 0.15, left: -60 }}
        duration={7200}
        delay={800}
      />
      <AnimatedBlob
        size={150}
        colors={['#93c5fd', '#6d28d9']}
        style={{ bottom: 40, right: -40 }}
        duration={11000}
        delay={2000}
      />

      {/* ── Ruido sutil como textura (capa de opacidad baja) ─ */}
      {/* Simulado con un overlay muy tenue */}
      <View style={styles.noiseOverlay} />

      <SafeAreaView style={styles.safe}>

        {/* ── Logo ─────────────────────────────────────────── */}
        <FadeIn delay={0}>
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
        </FadeIn>

        {/* ── Contenido ────────────────────────────────────── */}
        <View style={styles.content}>

          {/* Tarjeta glass */}
          <BlurView intensity={55} tint="light" style={styles.card}>
            <View style={styles.cardInner}>

              {/* Hero icon con anillo */}
              <FadeIn delay={150}>
                <View style={styles.iconHeroWrap}>
                  <View style={styles.iconRing}>
                    <LinearGradient
                      colors={['#7c3aed', '#2563eb']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.iconHeroBg}
                    >
                      <Ionicons name="sparkles" size={26} color="#fff" />
                    </LinearGradient>
                  </View>
                </View>
              </FadeIn>

              {/* Headline */}
              <FadeIn delay={250}>
                <Text style={styles.title}>Bienvenido</Text>
                <Text style={styles.subtitle}>
                  Descubre arte. Conecta con tu ciudad.
                </Text>
              </FadeIn>

              {/* Error */}
              {error ? (
                <FadeIn delay={0} from={8}>
                  <View style={styles.errorBox}>
                    <Ionicons name="alert-circle" size={15} color="#ef4444" />
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                </FadeIn>
              ) : null}

              {/* ── Botones ───────────────────────────────── */}
              <FadeIn delay={350}>
                <View style={styles.buttons}>

                  {/* Google */}
                  <GradientButton
                    label="Continuar con Google"
                    onPress={handleGoogleLogin}
                    loading={isGoogleLoading}
                    icon={<GoogleIcon />}
                  />

                  {/* Apple — solo iOS */}
                  {Platform.OS === 'ios' && (
                    <TouchableOpacity
                      onPress={handleAppleLogin}
                      disabled={isAppleLoading}
                      activeOpacity={0.82}
                      style={styles.appleBtn}
                    >
                      <View style={styles.appleBtnContent}>
                        <Ionicons name="logo-apple" size={19} color="#fff" />
                        <Text style={styles.appleBtnText}>Continuar con Apple</Text>
                      </View>
                    </TouchableOpacity>
                  )}

                  {/* Divider */}
                  <View style={styles.dividerRow}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>o usa tu email</Text>
                    <View style={styles.dividerLine} />
                  </View>

                  {/* Email — botón principal outlined con pill */}
                  <TouchableOpacity
                    onPress={() => navigation.navigate('EmailLogin')}
                    activeOpacity={0.78}
                    style={styles.emailBtn}
                  >
                    <LinearGradient
                      colors={['#ede9fe', '#dbeafe']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.emailBtnGradient}
                    >
                      <View style={styles.emailIconCircle}>
                        <Ionicons name="mail" size={16} color="#7c3aed" />
                      </View>
                      <Text style={styles.emailBtnText}>Continuar con email</Text>
                      <View style={styles.emailArrowCircle}>
                        <Ionicons name="arrow-forward" size={14} color="#fff" />
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>

                </View>
              </FadeIn>

            </View>
          </BlurView>

        </View>

        {/* ── Footer ───────────────────────────────────────── */}
        <FadeIn delay={500}>
          <View style={styles.footer}>
            <Text style={styles.terms}>
              Al continuar aceptas nuestros{' '}
              <Text style={styles.termsLink}>Términos de Servicio</Text>
              {' '}y{' '}
              <Text style={styles.termsLink}>Política de Privacidad</Text>
            </Text>
          </View>
        </FadeIn>

      </SafeAreaView>
    </View>
  );
};

// ── Google icon ──────────────────────────────────────────────────
const GoogleIcon = () => (
  <View style={gStyles.circle}>
    <Text style={gStyles.g}>G</Text>
  </View>
);
const gStyles = StyleSheet.create({
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  g: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#7c3aed',
  },
});

// ── Styles ───────────────────────────────────────────────────────
const styles = StyleSheet.create({

  root: { flex: 1 },
  noiseOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  safe: { flex: 1 },

  // Logo
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 26,
    paddingTop: 14,
  },
  logoBusc: {
    fontSize: 22,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: '#1e1b4b',
    letterSpacing: -0.5,
  },
  logoArtBg: {
    borderRadius: 6,
    paddingHorizontal: 5,
    paddingVertical: 1,
    marginLeft: 1,
  },
  logoArt: {
    fontSize: 22,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: '#fff',
    letterSpacing: -0.5,
  },

  // Centra la tarjeta verticalmente
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 8,
  },

  // Tarjeta glassmorphism
  card: {
    borderRadius: 32,
    overflow: 'hidden',
    // Sombra suave
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.14,
    shadowRadius: 40,
    elevation: 12,
  },
  cardInner: {
    padding: 28,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.7)',
    backgroundColor: 'rgba(255,255,255,0.45)',
  },

  // Ícono hero
  iconHeroWrap: {
    alignSelf: 'center',
    marginBottom: 22,
  },
  iconRing: {
    padding: 6,
    borderRadius: 26,
    borderWidth: 1.5,
    borderColor: 'rgba(124,58,237,0.18)',
    backgroundColor: 'rgba(167,139,250,0.1)',
  },
  iconHeroBg: {
    width: 62,
    height: 62,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.38,
    shadowRadius: 16,
    elevation: 8,
  },

  // Headline
  title: {
    fontSize: 28,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: '#1e1b4b',
    textAlign: 'center',
    letterSpacing: -0.6,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13.5,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#6d28d9',
    textAlign: 'center',
    marginBottom: 26,
    opacity: 0.85,
  },

  // Error
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fef2f2',
    borderRadius: 12,
    padding: 13,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#ef4444',
  },

  // Botones
  buttons: { gap: 12 },

  appleBtn: {
    height: 54,
    backgroundColor: '#0a0a0a',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 5,
  },
  appleBtnContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  appleBtnText: {
    color: '#fff',
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },

  // Divider
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 2,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(167,139,250,0.3)',
  },
  dividerText: {
    fontSize: 11.5,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: '#a78bfa',
    letterSpacing: 0.2,
  },

  // Botón email — pill gradient con ícono izq y flecha der
  emailBtn: {
    height: 54,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(124,58,237,0.2)',
  },
  emailBtnGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 10,
  },
  emailIconCircle: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: 'rgba(124,58,237,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emailBtnText: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#4c1d95',
  },
  emailArrowCircle: {
    width: 28,
    height: 28,
    borderRadius: 9,
    backgroundColor: '#7c3aed',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Footer
  footer: {
    paddingHorizontal: 28,
    paddingBottom: 16,
    alignItems: 'center',
  },
  terms: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 17,
  },
  termsLink: {
    color: '#7c3aed',
    fontFamily: 'PlusJakartaSans_500Medium',
  },
});