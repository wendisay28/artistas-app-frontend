import React, { memo, useState } from 'react';
import {
  View, Text, TouchableOpacity, TextInput, Image,
  ScrollView, KeyboardAvoidingView, Platform, StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getServiceNamePlaceholder } from '../../../../utils/serviceHelpers';

// ── Types ─────────────────────────────────────────────────────────────────────

type Props = {
  localImageUri: string;
  name: string; setName: (v: string) => void;
  description: string; setDesc: (v: string) => void;
  price: string; setPrice: (v: string) => void;
  duration: string; setDuration: (v: string) => void;
  errors: Record<string, string>;
  isEditing: boolean;
  loading: boolean;
  artistRoleName: string;
  unit: string;
  onChangeImage: () => void;
  onBack: () => void;
  onNext: () => void;
};

// ── Step indicator ────────────────────────────────────────────────────────────

const StepBar = ({ current }: { current: 2 | 3 }) => (
  <View style={s.stepBar}>
    {(['Foto', 'Info', 'Entrega'] as const).map((label, idx) => {
      const n = idx + 1;
      const done = n < current;
      const active = n === current;
      return (
        <React.Fragment key={n}>
          <View style={s.stepItem}>
            <View style={[s.stepCircle, done && s.stepDone, active && s.stepActive]}>
              {done
                ? <Ionicons name="checkmark" size={12} color="#7c3aed" />
                : <Text style={[s.stepNum, active && { color: '#fff' }]}>{n}</Text>
              }
            </View>
            <Text style={[s.stepLabel, active && { color: '#7c3aed' }]}>{label}</Text>
          </View>
          {idx < 2 && (
            <View style={[s.stepLine, done && { backgroundColor: 'rgba(124,58,237,0.3)' }]} />
          )}
        </React.Fragment>
      );
    })}
  </View>
);

// ── Field ─────────────────────────────────────────────────────────────────────

