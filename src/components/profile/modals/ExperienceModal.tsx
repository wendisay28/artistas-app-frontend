import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius } from '../../../theme';
import { WorkExperienceDetail } from '../types';

interface Props {
  visible: boolean;
  initialExperience: WorkExperienceDetail[];
  onClose: () => void;
  onSave: (data: WorkExperienceDetail[]) => void;
}

export const ExperienceModal = ({
  visible,
  initialExperience,
  onClose,
  onSave,
}: Props) => {
  const [experience, setExperience] = useState<WorkExperienceDetail[]>([]);

  // 🔥 Siempre iniciar con al menos una experiencia
  useEffect(() => {
    if (visible) {
      if (initialExperience && initialExperience.length > 0) {
        setExperience(initialExperience);
      } else {
        setExperience([
          { company: '', position: '', period: '', description: '' },
        ]);
      }
    }
  }, [visible]);

  const addWork = () => {
    setExperience((prev) => [
      ...prev,
      { company: '', position: '', period: '', description: '' },
    ]);
  };

  const removeWork = (index: number) => {
    if (experience.length === 1) return; // 🔥 No permitir borrar la última
    setExperience((prev) => prev.filter((_, i) => i !== index));
  };

  const updateWork = (
    index: number,
    field: keyof WorkExperienceDetail,
    value: string
  ) => {
    setExperience((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent statusBarTranslucent>
      <KeyboardAvoidingView
        style={s.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={s.sheet}>
            <View style={s.handle} />

            {/* HEADER MEJORADO */}
            <View style={s.header}>
              <TouchableOpacity style={s.sideBtn} onPress={onClose}>
                <Text style={s.cancel}>Cancelar</Text>
              </TouchableOpacity>

              <Text style={s.title}>Experiencia Laboral</Text>

              <TouchableOpacity
                style={s.sideBtn}
                onPress={() => onSave(experience)}
              >
                <Text style={s.save}>Guardar</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              contentContainerStyle={s.content}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {experience.map((item, index) => (
                <View key={index} style={s.card}>
                  <View style={s.cardHeader}>
                    <Text style={s.cardTitle}>
                      Experiencia {index + 1}
                    </Text>

                    {experience.length > 1 && (
                      <TouchableOpacity onPress={() => removeWork(index)}>
                        <Ionicons
                          name="trash-outline"
                          size={18}
                          color={Colors.error}
                        />
                      </TouchableOpacity>
                    )}
                  </View>

                  <View style={s.row}>
                    <View style={{ flex: 1.5 }}>
                      <Text style={s.label}>Empresa</Text>
                      <TextInput
                        style={s.input}
                        value={item.company}
                        placeholder="Ej. Agency"
                        onChangeText={(v) =>
                          updateWork(index, 'company', v)
                        }
                      />
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text style={s.label}>Periodo</Text>
                      <TextInput
                        style={s.input}
                        value={item.period}
                        placeholder="2022 - Act."
                        onChangeText={(v) =>
                          updateWork(index, 'period', v)
                        }
                      />
                    </View>
                  </View>

                  <View style={{ marginTop: 12 }}>
                    <Text style={s.label}>Cargo</Text>
                    <TextInput
                      style={s.input}
                      value={item.position}
                      placeholder="Ej. Director Creativo"
                      onChangeText={(v) =>
                        updateWork(index, 'position', v)
                      }
                    />
                  </View>

                  <View style={{ marginTop: 12 }}>
                    <Text style={s.label}>Descripción</Text>
                    <TextInput
                      style={[s.input, s.textArea]}
                      value={item.description}
                      multiline
                      placeholder="Logros y responsabilidades..."
                      onChangeText={(v) =>
                        updateWork(index, 'description', v)
                      }
                    />
                  </View>
                </View>
              ))}

              <TouchableOpacity style={s.addBtn} onPress={addWork}>
                <Ionicons
                  name="add-circle-outline"
                  size={20}
                  color={Colors.primary}
                />
                <Text style={s.addText}>
                  Agregar nueva experiencia
                </Text>
              </TouchableOpacity>

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
    color: Colors.text2,
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

  card: {
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 18,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },

  cardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text2,
    textTransform: 'uppercase',
  },

  row: {
    flexDirection: 'row',
    gap: 12,
  },

  label: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.text3,
    marginBottom: 6,
  },

  input: {
    backgroundColor: Colors.bg,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: Colors.text,
  },

  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },

  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.primary,
    borderRadius: Radius.md,
  },

  addText: {
    color: Colors.primary,
    fontWeight: '600',
    fontSize: 14,
  },
});
