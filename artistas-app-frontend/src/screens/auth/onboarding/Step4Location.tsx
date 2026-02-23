// src/screens/auth/onboarding/StepLocation.tsx
// Paso de ubicación — diseño del sistema · GPS · solo Medellín activa · sin cobertura para otras ciudades

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Animated,
  Easing,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
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
  row:   { flexDirection:'row', paddingHorizontal:20, gap:5 },
  seg:   { flex:1, height:4, borderRadius:4, overflow:'hidden' },
  fill:  { flex:1 },
  empty: { flex:1, backgroundColor:'rgba(124,58,237,0.1)', borderRadius:4 },
});

// ── Helpers ───────────────────────────────────────────────────────────────────

const MEDELLIN_KEYWORDS = ['medellín', 'medellin', 'medellín', 'envigado', 'bello', 'itagüí', 'itagui', 'sabaneta', 'copacabana', 'la estrella'];

const isMedellin = (city: string) =>
  MEDELLIN_KEYWORDS.some(k => city.toLowerCase().includes(k));

// ── Screen ────────────────────────────────────────────────────────────────────

const StepLocation = () => {
  const { step, city, setCity, goPrevStep, submitProfile, isLoading } = useOnboardingContext();

  const [gpsLoading, setGpsLoading]     = useState(false);
  const [gpsStatus, setGpsStatus]       = useState<'idle' | 'success' | 'denied' | 'error'>('idle');
  const [detectedRaw, setDetectedRaw]   = useState('');
  const [noCoverage, setNoCoverage]     = useState(false);
  const [manualInput, setManualInput]   = useState('');
  const [focusInput, setFocusInput]     = useState(false);

  const canContinue = city === 'Medellín';

  const handleDetect = async () => {
    setGpsLoading(true);
    setGpsStatus('idle');
    setNoCoverage(false);
    setDetectedRaw('');
    setCity('');
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setGpsStatus('denied');
        return;
      }
      const coords = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const [place] = await Location.reverseGeocodeAsync({
        latitude: coords.coords.latitude,
        longitude: coords.coords.longitude,
      });
      const detected = place.city ?? place.subregion ?? place.region ?? '';
      setDetectedRaw(detected);

      if (detected && isMedellin(detected)) {
        setCity('Medellín');
        setGpsStatus('success');
      } else if (detected) {
        setGpsStatus('success');
        setNoCoverage(true);
      } else {
        setGpsStatus('error');
      }
    } catch {
      setGpsStatus('error');
    } finally {
      setGpsLoading(false);
    }
  };

  const handleManualSubmit = () => {
    if (!manualInput.trim()) return;
    if (isMedellin(manualInput)) {
      setCity('Medellín');
      setNoCoverage(false);
    } else {
      setCity('');
      setNoCoverage(true);
    }
  };

  const handleSelectMedellin = () => {
    setCity('Medellín');
    setNoCoverage(false);
    setManualInput('');
    setDetectedRaw('');
    setGpsStatus('idle');
  };

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
              Paso <Text style={s.stepCounterBold}>{step}</Text> de 4
            </Text>
          </View>
        </FadeIn>

        {/* Segmented bar */}
        <FadeIn delay={50}>
          <View style={s.barWrap}>
            <SegmentedBar step={step} total={4} />
            <Text style={s.stepLabel}>Ubicación</Text>
          </View>
        </FadeIn>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={s.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Título */}
          <FadeIn delay={90}>
            <Text style={s.pageTitle}>¿Dónde trabajas?</Text>
            <Text style={s.pageSub}>
              Los clientes cercanos te encontrarán más fácil
            </Text>
          </FadeIn>

          {/* ── GPS Card ── */}
          <FadeIn delay={140}>
            <TouchableOpacity
              onPress={handleDetect}
              disabled={gpsLoading}
              activeOpacity={0.85}
              style={s.gpsCard}
            >
              {/* Highlight */}
              <View style={s.gpsCardHighlight} />

              <LinearGradient
                colors={['#7c3aed', '#2563eb']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={s.gpsIconCircle}
              >
                {gpsLoading
                  ? <ActivityIndicator size="small" color="#fff" />
                  : <Ionicons name="navigate" size={22} color="#fff" />
                }
              </LinearGradient>

              <View style={s.gpsTextWrap}>
                <Text style={s.gpsTitle}>
                  {gpsLoading ? 'Detectando tu ubicación…' : 'Usar ubicación actual'}
                </Text>
                <Text style={s.gpsSub}>
                  {gpsLoading
                    ? 'Esto puede tomar unos segundos'
                    : 'Activa el GPS para detectar tu ciudad automáticamente'
                  }
                </Text>
              </View>

              {!gpsLoading && (
                <Ionicons name="chevron-forward" size={18} color="rgba(124,58,237,0.4)" />
              )}
            </TouchableOpacity>
          </FadeIn>

          {/* ── Resultado GPS ── */}
          {gpsStatus === 'success' && city === 'Medellín' && (
            <FadeIn delay={0}>
              <View style={s.successBox}>
                <LinearGradient colors={['rgba(124,58,237,0.08)','rgba(37,99,235,0.05)']} start={{x:0,y:0}} end={{x:1,y:0}} style={s.successBoxInner}>
                  <View style={s.successDot} />
                  <View style={{ flex: 1 }}>
                    <Text style={s.successLabel}>Ubicación detectada</Text>
                    <Text style={s.successCity}>Medellín, Colombia ✓</Text>
                  </View>
                  <Ionicons name="checkmark-circle" size={22} color="#7c3aed" />
                </LinearGradient>
              </View>
            </FadeIn>
          )}

          {gpsStatus === 'denied' && (
            <FadeIn delay={0}>
              <View style={s.errorBox}>
                <Ionicons name="alert-circle-outline" size={16} color="#ef4444" />
                <Text style={s.errorText}>
                  Permiso denegado. Activa el GPS en ajustes.
                </Text>
              </View>
            </FadeIn>
          )}

          {gpsStatus === 'error' && (
            <FadeIn delay={0}>
              <View style={s.errorBox}>
                <Ionicons name="alert-circle-outline" size={16} color="#ef4444" />
                <Text style={s.errorText}>No pudimos obtener tu ubicación. Intenta de nuevo.</Text>
              </View>
            </FadeIn>
          )}

          {/* ── Sin cobertura ── */}
          {noCoverage && (
            <FadeIn delay={0}>
              <View style={s.noCoverageBox}>
                <View style={s.noCoverageHighlight} />
                <View style={s.noCoverageInner}>
                  <LinearGradient colors={['#f59e0b','#f97316']} style={s.noCoverageIcon}>
                    <Ionicons name="construct" size={18} color="#fff" />
                  </LinearGradient>
                  <View style={{ flex: 1 }}>
                    <Text style={s.noCoverageTitle}>
                      {detectedRaw ? `${detectedRaw} — sin cobertura aún` : 'Ciudad sin cobertura aún'}
                    </Text>
                    <Text style={s.noCoverageSub}>
                      Estamos trabajando para llegar a más ciudades pronto. Por ahora solo operamos en Medellín.
                    </Text>
                  </View>
                </View>
                {/* CTA para seleccionar Medellín */}
                <TouchableOpacity onPress={handleSelectMedellin} style={s.noCoverageCta} activeOpacity={0.8}>
                  <Text style={s.noCoverageCtaText}>Registrarme en Medellín por ahora</Text>
                  <Ionicons name="arrow-forward" size={14} color="#7c3aed" />
                </TouchableOpacity>
              </View>
            </FadeIn>
          )}

          {/* ── Divider ── */}
          <FadeIn delay={200}>
            <View style={s.orRow}>
              <View style={s.orLine} />
              <Text style={s.orText}>o elige manualmente</Text>
              <View style={s.orLine} />
            </View>
          </FadeIn>

          {/* ── Ciudad activa: Medellín ── */}
          <FadeIn delay={240}>
            <Text style={s.sectionMini}>Ciudades disponibles</Text>

            <TouchableOpacity onPress={handleSelectMedellin} activeOpacity={0.82}>
              {city === 'Medellín' ? (
                <LinearGradient
                  colors={['#7c3aed', '#2563eb']}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={s.cityCardSel}
                >
                  <View style={s.cityCardSelHighlight} />
                  <LinearGradient colors={['rgba(255,255,255,0.25)','rgba(255,255,255,0.1)']} style={s.cityIconSel}>
                    <Ionicons name="location" size={20} color="#fff" />
                  </LinearGradient>
                  <View style={{ flex: 1 }}>
                    <Text style={s.cityNameSel}>Medellín</Text>
                    <Text style={s.citySubSel}>Colombia · Activa ahora</Text>
                  </View>
                  <View style={s.cityBadgeSel}>
                    <Ionicons name="checkmark" size={14} color="#7c3aed" />
                  </View>
                </LinearGradient>
              ) : (
                <View style={s.cityCard}>
                  <View style={s.cityCardHighlight} />
                  <LinearGradient colors={['#ede9fe','#ddd6fe']} style={s.cityIcon}>
                    <Ionicons name="location" size={20} color="#7c3aed" />
                  </LinearGradient>
                  <View style={{ flex: 1 }}>
                    <Text style={s.cityName}>Medellín</Text>
                    <Text style={s.citySub}>Colombia · Disponible</Text>
                  </View>
                  <View style={s.cityArrow}>
                    <Ionicons name="chevron-forward" size={16} color="rgba(124,58,237,0.35)" />
                  </View>
                </View>
              )}
            </TouchableOpacity>

            {/* Próximamente */}
            <View style={s.comingCard}>
              <View style={s.comingCardHighlight} />
              <View style={s.comingIcon}>
                <Ionicons name="time-outline" size={20} color="#9ca3af" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.comingName}>Bogotá, Cali, Barranquilla…</Text>
                <Text style={s.comingSub}>Próximamente · Estamos expandiendo</Text>
              </View>
              <View style={s.comingBadge}>
                <Text style={s.comingBadgeText}>Pronto</Text>
              </View>
            </View>
          </FadeIn>

          {/* ── Nota informativa ── */}
          <FadeIn delay={360}>
            <View style={s.infoNote}>
              <Ionicons name="information-circle-outline" size={14} color="#7c3aed" />
              <Text style={s.infoNoteText}>
                Puedes actualizar tu ciudad desde tu perfil en cualquier momento.
              </Text>
            </View>
          </FadeIn>

        </ScrollView>

        {/* Footer */}
        <View style={s.footer}>
          <View style={s.footerRow}>
            <TouchableOpacity onPress={goPrevStep} activeOpacity={0.82} style={s.prevBtn}>
              <Ionicons name="arrow-back" size={18} color="#7c3aed" />
              <Text style={s.prevBtnText}>Anterior</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={submitProfile}
              disabled={!canContinue || isLoading}
              activeOpacity={0.85}
              style={[s.nextBtn, (!canContinue || isLoading) && s.nextBtnDisabled]}
            >
              <LinearGradient
                colors={canContinue ? ['#7c3aed','#2563eb'] : ['rgba(124,58,237,0.3)','rgba(37,99,235,0.3)']}
                start={{x:0,y:0}} end={{x:1,y:0}}
                style={s.nextBtnInner}
              >
                {isLoading
                  ? <ActivityIndicator size="small" color="#fff" />
                  : <>
                      <Text style={s.nextBtnText}>Empezar</Text>
                      <Ionicons name="arrow-forward" size={18} color="#fff" />
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

export default StepLocation;

// ── Styles ────────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  root: { flex:1 },
  safe: { flex:1 },

  colorBlotch: {
    position:'absolute', width:320, height:320, borderRadius:160,
    backgroundColor:'rgba(167,139,250,0.13)', top:-60, right:-80,
  },
  colorBlotch2: {
    position:'absolute', width:200, height:200, borderRadius:100,
    backgroundColor:'rgba(99,102,241,0.08)', bottom:100, left:-60,
  },

  // Header
  header: {
    flexDirection:'row', alignItems:'center', justifyContent:'space-between',
    paddingHorizontal:20, paddingTop:10, paddingBottom:16,
  },
  logoRow:         { flexDirection:'row', alignItems:'center', gap:0 },
  backBtn: {
    width:32, height:32, borderRadius:10,
    backgroundColor:'rgba(255,255,255,0.8)',
    borderWidth:1, borderColor:'rgba(124,58,237,0.14)',
    alignItems:'center', justifyContent:'center', marginRight:8,
  },
  logoBusca:       { fontSize:21, fontFamily:'PlusJakartaSans_800ExtraBold', color:'#1e1b4b', letterSpacing:-0.4 },
  logoArtBg:       { borderRadius:7, paddingHorizontal:5, paddingVertical:1 },
  logoArt:         { fontSize:21, fontFamily:'PlusJakartaSans_800ExtraBold', color:'#fff', letterSpacing:-0.4 },
  stepCounter:     { fontSize:12, fontFamily:'PlusJakartaSans_400Regular', color:'rgba(109,40,217,0.45)' },
  stepCounterBold: { fontFamily:'PlusJakartaSans_700Bold', color:'#7c3aed' },

  barWrap:   { gap:8, paddingBottom:4 },
  stepLabel: {
    fontSize:10.5, fontFamily:'PlusJakartaSans_600SemiBold',
    color:'rgba(124,58,237,0.55)', paddingHorizontal:20,
    letterSpacing:0.5, textTransform:'uppercase',
  },

  scroll: { paddingHorizontal:16, paddingTop:22, paddingBottom:40 },

  pageTitle: {
    fontSize:26, fontFamily:'PlusJakartaSans_800ExtraBold',
    color:'#1e1b4b', letterSpacing:-0.5, marginBottom:6,
  },
  pageSub: {
    fontSize:14, fontFamily:'PlusJakartaSans_400Regular',
    color:'rgba(109,40,217,0.5)', marginBottom:24,
  },

  // GPS Card
  gpsCard: {
    flexDirection:'row', alignItems:'center', gap:14,
    borderRadius:20, overflow:'hidden',
    backgroundColor:'rgba(255,255,255,0.72)',
    borderWidth:1, borderColor:'rgba(255,255,255,0.9)',
    shadowColor:'#6d28d9', shadowOffset:{width:0,height:8},
    shadowOpacity:0.1, shadowRadius:20, elevation:4,
    padding:16, marginBottom:14,
  },
  gpsCardHighlight: {
    position:'absolute', top:0, left:1, right:1, height:1,
    backgroundColor:'rgba(255,255,255,0.95)',
  },
  gpsIconCircle: {
    width:52, height:52, borderRadius:16,
    alignItems:'center', justifyContent:'center',
    shadowColor:'#7c3aed', shadowOffset:{width:0,height:4},
    shadowOpacity:0.25, shadowRadius:10, elevation:4,
  },
  gpsTextWrap:   { flex:1 },
  gpsTitle: {
    fontSize:15, fontFamily:'PlusJakartaSans_700Bold',
    color:'#1e1b4b', marginBottom:3,
  },
  gpsSub: {
    fontSize:12, fontFamily:'PlusJakartaSans_400Regular',
    color:'rgba(109,40,217,0.45)', lineHeight:17,
  },

  // Success box
  successBox: { borderRadius:14, overflow:'hidden', marginBottom:16 },
  successBoxInner: {
    flexDirection:'row', alignItems:'center', gap:12,
    padding:14, borderRadius:14,
    borderWidth:1, borderColor:'rgba(124,58,237,0.15)',
  },
  successDot: {
    width:10, height:10, borderRadius:5, backgroundColor:'#7c3aed',
  },
  successLabel: {
    fontSize:11, fontFamily:'PlusJakartaSans_600SemiBold',
    color:'rgba(124,58,237,0.5)', textTransform:'uppercase', letterSpacing:0.5,
  },
  successCity: {
    fontSize:15, fontFamily:'PlusJakartaSans_700Bold', color:'#4c1d95',
  },

  // Error box
  errorBox: {
    flexDirection:'row', alignItems:'flex-start', gap:8,
    backgroundColor:'rgba(254,242,242,0.9)',
    borderRadius:12, padding:12, marginBottom:14,
    borderWidth:1, borderColor:'#fecaca',
  },
  errorText: {
    flex:1, fontSize:12.5, fontFamily:'PlusJakartaSans_400Regular',
    color:'#dc2626', lineHeight:18,
  },

  // No coverage box
  noCoverageBox: {
    borderRadius:18, overflow:'hidden',
    backgroundColor:'rgba(255,255,255,0.72)',
    borderWidth:1, borderColor:'rgba(245,158,11,0.3)',
    shadowColor:'#f59e0b', shadowOffset:{width:0,height:4},
    shadowOpacity:0.1, shadowRadius:14, elevation:3,
    marginBottom:16,
  },
  noCoverageHighlight: {
    height:1, backgroundColor:'rgba(255,255,255,0.95)', marginHorizontal:1,
  },
  noCoverageInner: {
    flexDirection:'row', alignItems:'flex-start', gap:12, padding:16,
  },
  noCoverageIcon: {
    width:40, height:40, borderRadius:12,
    alignItems:'center', justifyContent:'center',
  },
  noCoverageTitle: {
    fontSize:14, fontFamily:'PlusJakartaSans_700Bold',
    color:'#92400e', marginBottom:4,
  },
  noCoverageSub: {
    fontSize:12, fontFamily:'PlusJakartaSans_400Regular',
    color:'rgba(146,64,14,0.7)', lineHeight:17,
  },
  noCoverageCta: {
    flexDirection:'row', alignItems:'center', justifyContent:'center', gap:6,
    marginHorizontal:16, marginBottom:14, paddingVertical:10,
    borderRadius:10,
    backgroundColor:'rgba(124,58,237,0.06)',
    borderWidth:1, borderColor:'rgba(124,58,237,0.15)',
  },
  noCoverageCtaText: {
    fontSize:13, fontFamily:'PlusJakartaSans_600SemiBold', color:'#7c3aed',
  },

  // Or divider
  orRow:  { flexDirection:'row', alignItems:'center', gap:10, marginVertical:20 },
  orLine: { flex:1, height:1, backgroundColor:'rgba(124,58,237,0.12)' },
  orText: { fontSize:11.5, fontFamily:'PlusJakartaSans_500Medium', color:'rgba(124,58,237,0.38)' },

  // Section mini label
  sectionMini: {
    fontSize:11, fontFamily:'PlusJakartaSans_600SemiBold',
    color:'rgba(109,40,217,0.45)', textTransform:'uppercase',
    letterSpacing:0.8, marginBottom:10,
  },

  // City card — seleccionada
  cityCardSel: {
    flexDirection:'row', alignItems:'center', gap:14,
    borderRadius:18, padding:16, marginBottom:10, overflow:'hidden',
    shadowColor:'#7c3aed', shadowOffset:{width:0,height:8},
    shadowOpacity:0.25, shadowRadius:20, elevation:6,
  },
  cityCardSelHighlight: {
    position:'absolute', top:0, left:1, right:1, height:1,
    backgroundColor:'rgba(255,255,255,0.3)',
  },
  cityIconSel: {
    width:44, height:44, borderRadius:14,
    alignItems:'center', justifyContent:'center',
  },
  cityNameSel: {
    fontSize:16, fontFamily:'PlusJakartaSans_700Bold', color:'#fff',
  },
  citySubSel: {
    fontSize:11.5, fontFamily:'PlusJakartaSans_400Regular',
    color:'rgba(255,255,255,0.7)',
  },
  cityBadgeSel: {
    width:28, height:28, borderRadius:14,
    backgroundColor:'rgba(255,255,255,0.9)',
    alignItems:'center', justifyContent:'center',
  },

  // City card — normal
  cityCard: {
    flexDirection:'row', alignItems:'center', gap:14,
    borderRadius:18, padding:16, marginBottom:10, overflow:'hidden',
    backgroundColor:'rgba(255,255,255,0.72)',
    borderWidth:1, borderColor:'rgba(255,255,255,0.9)',
    shadowColor:'#6d28d9', shadowOffset:{width:0,height:6},
    shadowOpacity:0.08, shadowRadius:16, elevation:3,
  },
  cityCardHighlight: {
    position:'absolute', top:0, left:1, right:1, height:1,
    backgroundColor:'rgba(255,255,255,0.95)',
  },
  cityIcon: {
    width:44, height:44, borderRadius:14,
    alignItems:'center', justifyContent:'center',
  },
  cityName: {
    fontSize:16, fontFamily:'PlusJakartaSans_700Bold', color:'#1e1b4b',
  },
  citySub: {
    fontSize:11.5, fontFamily:'PlusJakartaSans_400Regular',
    color:'rgba(109,40,217,0.45)',
  },
  cityArrow: {
    width:28, height:28, borderRadius:10,
    backgroundColor:'rgba(124,58,237,0.06)',
    alignItems:'center', justifyContent:'center',
  },

  // Coming soon card
  comingCard: {
    flexDirection:'row', alignItems:'center', gap:14,
    borderRadius:18, padding:16, overflow:'hidden',
    backgroundColor:'rgba(255,255,255,0.45)',
    borderWidth:1, borderColor:'rgba(0,0,0,0.05)',
  },
  comingCardHighlight: {
    position:'absolute', top:0, left:1, right:1, height:1,
    backgroundColor:'rgba(255,255,255,0.8)',
  },
  comingIcon: {
    width:44, height:44, borderRadius:14,
    backgroundColor:'rgba(0,0,0,0.04)',
    alignItems:'center', justifyContent:'center',
  },
  comingName: {
    fontSize:14, fontFamily:'PlusJakartaSans_600SemiBold', color:'#9ca3af',
  },
  comingSub: {
    fontSize:11.5, fontFamily:'PlusJakartaSans_400Regular', color:'#d1d5db',
  },
  comingBadge: {
    paddingHorizontal:10, paddingVertical:4, borderRadius:20,
    backgroundColor:'rgba(0,0,0,0.04)',
  },
  comingBadgeText: {
    fontSize:11, fontFamily:'PlusJakartaSans_600SemiBold', color:'#9ca3af',
  },

  // Input manual
  inputWrap: {
    flexDirection:'row', alignItems:'center',
    borderWidth:1.5, borderColor:'rgba(167,139,250,0.25)',
    borderRadius:14, backgroundColor:'rgba(255,255,255,0.75)',
    paddingHorizontal:14, height:50,
  },
  inputFocused: {
    borderColor:'#7c3aed', backgroundColor:'rgba(255,255,255,0.95)',
    shadowColor:'#7c3aed', shadowOffset:{width:0,height:0},
    shadowOpacity:0.13, shadowRadius:10, elevation:2,
  },
  inputIcon:   { marginRight:9 },
  input: {
    flex:1, fontSize:15, fontFamily:'PlusJakartaSans_400Regular', color:'#1e1b4b',
  },
  inputHint: {
    fontSize:11, fontFamily:'PlusJakartaSans_400Regular',
    color:'rgba(124,58,237,0.35)', marginTop:6,
  },

  // Info note
  infoNote: {
    flexDirection:'row', alignItems:'flex-start', gap:7,
    backgroundColor:'rgba(245,243,255,0.7)',
    borderRadius:12, padding:12,
    borderWidth:1, borderColor:'rgba(167,139,250,0.18)', marginTop:20,
  },
  infoNoteText: {
    flex:1, fontSize:11.5, fontFamily:'PlusJakartaSans_400Regular',
    color:'rgba(109,40,217,0.55)', lineHeight:17,
  },

  // Footer
  footer: {
    paddingHorizontal:20, paddingTop:12, paddingBottom:28,
    backgroundColor:'rgba(248,246,255,0.95)',
    borderTopWidth:1, borderTopColor:'rgba(167,139,250,0.12)',
  },
  footerRow:       { flexDirection:'row', gap:10 },
  prevBtn: {
    flexDirection:'row', alignItems:'center', gap:6,
    paddingHorizontal:18, paddingVertical:16, borderRadius:14,
    backgroundColor:'rgba(255,255,255,0.8)',
    borderWidth:1.5, borderColor:'rgba(124,58,237,0.18)',
  },
  prevBtnText:     { fontSize:15, fontFamily:'PlusJakartaSans_600SemiBold', color:'#7c3aed' },
  nextBtn:         { flex:1, borderRadius:14, overflow:'hidden' },
  nextBtnDisabled: { opacity:0.6 },
  nextBtnInner: {
    flexDirection:'row', alignItems:'center', justifyContent:'center', gap:10,
    paddingVertical:16, borderRadius:14,
  },
  nextBtnText: { fontSize:16, fontFamily:'PlusJakartaSans_700Bold', color:'#fff' },
});