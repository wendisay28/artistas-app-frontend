import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Alert, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BaseModal from './BaseModal';
import { useProfileStore } from '../../../../../store/profileStore';
import { auth } from '../../../../../services/firebase/config';
import { stripeService } from '../../../../../services/api/stripe.service';

interface Props { visible: boolean; onClose: () => void; }

const EditAccountModal: React.FC<Props> = ({ visible, onClose }) => {
  const { artistData } = useProfileStore();
  const [fullName, setFullName] = useState('');
  const [email,    setEmail]    = useState('');
  const [phone,    setPhone]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const emailRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);

  useEffect(() => {
    if (visible) {
      setFullName(artistData?.name ?? '');
      setEmail(auth.currentUser?.email ?? '');
      setPhone('');
    }
  }, [visible]);

  const handleSave = async () => {
    if (!fullName.trim()) { Alert.alert('Campo requerido', 'Ingresa tu nombre completo.'); return; }
    setLoading(true);
    try {
      await stripeService.updateAccount({ holderName: fullName, email: email.trim() || undefined, phone: phone.trim() || undefined });
      Alert.alert('Guardado', 'Información de contacto actualizada.');
      onClose();
    } catch {
      Alert.alert('Error', 'No se pudo actualizar. Verifica tu conexión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseModal visible={visible} onClose={onClose} title="Información de Contacto" subtitle="Configura cómo te contactarán los clientes">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

          <View style={s.infoBox}>
            <Ionicons name="shield-checkmark-outline" size={16} color="#059669" />
            <Text style={s.infoText}>Esta información es vital para la logística de contratación en BuscArt.</Text>
          </View>

          <View style={s.glassCard}>
            <View style={s.glassReflection} />

            <View style={s.field}>
              <Text style={s.label}>Nombre Completo</Text>
              <View style={s.inputWrapper}>
                <View style={s.inputIcon}><Ionicons name="person-outline" size={20} color="#7c3aed" /></View>
                <TextInput style={s.input} placeholder="Tu nombre completo" placeholderTextColor="#94a3b8" value={fullName} onChangeText={setFullName} onSubmitEditing={() => emailRef.current?.focus()} returnKeyType="next" />
              </View>
            </View>

            <View style={s.field}>
              <Text style={s.label}>Correo Electrónico</Text>
              <View style={s.inputWrapper}>
                <View style={s.inputIcon}><Ionicons name="mail-outline" size={20} color="#7c3aed" /></View>
                <TextInput ref={emailRef} style={s.input} placeholder="ejemplo@buscart.com" placeholderTextColor="#94a3b8" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" onSubmitEditing={() => phoneRef.current?.focus()} returnKeyType="next" />
              </View>
            </View>

            <View style={s.field}>
              <Text style={s.label}>Teléfono / WhatsApp</Text>
              <View style={s.inputWrapper}>
                <View style={s.inputIcon}><Ionicons name="logo-whatsapp" size={20} color="#7c3aed" /></View>
                <TextInput ref={phoneRef} style={s.input} placeholder="+57 300 000 0000" placeholderTextColor="#94a3b8" value={phone} onChangeText={setPhone} keyboardType="phone-pad" returnKeyType="done" />
              </View>
            </View>
          </View>

          <TouchableOpacity style={[s.glassBtn, loading && { opacity: 0.6 }]} onPress={handleSave} activeOpacity={0.8} disabled={loading}>
            <View style={s.glassBtnReflection} />
            {loading
              ? <ActivityIndicator size={18} color="#7c3aed" />
              : <>
                  <Text style={s.glassBtnText}>Actualizar Perfil</Text>
                  <Ionicons name="arrow-forward" size={18} color="#7c3aed" />
                </>
            }
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </BaseModal>
  );
};

export default EditAccountModal;

const s = StyleSheet.create({
  scroll: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 40 },
  infoBox: { flexDirection: 'row', gap: 10, backgroundColor: '#f0fdf4', padding: 14, borderRadius: 12, marginBottom: 20, borderWidth: 1, borderColor: '#dcfce7' },
  infoText: { flex: 1, fontSize: 12, color: '#166534', lineHeight: 18 },
  glassCard: { padding: 24, borderRadius: 32, backgroundColor: 'rgba(255,255,255,0.8)', borderWidth: 2, borderColor: 'rgba(255,255,255,0.95)', shadowColor: '#a78bfa', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 10 },
  glassReflection: { height: 1, backgroundColor: 'rgba(255,255,255,0.8)', position: 'absolute', top: 0, left: 0, right: 0 },
  field: { gap: 8, marginBottom: 20 },
  label: { fontSize: 13, fontWeight: '700', color: '#4c1d95', marginLeft: 4 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', borderRadius: 18, backgroundColor: '#ffffff', paddingHorizontal: 16, height: 60, borderWidth: 1.5, borderColor: '#f1f5f9', shadowColor: '#4c1d95', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 1 },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, fontSize: 15, color: '#1e1b4b', fontWeight: '500' },
  glassBtn: { backgroundColor: 'rgba(167,139,250,0.15)', borderRadius: 20, paddingVertical: 16, paddingHorizontal: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 20, marginBottom: 20, gap: 8, borderWidth: 2, borderColor: 'rgba(167,139,250,0.3)', shadowColor: '#a78bfa', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.25, shadowRadius: 12, elevation: 6, position: 'relative', overflow: 'hidden' },
  glassBtnReflection: { height: 1, backgroundColor: 'rgba(255,255,255,0.6)', position: 'absolute', top: 0, left: 0, right: 0 },
  glassBtnText: { fontSize: 15, fontWeight: '700', color: '#7c3aed' },
});
