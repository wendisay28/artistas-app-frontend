import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BaseModal from './BaseModal';

interface Props { visible: boolean; onClose: () => void; }

const SUPPORT_OPTIONS = [
  {
    icon: 'globe-outline' as const,
    color: '#7c3aed',
    label: 'Centro de ayuda Stripe',
    sub: 'Artículos y guías oficiales',
    url: 'https://support.stripe.com',
  },
  {
    icon: 'chatbubble-ellipses-outline' as const,
    color: '#2563eb',
    label: 'Chat con soporte',
    sub: 'Habla con un agente de Stripe',
    url: 'https://support.stripe.com/contact',
  },
  {
    icon: 'mail-outline' as const,
    color: '#059669',
    label: 'Soporte por email',
    sub: 'support@stripe.com',
    url: 'mailto:support@stripe.com',
  },
] as const;

const SupportModal: React.FC<Props> = ({ visible, onClose }) => {
  const handleOpen = async (url: string) => {
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) Linking.openURL(url);
    else Alert.alert('Error', 'No se pudo abrir el enlace.');
  };

  return (
    <BaseModal visible={visible} onClose={onClose} title="Soporte Stripe" subtitle="Ayuda con tu cuenta de pagos">
      <View style={s.body}>
        {SUPPORT_OPTIONS.map((opt, i) => (
          <TouchableOpacity key={i} onPress={() => handleOpen(opt.url)} activeOpacity={0.75} style={s.row}>
            <View style={[s.iconWrap, { backgroundColor: opt.color + '12' }]}>
              <Ionicons name={opt.icon} size={20} color={opt.color} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.rowLabel}>{opt.label}</Text>
              <Text style={s.rowSub}>{opt.sub}</Text>
            </View>
            <Ionicons name="open-outline" size={14} color="rgba(124,58,237,0.35)" />
          </TouchableOpacity>
        ))}
        <View style={s.note}>
          <Text style={s.noteText}>Stripe ofrece soporte 24/7 en inglés y español.</Text>
        </View>
      </View>
    </BaseModal>
  );
};

export default SupportModal;

const s = StyleSheet.create({
  body:     { paddingHorizontal: 20, paddingTop: 14, gap: 10 },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    padding: 14, backgroundColor: '#fafafa',
    borderRadius: 14, borderWidth: 1, borderColor: 'rgba(124,58,237,0.09)',
  },
  iconWrap: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  rowLabel: { fontSize: 13, fontFamily: 'PlusJakartaSans_700Bold', color: '#1e1b4b' },
  rowSub:   { fontSize: 11, fontFamily: 'PlusJakartaSans_400Regular', color: '#94a3b8', marginTop: 1 },
  note:     { backgroundColor: 'rgba(124,58,237,0.04)', borderRadius: 10, padding: 10, alignItems: 'center' },
  noteText: { fontSize: 11.5, fontFamily: 'PlusJakartaSans_400Regular', color: 'rgba(109,40,217,0.5)' },
});
