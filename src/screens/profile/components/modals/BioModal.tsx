import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../../theme/colors';
import { Radius } from '../../../../theme/radius';

interface Props {
  visible: boolean;
  initialValue: string;
  onClose: () => void;
  onSave: (value: string) => void;
}

export const BioModal = ({ visible, initialValue, onClose, onSave }: Props) => {
  const [bio, setBio] = useState(initialValue);

  useEffect(() => { setBio(initialValue); }, [initialValue, visible]);

  return (
    <Modal visible={visible} animationType="slide" transparent statusBarTranslucent>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={s.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={s.sheet}>
          <View style={s.header}>
            <TouchableOpacity onPress={onClose}><Text style={s.cancel}>Cancelar</Text></TouchableOpacity>
            <Text style={s.title}>Sobre mí</Text>
            <TouchableOpacity onPress={() => onSave(bio)}><Text style={s.save}>Guardar</Text></TouchableOpacity>
          </View>
          <View style={s.content}>
            <Text style={s.label}>DESCRIPCIÓN PROFESIONAL</Text>
            <TextInput
              style={s.textArea}
              value={bio}
              onChangeText={setBio}
              multiline
              placeholder="Cuéntale al mundo tu trayectoria..."
              placeholderTextColor={Colors.text}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const s = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' },
  sheet: { backgroundColor: Colors.bg, borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1, borderBottomColor: Colors.border, alignItems: 'center' },
  title: { fontSize: 16, fontWeight: '700', color: Colors.text },
  cancel: { color: Colors.text },
  save: { color: Colors.primary, fontWeight: '700' },
  content: { padding: 20 },
  label: { fontSize: 11, fontWeight: '700', color: Colors.text, marginBottom: 10 },
  textArea: { minHeight: 150, backgroundColor: Colors.surface, borderRadius: Radius.md, padding: 15, textAlignVertical: 'top', color: Colors.text, borderWidth: 1, borderColor: Colors.border }
});
