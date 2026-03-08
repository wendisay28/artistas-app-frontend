import React, { useState, useRef } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, 
  StyleSheet, Alert, KeyboardAvoidingView, 
  Platform, ScrollView 
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

interface Props { visible: boolean; onClose: () => void; }

const BankModal: React.FC<Props> = ({ visible, onClose }) => {
  const insets = useSafeAreaInsets();
  const [bank, setBank] = useState('');
  const [account, setAccount] = useState('');
  const [routing, setRouting] = useState('');
  const [type, setType] = useState('Ahorros');

  // --- REFS PARA NAVEGACIÓN ---
  const accountInputRef = useRef<TextInput>(null);
  const routingInputRef = useRef<TextInput>(null);

  const handleSave = () => {
    if (!bank.trim() || !account.trim()) {
      Alert.alert('Faltan datos', 'La logística de pagos requiere banco y cuenta válidos.'); 
      return;
    }
    Alert.alert('Éxito', 'Infraestructura de pagos actualizada correctamente.');
    onClose();
  };

  if (!visible) return null;

  return (
    <View style={s.overlay}>
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right', 'bottom']}>
        {/* Header */}
        <View style={s.header}>
          <TouchableOpacity onPress={onClose} style={s.backBtn}>
            <Ionicons name="chevron-back" size={22} color="#4c1d95" />
          </TouchableOpacity>
          <View style={s.titleWrap}>
            <Text style={s.title}>Configuración de Pagos</Text>
            <Text style={s.subtitle}>¿Dónde quieres recibir tus ingresos?</Text>
          </View>
          <View style={s.backBtn} />
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView 
            contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 20 }]}
            showsVerticalScrollIndicator={false}
          >
            {/* Mensaje de seguridad */}
            <View style={s.infoBox}>
              <Ionicons name="shield-checkmark-outline" size={16} color="#059669" />
              <Text style={s.infoText}>
                BuscArt encripta tus datos bancarios. Los pagos se procesan de forma segura bajo estándares bancarios.
              </Text>
            </View>

            {/* Tarjeta con glass effect */}
            <View style={s.glassCard}>
              <View style={s.glassReflection} />

              {/* Selector de Tipo de Cuenta */}
              <View style={s.typeRow}>
                {['Ahorros', 'Corriente'].map((t) => (
                  <TouchableOpacity 
                    key={t} 
                    style={[s.typeBtn, type === t && s.typeBtnActive]} 
                    onPress={() => setType(t)}
                  >
                    <Text style={[s.typeBtnText, type === t && s.typeBtnTextActive]}>{t}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Inputs con Iconos */}
              <View style={s.form}>
                <View style={s.field}>
                  <Text style={s.label}>Institución Bancaria</Text>
                  <View style={s.inputWrapper}>
                    <View style={s.icon}>
                      <Ionicons name="business-outline" size={18} color="#7c3aed" />
                    </View>
                    <TextInput
                      style={s.input} value={bank} onChangeText={setBank}
                      placeholder="Ej: Bancolombia, Nequi..."
                      placeholderTextColor="#94a3b8"
                      onSubmitEditing={() => accountInputRef.current?.focus()}
                      returnKeyType="next"
                    />
                  </View>
                </View>

                <View style={s.field}>
                  <Text style={s.label}>Número de Cuenta</Text>
                  <View style={s.inputWrapper}>
                    <View style={s.icon}>
                      <Ionicons name="card-outline" size={18} color="#7c3aed" />
                    </View>
                    <TextInput
                      ref={accountInputRef}
                      style={s.input} value={account} onChangeText={setAccount}
                      placeholder="000-000000-00"
                      keyboardType="numeric"
                      placeholderTextColor="#94a3b8"
                      onSubmitEditing={() => routingInputRef.current?.focus()}
                      returnKeyType="next"
                    />
                  </View>
                </View>

                <View style={s.field}>
                  <Text style={s.label}>NIT / Cédula del Titular</Text>
                  <View style={s.inputWrapper}>
                    <View style={s.icon}>
                      <Ionicons name="id-card-outline" size={18} color="#7c3aed" />
                    </View>
                    <TextInput
                      ref={routingInputRef}
                      style={s.input} value={routing} onChangeText={setRouting}
                      placeholder="Para transferencias interbancarias"
                      keyboardType="numeric"
                      placeholderTextColor="#94a3b8"
                      onSubmitEditing={handleSave}
                      returnKeyType="done"
                    />
                  </View>
                </View>
              </View>
            </View>

            <TouchableOpacity onPress={handleSave} style={s.glassBtn} activeOpacity={0.8}>
              <View style={s.glassBtnReflection} />
              <Text style={s.glassBtnText}>Vincular Cuenta</Text>
              <Ionicons name="checkmark" size={18} color="#7c3aed" />
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

export default BankModal;

const s = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#fff',
    zIndex: 999,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: 'rgba(139,92,246,0.1)',
    backgroundColor: '#fff',
  },
  backBtn: {
    width: 38, height: 38, borderRadius: 12,
    backgroundColor: '#faf5ff',
    alignItems: 'center', justifyContent: 'center',
  },
  titleWrap: { flex: 1, alignItems: 'center', paddingHorizontal: 8 },
  title:    { fontSize: 16, fontFamily: 'PlusJakartaSans_800ExtraBold', color: '#1e1b4b' },
  subtitle: { fontSize: 11, fontFamily: 'PlusJakartaSans_400Regular', color: 'rgba(109,40,217,0.45)', marginTop: 1 },
  
  scroll: { paddingHorizontal: 24, paddingTop: 20 },
  
  infoBox: { 
    flexDirection: 'row', gap: 10, backgroundColor: '#f0fdf4', 
    padding: 14, borderRadius: 12, marginBottom: 20,
    borderWidth: 1, borderColor: '#dcfce7'
  },
  infoText: { flex: 1, fontSize: 12, color: '#166534', lineHeight: 18 },
  
  glassCard: {
    padding: 24, borderRadius: 28, backgroundColor: 'rgba(255,255,255,0.85)',
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.95)', 
    shadowColor: '#a78bfa', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3, shadowRadius: 16, elevation: 5,
  },
  glassReflection: { 
    height: 1, backgroundColor: 'rgba(255,255,255,0.7)', 
    marginHorizontal: 1, position: 'absolute', top: 0, left: 0, right: 0
  },
  
  typeRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  typeBtn: { 
    flex: 1, paddingVertical: 10, borderRadius: 10, 
    backgroundColor: '#f1f5f9', alignItems: 'center',
    borderWidth: 1, borderColor: '#e2e8f0'
  },
  typeBtnActive: { backgroundColor: '#7c3aed', borderColor: '#7c3aed' },
  typeBtnText: { fontSize: 13, fontWeight: '600', color: '#64748b' },
  typeBtnTextActive: { color: '#fff' },
  
  form: { gap: 20 },
  field: { gap: 8 },
  label: { fontSize: 12, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#4c1d95', marginLeft: 4 },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1.5, borderColor: 'rgba(167,139,250,0.25)',
    borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.75)',
    paddingHorizontal: 14, height: 50,
  },
  icon: { marginRight: 9 },
  input: { flex: 1, fontSize: 15, fontFamily: 'PlusJakartaSans_400Regular', color: '#1e1b4b' },

  glassBtn: {
    backgroundColor: 'rgba(167,139,250,0.15)',
    borderRadius: 20,
    paddingVertical: 16, paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center',
    marginTop: 20, marginBottom: 20, gap: 8,
    borderWidth: 2, borderColor: 'rgba(167,139,250,0.3)',
    shadowColor: '#a78bfa', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25, shadowRadius: 12, elevation: 6,
    position: 'relative',
    overflow: 'hidden',
  },
  glassBtnReflection: { 
    height: 1, backgroundColor: 'rgba(255,255,255,0.6)', 
    position: 'absolute', top: 0, left: 0, right: 0
  },
  glassBtnText: { fontSize: 15, fontWeight: '700', color: '#7c3aed' },
});