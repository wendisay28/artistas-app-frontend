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
  const translateY = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity,    { toValue: 1, duration: 560, delay, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 560, delay, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, [delay]);

  return <Animated.View style={[{ opacity, transform: [{ translateY }] }, style]}>{children}</Animated.View>;
};

// ── Segmented Progress Bar ────────────────────────────────────────────────────

const SegmentedBar: React.FC<{ step: number; total: number }> = ({ step, total }) => (
  <View style={pb.row}>
    {Array.from({ length: total }).map((_, i) => {
      const done = i < step - 1;
      const active = i === step - 1;
      return (
        <View key={i} style={pb.seg}>
          {done ? (
            <LinearGradient colors={['#7c3aed', '#5b21b6']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={pb.fill} />
          ) : active ? (
            <LinearGradient colors={['#7c3aed', '#2563eb']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={pb.fill} />
          ) : (
            <View style={pb.empty} />
          )}
        </View>
      );
    })}
  </View>
);

const pb = StyleSheet.create({
  row: { flexDirection: 'row', paddingHorizontal: 20, gap: 5 },
  seg: { flex: 1, height: 4, borderRadius: 4, overflow: 'hidden' },
  fill: { flex: 1 },
  empty: { flex: 1, backgroundColor: 'rgba(124,58,237,0.1)', borderRadius: 4 },
});

// ── Bouncing Dots Loader ──────────────────────────────────────────────────────

const BouncingDots: React.FC = () => {
  const dots = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];
  const opacities = [
    useRef(new Animated.Value(0.3)).current,
    useRef(new Animated.Value(0.3)).current,
    useRef(new Animated.Value(0.3)).current,
  ];

  useEffect(() => {
    const animations = dots.map((dot, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 160),
          Animated.parallel([
            Animated.timing(dot,          { toValue: -10, duration: 380, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
            Animated.timing(opacities[i], { toValue: 1,   duration: 380, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
          ]),
          Animated.parallel([
            Animated.timing(dot,          { toValue: 0, duration: 380, easing: Easing.in(Easing.cubic), useNativeDriver: true }),
            Animated.timing(opacities[i], { toValue: 0.3, duration: 380, easing: Easing.in(Easing.cubic), useNativeDriver: true }),
          ]),
          Animated.delay((3 - i) * 160 + 200),
        ])
      )
    );
    animations.forEach(a => a.start());
    return () => animations.forEach(a => a.stop());
  }, []);

  return (
    <View style={dl.row}>
      {dots.map((dot, i) => (
        <Animated.View
          key={i}
          style={[dl.dot, { transform: [{ translateY: dot }], opacity: opacities[i] }]}
        />
      ))}
    </View>
  );
};

const dl = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  dot: { width: 9, height: 9, borderRadius: 5, backgroundColor: '#7c3aed' },
});

// ── Pulse Dot ─────────────────────────────────────────────────────────────────

const PulseDot: React.FC = () => {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.35, duration: 700, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1,    duration: 700, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  return <Animated.View style={[s.pulseDot, { transform: [{ scale }] }]} />;
};

// ── Step Row ──────────────────────────────────────────────────────────────────

const StepRow: React.FC<{ icon: string; color: string; label: string; active?: boolean; delay: number }> = ({
  icon, color, label, active, delay
}) => (
  <FadeIn delay={delay}>
    <View style={[s.stepRow, active && s.stepRowActive]}>
      <View style={[s.stepIconWrap, active && s.stepIconWrapActive]}>
        <Ionicons name={icon as any} size={18} color={color} />
      </View>
      <Text style={[s.stepText, active && s.stepTextActive]}>{label}</Text>
      {active && <PulseDot />}
    </View>
  </FadeIn>
);



// ── Componente Principal ──────────────────────────────────────────────────────

