// src/screens/auth/onboarding/Step1BasicInfo.tsx
// Diseño mejorado: Glassmorphism real, mejor posición y solución a focus en inputs.

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Easing,
  Pressable, // <-- Importante: Agregado para solucionar el foco en los inputs
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useOnboardingContext } from './OnboardingContext';

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
  }, [delay]);

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
            <LinearGradient
              colors={['#7c3aed', '#5b21b6']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={pb.fill}
            />
          ) : active ? (
            <LinearGradient
              colors={['#7c3aed', '#2563eb']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={pb.fill}
            />
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

// ── Glass Card (Mejorado para efecto real) ────────────────────────────────────

const GlassCard: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <View style={gc.outer}>
    {/* MEJORA 1: BlurView añadido para el efecto de cristal esmerilado */}
    <BlurView intensity={45} tint="light" style={StyleSheet.absoluteFill} />
    <View style={gc.highlight} />
    <View style={gc.inner}>{children}</View>
  </View>
);

const gc = StyleSheet.create({
  outer: {
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)', // Borde blanco/gris claro
    shadowColor: '#6d28d9',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.1,
    shadowRadius: 28,
    elevation: 8,
    overflow: 'hidden',
  },
  highlight: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.7)',
    marginHorizontal: 1,
  },
  inner: { padding: 24 },
});

// ── Screen ────────────────────────────────────────────────────────────────────

