import React, { useState, useEffect, useCallback } from 'react';
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
import { Colors, Radius } from '../../../../theme';
import { ArtistCategorySelector } from '../shared/CategorySelector';

interface CategoryData {
  category?: any;
  specialty: string;
  niche: string;
}

export type { CategoryData };

interface Props {
  visible: boolean;
  initialData: CategoryData;
  onClose: () => void;
  onSave: (data: CategoryData) => void;
}

export const CategoryModal = ({
  visible,
  initialData,
  onClose,
  onSave,
}: Props) => {

  // 🔥 ESTADOS SEPARADOS (clave para evitar bug)
  const [category, setCategory] = useState<any>(initialData.category);
  const [specialty, setSpecialty] = useState(initialData.specialty);
  const [niche, setNiche] = useState(initialData.niche);

  useEffect(() => {
    if (visible) {
      setCategory(initialData.category);
      setSpecialty(initialData.specialty);
      setNiche(initialData.niche);
    }
  }, [visible]);

  const handleSave = useCallback(() => {
    onSave({
      category,
      specialty,
      niche,
    });
  }, [category, specialty, niche]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        style={s.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={s.sheet}>
            <View style={s.handle} />

            {/* HEADER */}
            <View style={s.header}>
              <TouchableOpacity style={s.sideBtn} onPress={onClose}>
                <Text style={s.cancel}>Cancelar</Text>
              </TouchableOpacity>

              <Text style={s.title}>Categoría Artística</Text>

              <TouchableOpacity style={s.sideBtn} onPress={handleSave}>
                <Text style={s.save}>Guardar</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              contentContainerStyle={s.content}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <Text style={s.sectionTitle}>
                SELECCIONA TU CATEGORÍA
              </Text>

              <ArtistCategorySelector
                selection={category}
                onChange={setCategory}
              />

              <View style={s.divider} />

              <Text style={s.sectionTitle}>
                DETALLES DE NICHO
              </Text>

              <View style={s.fieldWrap}>
                <Text style={s.label}>Especialidad</Text>
                <View style={s.inputWrap}>
                  <TextInput
                    style={s.input}
                    value={specialty}
                    onChangeText={setSpecialty}
                    placeholder="ej. Fotografía de Producto"
                    placeholderTextColor={Colors.text}
                    returnKeyType="done"
                  />
                </View>
              </View>

              <View style={s.fieldWrap}>
                <Text style={s.label}>Nicho de mercado</Text>
                <View style={s.inputWrap}>
                  <TextInput
                    style={s.input}
                    value={niche}
                    onChangeText={setNiche}
                    placeholder="ej. Marcas de Joyería"
                    placeholderTextColor={Colors.text}
                    returnKeyType="done"
                  />
                </View>
              </View>

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

  sideBtn: {
    width: 90,
  },

  title: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },

  cancel: {
    fontSize: 15,
    color: Colors.text,
  },

  save: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primary,
    textAlign: 'right',
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    flexGrow: 1,
  },

  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.text,
    letterSpacing: 1,
    marginBottom: 14,
  },

  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 25,
  },

  fieldWrap: {
    marginBottom: 18,
  },

  label: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },

  inputWrap: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    backgroundColor: Colors.surface,
    paddingHorizontal: 14,
    height: 48,
    justifyContent: 'center',
  },

  input: {
    fontSize: 14,
    color: Colors.text,
  },
});
