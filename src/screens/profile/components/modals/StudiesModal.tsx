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
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius } from '../../../../theme';
import { StudyDetail } from '../types';

interface Props {
  visible: boolean;
  initialStudies: StudyDetail[];
  onClose: () => void;
  onSave: (data: StudyDetail[]) => void;
}

export const StudiesModal = ({
  visible,
  initialStudies,
  onClose,
  onSave,
}: Props) => {
  const [studies, setStudies] = useState<StudyDetail[]>([]);

  // 🔥 Siempre iniciar con al menos un estudio
  useEffect(() => {
    if (visible) {
      if (initialStudies && initialStudies.length > 0) {
        setStudies(initialStudies);
      } else {
        setStudies([
          { institution: '', degree: '', year: '', details: '' },
        ]);
      }
    }
  }, [visible]);

  const addStudy = () => {
    setStudies((prev) => [
      ...prev,
      { institution: '', degree: '', year: '', details: '' },
    ]);
  };

  const removeStudy = (index: number) => {
    if (studies.length === 1) return; // 🔥 No borrar el último
    setStudies((prev) => prev.filter((_, i) => i !== index));
  };

  const updateStudy = (
    index: number,
    field: keyof StudyDetail,
    value: string
  ) => {
    setStudies((prev) => {
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

              <Text style={s.title}>Estudios y Formación</Text>

              <TouchableOpacity
                style={s.sideBtn}
                onPress={() => onSave(studies)}
              >
                <Text style={s.save}>Guardar</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              contentContainerStyle={s.content}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {studies.map((item, index) => (
                <View key={index} style={s.card}>
                  <View style={s.cardHeader}>
                    <Text style={s.cardTitle}>
                      Estudio {index + 1}
                    </Text>

                    {studies.length > 1 && (
                      <TouchableOpacity onPress={() => removeStudy(index)}>
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
                      <Text style={s.label}>Institución</Text>
                      <TextInput
                        style={s.input}
                        value={item.institution}
                        placeholder="Ej. Universidad Nacional"
                        onChangeText={(v) =>
                          updateStudy(index, 'institution', v)
                        }
                      />
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text style={s.label}>Año</Text>
                      <TextInput
                        style={s.input}
                        value={item.year}
                        placeholder="2020"
                        keyboardType="numeric"
                        onChangeText={(v) =>
                          updateStudy(index, 'year', v)
                        }
                      />
                    </View>
                  </View>

                  <View style={{ marginTop: 12 }}>
                    <Text style={s.label}>Título o Certificación</Text>
                    <TextInput
                      style={s.input}
                      value={item.degree}
                      placeholder="Ej. Licenciatura en Artes"
                      onChangeText={(v) =>
                        updateStudy(index, 'degree', v)
                      }
                    />
                  </View>

                  <View style={{ marginTop: 12 }}>
                    <Text style={s.label}>Detalles adicionales</Text>
                    <TextInput
                      style={[s.input, s.textArea]}
                      value={item.details}
                      multiline
                      placeholder="Logros, especializaciones, etc..."
                      onChangeText={(v) =>
                        updateStudy(index, 'details', v)
                      }
                    />
                  </View>
                </View>
              ))}

              <TouchableOpacity style={s.addBtn} onPress={addStudy}>
                <Ionicons
                  name="add-circle-outline"
                  size={20}
                  color={Colors.primary}
                />
                <Text style={s.addText}>
                  Agregar nuevo estudio
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
    color: Colors.text,
    textTransform: 'uppercase',
  },

  row: {
    flexDirection: 'row',
    gap: 12,
  },

  label: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.text,
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
