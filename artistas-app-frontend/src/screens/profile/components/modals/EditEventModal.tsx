// ─────────────────────────────────────────────────────────────────────────────
// EditEventModal.tsx — Modal para agregar/editar eventos
// título · tipo · fecha · hora · ubicación · descripción · capacidad · precio
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Spacing } from '../../../../theme';

// ── Tipos ─────────────────────────────────────────────────────────────────────

export interface ArtistEvent {
  id: string;
  title: string;
  type: string;
  date: string;
  time: string;
  location: string;
  description: string;
  capacity: number;
  price: number;
  currency: string;
  image?: string;
  isPublished: boolean;
  attendees?: number;
}

export type EventFormData = {
  title: string;
  type: string;
  date: string;
  time: string;
  location: string;
  description: string;
  capacity: string;
  price: string;
  currency: string;
  isPublished: boolean;
};

type Props = {
  visible: boolean;
  event?: ArtistEvent; // Si se proporciona, es modo edición
  onClose: () => void;
  onSave: (data: EventFormData) => void;
};

// ── Sub-componente: campo de formulario ───────────────────────────────────────

type FieldProps = {
  label: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  multiline?: boolean;
  maxLength?: number;
  hint?: string;
  prefix?: string;
  keyboardType?: 'default' | 'email-address' | 'url' | 'numeric';
};

