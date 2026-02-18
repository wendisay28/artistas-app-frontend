// components/hiring/modals/CreateOfferModal.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  TextInput,
  ScrollView,
  StyleSheet,
  Platform,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { colors } from '../../../constants/colors';

interface CreateOfferModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: OfferFormData) => void;
  editData?: OfferFormData;
}

interface OfferFormData {
  title: string;
  description: string;
  offer_type: 'collaboration' | 'hiring' | 'gig' | 'event';
  budget_min: string;
  budget_max: string;
  location: string;
  date: string;
  category: string;
  is_urgent: boolean;
}

const OFFER_TYPES = [
  { id: 'collaboration', label: 'Colaboración', icon: 'people' },
  { id: 'hiring', label: 'Contratación', icon: 'briefcase' },
  { id: 'gig', label: 'Gig', icon: 'flash' },
  { id: 'event', label: 'Evento', icon: 'calendar' },
];

const CATEGORIES = [
  'Músico', 'Fotógrafo', 'Pintor', 'Bailarín', 'DJ', 'Actor', 'Otro'
];

export default function CreateOfferModal({
  visible,
  onClose,
  onSubmit,
  editData,
}: CreateOfferModalProps) {
  const insets = useSafeAreaInsets();
  const [formData, setFormData] = useState<OfferFormData>(
    editData || {
      title: '',
      description: '',
      offer_type: 'hiring',
      budget_min: '',
      budget_max: '',
      location: '',
      date: '',
      category: '',
      is_urgent: false,
    }
  );

  const webTopInset = Platform.OS === 'web' ? 67 : 0;
  const webBottomInset = Platform.OS === 'web' ? 34 : 0;

  const handleClose = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onClose();
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.description) {
      alert('Por favor completa los campos obligatorios');
      return;
    }
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onSubmit(formData);
  };

  const updateField = (field: keyof OfferFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { paddingTop: (insets.top || webTopInset) + 8 }]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <LinearGradient
                colors={[colors.primary, colors.accent]}
                style={styles.headerIcon}
              >
                <Ionicons name="add" size={20} color="#fff" />
              </LinearGradient>
              <Text style={styles.headerTitle}>
                {editData ? 'Editar Oferta' : 'Nueva Oferta'}
              </Text>
            </View>
            <Pressable
              style={({ pressed }) => [
                styles.closeBtn,
                pressed && styles.closeBtnPressed,
              ]}
              onPress={handleClose}
            >
              <Ionicons name="close" size={24} color={colors.text} />
            </Pressable>
          </View>

          {/* Form */}
          <ScrollView
            style={styles.form}
            contentContainerStyle={{
              paddingBottom: (insets.bottom || webBottomInset) + 20,
            }}
            showsVerticalScrollIndicator={false}
          >
            {/* Title */}
            <View style={styles.field}>
              <Text style={styles.label}>
                Título <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                value={formData.title}
                onChangeText={(text) => updateField('title', text)}
                placeholder="Ej: Músico para boda"
                placeholderTextColor={colors.textLight}
                style={styles.input}
              />
            </View>

            {/* Type */}
            <View style={styles.field}>
              <Text style={styles.label}>Tipo de oferta</Text>
              <View style={styles.typeGrid}>
                {OFFER_TYPES.map((type) => (
                  <Pressable
                    key={type.id}
                    style={({ pressed }) => [
                      styles.typeBtn,
                      formData.offer_type === type.id && styles.typeBtnActive,
                      pressed && styles.typeBtnPressed,
                    ]}
                    onPress={() => {
                      if (Platform.OS !== 'web') Haptics.selectionAsync();
                      updateField('offer_type', type.id);
                    }}
                  >
                    <Ionicons
                      name={type.icon as any}
                      size={20}
                      color={formData.offer_type === type.id ? colors.primary : colors.textSecondary}
                    />
                    <Text
                      style={[
                        styles.typeText,
                        formData.offer_type === type.id && styles.typeTextActive,
                      ]}
                    >
                      {type.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Description */}
            <View style={styles.field}>
              <Text style={styles.label}>
                Descripción <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                value={formData.description}
                onChangeText={(text) => updateField('description', text)}
                placeholder="Describe los detalles de lo que buscas..."
                placeholderTextColor={colors.textLight}
                style={[styles.input, styles.textArea]}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {/* Budget */}
            <View style={styles.field}>
              <Text style={styles.label}>Presupuesto</Text>
              <View style={styles.budgetRow}>
                <View style={styles.budgetField}>
                  <Text style={styles.budgetLabel}>Mínimo</Text>
                  <TextInput
                    value={formData.budget_min}
                    onChangeText={(text) => updateField('budget_min', text)}
                    placeholder="1000"
                    placeholderTextColor={colors.textLight}
                    keyboardType="numeric"
                    style={styles.budgetInput}
                  />
                </View>
                <Text style={styles.budgetSeparator}>—</Text>
                <View style={styles.budgetField}>
                  <Text style={styles.budgetLabel}>Máximo</Text>
                  <TextInput
                    value={formData.budget_max}
                    onChangeText={(text) => updateField('budget_max', text)}
                    placeholder="5000"
                    placeholderTextColor={colors.textLight}
                    keyboardType="numeric"
                    style={styles.budgetInput}
                  />
                </View>
              </View>
            </View>

            {/* Location */}
            <View style={styles.field}>
              <Text style={styles.label}>Ubicación</Text>
              <View style={styles.inputWithIcon}>
                <Ionicons name="location-outline" size={18} color={colors.textSecondary} />
                <TextInput
                  value={formData.location}
                  onChangeText={(text) => updateField('location', text)}
                  placeholder="Madrid, España"
                  placeholderTextColor={colors.textLight}
                  style={styles.inputFlex}
                />
              </View>
            </View>

            {/* Date */}
            <View style={styles.field}>
              <Text style={styles.label}>Fecha del evento</Text>
              <View style={styles.inputWithIcon}>
                <Ionicons name="calendar-outline" size={18} color={colors.textSecondary} />
                <TextInput
                  value={formData.date}
                  onChangeText={(text) => updateField('date', text)}
                  placeholder="15 Mar 2024"
                  placeholderTextColor={colors.textLight}
                  style={styles.inputFlex}
                />
              </View>
            </View>

            {/* Category */}
            <View style={styles.field}>
              <Text style={styles.label}>Categoría de artista</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoryScroll}
              >
                {CATEGORIES.map((cat) => (
                  <Pressable
                    key={cat}
                    style={({ pressed }) => [
                      styles.categoryChip,
                      formData.category === cat && styles.categoryChipActive,
                      pressed && styles.categoryChipPressed,
                    ]}
                    onPress={() => {
                      if (Platform.OS !== 'web') Haptics.selectionAsync();
                      updateField('category', cat);
                    }}
                  >
                    <Text
                      style={[
                        styles.categoryChipText,
                        formData.category === cat && styles.categoryChipTextActive,
                      ]}
                    >
                      {cat}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            {/* Urgent */}
            <View style={styles.field}>
              <View style={styles.switchRow}>
                <View style={styles.switchLeft}>
                  <Ionicons name="flame" size={20} color={colors.error} />
                  <View>
                    <Text style={styles.switchLabel}>Marcar como urgente</Text>
                    <Text style={styles.switchDesc}>
                      Destaca tu oferta para más visibilidad
                    </Text>
                  </View>
                </View>
                <Switch
                  value={formData.is_urgent}
                  onValueChange={(val) => updateField('is_urgent', val)}
                  trackColor={{ false: colors.border, true: colors.error + '40' }}
                  thumbColor={formData.is_urgent ? colors.error : colors.textLight}
                />
              </View>
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={[styles.footer, { paddingBottom: (insets.bottom || webBottomInset) + 16 }]}>
            <Pressable
              style={({ pressed }) => [
                styles.cancelBtn,
                pressed && styles.cancelBtnPressed,
              ]}
              onPress={handleClose}
            >
              <Text style={styles.cancelBtnText}>Cancelar</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.submitBtn,
                pressed && styles.submitBtnPressed,
              ]}
              onPress={handleSubmit}
            >
              <LinearGradient
                colors={[colors.primary, colors.accent]}
                style={styles.submitBtnGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="checkmark" size={20} color="#fff" />
                <Text style={styles.submitBtnText}>
                  {editData ? 'Guardar cambios' : 'Publicar oferta'}
                </Text>
              </LinearGradient>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    flex: 1,
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '95%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.text,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnPressed: {
    opacity: 0.7,
  },
  form: {
    flex: 1,
    paddingHorizontal: 20,
  },
  field: {
    marginTop: 20,
  },
  label: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: colors.text,
    marginBottom: 8,
  },
  required: {
    color: colors.error,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.text,
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  typeBtn: {
    flex: 1,
    minWidth: '47%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.border,
  },
  typeBtnActive: {
    backgroundColor: colors.primary + '15',
    borderColor: colors.primary,
  },
  typeBtnPressed: {
    opacity: 0.7,
  },
  typeText: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: colors.textSecondary,
  },
  typeTextActive: {
    color: colors.primary,
  },
  budgetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  budgetField: {
    flex: 1,
  },
  budgetLabel: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: colors.textSecondary,
    marginBottom: 6,
  },
  budgetInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: colors.text,
  },
  budgetSeparator: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: colors.textLight,
    marginTop: 28,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputFlex: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.text,
    padding: 0,
  },
  categoryScroll: {
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryChipActive: {
    backgroundColor: colors.primary + '15',
    borderColor: colors.primary,
  },
  categoryChipPressed: {
    opacity: 0.7,
  },
  categoryChipText: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: colors.textSecondary,
  },
  categoryChipTextActive: {
    color: colors.primary,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
  },
  switchLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  switchLabel: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: colors.text,
    marginBottom: 2,
  },
  switchDesc: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnPressed: {
    opacity: 0.7,
  },
  cancelBtnText: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: colors.text,
  },
  submitBtn: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitBtnPressed: {
    opacity: 0.9,
  },
  submitBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
  },
  submitBtnText: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#fff',
  },
});