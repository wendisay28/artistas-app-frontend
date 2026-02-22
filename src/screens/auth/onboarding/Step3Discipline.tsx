// src/screens/auth/onboarding/Step3Discipline.tsx
// Diseño Opción B — pills/chips grandes en flujo libre (flow wrap)
// Glass premium · paleta de marca · sin cuadrícula fija

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
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useOnboardingContext } from './OnboardingContext';
import {
  getCategoryById,
  getLocalizedDisciplineName,
} from '../../../constants/artistCategories';

const { width } = Dimensions.get('window');
const H_PAD = 16;

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

// ── Discipline Pill ───────────────────────────────────────────────────────────
// Chips de ancho dinámico según el texto — flujo libre con flexWrap

const DisciplinePill: React.FC<{
  label: string;
  selected: boolean;
  onPress: () => void;
  delay: number;
}> = ({ label, selected, onPress, delay }) => (
  <FadeIn delay={delay}>
    <TouchableOpacity onPress={onPress} activeOpacity={0.78} style={s.pillOuter}>
      {selected ? (
        // Seleccionado: gradiente de marca + texto blanco + checkmark
        <LinearGradient
          colors={['#7c3aed', '#2563eb']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          style={s.pillSelected}
        >
          <Ionicons name="checkmark-circle" size={15} color="rgba(255,255,255,0.85)" />
          <Text style={s.pillTextSelected}>{label}</Text>
        </LinearGradient>
      ) : (
        // Normal: glass blanco con borde violeta sutil
        <View style={s.pillNormal}>
          <Text style={s.pillTextNormal}>{label}</Text>
        </View>
      )}
    </TouchableOpacity>
  </FadeIn>
);

// ── Selected Summary Badge ────────────────────────────────────────────────────
// Mini banner que aparece cuando hay selección — confirma visualmente al usuario

const SelectedBanner: React.FC<{ label: string }> = ({ label }) => (
  <Animated.View style={s.banner}>
    <LinearGradient
      colors={['rgba(124,58,237,0.08)', 'rgba(37,99,235,0.06)']}
      start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
      style={s.bannerInner}
    >
      <View style={s.bannerDot} />
      <Text style={s.bannerText} numberOfLines={1}>
        Seleccionaste: <Text style={s.bannerBold}>{label}</Text>
      </Text>
      <Ionicons name="checkmark-circle" size={16} color="#7c3aed" />
    </LinearGradient>
  </Animated.View>
);

// ── Screen ────────────────────────────────────────────────────────────────────

const Step3Discipline = () => {
  const {
    step,
    selectedCategory,
    selectedDiscipline,
    setSelectedDiscipline,
    goNextStep,
    goPrevStep,
  } = useOnboardingContext();

  const [disciplines, setDisciplines] = useState<any[]>([]);

  useEffect(() => {
    if (selectedCategory) {
      const category = getCategoryById(selectedCategory);
      if (category) setDisciplines(category.disciplines || []);
    }
  }, [selectedCategory]);

  const canContinue  = selectedDiscipline !== null;
  const handleSelect = (id: string) => setSelectedDiscipline(selectedDiscipline === id ? null : id);

  const selectedLabel = disciplines.find(d => d.id === selectedDiscipline)
    ? getLocalizedDisciplineName(selectedCategory!, selectedDiscipline!, 'es') || selectedDiscipline
    : null;

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
            <Text style={s.stepLabel}>Disciplina</Text>
          </View>
        </FadeIn>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={s.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* Título */}
          <FadeIn delay={90}>
            <Text style={s.pageTitle}>Tu especialidad</Text>
            <Text style={s.pageSub}>
              ¿Con qué disciplina te identificas más?
            </Text>
          </FadeIn>

          {/* Banner de selección actual */}
          {selectedLabel && (
            <FadeIn delay={0}>
              <SelectedBanner label={selectedLabel} />
            </FadeIn>
          )}

          {/* Contador de disciplinas disponibles */}
          <FadeIn delay={110}>
            <Text style={s.countLabel}>
              {disciplines.length} disciplinas disponibles
            </Text>
          </FadeIn>

          {/* Flow wrap de pills */}
          <FadeIn delay={130}>
            <View style={s.pillsWrap}>
              {disciplines.map((discipline, index) => {
                const label = getLocalizedDisciplineName(selectedCategory!, discipline.id, 'es') || discipline.id;
                return (
                  <DisciplinePill
                    key={discipline.id}
                    label={label}
                    selected={selectedDiscipline === discipline.id}
                    onPress={() => handleSelect(discipline.id)}
                    delay={150 + index * 25}
                  />
                );
              })}
            </View>
          </FadeIn>

          {/* Hint si no ha seleccionado */}
          {!selectedDiscipline && disciplines.length > 0 && (
            <FadeIn delay={400}>
              <View style={s.hint}>
                <Ionicons name="hand-left-outline" size={14} color="rgba(124,58,237,0.4)" />
                <Text style={s.hintText}>Toca una disciplina para seleccionarla</Text>
              </View>
            </FadeIn>
          )}
        </ScrollView>

        {/* Footer */}
        <View style={s.footer}>
          <View style={s.footerRow}>
            <TouchableOpacity onPress={goPrevStep} activeOpacity={0.82} style={s.prevBtn}>
              <Ionicons name="arrow-back" size={18} color="#7c3aed" />
              <Text style={s.prevBtnText}>Anterior</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={goNextStep}
              disabled={!canContinue}
              activeOpacity={0.85}
              style={[s.nextBtn, !canContinue && s.nextBtnDisabled]}
            >
              <LinearGradient
                colors={canContinue ? ['#7c3aed','#2563eb'] : ['rgba(124,58,237,0.3)','rgba(37,99,235,0.3)']}
                start={{x:0,y:0}} end={{x:1,y:0}}
                style={s.nextBtnInner}
              >
                <Text style={s.nextBtnText}>Continuar</Text>
                <Ionicons name="arrow-forward" size={18} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

      </SafeAreaView>
    </View>
  );
};

