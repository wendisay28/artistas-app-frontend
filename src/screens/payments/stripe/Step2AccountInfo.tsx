import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, TextInput,
  Animated, Easing, ScrollView,
  KeyboardAvoidingView, Platform, Pressable, Keyboard,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useStripeOnboarding } from './StripeOnboardingContext';

// ── FadeIn (Sin cambios) ──────────────────────────────────────────────────────
const FadeIn: React.FC<{ delay?: number; children: React.ReactNode; style?: any }> = ({
  delay = 0, children, style,
}) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(14)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 450, delay, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 450, delay, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, []);

  return <Animated.View style={[{ opacity, transform: [{ translateY }] }, style]}>{children}</Animated.View>;
};

// ── Segmented Progress Bar (Sin cambios) ──────────────────────────────────────
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

// ── Glass Card (Sin cambios) ──────────────────────────────────────────────────
const GlassCard: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <View style={gc.outer}>
    <View style={gc.highlight} />
    <View style={gc.inner}>{children}</View>
  </View>
);

const gc = StyleSheet.create({
  outer: {
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
    shadowColor: '#6d28d9',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 8,
    overflow: 'hidden',
  },
  highlight: { height: 1, backgroundColor: 'rgba(255,255,255,0.7)', marginHorizontal: 1 },
  inner: { padding: 18 },
});

// ── FormInput: aislado — typing solo re-renderiza este componente, nunca el padre ──
interface FormInputProps {
  inputRef: React.RefObject<TextInput>;
  iconName: any;
  placeholder: string;
  keyboardType?: any;
  autoCapitalize?: any;
  returnKeyType?: 'done' | 'next' | 'go' | 'search' | 'send';
  onSubmitEditing?: () => void;
  initialValue: string;
  onChangeText: (text: string) => void;
  onBlurText?: (finalText: string) => void;
}

const FormInput = React.memo(({
  inputRef, iconName, placeholder, keyboardType = 'default',
  autoCapitalize = 'none', returnKeyType, onSubmitEditing,
  initialValue, onChangeText, onBlurText,
}: FormInputProps) => {
  const [value, setValue] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);
  // Ref para leer el valor actual en onBlur sin que esté en deps del useCallback
  const valueRef = useRef(initialValue);

  const handleChange = useCallback((text: string) => {
    valueRef.current = text;
    setValue(text);
    onChangeText(text); // solo actualiza un ref en el padre — sin re-render del padre
  }, [onChangeText]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    onBlurText?.(valueRef.current); // notifica al padre solo al salir del campo
  }, [onBlurText]);

  return (
    <Pressable style={[s.inputWrap, isFocused && s.inputFocused]} onPress={() => inputRef.current?.focus()}>
      <View style={s.inputIcon}>
        <Ionicons name={iconName} size={16} color={isFocused ? '#7c3aed' : '#c4b5fd'} />
      </View>
      <TextInput
        ref={inputRef}
        style={s.input}
        value={value}
        onChangeText={handleChange}
        placeholder={placeholder}
        placeholderTextColor="rgba(124,58,237,0.3)"
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        returnKeyType={returnKeyType}
        onSubmitEditing={onSubmitEditing}
        onFocus={() => setIsFocused(true)}
        onBlur={handleBlur}
      />
    </Pressable>
  );
});