const Field: React.FC<FieldProps> = ({
  label, icon, value, onChangeText, placeholder,
  multiline, maxLength, hint, prefix, keyboardType = 'default',
}) => (
  <View style={f.wrap}>
    <View style={f.labelRow}>
      <Ionicons name={icon} size={14} color={Colors.primary} />
      <Text style={f.label}>{label}</Text>
      {maxLength && (
        <Text style={f.counter}>{value.length}/{maxLength}</Text>
      )}
    </View>
    <View style={[f.inputWrap, multiline && f.inputMulti]}>
      {prefix ? <Text style={f.prefix}>{prefix}</Text> : null}
      <TextInput
        style={[f.input, multiline && { height: 80, textAlignVertical: 'top' }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.text}
        multiline={multiline}
        maxLength={maxLength}
        keyboardType={keyboardType}
        autoCapitalize="none"
      />
    </View>
    {hint ? <Text style={f.hint}>{hint}</Text> : null}
  </View>
);

const f = StyleSheet.create({
  wrap:       { gap: 6, marginBottom: 4 },
  labelRow:   { flexDirection: 'row', alignItems: 'center', gap: 6 },
  label:      { flex: 1, fontSize: 13, fontFamily: 'PlusJakartaSans_600SemiBold', color: Colors.text },
  counter:    { fontSize: 11, fontFamily: 'PlusJakartaSans_400Regular', color: Colors.text },
  inputWrap:  {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    backgroundColor: Colors.surface,
    paddingHorizontal: 12,
    minHeight: 44,
  },
  inputMulti: { alignItems: 'flex-start', paddingVertical: 10 },
  prefix:     { fontSize: 14, color: Colors.text, fontFamily: 'PlusJakartaSans_400Regular', marginRight: 2 },
  input:      { flex: 1, fontSize: 14, fontFamily: 'PlusJakartaSans_400Regular', color: Colors.text },
  hint:       { fontSize: 11, color: Colors.text, fontFamily: 'PlusJakartaSans_400Regular', marginTop: 2, paddingLeft: 2 },
});

// ── Componente principal ───────────────────────────────────────────────────────

export const EditEventModal: React.FC<Props> = ({ visible, event, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [capacity, setCapacity] = useState('');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('COP');
  const [isPublished, setIsPublished] = useState(false);

  // Opciones de tipos de eventos
  const eventTypes = [
    'Taller', 'Exposición', 'Concierto', 'Charla', 
    'Networking', 'Venta', 'Colaboración', 'Otro'
  ];

  // Pre-poblar al abrir (modo edición)
  useEffect(() => {
    if (visible && event) {
      setTitle(event.title ?? '');
      setType(event.type ?? '');
      setDate(event.date ?? '');
      setTime(event.time ?? '');
      setLocation(event.location ?? '');
      setDescription(event.description ?? '');
      setCapacity(event.capacity?.toString() ?? '');
      setPrice(event.price?.toString() ?? '');
      setCurrency(event.currency ?? 'COP');
      setIsPublished(event.isPublished ?? false);
    } else if (visible) {
      // Reset para modo creación
      setTitle('');
      setType('');
      setDate('');
      setTime('');
      setLocation('');
      setDescription('');
      setCapacity('10');
      setPrice('0');
      setCurrency('COP');
      setIsPublished(false);
    }
  }, [visible, event]);

  const handleSave = () => {
    if (!title.trim() || !date.trim() || !time.trim()) {
      alert('Por favor completa los campos obligatorios');
      return;
    }

    onSave({
      title: title.trim(),
      type: type.trim(),
      date: date.trim(),
      time: time.trim(),
      location: location.trim(),
      description: description.trim(),
      capacity: capacity.trim(),
      price: price.trim(),
      currency: currency.trim(),
      isPublished,
    });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent statusBarTranslucent>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.kav}
      >
        <Pressable style={styles.overlay} onPress={onClose} />

        <View style={styles.sheet}>
          {/* Handle */}
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.headerBtn}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
            <Text style={styles.title}>{event ? 'Editar Evento' : 'Nuevo Evento'}</Text>
            <TouchableOpacity onPress={handleSave} style={styles.headerBtn}>
              <Text style={styles.saveText}>Guardar</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* ── Información básica ── */}
            <Text style={styles.sectionLabel}>INFORMACIÓN BÁSICA</Text>

            <Field
              label="Título del evento"
              icon="calendar-outline"
              value={title}
              onChangeText={setTitle}
              placeholder="ej. Taller de Fotografía"
              maxLength={80}
              hint="Un título claro y atractivo"
            />

            <Field
              label="Tipo de evento"
              icon="folder-outline"
              value={type}
              onChangeText={setType}
              placeholder="ej. Taller"
              maxLength={30}
            />

            {/* ── Fecha y hora ── */}
            <Text style={[styles.sectionLabel, { marginTop: 20 }]}>FECHA Y HORA</Text>

            <View style={styles.row}>
              <View style={styles.half}>
                <Field
                  label="Fecha"
                  icon="calendar-outline"
                  value={date}
                  onChangeText={setDate}
                  placeholder="2026-03-15"
                  hint="YYYY-MM-DD"
                />
              </View>
              <View style={styles.half}>
                <Field
                  label="Hora"
                  icon="time-outline"
                  value={time}
                  onChangeText={setTime}
                  placeholder="18:00"
                  hint="HH:MM"
                />
              </View>
            </View>

            <Field
              label="Ubicación"
              icon="location-outline"
              value={location}
              onChangeText={setLocation}
              placeholder="ej. Madrid, Centro Cultural"
              maxLength={100}
              hint="Dirección completa o link virtual"
            />

            {/* ── Detalles ── */}
            <Text style={[styles.sectionLabel, { marginTop: 20 }]}>DETALLES</Text>

            <Field
              label="Descripción"
              icon="document-text-outline"
              value={description}
              onChangeText={setDescription}
              placeholder="Describe tu evento..."
              multiline
              maxLength={500}
              hint="¿Qué van a aprender? ¿Qué incluye?"
            />

            <View style={styles.row}>
              <View style={styles.half}>
                <Field
                  label="Capacidad"
                  icon="people-outline"
                  value={capacity}
                  onChangeText={setCapacity}
                  placeholder="20"
                  keyboardType="numeric"
                  hint="Máximo de asistentes"
                />
              </View>
              <View style={styles.half}>
                <Field
                  label="Precio"
                  icon="cash-outline"
                  value={price}
                  onChangeText={setPrice}
                  placeholder="0"
                  keyboardType="numeric"
                  hint="0 si es gratis"
                />
              </View>
            </View>

            <Field
              label="Moneda"
              icon="globe-outline"
              value={currency}
              onChangeText={setCurrency}
              placeholder="COP"
              maxLength={3}
              hint="ej. COP, USD"
            />

            {/* ── Publicación ── */}
            <Text style={[styles.sectionLabel, { marginTop: 20 }]}>PUBLICACIÓN</Text>

            <View style={styles.switchRow}>
              <View style={styles.switchInfo}>
                <Text style={styles.switchLabel}>Publicar evento</Text>
                <Text style={styles.switchHint}>
                  {isPublished 
                    ? 'El evento será visible para todos' 
                    : 'El evento permanecerá borrador'
                  }
                </Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.switch,
                  isPublished && styles.switchActive
                ]}
                onPress={() => setIsPublished(!isPublished)}
              >
                <View style={[
                  styles.switchThumb,
                  isPublished && styles.switchThumbActive
                ]} />
              </TouchableOpacity>
            </View>

            {/* ── Tipos sugeridos ── */}
            <Text style={[styles.sectionLabel, { marginTop: 20 }]}>TIPOS SUGERIDOS</Text>
            <View style={styles.typeGrid}>
              {eventTypes.map((eventType) => (
                <TouchableOpacity
                  key={eventType}
                  style={[
                    styles.typeOption,
                    type === eventType && styles.typeOptionSelected
                  ]}
                  onPress={() => setType(eventType)}
                >
                  <Text style={[
                    styles.typeText,
                    type === eventType && styles.typeTextSelected
                  ]}>
                    {eventType}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={{ height: 32 }} />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  kav: { flex: 1, justifyContent: 'flex-end' },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheet: {
    backgroundColor: Colors.bg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '92%',
    overflow: 'hidden',
  },
  handle: {
    width: 36, height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerBtn: { minWidth: 70 },
  title: { fontSize: 16, fontFamily: 'PlusJakartaSans_700Bold', color: Colors.text },
  cancelText: { fontSize: 15, fontFamily: 'PlusJakartaSans_400Regular', color: Colors.text },
  saveText:   { fontSize: 15, fontFamily: 'PlusJakartaSans_700Bold', color: Colors.primary, textAlign: 'right' },
  content: { padding: 20, gap: 12 },
  sectionLabel: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: Colors.text,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  tagHint: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: Colors.text,
    marginBottom: 8,
    marginTop: -4,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  half: {
    flex: 1,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  switchInfo: {
    flex: 1,
  },
  switchLabel: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: Colors.text,
    marginBottom: 2,
  },
  switchHint: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: Colors.text,
  },
  switch: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.border,
    justifyContent: 'center',
  },
  switchActive: {
    backgroundColor: Colors.primary,
  },
  switchThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.white,
    alignSelf: 'center',
    marginLeft: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  switchThumbActive: {
    marginLeft: 22,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  typeOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.sm,
    backgroundColor: Colors.surface,
  },
  typeOptionSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  typeText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: Colors.text,
  },
  typeTextSelected: {
    color: Colors.white,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
});
