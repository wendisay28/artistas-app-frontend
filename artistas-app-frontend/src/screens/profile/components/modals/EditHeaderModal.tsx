// ─────────────────────────────────────────────────────────────────────────────
// EditHeaderModal.tsx — Editar info del encabezado del perfil
// nombre · handle · rol · ubicación · horario · bio corta · tags de arte
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
import { Artist } from '../types';

// ── Tipos ─────────────────────────────────────────────────────────────────────

export type EditHeaderData = {
  name: string;
  handle: string;
  role: string;
  location: string;
  schedule: string;
  bio: string;
  tags: [string, string, string];
};

type Props = {
  visible: boolean;
  artist: Artist;
  onClose: () => void;
  onSave: (data: EditHeaderData) => void;
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
  keyboardType?: 'default' | 'email-address' | 'url';
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
        placeholderTextColor={Colors.text3}
        multiline={multiline}
        maxLength={maxLength}
        keyboardType={keyboardType}
        autoCapitalize="none"
      />
    </View>
    {hint ? <Text style={f.hint}>{hint}</Text> : null}
  </View>
);

// ── Componente de selector de horario ───────────────────────────────────────
const ScheduleSelector: React.FC<{
  scheduleDays: any;
  setScheduleDays: (days: any) => void;
}> = ({ scheduleDays, setScheduleDays }) => {
  
  const [showTimePicker, setShowTimePicker] = useState<{
    day: string;
    field: 'start' | 'end';
  } | null>(null);
  
  const days = [
    { key: 'lunes', label: 'Lunes', short: 'Lun' },
    { key: 'martes', label: 'Martes', short: 'Mar' },
    { key: 'miercoles', label: 'Miércoles', short: 'Mié' },
    { key: 'jueves', label: 'Jueves', short: 'Jue' },
    { key: 'viernes', label: 'Viernes', short: 'Vie' },
    { key: 'sabado', label: 'Sábado', short: 'Sáb' },
    { key: 'domingo', label: 'Domingo', short: 'Dom' },
  ];

  const timeOptions = [
    '6:00am', '7:00am', '8:00am', '9:00am', '10:00am', '11:00am', '12:00pm',
    '1:00pm', '2:00pm', '3:00pm', '4:00pm', '5:00pm', '6:00pm', '7:00pm', '8:00pm', '9:00pm', '10:00pm'
  ];

  const toggleDay = (dayKey: string) => {
    setScheduleDays(prev => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        enabled: !prev[dayKey].enabled
      }
    }));
  };

  const updateTime = (dayKey: string, field: 'start' | 'end', value: string) => {
    setScheduleDays(prev => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        [field]: value
      }
    }));
  };

  return (
    <View style={s.scheduleContainer}>
      <View style={s.scheduleHeader}>
        <Text style={f.label}>Horario disponible</Text>
        <Text style={s.scheduleHint}>Activa los días y configura tus horas</Text>
      </View>
      
      {days.map((day) => (
        <View key={day.key} style={s.dayContainer}>
          <TouchableOpacity
            style={[s.dayToggle, scheduleDays[day.key].enabled && s.dayToggleActive]}
            onPress={() => toggleDay(day.key)}
          >
            <View style={s.dayToggleContent}>
              <Text style={[s.dayLabel, scheduleDays[day.key].enabled && s.dayLabelActive]}>
                {day.short}
              </Text>
              <Text style={[s.dayLabelFull, scheduleDays[day.key].enabled && s.dayLabelFullActive]}>
                {day.label}
              </Text>
            </View>
          </TouchableOpacity>
          
          {scheduleDays[day.key].enabled && (
            <View style={s.timeContainer}>
              <View style={s.timeField}>
                <Text style={s.timeFieldLabel}>Desde</Text>
                <TouchableOpacity 
                  style={[s.timeSelector, s.timeSelectorStart]}
                  onPress={() => setShowTimePicker({ day: day.key, field: 'start' })}
                >
                  <Ionicons name="time-outline" size={14} color={Colors.primary} />
                  <Text style={s.timeText}>{scheduleDays[day.key].start}</Text>
                  <Ionicons name="chevron-down" size={12} color={Colors.text3} />
                </TouchableOpacity>
              </View>
              
              <View style={s.timeField}>
                <Text style={s.timeFieldLabel}>Hasta</Text>
                <TouchableOpacity 
                  style={[s.timeSelector, s.timeSelectorEnd]}
                  onPress={() => setShowTimePicker({ day: day.key, field: 'end' })}
                >
                  <Ionicons name="time-outline" size={14} color={Colors.primary} />
                  <Text style={s.timeText}>{scheduleDays[day.key].end}</Text>
                  <Ionicons name="chevron-down" size={12} color={Colors.text3} />
                </TouchableOpacity>
              </View>
            </View>
          )}
          
          {!scheduleDays[day.key].enabled && (
            <View style={s.disabledTimeContainer}>
              <Text style={s.disabledText}>No disponible</Text>
            </View>
          )}
        </View>
      ))}
      
      {/* Modal de selección de hora */}
      {showTimePicker && (
        <View style={s.timePickerModal}>
          <View style={s.timePickerContent}>
            <View style={s.timePickerHeader}>
              <Text style={s.timePickerTitle}>
                {showTimePicker.field === 'start' ? 'Hora de inicio' : 'Hora de fin'}
              </Text>
              <TouchableOpacity onPress={() => setShowTimePicker(null)}>
                <Ionicons name="close" size={24} color={Colors.text2} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={s.timeOptionsList} showsVerticalScrollIndicator={false}>
              {timeOptions.map((time) => (
                <TouchableOpacity
                  key={time}
                  style={[
                    s.timeOption,
                    scheduleDays[showTimePicker.day][showTimePicker.field] === time && s.timeOptionSelected
                  ]}
                  onPress={() => {
                    updateTime(showTimePicker.day, showTimePicker.field, time);
                    setShowTimePicker(null);
                  }}
                >
                  <Text style={[
                    s.timeOptionText,
                    scheduleDays[showTimePicker.day][showTimePicker.field] === time && s.timeOptionTextSelected
                  ]}>
                    {time}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      )}
    </View>
  );
};

const s = StyleSheet.create({
  scheduleContainer: {
    gap: 12,
  },
  scheduleHeader: {
    marginBottom: 8,
  },
  scheduleHint: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: Colors.text3,
    marginTop: 4,
  },
  dayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dayToggle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayToggleActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  dayToggleContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayLabel: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: Colors.text3,
  },
  dayLabelActive: {
    color: Colors.white,
  },
  dayLabelFull: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: Colors.text3,
    marginTop: 2,
  },
  dayLabelFullActive: {
    color: Colors.white,
  },
  timeContainer: {
    flex: 1,
    flexDirection: 'row',
    gap: 12,
  },
  timeField: {
    flex: 1,
    gap: 4,
  },
  timeFieldLabel: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: Colors.text2,
    marginBottom: 2,
  },
  timeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
  },
  timeSelectorStart: {
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  timeSelectorEnd: {
    borderLeftWidth: 3,
    borderLeftColor: Colors.accent,
  },
  timeText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: Colors.text,
    flex: 1,
  },
  disabledTimeContainer: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  disabledText: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: Colors.text3,
    fontStyle: 'italic',
  },
  timeSeparator: {
    fontSize: 14,
    color: Colors.text3,
    fontFamily: 'PlusJakartaSans_400Regular',
  },
  // Modal de selección de hora
  timePickerModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timePickerContent: {
    backgroundColor: Colors.bg,
    borderRadius: 16,
    padding: 20,
    width: '85%',
    maxHeight: '70%',
  },
  timePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  timePickerTitle: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: Colors.text,
    flex: 1,
  },
  timeOptionsList: {
    maxHeight: 250,
  },
  timeOption: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeOptionSelected: {
    backgroundColor: Colors.accentLight,
    borderLeftWidth: 3,
    borderLeftColor: Colors.accent,
  },
  timeOptionText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: Colors.text,
    flex: 1,
  },
  timeOptionTextSelected: {
    color: Colors.accent,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  timePickerCancel: {
    marginTop: 16,
    paddingVertical: 12,
    backgroundColor: Colors.surface,
    borderRadius: 8,
    alignItems: 'center',
  },
  timePickerCancelText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: Colors.text2,
  },
});

