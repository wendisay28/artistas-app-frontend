// src/screens/auth/onboarding/Step5Manifiesto.tsx
// Paso 5 — Manifiesto del Artista BuscArt (Módulo 4.1 del plan legal)

import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, StatusBar, Animated, Easing, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useOnboardingContext } from './OnboardingContext';

// ── FadeIn ────────────────────────────────────────────────────────────────────

const FadeIn: React.FC<{ delay?: number; children: React.ReactNode; style?: any }> = ({
  delay = 0, children, style,
}) => {
  const opacity    = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity,    { toValue: 1, duration: 460, delay, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 460, delay, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
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
  row:   { flexDirection: 'row', paddingHorizontal: 20, gap: 5 },
  seg:   { flex: 1, height: 4, borderRadius: 4, overflow: 'hidden' },
  fill:  { flex: 1 },
  empty: { flex: 1, backgroundColor: 'rgba(124,58,237,0.1)', borderRadius: 4 },
});

// ── Items del Manifiesto ──────────────────────────────────────────────────────

const MANIFESTO_ITEMS = [
  {
    id: 'business',
    icon: 'briefcase-outline' as const,
    title: 'El Arte es un Negocio',
    body: 'Entiendo que al aceptar una oferta estoy firmando un contrato vinculante. Mi reputación y mi cumplimiento son mi mayor activo.',
  },
  {
    id: 'punctuality',
    icon: 'time-outline' as const,
    title: 'La Puntualidad es mi Firma',
    body: 'Me comprometo a llegar 30 minutos antes para mi montaje. Los 20 minutos de gracia son exclusivos para fallas técnicas, no para retrasos injustificados.',
  },
  {
    id: 'written',
    icon: 'chatbubble-ellipses-outline' as const,
    title: 'Protección por Escrito',
    body: 'Comprendo que cualquier cambio de precio, horario o entregables debe registrarse en el BuscArt Messenger. Lo que no está escrito en la plataforma no está protegido.',
  },
  {
    id: 'ethics',
    icon: 'shield-checkmark-outline' as const,
    title: 'Ética de Intercambio (UGC)',
    body: 'Acepto que si soy contratado para crear contenido a cambio de una experiencia, la falta de entrega del material resultará en mi expulsión de la plataforma y el cobro del consumo.',
  },
];

// ── Screen ────────────────────────────────────────────────────────────────────

