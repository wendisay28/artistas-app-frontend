import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  visible: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

const BaseModal: React.FC<Props> = ({ visible, onClose, title, subtitle, children }) => {
  if (!visible) return null;

  return (
    <View style={s.overlay}>
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right', 'bottom']}>
        <View style={s.header}>
          <TouchableOpacity onPress={onClose} style={s.backBtn}>
            <Ionicons name="chevron-back" size={22} color="#4c1d95" />
          </TouchableOpacity>
          <View style={s.titleWrap}>
            <Text style={s.title} numberOfLines={1}>{title}</Text>
            {subtitle ? <Text style={s.subtitle}>{subtitle}</Text> : null}
          </View>
          <View style={s.backBtn} />
        </View>
        {children}
      </SafeAreaView>
    </View>
  );
};

export default BaseModal;

const s = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#fff',
    zIndex: 999,
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
});