// Sistema BuscArt · pantalla completa real · inputs funcionales blindados
import React, { useState, useEffect, useCallback, memo, useRef } from 'react';
import {
  Modal, View, Text, TouchableOpacity, TextInput, Switch,
  StyleSheet, ScrollView, KeyboardAvoidingView,
  Platform, StatusBar,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Service as APIService } from '../../../../services/api/services';

// ── Types ─────────────────────────────────────────────────────────────────────

export type ServiceFormData = {
  name: string;
  description: string;
  price: string;
  currency: string;
  duration: string;
  category: string;
  deliveryTag: string;
  icon: string;
  packageType: 'single' | 'weekly' | 'monthly';
  includedCount: string;
  deliveryDays: string;
  weeklyFrequency?: string;
};

type Props = {
  visible: boolean;
  service?: APIService;
  onClose: () => void;
  onSave: (data: ServiceFormData) => void;
};

// ── Constants ─────────────────────────────────────────────────────────────────

const iconOptions = [
  { name: 'camera-outline',   label: 'Cámara' },
  { name: 'videocam-outline', label: 'Video' },
  { name: 'brush-outline',    label: 'Pincel' },
  { name: 'color-palette',    label: 'Paleta' },
  { name: 'musical-note',     label: 'Música' },
  { name: 'laptop-outline',   label: 'Diseño' },
  { name: 'images-outline',   label: 'Arte Digital' },
];

const currencies = ['COP', 'USD', 'EUR'];

const deliveryOptions = [
  { key: 'Express',  icon: 'flash-outline' as const },
  { key: 'Estándar', icon: 'checkmark-circle-outline' as const },
  { key: 'A medida', icon: 'build-outline' as const },
];

const packageTypes = [
  { id: 'single',  label: 'Por unidad', icon: 'cube-outline' as const,             desc: 'Servicio puntual — un show, una sesión' },
  { id: 'weekly',  label: 'Por semana', icon: 'calendar-outline' as const,         desc: 'Paquete semanal recurrente' },
  { id: 'monthly', label: 'Por mes',    icon: 'calendar-number-outline' as const, desc: 'Paquete mensual' },
];

// ── Field (MEMORIZADO PARA ESTABILIDAD) ───────────────────────────────────────

const Field = memo(({
  label, icon, value, onChangeText, placeholder,
  multiline, maxLength, hint, keyboardType = 'default', required, disabled,
}: any) => {
  const [focused, setFocused] = useState(false);
  
  return (
    <View style={fi.wrap}>
      {!!label && (
        <View style={fi.labelRow}>
          <Ionicons name={icon} size={11} color={focused ? '#7c3aed' : 'rgba(124,58,237,0.35)'} />
          <Text style={[fi.label, focused && fi.labelFocused]}>
            {label}{required && <Text style={fi.req}> *</Text>}
          </Text>
          {maxLength != null && <Text style={fi.counter}>{value.length}/{maxLength}</Text>}
        </View>
      )}
      <View style={[
        fi.box,
        focused && fi.boxFocused,
        multiline && fi.boxMulti,
        disabled && fi.boxDisabled,
      ]}>
        <TextInput
          style={[fi.input, multiline && fi.inputMulti]}
          value={value}
          onChangeText={(text) => {
            console.log(`[BuscArt Service] Input: ${label || 'Price'} -> ${text}`);
            onChangeText(text);
          }}
          placeholder={placeholder}
          placeholderTextColor="rgba(124,58,237,0.22)"
          multiline={multiline}
          maxLength={maxLength}
          keyboardType={keyboardType}
          autoCapitalize="none"
          editable={!disabled}
          onFocus={() => {
            console.log(`[BuscArt Service] Foco ganado: ${label || 'Price'}`);
            setFocused(true);
          }}
          onBlur={() => {
            console.log(`[BuscArt Service] Foco perdido: ${label || 'Price'}`);
            setFocused(false);
          }}
        />
      </View>
      {hint && <Text style={fi.hint}>{hint}</Text>}
    </View>
  );
});

// ── SectionDivider ────────────────────────────────────────────────────────────

