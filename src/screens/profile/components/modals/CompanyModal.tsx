// ─────────────────────────────────────────────────────────────────────────────
// CompanyModal.tsx — Convertir perfil artista a perfil de empresa
// Campos adicionales de empresa sin reemplazar los del artista
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius } from '../../../../theme';
import type { Artist } from '../types';

export type CompanyData = {
  companyName: string;
  companyDescription: string;
  taxId: string;
};

type Props = {
  visible: boolean;
  artist: Artist;
  onClose: () => void;
  onSave: (data: CompanyData) => void;
};

export const CompanyModal: React.FC<Props> = ({ visible, artist, onClose, onSave }) => {
  const [companyName,        setCompanyName]        = useState('');
  const [companyDescription, setCompanyDescription] = useState('');
  const [taxId,              setTaxId]              = useState('');
  const [confirmed,          setConfirmed]          = useState(false);

  const isConverting = artist.userType !== 'company';

  useEffect(() => {
    if (!visible) return;
    setCompanyName(artist.companyName ?? '');
    setCompanyDescription(artist.companyDescription ?? '');
    setTaxId('');
    setConfirmed(false);
  }, [visible, artist]);

  const handleSave = () => {
    if (!companyName.trim()) {
      Alert.alert('Campo requerido', 'El nombre de la empresa es obligatorio.');
      return;
    }
    if (isConverting && !confirmed) {
      Alert.alert(
        'Confirmar conversión',
        'Tu perfil se configurará como perfil de empresa. Tus datos como artista se mantienen. ¿Continuar?',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Confirmar',
            onPress: () => {
              setConfirmed(true);
              onSave({ companyName: companyName.trim(), companyDescription: companyDescription.trim(), taxId: taxId.trim() });
              onClose();
            },
          },
        ]
      );
      return;
    }
    onSave({ companyName: companyName.trim(), companyDescription: companyDescription.trim(), taxId: taxId.trim() });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent statusBarTranslucent>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={st.kav}>
        <Pressable style={st.overlay} onPress={onClose} />

        <View style={st.sheet}>
          <View style={st.handle} />

          {/* Header */}
          <View style={st.header}>
            <TouchableOpacity onPress={onClose} style={st.headerBtn}>
              <Text style={st.cancelText}>Cancelar</Text>
            </TouchableOpacity>
            <Text style={st.title}>
              {isConverting ? 'Convertir a empresa' : 'Datos de empresa'}
            </Text>
            <TouchableOpacity onPress={handleSave} style={st.headerBtn}>
              <Text style={st.saveText}>
                {isConverting ? 'Convertir' : 'Guardar'}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={st.content}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Info banner */}
            {isConverting && (
              <View style={st.infoBanner}>
                <Ionicons name="information-circle-outline" size={20} color="#2563EB" />
                <Text style={st.infoText}>
                  Al convertir a empresa, tus datos como artista se mantienen intactos.
                  Solo agregas información adicional de tu negocio.
                </Text>
              </View>
            )}

            {/* Nombre legal */}
            <Text style={st.sectionLabel}>DATOS DE LA EMPRESA</Text>

            <View style={st.fieldWrap}>
              <View style={st.labelRow}>
                <Ionicons name="business-outline" size={14} color={Colors.primary} />
                <Text style={st.label}>Nombre de la empresa</Text>
              </View>
              <View style={st.inputWrap}>
                <TextInput
                  style={st.input}
                  value={companyName}
                  onChangeText={setCompanyName}
                  placeholder="Nombre legal o razón social"
                  placeholderTextColor={Colors.text}
                  maxLength={100}
                />
              </View>
            </View>

            <View style={st.fieldWrap}>
              <View style={st.labelRow}>
                <Ionicons name="document-text-outline" size={14} color={Colors.primary} />
                <Text style={st.label}>Descripción empresarial</Text>
              </View>
              <View style={[st.inputWrap, st.inputMulti]}>
                <TextInput
                  style={[st.input, { height: 90, textAlignVertical: 'top' }]}
                  value={companyDescription}
                  onChangeText={setCompanyDescription}
                  placeholder="¿A qué se dedica tu empresa? ¿Qué servicios ofrece?"
                  placeholderTextColor={Colors.text}
                  multiline
                  maxLength={500}
                />
              </View>
            </View>

            <View style={st.fieldWrap}>
              <View style={st.labelRow}>
                <Ionicons name="card-outline" size={14} color={Colors.primary} />
                <Text style={st.label}>NIT / RUT / ID fiscal</Text>
                <Text style={st.optional}>(Opcional)</Text>
              </View>
              <View style={st.inputWrap}>
                <TextInput
                  style={st.input}
                  value={taxId}
                  onChangeText={setTaxId}
                  placeholder="ej. 900.123.456-7"
                  placeholderTextColor={Colors.text}
                  keyboardType="default"
                  maxLength={30}
                />
              </View>
            </View>

            <View style={{ height: 30 }} />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const st = StyleSheet.create({
  kav:     { flex: 1, justifyContent: 'flex-end' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.45)' },
  sheet: {
    backgroundColor: Colors.bg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    overflow: 'hidden',
  },
  handle: {
    width: 36, height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 10, marginBottom: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerBtn:  { minWidth: 70 },
  title:      { fontSize: 16, fontFamily: 'PlusJakartaSans_700Bold', color: Colors.text },
  cancelText: { fontSize: 15, fontFamily: 'PlusJakartaSans_400Regular', color: Colors.text },
  saveText:   { fontSize: 15, fontFamily: 'PlusJakartaSans_700Bold', color: Colors.primary, textAlign: 'right' },
  content:    { padding: 20, gap: 12 },

  infoBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#EFF6FF',
    borderRadius: Radius.md,
    padding: 14,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    marginBottom: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#1E40AF',
    lineHeight: 19,
  },

  sectionLabel: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: Colors.text,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  fieldWrap: { gap: 6, marginBottom: 4 },
  labelRow:  { flexDirection: 'row', alignItems: 'center', gap: 6 },
  label:     { flex: 1, fontSize: 13, fontFamily: 'PlusJakartaSans_600SemiBold', color: Colors.text },
  optional:  { fontSize: 11, fontFamily: 'PlusJakartaSans_400Regular', color: Colors.text },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    backgroundColor: Colors.surface,
    paddingHorizontal: 12,
    minHeight: 44,
  },
  inputMulti: { alignItems: 'flex-start', paddingVertical: 10 },
  input:      { flex: 1, fontSize: 14, fontFamily: 'PlusJakartaSans_400Regular', color: Colors.text },
});
