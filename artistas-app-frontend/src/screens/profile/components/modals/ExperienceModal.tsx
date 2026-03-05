import React, { useState, useEffect, useCallback, memo, useRef } from 'react';
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
  StatusBar,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { WorkExperienceDetail } from '../types';

// Extendemos el tipo localmente para manejar IDs únicos y evitar re-renders por índice
interface InternalExperience extends WorkExperienceDetail {
  id: string;
}

interface Props {
  visible: boolean;
  initialExperience: WorkExperienceDetail[];
  onClose: () => void;
  onSave: (data: WorkExperienceDetail[]) => void;
}

// ── MiniField ──────────────────────────────────────────────────────────────────
const MiniField = memo(({ 
  label, value, onChange, placeholder, icon, multiline, editable = true 
}: any) => {
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
        <View style={{ marginRight: 8 }}>
          <Ionicons
            name={icon}
            size={14}
            color={!editable ? 'rgba(124,58,237,0.15)' : (focused ? '#7c3aed' : 'rgba(124,58,237,0.3)')}
          />
        </View>
        <TextInput
          style={[mf.input, multiline && mf.multilineInput, !editable && mf.inputDisabled]}
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor="rgba(124,58,237,0.25)"
          multiline={multiline}
          editable={editable}
          textAlignVertical={multiline ? 'top' : 'center'}
          autoCorrect={false}
          onFocus={() => {
            console.log(`[BuscArt Debug] Foco ganado: ${label}`);
            setFocused(true);
          }}
          onBlur={() => {
            console.log(`[BuscArt Debug] Foco perdido: ${label}`);
            setFocused(false);
          }}
        />
      </View>
    </View>
  );
});

// ── ExperienceCard ─────────────────────────────────────────────────────────────
const ExperienceCard = memo(({ 
  item, index, canDelete, onUpdate, onDelete 
}: any) => {
  const [start, end] = (item.period || ' - ').split(' - ');
  const isCurrent = end === 'Actual';

  const handleUpdatePeriod = (newStart: string, newEnd: string) => {
    onUpdate('period', `${newStart || ''} - ${newEnd || ''}`);
  };

  const toggleCurrent = () => {
    if (isCurrent) handleUpdatePeriod(start, '');
    else handleUpdatePeriod(start, 'Actual');
  };

  return (
    <View style={ec.card}>
      <View style={ec.header}>
        <LinearGradient colors={['#7c3aed', '#2563eb']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={ec.numberGrad}>
          <Text style={ec.numberText}>{index + 1}</Text>
        </LinearGradient>
        <Text style={ec.cardTitle}>Registro de Experiencia</Text>
        {canDelete && (
          <TouchableOpacity onPress={onDelete} style={ec.deleteBtn}>
            <Ionicons name="trash-outline" size={15} color="#ef4444" />
          </TouchableOpacity>
        )}
      </View>

      <MiniField
        label="Empresa / Proyecto"
        icon="business-outline"
        value={item.company}
        onChange={(v: string) => onUpdate('company', v)}
        placeholder="Ej. Apple Inc."
      />
      <View style={{ height: 16 }} />
      <View style={ec.row}>
        <View style={{ flex: 1 }}>
          <MiniField
            label="Inicio"
            icon="calendar-outline"
            value={start}
            onChange={(v: string) => handleUpdatePeriod(v, end)}
            placeholder="2022"
          />
        </View>
        <View style={{ flex: 1 }}>
          <MiniField
            label="Fin"
            icon="calendar-clear-outline"
            value={isCurrent ? 'Actual' : (end || '')}
            onChange={(v: string) => handleUpdatePeriod(start, v)}
            placeholder="2024"
            editable={!isCurrent}
          />
        </View>
        <TouchableOpacity style={[ec.currentBtn, isCurrent && ec.currentBtnActive]} onPress={toggleCurrent}>
          <Ionicons name={isCurrent ? 'checkbox' : 'square-outline'} size={18} color={isCurrent ? '#7c3aed' : 'rgba(124,58,237,0.3)'} />
          <Text style={[ec.currentTxt, isCurrent && ec.currentTxtActive]}>Actual</Text>
        </TouchableOpacity>
      </View>
      <View style={{ height: 16 }} />
      <MiniField label="Cargo desempeñado" icon="briefcase-outline" value={item.position} onChange={(v: string) => onUpdate('position', v)} placeholder="Ej. Senior UI Designer" />
      <View style={{ height: 16 }} />
      <MiniField label="Descripción de logros" icon="document-text-outline" value={item.description ?? ''} onChange={(v: string) => onUpdate('description', v)} placeholder="Logros..." multiline />
    </View>
  );
});

// ── ExperienceModal ────────────────────────────────────────────────────────────
export const ExperienceModal = ({ visible, initialExperience, onClose, onSave }: Props) => {
  const insets = useSafeAreaInsets();
  const [experience, setExperience] = useState<InternalExperience[]>([]);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (visible && !isInitialized.current) {
      const dataWithIds = (initialExperience?.length > 0 ? initialExperience : [{ company: '', position: '', period: '', description: '' }])
        .map((item, idx) => ({ ...item, id: Math.random().toString(36).substr(2, 9) }));
      
      setExperience(dataWithIds);
      isInitialized.current = true;
    }
    if (!visible) {
      isInitialized.current = false;
    }
  }, [visible]);

  const updateWork = useCallback((id: string, field: keyof WorkExperienceDetail, value: string) => {
    setExperience(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  }, []);

  const addWork = () => {
    setExperience(prev => [...prev, { id: Math.random().toString(36).substr(2, 9), company: '', position: '', period: '', description: '' }]);
  };

  const removeWork = (id: string) => {
    setExperience(prev => prev.length > 1 ? prev.filter(item => item.id !== id) : prev);
  };

  const handleSave = () => {
    // Quitamos los IDs internos antes de guardar
    const cleanData = experience.map(({ id, ...rest }) => rest);
    onSave(cleanData);
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen" onRequestClose={onClose}>
      <View style={[s.safeArea, { paddingBottom: insets.bottom }]}>
        <StatusBar barStyle="dark-content" />
        <KeyboardAvoidingView style={s.kav} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={20}>
          <View style={[s.header, { paddingTop: insets.top }]}>
            <TouchableOpacity onPress={onClose} style={s.cancelBtn}><Text style={s.cancelText}>Cancelar</Text></TouchableOpacity>
            <View style={s.headerCenter}>
              <LinearGradient colors={['#7c3aed', '#2563eb']} style={s.accentBar} />
              <Text style={s.title}>Experiencia</Text>
            </View>
            <TouchableOpacity onPress={handleSave}>
              <LinearGradient colors={['#7c3aed', '#2563eb']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={s.saveBtn}>
                <Text style={s.saveBtnText}>Guardar</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent} keyboardShouldPersistTaps="always">
            {experience.map((item, index) => (
              <ExperienceCard 
                key={item.id} 
                item={item} 
                index={index} 
                canDelete={experience.length > 1} 
                onUpdate={(field: any, value: string) => updateWork(item.id, field, value)} 
                onDelete={() => removeWork(item.id)} 
              />
            ))}
            <TouchableOpacity style={s.addBtn} onPress={addWork}>
              <Ionicons name="add-circle" size={20} color="#7c3aed" />
              <Text style={s.addText}>Añadir nueva experiencia</Text>
            </TouchableOpacity>
            <View style={{ height: 120 }} />
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

// ── Estilos (Mantenidos) ──────────────────────────────────────────────────────
const s = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fdfcff' },
  kav: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14 },
  headerCenter: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  accentBar: { width: 3, height: 22, borderRadius: 2 },
  title: { fontSize: 17, fontFamily: 'PlusJakartaSans_800ExtraBold', color: '#1e1b4b' },
  cancelBtn: { paddingVertical: 4 },
  cancelText: { fontSize: 14, fontFamily: 'PlusJakartaSans_500Medium', color: 'rgba(124,58,237,0.5)' },
  saveBtn: { borderRadius: 22, paddingHorizontal: 18, paddingVertical: 9 },
  saveBtnText: { fontSize: 13, fontFamily: 'PlusJakartaSans_700Bold', color: '#fff' },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 16 },
  addBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 16, borderWidth: 1.5, borderStyle: 'dashed', borderColor: 'rgba(124,58,237,0.25)', borderRadius: 20, backgroundColor: 'rgba(124,58,237,0.02)' },
  addText: { fontSize: 14, fontFamily: 'PlusJakartaSans_700Bold', color: '#7c3aed' },
});