const SectionDivider = memo(({ label, icon }: { label: string; icon: any }) => (
  <View style={sd.wrap}>
    <View style={sd.line} />
    <View style={sd.inner}>
      <Ionicons name={icon} size={10} color="#7c3aed" />
      <Text style={sd.label}>{label}</Text>
    </View>
    <View style={sd.line} />
  </View>
));

// ── EditServiceModal ──────────────────────────────────────────────────────────

export const EditServiceModal: React.FC<Props> = ({ visible, service, onClose, onSave }) => {
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('');
  const [description, setDesc] = useState('');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('COP');
  const [duration, setDuration] = useState('');
  const [deliveryTag, setDelivery] = useState('');
  const [icon, setIcon] = useState('camera-outline');
  const [packageType, setPackageType] = useState<'single' | 'weekly' | 'monthly'>('single');
  const [includedCount, setIncludedCount] = useState('1');
  const [deliveryDays, setDeliveryDays] = useState('7');
  const [weeklyFrequency, setWeeklyFrequency] = useState('2');
  const [deliveryNotApplies, setDeliveryNotApplies] = useState(false);

  const isEditing = !!service;
  const isInitialized = useRef(false);

  useEffect(() => {
    if (visible && !isInitialized.current) {
      console.log("[BuscArt Service] Cargando datos iniciales...");
      if (service) {
        setName(service.name ?? '');
        setDesc(service.description ?? '');
        setPrice(service.price?.toString() ?? '');
        setCurrency('COP');
        setDuration(service.duration ?? '');
        setDelivery('');
        setIcon('camera-outline');
        setPackageType('single');
        setIncludedCount('1');
        setDeliveryDays('7');
        setWeeklyFrequency('2');
        setDeliveryNotApplies(false);
      } else {
        setName(''); setDesc(''); setPrice('');
        setCurrency('COP'); setDuration('');
        setDelivery(''); setIcon('camera-outline');
        setPackageType('single'); setIncludedCount('1');
        setDeliveryDays('7'); setWeeklyFrequency('2');
        setDeliveryNotApplies(false);
      }
      isInitialized.current = true;
    }
    if (!visible) {
      isInitialized.current = false;
    }
  }, [visible, service]);

  const handleSave = useCallback(() => {
    if (!name.trim() || !price.trim()) {
      alert('Por favor completa los campos obligatorios');
      return;
    }
    const fd: ServiceFormData = {
      name: name.trim(),
      description: description.trim(),
      price: price.trim(),
      currency,
      duration: duration.trim(),
      category: service?.category ?? '',
      deliveryTag,
      icon,
      packageType,
      includedCount: includedCount.trim(),
      deliveryDays: deliveryNotApplies ? '' : deliveryDays,
    };
    if (packageType !== 'single') fd.weeklyFrequency = weeklyFrequency.trim();
    
    console.log("[BuscArt Service] Guardando servicio...", fd);
    onSave(fd);
    onClose();
  }, [name, description, price, currency, duration, deliveryTag, icon, packageType, includedCount, deliveryDays, weeklyFrequency, deliveryNotApplies, service, onSave, onClose]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View style={[s.safeArea, { paddingBottom: insets.bottom }]}>
        <StatusBar barStyle="dark-content" />
        <KeyboardAvoidingView
          style={s.kav}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          {/* Header */}
          <View style={[s.header, { paddingTop: insets.top }]}>
            <TouchableOpacity onPress={onClose} style={s.cancelBtn}>
              <Text style={s.cancelText}>Cancelar</Text>
            </TouchableOpacity>

            <View style={s.headerCenter}>
              <LinearGradient colors={['#7c3aed', '#2563eb']} style={s.accentBar} />
              <View>
                <Text style={s.eyebrow}>{isEditing ? 'MODIFICAR' : 'CREAR'}</Text>
                <Text style={s.title}>Servicio</Text>
              </View>
            </View>

            <TouchableOpacity onPress={handleSave}>
              <LinearGradient colors={['#7c3aed', '#2563eb']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={s.saveBtn}>
                <Ionicons name="checkmark" size={13} color="#fff" />
                <Text style={s.saveBtnText}>Guardar</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <View style={s.divider} />

          <ScrollView
            style={s.scroll}
            contentContainerStyle={s.content}
            keyboardShouldPersistTaps="always"
            showsVerticalScrollIndicator={false}
          >
            <SectionDivider label="Información Básica" icon="person-outline" />
            <Field
              label="Nombre del servicio" icon="pricetag-outline"
              value={name} onChangeText={setName}
              placeholder="ej. Sesión de Retratos"
              maxLength={60} required
              hint="Un nombre claro aumenta tu visibilidad"
            />
            <View style={{ height: 14 }} />
            <Field
              label="Descripción" icon="document-text-outline"
              value={description} onChangeText={setDesc}
              placeholder="¿Qué incluye? ¿Cómo es el proceso?..."
              multiline maxLength={300}
              hint="Los clientes leen esto antes de contactarte"
            />

            <SectionDivider label="Tipo de paquete" icon="cube-outline" />
            <View style={s.packageGrid}>
              {packageTypes.map(p => (
                <TouchableOpacity
                  key={p.id}
                  style={[pt.card, packageType === p.id && pt.cardSel]}
                  onPress={() => setPackageType(p.id as any)}
                >
                  <View style={[pt.iconWrap, packageType === p.id && pt.iconWrapSel]}>
                    <Ionicons name={p.icon} size={20} color={packageType === p.id ? '#7c3aed' : 'rgba(124,58,237,0.28)'} />
                  </View>
                  <View style={pt.text}>
                    <Text style={[pt.label, packageType === p.id && pt.labelSel]}>{p.label}</Text>
                    <Text style={pt.desc}>{p.desc}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            <SectionDivider label="Detalles del paquete" icon="options-outline" />
            <View style={s.detailsBlock}>
              <Field
                label="Cantidad incluida" icon="layers-outline"
                value={includedCount} onChangeText={setIncludedCount}
                keyboardType="number-pad" placeholder="ej. 3"
                required={packageType !== 'single'}
              />
              <View style={{ height: 14 }} />
              <View style={s.switchRow}>
                <View style={s.switchLeft}>
                  <Ionicons name="time-outline" size={11} color="rgba(124,58,237,0.4)" />
                  <Text style={s.switchLabel}>PLAZO MÁXIMO (DÍAS)</Text>
                </View>
                <View style={s.switchRight}>
                  <Text style={s.switchNote}>No aplica</Text>
                  <Switch
                    value={deliveryNotApplies}
                    onValueChange={setDeliveryNotApplies}
                    trackColor={{ false: 'rgba(167,139,250,0.3)', true: '#7c3aed' }}
                    thumbColor="#fff"
                  />
                </View>
              </View>
              <View style={{ height: 8 }} />
              <Field
                label="" icon="time-outline"
                value={deliveryDays} onChangeText={setDeliveryDays}
                keyboardType="number-pad" disabled={deliveryNotApplies}
                placeholder="7"
              />
              {packageType !== 'single' && (
                <>
                  <View style={{ height: 14 }} />
                  <Field
                    label="Frecuencia semanal" icon="calendar-outline"
                    value={weeklyFrequency} onChangeText={setWeeklyFrequency}
                    keyboardType="number-pad" required
                    placeholder="ej. 2 veces por semana"
                  />
                </>
              )}
            </View>

            <SectionDivider label="Ícono del Servicio" icon="shapes-outline" />
            <View style={s.iconGrid}>
              {iconOptions.map(opt => {
                const sel = icon === opt.name;
                return (
                  <TouchableOpacity
                    key={opt.name}
                    style={[s.iconOption, sel && s.iconOptionSel]}
                    onPress={() => setIcon(opt.name)}
                  >
                    <Ionicons name={opt.name as any} size={22} color={sel ? '#7c3aed' : 'rgba(124,58,237,0.28)'} />
                    <Text style={[s.iconLabel, sel && s.iconLabelSel]}>{opt.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <SectionDivider label="Precio y Duración" icon="cash-outline" />
            <View style={s.priceBlock}>
              <Text style={s.miniLabel}>MONEDA</Text>
              <View style={s.currencyRow}>
                {currencies.map(c => (
                  <TouchableOpacity key={c} onPress={() => setCurrency(c)}>
                    <View style={currency === c ? s.currencyActive : s.currencyInactive}>
                      <Text style={currency === c ? s.currencyTextActive : s.currencyText}>{c}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={[s.miniLabel, { marginTop: 14 }]}>PRECIO *</Text>
              <View style={s.priceInputBox}>
                <Text style={s.priceCurrencyTag}>{currency}</Text>
                <TextInput
                  style={s.priceInput}
                  value={price}
                  onChangeText={setPrice}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor="rgba(124,58,237,0.18)"
                />
              </View>
            </View>

            <View style={{ height: 14 }} />
            <Field
              label="Duración por unidad" icon="time-outline"
              value={duration} onChangeText={setDuration}
              maxLength={30} placeholder="ej. 2 horas, 1–3 días"
              hint="Ayuda al cliente a planificar"
            />

            <View style={{ height: 32 }} />
            <TouchableOpacity onPress={handleSave}>
              <LinearGradient colors={['#7c3aed', '#2563eb']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={s.ctaBtn}>
                <Ionicons name={isEditing ? 'create-outline' : 'add-circle-outline'} size={18} color="#fff" />
                <Text style={s.ctaBtnText}>{isEditing ? 'Guardar cambios' : 'Crear servicio'}</Text>
              </LinearGradient>
            </TouchableOpacity>

            <View style={{ height: 60 }} />
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

// ── Styles (Mantenidos según BuscArt) ──────────────────────────────────────────

const s = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fdfcff' },
  kav: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14 },
  headerCenter: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  accentBar: { width: 3, height: 36, borderRadius: 2 },
  eyebrow: { fontSize: 9, fontFamily: 'PlusJakartaSans_600SemiBold', color: 'rgba(124,58,237,0.45)', letterSpacing: 2 },
  title: { fontSize: 20, fontFamily: 'PlusJakartaSans_800ExtraBold', color: '#1e1b4b', letterSpacing: -0.4 },
  cancelBtn: { paddingVertical: 4 },
  cancelText: { fontSize: 14, fontFamily: 'PlusJakartaSans_500Medium', color: 'rgba(124,58,237,0.5)' },
  saveBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8 },
  saveBtnText: { fontSize: 13, fontFamily: 'PlusJakartaSans_700Bold', color: '#fff' },
  divider: { height: 1, backgroundColor: 'rgba(167,139,250,0.12)' },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 8 },
  packageGrid: { gap: 10 },
  detailsBlock: { backgroundColor: 'rgba(245,243,255,0.6)', borderWidth: 1.5, borderColor: 'rgba(167,139,250,0.15)', borderRadius: 18, padding: 16 },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  switchLeft: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  switchLabel: { fontSize: 9.5, fontFamily: 'PlusJakartaSans_600SemiBold', color: 'rgba(124,58,237,0.45)' },
  switchRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  switchNote: { fontSize: 12, fontFamily: 'PlusJakartaSans_400Regular', color: '#7c3aed' },
  iconGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  iconOption: { alignItems: 'center', justifyContent: 'center', width: '31%', height: 80, borderWidth: 1.5, borderColor: 'rgba(167,139,250,0.2)', borderRadius: 16, backgroundColor: '#fff', gap: 5 },
  iconOptionSel: { borderColor: '#7c3aed' },
  iconLabel: { fontSize: 9, fontFamily: 'PlusJakartaSans_400Regular', color: 'rgba(124,58,237,0.3)' },
  iconLabelSel: { color: '#7c3aed', fontFamily: 'PlusJakartaSans_600SemiBold' },
  priceBlock: { backgroundColor: 'rgba(245,243,255,0.6)', borderWidth: 1.5, borderColor: 'rgba(167,139,250,0.15)', borderRadius: 18, padding: 16 },
  miniLabel: { fontSize: 9.5, fontFamily: 'PlusJakartaSans_600SemiBold', color: 'rgba(124,58,237,0.45)' },
  currencyRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
  currencyInactive: { paddingHorizontal: 16, paddingVertical: 9, borderRadius: 10, borderWidth: 1.5, borderColor: 'rgba(167,139,250,0.2)', backgroundColor: '#fff' },
  currencyActive: { paddingHorizontal: 16, paddingVertical: 9, borderRadius: 10, backgroundColor: '#7c3aed' },
  currencyText: { fontSize: 12, fontFamily: 'PlusJakartaSans_600SemiBold', color: 'rgba(109,40,217,0.4)' },
  currencyTextActive: { fontSize: 12, fontFamily: 'PlusJakartaSans_700Bold', color: '#fff' },
  priceInputBox: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: 'rgba(167,139,250,0.22)', borderRadius: 14, backgroundColor: '#fff', paddingHorizontal: 14, height: 60, marginTop: 8 },
  priceCurrencyTag: { fontSize: 13, fontFamily: 'PlusJakartaSans_700Bold', color: '#7c3aed', paddingRight: 12, borderRightWidth: 1, borderRightColor: 'rgba(167,139,250,0.2)', marginRight: 4 },
  priceInput: { flex: 1, fontSize: 28, fontFamily: 'PlusJakartaSans_800ExtraBold', color: '#1e1b4b' },
  ctaBtn: { height: 56, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#7c3aed' },
  ctaBtnText: { fontSize: 15, fontFamily: 'PlusJakartaSans_700Bold', color: '#fff' },
});

const fi = StyleSheet.create({
  wrap: { gap: 7 },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  label: { flex: 1, fontSize: 9.5, letterSpacing: 0.8, textTransform: 'uppercase', fontFamily: 'PlusJakartaSans_600SemiBold', color: 'rgba(124,58,237,0.45)' },
  labelFocused: { color: '#7c3aed' },
  req: { color: '#7c3aed' },
  counter: { fontSize: 10, fontFamily: 'PlusJakartaSans_400Regular', color: 'rgba(124,58,237,0.3)' },
  box: { borderWidth: 1.5, borderColor: 'rgba(167,139,250,0.25)', borderRadius: 14, paddingHorizontal: 14, height: 50, justifyContent: 'center', backgroundColor: '#fff' },
  boxFocused: { borderColor: '#7c3aed' },
  boxMulti: { height: undefined, paddingVertical: 13, alignItems: 'flex-start' },
  boxDisabled: { backgroundColor: 'rgba(245,243,255,0.45)', opacity: 0.55 },
  input: { flex: 1, fontSize: 14.5, fontFamily: 'PlusJakartaSans_400Regular', color: '#1e1b4b' },
  inputMulti: { minHeight: 88, textAlignVertical: 'top' },
  hint: { fontSize: 10, fontFamily: 'PlusJakartaSans_400Regular', color: 'rgba(124,58,237,0.35)', paddingLeft: 2 },
});

const sd = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 22 },
  line: { flex: 1, height: 1, backgroundColor: 'rgba(167,139,250,0.15)' },
  inner: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  label: { fontSize: 9.5, fontFamily: 'PlusJakartaSans_700Bold', color: '#7c3aed', letterSpacing: 1.4, textTransform: 'uppercase' },
});

const pt = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 13, borderRadius: 16, borderWidth: 1.5, borderColor: 'rgba(167,139,250,0.2)', backgroundColor: '#fff', marginBottom: 8 },
  cardSel: { borderColor: '#7c3aed' },
  iconWrap: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(124,58,237,0.06)' },
  iconWrapSel: { backgroundColor: 'rgba(124,58,237,0.11)' },
  text: { flex: 1 },
  label: { fontSize: 13.5, fontFamily: 'PlusJakartaSans_600SemiBold', color: 'rgba(30,27,75,0.4)' },
  labelSel: { color: '#1e1b4b', fontFamily: 'PlusJakartaSans_700Bold' },
  desc: { fontSize: 10.5, fontFamily: 'PlusJakartaSans_400Regular', color: 'rgba(124,58,237,0.38)', marginTop: 2 },
});