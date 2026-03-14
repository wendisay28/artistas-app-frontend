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
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Artist } from '../types';
import { ARTIST_CATEGORIES } from '../../../../constants/artistCategories';

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
export const DEFAULT_SCHEDULE_DAYS = {
  lunes: { enabled: false, start: '9:00am', end: '6:00pm' }, martes: { enabled: false, start: '9:00am', end: '6:00pm' },
  miercoles: { enabled: false, start: '9:00am', end: '6:00pm' }, jueves: { enabled: false, start: '9:00am', end: '6:00pm' },
  viernes: { enabled: false, start: '9:00am', end: '6:00pm' }, sabado: { enabled: false, start: '9:00am', end: '6:00pm' },
  domingo: { enabled: false, start: '9:00am', end: '6:00pm' },
};

// ── Componente ScheduleSelector ───────────────────────────────────────────────
export const ScheduleSelector: React.FC<{ scheduleDays: any; setScheduleDays: (days: any) => void; }> = ({ scheduleDays, setScheduleDays }) => {
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

// ── Tipos ─────────────────────────────────────────────────────────────────────
export type EditHeaderData = {
  name: string;
  handle: string;
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

// ── Field (CORREGIDO PARA EVITAR EL BLUR/PARPADEO) ─────────────────────────────
const Field: React.FC<any> = ({
  label, icon, value, onChangeText, placeholder,
  multiline, maxLength, hint, prefix, autoFocus, keyboardType = 'default',
}) => {
  const [focused, setFocused] = useState(false);
  return (
    <View style={f.wrap}>
      <View style={f.labelRow}>
        <Ionicons name={icon} size={13} color={Brand.purple} />
        <Text style={f.label}>{label}</Text>
        {maxLength && <Text style={f.counter}>{value.length}/{maxLength}</Text>}
      </View>
      <View style={[f.inputWrap, multiline && f.inputMulti, focused && f.inputFocused]}>
        {prefix ? <Text style={f.prefix}>{prefix}</Text> : null}
        <TextInput
          style={[
            f.input, 
            multiline && { height: 80, textAlignVertical: 'top', paddingTop: Platform.OS === 'ios' ? 0 : 4 }
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Brand.textLight}
          multiline={multiline}
          maxLength={maxLength}
          keyboardType={keyboardType}
          autoCapitalize="none"
          autoFocus={autoFocus}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {value.length > 0 && !multiline && (
          <TouchableOpacity onPress={() => onChangeText('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="close-circle" size={16} color={Brand.purpleMid} />
          </TouchableOpacity>
        )}
      </View>
      {hint ? <Text style={f.hint}>{hint}</Text> : null}
    </View>
  );
};

const f = StyleSheet.create({
  wrap:       { gap: 6, marginBottom: 4 },
  labelRow:   { flexDirection: 'row', alignItems: 'center', gap: 6 },
  label:      { flex: 1, fontSize: 9.5, fontFamily: 'PlusJakartaSans_600SemiBold', color: Brand.purpleFade, letterSpacing: 0.8, textTransform: 'uppercase' },
  counter:    { fontSize: 11, fontFamily: 'PlusJakartaSans_400Regular', color: Brand.textMuted },
  inputWrap:  { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: Brand.border, borderRadius: 14, backgroundColor: Brand.surface, paddingHorizontal: 14, minHeight: 48 },
  inputFocused: { borderColor: Brand.purple, backgroundColor: '#fff', elevation: 2 },
  inputMulti: { alignItems: 'flex-start', paddingVertical: 12 },
  prefix:     { fontSize: 14, color: Brand.textMuted, fontFamily: 'PlusJakartaSans_400Regular', marginRight: 2 },
  input:      { flex: 1, fontSize: 14.5, fontFamily: 'PlusJakartaSans_400Regular', color: Brand.text },
  hint:       { fontSize: 11, color: Brand.textMuted, fontFamily: 'PlusJakartaSans_400Regular', marginTop: 2, paddingLeft: 2 },
});

// ── SectionLabel ──────────────────────────────────────────────────────────────
const SectionLabel: React.FC<{ label: string; style?: object }> = ({ label, style }) => (
  <Text style={[sl.text, style]}>{label}</Text>
);
const sl = StyleSheet.create({
  text: { fontSize: 9.5, fontFamily: 'PlusJakartaSans_700Bold', color: Brand.purpleFade, letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 14, marginTop: 8 },
});

// ── Componente Principal ──────────────────────────────────────────────────────
export const EditHeaderModal: React.FC<Props> = ({ visible, artist, onClose, onSave }) => {
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const [location, setLocation] = useState('');
  const [barrio, setBarrio] = useState('');
  const [bio, setBio] = useState('');
  const [tag1, setTag1] = useState('');
  const [tag2, setTag2] = useState('');
  const [tag3, setTag3] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTagInput, setCustomTagInput] = useState('');

  // Función para obtener etiquetas sugeridas (misma que en PortalAutorScreen)
  const getTagSuggestions = (): string[] => {
    const categoryId = (artist?.category?.categoryId ?? '').toLowerCase();
    const disciplineId = (artist?.category?.disciplineId ?? '').toLowerCase();
    const specialty = (artist?.specialty ?? '').toLowerCase();
    const genre = (artist?.tags?.[0]?.label ?? '').toLowerCase();
    
    let allFoundTags: string[] = [];
    let bestMatchTags: string[] = [];
    
    // Prioridad de categorías (más relevantes primero)
    const priorityOrder = ['artes-visuales', 'artes-escenicas', 'musica', 'audiovisual', 'diseno', 'comunicacion', 'cultura-turismo'];
    
    const sortedCategories = [...ARTIST_CATEGORIES].sort((a, b) => {
      const aIndex = priorityOrder.indexOf(a.id);
      const bIndex = priorityOrder.indexOf(b.id);
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });
    
    for (const cat of sortedCategories) {
      // First try to match by category ID (prioridad alta)
      if (categoryId && cat.id.includes(categoryId) || categoryId.includes(cat.id)) {
        for (const disc of cat.disciplines) {
          if (disc.suggestedTags?.length) {
            const tags = disc.suggestedTags.map(t => t.charAt(0).toUpperCase() + t.slice(1));
            bestMatchTags = tags;
            break;
          }
        }
      }
      
      // Then try to match by discipline/genre
      for (const disc of cat.disciplines) {
        const matches =
          disc.id.includes(genre) || genre.includes(disc.id) ||
          disc.id.includes(specialty) || specialty.includes(disc.id) ||
          disc.id.includes(disciplineId) || disciplineId.includes(disc.id);
        if (matches && disc.suggestedTags?.length) {
          const tags = disc.suggestedTags.map(t => t.charAt(0).toUpperCase() + t.slice(1));
          allFoundTags.push(...tags);
          
          if (bestMatchTags.length === 0) {
            bestMatchTags = tags;
          }
        }
      }
    }
    
    let specificTags = bestMatchTags.length > 0 ? bestMatchTags : [...new Set(allFoundTags)];
    
    // Siempre incluir las nuevas etiquetas importantes al principio
    const importantTags = ['Bodas', 'Productos', 'Eventos'];
    let finalTags = [...importantTags];
    
    // Agregar etiquetas específicas si no están duplicadas
    specificTags.forEach(tag => {
      if (!finalTags.includes(tag)) {
        finalTags.push(tag);
      }
    });
    
    // Limitar a máximo 7 etiquetas
    finalTags = finalTags.slice(0, 7);
    
    if (specificTags.length === 0) {
      return ['Bodas', 'Productos', 'Eventos', 'Retrato', 'Digital', 'Abstracto', 'Mural'];
    }
    
    return finalTags;
  };

  // Sincronizar tags seleccionados con los estados existentes
  useEffect(() => {
    if (visible) {
      const tags = [tag1, tag2, tag3].filter(Boolean);
      setSelectedTags(tags);
    }
  }, [visible, tag1, tag2, tag3]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => {
      if (prev.includes(tag)) {
        const newTags = prev.filter(t => t !== tag);
        // Actualizar los estados de tag1, tag2, tag3
        setTag1(newTags[0] ?? '');
        setTag2(newTags[1] ?? '');
        setTag3(newTags[2] ?? '');
        return newTags;
      }
      if (prev.length >= 3) return prev;
      const newTags = [...prev, tag];
      setTag1(newTags[0] ?? '');
      setTag2(newTags[1] ?? '');
      setTag3(newTags[2] ?? '');
      return newTags;
    });
  };

  const handleAddCustomTag = () => {
    const tag = customTagInput.trim();
    if (!tag) return;
    const formatted = tag.charAt(0).toUpperCase() + tag.slice(1);
    toggleTag(formatted);
    setCustomTagInput('');
  };

  useEffect(() => {
    if (visible) {
      setName(artist.name ?? '');
      setHandle((artist.handle ?? '').replace(/^@/, ''));
      const parts = (artist.location ?? '').split(',').map(s => s.trim());
      setLocation(parts[0] ?? '');
      setBarrio(parts[1] ?? '');
      setBio(artist.bio ?? '');
      setTag1(artist.tags?.[0]?.label ?? '');
      setTag2(artist.tags?.[1]?.label ?? '');
      setTag3(artist.tags?.[2]?.label ?? '');
    }
  }, [visible, artist]);

  const handleSave = () => {
    const fullLocation = barrio.trim() ? `${location.trim()}, ${barrio.trim()}` : location.trim();
    onSave({ name: name.trim(), handle: handle.trim(), location: fullLocation, bio: bio.trim(), tags: [tag1.trim(), tag2.trim(), tag3.trim()], schedule: '' });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <View style={[m.mainContainer, { paddingTop: insets.top }]}>
        <KeyboardAvoidingView 
          style={m.flex} 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // CORRECCIÓN CLAVE
        >
          <View style={m.header}>
            <TouchableOpacity onPress={onClose} style={m.headerSide}><Text style={m.cancelText}>Cancelar</Text></TouchableOpacity>
            <View style={m.headerCenter}><Text style={m.title}>Editar perfil</Text></View>
            <TouchableOpacity onPress={handleSave} style={m.headerSideRight}>
              <LinearGradient colors={['#7c3aed', '#2563eb']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={m.saveBtn}>
                <Text style={m.saveBtnText}>Guardar</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <ScrollView 
            style={m.flex} 
            contentContainerStyle={m.content}
            keyboardShouldPersistTaps="handled"
            removeClippedSubviews={false} // CORRECCIÓN CLAVE
          >
            <SectionLabel label="Identidad" />
            <Field label="Nombre" icon="person-outline" value={name} onChangeText={setName} maxLength={60} />
            <Field label="Username" icon="at-outline" value={handle} onChangeText={setHandle} prefix="@" />

            <SectionLabel label="Ubicación" style={{ marginTop: 20 }} />
            <Field label="Ciudad" icon="location-outline" value={location} onChangeText={setLocation} />
            <Field label="Barrio" icon="map-outline" value={barrio} onChangeText={setBarrio} />

            <SectionLabel label="Bio" style={{ marginTop: 20 }} />
            <Field label="Descripción" icon="create-outline" value={bio} onChangeText={setBio} multiline maxLength={130} />

            <SectionLabel label="Etiquetas" style={{ marginTop: 20 }} />
            
            {/* Etiquetas seleccionadas */}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
              {selectedTags.length === 0 ? (
                <Text style={{ fontSize: 14, color: '#9ca3af', fontStyle: 'italic' }}>
                  Toca una sugerencia para agregar etiquetas
                </Text>
              ) : selectedTags.map(tag => (
                <TouchableOpacity 
                  key={tag} 
                  onPress={() => toggleTag(tag)} 
                  style={{ 
                    backgroundColor: '#7c3aed', 
                    paddingHorizontal: 12, 
                    paddingVertical: 6, 
                    borderRadius: 16,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 4
                  }} 
                  activeOpacity={0.75}
                >
                  <Text style={{ color: '#fff', fontSize: 12, fontFamily: 'PlusJakartaSans_500Medium' }}>
                    {tag}
                  </Text>
                  <Ionicons name="close-circle" size={14} color="rgba(255,255,255,0.85)" />
                </TouchableOpacity>
              ))}
            </View>

            {/* Sugeridas según categoría */}
            {selectedTags.length < 3 && (
              <View style={{ backgroundColor: '#f3f4f6', padding: 12, borderRadius: 12, marginBottom: 16 }}>
                <Text style={{ fontSize: 12, color: '#6b7280', marginBottom: 8, fontFamily: 'PlusJakartaSans_500Medium' }}>
                  Sugeridas para tu categoría:
                </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                  {getTagSuggestions()
                    .filter(t => !selectedTags.includes(t))
                    .slice(0, 7)
                    .map(tag => (
                      <TouchableOpacity 
                        key={tag} 
                        onPress={() => toggleTag(tag)} 
                        style={{ 
                          backgroundColor: '#e5e7eb', 
                          paddingHorizontal: 10, 
                          paddingVertical: 4, 
                          borderRadius: 12,
                          borderWidth: 1,
                          borderColor: '#d1d5db'
                        }} 
                        activeOpacity={0.75}
                      >
                        <Text style={{ color: '#374151', fontSize: 11, fontFamily: 'PlusJakartaSans_400Regular' }}>
                          + {tag}
                        </Text>
                      </TouchableOpacity>
                    ))}
                </View>
              </View>
            )}

            {/* Input etiqueta personalizada */}
            {selectedTags.length < 3 && (
              <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                <TextInput
                  style={{ 
                    flex: 1, 
                    borderWidth: 1, 
                    borderColor: '#d1d5db', 
                    borderRadius: 8, 
                    paddingHorizontal: 12, 
                    paddingVertical: 8, 
                    fontSize: 14,
                    color: '#374151'
                  }}
                  value={customTagInput}
                  onChangeText={setCustomTagInput}
                  placeholder="Escribe una etiqueta personalizada..."
                  placeholderTextColor="#9ca3af"
                  onSubmitEditing={handleAddCustomTag}
                  returnKeyType="done"
                  maxLength={25}
                />
                <TouchableOpacity
                  onPress={handleAddCustomTag}
                  disabled={!customTagInput.trim()}
                  style={{ 
                    backgroundColor: customTagInput.trim() ? '#7c3aed' : '#d1d5db', 
                    width: 36, 
                    height: 36, 
                    borderRadius: 8, 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}
                  activeOpacity={0.75}
                >
                  <Ionicons name="add" size={18} color="#fff" />
                </TouchableOpacity>
              </View>
            )}

            <Text style={{ fontSize: 11, color: '#6b7280', marginTop: 8 }}>
              Máximo 3 etiquetas para que los clientes te encuentren fácilmente
            </Text>
            
            <View style={{ height: 100 }} />
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const m = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: Brand.bg },
  flex: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Brand.border, backgroundColor: '#fff' },
  headerSide: { width: 90 },
  headerSideRight: { width: 90, alignItems: 'flex-end' },
  headerCenter: { flex: 1, alignItems: 'center' },
  title: { fontSize: 16, fontFamily: 'PlusJakartaSans_700Bold', color: Brand.text },
  cancelText: { fontSize: 14, fontFamily: 'PlusJakartaSans_500Medium', color: Brand.purpleText },
  saveBtn: { borderRadius: 20, paddingHorizontal: 16, paddingVertical: 7 },
  saveBtnText: { fontSize: 13, fontFamily: 'PlusJakartaSans_700Bold', color: '#fff' },
  content: { paddingHorizontal: 20, paddingTop: 24 }
});