const f = StyleSheet.create({
  wrap:       { gap: 6, marginBottom: 4 },
  labelRow:   { flexDirection: 'row', alignItems: 'center', gap: 6 },
  label:      { flex: 1, fontSize: 13, fontFamily: 'PlusJakartaSans_600SemiBold', color: Colors.text },
  counter:    { fontSize: 11, fontFamily: 'PlusJakartaSans_400Regular', color: Colors.text3 },
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
  prefix:     { fontSize: 14, color: Colors.text3, fontFamily: 'PlusJakartaSans_400Regular', marginRight: 2 },
  input:      { flex: 1, fontSize: 14, fontFamily: 'PlusJakartaSans_400Regular', color: Colors.text },
  hint:       { fontSize: 11, color: Colors.text3, fontFamily: 'PlusJakartaSans_400Regular', marginTop: 2, paddingLeft: 2 },
});

// ── Helpers de horario ────────────────────────────────────────────────────────

const DAY_KEY_MAP: Record<string, string> = {
  'Lun': 'lunes', 'Mar': 'martes', 'Mié': 'miercoles',
  'Jue': 'jueves', 'Vie': 'viernes', 'Sáb': 'sabado', 'Dom': 'domingo',
};
const DAY_SHORT_MAP: Record<string, string> = {
  lunes: 'Lun', martes: 'Mar', miercoles: 'Mié',
  jueves: 'Jue', viernes: 'Vie', sabado: 'Sáb', domingo: 'Dom',
};
// Orden de los días en la semana (para rangos "Lun-Vie")
const DAY_ORDER = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

