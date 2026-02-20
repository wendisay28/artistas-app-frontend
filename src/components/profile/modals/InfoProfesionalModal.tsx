import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Animated,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../theme';


// ─────────────────────────────────────────
// FIELD
// ─────────────────────────────────────────
type FieldProps = {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
};

const Field: React.FC<FieldProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  icon,
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <View style={f.wrapper}>
      <Text style={f.label}>{label}</Text>

      <View style={[f.box, focused && f.boxFocused]}>
        <View style={{ marginRight: 10 }}>
          <Ionicons
            name={icon}
            size={18}
            color={focused ? Colors.primary : '#9CA3AF'}
          />
        </View>

        <TextInput
          style={f.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#C4C4C4"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </View>
    </View>
  );
};

const f = StyleSheet.create({
  wrapper: { marginBottom: 22 },

  label: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#6B7280',
    marginBottom: 8,
  },

  box: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1.2,
    borderColor: '#E5E7EB',
  },

  boxFocused: {
    borderColor: Colors.primary,
    backgroundColor: '#FFFFFF',
  },

  input: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
    fontFamily: 'PlusJakartaSans_500Medium',
  },
});


// ─────────────────────────────────────────
// AVAILABILITY OPTIONS
// ─────────────────────────────────────────
type AvailabilityProps = {
  value: string;
  onSelect: (v: string) => void;
};

const OPTIONS = [
  { label: 'Disponible', color: '#10B981' },
  { label: 'Ocupado', color: '#EF4444' },
  { label: 'Bajo pedido', color: '#F59E0B' },
];

const AvailabilitySelector: React.FC<AvailabilityProps> = ({
  value,
  onSelect,
}) => {
  return (
    <View style={a.wrapper}>
      <Text style={a.label}>Disponibilidad</Text>

      <View style={a.row}>
        {OPTIONS.map((opt) => {
          const active = value === opt.label;

          return (
            <TouchableOpacity
              key={opt.label}
              style={[
                a.pill,
                active && {
                  borderColor: opt.color,
                  backgroundColor: opt.color + '20',
                },
              ]}
              onPress={() => onSelect(opt.label)}
              activeOpacity={0.8}
            >
              <View
                style={[a.dot, { backgroundColor: opt.color }]}
              />
              <Text
                style={[
                  a.pillText,
                  active && { color: opt.color },
                ]}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const a = StyleSheet.create({
  wrapper: {
    marginBottom: 24,
  },

  label: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#6B7280',
    marginBottom: 10,
  },

  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 100,
    borderWidth: 1.2,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },

  pillText: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: '#6B7280',
  },
});


// ─────────────────────────────────────────
// MODAL PRINCIPAL
// ─────────────────────────────────────────
type ModalData = {
  yearsExperience: string;
  style: string;
  responseTime: string;
  availability: string;
};

type Props = {
  visible: boolean;
  initialData: ModalData;
  onClose: () => void;
  onSave: (data: ModalData) => void;
};

export const InfoProfesionalModal: React.FC<Props> = ({
  visible,
  initialData,
  onClose,
  onSave,
}) => {
  const [data, setData] = useState(initialData);
  const slideAnim = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    if (visible) {
      setData(initialData);
    }
  }, [visible]);

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    } else {
      slideAnim.setValue(300);
    }
  }, [visible]);

  const update = useCallback(
    (key: keyof ModalData) => (v: string) =>
      setData((prev) => ({ ...prev, [key]: v })),
    []
  );

  return (
    <Modal visible={visible} animationType="none" transparent statusBarTranslucent>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={s.overlay}
      >
        <Animated.View style={[s.sheet, { transform: [{ translateY: slideAnim }] }]}>
          <View style={s.handle} />

          {/* HEADER */}
          <View style={s.header}>
            <TouchableOpacity onPress={onClose} style={s.sideButton}>
              <Text style={s.cancelText}>Cancelar</Text>
            </TouchableOpacity>

            <Text numberOfLines={1} style={s.title}>
              Información Profesional
            </Text>

            <TouchableOpacity
              style={s.sideButton}
              onPress={() => onSave(data)}
            >
              <Text style={s.saveText}>Guardar</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={s.content}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Field
              label="Años de experiencia"
              value={data.yearsExperience}
              onChangeText={update('yearsExperience')}
              placeholder="Ej. 8 años"
              icon="time-outline"
            />

            <Field
              label="Estilo artístico"
              value={data.style}
              onChangeText={update('style')}
              placeholder="Ej. Minimalista"
              icon="color-palette-outline"
            />

            <Field
              label="Tiempo de respuesta"
              value={data.responseTime}
              onChangeText={update('responseTime')}
              placeholder="Ej. En 2 horas"
              icon="chatbubble-ellipses-outline"
            />

            <AvailabilitySelector
              value={data.availability}
              onSelect={update('availability')}
            />
          </ScrollView>
        </Animated.View>
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
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingBottom: Platform.OS === 'ios' ? 40 : 28,
  },

  handle: {
    width: 40,
    height: 4,
    borderRadius: 3,
    backgroundColor: '#E5E7EB',
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 10,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },

  sideButton: {
    width: 90,
  },

  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: Colors.text,
  },

  cancelText: {
    fontSize: 14,
    color: '#6B7280',
  },

  saveText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: Colors.primary,
    textAlign: 'right',
  },

  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 10,
  },
});
