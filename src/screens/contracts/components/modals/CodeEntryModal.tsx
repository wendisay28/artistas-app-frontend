// CodeEntryModal.tsx
// Modal para ingresar el código de llegada / salida del servicio presencial.
// Acepta código numérico manual. (Escáner QR se puede activar con expo-camera en el futuro.)

import React, { useState, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../../../theme/colors';
import { useThemeStore } from '../../../../store/themeStore';

interface CodeEntryModalProps {
  visible: boolean;
  type: 'arrival' | 'departure';
  onClose: () => void;
  onConfirm: (code: string) => void;
}

// Código demo: cualquier código de 4+ dígitos es válido en dev
const VALID_CODE_MIN_LENGTH = 4;

export default function CodeEntryModal({ visible, type, onClose, onConfirm }: CodeEntryModalProps) {
  const { isDark } = useThemeStore();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<TextInput>(null);

  const isArrival = type === 'arrival';
  const title = isArrival ? 'Código de llegada' : 'Código de salida';
  const subtitle = isArrival
    ? 'Ingresa el código que te dio el cliente al llegar al lugar.'
    : 'Ingresa el código de cierre para finalizar el servicio.';
  const icon = isArrival ? 'qr-code-outline' : 'checkmark-done-circle-outline';
  const gradient: [string, string] = isArrival ? ['#8b5cf6', '#6366f1'] : ['#10b981', '#059669'];

  const handleConfirm = async () => {
    if (code.trim().length < VALID_CODE_MIN_LENGTH) {
      setError(`El código debe tener al menos ${VALID_CODE_MIN_LENGTH} caracteres.`);
      return;
    }
    setError('');
    setLoading(true);
    // Simular validación (en producción: llamar al backend)
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    onConfirm(code.trim());
    setCode('');
  };

  const handleClose = () => {
    setCode('');
    setError('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.sheet}>
          {/* Icono */}
          <View style={styles.iconWrap}>
            <LinearGradient colors={gradient} style={styles.iconGradient}>
              <Ionicons name={icon} size={30} color="#fff" />
            </LinearGradient>
          </View>

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>

          {/* Input */}
          <TextInput
            ref={inputRef}
            style={[styles.codeInput, error ? styles.codeInputError : null]}
            value={code}
            onChangeText={(t) => { setCode(t); setError(''); }}
            placeholder="Ej: 4872"
            placeholderTextColor="#9ca3af"
            keyboardType="number-pad"
            maxLength={10}
            autoFocus
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {/* Acciones */}
          <TouchableOpacity
            onPress={handleConfirm}
            disabled={loading}
            style={styles.confirmBtn}
            activeOpacity={0.85}
          >
            {isDark ? (
              <View style={[styles.confirmGradient, styles.confirmBtnDark]}>
                {loading
                  ? <ActivityIndicator color="#fff" />
                  : <>
                      <Ionicons name="checkmark-circle-outline" size={18} color="#fff" />
                      <Text style={styles.confirmText}>Validar código</Text>
                    </>
                }
              </View>
            ) : (
              <LinearGradient colors={gradient} style={styles.confirmGradient}>
                {loading
                  ? <ActivityIndicator color="#fff" />
                  : <>
                      <Ionicons name="checkmark-circle-outline" size={18} color="#fff" />
                      <Text style={styles.confirmText}>Validar código</Text>
                    </>
                }
              </LinearGradient>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={handleClose} style={styles.cancelBtn}>
            <Text style={styles.cancelText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 28,
    alignItems: 'center',
    gap: 12,
    paddingBottom: 36,
  },
  iconWrap: { marginBottom: 4 },
  iconGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#111827',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  codeInput: {
    width: '100%',
    height: 56,
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    borderRadius: 14,
    paddingHorizontal: 20,
    fontSize: 22,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#111827',
    textAlign: 'center',
    letterSpacing: 8,
    marginTop: 4,
  },
  codeInputError: { borderColor: '#ef4444' },
  errorText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: '#ef4444',
    alignSelf: 'flex-start',
  },
  confirmBtn: {
    width: '100%',
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
  confirmBtnDark: {
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.28)',
    borderRadius: 14,
  },
  confirmText: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#fff',
  },
  cancelBtn: { paddingVertical: 8 },
  cancelText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: '#6b7280',
  },
});