const DEFAULT_SCHEDULE_DAYS = {
  lunes:     { enabled: false, start: '9:00am', end: '6:00pm' },
  martes:    { enabled: false, start: '9:00am', end: '6:00pm' },
  miercoles: { enabled: false, start: '9:00am', end: '6:00pm' },
  jueves:    { enabled: false, start: '9:00am', end: '6:00pm' },
  viernes:   { enabled: false, start: '9:00am', end: '6:00pm' },
  sabado:    { enabled: false, start: '9:00am', end: '6:00pm' },
  domingo:   { enabled: false, start: '9:00am', end: '6:00pm' },
};

/** Convierte "9am" → "9:00am", "10pm" → "10:00pm" */
const restoreTime = (t: string) =>
  t.trim().replace(/^(\d{1,2})(am|pm)$/i, '$1:00$2').toLowerCase();

/** Parsea el string guardado de vuelta a scheduleDays */
const parseScheduleStr = (str?: string): typeof DEFAULT_SCHEDULE_DAYS => {
  const result: typeof DEFAULT_SCHEDULE_DAYS = JSON.parse(JSON.stringify(DEFAULT_SCHEDULE_DAYS));
  if (!str?.trim() || str === 'No disponible') return result;

  // Formato 1: lista de días individuales "Lun 9am-6pm, Dom 7am-5pm"
  if (str.includes(',') || /^(Dom|Lun|Mar|Mié|Jue|Vie|Sáb)\s+\d/.test(str)) {
    for (const part of str.split(',').map(s => s.trim())) {
      const m = part.match(/^(Dom|Lun|Mar|Mié|Jue|Vie|Sáb)\s+(.+?)-(.+)$/);
      if (m) {
        const key = DAY_KEY_MAP[m[1]];
        if (key) result[key as keyof typeof result] = { enabled: true, start: restoreTime(m[2]), end: restoreTime(m[3]) };
      }
    }
    return result;
  }

  // Formato 2: rango "Lun-Vie 6pm-10pm"
  const rangeM = str.match(/^(Dom|Lun|Mar|Mié|Jue|Vie|Sáb)-(Dom|Lun|Mar|Mié|Jue|Vie|Sáb)\s+(.+?)-(.+)$/);
  if (rangeM) {
    const si = DAY_ORDER.indexOf(rangeM[1]);
    const ei = DAY_ORDER.indexOf(rangeM[2]);
    const start = restoreTime(rangeM[3]);
    const end   = restoreTime(rangeM[4]);
    const indices = si <= ei
      ? Array.from({ length: ei - si + 1 }, (_, i) => si + i)
      : [...Array.from({ length: 7 - si }, (_, i) => si + i), ...Array.from({ length: ei + 1 }, (_, i) => i)];
    for (const idx of indices) {
      const key = DAY_KEY_MAP[DAY_ORDER[idx]];
      if (key) result[key as keyof typeof result] = { enabled: true, start, end };
    }
    return result;
  }

  return result;
};

// ── Componente principal ───────────────────────────────────────────────────────