export default Step3Discipline;

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
    alignItems:'center', justifyContent:'center', marginRight:2,
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

  scroll: { paddingHorizontal:H_PAD, paddingTop:22, paddingBottom:40 },

  pageTitle: {
    fontSize:26, fontFamily:'PlusJakartaSans_800ExtraBold',
    color:'#1e1b4b', letterSpacing:-0.5, marginBottom:6,
  },
  pageSub: {
    fontSize:14, fontFamily:'PlusJakartaSans_400Regular',
    color:'rgba(109,40,217,0.5)', marginBottom:20,
  },

  // Banner selección activa
  banner: {
    marginBottom:18, borderRadius:14, overflow:'hidden',
  },
  bannerInner: {
    flexDirection:'row', alignItems:'center', gap:10,
    paddingHorizontal:14, paddingVertical:12,
    borderRadius:14, borderWidth:1, borderColor:'rgba(124,58,237,0.15)',
  },
  bannerDot: {
    width:8, height:8, borderRadius:4,
    backgroundColor:'#7c3aed',
  },
  bannerText: {
    flex:1, fontSize:13, fontFamily:'PlusJakartaSans_400Regular',
    color:'rgba(109,40,217,0.6)',
  },
  bannerBold: {
    fontFamily:'PlusJakartaSans_700Bold', color:'#5b21b6',
  },

  // Contador
  countLabel: {
    fontSize:11, fontFamily:'PlusJakartaSans_500Medium',
    color:'rgba(124,58,237,0.35)', marginBottom:16,
    textTransform:'uppercase', letterSpacing:0.6,
  },

  // Pills wrap — flow libre
  pillsWrap: {
    flexDirection:'row',
    flexWrap:'wrap',
    gap:10,
  },

  // Pill outer (no tiene estilo propio, el estilo está en pillNormal/pillSelected)
  pillOuter: {},

  // Estado normal — glass blanco con borde violeta muy sutil
  pillNormal: {
    paddingHorizontal:18,
    paddingVertical:12,
    borderRadius:50,
    backgroundColor:'rgba(255,255,255,0.75)',
    borderWidth:1.5,
    borderColor:'rgba(167,139,250,0.25)',
    shadowColor:'#6d28d9',
    shadowOffset:{ width:0, height:3 },
    shadowOpacity:0.07,
    shadowRadius:10,
    elevation:2,
  },
  pillTextNormal: {
    fontSize:14.5,
    fontFamily:'PlusJakartaSans_600SemiBold',
    color:'#4c1d95',
  },

  // Estado seleccionado — gradiente + texto blanco + checkmark
  pillSelected: {
    flexDirection:'row',
    alignItems:'center',
    gap:7,
    paddingHorizontal:18,
    paddingVertical:12,
    borderRadius:50,
    shadowColor:'#7c3aed',
    shadowOffset:{ width:0, height:4 },
    shadowOpacity:0.3,
    shadowRadius:12,
    elevation:5,
  },
  pillTextSelected: {
    fontSize:14.5,
    fontFamily:'PlusJakartaSans_700Bold',
    color:'#fff',
  },

  // Hint
  hint: {
    flexDirection:'row', alignItems:'center', gap:8,
    marginTop:24, justifyContent:'center',
  },
  hintText: {
    fontSize:12.5, fontFamily:'PlusJakartaSans_400Regular',
    color:'rgba(124,58,237,0.38)',
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