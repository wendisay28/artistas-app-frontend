// src/screens/artist/profile/modals/InfoProfesionalModal.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  Modal, View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform,
  ScrollView, StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// ── Paleta de identidad visual (CONSERVADA) ──────────────────────────────────
const Brand = {
  purple:       '#7c3aed',
  purpleLight:  'rgba(124,58,237,0.08)',
  purpleMid:    'rgba(124,58,237,0.25)',
  purpleFade:   'rgba(124,58,237,0.45)',
  purpleText:   'rgba(124,58,237,0.55)',
  blue:         '#2563eb',
  bg:           '#faf9ff',
  surface:      'rgba(255,255,255,0.85)',
  border:       'rgba(167,139,250,0.2)',
  borderFocus:  '#7c3aed',
  text:         '#1e1b4b',
  textSub:      'rgba(109,40,217,0.5)',
  textMuted:    'rgba(109,40,217,0.35)',
  textLight:    'rgba(124,58,237,0.25)',
  white:        '#fff',
};

// ── ScheduleSelector (CONSERVADO COMPLETO) ───────────────────────────────────
const DAYS = [
  { key: 'lunes',     short: 'L',  label: 'Lunes'      },
  { key: 'martes',    short: 'M',  label: 'Martes'     },
  { key: 'miercoles', short: 'X',  label: 'Miércoles'  },
  { key: 'jueves',    short: 'J',  label: 'Jueves'     },
  { key: 'viernes',   short: 'V',  label: 'Viernes'    },
  { key: 'sabado',    short: 'S',  label: 'Sábado'     },
  { key: 'domingo',   short: 'D',  label: 'Domingo'    },
];
const TIMES = [
  '6:00am','7:00am','8:00am','9:00am','10:00am','11:00am','12:00pm',
  '1:00pm','2:00pm','3:00pm','4:00pm','5:00pm','6:00pm','7:00pm',
  '8:00pm','9:00pm','10:00pm',
];

// ── Helpers (CONSERVADOS) ───────────────────────────────────────────────────
const DAY_KEY_MAP: Record<string, string> = { 'Lun': 'lunes', 'Mar': 'martes', 'Mié': 'miercoles', 'Jue': 'jueves', 'Vie': 'viernes', 'Sáb': 'sabado', 'Dom': 'domingo' };
const DAY_SHORT_MAP: Record<string, string> = { lunes: 'Lun', martes: 'Mar', miercoles: 'Mié', jueves: 'Jue', viernes: 'Vie', sabado: 'Sáb', domingo: 'Dom' };
const DEFAULT_SCHEDULE_DAYS = {
  lunes: { enabled: false, start: '9:00am', end: '6:00pm' }, martes: { enabled: false, start: '9:00am', end: '6:00pm' },
  miercoles: { enabled: false, start: '9:00am', end: '6:00pm' }, jueves: { enabled: false, start: '9:00am', end: '6:00pm' },
  viernes: { enabled: false, start: '9:00am', end: '6:00pm' }, sabado: { enabled: false, start: '9:00am', end: '6:00pm' },
  domingo: { enabled: false, start: '9:00am', end: '6:00pm' },
};

