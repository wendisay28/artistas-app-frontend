// src/components/modals/ServiceModal.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Spacing } from '../../theme';
import { Service } from '../../services/api/services';

interface ServiceModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (service: Partial<Service>) => Promise<void>;
  service?: Service | null;
  isLoading?: boolean;
}

export const ServiceModal: React.FC<ServiceModalProps> = ({
  visible,
  onClose,
  onSave,
  service,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    category: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name || '',
        description: service.description || '',
        price: service.price?.toString() || '',
        duration: service.duration || '',
        category: service.category || '',
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        duration: '',
        category: '',
      });
    }
    setErrors({});
  }, [service, visible]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre del servicio es requerido';
    }

    if (formData.price && isNaN(Number(formData.price))) {
      newErrors.price = 'El precio debe ser un número válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const serviceData: Partial<Service> = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        price: formData.price ? parseFloat(formData.price) : undefined,
        duration: formData.duration.trim() || undefined,
        category: formData.category.trim() || undefined,
        isActive: true,
      };

      await onSave(serviceData);
      onClose();
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el servicio. Inténtalo de nuevo.');
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>
            {service ? 'Editar servicio' : 'Nuevo servicio'}
          </Text>
          <TouchableOpacity 
            onPress={handleSave} 
            style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
            disabled={isLoading}
          >
            <Text style={styles.saveButtonText}>
              {isLoading ? 'Guardando...' : 'Guardar'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Form */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Nombre */}
          <View style={styles.field}>
            <Text style={styles.label}>Nombre del servicio *</Text>
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              placeholder="Ej: Sesión de fotos"
              placeholderTextColor={Colors.text3}
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          {/* Descripción */}
          <View style={styles.field}>
            <Text style={styles.label}>Descripción</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              placeholder="Describe tu servicio..."
              placeholderTextColor={Colors.text3}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Precio */}
          <View style={styles.field}>
            <Text style={styles.label}>Precio (COP)</Text>
            <TextInput
              style={[styles.input, errors.price && styles.inputError]}
              value={formData.price}
              onChangeText={(text) => setFormData({ ...formData, price: text })}
              placeholder="Ej: 150000"
              placeholderTextColor={Colors.text3}
              keyboardType="numeric"
            />
            {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}
          </View>

          {/* Duración */}
          <View style={styles.field}>
            <Text style={styles.label}>Duración</Text>
            <TextInput
              style={styles.input}
              value={formData.duration}
              onChangeText={(text) => setFormData({ ...formData, duration: text })}
              placeholder="Ej: 2 horas, 1 día"
              placeholderTextColor={Colors.text3}
            />
          </View>

          {/* Categoría */}
          <View style={styles.field}>
            <Text style={styles.label}>Categoría</Text>
            <TextInput
              style={styles.input}
              value={formData.category}
              onChangeText={(text) => setFormData({ ...formData, category: text })}
              placeholder="Ej: Fotografía, Música, Arte"
              placeholderTextColor={Colors.text3}
            />
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
});