// ── Screen ────────────────────────────────────────────────────────────────────
const Step2AccountInfo = () => {
  const { state, goNextStep, updateAccountData, setLoading } = useStripeOnboarding();

  // Refs para texto: onChangeText solo actualiza estos refs — CERO re-renders del padre al escribir
  const nameVal = useRef(state.accountData.holderName || '');
  const emailVal = useRef(state.accountData.email || '');
  const phoneVal = useRef(state.accountData.phone || '');

  // Estado mínimo: solo para habilitar/deshabilitar el botón
  // Se actualiza al salir de cada campo (blur), no en cada tecla
  const [nameValid, setNameValid] = useState(!!(state.accountData.holderName?.trim()));
  const [emailValid, setEmailValid] = useState(!!(state.accountData.email?.trim()));

  const valid = nameValid && emailValid && !!state.accountData.accountType && !!state.accountData.acceptTerms;

  const nameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);

  // Solo actualizan refs — sin setState — sin re-render del padre mientras se escribe
  const handleNameChange = useCallback((text: string) => { nameVal.current = text; }, []);
  const handleEmailChange = useCallback((text: string) => { emailVal.current = text; }, []);
  const handlePhoneChange = useCallback((text: string) => { phoneVal.current = text; }, []);

  // Al salir del campo: 1 re-render para actualizar validez del botón
  const handleNameBlur = useCallback((text: string) => setNameValid(!!text.trim()), []);
  const handleEmailBlur = useCallback((text: string) => setEmailValid(!!text.trim()), []);

  const handleContinue = () => {
    const isValid = !!nameVal.current.trim() && !!emailVal.current.trim()
      && !!state.accountData.accountType && !!state.accountData.acceptTerms;
    if (!isValid) return;

    setLoading(true);
    updateAccountData({
      holderName: nameVal.current,
      email:      emailVal.current,
      phone:      phoneVal.current,
    });
    setTimeout(() => { setLoading(false); goNextStep(); }, 1500);
  };

  return (
    <View style={s.root}>
      <LinearGradient colors={['#f8f6ff', '#f0edff', '#eef2ff']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
      <View style={s.colorBlotch} />
      <View style={s.colorBlotch2} />

      <FadeIn delay={0}>
        <View style={s.header}>
          <Text style={s.stepCounter}>Paso <Text style={s.stepCounterBold}>2</Text> de 4</Text>
        </View>
      </FadeIn>

      <FadeIn delay={50}>
        <View style={s.barWrap}>
          <SegmentedBar step={2} total={4} />
          <Text style={s.stepLabel}>Datos de la cuenta</Text>
        </View>
      </FadeIn>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={10}>
        <ScrollView 
          style={{ flex: 1 }} 
          contentContainerStyle={s.scroll} 
          keyboardShouldPersistTaps="handled" 
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={false} // Evita bugs de scroll en inputs
        >
          <FadeIn delay={120}>
            <GlassCard>
              <View style={s.titleBlock}>
                <Text style={s.stepTitle}>Identidad</Text>
                <Text style={s.stepSub}>Información para vinculación con Stripe.</Text>
              </View>

              <View style={s.inputGroup}>
                <Text style={s.inputLabel}>Tipo de cuenta</Text>
                <View style={s.typeRow}>
                  {(['individual', 'company'] as const).map((t) => {
                    const active = state.accountData.accountType === t;
                    return (
                      <TouchableOpacity key={t} onPress={() => updateAccountData({ accountType: t })} activeOpacity={0.8} style={[s.typeBtn, active && s.typeBtnActive]}>
                        {active ? (
                          <LinearGradient colors={['#7c3aed', '#2563eb']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={s.typeBtnGradient}>
                            <Ionicons name={t === 'individual' ? 'person-outline' : 'business-outline'} size={14} color="#fff" />
                            <Text style={[s.typeBtnText, s.typeBtnTextActive]}>{t === 'individual' ? 'Personal' : 'Empresa'}</Text>
                          </LinearGradient>
                        ) : (
                          <View style={s.typeBtnInner}>
                            <Ionicons name={t === 'individual' ? 'person-outline' : 'business-outline'} size={14} color="#7c3aed" />
                            <Text style={s.typeBtnText}>{t === 'individual' ? 'Personal' : 'Empresa'}</Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              <View style={s.inputGroup}>
                <Text style={s.inputLabel}>Nombre del titular *</Text>
                <FormInput
                  inputRef={nameRef}
                  iconName="person-outline"
                  placeholder="Nombre completo"
                  autoCapitalize="words"
                  returnKeyType="next"
                  onSubmitEditing={() => emailRef.current?.focus()}
                  initialValue={state.accountData.holderName || ''}
                  onChangeText={handleNameChange}
                  onBlurText={handleNameBlur}
                />
              </View>

              <View style={s.inputGroup}>
                <Text style={s.inputLabel}>Correo electrónico *</Text>
                <FormInput
                  inputRef={emailRef}
                  iconName="mail-outline"
                  placeholder="correo@ejemplo.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  returnKeyType="next"
                  onSubmitEditing={() => phoneRef.current?.focus()}
                  initialValue={state.accountData.email || ''}
                  onChangeText={handleEmailChange}
                  onBlurText={handleEmailBlur}
                />
              </View>

              <View style={s.inputGroup}>
                <Text style={s.inputLabel}>Teléfono <Text style={s.optional}>(opcional)</Text></Text>
                <FormInput
                  inputRef={phoneRef}
                  iconName="call-outline"
                  placeholder="+57 300..."
                  keyboardType="phone-pad"
                  returnKeyType="done"
                  onSubmitEditing={() => Keyboard.dismiss()}
                  initialValue={state.accountData.phone || ''}
                  onChangeText={handlePhoneChange}
                />
              </View>

              <TouchableOpacity
                onPress={() => {
                  Keyboard.dismiss();
                  updateAccountData({ acceptTerms: !state.accountData.acceptTerms });
                }}
                activeOpacity={0.85}
                style={[s.termsRow, state.accountData.acceptTerms && s.termsRowActive]}
              >
                <View style={[s.checkbox, state.accountData.acceptTerms && s.checkboxOn]}>
                  {state.accountData.acceptTerms && <Ionicons name="checkmark" size={12} color="#fff" />}
                </View>
                <Text style={s.termsText}>Acepto los <Text style={s.termsLink}>términos de Stripe</Text> y custodia de fondos.</Text>
              </TouchableOpacity>
            </GlassCard>
          </FadeIn>
        </ScrollView>

        <View style={s.footer}>
          <TouchableOpacity onPress={handleContinue} disabled={!valid || state.isLoading} activeOpacity={0.85} style={s.nextBtn}>
            <View style={s.nextBtnInner}>
              <Text style={s.nextBtnText}>{state.isLoading ? 'Procesando...' : 'Vincular Stripe'}</Text>
              <Ionicons name="arrow-forward" size={18} color="#7c3aed" />
            </View>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Step2AccountInfo;

// ESTILOS (Sin cambios en ningún valor)
const s = StyleSheet.create({
  root: { flex: 1 },
  colorBlotch: { position: 'absolute', width: 300, height: 300, borderRadius: 150, backgroundColor: 'rgba(167,139,250,0.12)', top: -60, right: -60 },
  colorBlotch2: { position: 'absolute', width: 220, height: 220, borderRadius: 110, backgroundColor: 'rgba(99,102,241,0.15)', bottom: 50, left: -40 },
  header: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 8 },
  stepCounter: { fontSize: 11, fontFamily: 'PlusJakartaSans_400Regular', color: 'rgba(109,40,217,0.4)' },
  stepCounterBold: { fontFamily: 'PlusJakartaSans_700Bold', color: '#7c3aed' },
  barWrap: { gap: 4, paddingBottom: 0 },
  stepLabel: { fontSize: 10, fontFamily: 'PlusJakartaSans_700Bold', color: 'rgba(124,58,237,0.5)', paddingHorizontal: 20, letterSpacing: 0.5, textTransform: 'uppercase' },
  scroll: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 80 },
  titleBlock: { marginBottom: 14 },
  stepTitle: { fontSize: 20, fontFamily: 'PlusJakartaSans_800ExtraBold', color: '#1e1b4b', marginBottom: 2 },
  stepSub: { fontSize: 12, fontFamily: 'PlusJakartaSans_400Regular', color: 'rgba(109,40,217,0.5)' },
  typeRow: { flexDirection: 'row', gap: 8, marginTop: 4 },
  typeBtn: { flex: 1, borderRadius: 12, overflow: 'hidden', borderWidth: 1.5, borderColor: 'rgba(167,139,250,0.2)' },
  typeBtnActive: { borderColor: 'transparent' },
  typeBtnGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10 },
  typeBtnInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, backgroundColor: 'rgba(255,255,255,0.5)' },
  typeBtnText: { fontSize: 13, fontFamily: 'PlusJakartaSans_700Bold', color: '#7c3aed' },
  typeBtnTextActive: { color: '#fff' },
  inputGroup: { marginBottom: 12 },
  inputLabel: { fontSize: 11, fontFamily: 'PlusJakartaSans_700Bold', color: '#4c1d95', marginBottom: 5, marginLeft: 2 },
  optional: { fontFamily: 'PlusJakartaSans_400Regular', color: 'rgba(124,58,237,0.4)', fontSize: 10 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: 'rgba(167,139,250,0.2)', borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.7)', paddingHorizontal: 12, height: 48 },
  inputFocused: { borderColor: '#7c3aed', backgroundColor: '#fff' },
  inputIcon: { marginRight: 8 },
  input: { flex: 1, fontSize: 14, fontFamily: 'PlusJakartaSans_400Regular', color: '#1e1b4b' },
  termsRow: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, marginTop: 4, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(167,139,250,0.15)', backgroundColor: 'rgba(255,255,255,0.4)' },
  termsRowActive: { backgroundColor: 'rgba(245,243,255,0.6)', borderColor: 'rgba(124,58,237,0.2)' },
  checkbox: { width: 18, height: 18, borderRadius: 5, borderWidth: 1.5, borderColor: 'rgba(167,139,250,0.4)', alignItems: 'center', justifyContent: 'center' },
  checkboxOn: { backgroundColor: '#7c3aed', borderColor: '#7c3aed' },
  termsText: { flex: 1, fontSize: 11, fontFamily: 'PlusJakartaSans_400Regular', color: 'rgba(30,27,75,0.6)', lineHeight: 16 },
  termsLink: { fontFamily: 'PlusJakartaSans_700Bold', color: '#7c3aed' },
  footer: { paddingHorizontal: 16, paddingVertical: 12, position: 'absolute', bottom: -10, left: 0, right: 0 },
  nextBtn: { borderRadius: 12, overflow: 'hidden', marginBottom: 12, alignSelf: 'center', width: '85%' },
  nextBtnInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 14, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', borderWidth: 1, borderColor: 'rgba(124,58,237,0.3)', shadowColor: '#7c3aed', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 4 },
  nextBtnText: { fontSize: 16, fontFamily: 'PlusJakartaSans_700Bold', color: '#7c3aed' },
});