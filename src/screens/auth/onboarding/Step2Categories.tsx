// src/screens/auth/onboarding/Step2Categories.tsx
// Cuadrícula 2 col · glass individual · descripción en texto · íconos en colores de marca

import React, { useEffect, useRef } from 'react';
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

const { width } = Dimensions.get('window');
const GAP       = 10;
const H_PAD     = 16;
const CARD_SIZE = (width - H_PAD * 2 - GAP) / 2;

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

// ── Data — íconos con colores de marca (#7c3aed / #2563eb / #5b21b6) ─────────
// Cada categoría usa una variante del sistema de color, no colores surtidos

const CATEGORIES = [
  {
    id: 'artes-visuales',
    label: 'Artes Visuales',
    description: 'Pintura, fotografía, escultura e ilustración',
    icon: 'color-palette' as const,
    // Violeta principal → lila
    gradientIcon: ['#7c3aed', '#a78bfa'] as [string, string],
  },
  {
    id: 'artes-escenicas',
    label: 'Artes Escénicas',
    description: 'Teatro, danza, circo y performance en vivo',
    icon: 'people' as const,
    // Azul → violeta
    gradientIcon: ['#2563eb', '#7c3aed'] as [string, string],
  },
  {
    id: 'musica',
    label: 'Música y Sonido',
    description: 'Músicos, cantantes, productores y DJs',
    icon: 'musical-notes' as const,
    // Violeta oscuro → violeta medio
    gradientIcon: ['#5b21b6', '#7c3aed'] as [string, string],
  },
  {
    id: 'audiovisual',
    label: 'Audiovisual',
    description: 'Cine, animación, edición y televisión',
    icon: 'videocam' as const,
    // Azul → azul claro
    gradientIcon: ['#1d4ed8', '#2563eb'] as [string, string],
  },
  {
    id: 'diseno',
    label: 'Diseño',
    description: 'Diseño gráfico, moda y arquitectura creativa',
    icon: 'sparkles' as const,
    // Lila → violeta
    gradientIcon: ['#a78bfa', '#7c3aed'] as [string, string],
  },
  {
    id: 'comunicacion',
    label: 'Comunicación Digital',
    description: 'Marketing, contenido digital y redes sociales',
    icon: 'megaphone' as const,
    // Violeta → azul (diagonal inverso)
    gradientIcon: ['#7c3aed', '#2563eb'] as [string, string],
  },
  {
    id: 'cultura-turismo',
    label: 'Cultura y Turismo',
    description: 'Gestión cultural, turismo y patrimonio',
    icon: 'earth' as const,
    // Azul oscuro → violeta
    gradientIcon: ['#1e40af', '#5b21b6'] as [string, string],
  },
  {
    id: 'otro',
    label: 'Otro',
    description: 'Mi disciplina no está en estas categorías',
    icon: 'add-circle' as const,
    // Lila más sutil
    gradientIcon: ['#c4b5fd', '#a78bfa'] as [string, string],
  },
] as const;

// ── Glass Category Card ───────────────────────────────────────────────────────