const Field = memo(({ label, icon, value, onChangeText, placeholder, multiline, maxLength, hint, keyboardType = 'default', required, error }: any) => {
  const [focused, setFocused] = useState(false);
  return (
    <View style={f.wrap}>
      {!!label && (
        <Text style={f.label}>{label}{required && <Text style={f.req}> *</Text>}</Text>
      )}
      <View style={[f.box, focused && f.boxFocused, multiline && f.boxMulti, !!error && f.boxError]}>
        {!!icon && (
          <Ionicons name={icon} size={17} color={focused ? '#7c3aed' : 'rgba(124,58,237,0.3)'} style={{ marginRight: 10 }} />
        )}
        <TextInput
          style={[f.input, multiline && f.inputMulti]}
          value={value}
          onChangeText={onChangeText}
          onBlur={() => setFocused(false)}
          onFocus={() => setFocused(true)}
          placeholder={placeholder}
          placeholderTextColor="rgba(124,58,237,0.25)"
          multiline={multiline}
          maxLength={maxLength}
          keyboardType={keyboardType}
          textAlignVertical={multiline ? 'top' : 'center'}
        />
        {!!maxLength && <Text style={f.counter}>{value.length}/{maxLength}</Text>}
        {!multiline && !!value && (
          <TouchableOpacity onPress={() => onChangeText('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="close-circle" size={16} color="rgba(124,58,237,0.3)" />
          </TouchableOpacity>
        )}
      </View>
      {!!hint && !error && <Text style={f.hint}>{hint}</Text>}
      {!!error && <Text style={[f.hint, { color: '#ef4444', opacity: 1 }]}>{error}</Text>}
    </View>
  );
});

// ── Main ─────────────────────────────────────────────────────────────────────

export const ServiceStep2: React.FC<Props> = ({
  localImageUri, name, setName, description, setDesc,
  price, setPrice, duration, setDuration,
  errors, isEditing, loading, artistRoleName, unit,
  onChangeImage, onBack, onNext,
}) => {
  const insets = useSafeAreaInsets();
  const canContinue = !!name.trim();

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      {/* Header */}
      <View style={[s.header, { paddingTop: insets.top }]}>
        <TouchableOpacity onPress={onBack} style={s.headerSide} activeOpacity={0.7}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
            {!isEditing && <Ionicons name="chevron-back" size={18} color="rgba(124,58,237,0.55)" />}
            <Text style={s.headerBtn}>{isEditing ? 'Cancelar' : 'Atrás'}</Text>
          </View>
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={s.headerTitle}>{isEditing ? 'Editar Servicio' : 'Nuevo Servicio'}</Text>
        </View>
        <TouchableOpacity
          onPress={onNext}
          style={[s.headerSide, { alignItems: 'flex-end' }]}
          activeOpacity={0.85}
          disabled={!canContinue || loading}
        >
          <LinearGradient
            colors={canContinue ? ['#7c3aed', '#2563eb'] : ['#e2e8f0', '#e2e8f0']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={s.nextBtn}
          >
            <Text style={[s.nextBtnText, !canContinue && { color: '#94a3b8' }]}>Siguiente</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[s.content, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <StepBar current={2} />

        {/* Image header */}
        <TouchableOpacity onPress={onChangeImage} activeOpacity={0.85} style={[s.imageHeader, !localImageUri && s.imageHeaderEmpty]}>
          {localImageUri ? (
            <>
              <Image source={{ uri: localImageUri }} style={s.imagePreview} resizeMode="cover" />
              <View style={s.imageOverlay}>
                <View style={s.imageEditBadge}>
                  <Ionicons name="camera-outline" size={13} color="#fff" />
                  <Text style={s.imageEditText}>Cambiar foto</Text>
                </View>
              </View>
            </>
          ) : (
            <LinearGradient colors={['#f5f3ff', '#ede9fe']} style={s.imagePlaceholder}>
              <Ionicons name="camera-outline" size={20} color="#7c3aed" />
              <Text style={s.imagePlaceholderText}>Agregar foto del servicio</Text>
            </LinearGradient>
          )}
        </TouchableOpacity>

        {/* Role badge */}
        {!!artistRoleName && (
          <View style={s.roleBadge}>
            <Ionicons name="sparkles" size={13} color="#7c3aed" />
            <Text style={s.roleText}>Para: <Text style={{ color: '#7c3aed' }}>{artistRoleName}</Text></Text>
          </View>
        )}

        <Field
          label="Nombre del servicio" icon="brush-outline"
          value={name} onChangeText={setName}
          placeholder={getServiceNamePlaceholder(unit, artistRoleName)}
          required error={errors.name}
        />
        <Field
          label="Descripción" icon="reader-outline"
          value={description} onChangeText={setDesc}
          multiline maxLength={300}
          placeholder="Ej: Sesión de 2 horas, edición incluida..."
        />
        <Field
          label="Precio base" icon="cash-outline"
          value={price}
          onChangeText={(t: string) => setPrice(t.replace(/[^\d]/g, ''))}
          keyboardType="numeric"
          placeholder="Ej: 150000"
          hint={price ? `COP ${new Intl.NumberFormat('es-CO').format(parseInt(price, 10))}` : undefined}
        />
        <Field
          label="Duración" icon="time-outline"
          value={duration} onChangeText={setDuration}
          placeholder="Ej: 1 hora, 30 minutos"
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// ── Field styles ──────────────────────────────────────────────────────────────

const f = StyleSheet.create({
  wrap: { marginBottom: 18 },
  label: { fontSize: 9.5, fontFamily: 'PlusJakartaSans_600SemiBold', color: 'rgba(124,58,237,0.5)', letterSpacing: 0.8, marginBottom: 8, textTransform: 'uppercase' },
  req: { color: '#ef4444' },
  box: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.75)', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 13, borderWidth: 1.5, borderColor: 'rgba(167,139,250,0.25)', minHeight: 50 },
  boxFocused: { borderColor: '#7c3aed', backgroundColor: '#fff', shadowColor: '#7c3aed', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.12, shadowRadius: 10, elevation: 2 },
  boxMulti: { height: 120, alignItems: 'flex-start', paddingVertical: 12 },
  boxError: { borderColor: '#ef4444' },
  input: { flex: 1, fontSize: 14.5, fontFamily: 'PlusJakartaSans_400Regular', color: '#1e1b4b', minHeight: 24 },
  inputMulti: { paddingTop: 0 },
  counter: { fontSize: 10, color: '#94a3b8', alignSelf: 'flex-end', marginBottom: 5 },
  hint: { fontSize: 11, color: '#7c3aed', marginTop: 6, fontFamily: 'PlusJakartaSans_500Medium', opacity: 0.75 },
});

// ── Screen styles ─────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: 'rgba(167,139,250,0.15)',
    backgroundColor: 'rgba(255,255,255,0.97)',
  },
  headerSide: { width: 90 },
  headerBtn: { fontSize: 14, fontFamily: 'PlusJakartaSans_500Medium', color: 'rgba(124,58,237,0.55)' },
  headerTitle: { fontSize: 16, fontFamily: 'PlusJakartaSans_700Bold', color: '#1e1b4b' },
  nextBtn: { borderRadius: 20, paddingHorizontal: 16, paddingVertical: 7 },
  nextBtnText: { fontSize: 13, fontFamily: 'PlusJakartaSans_700Bold', color: '#fff' },
  content: { paddingHorizontal: 20, paddingTop: 24 },

  stepBar: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  stepItem: { alignItems: 'center', gap: 4 },
  stepCircle: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#f1f5f9', alignItems: 'center', justifyContent: 'center' },
  stepDone: { backgroundColor: '#f5f3ff' },
  stepActive: { backgroundColor: '#7c3aed' },
  stepNum: { fontSize: 11, fontFamily: 'PlusJakartaSans_700Bold', color: '#94a3b8' },
  stepLabel: { fontSize: 10, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#94a3b8' },
  stepLine: { flex: 1, height: 1.5, backgroundColor: '#e2e8f0', marginBottom: 16, marginHorizontal: 6 },

  imageHeader: { marginBottom: 20, borderRadius: 16, overflow: 'hidden', height: 140 },
  imageHeaderEmpty: { height: 64 },
  imagePreview: { width: '100%', height: '100%' },
  imageOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.2)', alignItems: 'flex-end', justifyContent: 'flex-end', padding: 10 },
  imageEditBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(0,0,0,0.45)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  imageEditText: { color: '#fff', fontSize: 11, fontFamily: 'PlusJakartaSans_600SemiBold' },
  imagePlaceholder: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  imagePlaceholderText: { fontSize: 13, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#7c3aed' },

  roleBadge: { flexDirection: 'row', alignItems: 'center', gap: 7, backgroundColor: '#f5f3ff', padding: 10, borderRadius: 12, marginBottom: 20, borderWidth: 1, borderColor: '#ddd6fe', alignSelf: 'flex-start' },
  roleText: { fontSize: 12, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#4b5563' },
});