export const EditHeaderModal: React.FC<Props> = ({ visible, artist, onClose, onSave }) => {
  const [name,     setName]     = useState('');
  const [handle,   setHandle]   = useState('');
  const [role,     setRole]     = useState('');
  const [location, setLocation] = useState('');
  const [bio,      setBio]      = useState('');
  const [tag1,     setTag1]     = useState('');
  const [tag2,     setTag2]     = useState('');
  const [tag3,     setTag3]     = useState('');

  const [scheduleDays, setScheduleDays] = useState<typeof DEFAULT_SCHEDULE_DAYS>(DEFAULT_SCHEDULE_DAYS);

  // Pre-poblar al abrir — incluyendo el horario guardado
  useEffect(() => {
    if (visible) {
      setName(artist.name ?? '');
      setHandle((artist.handle ?? '').replace(/^@/, ''));
      setRole(artist.role ?? '');
      setLocation(artist.location ?? '');
      setBio(artist.bio ?? '');
      const [t1 = '', t2 = '', t3 = ''] = (artist.tags ?? []).map(t => t.label);
      setTag1(t1); setTag2(t2); setTag3(t3);
      // Parsear el horario guardado → scheduleDays
      setScheduleDays(parseScheduleStr((artist as any).schedule));
    }
  }, [visible, artist]);

  const handleSave = () => {
    // Siempre guardar en formato individual por día — fácil de parsear y mostrar
    const enabled = (Object.entries(scheduleDays) as [string, { enabled: boolean; start: string; end: string }][])
      .filter(([, d]) => d.enabled);

    const DAY_IDX: Record<string, number> = {
      lunes: 1, martes: 2, miercoles: 3, jueves: 4, viernes: 5, sabado: 6, domingo: 0,
    };
    // Ordenar por día de la semana (Lun → Dom)
    enabled.sort(([a], [b]) => DAY_IDX[a] - DAY_IDX[b]);

    const scheduleText = enabled.length > 0
      ? enabled
          .map(([key, d]) => `${DAY_SHORT_MAP[key]} ${d.start.replace(':00', '')}-${d.end.replace(':00', '')}`)
          .join(', ')
      : 'No disponible';

    onSave({
      name:     name.trim(),
      handle:   handle.trim().replace(/^@/, ''),
      role:     role.trim(),
      location: location.trim(),
      schedule: scheduleText,
      bio:      bio.trim(),
      tags:     [tag1.trim(), tag2.trim(), tag3.trim()],
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
            <Text style={styles.title}>Editar perfil</Text>
            <TouchableOpacity onPress={handleSave} style={styles.headerBtn}>
              <Text style={styles.saveText}>Guardar</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* ── Identidad ── */}
            <Text style={styles.sectionLabel}>IDENTIDAD</Text>

            <Field
              label="Nombre"
              icon="person-outline"
              value={name}
              onChangeText={setName}
              placeholder="Tu nombre completo"
              maxLength={60}
            />
            <Field
              label="Username"
              icon="at-outline"
              value={handle}
              onChangeText={setHandle}
              placeholder="tu_usuario"
              prefix="@"
              hint="Sin espacios ni caracteres especiales"
            />
            <Field
              label="Rol / Especialidad"
              icon="briefcase-outline"
              value={role}
              onChangeText={setRole}
              placeholder="ej. Artista Visual, Fotógrafo..."
              maxLength={50}
            />

            {/* ── Ubicación y horario ── */}
            <Text style={[styles.sectionLabel, { marginTop: 20 }]}>UBICACIÓN Y HORARIO</Text>

            <Field
              label="Ciudad"
              icon="location-outline"
              value={location}
              onChangeText={setLocation}
              placeholder="Ciudad, País"
            />
            
            <ScheduleSelector 
              scheduleDays={scheduleDays}
              setScheduleDays={setScheduleDays}
            />

            {/* ── Bio corta ── */}
            <Text style={[styles.sectionLabel, { marginTop: 20 }]}>BIO CORTA</Text>

            <Field
              label="Descripción breve"
              icon="create-outline"
              value={bio}
              onChangeText={setBio}
              placeholder="Cuéntale al mundo quién eres..."
              multiline
              maxLength={105}
            />

            {/* ── Tags de arte ── */}
            <Text style={[styles.sectionLabel, { marginTop: 20 }]}>ETIQUETAS DE ARTE</Text>
            <Text style={styles.tagHint}>
              Agrega hasta 3 etiquetas que describan tu arte
            </Text>

            {[
              { value: tag1, onChange: setTag1, placeholder: 'ej. Arte Digital' },
              { value: tag2, onChange: setTag2, placeholder: 'ej. Pintura' },
              { value: tag3, onChange: setTag3, placeholder: 'ej. Ilustración' },
            ].map((t, i) => (
              <Field
                key={i}
                label={`Etiqueta ${i + 1}`}
                icon="pricetag-outline"
                value={t.value}
                onChangeText={t.onChange}
                placeholder={t.placeholder}
                maxLength={30}
              />
            ))}

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
    backgroundColor: Colors.border2,
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
  cancelText: { fontSize: 15, fontFamily: 'PlusJakartaSans_400Regular', color: Colors.text2 },
  saveText:   { fontSize: 15, fontFamily: 'PlusJakartaSans_700Bold', color: Colors.primary, textAlign: 'right' },
  content: { padding: 20, gap: 12 },
  sectionLabel: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: Colors.text3,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  tagHint: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: Colors.text3,
    marginBottom: 8,
    marginTop: -4,
  },
});
