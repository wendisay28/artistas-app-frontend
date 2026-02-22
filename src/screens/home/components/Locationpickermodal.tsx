// src/components/shared/LocationPickerModal.tsx
// ─── Modal de selección de ubicación ─────────────────────────────────────────

import React from 'react';
import {
  Modal, View, Text, TouchableOpacity,
  Pressable, ActivityIndicator, StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export type LocationPickerModalProps = {
  visible:     boolean;
  isDetecting: boolean;
  onDetectGPS: () => void;
  onClose:     () => void;
};

export const LocationPickerModal: React.FC<LocationPickerModalProps> = ({
  visible, isDetecting, onDetectGPS, onClose,
}) => (
  <Modal
    visible={visible}
    transparent
    animationType="slide"
    onRequestClose={onClose}
    statusBarTranslucent
  >
    <Pressable style={s.overlay} onPress={onClose} />
    <View style={s.sheet}>
      <View style={s.handle} />

      <View style={s.iconWrap}>
        <LinearGradient
          colors={['#7c3aed', '#2563eb']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={s.iconGrad}
        >
          <Ionicons name="location" size={22} color="#fff" />
        </LinearGradient>
      </View>

      <Text style={s.title}>¿Dónde estás?</Text>
      <Text style={s.subtitle}>
        Detectamos artistas, eventos y espacios cerca de ti
      </Text>

      <TouchableOpacity
        style={s.gpsBtn}
        onPress={onDetectGPS}
        activeOpacity={0.78}
        disabled={isDetecting}
      >
        <LinearGradient
          colors={['#7c3aed', '#2563eb']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          style={s.gpsBtnInner}
        >
          {isDetecting
            ? <ActivityIndicator size={16} color="#fff" />
            : <Ionicons name="locate" size={18} color="#fff" />}
          <Text style={s.gpsBtnText}>
            {isDetecting ? 'Detectando…' : 'Usar mi ubicación actual'}
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity style={s.cancelBtn} onPress={onClose} activeOpacity={0.7}>
        <Text style={s.cancelText}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  </Modal>
);

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingBottom: 44,
    paddingTop: 16,
    alignItems: 'center',
  },
  handle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: '#e5e7eb',
    marginBottom: 28,
  },
  iconWrap: {
    marginBottom: 16,
  },
  iconGrad: {
    width: 52, height: 52, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#1e1b4b',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13.5,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#6b7280',
    marginBottom: 28,
    textAlign: 'center',
    lineHeight: 20,
  },
  gpsBtn: {
    borderRadius: 14,
    overflow: 'hidden',
    width: '100%',
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  gpsBtnInner: {
    flexDirection: 'row', alignItems: 'center',
    gap: 10, paddingVertical: 16, paddingHorizontal: 20,
    justifyContent: 'center',
  },
  gpsBtnText: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#fff',
  },
  cancelBtn: {
    marginTop: 14,
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  cancelText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: '#9ca3af',
  },
});