const Step3Verification = () => {
  const { goNextStep } = useStripeOnboarding();

  // TODO: reemplazar con polling real cuando Stripe esté configurado
  useEffect(() => {
    const timer = setTimeout(() => goNextStep(), 5000);
    return () => clearTimeout(timer);
  }, [goNextStep]);

  return (
    <View style={s.root}>
      {/* Fondo degradado */}
      <LinearGradient
        colors={['#f5f3ff', '#ede9fe', '#e0e7ff']}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Manchas de color decorativas */}
      <View style={s.blotch1} />
      <View style={s.blotch2} />
      <View style={s.blotch3} />

      {/* ─── Header ─── */}
      <FadeIn delay={0}>
        <View style={s.header}>
          <Text style={s.stepCounter}>
            Paso <Text style={s.stepCounterBold}>3</Text> de 3
          </Text>
        </View>
      </FadeIn>

      {/* ─── Barra de progreso ─── */}
      <FadeIn delay={60}>
        <View style={s.barWrap}>
          <SegmentedBar step={3} total={3} />
          <Text style={s.barLabel}>Verificación</Text>
        </View>
      </FadeIn>

      {/* ─── Loader central ─── */}
      <FadeIn delay={120} style={s.loaderSection}>
        <BouncingDots />
        <Text style={s.heroTitle}>Verificando tu cuenta</Text>
        <Text style={s.heroSub}>
          Stripe está revisando tu información.{'\n'}Esto solo tomará un momento.
        </Text>
      </FadeIn>

      {/* ─── Separador con etiqueta ─── */}
      <FadeIn delay={180}>
        <View style={s.dividerRow}>
          <View style={s.dividerLine} />
          <Text style={s.dividerLabel}>Estado del proceso</Text>
          <View style={s.dividerLine} />
        </View>
      </FadeIn>

      {/* ─── Lista de pasos ─── */}
      <View style={s.stepsList}>
        <StepRow icon="checkmark-circle" color="#16a34a" label="Identidad verificada con Stripe" delay={220} />
        <StepRow icon="checkmark-circle" color="#16a34a" label="Cuenta de pagos configurada" delay={270} />
        <StepRow icon="checkmark-circle" color="#16a34a" label="Portal de facturación listo" delay={320} />
        <StepRow icon="time-outline"     color="#7c3aed" label="Conectando con servidores…" active delay={370} />
      </View>

      {/* ─── Nota inferior ─── */}
      <FadeIn delay={420}>
        <LinearGradient
          colors={['rgba(124,58,237,0.04)', 'rgba(79,70,229,0.02)']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          style={s.noteCard}
        >
          <Ionicons name="lock-closed-outline" size={13} color="rgba(124,58,237,0.5)" />
          <Text style={s.noteText}>
            No cierres la app · Verificación de hasta 5 min · Recibirás confirmación al terminar
          </Text>
        </LinearGradient>
      </FadeIn>
    </View>
  );
};

export default Step3Verification;

// ── Styles ────────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  root: { flex: 1 },

  // Manchas decorativas
  blotch1: {
    position: 'absolute', width: 340, height: 340, borderRadius: 170,
    backgroundColor: 'rgba(167,139,250,0.14)', top: -80, right: -80,
  },
  blotch2: {
    position: 'absolute', width: 240, height: 240, borderRadius: 120,
    backgroundColor: 'rgba(99,102,241,0.12)', bottom: 60, left: -60,
  },
  blotch3: {
    position: 'absolute', width: 140, height: 140, borderRadius: 70,
    backgroundColor: 'rgba(139,92,246,0.09)', top: '40%', right: -30,
  },

  // Header
  header: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 8 },
  stepCounter: { fontSize: 11, fontFamily: 'PlusJakartaSans_400Regular', color: 'rgba(109,40,217,0.4)' },
  stepCounterBold: { fontFamily: 'PlusJakartaSans_700Bold', color: '#7c3aed' },

  // Barra
  barWrap: { gap: 4, paddingBottom: 0 },
  barLabel: {
    fontSize: 10, fontFamily: 'PlusJakartaSans_700Bold',
    color: 'rgba(124,58,237,0.55)', paddingHorizontal: 20,
    letterSpacing: 0.5, textTransform: 'uppercase',
  },

  // Loader section
  loaderSection: { alignItems: 'center', paddingTop: 32, paddingBottom: 28, paddingHorizontal: 24, gap: 16 },

  heroTitle: {
    fontSize: 22, fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: '#1e1b4b', letterSpacing: -0.5, textAlign: 'center',
  },
  heroSub: {
    fontSize: 13, fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(109,40,217,0.55)', lineHeight: 21,
    textAlign: 'center',
  },

  // Divisor con etiqueta
  dividerRow: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: 24, marginBottom: 16, gap: 10,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: 'rgba(124,58,237,0.1)' },
  dividerLabel: {
    fontSize: 10, fontFamily: 'PlusJakartaSans_600SemiBold',
    color: 'rgba(124,58,237,0.4)', letterSpacing: 0.6, textTransform: 'uppercase',
  },

  // Lista
  stepsList: { paddingHorizontal: 20, gap: 10, marginBottom: 20 },
  stepRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 14, paddingVertical: 12,
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderRadius: 14,
    borderWidth: 1, borderColor: 'rgba(124,58,237,0.07)',
  },
  stepRowActive: {
    backgroundColor: 'rgba(124,58,237,0.06)',
    borderColor: 'rgba(124,58,237,0.18)',
  },
  stepIconWrap: {
    width: 32, height: 32, borderRadius: 10,
    backgroundColor: 'rgba(124,58,237,0.06)',
    alignItems: 'center', justifyContent: 'center',
  },
  stepIconWrapActive: { backgroundColor: 'rgba(124,58,237,0.12)' },
  stepText: {
    flex: 1, fontSize: 13, fontFamily: 'PlusJakartaSans_500Medium',
    color: '#374151',
  },
  stepTextActive: { color: '#6d28d9', fontFamily: 'PlusJakartaSans_600SemiBold' },
  pulseDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: '#7c3aed' },

  // Nota
  noteCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 7,
    marginHorizontal: 20,
    borderWidth: 1, borderColor: 'rgba(124,58,237,0.1)',
    borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10,
  },
  noteText: {
    flex: 1, fontSize: 11, fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(109,40,217,0.45)', lineHeight: 17,
  },
});