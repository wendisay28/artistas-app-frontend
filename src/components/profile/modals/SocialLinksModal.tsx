import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../theme';

interface SocialLinksData {
  instagram: string;
  x: string;
  youtube: string;
  spotify: string;
}

interface Props {
  visible: boolean;
  initialData: SocialLinksData;
  onClose: () => void;
  onSave: (data: SocialLinksData) => void;
}

const SOCIAL_PLATFORMS = [
  { key: 'instagram', label: 'Instagram', icon: 'logo-instagram', color: '#E1306C' },
  { key: 'x', label: 'X', icon: 'logo-x', color: '#000000' },
  { key: 'youtube', label: 'YouTube', icon: 'logo-youtube', color: '#FF0000' },
  { key: 'spotify', label: 'Spotify', icon: 'musical-notes', color: '#1DB954' },
];

export const SocialLinksModal: React.FC<Props> = ({
  visible,
  initialData,
  onClose,
  onSave,
}) => {
  const emptyState: SocialLinksData = {
    instagram: '',
    x: '',
    youtube: '',
    spotify: '',
  };

  const [data, setData] = useState<SocialLinksData>(emptyState);

  useEffect(() => {
    if (visible) {
      setData({
        instagram: initialData?.instagram ?? '',
        x: initialData?.x ?? '',
        youtube: initialData?.youtube ?? '',
        spotify: initialData?.spotify ?? '',
      });
    }
  }, [visible, initialData]);

  const normalizeValue = (key: keyof SocialLinksData, value: string) => {
    let clean = value.trim();

    clean = clean.replace(/^https?:\/\//, '');

    if (key === 'instagram') {
      clean = clean.replace(/^instagram\.com\//, '');
      clean = clean.replace(/^@/, '');
    }

    if (key === 'x') {
      clean = clean.replace(/^x\.com\//, '');
      clean = clean.replace(/^@/, '');
    }

    if (key === 'youtube') {
      clean = clean.replace(/^youtube\.com\/@?/, '');
      clean = clean.replace(/^@/, '');
    }

    if (key === 'spotify') {
      clean = clean.replace(/^open\.spotify\.com\/artist\//, '');
    }

    return clean;
  };

  const updateField = (key: keyof SocialLinksData) => (value: string) => {
    setData(prev => ({
      ...prev,
      [key]: normalizeValue(key, value),
    }));
  };

  const handleSave = () => {
    onSave({
      instagram: data.instagram.trim(),
      x: data.x.trim(),
      youtube: data.youtube.trim(),
      spotify: data.spotify.trim(),
    });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent statusBarTranslucent>
      <KeyboardAvoidingView
        style={s.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={s.sheet}>
            <View style={s.handle} />

            <View style={s.header}>
              <TouchableOpacity style={s.sideBtn} onPress={onClose}>
                <Text style={s.cancel}>Cancelar</Text>
              </TouchableOpacity>

              <Text style={s.title}>Redes Sociales</Text>

              <TouchableOpacity style={s.sideBtn} onPress={handleSave}>
                <Text style={s.save}>Guardar</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              contentContainerStyle={s.content}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <Text style={s.description}>
                Agrega tu usuario o pega la URL completa.
              </Text>

              {SOCIAL_PLATFORMS.map((platform) => (
                <View key={platform.key} style={s.fieldWrap}>
                  <View style={s.fieldHeader}>
                    <View style={[s.iconCircle, { backgroundColor: platform.color + '20' }]}>
                      <Ionicons name={platform.icon} size={20} color={platform.color} />
                    </View>
                    <Text style={s.fieldLabel}>{platform.label}</Text>
                  </View>

                  <View style={s.inputWrap}>
                    <TextInput
                      style={s.input}
                      value={data[platform.key as keyof SocialLinksData]}
                      onChangeText={updateField(platform.key as keyof SocialLinksData)}
                      placeholder="usuario o URL"
                      placeholderTextColor={Colors.text3}
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  </View>
                </View>
              ))}

              <View style={{ height: 60 }} />
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheet: {
    backgroundColor: Colors.bg,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '90%',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  sideBtn: { width: 90 },
  title: { fontSize: 16, fontWeight: '700', color: Colors.text },
  cancel: { fontSize: 15, color: Colors.text2 },
  save: { fontSize: 15, fontWeight: '700', color: Colors.primary, textAlign: 'right' },
  content: { paddingHorizontal: 20, paddingTop: 20, flexGrow: 1 },
  description: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: 24,
    textAlign: 'center',
  },
  fieldWrap: { marginBottom: 20 },
  fieldHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  fieldLabel: { fontSize: 15, fontWeight: '600', color: Colors.text },
  inputWrap: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    paddingHorizontal: 12,
    height: 48,
    justifyContent: 'center',
  },
  input: { fontSize: 14, color: Colors.text },
});