const CategoryCard: React.FC<{
  item: typeof CATEGORIES[number];
  selected: boolean;
  onPress: () => void;
  delay: number;
}> = ({ item, selected, onPress, delay }) => (
  <FadeIn delay={delay} style={{ width: CARD_SIZE }}>
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={[s.card, selected && s.cardSel]}>
      <View style={s.cardHighlight} />

      {/* Ícono con gradiente de la categoría */}
      <View style={s.iconWrap}>
        <LinearGradient
          colors={selected ? item.gradientIcon : ['rgba(255,255,255,0.95)', 'rgba(237,233,254,0.9)']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={s.iconBg}
        >
          <Ionicons
            name={item.icon}
            size={28}
            color={selected ? '#fff' : item.gradientIcon[0]}
          />
        </LinearGradient>

        {selected && (
          <View style={s.checkBadge}>
            <LinearGradient colors={item.gradientIcon} style={s.checkBadgeInner}>
              <Ionicons name="checkmark" size={10} color="#fff" />
            </LinearGradient>
          </View>
        )}
      </View>

      <Text style={[s.catLabel, selected && s.catLabelSel]} numberOfLines={2}>
        {item.label}
      </Text>
      <Text style={[s.catDesc, selected && s.catDescSel]} numberOfLines={3}>
        {item.description}
      </Text>

      {selected && (
        <LinearGradient
          colors={item.gradientIcon}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          style={s.bottomAccent}
        />
      )}
    </TouchableOpacity>
  </FadeIn>
);

// ── Screen ────────────────────────────────────────────────────────────────────

const Step2Categories = () => {
  const { selectedCategory, setSelectedCategory, goNextStep, goPrevStep } = useOnboardingContext();

  const canContinue = selectedCategory !== null;
  const handleSelect = (id: string) => setSelectedCategory(selectedCategory === id ? null : id);

  const rows: (typeof CATEGORIES[number])[][] = [];
  for (let i = 0; i < CATEGORIES.length; i += 2) {
    rows.push([CATEGORIES[i], CATEGORIES[i + 1]].filter(Boolean) as any);
  }

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
              Paso <Text style={s.stepCounterBold}>2</Text> de 4
            </Text>
          </View>
        </FadeIn>

        {/* Segmented bar */}
        <FadeIn delay={50}>
          <View style={s.barWrap}>
            <SegmentedBar step={2} total={4} />
            <Text style={s.stepLabel}>Categoría</Text>
          </View>
        </FadeIn>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={s.scroll}
          showsVerticalScrollIndicator={false}
        >
          <FadeIn delay={90}>
            <Text style={s.pageTitle}>¿Cuál es tu arte?</Text>
            <Text style={s.pageSub}>Elige la categoría que mejor define tu trabajo</Text>
          </FadeIn>

          <View style={s.grid}>
            {rows.map((row, ri) => (
              <View key={ri} style={s.gridRow}>
                {row.map((cat, ci) => (
                  <CategoryCard
                    key={cat.id}
                    item={cat}
                    selected={selectedCategory === cat.id}
                    onPress={() => handleSelect(cat.id)}
                    delay={140 + ri * 60 + ci * 30}
                  />
                ))}
                {row.length === 1 && <View style={{ width: CARD_SIZE }} />}
              </View>
            ))}
          </View>
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

export default Step2Categories;

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

  scroll: { paddingHorizontal:H_PAD, paddingTop:22, paddingBottom:28 },

  pageTitle: {
    fontSize:26, fontFamily:'PlusJakartaSans_800ExtraBold',
    color:'#1e1b4b', letterSpacing:-0.5, marginBottom:6,
  },
  pageSub: {
    fontSize:14, fontFamily:'PlusJakartaSans_400Regular',
    color:'rgba(109,40,217,0.5)', marginBottom:24,
  },

  grid:    { gap:GAP },
  gridRow: { flexDirection:'row', gap:GAP },

  card: {
    width: CARD_SIZE,
    borderRadius:22,
    backgroundColor:'rgba(255,255,255,0.68)',
    borderWidth:1,
    borderColor:'rgba(255,255,255,0.9)',
    shadowColor:'#6d28d9',
    shadowOffset:{ width:0, height:8 },
    shadowOpacity:0.08,
    shadowRadius:20,
    elevation:4,
    overflow:'hidden',
    paddingHorizontal:16,
    paddingTop:16,
    paddingBottom:18,
    gap:10,
  },
  cardSel: {
    backgroundColor:'rgba(248,245,255,0.92)',
    borderColor:'rgba(124,58,237,0.3)',
    shadowOpacity:0.16,
    shadowRadius:24,
    elevation:7,
  },
  cardHighlight: {
    position:'absolute', top:0, left:1, right:1, height:1,
    backgroundColor:'rgba(255,255,255,0.95)',
  },

  iconWrap: { position:'relative', alignSelf:'flex-start' },
  iconBg: {
    width:58, height:58, borderRadius:18,
    alignItems:'center', justifyContent:'center',
    shadowColor:'#6d28d9',
    shadowOffset:{ width:0, height:3 },
    shadowOpacity:0.12, shadowRadius:8, elevation:2,
  },
  checkBadge: {
    position:'absolute', top:-4, right:-4,
    width:20, height:20, borderRadius:10,
    backgroundColor:'#fff',
    alignItems:'center', justifyContent:'center',
    shadowColor:'#000', shadowOpacity:0.15, shadowRadius:4, elevation:3,
  },
  checkBadgeInner: {
    width:16, height:16, borderRadius:8,
    alignItems:'center', justifyContent:'center',
  },

  catLabel:    { fontSize:14, fontFamily:'PlusJakartaSans_700Bold', color:'#1e1b4b', lineHeight:19 },
  catLabelSel: { color:'#4c1d95' },
  catDesc:     { fontSize:11.5, fontFamily:'PlusJakartaSans_400Regular', color:'rgba(109,40,217,0.45)', lineHeight:16 },
  catDescSel:  { color:'rgba(76,29,149,0.6)' },

  bottomAccent: { position:'absolute', bottom:0, left:0, right:0, height:3 },

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