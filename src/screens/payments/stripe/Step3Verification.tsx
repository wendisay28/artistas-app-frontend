// src/screens/payments/stripe/Step3Verification.tsx
import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet,
  Animated, Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useStripeOnboarding } from './StripeOnboardingContext';

// ── FadeIn ────────────────────────────────────────────────────────────────────

const FadeIn: React.FC<{ delay?: number; children: React.ReactNode; style?: any }> = ({
  delay = 0, children, style,
}) => {
  const opacity    = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity,    { toValue: 1, duration: 480, delay, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 480, delay, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, [delay]);

  return <Animated.View style={[{ opacity, transform: [{ translateY }] }, style]}>{children}</Animated.View>;
};

// ── Segmented Progress Bar ────────────────────────────────────────────────────

const SegmentedBar: React.FC<{ step: number; total: number }> = ({ step, total }) => (
  <View style={pb.row}>
    {Array.from({ length: total }).map((_, i) => {
      const done = i < step - 1, active = i === step - 1;
      return (
        <View key={i} style={pb.seg}>
          {done   ? <LinearGradient colors={['#7c3aed','#5b21b6']} start={{x:0,y:0}} end={{x:1,y:0}} style={pb.fill}/> :
           active ? <LinearGradient colors={['#7c3aed','#2563eb']} start={{x:0,y:0}} end={{x:1,y:0}} style={pb.fill}/> :
                    <View style={pb.empty}/>}
        </View>
      );
    })}
  </View>
);

const pb = StyleSheet.create({
  row:   { flexDirection:'row', paddingHorizontal:20, gap:5 },
  seg:   { flex:1, height:4, borderRadius:4, overflow:'hidden' },
  fill:  { flex:1 },
  empty: { flex:1, backgroundColor:'rgba(124,58,237,0.1)', borderRadius:4 },
});

// ── Pulse Animation ─────────────────────────────────────────────────────────────

