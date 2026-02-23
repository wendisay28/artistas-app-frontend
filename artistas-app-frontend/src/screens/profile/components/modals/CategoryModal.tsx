// src/screens/artist/profile/modals/CategoryModal.tsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Modal, View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform,
  ScrollView, StatusBar
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { ArtistCategorySelector } from '../shared/CategorySelector';

interface CategoryData {
  category?: any;
  specialty: string;
  niche: string;
}

export type { CategoryData };

interface Props {
  visible: boolean;
  initialData?: CategoryData;
  onClose: () => void;
  onSave: (data: CategoryData) => void;
}

// ── Field reutilizable ────────────────────────────────────────────────────────
const Field: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  autoFocus?: boolean;
}> = ({ label, value, onChange, placeholder, icon, autoFocus }) => {
  const [focused, setFocused] = useState(false);
  return (
    <View style={fi.wrapper}>
      <Text style={fi.label}>{label}</Text>
      <View style={[fi.box, focused && fi.boxFocused]}>
        <View style={fi.icon}>
          <Ionicons
            name={icon}
            size={17}
            color={focused ? '#7c3aed' : 'rgba(124,58,237,0.3)'}
          />
        </View>
        <TextInput
          style={fi.input}
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor="rgba(124,58,237,0.25)"
          returnKeyType="done"
          autoFocus={autoFocus}
          onFocus={() => {
            console.log(`🎯 BuscArt - Focus en campo: ${label}`);
            setFocused(true);
          }}
          onBlur={() => setFocused(false)}
        />
        {value.length > 0 && (
          <TouchableOpacity
            onPress={() => onChange('')}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="close-circle" size={16} color="rgba(124,58,237,0.3)" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

// ... (Estilos de Field fi se mantienen abajo en la sección de StyleSheet)

// ── Divider con label ─────────────────────────────────────────────────────────
const SectionDivider: React.FC<{ label: string }> = ({ label }) => (
  <View style={sd.wrap}>
    <View style={sd.line} />
    <Text style={sd.label}>{label}</Text>
    <View style={sd.line} />
  </View>
);

// ... (Estilos de Divider sd se mantienen abajo)

// ── Modal principal ───────────────────────────────────────────────────────────
export const CategoryModal = ({ visible, initialData = { specialty: '', niche: '' }, onClose, onSave }: Props) => {
  const insets = useSafeAreaInsets();
  const [category, setCategory]   = useState<any>(initialData?.category);
  const [specialty, setSpecialty] = useState(initialData?.specialty || '');
  const [niche, setNiche]         = useState(initialData?.niche || '');

  useEffect(() => {
    if (visible && initialData) {
      console.log("📂 BuscArt - Cargando CategoryModal");
      setCategory(initialData.category);
      setSpecialty(initialData.specialty || '');
      setNiche(initialData.niche || '');
    }
  }, [visible, initialData]);

  const handleSave = useCallback(() => {
    console.log("💾 BuscArt - Guardando categoría:", { category, specialty, niche });
    onSave({ category, specialty, niche });
  }, [category, specialty, niche, onSave]);

  const categorySelection = useMemo(() => category || undefined, [category]);
  const handleCategoryChange = useCallback((sel: any) => setCategory(sel), []);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      statusBarTranslucent={true}
      onRequestClose={onClose}
    >
      <View style={[s.safeArea, { paddingTop: insets.top || 20 }]}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        
        <KeyboardAvoidingView
          style={s.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          {/* Header estilo Instagram */}
          <View style={s.header}>
            <TouchableOpacity onPress={onClose} style={s.headerSide} activeOpacity={0.7}>
              <Text style={s.cancelText}>Cancelar</Text>
            </TouchableOpacity>

            <View style={s.headerCenter}>
              <Text style={s.title}>Categoría Artística</Text>
            </View>

            <TouchableOpacity onPress={handleSave} style={s.headerSide} activeOpacity={0.85}>
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
                { paddingBottom: insets.bottom + 20, flexGrow: 1 }
            ]}
            keyboardShouldPersistTaps="always"
            showsVerticalScrollIndicator={false}
          >
            <Text style={s.sectionLabel}>SELECCIONA TU CATEGORÍA</Text>

            <ArtistCategorySelector
              selection={categorySelection}
              onChange={handleCategoryChange}
            />

            <SectionDivider label="DETALLES DE NICHO" />

            <Field
              label="Especialidad"
              value={specialty}
              onChange={setSpecialty}
              placeholder="ej. Fotografía de Producto"
              icon="ribbon-outline"
              autoFocus={true}
            />

            <Field
              label="Nicho de mercado"
              value={niche}
              onChange={setNiche}
              placeholder="ej. Marcas de Joyería"
              icon="telescope-outline"
            />

            {/* Espaciador flexible para evitar el vacío feo abajo */}
            <View style={{ flex: 1 }} />
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

// ── Estilos ──────────────────────────────────────────────────────────────────

const fi = StyleSheet.create({
  wrapper: { marginBottom: 18 },
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
    backgroundColor: 'rgba(255,255,255,0.95)',
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.12, shadowRadius: 10, elevation: 2,
  },
  icon:  { marginRight: 10 },
  input: {
    flex: 1, fontSize: 14.5,
    fontFamily: 'PlusJakartaSans_400Regular', color: '#1e1b4b',
  },
});

const sd = StyleSheet.create({
  wrap:  { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 22 },
  line:  { flex: 1, height: 1, backgroundColor: 'rgba(167,139,250,0.15)' },
  label: {
    fontSize: 9.5, fontFamily: 'PlusJakartaSans_600SemiBold',
    color: 'rgba(124,58,237,0.4)', letterSpacing: 0.8,
  },
});

const s = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#faf9ff',
  },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(167,139,250,0.15)',
    backgroundColor: 'rgba(255,255,255,0.97)',
  },
  headerSide: {
    width: 90,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#1e1b4b',
    letterSpacing: -0.2,
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
    alignSelf: 'flex-end',
  },
  saveBtnText: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#fff',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  sectionLabel: {
    fontSize: 9.5,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: 'rgba(124,58,237,0.5)',
    letterSpacing: 0.8,
    marginBottom: 14,
  },
});