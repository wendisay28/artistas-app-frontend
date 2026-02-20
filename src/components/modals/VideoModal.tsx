// src/components/modals/VideoModal.tsx
import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, TextInput, Platform, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Spacing } from '../../theme';
import { FeaturedItem } from '../../services/api/portfolio';

interface VideoModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (video: Partial<FeaturedItem>) => Promise<void>;
  video?: FeaturedItem | null;
  isLoading?: boolean;
}

export const VideoModal: React.FC<VideoModalProps> = ({
  visible,
  onClose,
  onSave,
  video,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    url: '',
    title: '',
    description: '',
    type: 'youtube' as 'youtube' | 'vimeo' | 'soundcloud' | 'other',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  React.useEffect(() => {
    if (video) {
      setFormData({
        url: video.url || '',
        title: video.title || '',
        description: video.description || '',
        type: (video.type as 'youtube' | 'vimeo' | 'soundcloud' | 'other') || 'youtube',
      });
    } else {
      setFormData({
        url: '',
        title: '',
        description: '',
        type: 'youtube',
      });
    }
    setErrors({});
  }, [video, visible]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.url.trim()) {
      newErrors.url = 'La URL es requerida';
    }

    if (!formData.title.trim()) {
      newErrors.title = 'El título es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await onSave({
        url: formData.url.trim(),
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        type: formData.type,
      });
      onClose();
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el video. Inténtalo de nuevo.');
    }
  };

  return (
    <View style={[vm.overlay, visible && vm.overlayVisible]}>
      <View style={[vm.modal, visible && vm.modalVisible]}>
        {/* Header */}
        <View style={vm.header}>
          <TouchableOpacity onPress={onClose} style={vm.closeButton}>
            <Ionicons name="close" size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={vm.title}>
            {video ? 'Editar video' : 'Agregar video'}
          </Text>
          <TouchableOpacity 
            onPress={handleSave} 
            style={[vm.saveButton, isLoading && vm.saveButtonDisabled]}
            disabled={isLoading}
          >
            <Text style={vm.saveButtonText}>
              {isLoading ? 'Guardando...' : 'Guardar'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Form */}
        <View style={vm.content}>
          {/* URL */}
          <View style={vm.field}>
            <Text style={vm.label}>URL del video *</Text>
            <TextInput
              style={[vm.input, errors.url && vm.inputError]}
              value={formData.url}
              onChangeText={(text) => setFormData({ ...formData, url: text })}
              placeholder="https://youtube.com/watch?v=..."
              placeholderTextColor={Colors.text3}
              autoCapitalize="none"
              keyboardType="url"
            />
            {errors.url && <Text style={vm.errorText}>{errors.url}</Text>}
          </View>

          {/* Título */}
          <View style={vm.field}>
            <Text style={vm.label}>Título *</Text>
            <TextInput
              style={[vm.input, errors.title && vm.inputError]}
              value={formData.title}
              onChangeText={(text) => setFormData({ ...formData, title: text })}
              placeholder="Mi video destacado"
              placeholderTextColor={Colors.text3}
            />
            {errors.title && <Text style={vm.errorText}>{errors.title}</Text>}
          </View>

          {/* Descripción */}
          <View style={vm.field}>
            <Text style={vm.label}>Descripción</Text>
            <TextInput
              style={[vm.input, vm.textArea]}
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              placeholder="Describe tu video..."
              placeholderTextColor={Colors.text3}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Tipo */}
          <View style={vm.field}>
            <Text style={vm.label}>Tipo</Text>
            <View style={vm.typeButtons}>
              {(['youtube', 'vimeo', 'soundcloud', 'other'] as const).map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    vm.typeButton,
                    formData.type === type && vm.typeButtonActive,
                  ]}
                  onPress={() => setFormData({ ...formData, type })}
                >
                  <Text style={[
                    vm.typeButtonText,
                    formData.type === type && vm.typeButtonTextActive,
                  ]}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const vm = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    opacity: 0,
    zIndex: 1000,
  },
  overlayVisible: {
    opacity: 1,
  },
  modal: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    transform: [{ translateY: '100%' }],
  },
  modalVisible: {
    transform: [{ translateY: 0 }],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  closeButton: {
    padding: Spacing.xs,
  },
  title: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: Colors.text,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.sm,
  },
  saveButtonDisabled: {
    backgroundColor: Colors.text3,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  content: {
    flex: 1,
    padding: Spacing.lg,
  },
  field: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: Colors.text,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#ef4444',
  },
  textArea: {
    height: 100,
    paddingTop: Spacing.sm,
  },
  errorText: {
    fontSize: 12,
    color: '#ef4444',
    fontFamily: 'PlusJakartaSans_400Regular',
    marginTop: Spacing.xs,
  },
  typeButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  typeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: '#fff',
  },
  typeButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  typeButtonText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: Colors.text,
  },
  typeButtonTextActive: {
    color: '#fff',
  },
});