const Step1BasicInfo = () => {
  const {
    step, displayName, setDisplayName,
    username, setUsername,
    photoURI, pickPhoto,
    goNextStep,
  } = useOnboardingContext();

  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  // MEJORA 3: Referencias para controlar el foco de los inputs manualmente
  const nameRef = useRef<TextInput>(null);
  const userRef = useRef<TextInput>(null);

  const canContinue = displayName.trim().length >= 2 && username.trim().length >= 3;

  const handleContinue = () => {
    console.log('🔘 Botón Continuar presionado');
    console.log('📝 displayName:', displayName);
    console.log('📝 username:', username);
    console.log('✅ canContinue:', canContinue);
    console.log('📊 step actual:', step);
    
    if (canContinue) {
      console.log('🚀 Intentando avanzar al paso 2...');
      goNextStep();
    } else {
      console.log('❌ No puede continuar - validación fallida');
    }
  };

  return (
    <View style={s.root}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* Fondo: gradiente claro */}
      <LinearGradient
        colors={['#f8f6ff', '#f0edff', '#eef2ff']}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Mancha de color difusa */}
      <View style={s.colorBlotch} />

      <SafeAreaView style={s.safe}>

        {/* ── Header: logo izquierda + paso derecha ── */}
        <FadeIn delay={0}>
          <View style={s.header}>
            <View style={s.logoRow}>
              <Text style={s.logoBusca}>Busc</Text>
              <LinearGradient
                colors={['#7c3aed', '#2563eb']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={s.logoArtBg}
              >
                <Text style={s.logoArt}>Art</Text>
              </LinearGradient>
            </View>
            <Text style={s.stepCounter}>
              Paso <Text style={s.stepCounterBold}>1</Text> de 4
            </Text>
          </View>
        </FadeIn>

        {/* ── Barra segmentada ── */}
        <FadeIn delay={50}>
          <View style={s.barWrap}>
            <SegmentedBar step={1} total={4} />
            <Text style={s.stepLabel}>Básico</Text>
          </View>
        </FadeIn>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={20}
        >
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={s.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <FadeIn delay={120}>
              <GlassCard>
                {/* Title */}
                <View style={s.titleBlock}>
                  <Text style={s.stepTitle}>Cuéntanos de ti</Text>
                  <Text style={s.stepSub}>Tu nombre artístico y foto de perfil</Text>
                </View>

                {/* Avatar */}
                <TouchableOpacity onPress={pickPhoto} style={s.avatarWrap} activeOpacity={0.85}>
                  {photoURI ? (
                    <Image source={{ uri: photoURI }} style={s.avatar} />
                  ) : (
                    <LinearGradient colors={['#ede9fe', '#ddd6fe']} style={s.avatarPlaceholder}>
                      <Ionicons name="person" size={40} color="#7c3aed" />
                    </LinearGradient>
                  )}
                  <LinearGradient colors={['#7c3aed', '#2563eb']} style={s.cameraBtn}>
                    <Ionicons name="camera" size={13} color="#fff" />
                  </LinearGradient>
                </TouchableOpacity>
                <Text style={s.avatarHint}>Toca para añadir tu foto</Text>

                {/* MEJORA 3: Solución al cursor que rebota */}
                {/* Nombre artístico */}
                <View style={s.inputGroup}>
                  <Text style={s.inputLabel}>Nombre artístico *</Text>
                  {/* Usamos Pressable para que tocar el contenedor enfoque el input */}
                  <Pressable
                    style={[s.inputWrap, focusedInput === 'name' && s.inputFocused]}
                    onPress={() => nameRef.current?.focus()}
                  >
                    <View style={s.inputIconWrap}>
                      <Ionicons
                        name="person-outline"
                        size={16}
                        color={focusedInput === 'name' ? '#7c3aed' : '#c4b5fd'}
                      />
                    </View>
                    <TextInput
                      ref={nameRef} // Referencia añadida
                      style={s.input}
                      value={displayName}
                      onChangeText={setDisplayName}
                      placeholder="¿Cómo te conocen?"
                      placeholderTextColor="rgba(124,58,237,0.28)"
                      maxLength={50}
                      returnKeyType="next"
                      autoCapitalize="words"
                      onFocus={() => setFocusedInput('name')}
                      onBlur={() => setFocusedInput(null)}
                      onSubmitEditing={() => userRef.current?.focus()} // Salta al siguiente input
                    />
                    {displayName.length >= 2 && (
                      <Ionicons name="checkmark-circle" size={16} color="#16a34a" />
                    )}
                  </Pressable>
                </View>

                {/* Usuario */}
                <View style={s.inputGroup}>
                  <Text style={s.inputLabel}>Usuario *</Text>
                  <Pressable
                    style={[s.inputWrap, focusedInput === 'user' && s.inputFocused]}
                    onPress={() => userRef.current?.focus()}
                  >
                    <View style={s.inputIconWrap}>
                      <Ionicons
                        name="at-outline"
                        size={16}
                        color={focusedInput === 'user' ? '#7c3aed' : '#c4b5fd'}
                      />
                    </View>
                    <TextInput
                      ref={userRef} // Referencia añadida
                      style={s.input}
                      value={username}
                      onChangeText={setUsername}
                      placeholder="@usuario"
                      placeholderTextColor="rgba(124,58,237,0.28)"
                      maxLength={20}
                      returnKeyType="done"
                      autoCapitalize="none"
                      autoCorrect={false}
                      onFocus={() => setFocusedInput('user')}
                      onBlur={() => setFocusedInput(null)}
                    />
                    {username.length >= 3 && (
                      <Ionicons name="checkmark-circle" size={16} color="#16a34a" />
                    )}
                  </Pressable>
                  <Text style={s.inputHint}>Mínimo 3 caracteres · sin espacios</Text>
                </View>
              </GlassCard>
            </FadeIn>
          </ScrollView>

          {/* ── Footer ── */}
          <View style={s.footer}>
            <TouchableOpacity
              onPress={handleContinue}
              disabled={!canContinue}
              activeOpacity={0.85}
              style={[s.continueBtn, !canContinue && s.continueBtnDisabled]}
            >
              <LinearGradient
                colors={canContinue ? ['#7c3aed', '#2563eb'] : ['rgba(124,58,237,0.35)', 'rgba(37,99,235,0.35)']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={s.continueBtnInner}
              >
                <Text style={s.continueBtnText}>Continuar</Text>
                <Ionicons name="arrow-forward" size={18} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

export default Step1BasicInfo;

// ── Styles ────────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1 },

  colorBlotch: {
    position: 'absolute',
    width: 340, height: 340, borderRadius: 170,
    backgroundColor: 'rgba(167,139,250,0.14)',
    top: -80, right: -80,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
  },
  logoRow:       { flexDirection: 'row', alignItems: 'center', gap: 0 },
  logoBusca:     { fontSize: 21, fontFamily: 'PlusJakartaSans_800ExtraBold', color: '#1e1b4b', letterSpacing: -0.4 },
  logoArtBg:     { borderRadius: 7, paddingHorizontal: 5, paddingVertical: 1 },
  logoArt:       { fontSize: 21, fontFamily: 'PlusJakartaSans_800ExtraBold', color: '#fff', letterSpacing: -0.4 },
  stepCounter:   { fontSize: 12, fontFamily: 'PlusJakartaSans_400Regular', color: 'rgba(109,40,217,0.45)' },
  stepCounterBold: { fontFamily: 'PlusJakartaSans_700Bold', color: '#7c3aed' },

  // Barra
  barWrap:   { gap: 8, paddingBottom: 4 },
  stepLabel: {
    fontSize: 10.5, fontFamily: 'PlusJakartaSans_600SemiBold',
    color: 'rgba(124,58,237,0.55)',
    paddingHorizontal: 20, letterSpacing: 0.5, textTransform: 'uppercase',
  },

  // Scroll
  // MEJORA 2: Aumentado el paddingTop para bajar la posición de la tarjeta (de 20 a 45)
  scroll: { paddingHorizontal: 16, paddingTop: 45, paddingBottom: 28 },

  // Contenido tarjeta
  titleBlock: { marginBottom: 24 },
  stepTitle:  { fontSize: 23, fontFamily: 'PlusJakartaSans_800ExtraBold', color: '#1e1b4b', letterSpacing: -0.4, marginBottom: 4 },
  stepSub:    { fontSize: 13, fontFamily: 'PlusJakartaSans_400Regular', color: 'rgba(109,40,217,0.55)' },

  // Avatar
  avatarWrap: { alignSelf: 'center', marginBottom: 8, position: 'relative', width: 100, height: 100 },
  avatar:     { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: 'rgba(255,255,255,0.9)' },
  avatarPlaceholder: { width: 100, height: 100, borderRadius: 50, alignItems: 'center', justifyContent: 'center' },
  cameraBtn: {
    position: 'absolute', bottom: 2, right: 2,
    width: 28, height: 28, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2.5, borderColor: '#fff',
  },
  avatarHint: {
    fontSize: 11.5, fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(109,40,217,0.38)', textAlign: 'center', marginBottom: 22,
  },

  // Inputs
  inputGroup:  { marginBottom: 14 },
  inputLabel:  { fontSize: 12, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#4c1d95', marginBottom: 6 },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1.5, borderColor: 'rgba(167,139,250,0.25)',
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.75)',
    paddingHorizontal: 14, height: 50,
  },
  inputFocused: {
    borderColor: '#7c3aed',
    backgroundColor: 'rgba(255,255,255,0.95)',
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.13, shadowRadius: 10, elevation: 2,
  },
  inputIconWrap: { marginRight: 9 },
  input: { flex: 1, fontSize: 15, fontFamily: 'PlusJakartaSans_400Regular', color: '#1e1b4b' },
  inputHint: { fontSize: 10.5, fontFamily: 'PlusJakartaSans_400Regular', color: 'rgba(124,58,237,0.38)', marginTop: 4 },

  // Footer
  footer: {
    paddingHorizontal: 20, paddingTop: 12, paddingBottom: 28,
    backgroundColor: 'rgba(248,246,255,0.95)',
    borderTopWidth: 1, borderTopColor: 'rgba(167,139,250,0.12)',
  },
  continueBtn:         { borderRadius: 14, overflow: 'hidden' },
  continueBtnDisabled: { opacity: 0.6 },
  continueBtnInner: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 10,
    paddingVertical: 16, borderRadius: 14,
  },
  continueBtnText: { fontSize: 16, fontFamily: 'PlusJakartaSans_700Bold', color: '#fff' },
});