const Step5Manifiesto = () => {
  const { step, goPrevStep, submitProfile, isLoading } = useOnboardingContext();
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const allChecked = MANIFESTO_ITEMS.every(item => checked[item.id]);

  const toggle = (id: string) =>
    setChecked(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <View style={s.root}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      <LinearGradient
        colors={['#f8f6ff', '#f0edff', '#eef2ff']}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={s.colorBlotch} />
      <View style={s.colorBlotch2} />

      <SafeAreaView style={s.safe}>

        {/* Header */}
        <FadeIn delay={0}>
          <View style={s.header}>
            <View style={s.logoRow}>
              <TouchableOpacity onPress={goPrevStep} style={s.backBtn} activeOpacity={0.8}>
                <Ionicons name="arrow-back" size={18} color="#6d28d9" />
              </TouchableOpacity>
              <Text style={s.logoBusca}>Busc</Text>
              <LinearGradient colors={['#7c3aed','#2563eb']} start={{x:0,y:0}} end={{x:1,y:0}} style={s.logoArtBg}>
                <Text style={s.logoArt}>Art</Text>
              </LinearGradient>
            </View>
            <Text style={s.stepCounter}>
              Paso <Text style={s.stepCounterBold}>{step}</Text> de 5
            </Text>
          </View>
        </FadeIn>

        {/* Segmented bar */}
        <FadeIn delay={50}>
          <View style={s.barWrap}>
            <SegmentedBar step={step} total={5} />
            <Text style={s.stepLabel}>Manifiesto</Text>
          </View>
        </FadeIn>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={s.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* Título */}
          <FadeIn delay={90}>
            <Text style={s.pageTitle}>Manifiesto del Artista</Text>
            <Text style={s.pageSub}>
              Lee y acepta cada compromiso antes de publicar en BuscArt.
              Son las reglas que protegen tu trabajo y el de tus clientes.
            </Text>
          </FadeIn>

          {/* Checkboxes */}
          {MANIFESTO_ITEMS.map((item, idx) => {
            const isChecked = !!checked[item.id];
            return (
              <FadeIn key={item.id} delay={140 + idx * 60}>
                <TouchableOpacity
                  onPress={() => toggle(item.id)}
                  activeOpacity={0.85}
                  style={[s.card, isChecked && s.cardChecked]}
                >
                  {/* Highlight line */}
                  <View style={s.cardHighlight} />

                  <View style={s.cardTop}>
                    {/* Icon */}
                    <LinearGradient
                      colors={isChecked ? ['#7c3aed', '#2563eb'] : ['#ede9fe', '#ddd6fe']}
                      style={s.cardIcon}
                    >
                      <Ionicons name={item.icon} size={18} color={isChecked ? '#fff' : '#7c3aed'} />
                    </LinearGradient>

                    {/* Text */}
                    <View style={s.cardText}>
                      <Text style={[s.cardTitle, isChecked && s.cardTitleChecked]}>
                        {item.title}
                      </Text>
                    </View>

                    {/* Checkbox */}
                    <View style={[s.checkbox, isChecked && s.checkboxOn]}>
                      {isChecked && <Ionicons name="checkmark" size={13} color="#fff" />}
                    </View>
                  </View>

                  <Text style={[s.cardBody, isChecked && s.cardBodyChecked]}>
                    {item.body}
                  </Text>
                </TouchableOpacity>
              </FadeIn>
            );
          })}

          {/* Nota legal */}
          <FadeIn delay={420}>
            <View style={s.legalNote}>
              <Ionicons name="information-circle-outline" size={14} color="#7c3aed" />
              <Text style={s.legalNoteText}>
                Al marcar todos los compromisos y continuar, aceptas el Manifiesto del Artista BuscArt como parte de tus Términos de Servicio.
              </Text>
            </View>
          </FadeIn>
        </ScrollView>

        {/* Footer */}
        <View style={s.footer}>
          {!allChecked && (
            <Text style={s.hint}>
              Marca los {MANIFESTO_ITEMS.length - Object.values(checked).filter(Boolean).length} compromisos restantes para continuar
            </Text>
          )}
          <View style={s.footerRow}>
            <TouchableOpacity onPress={goPrevStep} activeOpacity={0.82} style={s.prevBtn}>
              <Ionicons name="arrow-back" size={18} color="#7c3aed" />
              <Text style={s.prevBtnText}>Anterior</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={submitProfile}
              disabled={!allChecked || isLoading}
              activeOpacity={0.85}
              style={[s.nextBtn, (!allChecked || isLoading) && s.nextBtnDisabled]}
            >
              <LinearGradient
                colors={allChecked ? ['#7c3aed','#2563eb'] : ['rgba(124,58,237,0.3)','rgba(37,99,235,0.3)']}
                start={{x:0,y:0}} end={{x:1,y:0}}
                style={s.nextBtnInner}
              >
                {isLoading
                  ? <ActivityIndicator size="small" color="#fff" />
                  : <>
                      <Text style={s.nextBtnText}>Crear mi perfil</Text>
                      <Ionicons name="rocket-outline" size={18} color="#fff" />
                    </>
                }
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

      </SafeAreaView>
    </View>
  );
};

export default Step5Manifiesto;

