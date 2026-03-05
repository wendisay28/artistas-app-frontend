import React, { useState, useEffect } from 'react';
import {
  Modal, View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, KeyboardAvoidingView,
  Platform, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StudyDetail } from '../types';

interface Props {
  visible: boolean;
  initialStudies: StudyDetail[];
  onClose: () => void;
  onSave: (data: StudyDetail[]) => void;
}

// ── MiniField (Componente Interno) ──────────────────────────────────────────
const MiniField: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  multiline?: boolean;
  editable?: boolean;
  keyboardType?: 'default' | 'numeric';
}> = ({ label, value, onChange, placeholder, icon, multiline, editable = true, keyboardType = 'default' }) => {
  const [focused, setFocused] = useState(false);

  return (
    <View style={mf.wrap}>
      <Text style={mf.label}>{label}</Text>
      <View style={[
        mf.container,
        focused && mf.containerFocused,
        multiline && mf.multilineContainer,
        !editable && mf.containerDisabled,
      ]}>
        <Ionicons
          name={icon}
          size={14}
          color={!editable ? 'rgba(124,58,237,0.15)' : (focused ? '#7c3aed' : 'rgba(124,58,237,0.3)')}
        />
        <TextInput
          style={[mf.input, multiline && mf.multilineInput, !editable && mf.inputDisabled]}
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor="rgba(124,58,237,0.25)"
          multiline={multiline}
          editable={editable}
          keyboardType={keyboardType}
          textAlignVertical={multiline ? 'top' : 'center'}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </View>
    </View>
  );
};

// ── StudyCard (Componente Interno que causaba el error) ─────────────────────
const StudyCard: React.FC<{
  item: StudyDetail;
  index: number;
  canDelete: boolean;
  onUpdate: (field: keyof StudyDetail, value: string) => void;
  onDelete: () => void;
}> = ({ item, index, canDelete, onUpdate, onDelete }) => {
  const [start, end] = (item.year || '').split(' - ');
  const isInProgress = end === 'En curso';

  const handleUpdateYear = (newStart: string, newEnd: string) => {
    onUpdate('year', `${newStart || ''} - ${newEnd || ''}`);
  };

  const toggleInProgress = () => {
    if (isInProgress) handleUpdateYear(start, '');
    else handleUpdateYear(start, 'En curso');
  };

  return (
    <View style={sc.card}>
      <View style={sc.header}>
        <LinearGradient
          colors={['#7c3aed', '#2563eb']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          style={sc.numberGrad}
        >
          <Text style={sc.numberText}>{index + 1}</Text>
        </LinearGradient>
        <Text style={sc.cardTitle}>Formación Académica</Text>
        {canDelete && (
          <TouchableOpacity onPress={onDelete} style={sc.deleteBtn}>
            <Ionicons name="trash-outline" size={15} color="#ef4444" />
          </TouchableOpacity>
        )}
      </View>

      <MiniField
        label="Institución / Centro"
        icon="school-outline"
        value={item.institution}
        onChange={(v) => onUpdate('institution', v)}
        placeholder="Ej. Universidad de Bellas Artes"
      />

      <View style={{ height: 16 }} />

      <View style={sc.row}>
        <View style={{ flex: 1 }}>
          <MiniField
            label="Año Inicio"
            icon="calendar-outline"
            value={start}
            onChange={(v) => handleUpdateYear(v, end)}
            placeholder="2018"
            keyboardType="numeric"
          />
        </View>
        <View style={{ flex: 1 }}>
          <MiniField
            label="Año Fin"
            icon="calendar-clear-outline"
            value={isInProgress ? 'En curso' : end}
            onChange={(v) => handleUpdateYear(start, v)}
            placeholder="2022"
            editable={!isInProgress}
            keyboardType="numeric"
          />
        </View>
        <TouchableOpacity
          style={[sc.progressBtn, isInProgress && sc.progressBtnActive]}
          onPress={toggleInProgress}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isInProgress ? 'checkmark-circle' : 'ellipse-outline'}
            size={18}
            color={isInProgress ? '#7c3aed' : 'rgba(124,58,237,0.3)'}
          />
          <Text style={[sc.progressTxt, isInProgress && sc.progressTxtActive]}>Actual</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 16 }} />

      <MiniField
        label="Título / Certificación"
        icon="ribbon-outline"
        value={item.degree}
        onChange={(v) => onUpdate('degree', v)}
        placeholder="Ej. Grado en Diseño Visual"
      />

      <View style={{ height: 16 }} />

      <MiniField
        label="Detalles adicionales"
        icon="list-outline"
        value={item.details ?? ''}
        onChange={(v) => onUpdate('details', v)}
        placeholder="Menciones, especialidad o promedio..."
        multiline
      />
    </View>
  );
};

