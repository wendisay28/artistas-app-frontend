// src/screens/artist/profile/modals/InfoProfesionalModal.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  Modal, View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform,
  ScrollView, StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// ── Field (Optimizado para evitar parpadeos) ──────────────────────────────────
type FieldProps = {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  autoFocus?: boolean;
};

const Field: React.FC<FieldProps> = ({
  label, value, onChangeText, placeholder, icon, autoFocus,
}) => {
  const [focused, setFocused] = useState(false);
  
  return (
    <View style={f.wrapper}>
      <Text style={f.label}>{label}</Text>
      <View style={[f.box, focused && f.boxFocused]}>
        <View style={f.icon}>
          <Ionicons
            name={icon}
            size={17}
            color={focused ? '#7c3aed' : 'rgba(124,58,237,0.3)'}
          />
        </View>
        <TextInput
          style={f.input}
          value={value || ''}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="rgba(124,58,237,0.25)"
          autoFocus={autoFocus}
          onFocus={() => {
            // Log sencillo para no saturar la consola
            console.log(`🎯 BuscArt - Focus: ${label}`);
            setFocused(true);
          }}
          onBlur={() => setFocused(false)}
          underlineColorAndroid="transparent"
        />
        {(value && value.length > 0) && (
          <TouchableOpacity
            onPress={() => onChangeText('')}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="close-circle" size={16} color="rgba(124,58,237,0.3)" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

// ... Estilos f y Componente AvailabilitySelector se mantienen igual que tu versión previa ...
const f = StyleSheet.create({
  wrapper: { marginBottom: 20 },
  label: {
    fontSize: 9.5, fontFamily: 'PlusJakartaSans_600SemiBold',
    color: 'rgba(124,58,237,0.5)', letterSpacing: 0.8,
    marginBottom: 8, textTransform: 'uppercase',
  },
  box: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.75)',
    borderRadius: 14, paddingHorizontal: 14, paddingVertical: 13,
    borderWidth: 1.5, borderColor: 'rgba(167,139,250,0.25)',
  },
  boxFocused: {
    borderColor: '#7c3aed',
    backgroundColor: '#fff',
    elevation: 2,
  },
  icon:  { marginRight: 10 },
  input: {
    flex: 1, fontSize: 14.5,
    fontFamily: 'PlusJakartaSans_400Regular', color: '#1e1b4b',
    paddingVertical: Platform.OS === 'ios' ? 0 : 2, // Evita saltos en Android
  },
});

const OPTIONS = [
  { label: 'Disponible',  color: '#16a34a' },
  { label: 'Ocupado',      color: '#ef4444' },
  { label: 'Bajo pedido', color: '#d97706' },
];

const AvailabilitySelector: React.FC<{
  value: string;
  onSelect: (v: string) => void;
}> = ({ value, onSelect }) => (
  <View style={av.wrapper}>
    <Text style={av.label}>DISPONIBILIDAD</Text>
    <View style={av.row}>
      {OPTIONS.map((opt) => {
        const active = value === opt.label;
        return (
          <TouchableOpacity
            key={opt.label}
            activeOpacity={0.8}
            style={[av.pill, active && { borderColor: opt.color, backgroundColor: opt.color + '18' }]}
            onPress={() => onSelect(opt.label)}
          >
            <View style={[av.dot, { backgroundColor: opt.color }]} />
            <Text style={[av.pillText, active && { color: opt.color, fontFamily: 'PlusJakartaSans_700Bold' }]}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  </View>
);

const av = StyleSheet.create({
  wrapper: { marginBottom: 8 },
  label: {
    fontSize: 9.5, fontFamily: 'PlusJakartaSans_600SemiBold',
    color: 'rgba(124,58,237,0.5)', letterSpacing: 0.8,
    marginBottom: 12,
  },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  pill: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: 100, borderWidth: 1.5,
    borderColor: 'rgba(167,139,250,0.25)',
    backgroundColor: 'rgba(255,255,255,0.75)',
  },
  dot:      { width: 8, height: 8, borderRadius: 4, marginRight: 7 },
  pillText: {
    fontSize: 13, fontFamily: 'PlusJakartaSans_500Medium',
    color: 'rgba(109,40,217,0.45)',
  },
});

// ── Modal principal ───────────────────────────────────────────────────────────

type ModalData = {
  yearsExperience: string;
  style: string;
  responseTime: string;
  availability: string;
};

type Props = {
  visible: boolean;
  initialData?: ModalData;
  onClose: () => void;
  onSave: (data: ModalData) => void;
};

export const InfoProfesionalModal: React.FC<Props> = ({
  visible, initialData, onClose, onSave,
}) => {
  const insets = useSafeAreaInsets();
  const [data, setData] = useState(initialData || {
    yearsExperience: '',
    style: '',
    availability: 'Disponible',
    responseTime: '',
  });

  useEffect(() => {
    if (visible && initialData) {
      setData(initialData);
    }
  }, [visible, initialData]);

  const update = useCallback(
    (key: keyof ModalData) => (v: string) =>
      setData((prev) => ({ ...prev, [key]: v })),
    []
  );

  const handleSave = useCallback(() => {
    onSave(data);
  }, [data, onSave]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      statusBarTranslucent={true}
      onRequestClose={onClose}
    >
      <View style={[s.safeArea, { paddingTop: insets.top }]}>
        <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
        
        <KeyboardAvoidingView
          style={s.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
          {/* Header */}
          <View style={s.header}>
            <TouchableOpacity onPress={onClose} style={s.headerSide} activeOpacity={0.7}>
              <Text style={s.cancelText}>Cancelar</Text>
            </TouchableOpacity>

            <View style={s.headerCenter}>
              <Text style={s.title}>Info Profesional</Text>
            </View>

            <TouchableOpacity onPress={handleSave} style={s.headerSideRight} activeOpacity={0.85}>
              <LinearGradient
                colors={['#7c3aed', '#2563eb']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={s.saveBtn}
              >
                <Text style={s.saveBtnText}>Guardar</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={s.flex}
            contentContainerStyle={[
                s.content,
                { paddingBottom: insets.bottom + 100 } // Padding extra para que el teclado no tape el último campo
            ]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Field
              label="Años de experiencia"
              value={data.yearsExperience}
              onChangeText={update('yearsExperience')}
              placeholder="Ej. 8 años"
              icon="time-outline"
              autoFocus={true}
            />
            <Field
              label="Estilo artístico"
              value={data.style}
              onChangeText={update('style')}
              placeholder="Ej. Minimalista, expresionista..."
              icon="color-palette-outline"
            />
            <Field
              label="Tiempo de respuesta"
              value={data.responseTime}
              onChangeText={update('responseTime')}
              placeholder="Ej. En 2 horas"
              icon="chatbubble-ellipses-outline"
            />
            <AvailabilitySelector
              value={data.availability}
              onSelect={update('availability')}
            />
          </ScrollView>

        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const s = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#faf9ff', // El fondo que pediste
  },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(167,139,250,0.15)',
    backgroundColor: '#fff',
  },
  headerSide: { width: 90, alignItems: 'flex-start' },
  headerSideRight: { width: 90, alignItems: 'flex-end' },
  headerCenter: { flex: 1, alignItems: 'center' },
  title: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#1e1b4b',
  },
  cancelText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: 'rgba(124,58,237,0.55)',
  },
  saveBtn: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 7,
  },
  saveBtnText: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#fff',
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
});