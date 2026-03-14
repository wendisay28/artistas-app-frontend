// ServiceTypeModal.tsx
// Bottom-sheet para seleccionar el tipo de servicio al aceptar una oferta urgente.

import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import type { ServiceType } from '../../../../types/hiring';

interface ServiceTypeModalProps {
  visible: boolean;
  offerTitle: string;
  onClose: () => void;
  onConfirm: (serviceType: ServiceType) => void;
}

const SERVICE_OPTIONS: Array<{
  type: ServiceType;
  label: string;
  description: string;
  icon: string;
  color: string;
  bg: string;
}> = [
  {
    type: 'presencial',
    label: 'Presencial',
    description: 'Vas al lugar del cliente. Registro de llegada y salida con código QR.',
    icon: 'walk-outline',
    color: '#7c3aed',
    bg: '#f5f3ff',
  },
  {
    type: 'hibrido',
    label: 'Híbrido',
    description: 'Visita presencial + entrega de material digital posterior (1 revisión).',
    icon: 'git-merge-outline',
    color: '#2563eb',
    bg: '#eff6ff',
  },
  {
    type: 'digital',
    label: 'Digital',
    description: 'Trabajo completamente remoto. Solo entrega de archivo o link (1 revisión).',
    icon: 'cloud-outline',
    color: '#f59e0b',
    bg: '#fffbeb',
  },
];

export default function ServiceTypeModal({
  visible,
  offerTitle,
  onClose,
  onConfirm,
}: ServiceTypeModalProps) {
  const [selected, setSelected] = useState<ServiceType | null>(null);

  const handleConfirm = () => {
    if (!selected) return;
    onConfirm(selected);
    setSelected(null);
  };

  const handleClose = () => {
    setSelected(null);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <Pressable style={styles.overlay} onPress={handleClose}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          {/* Handle */}
          <View style={styles.handle} />

          <Text style={styles.title}>¿Cómo prestarás el servicio?</Text>
          <Text style={styles.sub} numberOfLines={2}>{offerTitle}</Text>

          {/* Opciones */}
          <View style={styles.options}>
            {SERVICE_OPTIONS.map((opt) => {
              const isSelected = selected === opt.type;
              return (
                <TouchableOpacity
                  key={opt.type}
                  style={[
                    styles.option,
                    isSelected && { borderColor: opt.color, backgroundColor: opt.bg },
                  ]}
                  onPress={() => setSelected(opt.type)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.optionIcon, { backgroundColor: opt.bg }]}>
                    <Ionicons name={opt.icon as any} size={22} color={opt.color} />
                  </View>
                  <View style={styles.optionBody}>
                    <Text style={[styles.optionLabel, isSelected && { color: opt.color }]}>
                      {opt.label}
                    </Text>
                    <Text style={styles.optionDesc}>{opt.description}</Text>
                  </View>
                  {isSelected && (
                    <Ionicons name="checkmark-circle" size={22} color={opt.color} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Botón confirmar */}
          <TouchableOpacity
            style={[styles.confirmBtn, !selected && { opacity: 0.4 }]}
            onPress={handleConfirm}
            disabled={!selected}
            activeOpacity={0.85}
          >
            <LinearGradient colors={['#10b981', '#059669']} style={styles.confirmGradient}>
              <Ionicons name="checkmark-circle-outline" size={18} color="#fff" />
              <Text style={styles.confirmText}>Aceptar oferta</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleClose} style={styles.cancelBtn}>
            <Text style={styles.cancelText}>Cancelar</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    gap: 12,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#e5e7eb',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 19,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#111827',
    textAlign: 'center',
  },
  sub: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 4,
  },
  options: { gap: 10 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    borderRadius: 14,
    padding: 14,
  },
  optionIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionBody: { flex: 1, gap: 3 },
  optionLabel: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#111827',
  },
  optionDesc: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#6b7280',
    lineHeight: 17,
  },
  confirmBtn: {
    borderRadius: 14,
    overflow: 'hidden',
    marginTop: 4,
  },
  confirmGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 15,
  },
  confirmText: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#fff',
  },
  cancelBtn: { paddingVertical: 6, alignItems: 'center' },
  cancelText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: '#6b7280',
  },
});