const PulseDot: React.FC = () => {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = Animated.parallel([
      Animated.timing(scale, { toValue: 1.2, duration: 1000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 0.3, duration: 1000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
    ]);

    const reset = Animated.parallel([
      Animated.timing(scale, { toValue: 1, duration: 1000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 1000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
    ]);

    const loop = Animated.sequence([pulse, reset]);
    const repeat = Animated.loop(loop);
    
    repeat.start();
    
    return () => repeat.stop();
  }, []);

  return (
    <Animated.View style={[s.pulseDot, { transform: [{ scale }], opacity }]} />
  );
};

// ── Componente Principal ─────────────────────────────────────────────────────

const Step3Verification = () => {
  const { state, goNextStep } = useStripeOnboarding();

  // Simular proceso de verificación
  React.useEffect(() => {
    const timer = setTimeout(() => {
      goNextStep();
    }, 5000); // 5 segundos de simulación

    return () => clearTimeout(timer);
  }, [goNextStep]);

  return (
    <View style={s.root}>
      {/* Header */}
      <FadeIn delay={0}>
        <View style={s.header}>
          <Text style={s.stepCounter}>
            Paso <Text style={s.stepCounterBold}>3</Text> de 4
          </Text>
        </View>
      </FadeIn>

      {/* Barra de progreso */}
      <FadeIn delay={50}>
        <View style={s.barWrap}>
          <SegmentedBar step={3} total={4} />
          <Text style={s.stepLabel}>Verificación</Text>
        </View>
      </FadeIn>

      {/* Hero con animación */}
      <FadeIn delay={100}>
        <LinearGradient
          colors={['rgba(124,58,237,0.95)', 'rgba(37,99,235,0.9)']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={s.hero}
        >
          {/* Efecto glassmorphism */}
          <View style={s.glassOverlay} />
          <View style={s.glassHighlight} />
          
          {/* Círculos decorativos animados */}
          <View style={s.heroCircle1} />
          <View style={s.heroCircle2} />
          <View style={s.heroCircle3} />

          <View style={s.iconWrap}>
            <LinearGradient
              colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)']}
              style={s.iconGradient}
            >
              <Ionicons name="time-outline" size={36} color="#fff" />
            </LinearGradient>
          </View>
          
          <Text style={s.heroTitle}>Verificación en proceso</Text>
          <Text style={s.heroSub}>
            Stripe está verificando tu información.{'\n'}Esto puede tardar unos minutos.
          </Text>

          {/* Indicador de progreso con animación */}
          <View style={s.progressWrap}>
            <View style={s.pulse}>
              <PulseDot />
              <Text style={s.pulseText}>Procesando con Stripe...</Text>
            </View>
          </View>
        </LinearGradient>
      </FadeIn>

      {/* Información adicional */}
      <FadeIn delay={150}>
        <View style={s.infoCard}>
          <Text style={s.infoTitle}>¿Qué está pasando?</Text>
          <View style={s.infoList}>
            <View style={s.infoItem}>
              <View style={s.infoIcon}>
                <Ionicons name="checkmark-circle-outline" size={16} color="#16a34a" />
              </View>
              <Text style={s.infoText}>Verificando tu identidad con Stripe</Text>
            </View>
            <View style={s.infoItem}>
              <View style={s.infoIcon}>
                <Ionicons name="checkmark-circle-outline" size={16} color="#16a34a" />
              </View>
              <Text style={s.infoText}>Configurando cuenta de pagos</Text>
            </View>
            <View style={s.infoItem}>
              <View style={s.infoIcon}>
                <Ionicons name="checkmark-circle-outline" size={16} color="#16a34a" />
              </View>
              <Text style={s.infoText}>Preparando tu portal de facturación</Text>
            </View>
            <View style={s.infoItem}>
              <View style={[s.infoIcon, { backgroundColor: 'rgba(124,58,237,0.1)' }]}>
                <PulseDot />
              </View>
              <Text style={s.infoText}>Conectando con los servidores de Stripe</Text>
            </View>
          </View>
        </View>
      </FadeIn>

      {/* Tips */}
      <FadeIn delay={200}>
        <View style={s.tipsCard}>
          <Text style={s.tipsTitle}>Mientras esperas...</Text>
          <Text style={s.tipsText}>
            • No cierres esta aplicación{'\n'}
            • La verificación puede tomar hasta 5 minutos{'\n'}
            • Recibirás una confirmación cuando esté listo{'\n'}
            • Podrás comenzar a recibir pagos inmediatamente
          </Text>
        </View>
      </FadeIn>
    </View>
  );
};

export default Step3Verification;

// ── Styles ────────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  root: { flex: 1 },

  // Header
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 10, paddingBottom: 16,
  },
  logoRow:         { flexDirection: 'row', alignItems: 'center', gap: 0 },
  logoBusca:       { fontSize: 21, fontFamily: 'PlusJakartaSans_800ExtraBold', color: '#1e1b4b', letterSpacing: -0.4 },
  logoArtBg:       { borderRadius: 7, paddingHorizontal: 5, paddingVertical: 1 },
  logoArt:         { fontSize: 21, fontFamily: 'PlusJakartaSans_800ExtraBold', color: '#fff', letterSpacing: -0.4 },
  stepCounter:     { fontSize: 12, fontFamily: 'PlusJakartaSans_400Regular', color: 'rgba(109,40,217,0.45)' },
  stepCounterBold: { fontFamily: 'PlusJakartaSans_700Bold', color: '#7c3aed' },

  // Barra
  barWrap:   { gap: 8, paddingBottom: 4 },
  stepLabel: {
    fontSize: 10.5, fontFamily: 'PlusJakartaSans_600SemiBold',
    color: 'rgba(124,58,237,0.55)', paddingHorizontal: 20,
    letterSpacing: 0.5, textTransform: 'uppercase',
  },

  // Hero
  hero: {
    marginHorizontal: 16, marginBottom: 20,
    borderRadius: 28, padding: 32,
    overflow: 'hidden', position: 'relative',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)',
    shadowColor: '#6d28d9', shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.2, shadowRadius: 32, elevation: 12,
  },
  glassOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  glassHighlight: {
    position: 'absolute', top: 0, left: 1, right: 1, height: 1,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  heroCircle1: {
    position: 'absolute', width: 200, height: 200, borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.06)', top: -80, right: -60,
  },
  heroCircle2: {
    position: 'absolute', width: 120, height: 120, borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.04)', bottom: -40, left: 20,
  },
  heroCircle3: {
    position: 'absolute', width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.03)', top: '50%', right: 40,
  },
  iconWrap: {
    width: 72, height: 72, borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 24, alignSelf: 'center',
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8, elevation: 4,
  },
  iconGradient: {
    width: 64, height: 64, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
  },
  heroTitle: {
    fontSize: 20, fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: '#fff', letterSpacing: -0.5, marginBottom: 12,
    textAlign: 'center',
  },
  heroSub: {
    fontSize: 14, fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(255,255,255,0.8)', lineHeight: 22,
    textAlign: 'center', marginBottom: 24,
  },
  progressWrap: { alignItems: 'center' },
  pulse: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10,
  },
  pulseDot: {
    width: 8, height: 8, borderRadius: 4, backgroundColor: '#fff',
  },
  pulseText: {
    fontSize: 12, fontFamily: 'PlusJakartaSans_600SemiBold',
    color: 'rgba(255,255,255,0.9)',
  },

  // Info Card
  infoCard: {
    marginHorizontal: 16, marginBottom: 16,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 22,
    borderWidth: 1, borderColor: 'rgba(139,92,246,0.1)',
    shadowColor: '#6d28d9', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08, shadowRadius: 20, elevation: 4,
  },
  infoTitle: {
    fontSize: 16, fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: '#1e1b4b', marginBottom: 16,
  },
  infoList: { gap: 12 },
  infoItem: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  infoIcon: {
    width: 24, height: 24, borderRadius: 8,
    backgroundColor: 'rgba(22,163,74,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },
  infoText: {
    flex: 1, fontSize: 13, fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#374151',
  },

  // Tips Card
  tipsCard: {
    marginHorizontal: 16, marginBottom: 20,
    padding: 16,
    backgroundColor: 'rgba(124,58,237,0.04)',
    borderRadius: 16,
    borderWidth: 1, borderColor: 'rgba(124,58,237,0.1)',
  },
  tipsTitle: {
    fontSize: 14, fontFamily: 'PlusJakartaSans_700Bold',
    color: '#1e1b4b', marginBottom: 8,
  },
  tipsText: {
    fontSize: 12, fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(109,40,217,0.6)', lineHeight: 18,
  },
});