// ── Componente ScheduleSelector ───────────────────────────────────────────────
const ScheduleSelector: React.FC<{ scheduleDays: any; setScheduleDays: (days: any) => void; }> = ({ scheduleDays, setScheduleDays }) => {
  const [showTimePicker, setShowTimePicker] = useState<{ day: string; field: 'start' | 'end'; } | null>(null);
  const toggleDay = (dayKey: string) => {
    setScheduleDays((prev: any) => ({ ...prev, [dayKey]: { ...prev[dayKey], enabled: !prev[dayKey].enabled } }));
  };
  const updateTime = (dayKey: string, field: 'start' | 'end', value: string) => {
    setScheduleDays((prev: any) => ({ ...prev, [dayKey]: { ...prev[dayKey], [field]: value } }));
  };
  const enabledDays = DAYS.filter(d => scheduleDays[d.key]?.enabled);

  return (
    <View style={sc.wrapper}>
      <View style={sc.bubblesRow}>
        {DAYS.map((day) => {
          const active = scheduleDays[day.key]?.enabled;
          return (
            <TouchableOpacity key={day.key} activeOpacity={0.75} onPress={() => toggleDay(day.key)} style={[sc.bubble, active && sc.bubbleActive]}>
              <Text style={[sc.bubbleLetter, active && sc.bubbleLetterActive]}>{day.short}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {enabledDays.map((day) => (
        <View key={day.key} style={sc.timeRow}>
          <Text style={sc.dayLabel}>{day.label}</Text>
          <TouchableOpacity activeOpacity={0.75} onPress={() => setShowTimePicker({ day: day.key, field: 'start' })} style={sc.timeBtn}>
            <Text style={sc.timeBtnLabel}>Desde</Text>
            <View style={sc.timeBtnValue}>
              <Ionicons name="sunny-outline" size={11} color={Brand.purple} />
              <Text style={sc.timeBtnText}>{scheduleDays[day.key].start}</Text>
            </View>
          </TouchableOpacity>
          <View style={sc.timeDash} />
          <TouchableOpacity activeOpacity={0.75} onPress={() => setShowTimePicker({ day: day.key, field: 'end' })} style={sc.timeBtn}>
            <Text style={sc.timeBtnLabel}>Hasta</Text>
            <View style={[sc.timeBtnValue, sc.timeBtnValueEnd]}>
              <Ionicons name="moon-outline" size={11} color={Brand.blue} />
              <Text style={sc.timeBtnText}>{scheduleDays[day.key].end}</Text>
            </View>
          </TouchableOpacity>
        </View>
      ))}
      {showTimePicker && (
        <View style={sc.timePickerOverlay}>
          <View style={sc.timePickerModal}>
            <Text style={sc.timePickerTitle}>Seleccionar hora</Text>
            <ScrollView style={sc.timeList} showsVerticalScrollIndicator={false}>
              {TIMES.map((time) => (
                <TouchableOpacity key={time} activeOpacity={0.75} onPress={() => {
                  if (showTimePicker) {
                    updateTime(showTimePicker.day, showTimePicker.field, time);
                    setShowTimePicker(null);
                  }
                }} style={sc.timeOption}>
                  <Text style={sc.timeOptionText}>{time}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity activeOpacity={0.75} onPress={() => setShowTimePicker(null)} style={sc.timePickerCancel}>
              <Text style={sc.timePickerCancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

// ── Estilos para ScheduleSelector ───────────────────────────────────────────────
const sc = StyleSheet.create({
  wrapper: { marginTop: 16, marginBottom: 8 },
  bubblesRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16, gap: 4 },
  bubble: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.6)', borderWidth: 1.5, borderColor: Brand.border,
    alignItems: 'center', justifyContent: 'center',
  },
  bubbleActive: { backgroundColor: Brand.purple, borderColor: Brand.purple },
  bubbleLetter: { fontSize: 12, fontFamily: 'PlusJakartaSans_700Bold', color: Brand.textMuted },
  bubbleLetterActive: { color: '#fff' },
  timeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  dayLabel: { width: 70, fontSize: 13, fontFamily: 'PlusJakartaSans_600SemiBold', color: Brand.text },
  timeBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 8, borderWidth: 1, borderColor: Brand.border },
  timeBtnLabel: { fontSize: 10, fontFamily: 'PlusJakartaSans_500Medium', color: Brand.textMuted, marginBottom: 2 },
  timeBtnValue: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  timeBtnValueEnd: { alignSelf: 'flex-end' },
  timeBtnText: { fontSize: 12, fontFamily: 'PlusJakartaSans_600SemiBold', color: Brand.text },
  timeDash: { width: 16, height: 1, backgroundColor: Brand.border, marginHorizontal: 8 },
  timePickerOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center' },
  timePickerModal: { backgroundColor: '#fff', borderRadius: 16, width: '80%', maxHeight: 300 },
  timePickerTitle: { fontSize: 16, fontFamily: 'PlusJakartaSans_700Bold', color: Brand.text, textAlign: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: Brand.border },
  timeList: { maxHeight: 200 },
  timeOption: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Brand.border },
  timeOptionText: { fontSize: 14, fontFamily: 'PlusJakartaSans_500Medium', color: Brand.text, textAlign: 'center' },
  timePickerCancel: { paddingVertical: 12, borderTopWidth: 1, borderTopColor: Brand.border },
  timePickerCancelText: { fontSize: 14, fontFamily: 'PlusJakartaSans_600SemiBold', color: Brand.purple, textAlign: 'center' },
});

// ── Field (Optimizado para evitar parpadeos) ──────────────────────────────────
type FieldProps = {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  autoFocus?: boolean;
};

const Field: React.FC<FieldProps> = ({
  label, value, onChangeText, placeholder, icon, autoFocus,
}) => {
  const [focused, setFocused] = useState(false);
  
  return (
    <View style={f.wrapper}>
      <Text style={f.label}>{label}</Text>
      <View style={[f.box, focused && f.boxFocused]}>
        <View style={f.icon}>
          <Ionicons
            name={icon}
            size={17}
            color={focused ? '#7c3aed' : 'rgba(124,58,237,0.3)'}
          />
        </View>
        <TextInput
          style={f.input}
          value={value || ''}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="rgba(124,58,237,0.25)"
          autoFocus={autoFocus}
          onFocus={() => {
            // Log sencillo para no saturar la consola
            console.log(`🎯 BuscArt - Focus: ${label}`);
            setFocused(true);
          }}
          onBlur={() => setFocused(false)}
          underlineColorAndroid="transparent"
        />
        {(value && value.length > 0) && (
          <TouchableOpacity
            onPress={() => onChangeText('')}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="close-circle" size={16} color="rgba(124,58,237,0.3)" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

// ... Estilos f y Componente AvailabilitySelector se mantienen igual que tu versión previa ...
const f = StyleSheet.create({
  wrapper: { marginBottom: 20 },
  label: {
    fontSize: 9.5, fontFamily: 'PlusJakartaSans_600SemiBold',
    color: 'rgba(124,58,237,0.5)', letterSpacing: 0.8,
    marginBottom: 8, textTransform: 'uppercase',
  },
  box: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.75)',
    borderRadius: 14, paddingHorizontal: 14, paddingVertical: 13,
    borderWidth: 1.5, borderColor: 'rgba(167,139,250,0.25)',
  },
  boxFocused: {
    borderColor: '#7c3aed',
    backgroundColor: '#fff',
    elevation: 2,
  },
  icon:  { marginRight: 10 },
  input: {
    flex: 1, fontSize: 14.5,
    fontFamily: 'PlusJakartaSans_400Regular', color: '#1e1b4b',
    paddingVertical: Platform.OS === 'ios' ? 0 : 2, // Evita saltos en Android
  },
});

const OPTIONS = [
  { label: 'Disponible',  color: '#16a34a' },
  { label: 'Ocupado',      color: '#ef4444' },
  { label: 'Bajo pedido', color: '#d97706' },
];

const AvailabilitySelector: React.FC<{
  value: string;
  onSelect: (v: string) => void;
}> = ({ value, onSelect }) => (
  <View style={av.wrapper}>
    <Text style={av.label}>DISPONIBILIDAD</Text>
    <View style={av.row}>
      {OPTIONS.map((opt) => {
        const active = value === opt.label;
        return (
          <TouchableOpacity
            key={opt.label}
            activeOpacity={0.8}
            style={[av.pill, active && { borderColor: opt.color, backgroundColor: opt.color + '18' }]}
            onPress={() => onSelect(opt.label)}
          >
            <View style={[av.dot, { backgroundColor: opt.color }]} />
            <Text style={[av.pillText, active && { color: opt.color, fontFamily: 'PlusJakartaSans_700Bold' }]}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  </View>
);

const av = StyleSheet.create({
  wrapper: { marginBottom: 8 },
  label: {
    fontSize: 9.5, fontFamily: 'PlusJakartaSans_600SemiBold',
    color: 'rgba(124,58,237,0.5)', letterSpacing: 0.8,
    marginBottom: 12,
  },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  pill: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: 100, borderWidth: 1.5,
    borderColor: 'rgba(167,139,250,0.25)',
    backgroundColor: 'rgba(255,255,255,0.75)',
  },
  dot:      { width: 8, height: 8, borderRadius: 4, marginRight: 7 },
  pillText: {
    fontSize: 13, fontFamily: 'PlusJakartaSans_500Medium',
    color: 'rgba(109,40,217,0.45)',
  },
});

// ── Modal principal ───────────────────────────────────────────────────────────

type ModalData = {
  yearsExperience: string;
  style: string;
  responseTime: string;
  availability: string;
  schedule: string;
};

type Props = {
  visible: boolean;
  initialData?: ModalData;
  onClose: () => void;
  onSave: (data: ModalData) => void;
};

export const InfoProfesionalModal: React.FC<Props> = ({
  visible, initialData, onClose, onSave,
}) => {
  const insets = useSafeAreaInsets();
  const [data, setData] = useState(initialData || {
    yearsExperience: '',
    style: '',
    availability: 'Disponible',
    responseTime: '',
    schedule: '',
  });
  const [scheduleDays, setScheduleDays] = useState<any>(DEFAULT_SCHEDULE_DAYS);

  useEffect(() => {
    if (visible && initialData) {
      setData(initialData);
      
      // Parsear horario guardado → scheduleDays
      const parsed = Object.fromEntries(
        Object.entries(DEFAULT_SCHEDULE_DAYS).map(([k, v]) => [k, { ...v }])
      );
      const scheduleStr = initialData.schedule as string | undefined;
      if (scheduleStr) {
        scheduleStr.split(',').forEach(part => {
          const m = part.trim().match(/^(\S+)\s+(.+)-(.+)$/);
          if (m) {
            const dayKey = DAY_KEY_MAP[m[1]];
            if (dayKey && parsed[dayKey]) {
              parsed[dayKey].enabled = true;
              parsed[dayKey].start = m[2];
              parsed[dayKey].end = m[3];
            }
          }
        });
      }
      setScheduleDays(parsed);
    }
  }, [visible, initialData]);

  const update = useCallback(
    (key: keyof ModalData) => (v: string) =>
      setData((prev) => ({ ...prev, [key]: v })),
    []
  );

  const handleSave = useCallback(() => {
    const enabled = Object.entries(scheduleDays).filter(([, d]: any) => d.enabled);
    const scheduleText = enabled.length > 0 ? enabled.map(([k, d]: any) => `${DAY_SHORT_MAP[k]} ${d.start}-${d.end}`).join(', ') : 'No disponible';
    onSave({ ...data, schedule: scheduleText });
  }, [data, scheduleDays, onSave]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      statusBarTranslucent={true}
      onRequestClose={onClose}
    >
      <View style={[s.safeArea, { paddingTop: insets.top }]}>
        <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
        
        <KeyboardAvoidingView
          style={s.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
          {/* Header */}
          <View style={s.header}>
            <TouchableOpacity onPress={onClose} style={s.headerSide} activeOpacity={0.7}>
              <Text style={s.cancelText}>Cancelar</Text>
            </TouchableOpacity>

            <View style={s.headerCenter}>
              <Text style={s.title}>Info Profesional</Text>
            </View>

            <TouchableOpacity onPress={handleSave} style={s.headerSideRight} activeOpacity={0.85}>
              <LinearGradient
                colors={['#7c3aed', '#2563eb']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={s.saveBtn}
              >
                <Text style={s.saveBtnText}>Guardar</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={s.flex}
            contentContainerStyle={[
                s.content,
                { paddingBottom: insets.bottom + 100 } // Padding extra para que el teclado no tape el último campo
            ]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Field
              label="Años de experiencia"
              value={data.yearsExperience}
              onChangeText={update('yearsExperience')}
              placeholder="Ej. 8 años"
              icon="time-outline"
              autoFocus={true}
            />
            <Field
              label="Estilo artístico"
              value={data.style}
              onChangeText={update('style')}
              placeholder="Ej. Minimalista, expresionista..."
              icon="color-palette-outline"
            />
            <Text style={f.label}>Horario de atención</Text>
            <ScheduleSelector scheduleDays={scheduleDays} setScheduleDays={setScheduleDays} />
            <AvailabilitySelector
              value={data.availability}
              onSelect={update('availability')}
            />
          </ScrollView>

        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const s = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#faf9ff', // El fondo que pediste
  },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(167,139,250,0.15)',
    backgroundColor: '#fff',
  },
  headerSide: { width: 90, alignItems: 'flex-start' },
  headerSideRight: { width: 90, alignItems: 'flex-end' },
  headerCenter: { flex: 1, alignItems: 'center' },
  title: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#1e1b4b',
  },
  cancelText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: 'rgba(124,58,237,0.55)',
  },
  saveBtn: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 7,
  },
  saveBtnText: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#fff',
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
});