const mf = StyleSheet.create({
  wrap: { flex: 1 },
  label: { fontSize: 9, fontFamily: 'PlusJakartaSans_600SemiBold', color: 'rgba(124,58,237,0.45)', marginBottom: 6, textTransform: 'uppercase' },
  container: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderWidth: 1.2, borderColor: 'rgba(167,139,250,0.2)', borderRadius: 14, paddingHorizontal: 12, height: 44 },
  containerFocused: { borderColor: '#7c3aed' },
  multilineContainer: { height: 90, alignItems: 'flex-start', paddingTop: 10 },
  input: { flex: 1, fontSize: 13, fontFamily: 'PlusJakartaSans_500Medium', color: '#1e1b4b' },
  containerDisabled: { backgroundColor: 'rgba(124,58,237,0.03)' },
  inputDisabled: { color: 'rgba(30,27,75,0.3)' },
  multilineInput: { textAlignVertical: 'top' },
});

const ec = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: 'rgba(167,139,250,0.15)', marginBottom: 16 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 18, gap: 10 },
  numberGrad: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  numberText: { fontSize: 11, fontFamily: 'PlusJakartaSans_700Bold', color: '#fff' },
  cardTitle: { flex: 1, fontSize: 11, fontFamily: 'PlusJakartaSans_700Bold', color: '#6d28d9', textTransform: 'uppercase' },
  deleteBtn: { width: 32, height: 32, borderRadius: 12, backgroundColor: 'rgba(239,68,68,0.06)', alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', gap: 10, alignItems: 'flex-end' },
  currentBtn: { height: 44, backgroundColor: 'rgba(124,58,237,0.05)', borderRadius: 14, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderColor: 'rgba(124,58,237,0.1)' },
  currentBtnActive: { backgroundColor: 'rgba(124,58,237,0.12)', borderColor: 'rgba(124,58,237,0.3)' },
  currentTxt: { fontSize: 10, fontFamily: 'PlusJakartaSans_600SemiBold', color: 'rgba(124,58,237,0.4)' },
  currentTxtActive: { color: '#7c3aed' },
});