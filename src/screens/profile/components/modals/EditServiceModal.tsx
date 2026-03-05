import React, { useState, useEffect, useRef, memo, useMemo } from 'react';
import {
  Modal, View, Text, TouchableOpacity, TextInput, Switch,
  StyleSheet, ScrollView, KeyboardAvoidingView,
  Platform, StatusBar, Keyboard,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// Helpers
import { getLocalizedRoleName, getSuggestedTagsForDiscipline, getRolesByDiscipline, getDisciplinesByCategory } from '../../../../constants/artistCategories';
import {
  getUnitSuggestions,
  getHintByUnit,
  getIconByDiscipline,
  getServiceNamePlaceholder,
  getGenericUnits,
  getPackageTypes,
  getDefaultDuration,
  getDefaultCategory,
} from '../../../../utils/serviceHelpers';

// ── Types ─────────────────────────────────────────────────────────────────────

export type ServiceFormData = {
  name: string;
  description: string;
  price: string;
  currency: string;
  duration: string;
  category: string;
  unit: string;
  deliveryTag: string;
  icon: string;
  packageType: 'simple' | 'pack' | 'weekly' | 'monthly';
  includedCount: string;
  deliveryDays: string;
  weeklyFrequency: string;
  deliveryNotApplies: boolean;
  tags: string[];
};

type Props = {
  visible: boolean;
  service?: Partial<ServiceFormData> | null; // Cambiado a permitir null
  artistCategoryId?: string;
  artistRoleId?: string;
  onSave: (data: ServiceFormData) => void;
  onClose: () => void;
};

// ── Components ──────────────────────────────────────────────────────────────

const Field = memo(({
  label, icon, value, onChangeText, placeholder,
  multiline, maxLength, hint, keyboardType = 'default', required,
  error, formatter,
}: any) => {
  const [focused, setFocused] = useState(false);

  return (
    <View style={s.wrap}>
      {!!label && (
        <Text style={s.fieldLabel}>
          {label}{required && <Text style={s.req}> *</Text>}
        </Text>
      )}
      <View style={[
        s.box,
        focused && s.boxFocused,
        multiline && s.boxMulti,
        error && s.boxError,
      ]}>
        {!!icon && (
          <View style={s.iconWrap}>
            <Ionicons
              name={icon}
              size={17}
              color={focused ? '#7c3aed' : 'rgba(124,58,237,0.3)'}
            />
          </View>
        )}
        <TextInput
          style={[s.input, multiline && s.inputMulti]}
          value={formatter ? formatter(value) : value}
          onChangeText={onChangeText}
          onBlur={() => setFocused(false)}
          onFocus={() => setFocused(true)}
          placeholder={placeholder}
          placeholderTextColor="rgba(124,58,237,0.25)"
          multiline={multiline}
          maxLength={maxLength}
          keyboardType={keyboardType}
          textAlignVertical={multiline ? 'top' : 'center'}
        />
        {maxLength && <Text style={s.counter}>{value.length}/{maxLength}</Text>}
        {!multiline && !!value && (
          <TouchableOpacity
            onPress={() => onChangeText('')}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={s.clearBtn}
          >
            <Ionicons name="close-circle" size={16} color="rgba(124,58,237,0.3)" />
          </TouchableOpacity>
        )}
      </View>
      {hint && !error && <Text style={s.hint}>{hint}</Text>}
    </View>
  );
});

// ── Main Modal ──────────────────────────────────────────────────────────────

export const EditServiceModal: React.FC<Props> = ({ 
  visible, service, artistCategoryId, artistRoleId, onSave, onClose 
}) => {
  const insets = useSafeAreaInsets();
  const isEditing = !!service;

  // Estados del Formulario
  const [name, setName] = useState('');
  const [description, setDesc] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState(getDefaultDuration());  // ✅ Agregado
  const [unit, setUnit] = useState('');
  const [icon, setIcon] = useState('star-outline');
  const [packageType, setPackageType] = useState<'simple' | 'pack' | 'weekly' | 'monthly'>('simple');
  const [includedCount, setIncludedCount] = useState('');
  const [deliveryDays, setDeliveryDays] = useState('');
  const [deliveryNotApplies, setDeliveryNotApplies] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [errors, setErrors] = useState<any>({});

  // --- 1. LÓGICA DE MEMORIZACIÓN (ESTABLE) ---
  const disciplineId = useMemo(() => {
    if (!artistCategoryId || !artistRoleId) return null;
    const disciplines = getDisciplinesByCategory(artistCategoryId);
    for (const d of disciplines) {
      const roles = getRolesByDiscipline(artistCategoryId, d.id);
      if (roles.find(r => r.id === artistRoleId)) return d.id;
    }
    return null;
  }, [artistCategoryId, artistRoleId]);

  const finalDisciplineId = disciplineId || (artistRoleId === 'fotografo' ? 'fotografia' : null);

  const artistRoleName = useMemo(() => {
    return (artistCategoryId && finalDisciplineId && artistRoleId) 
      ? getLocalizedRoleName(artistCategoryId, finalDisciplineId, artistRoleId) 
      : '';
  }, [artistCategoryId, finalDisciplineId, artistRoleId]);

  const finalUnitOptions = useMemo(() => {
    return finalDisciplineId ? getUnitSuggestions(finalDisciplineId) : getGenericUnits();
  }, [finalDisciplineId]);

  const suggestedTags = useMemo(() => {
    return (artistCategoryId && finalDisciplineId) 
      ? getSuggestedTagsForDiscipline(artistCategoryId, finalDisciplineId) 
      : [];
  }, [artistCategoryId, finalDisciplineId]);

  // --- 2. RESET Y CARGA DE DATOS ---
  useEffect(() => {
    if (visible) {
      if (service) {
        // MODO EDICIÓN: Cargar datos existentes
        setName(service.name || '');
        setDesc(service.description || '');
        setPrice(service.price?.toString() || '');  // Convertir number a string
        setDuration(service.duration || getDefaultDuration());  // ✅ Agregado
        setUnit((service as any).unit || '');      // unit no está en el tipo Service
        setIcon(service.icon || 'star-outline');
        const apiPackageType = service.packageType as string;
        setPackageType(apiPackageType === 'single' ? 'simple' : (apiPackageType as any) || 'simple');
        setIncludedCount(service.includedCount?.toString() || '');
        setDeliveryDays(service.deliveryDays?.toString() || '');
        setDeliveryNotApplies(false); // No existe en Service, default false
        setSelectedTags([]);
      } else {
        // MODO CREACIÓN: Limpiar todo
        setName('');
        setDesc('');
        setPrice('');
        setDuration(getDefaultDuration());  // ✅ Agregado
        setPackageType('simple');
        setIncludedCount('');
        setDeliveryDays('');
        setDeliveryNotApplies(false);
        setErrors({});
        
        // Auto-seleccionar según la categoría actual
        if (finalUnitOptions.length > 0) {
          setUnit(finalUnitOptions[0].id);
          setIcon(finalUnitOptions[0].icon);
        }
        setSelectedTags(suggestedTags.length > 0 ? [suggestedTags[0]] : []);
      }
    }
  }, [visible, service, finalUnitOptions, suggestedTags]);

  const handleSave = () => {
    Keyboard.dismiss();
    if (!name.trim()) { setErrors({ name: 'El nombre es obligatorio' }); return; }

    const resolvedCategory = finalDisciplineId || service?.category || getDefaultCategory();
    
    onSave({
      name, description, price, currency: 'COP', duration,  // ✅ Usar valor real
      category: resolvedCategory, unit, deliveryTag: 'standard', icon,
      packageType, includedCount, deliveryDays, weeklyFrequency: '',
      deliveryNotApplies, tags: selectedTags
    });
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <View style={[s.safeArea, { paddingBottom: insets.bottom }]}>
        <StatusBar barStyle="dark-content" />
        <KeyboardAvoidingView style={s.kav} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          
          {/* Header estilo Instagram */}
          <View style={[s.header, { paddingTop: insets.top }]}>
            <TouchableOpacity onPress={onClose} style={s.headerSide} activeOpacity={0.7}>
              <Text style={s.cancelText}>Cancelar</Text>
            </TouchableOpacity>

            <View style={s.headerCenter}>
              <Text style={s.title}>{isEditing ? 'Editar Servicio' : 'Nuevo Servicio'}</Text>
            </View>

            <TouchableOpacity onPress={handleSave} style={s.headerSide} activeOpacity={0.85}>
              <LinearGradient
                colors={['#7c3aed', '#2563eb']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={s.saveBtn}
              >
                <Text style={s.saveBtnText}>Guardar</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
            
            {/* Info Card de Rol */}
            <View style={s.roleInfoCard}>
               <Ionicons name="sparkles" size={14} color="#7c3aed" />
               <Text style={s.roleName}>Configurando para: <Text style={{color: '#7c3aed'}}>{artistRoleName || 'Artista'}</Text></Text>
            </View>

            <Field 
              label="Nombre del servicio" icon="brush-outline" 
              value={name} onChangeText={setName} 
              placeholder={getServiceNamePlaceholder(unit, artistRoleName)}
              required error={errors.name}
            />
            
            <Field 
              label="Descripción detallada" icon="reader-outline" 
              value={description} onChangeText={setDesc} 
              multiline maxLength={300} placeholder="Ej: Sesión de 2 horas, edición incluida..."
            />

            <Field
              label="Precio base" icon="cash-outline"
              value={price}
              onChangeText={(text: string) => setPrice(text.replace(/[^\d]/g, ''))}
              keyboardType="numeric"
              placeholder="Ej: 150000"
              hint={price ? `COP ${new Intl.NumberFormat('es-CO').format(parseInt(price, 10))}` : undefined}
            />

            <Field 
              label="Duración" icon="time-outline" 
              value={duration} onChangeText={setDuration} 
              placeholder="Ej: 1 hora, 30 minutos"
            />

            <View style={s.dividerWrap}>
              <Text style={s.dividerLabel}>MODALIDAD DE TRABAJO</Text>
              <View style={s.dividerLine} />
            </View>

            <View style={s.packageGrid}>
              {getPackageTypes().map(p => (
                <TouchableOpacity 
                  key={p.id} 
                  style={[s.card, packageType === p.id && s.cardSel]} 
                  onPress={() => setPackageType(p.id as any)}
                >
                  <Ionicons name={p.icon as any} size={18} color={packageType === p.id ? '#7c3aed' : '#a78bfa'} />
                  <View style={{flex: 1}}>
                    <Text style={[s.label, packageType === p.id && s.labelSel]}>{p.label}</Text>
                    <Text style={s.desc}>{p.desc}</Text>
                  </View>
                  {packageType === p.id && <Ionicons name="checkmark-circle" size={16} color="#7c3aed" />}
                </TouchableOpacity>
              ))}
            </View>

            <View style={s.dividerWrap}>
              <Text style={s.dividerLabel}>ENTREGA Y UNIDADES</Text>
              <View style={s.dividerLine} />
            </View>

            <View style={s.unitChipsContainer}>
              {finalUnitOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[s.unitChip, unit === option.id && s.unitChipSelected]}
                  onPress={() => { setUnit(option.id); setIcon(option.icon); }}
                >
                  <Text style={[s.unitChipText, unit === option.id && s.unitChipTextSelected]}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Field 
              label="Cantidad incluida" icon="copy-outline"
              value={includedCount} onChangeText={setIncludedCount}
              keyboardType="number-pad" hint={getHintByUnit(unit).includedCount}
            />

            {!deliveryNotApplies && (
              <Field 
                label="Tiempo estimado (Días)" icon="time-outline"
                value={deliveryDays} onChangeText={setDeliveryDays}
                keyboardType="number-pad" hint={getHintByUnit(unit).deliveryDays}
              />
            )}

            <View style={s.deliveryOption}>
              <Text style={s.deliveryOptionLabel}>Entrega inmediata / No aplica tiempo</Text>
              <Switch 
                value={deliveryNotApplies} 
                onValueChange={setDeliveryNotApplies}
                trackColor={{ false: '#eee', true: '#ddd' }}
                thumbColor={deliveryNotApplies ? '#7c3aed' : '#f4f4f4'}
              />
            </View>

            <View style={{ height: 40 }} />
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

// ── Styles (BUSCART DESIGN SYSTEM) ───────────────────────────────────────────

const s = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#faf9ff' },
  kav: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(167,139,250,0.15)',
    backgroundColor: 'rgba(255,255,255,0.97)',
  },
  headerSide: {
    width: 90,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#1e1b4b',
    letterSpacing: -0.2,
  },
  cancelBtn: { paddingVertical: 5 },
  cancelText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: 'rgba(124,58,237,0.55)',
  },
  saveBtn: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 7,
    alignSelf: 'flex-end',
  },
  saveBtnText: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#fff',
  },
  
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    flexGrow: 1,
  },
  sectionLabel: {
    fontSize: 9.5,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: 'rgba(124,58,237,0.5)',
    letterSpacing: 0.8,
    marginBottom: 14,
  },
  
  roleInfoCard: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#f5f3ff', padding: 12, borderRadius: 12, marginBottom: 20, borderWidth: 1, borderColor: '#ddd6fe' },
  roleName: { fontSize: 12, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#4b5563' },

  // Inputs
  wrap: { marginBottom: 18 },
  fieldLabel: {
    fontSize: 9.5,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: 'rgba(124,58,237,0.5)',
    letterSpacing: 0.8,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  iconWrap: { marginRight: 10 },
  clearBtn: { padding: 4 },
  box: { 
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.75)',
    borderRadius: 14, paddingHorizontal: 14, paddingVertical: 13,
    borderWidth: 1.5, borderColor: 'rgba(167,139,250,0.25)',
    minHeight: 50,
  },
  boxFocused: {
    borderColor: '#7c3aed',
    backgroundColor: 'rgba(255,255,255,0.95)',
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.12, shadowRadius: 10, elevation: 2,
  },
  boxMulti: { 
    height: 120, 
    alignItems: 'flex-start', 
    paddingVertical: 12,
    backgroundColor: 'rgba(255,255,255,0.75)',
  },
  boxError: { borderColor: '#ef4444' },
  icon:  { marginRight: 10 },
  input: { 
    flex: 1, 
    fontSize: 14.5,
    fontFamily: 'PlusJakartaSans_400Regular', 
    color: '#1e1b4b',
    minHeight: 24,
  },
  inputMulti: { paddingTop: 0 },
  counter: { fontSize: 10, color: '#94a3b8', alignSelf: 'flex-end', marginBottom: 5 },
  hint: { fontSize: 11, color: '#7c3aed', marginTop: 6, fontFamily: 'PlusJakartaSans_500Medium', opacity: 0.7 },

  // Dividers
  dividerWrap: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 22 },
  dividerLabel: { 
    fontSize: 9.5, 
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: 'rgba(124,58,237,0.4)', 
    letterSpacing: 0.8,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: 'rgba(167,139,250,0.15)' },

  // Cards
  packageGrid: { gap: 10 },
  card: { flexDirection: 'row', alignItems: 'center', gap: 15, padding: 15, borderRadius: 16, borderWidth: 1.5, borderColor: 'rgba(167,139,250,0.15)', backgroundColor: '#fff' },
  cardSel: { borderColor: '#7c3aed', backgroundColor: '#f5f3ff' },
  label: { fontSize: 14, fontFamily: 'PlusJakartaSans_700Bold', color: '#475569' },
  labelSel: { color: '#1e1b4b' },
  desc: { fontSize: 11, color: '#94a3b8', marginTop: 2, fontFamily: 'PlusJakartaSans_400Regular' },

  // Chips
  unitChipsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 15 },
  unitChip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0', backgroundColor: '#fff' },
  unitChipSelected: { backgroundColor: '#7c3aed', borderColor: '#7c3aed' },
  unitChipText: { fontSize: 12, color: '#64748b', fontFamily: 'PlusJakartaSans_600SemiBold' },
  unitChipTextSelected: { color: '#fff' },

  // Footer
  deliveryOption: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f8fafc', padding: 15, borderRadius: 14, marginTop: 10 },
  deliveryOptionLabel: { fontSize: 13, color: '#334155', fontFamily: 'PlusJakartaSans_600SemiBold' },
  req: { color: '#ef4444' },
});