// ── StudiesModal (Componente Principal) ──────────────────────────────────────
export const StudiesModal = ({ visible, initialStudies, onClose, onSave }: Props) => {
  const [studies, setStudies] = useState<StudyDetail[]>([]);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (visible) {
      setStudies(
        initialStudies?.length > 0
          ? initialStudies
          : [{ institution: '', degree: '', year: '', details: '' }]
      );
    }
  }, [visible, initialStudies]);

  const addStudy = () =>
    setStudies(prev => [...prev, { institution: '', degree: '', year: '', details: '' }]);

  const removeStudy = (index: number) => {
    if (studies.length === 1) return;
    setStudies(prev => prev.filter((_, i) => i !== index));
  };

  const updateStudy = (index: number, field: keyof StudyDetail, value: string) => {
    setStudies(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSave = () => {
    console.log("💾 Guardando estudios:", studies);
    onSave(studies);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      statusBarTranslucent={true}
      onRequestClose={onClose}
    >
      <View style={[s.mainContainer, { paddingTop: insets.top > 0 ? insets.top : 20 }]}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        
        <KeyboardAvoidingView
          style={s.kav}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={s.header}>
            <TouchableOpacity onPress={onClose} style={s.cancelBtn}>
              <Text style={s.cancelText}>Cancelar</Text>
            </TouchableOpacity>

            <View style={s.headerCenter}>
              <LinearGradient colors={['#7c3aed', '#2563eb']} style={s.accentBar} />
              <Text style={s.title}>Estudios</Text>
            </View>

            <TouchableOpacity onPress={handleSave}>
              <LinearGradient colors={['#7c3aed', '#2563eb']} style={s.saveBtn}>
                <Text style={s.saveBtnText}>Guardar</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <View style={s.divider} />

          <ScrollView
            style={s.scroll}
            contentContainerStyle={[s.content, { paddingBottom: insets.bottom + 40 }]}
            showsVerticalScrollIndicator={false}
          >
            <View style={s.subtitleRow}>
              <Text style={s.subtitle}>Tu educación y certificaciones</Text>
            </View>

            {studies.map((item, index) => (
              <StudyCard
                key={index}
                item={item}
                index={index}
                canDelete={studies.length > 1}
                onUpdate={(field, value) => updateStudy(index, field, value)}
                onDelete={() => removeStudy(index)}
              />
            ))}

            <TouchableOpacity style={s.addBtn} onPress={addStudy}>
              <Ionicons name="add-circle" size={20} color="#7c3aed" />
              <Text style={s.addText}>Añadir otra formación</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

// ── Estilos ──────────────────────────────────────────────────────────────────
const mf = StyleSheet.create({
  wrap: { flex: 1 },
  label: { fontSize: 9, fontFamily: 'PlusJakartaSans_600SemiBold', color: 'rgba(124,58,237,0.45)', letterSpacing: 0.8, marginBottom: 6, textTransform: 'uppercase', paddingLeft: 4 },
  container: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.75)', borderWidth: 1.2, borderColor: 'rgba(167,139,250,0.15)', borderRadius: 14, paddingHorizontal: 12, height: 44, gap: 8 },
  containerFocused: { borderColor: '#7c3aed', backgroundColor: 'rgba(255,255,255,0.95)' },
  containerDisabled: { backgroundColor: 'rgba(124,58,237,0.03)', borderColor: 'rgba(167,139,250,0.08)' },
  multilineContainer: { height: 85, alignItems: 'flex-start', paddingTop: 10 },
  input: { flex: 1, fontSize: 13, fontFamily: 'PlusJakartaSans_500Medium', color: '#1e1b4b' },
  inputDisabled: { color: 'rgba(30,27,75,0.3)' },
  multilineInput: { paddingTop: 0 },
});

const sc = StyleSheet.create({
  card: { backgroundColor: 'rgba(255,255,255,0.65)', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: 'rgba(167,139,250,0.15)', marginBottom: 16 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 18, gap: 10 },
  numberGrad: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  numberText: { fontSize: 11, fontFamily: 'PlusJakartaSans_700Bold', color: '#fff' },
  cardTitle: { flex: 1, fontSize: 11, fontFamily: 'PlusJakartaSans_700Bold', color: '#6d28d9', textTransform: 'uppercase', letterSpacing: 1 },
  deleteBtn: { width: 32, height: 32, borderRadius: 12, backgroundColor: 'rgba(239,68,68,0.06)', alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', gap: 10, alignItems: 'flex-end' },
  progressBtn: { height: 44, backgroundColor: 'rgba(124,58,237,0.05)', borderRadius: 14, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderColor: 'rgba(124,58,237,0.1)' },
  progressBtnActive: { backgroundColor: 'rgba(124,58,237,0.12)', borderColor: 'rgba(124,58,237,0.3)' },
  progressTxt: { fontSize: 10, fontFamily: 'PlusJakartaSans_600SemiBold', color: 'rgba(124,58,237,0.4)' },
  progressTxtActive: { color: '#7c3aed' },
});

const s = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#fdfcff' },
  kav: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14 },
  headerCenter: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  accentBar: { width: 3, height: 22, borderRadius: 2 },
  title: { fontSize: 17, fontFamily: 'PlusJakartaSans_800ExtraBold', color: '#1e1b4b', letterSpacing: -0.4 },
  cancelBtn: { paddingVertical: 4 },
  cancelText: { fontSize: 14, fontFamily: 'PlusJakartaSans_500Medium', color: 'rgba(124,58,237,0.5)' },
  saveBtn: { borderRadius: 22, paddingHorizontal: 18, paddingVertical: 9 },
  saveBtnText: { fontSize: 13, fontFamily: 'PlusJakartaSans_700Bold', color: '#fff' },
  divider: { height: 1, backgroundColor: 'rgba(167,139,250,0.12)' },
  subtitleRow: { paddingTop: 4, paddingBottom: 20 },
  subtitle: { fontSize: 13, fontFamily: 'PlusJakartaSans_400Regular', color: 'rgba(109,40,217,0.45)' },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 16 },
  addBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 16, borderWidth: 1.5, borderStyle: 'dashed', borderColor: 'rgba(124,58,237,0.25)', borderRadius: 20, backgroundColor: 'rgba(124,58,237,0.02)', marginTop: 4 },
  addText: { fontSize: 14, fontFamily: 'PlusJakartaSans_700Bold', color: '#7c3aed' },
});