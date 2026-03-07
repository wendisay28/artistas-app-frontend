// src/screens/artist/PortalStripeModal.tsx
import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Modal, TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

interface PortalStripeModalProps {
  visible: boolean;
  onClose: () => void;
  holderName: string;
  onHolderNameChange: (v: string) => void;
  email: string;
  onEmailChange: (v: string) => void;
  canConnect: boolean;
  connecting: boolean;
  onConnect: () => void;
}

export const PortalStripeModal: React.FC<PortalStripeModalProps> = ({
  visible, onClose,
  holderName, onHolderNameChange,
  email, onEmailChange,
  canConnect, connecting, onConnect,
}) => (
  <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
    <SafeAreaView style={sm.safe}>
      <View style={sm.header}>
        <TouchableOpacity onPress={onClose} style={sm.close} activeOpacity={0.7}>
          <Ionicons name="close" size={20} color="#4c1d95" />
        </TouchableOpacity>
        <View style={sm.headerCenter}>
          <Ionicons name="card" size={18} color="#635bff" />
          <Text style={sm.title}>Método de cobro</Text>
        </View>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={sm.content} showsVerticalScrollIndicator={false}>
        <View style={sm.stripeBadge}>
          <Ionicons name="card-outline" size={18} color="#fff" />
          <Text style={sm.stripeBadgeTxt}>Powered by Stripe</Text>
        </View>

        <View style={sm.benefits}>
          <Text style={sm.benefitsTitle}>¿Por qué usar Stripe?</Text>
          {[
            '✅ Pagos seguros y garantizados',
            '✅ Depósitos directos en tu banco',
            '✅ Protección contra fraudes',
            '✅ Soporte 24/7',
            '✅ Sin comisiones ocultas',
          ].map((benefit, index) => (
            <Text key={index} style={sm.benefitTxt}>{benefit}</Text>
          ))}
        </View>

        <View style={sm.requirements}>
          <Text style={sm.reqTitle}>Requisitos para conectar:</Text>
          {[
            '📄 Cédula o documento de identidad',
            '🏦 Cuenta bancaria a tu nombre',
            '📧 Correo electrónico verificado',
            '📱 Número de teléfono',
          ].map((req, index) => (
            <Text key={index} style={sm.reqTxt}>{req}</Text>
          ))}
        </View>

        <Text style={sm.label}>Nombre del titular de la cuenta</Text>
        <TextInput
          style={sm.input}
          value={holderName}
          onChangeText={onHolderNameChange}
          placeholder="Ej: María López"
          placeholderTextColor="rgba(109,40,217,0.3)"
          autoCapitalize="words"
        />

        <Text style={sm.label}>Correo electrónico</Text>
        <TextInput
          style={sm.input}
          value={email}
          onChangeText={onEmailChange}
          placeholder="tu@correo.com"
          placeholderTextColor="rgba(109,40,217,0.3)"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={sm.label}>Tipo de cuenta</Text>
        <View style={sm.accountTypes}>
          {['individual', 'empresa'].map(type => (
            <TouchableOpacity
              key={type}
              style={sm.accountType}
              activeOpacity={0.8}
            >
              <Text style={sm.accountTypeTxt}>{type === 'individual' ? 'Individual' : 'Empresa'}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={sm.footer}>
        <TouchableOpacity
          onPress={onConnect}
          disabled={!canConnect}
          style={[sm.saveBtn, !canConnect && sm.saveBtnDisabled]}
        >
          <LinearGradient
            colors={canConnect ? ['#635bff', '#4f46e5'] : ['#d1d5db', '#9ca3af']}
            style={sm.saveBtnInner}
          >
            <Ionicons name={connecting ? 'hourglass' : 'card'} size={18} color="#fff" />
            <Text style={sm.saveTxt}>
              {connecting ? 'Conectando...' : 'Conectar cuenta Stripe'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  </Modal>
);

const sm = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16,
    paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#f3e8ff', gap: 8,
  },
  close: {
    width: 36, height: 36, borderRadius: 10, backgroundColor: '#faf5ff',
    alignItems: 'center', justifyContent: 'center',
  },
  headerCenter: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  title: { fontSize: 16, fontFamily: 'PlusJakartaSans_700Bold', color: '#4c1d95' },
  content: { padding: 20, paddingBottom: 40 },
  stripeBadge: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: '#635bff', borderRadius: 14, paddingVertical: 12, marginBottom: 20,
  },
  stripeBadgeTxt: { fontSize: 14, fontFamily: 'PlusJakartaSans_700Bold', color: '#fff' },
  benefits: {
    backgroundColor: '#f0f9ff', borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: '#bae6fd', marginBottom: 20,
  },
  benefitsTitle: {
    fontSize: 13, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#0c4a6e', marginBottom: 10,
  },
  benefitTxt: {
    fontSize: 12, fontFamily: 'PlusJakartaSans_400Regular', color: '#0c4a6e', lineHeight: 18,
  },
  requirements: {
    backgroundColor: '#fef3c7', borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: '#fde68a', marginBottom: 20,
  },
  reqTitle: {
    fontSize: 13, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#92400e', marginBottom: 10,
  },
  reqTxt: {
    fontSize: 12, fontFamily: 'PlusJakartaSans_400Regular', color: '#92400e', lineHeight: 18,
  },
  label: { fontSize: 13, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#374151', marginBottom: 6, marginTop: 14 },
  input: {
    backgroundColor: '#faf5ff', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 14, fontFamily: 'PlusJakartaSans_400Regular', color: '#1e1b4b',
    borderWidth: 1.5, borderColor: 'rgba(124,58,237,0.2)',
  },
  accountTypes: { flexDirection: 'row', gap: 8 },
  accountType: {
    flex: 1, paddingVertical: 12, borderRadius: 12,
    backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#7c3aed',
    alignItems: 'center',
  },
  accountTypeTxt: {
    fontSize: 13, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#7c3aed',
  },
  footer: { paddingHorizontal: 20, paddingVertical: 16, borderTopWidth: 1, borderTopColor: '#f3e8ff' },
  saveBtn: { borderRadius: 14, overflow: 'hidden' },
  saveBtnDisabled: { opacity: 0.5 },
  saveBtnInner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 16,
  },
  saveTxt: { fontSize: 15, fontFamily: 'PlusJakartaSans_700Bold', color: '#fff' },
});
