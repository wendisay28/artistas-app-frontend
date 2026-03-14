// ─────────────────────────────────────────────────────────────────────────────
// CreateProjectModal.tsx — Modal para crear / renombrar un proyecto
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect } from 'react';
import {
  Modal, View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const EMOJIS = [
  '💍','🎉','🎸','🎨','🖼️','📸','🌸','🏛️','🎭','🎪',
  '🌿','✨','🎶','🍾','🕊️','🎠','🌅','🪄','🎀','🏡',
];

type Props = {
  visible: boolean;
  initialName?: string;
  initialEmoji?: string;
  mode: 'create' | 'rename';
  onConfirm: (name: string, emoji: string) => void;
  onClose: () => void;
};

export const CreateProjectModal: React.FC<Props> = ({
  visible, initialName = '', initialEmoji = '✨', mode, onConfirm, onClose,
}) => {
  const insets = useSafeAreaInsets();
  const [name, setName]   = useState(initialName);
  const [emoji, setEmoji] = useState(initialEmoji);

  useEffect(() => {
    if (visible) { setName(initialName); setEmoji(initialEmoji); }
  }, [visible, initialName, initialEmoji]);

  const handleConfirm = () => {
    if (!name.trim()) return;
    onConfirm(name.trim(), emoji);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}>

          {/* Handle */}
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>
              {mode === 'create' ? 'Nuevo proyecto' : 'Renombrar proyecto'}
            </Text>
            <TouchableOpacity onPress={onClose} hitSlop={12}>
              <Ionicons name="close" size={22} color="#6b7280" />
            </TouchableOpacity>
          </View>

          {/* Emoji selector */}
          <Text style={styles.label}>Elige un ícono</Text>
          <FlatList
            data={EMOJIS}
            keyExtractor={e => e}
            numColumns={10}
            scrollEnabled={false}
            contentContainerStyle={styles.emojiGrid}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.emojiBtn, item === emoji && styles.emojiBtnActive]}
                onPress={() => setEmoji(item)}
              >
                <Text style={styles.emojiText}>{item}</Text>
              </TouchableOpacity>
            )}
          />

          {/* Nombre */}
          <Text style={styles.label}>Nombre del proyecto</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Ej: Banda para mi boda"
            placeholderTextColor="rgba(124,58,237,0.3)"
            autoFocus
            maxLength={40}
          />

          {/* Botón */}
          <TouchableOpacity
            onPress={handleConfirm}
            disabled={!name.trim()}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={['#7c3aed', '#2563eb']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={[styles.btn, !name.trim() && { opacity: 0.4 }]}
            >
              <Ionicons name={mode === 'create' ? 'folder-open' : 'checkmark'} size={16} color="#fff" />
              <Text style={styles.btnText}>
                {mode === 'create' ? 'Crear proyecto' : 'Guardar cambios'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    paddingTop: 12,
  },
  handle: {
    alignSelf: 'center',
    width: 40, height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(124,58,237,0.2)',
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#1e1b4b',
  },
  label: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: 'rgba(124,58,237,0.5)',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  emojiGrid: {
    marginBottom: 20,
    gap: 6,
  },
  emojiBtn: {
    flex: 1,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    margin: 2,
    backgroundColor: 'rgba(124,58,237,0.05)',
  },
  emojiBtnActive: {
    backgroundColor: 'rgba(124,58,237,0.15)',
    borderWidth: 1.5,
    borderColor: '#7c3aed',
  },
  emojiText: { fontSize: 20 },
  input: {
    borderWidth: 1.5,
    borderColor: 'rgba(167,139,250,0.35)',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#1e1b4b',
    marginBottom: 20,
    backgroundColor: 'rgba(245,243,255,0.5)',
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 16,
  },
  btnText: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#fff',
  },
});