// ── Styles ────────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1 },

  colorBlotch: {
    position: 'absolute', width: 320, height: 320, borderRadius: 160,
    backgroundColor: 'rgba(167,139,250,0.13)', top: -60, right: -80,
  },
  colorBlotch2: {
    position: 'absolute', width: 200, height: 200, borderRadius: 100,
    backgroundColor: 'rgba(99,102,241,0.08)', bottom: 100, left: -60,
  },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 10, paddingBottom: 16,
  },
  logoRow:         { flexDirection: 'row', alignItems: 'center', gap: 0 },
  backBtn: {
    width: 32, height: 32, borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderWidth: 1, borderColor: 'rgba(124,58,237,0.14)',
    alignItems: 'center', justifyContent: 'center', marginRight: 8,
  },
  logoBusca:       { fontSize: 21, fontFamily: 'PlusJakartaSans_800ExtraBold', color: '#1e1b4b', letterSpacing: -0.4 },
  logoArtBg:       { borderRadius: 7, paddingHorizontal: 5, paddingVertical: 1 },
  logoArt:         { fontSize: 21, fontFamily: 'PlusJakartaSans_800ExtraBold', color: '#fff', letterSpacing: -0.4 },
  stepCounter:     { fontSize: 12, fontFamily: 'PlusJakartaSans_400Regular', color: 'rgba(109,40,217,0.45)' },
  stepCounterBold: { fontFamily: 'PlusJakartaSans_700Bold', color: '#7c3aed' },

  barWrap:   { gap: 8, paddingBottom: 4 },
  stepLabel: {
    fontSize: 10.5, fontFamily: 'PlusJakartaSans_600SemiBold',
    color: 'rgba(124,58,237,0.55)', paddingHorizontal: 20,
    letterSpacing: 0.5, textTransform: 'uppercase',
  },

  scroll: { paddingHorizontal: 16, paddingTop: 22, paddingBottom: 40 },

  pageTitle: {
    fontSize: 26, fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: '#1e1b4b', letterSpacing: -0.5, marginBottom: 6,
  },
  pageSub: {
    fontSize: 14, fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(109,40,217,0.5)', marginBottom: 24, lineHeight: 20,
  },

  // Card
  card: {
    borderRadius: 18, overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.72)',
    borderWidth: 1.5, borderColor: 'rgba(124,58,237,0.1)',
    padding: 16, marginBottom: 12,
    shadowColor: '#6d28d9', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06, shadowRadius: 12, elevation: 2,
  },
  cardChecked: {
    backgroundColor: 'rgba(245,243,255,0.95)',
    borderColor: 'rgba(124,58,237,0.35)',
  },
  cardHighlight: {
    position: 'absolute', top: 0, left: 1, right: 1, height: 1,
    backgroundColor: 'rgba(255,255,255,0.95)',
  },
  cardTop: {
    flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10,
  },
  cardIcon: {
    width: 38, height: 38, borderRadius: 11,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  cardText: { flex: 1 },
  cardTitle: {
    fontSize: 14, fontFamily: 'PlusJakartaSans_700Bold', color: '#374151',
  },
  cardTitleChecked: { color: '#4c1d95' },
  cardBody: {
    fontSize: 13, fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(107,114,128,0.9)', lineHeight: 19,
  },
  cardBodyChecked: { color: 'rgba(109,40,217,0.65)' },

  // Checkbox
  checkbox: {
    width: 24, height: 24, borderRadius: 7, flexShrink: 0,
    borderWidth: 2, borderColor: 'rgba(124,58,237,0.25)',
    backgroundColor: 'rgba(255,255,255,0.8)',
    alignItems: 'center', justifyContent: 'center',
  },
  checkboxOn: {
    backgroundColor: '#7c3aed', borderColor: '#7c3aed',
  },

  // Nota legal
  legalNote: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 7,
    backgroundColor: 'rgba(245,243,255,0.7)',
    borderRadius: 12, padding: 12, marginTop: 8,
    borderWidth: 1, borderColor: 'rgba(167,139,250,0.18)',
  },
  legalNoteText: {
    flex: 1, fontSize: 11.5, fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(109,40,217,0.55)', lineHeight: 17,
  },

  // Footer
  hint: {
    textAlign: 'center', fontSize: 12, fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(109,40,217,0.45)', marginBottom: 10,
  },
  footer: {
    paddingHorizontal: 20, paddingTop: 12, paddingBottom: 28,
    backgroundColor: 'rgba(248,246,255,0.95)',
    borderTopWidth: 1, borderTopColor: 'rgba(167,139,250,0.12)',
  },
  footerRow:       { flexDirection: 'row', gap: 10 },
  prevBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 18, paddingVertical: 16, borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderWidth: 1.5, borderColor: 'rgba(124,58,237,0.18)',
  },
  prevBtnText:     { fontSize: 15, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#7c3aed' },
  nextBtn:         { flex: 1, borderRadius: 14, overflow: 'hidden' },
  nextBtnDisabled: { opacity: 0.6 },
  nextBtnInner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    paddingVertical: 16, borderRadius: 14,
  },
  nextBtnText: { fontSize: 16, fontFamily: 'PlusJakartaSans_700Bold', color: '#fff' },
});
