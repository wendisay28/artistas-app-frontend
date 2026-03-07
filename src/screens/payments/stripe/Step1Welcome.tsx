// src/screens/payments/stripe/Step1Welcome.tsx
// Rediseñado para coincidir con el sistema visual del onboarding BuscArt
// Glassmorphism · gradientes violeta-azul · Plus Jakarta Sans · fondo con manchas

import React, { useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Animated, Easing, ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useStripeOnboarding } from './StripeOnboardingContext';

// ── FadeIn ────────────────────────────────────────────────────────────────────

const FadeIn: React.FC<{ delay?: number; children: React.ReactNode; style?: any }> = ({
  delay = 0, children, style,
}) => {
  const opacity    = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(14)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity,    { toValue: 1, duration: 450, delay, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 450, delay, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[{ opacity, transform: [{ translateY }] }, style]}>
      {children}
    </Animated.View>
  );
};

// ── Segmented Progress Bar ────────────────────────────────────────────────────

const SegmentedBar: React.FC<{ step: number; total: number }> = ({ step, total }) => (
  <View style={pb.row}>
    {Array.from({ length: total }).map((_, i) => {
      const done   = i < step - 1;
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
  row:   { flexDirection: 'row', paddingHorizontal: 20, gap: 5 },
  seg:   { flex: 1, height: 4, borderRadius: 4, overflow: 'hidden' },
  fill:  { flex: 1 },
  empty: { flex: 1, backgroundColor: 'rgba(124,58,237,0.1)', borderRadius: 4 },
});

// ── Benefit Row ───────────────────────────────────────────────────────────────

const BenefitRow: React.FC<{
  icon: any;
  title: string;
  sub: string;
  gradient: [string, string];
  delay: number;
}> = ({ icon, title, sub, gradient, delay }) => (
  <FadeIn delay={delay}>
    <View style={br.wrap}>
      {/* Glass highlight */}
      <View style={br.highlight} />
      <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={br.iconBg}>
        <Ionicons name={icon} size={18} color="#fff" />
      </LinearGradient>
      <View style={br.text}>
        <Text style={br.title}>{title}</Text>
        <Text style={br.sub} numberOfLines={2}>{sub}</Text>
      </View>
      <Ionicons name="chevron-forward" size={14} color="rgba(124,58,237,0.25)" />
    </View>
  </FadeIn>
);

const br = StyleSheet.create({
  wrap: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    borderRadius: 16, overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.68)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.9)',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07, shadowRadius: 12, elevation: 2,
    height: 74, paddingHorizontal: 12, marginBottom: 8,
  },
  highlight: {
    position: 'absolute', top: 0, left: 1, right: 1, height: 1,
    backgroundColor: 'rgba(255,255,255,0.95)',
  },
  iconBg: {
    width: 44, height: 44, borderRadius: 13,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18, shadowRadius: 8, elevation: 3,
  },
  text:  { flex: 1 },
  title: { fontSize: 14, fontFamily: 'PlusJakartaSans_700Bold', color: '#1e1b4b', marginBottom: 2 },
  sub:   { fontSize: 12, fontFamily: 'PlusJakartaSans_400Regular', color: 'rgba(109,40,217,0.5)', lineHeight: 17 },
});

// ── Screen ────────────────────────────────────────────────────────────────────

const Step1Welcome: React.FC = () => {
  const { state, goNextStep } = useStripeOnboarding();

  return (
    <View style={s.root}>

      {/* Fondo gradiente — igual que onboarding */}
      <LinearGradient
        colors={['#f8f6ff', '#f0edff', '#eef2ff']}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Manchas de color difusas */}
      <View style={s.colorBlotch} />
      <View style={s.colorBlotch2} />

      {/* ── Header ── */}
      <FadeIn delay={0}>
        <View style={s.header}>
          <Text style={s.stepCounter}>
            Paso <Text style={s.stepCounterBold}>1</Text> de 4
          </Text>
        </View>
      </FadeIn>

      {/* ── Barra segmentada ── */}
      <FadeIn delay={50}>
        <View style={s.barWrap}>
          <SegmentedBar step={1} total={4} />
          <Text style={s.stepLabel}>Configuración de cobros</Text>
        </View>
      </FadeIn>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
      >

        {/* ── Hero Card compacta ── */}
        <FadeIn delay={120}>
          <View style={s.heroOuter}>
            <LinearGradient
              colors={['rgba(76, 29, 149, 0.9)', 'rgba(30, 64, 175, 0.85)']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={s.heroGradient}
            >
              <View style={s.heroCircle1} />
              <View style={s.heroCircle2} />

              {/* Ícono + texto en fila para reducir altura */}
              <View style={s.heroTopRow}>
                <View style={s.heroIconWrap}>
                  <Ionicons name="shield-checkmark-outline" size={20} color="#fff" />
                </View>
                <View style={s.heroTextWrap}>
                  <Text style={s.heroTitle}>Stripe Pay</Text>
                  <Text style={s.heroSub}>
                    Configura tu cuenta para recibir pagos seguros. Verás los detalles en los siguientes pasos.
                  </Text>
                </View>
              </View>

              {/* Badge de Stripe */}
              <View style={s.stripeBadge}>
                <Ionicons name="shield-checkmark" size={12} color="#86efac" />
                <Text style={s.stripeBadgeText}>
                  Pagos seguros vía <Text style={{ fontFamily: 'PlusJakartaSans_800ExtraBold' }}>Stripe</Text>
                </Text>
              </View>
            </LinearGradient>
          </View>
        </FadeIn>

        {/* ── Sección de beneficios ── */}
        <FadeIn delay={200}>
          <Text style={s.sectionLabel}>Por qué usar BuscArt Pay</Text>
        </FadeIn>

        <BenefitRow
          icon="cash-outline"
          title="Tu dinero rápido"
          sub="Retira tus ganancias directamente a tu banco sin esperas."
          gradient={['#7c3aed', '#5b21b6']}
          delay={240}
        />
        <BenefitRow
          icon="shield-checkmark-outline"
          title="Cobros garantizados"
          sub="Protegemos cada una de tus contrataciones de principio a fin."
          gradient={['#2563eb', '#1d4ed8']}
          delay={290}
        />
        <BenefitRow
          icon="flash-outline"
          title="Transparencia total"
          sub="Solo 15% por el uso de infraestructura y gestión de pagos seguros."
          gradient={['#ec4899', '#a855f7']}
          delay={340}
        />

      </ScrollView>

      {/* ── Footer ── */}
      <View style={s.footer}>
        <TouchableOpacity
          onPress={goNextStep}
          disabled={state.isLoading}
          activeOpacity={0.85}
          style={s.ctaBtn}
        >
          <View style={s.ctaBtnInner}>
            <Text style={s.ctaBtnText}>
              {state.isLoading ? 'Preparando...' : 'Comenzar ahora'}
            </Text>
            <Ionicons name="arrow-forward" size={18} color="#7c3aed" />
          </View>
        </TouchableOpacity>
        <Text style={s.footerHint}>Serás guiado por Stripe para verificar tu identidad</Text>
      </View>

    </View>
  );
};

