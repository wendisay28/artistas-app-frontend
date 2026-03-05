import React, { memo, useState } from 'react';
import {
  View, Text, TouchableOpacity, TextInput, Switch,
  ScrollView, KeyboardAvoidingView, Platform, StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getHintByUnit, getPackageTypes, UnitOption } from '../../../../utils/serviceHelpers';

// ── Types ─────────────────────────────────────────────────────────────────────

type Props = {
  packageType: 'simple' | 'pack' | 'weekly' | 'monthly';
  setPackageType: (v: 'simple' | 'pack' | 'weekly' | 'monthly') => void;
  unit: string;
  setUnit: (v: string) => void;
  setIcon: (v: string) => void;
  finalUnitOptions: UnitOption[];
  includedCount: string;
  setIncludedCount: (v: string) => void;
  deliveryDays: string;
  setDeliveryDays: (v: string) => void;
  deliveryNotApplies: boolean;
  setDeliveryNotApplies: (v: boolean) => void;
  loading: boolean;
  onBack: () => void;
  onSave: () => void;
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

const Field = memo(({ label, icon, value, onChangeText, keyboardType = 'default', hint }: any) => {
  const [focused, setFocused] = useState(false);
  return (
    <View style={f.wrap}>
      {!!label && <Text style={f.label}>{label}</Text>}
      <View style={[f.box, focused && f.boxFocused]}>
        {!!icon && <Ionicons name={icon} size={17} color={focused ? '#7c3aed' : 'rgba(124,58,237,0.3)'} style={{ marginRight: 10 }} />}
        <TextInput
          style={f.input}
          value={value}
          onChangeText={onChangeText}
          onBlur={() => setFocused(false)}
          onFocus={() => setFocused(true)}
          placeholder="—"
          placeholderTextColor="rgba(124,58,237,0.25)"
          keyboardType={keyboardType}
        />
      </View>
      {!!hint && <Text style={f.hint}>{hint}</Text>}
    </View>
  );
});

// ── Main ─────────────────────────────────────────────────────────────────────

export const ServiceStep3: React.FC<Props> = ({
  packageType, setPackageType,
  unit, setUnit, setIcon, finalUnitOptions,
  includedCount, setIncludedCount,
  deliveryDays, setDeliveryDays,
  deliveryNotApplies, setDeliveryNotApplies,
  loading, onBack, onSave,
}) => {
  const insets = useSafeAreaInsets();
  const packageTypes = getPackageTypes();
  const hints = getHintByUnit(unit);

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      {/* Header */}
      <View style={[s.header, { paddingTop: insets.top }]}>
        <TouchableOpacity onPress={onBack} style={s.headerSide} activeOpacity={0.7}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
            <Ionicons name="chevron-back" size={18} color="rgba(124,58,237,0.55)" />
            <Text style={s.headerBtn}>Atrás</Text>
          </View>
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={s.headerTitle}>Detalles</Text>
        </View>
        <TouchableOpacity
          onPress={onSave}
          style={[s.headerSide, { alignItems: 'flex-end' }]}
          activeOpacity={0.85}
          disabled={loading}
        >
          <LinearGradient
            colors={loading ? ['#c4b5fd', '#c4b5fd'] : ['#7c3aed', '#2563eb']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={s.saveBtn}
          >
            <Text style={s.saveBtnText}>{loading ? 'Guardando...' : 'Guardar'}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[s.content, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <StepBar current={3} />

        {/* Modalidad */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>MODALIDAD DE TRABAJO</Text>
          <View style={s.sectionLine} />
        </View>

        <View style={s.packageGrid}>
          {packageTypes.map(p => (
            <TouchableOpacity
              key={p.id}
              style={[s.packageCard, packageType === p.id && s.packageCardSel]}
              onPress={() => setPackageType(p.id as any)}
            >
              <Ionicons name={p.icon as any} size={18} color={packageType === p.id ? '#7c3aed' : '#a78bfa'} />
              <View style={{ flex: 1 }}>
                <Text style={[s.packageLabel, packageType === p.id && { color: '#1e1b4b' }]}>{p.label}</Text>
                <Text style={s.packageDesc}>{p.desc}</Text>
              </View>
              {packageType === p.id && <Ionicons name="checkmark-circle" size={16} color="#7c3aed" />}
            </TouchableOpacity>
          ))}
        </View>

        {/* Unidades */}
        <View style={[s.sectionHeader, { marginTop: 22 }]}>
          <Text style={s.sectionTitle}>ENTREGA Y UNIDADES</Text>
          <View style={s.sectionLine} />
        </View>

        <View style={s.chips}>
          {finalUnitOptions.map(opt => (
            <TouchableOpacity
              key={opt.id}
              style={[s.chip, unit === opt.id && s.chipActive]}
              onPress={() => { setUnit(opt.id); setIcon(opt.icon); }}
            >
              <Text style={[s.chipText, unit === opt.id && { color: '#fff' }]}>{opt.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Field
          label="Cantidad incluida" icon="copy-outline"
          value={includedCount} onChangeText={setIncludedCount}
          keyboardType="number-pad" hint={hints.includedCount}
        />

        {!deliveryNotApplies && (
          <Field
            label="Tiempo estimado (Días)" icon="time-outline"
            value={deliveryDays} onChangeText={setDeliveryDays}
            keyboardType="number-pad" hint={hints.deliveryDays}
          />
        )}

        <View style={s.toggle}>
          <Text style={s.toggleLabel}>Entrega inmediata / No aplica tiempo</Text>
          <Switch
            value={deliveryNotApplies}
            onValueChange={setDeliveryNotApplies}
            trackColor={{ false: '#eee', true: '#ddd' }}
            thumbColor={deliveryNotApplies ? '#7c3aed' : '#f4f4f4'}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// ── Field styles ──────────────────────────────────────────────────────────────

const f = StyleSheet.create({
  wrap: { marginBottom: 18 },
  label: { fontSize: 9.5, fontFamily: 'PlusJakartaSans_600SemiBold', color: 'rgba(124,58,237,0.5)', letterSpacing: 0.8, marginBottom: 8, textTransform: 'uppercase' },
  box: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.75)', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 13, borderWidth: 1.5, borderColor: 'rgba(167,139,250,0.25)', minHeight: 50 },
  boxFocused: { borderColor: '#7c3aed', backgroundColor: '#fff', shadowColor: '#7c3aed', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.12, shadowRadius: 10, elevation: 2 },
  input: { flex: 1, fontSize: 14.5, fontFamily: 'PlusJakartaSans_400Regular', color: '#1e1b4b', minHeight: 24 },
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
  saveBtn: { borderRadius: 20, paddingHorizontal: 16, paddingVertical: 7 },
  saveBtnText: { fontSize: 13, fontFamily: 'PlusJakartaSans_700Bold', color: '#fff' },
  content: { paddingHorizontal: 20, paddingTop: 24 },

  stepBar: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  stepItem: { alignItems: 'center', gap: 4 },
  stepCircle: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#f1f5f9', alignItems: 'center', justifyContent: 'center' },
  stepDone: { backgroundColor: '#f5f3ff' },
  stepActive: { backgroundColor: '#7c3aed' },
  stepNum: { fontSize: 11, fontFamily: 'PlusJakartaSans_700Bold', color: '#94a3b8' },
  stepLabel: { fontSize: 10, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#94a3b8' },
  stepLine: { flex: 1, height: 1.5, backgroundColor: '#e2e8f0', marginBottom: 16, marginHorizontal: 6 },

  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  sectionTitle: { fontSize: 9.5, fontFamily: 'PlusJakartaSans_600SemiBold', color: 'rgba(124,58,237,0.4)', letterSpacing: 0.8 },
  sectionLine: { flex: 1, height: 1, backgroundColor: 'rgba(167,139,250,0.15)' },

  packageGrid: { gap: 10 },
  packageCard: { flexDirection: 'row', alignItems: 'center', gap: 15, padding: 15, borderRadius: 16, borderWidth: 1.5, borderColor: 'rgba(167,139,250,0.15)', backgroundColor: '#fff' },
  packageCardSel: { borderColor: '#7c3aed', backgroundColor: '#f5f3ff' },
  packageLabel: { fontSize: 14, fontFamily: 'PlusJakartaSans_700Bold', color: '#475569' },
  packageDesc: { fontSize: 11, color: '#94a3b8', marginTop: 2, fontFamily: 'PlusJakartaSans_400Regular' },

  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 18 },
  chip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0', backgroundColor: '#fff' },
  chipActive: { backgroundColor: '#7c3aed', borderColor: '#7c3aed' },
  chipText: { fontSize: 12, color: '#64748b', fontFamily: 'PlusJakartaSans_600SemiBold' },

  toggle: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f8fafc', padding: 15, borderRadius: 14, marginTop: 10 },
  toggleLabel: { fontSize: 13, color: '#334155', fontFamily: 'PlusJakartaSans_600SemiBold', flex: 1, marginRight: 10 },
});
