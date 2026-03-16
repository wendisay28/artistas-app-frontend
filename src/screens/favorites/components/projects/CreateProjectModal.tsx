import React, { useState, useEffect, useCallback } from 'react';
import {
  Modal, View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform,
  ScrollView, Pressable, Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeStore } from '../../../../store/themeStore';

const ICONS = [
  'heart', 'star', 'musical-notes', 'color-palette', 'camera',
  'images', 'flower', 'business', 'theater', 'gift',
  'leaf', 'sparkles', 'musical-note', 'wine', 'airplane',
  'car', 'sunny', 'moon', 'ribbon', 'home',
];

type Props = {
  visible: boolean;
  initialName?: string;
  initialIcon?: string;
  mode: 'create' | 'rename';
  onConfirm: (name: string, icon: string) => void;
  onClose: () => void;
};

export const CreateProjectModal: React.FC<Props> = ({
  visible, initialName = '', initialIcon = 'sparkles', mode, onConfirm, onClose,
}) => {
  const insets = useSafeAreaInsets();
  const { isDark } = useThemeStore();
  const [name, setName] = useState(initialName);
  const [selectedIcon, setSelectedIcon] = useState(initialIcon);

  // Sincronizar estado cuando el modal se abre
  useEffect(() => {
    if (visible) {
      setName(initialName);
      setSelectedIcon(initialIcon);
    }
  }, [visible, initialName, initialIcon]);

  const handleConfirm = useCallback(() => {
    if (!name.trim()) return;
    Keyboard.dismiss(); // Cerramos teclado antes de la acción
    onConfirm(name.trim(), selectedIcon);
    onClose();
  }, [name, selectedIcon, onConfirm, onClose]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        style={[styles.root, isDark && styles.rootDark]}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* Pressable permite cerrar el teclado al tocar fuera de los inputs */}
        <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
          
          {/* Header con Safe Area */}
          <View style={[
            styles.header,
            isDark && styles.headerDark,
            { paddingTop: insets.top + 8 },
          ]}>
            <TouchableOpacity
              onPress={onClose}
              style={[styles.closeBtn, isDark && styles.closeBtnDark]}
              hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
            >
              <Ionicons name="close" size={20} color={isDark ? '#9ca3af' : '#6b7280'} />
            </TouchableOpacity>

            <Text style={[styles.headerTitle, isDark && styles.headerTitleDark]}>
              {mode === 'create' ? 'Nuevo proyecto' : 'Renombrar proyecto'}
            </Text>

            <View style={{ width: 36 }} /> 
          </View>

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={[
              styles.scrollContent,
              { paddingBottom: insets.bottom + 40 },
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            automaticallyAdjustKeyboardInsets={true}
          >

            {/* Selector de Iconos */}
            <Text style={[styles.label, isDark && styles.labelDark]}>Elige un ícono</Text>
            <View style={styles.iconGrid}>
              {ICONS.map(icon => {
                const isActive = icon === selectedIcon;
                return (
                  <TouchableOpacity
                    key={icon}
                    style={[
                      styles.iconBtn,
                      isDark && styles.iconBtnDark,
                      isActive && styles.iconBtnActive,
                      isActive && isDark && styles.iconBtnActiveDark,
                    ]}
                    onPress={() => setSelectedIcon(icon)}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={icon as any}
                      size={22}
                      color={isActive ? '#7c3aed' : isDark ? '#6b7280' : '#9ca3af'}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Input de Nombre */}
            <Text style={[styles.label, isDark && styles.labelDark]}>
              Nombre del proyecto
            </Text>
            <TextInput
              style={[styles.input, isDark && styles.inputDark]}
              value={name}
              onChangeText={setName}
              placeholder="Ej: Mi boda, Cumpleaños mamá..."
              placeholderTextColor={isDark ? 'rgba(167,139,250,0.3)' : 'rgba(124,58,237,0.3)'}
              selectionColor={isDark ? '#a78bfa' : '#7c3aed'}
              maxLength={40}
              returnKeyType="done"
              onSubmitEditing={handleConfirm}
              blurOnSubmit={true}
            />

            {/* Preview Visual */}
            <View style={[styles.preview, isDark && styles.previewDark]}>
              <View style={[styles.previewIcon, isDark && styles.previewIconDark]}>
                <Ionicons name={selectedIcon as any} size={26} color="#7c3aed" />
              </View>
              <View style={styles.previewInfo}>
                <Text style={[styles.previewName, isDark && styles.previewNameDark]} numberOfLines={1}>
                  {name.trim() || (mode === 'create' ? 'Nombre del proyecto' : 'Sin nombre')}
                </Text>
                <Text style={[styles.previewSub, isDark && styles.previewSubDark]}>
                  0 ítems · Creado ahora
                </Text>
              </View>
            </View>

            {/* Botón Principal */}
            <TouchableOpacity
              onPress={handleConfirm}
              disabled={!name.trim()}
              activeOpacity={0.8}
            >
              {isDark ? (
                <View style={[styles.btn, styles.btnDark, !name.trim() && styles.btnDisabled]}>
                  <Ionicons
                    name={mode === 'create' ? 'folder-open' : 'checkmark'}
                    size={18}
                    color="#fff"
                  />
                  <Text style={styles.btnText}>
                    {mode === 'create' ? 'Crear proyecto' : 'Guardar cambios'}
                  </Text>
                </View>
              ) : (
                <LinearGradient
                  colors={['#7c3aed', '#2563eb']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.btn, !name.trim() && styles.btnDisabled]}
                >
                  <Ionicons
                    name={mode === 'create' ? 'folder-open' : 'checkmark'}
                    size={18}
                    color="#fff"
                  />
                  <Text style={styles.btnText}>
                    {mode === 'create' ? 'Crear proyecto' : 'Guardar cambios'}
                  </Text>
                </LinearGradient>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={onClose} style={styles.cancelBtn} activeOpacity={0.7}>
              <Text style={[styles.cancelText, isDark && styles.cancelTextDark]}>Cancelar</Text>
            </TouchableOpacity>

          </ScrollView>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const ICON_SIZE = 52;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#faf9ff' },
  rootDark: { backgroundColor: '#0a0618' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingBottom: 14, borderBottomWidth: 1,
    borderBottomColor: 'rgba(167,139,250,0.12)', backgroundColor: '#faf9ff',
  },
  headerDark: { backgroundColor: '#0a0618', borderBottomColor: 'rgba(139,92,246,0.15)' },
  closeBtn: {
    width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(124,58,237,0.06)',
  },
  closeBtnDark: { backgroundColor: 'rgba(255,255,255,0.05)' },
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#1e1b4b' },
  headerTitleDark: { color: '#f5f3ff' },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 24 },
  label: {
    fontSize: 10, fontWeight: '700', color: 'rgba(124,58,237,0.5)',
    letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 12,
  },
  labelDark: { color: 'rgba(167,139,250,0.55)' },
  iconGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 28 },
  iconBtn: {
    width: ICON_SIZE, height: ICON_SIZE, borderRadius: 14, alignItems: 'center',
    justifyContent: 'center', backgroundColor: 'rgba(124,58,237,0.05)',
    borderWidth: 1.5, borderColor: 'rgba(124,58,237,0.12)',
  },
  iconBtnDark: { backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)' },
  iconBtnActive: { backgroundColor: 'rgba(124,58,237,0.12)', borderWidth: 2, borderColor: '#7c3aed' },
  iconBtnActiveDark: { backgroundColor: 'rgba(124,58,237,0.18)', borderColor: '#a78bfa' },
  input: {
    borderWidth: 1.5, borderColor: 'rgba(167,139,250,0.35)', borderRadius: 14,
    paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, color: '#1e1b4b',
    marginBottom: 24, backgroundColor: 'rgba(245,243,255,0.5)',
  },
  inputDark: { backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(167,139,250,0.25)', color: '#f5f3ff' },
  preview: {
    flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 16,
    backgroundColor: 'rgba(124,58,237,0.04)', borderWidth: 1, borderColor: 'rgba(167,139,250,0.18)',
    marginBottom: 28,
  },
  previewDark: { backgroundColor: 'rgba(124,58,237,0.08)', borderColor: 'rgba(139,92,246,0.22)' },
  previewIcon: {
    width: 48, height: 48, borderRadius: 14, backgroundColor: 'rgba(124,58,237,0.1)',
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(124,58,237,0.2)',
  },
  previewIconDark: { backgroundColor: 'rgba(124,58,237,0.15)', borderColor: 'rgba(139,92,246,0.3)' },
  previewInfo: { flex: 1 },
  previewName: { fontSize: 15, fontWeight: '700', color: '#1e1b4b', marginBottom: 3 },
  previewNameDark: { color: '#f5f3ff' },
  previewSub: { fontSize: 12, color: 'rgba(109,40,217,0.45)' },
  previewSubDark: { color: 'rgba(167,139,250,0.5)' },
  btn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 15, borderRadius: 16, elevation: 4,
  },
  btnDark: {
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.28)',
  },
  btnDisabled: { opacity: 0.4 },
  btnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  cancelBtn: { alignItems: 'center', paddingVertical: 16, marginTop: 4 },
  cancelText: { fontSize: 14, color: '#9ca3af' },
  cancelTextDark: { color: '#6b7280' },
});