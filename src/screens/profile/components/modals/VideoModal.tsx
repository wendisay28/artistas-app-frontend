import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

interface VideoModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (video: any) => Promise<void>;
  video?: any | null;
  isLoading?: boolean;
}

const VideoModal: React.FC<VideoModalProps> = ({ visible, onClose, onSave, video, isLoading = false }) => {
  const [formData, setFormData] = useState({
    url: '', title: '', description: '',
    type: 'youtube' as 'youtube' | 'vimeo' | 'soundcloud' | 'other',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  React.useEffect(() => {
    if (video) {
      setFormData({
        url: video.url || '', title: video.title || '',
        description: video.description || '',
        type: (video.type as any) || 'youtube',
      });
    } else {
      setFormData({ url: '', title: '', description: '', type: 'youtube' });
    }
    setErrors({});
  }, [video, visible]);

  const handleSave = async () => {
    const newErrors: Record<string, string> = {};
    if (!formData.url.trim())   newErrors.url   = 'La URL es requerida';
    if (!formData.title.trim()) newErrors.title = 'El título es requerido';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      await onSave({
        url: formData.url.trim(), title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        type: formData.type,
      });
      onClose();
    } catch {
      Alert.alert('Error', 'No se pudo guardar el video. Inténtalo de nuevo.');
    }
  };

  if (!visible) return null;

  return (
    <View style={vm.overlay}>
      <View style={vm.modal}>
        <View style={vm.header}>
          <TouchableOpacity onPress={onClose} style={vm.closeBtn}>
            <Ionicons name="close" size={22} color="#1e1b4b" />
          </TouchableOpacity>
          <Text style={vm.headerTitle}>{video ? 'Editar video' : 'Agregar video'}</Text>
          <TouchableOpacity onPress={handleSave} disabled={isLoading}>
            <LinearGradient
              colors={['#7c3aed', '#2563eb']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={[vm.saveBtn, isLoading && { opacity: 0.5 }]}
            >
              <Text style={vm.saveBtnText}>{isLoading ? 'Guardando...' : 'Guardar'}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={vm.content}>
          {(['url', 'title', 'description'] as const).map((field) => (
            <View key={field} style={vm.field}>
              <Text style={vm.label}>
                {field === 'url' ? 'URL del video *' : field === 'title' ? 'Título *' : 'Descripción'}
              </Text>
              <TextInput
                style={[vm.input, field === 'description' && vm.textArea, (errors as any)[field] && vm.inputError]}
                value={(formData as any)[field]}
                onChangeText={(text) => setFormData({ ...formData, [field]: text })}
                placeholder={field === 'url' ? 'https://youtube.com/watch?v=...' : field === 'title' ? 'Mi video destacado' : 'Describe tu video...'}
                placeholderTextColor="rgba(124,58,237,0.22)"
                multiline={field === 'description'}
                numberOfLines={field === 'description' ? 4 : 1}
                textAlignVertical={field === 'description' ? 'top' : 'center'}
                autoCapitalize="none"
                keyboardType={field === 'url' ? 'url' : 'default'}
              />
              {(errors as any)[field] && <Text style={vm.errorText}>{(errors as any)[field]}</Text>}
            </View>
          ))}

          <Text style={vm.label}>Tipo</Text>
          <View style={vm.typeRow}>
            {(['youtube', 'vimeo', 'soundcloud', 'other'] as const).map((type) => (
              <TouchableOpacity
                key={type}
                style={[vm.typeBtn, formData.type === type && vm.typeBtnActive]}
                onPress={() => setFormData({ ...formData, type })}
              >
                <Text style={[vm.typeBtnText, formData.type === type && vm.typeBtnTextActive]}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

const vm = StyleSheet.create({
  overlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.45)', zIndex: 1000,
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: '#fdfcff', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    maxHeight: '85%', borderWidth: 1.5, borderColor: 'rgba(167,139,250,0.2)',
  },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 16,
    borderBottomWidth: 1, borderBottomColor: 'rgba(167,139,250,0.12)',
  },
  closeBtn: { padding: 4 },
  headerTitle: { fontSize: 17, fontFamily: 'PlusJakartaSans_700Bold', color: '#1e1b4b' },
  saveBtn: { borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8 },
  saveBtnText: { fontSize: 13, fontFamily: 'PlusJakartaSans_700Bold', color: '#fff' },
  content: { padding: 20, gap: 4 },
  field: { marginBottom: 16 },
  label: {
    fontSize: 9.5, fontFamily: 'PlusJakartaSans_600SemiBold',
    color: 'rgba(124,58,237,0.45)', letterSpacing: 0.8,
    textTransform: 'uppercase', marginBottom: 8,
  },
  input: {
    borderWidth: 1.5, borderColor: 'rgba(167,139,250,0.25)',
    borderRadius: 14, paddingHorizontal: 14, height: 50,
    fontSize: 14, fontFamily: 'PlusJakartaSans_400Regular',
    color: '#1e1b4b', backgroundColor: '#fff',
  },
  inputError: { borderColor: '#ef4444' },
  textArea: { height: 100, paddingTop: 12, textAlignVertical: 'top' },
  errorText: {
    fontSize: 11, color: '#ef4444',
    fontFamily: 'PlusJakartaSans_400Regular', marginTop: 4,
  },
  typeRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  typeBtn: {
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 20, borderWidth: 1.5,
    borderColor: 'rgba(167,139,250,0.25)', backgroundColor: '#fff',
  },
  typeBtnActive: { backgroundColor: '#7c3aed', borderColor: '#7c3aed' },
  typeBtnText: {
    fontSize: 12, fontFamily: 'PlusJakartaSans_600SemiBold',
    color: 'rgba(124,58,237,0.45)',
  },
  typeBtnTextActive: { color: '#fff' },
});

export { VideoModal };