export default Step1Welcome;

// ── Styles ────────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  root: { flex: 1 },

  // Manchas de fondo
  colorBlotch: {
    position: 'absolute', width: 340, height: 340, borderRadius: 170,
    backgroundColor: 'rgba(167,139,250,0.14)', top: 60, right: -80,
  },
  colorBlotch2: {
    position: 'absolute', width: 200, height: 200, borderRadius: 100,
    backgroundColor: 'rgba(99,102,241,0.08)', bottom: -60, left: -60,
  },

  // Header — pegado al top, sin paddingTop extra
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 6, paddingBottom: 12,
  },
  logoRow:         { flexDirection: 'row', alignItems: 'center', gap: 0 },
  logoBusca:       { fontSize: 21, fontFamily: 'PlusJakartaSans_800ExtraBold', color: '#1e1b4b', letterSpacing: -0.4 },
  logoArtBg:       { borderRadius: 7, paddingHorizontal: 5, paddingVertical: 1, marginLeft: 0 },
  logoArt:         { fontSize: 21, fontFamily: 'PlusJakartaSans_800ExtraBold', color: '#fff', letterSpacing: -0.4 },
  stepCounter:     { fontSize: 12, fontFamily: 'PlusJakartaSans_400Regular', color: 'rgba(109,40,217,0.45)' },
  stepCounterBold: { fontFamily: 'PlusJakartaSans_700Bold', color: '#7c3aed' },

  // Barra — sin paddingBottom extra para pegarse al header
  barWrap: { gap: 6, paddingBottom: 0 },
  stepLabel: {
    fontSize: 10.5, fontFamily: 'PlusJakartaSans_600SemiBold',
    color: 'rgba(124,58,237,0.55)', paddingHorizontal: 20,
    letterSpacing: 0.5, textTransform: 'uppercase',
  },

  // Scroll — paddingTop reducido, la tarjeta sube
  scroll: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 16 },

  // Hero compacta — ícono + texto en fila horizontal
  heroOuter: {
    borderRadius: 22, overflow: 'hidden',
    shadowColor: '#4c1d95', shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18, shadowRadius: 20, elevation: 6,
    marginBottom: 20,
  },
  heroGradient: {
    borderRadius: 22, padding: 16, overflow: 'hidden',
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.3)',
  },
  heroCircle1: {
    position: 'absolute', width: 140, height: 140, borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.05)', top: -40, right: -30,
  },
  heroCircle2: {
    position: 'absolute', width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.04)', bottom: -10, left: 10,
  },
  heroTopRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12,
  },
  heroIconWrap: {
    width: 42, height: 42, borderRadius: 12, flexShrink: 0,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
  },
  heroTextWrap: { flex: 1 },
  heroTitle: {
    fontSize: 17, fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: '#fff', letterSpacing: -0.4, lineHeight: 22, marginBottom: 4,
  },
  heroSub: {
    fontSize: 12, fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(255,255,255,0.65)', lineHeight: 17,
  },
  stripeBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(0,0,0,0.18)', alignSelf: 'flex-start',
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  stripeBadgeText: {
    fontSize: 10.5, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#fff',
  },

  // Sección label
  sectionLabel: {
    fontSize: 10.5, fontFamily: 'PlusJakartaSans_600SemiBold',
    color: 'rgba(124,58,237,0.55)', letterSpacing: 0.5,
    textTransform: 'uppercase', marginBottom: 14,
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 4,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
  },
  ctaBtn:      { borderRadius: 12, overflow: 'hidden', marginBottom: 12, alignSelf: 'center', width: '85%' },
  ctaBtnInner: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 10,
    paddingVertical: 14, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(124,58,237,0.3)',
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  ctaBtnText:  { fontSize: 16, fontFamily: 'PlusJakartaSans_700Bold', color: '#7c3aed' },
  footerHint: {
    fontSize: 11.5, fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(109,40,217,0.38)', textAlign: 'center',
  },
});