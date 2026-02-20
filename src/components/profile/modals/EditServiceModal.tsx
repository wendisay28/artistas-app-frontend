// ─────────────────────────────────────────────────────────────────────────────
// EditServiceModal.tsx — Modal para agregar/editar servicios
// Diseño premium: tema claro con acentos morados
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect, useRef } from 'react';
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
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Service as APIService } from '../../../services/api/services';
import { ARTIST_CATEGORIES, getLocalizedCategoryName } from '../../../constants/artistCategories';

// ── Design Tokens ─────────────────────────────────────────────────────────────

const D = {
  bg:            '#FFFFFF',
  surface:       '#F7F5FF',
  surfaceHigh:   '#EDE9FF',
  border:        '#E2DCF5',
  borderHi:      '#C9BEF0',
  primary:       '#7C5CBF',
  primarySoft:   'rgba(124,92,191,0.10)',
  primaryLight:  '#9B7DD4',
  text:          '#1A1530',
  textSub:       '#6B6080',
  textMuted:     '#A89EC0',
  white:         '#FFFFFF',
  radius:        { sm: 8, md: 12, lg: 16, xl: 24 },
  font: {
    regular:  'PlusJakartaSans_400Regular',
    medium:   'PlusJakartaSans_500Medium',
    semibold: 'PlusJakartaSans_600SemiBold',
    bold:     'PlusJakartaSans_700Bold',
  },
};

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
};

type Props = {
  visible: boolean;
  service?: APIService;
  onClose: () => void;
  onSave: (data: ServiceFormData) => void;
};

// ── Field Component ───────────────────────────────────────────────────────────

type FieldProps = {
  label: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  multiline?: boolean;
  maxLength?: number;
  hint?: string;
  keyboardType?: 'default' | 'numeric';
  required?: boolean;
};

const Field: React.FC<FieldProps> = ({
  label, icon, value, onChangeText, placeholder,
  multiline, maxLength, hint, keyboardType = 'default', required,
}) => {
  const [focused, setFocused] = useState(false);
  const focusAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    setFocused(true);
    Animated.timing(focusAnim, { toValue: 1, duration: 180, useNativeDriver: false }).start();
  };
  const handleBlur = () => {
    setFocused(false);
    Animated.timing(focusAnim, { toValue: 0, duration: 180, useNativeDriver: false }).start();
  };

  const borderColor = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [D.border, D.primary],
  });

  const bgColor = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [D.surfaceHigh, D.white],
  });

  return (
    <View style={fld.wrap}>
      <View style={fld.labelRow}>
        <Ionicons name={icon} size={12} color={focused ? D.primary : D.textMuted} />
        <Text style={[fld.label, focused && { color: D.primary }]}>
          {label}
          {required && <Text style={fld.required}> *</Text>}
        </Text>
        {maxLength && (
          <Text style={fld.counter}>{value.length}/{maxLength}</Text>
        )}
      </View>
      <Animated.View style={[
        fld.inputWrap,
        { borderColor, backgroundColor: bgColor },
        multiline && fld.inputMulti,
        focused && fld.inputShadow,
      ]}>
        <TextInput
          style={[fld.input, multiline && { height: 88, textAlignVertical: 'top', paddingTop: 4 }]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={D.textMuted}
          multiline={multiline}
          maxLength={maxLength}
          keyboardType={keyboardType}
          autoCapitalize="none"
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </Animated.View>
      {hint ? <Text style={fld.hint}>{hint}</Text> : null}
    </View>
  );
};

const fld = StyleSheet.create({
  wrap:        { gap: 6, marginBottom: 2 },
  labelRow:    { flexDirection: 'row', alignItems: 'center', gap: 5 },
  label:       { flex: 1, fontSize: 11, letterSpacing: 0.8, fontFamily: 'PlusJakartaSans_600SemiBold', color: D.textSub, textTransform: 'uppercase' },
  required:    { color: D.primary },
  counter:     { fontSize: 10, fontFamily: 'PlusJakartaSans_400Regular', color: D.textMuted },
  inputWrap:   {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: D.radius.md,
    paddingHorizontal: 14,
    minHeight: 48,
  },
  inputMulti:  { alignItems: 'flex-start', paddingVertical: 12 },
  inputShadow: {
    shadowColor: D.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 2,
  },
  input:       { flex: 1, fontSize: 14, fontFamily: 'PlusJakartaSans_500Medium', color: D.text, letterSpacing: 0.1 },
  hint:        { fontSize: 10, color: D.textMuted, fontFamily: 'PlusJakartaSans_400Regular', marginTop: 4, paddingLeft: 1 },
});

// ── Section Header ────────────────────────────────────────────────────────────

const SectionHeader: React.FC<{ label: string; icon: React.ComponentProps<typeof Ionicons>['name'] }> = ({ label, icon }) => (
  <View style={sec.wrap}>
    <View style={sec.line} />
    <View style={sec.inner}>
      <Ionicons name={icon} size={11} color={D.primary} />
      <Text style={sec.label}>{label}</Text>
    </View>
    <View style={sec.line} />
  </View>
);

const sec = StyleSheet.create({
  wrap:  { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 20, marginBottom: 14 },
  line:  { flex: 1, height: 1, backgroundColor: D.border },
  inner: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 2 },
  label: { fontSize: 10, fontFamily: 'PlusJakartaSans_700Bold', color: D.primary, letterSpacing: 1.5, textTransform: 'uppercase' },
});

// ── Constants ─────────────────────────────────────────────────────────────────

const iconOptions = [
  { name: 'camera-outline',    label: 'Cámara' },
  { name: 'videocam-outline',  label: 'Video' },
  { name: 'brush-outline',     label: 'Pincel' },
  { name: 'color-palette',     label: 'Paleta' },
  { name: 'musical-note',      label: 'Música' },
  { name: 'laptop-outline',    label: 'Diseño' },
  { name: 'images-outline',    label: 'Arte Digital' },
];

const getCategoryIcon = (categoryId: string): string => {
  const iconMap: Record<string, string> = {
    'artes-visuales':           'color-palette',
    'artes-escenicas':          'musical-note',
    'medios-audiovisuales':     'videocam',
    'moda-diseno':              'laptop',
    'cultura-turismo':          'location',
    'arte-digital-tecnologia':  'images',
    'servicios-creativos':      'briefcase',
  };
  return iconMap[categoryId] || 'ellipsis-horizontal';
};

const currencies = ['COP', 'USD', 'EUR'];

const deliveryOptions = [
  { key: 'Express',  icon: 'flash-outline' as const },
  { key: 'Estándar', icon: 'checkmark-circle-outline' as const },
  { key: 'A medida', icon: 'build-outline' as const },
];

// ── Main Component ────────────────────────────────────────────────────────────

export const EditServiceModal: React.FC<Props> = ({ visible, service, onClose, onSave }) => {
  const [name, setName]            = useState('');
  const [description, setDesc]     = useState('');
  const [price, setPrice]          = useState('');
  const [currency, setCurrency]    = useState('COP');
  const [duration, setDuration]    = useState('');
  const [category, setCategory]    = useState('');
  const [deliveryTag, setDelivery] = useState('');
  const [icon, setIcon]            = useState('camera-outline');

  const isEditing = !!service;

  const categories = ARTIST_CATEGORIES.map(cat => ({
    id:    cat.id,
    label: getLocalizedCategoryName(cat.id),
    icon:  getCategoryIcon(cat.id),
  }));

  useEffect(() => {
    if (visible && service) {
      setName(service.name ?? '');
      setDesc(service.description ?? '');
      setPrice(service.price?.toString() ?? '');
      setCurrency('COP');
      setDuration(service.duration ?? '');
      setCategory(service.category ?? '');
      setDelivery('');
      setIcon('camera-outline');
    } else if (visible) {
      setName(''); setDesc(''); setPrice('');
      setCurrency('COP'); setDuration('');
      setCategory(''); setDelivery(''); setIcon('camera-outline');
    }
  }, [visible, service]);

  const handleSave = () => {
    if (!name.trim() || !price.trim()) {
      alert('Por favor completa los campos obligatorios');
      return;
    }
    onSave({
      name: name.trim(), description: description.trim(),
      price: price.trim(), currency,
      duration: duration.trim(), category,
      deliveryTag, icon,
    });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent statusBarTranslucent>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={s.kav}>
        <Pressable style={s.overlay} onPress={onClose} />

        <View style={s.sheet}>

          {/* Handle */}
          <View style={s.handleWrap}>
            <View style={s.handle} />
          </View>

          {/* Header */}
          <View style={s.header}>
            <TouchableOpacity onPress={onClose} style={s.closeBtn} hitSlop={12}>
              <Ionicons name="close" size={18} color={D.textSub} />
            </TouchableOpacity>

            <View style={s.titleWrap}>
              <Text style={s.titleEyebrow}>{isEditing ? 'Modificar' : 'Crear'}</Text>
              <Text style={s.title}>Servicio</Text>
            </View>

            <TouchableOpacity onPress={handleSave} style={s.saveBtn}>
              <Ionicons name="checkmark" size={15} color={D.white} />
              <Text style={s.saveBtnText}>Guardar</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={s.content}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >

            {/* ── Información Básica ── */}
            <SectionHeader label="Información Básica" icon="person-outline" />

            <Field
              label="Nombre del servicio" icon="pricetag-outline"
              value={name} onChangeText={setName}
              placeholder="ej. Sesión de Retratos"
              maxLength={60} required
              hint="Un nombre claro aumenta la visibilidad de tu servicio"
            />
            <View style={{ height: 12 }} />
            <Field
              label="Descripción" icon="document-text-outline"
              value={description} onChangeText={setDesc}
              placeholder="Describe qué incluye tu servicio..."
              multiline maxLength={300}
              hint="Los clientes leen la descripción antes de contactarte"
            />

            {/* ── Ícono ── */}
            <SectionHeader label="Ícono del Servicio" icon="shapes-outline" />

            <View style={s.iconGrid}>
              {iconOptions.map((opt) => {
                const selected = icon === opt.name;
                return (
                  <TouchableOpacity
                    key={opt.name}
                    style={[s.iconOption, selected && s.iconOptionSelected]}
                    onPress={() => setIcon(opt.name)}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={opt.name as any}
                      size={22}
                      color={selected ? D.primary : D.textMuted}
                    />
                    <Text style={[s.iconLabel, selected && s.iconLabelSelected]}>
                      {opt.label}
                    </Text>
                    {selected && <View style={s.iconDot} />}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* ── Categoría ── */}
            <SectionHeader label="Categoría" icon="grid-outline" />

            <View style={s.catGrid}>
              {categories.map((cat) => {
                const selected = category === cat.id;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    style={[s.catChip, selected && s.catChipSelected]}
                    onPress={() => setCategory(cat.id)}
                    activeOpacity={0.7}
                  >
                    <View style={{ marginRight: 4 }}>
                      <Ionicons
                        name={`${cat.icon}-outline` as any}
                        size={11}
                        color={selected ? D.white : D.textSub}
                      />
                    </View>
                    <Text style={[s.catText, selected && s.catTextSelected]}>
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* ── Precio y Duración ── */}
            <SectionHeader label="Precio y Duración" icon="cash-outline" />

            <View style={s.priceBlock}>
              {/* Moneda */}
              <View>
                <Text style={s.miniLabel}>Moneda</Text>
                <View style={s.currencyRow}>
                  {currencies.map((c) => (
                    <TouchableOpacity
                      key={c}
                      style={[s.currencyBtn, currency === c && s.currencyBtnSelected]}
                      onPress={() => setCurrency(c)}
                    >
                      <Text style={[s.currencyBtnText, currency === c && s.currencyBtnTextSelected]}>
                        {c}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Precio */}
              <View>
                <Text style={s.miniLabel}>
                  Precio <Text style={{ color: D.primary }}>*</Text>
                </Text>
                <View style={s.priceInputBox}>
                  <Text style={s.priceCurrencyTag}>{currency}</Text>
                  <TextInput
                    style={s.priceInput}
                    value={price}
                    onChangeText={setPrice}
                    placeholder="0"
                    placeholderTextColor={D.textMuted}
                    keyboardType="numeric"
                  />
                </View>
              </View>
            </View>

            <View style={{ height: 14 }} />

            <Field
              label="Duración estimada" icon="time-outline"
              value={duration} onChangeText={setDuration}
              placeholder="ej. 2 horas, 1–3 días"
              maxLength={30}
              hint="Ayuda al cliente a planificar"
            />

            <View style={{ height: 14 }} />

            {/* Delivery tag */}
            <Text style={s.miniLabel}>Tag de Entrega</Text>
            <View style={{ height: 8 }} />
            <View style={s.deliveryRow}>
              {deliveryOptions.map((opt) => {
                const selected = deliveryTag === opt.key;
                return (
                  <TouchableOpacity
                    key={opt.key}
                    style={[s.deliveryTag, selected && s.deliveryTagSelected]}
                    onPress={() => setDelivery(opt.key)}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={opt.icon}
                      size={12}
                      color={selected ? D.primary : D.textMuted}
                    />
                    <Text style={[s.deliveryTagText, selected && s.deliveryTagTextSelected]}>
                      {opt.key}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={{ height: 32 }} />

            {/* CTA principal */}
            <TouchableOpacity style={s.ctaBtn} onPress={handleSave} activeOpacity={0.85}>
              <Ionicons
                name={isEditing ? 'create-outline' : 'add-circle-outline'}
                size={18}
                color={D.white}
              />
              <Text style={s.ctaBtnText}>
                {isEditing ? 'Guardar cambios' : 'Crear servicio'}
              </Text>
            </TouchableOpacity>

            <View style={{ height: 24 }} />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

// ── Styles ────────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  kav: { flex: 1, justifyContent: 'flex-end' },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(80,60,130,0.25)',
  },

  sheet: {
    backgroundColor: D.bg,
    borderTopLeftRadius: D.radius.xl,
    borderTopRightRadius: D.radius.xl,
    maxHeight: '93%',
    overflow: 'hidden',
    borderTopWidth: 1.5,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: D.borderHi,
    shadowColor: D.primary,
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 16,
  },

  handleWrap: { alignItems: 'center', paddingTop: 12, paddingBottom: 4 },
  handle: {
    width: 40, height: 4,
    backgroundColor: D.borderHi,
    borderRadius: 2,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: D.border,
  },

  closeBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: D.surface,
    borderWidth: 1, borderColor: D.border,
    alignItems: 'center', justifyContent: 'center',
  },

  titleWrap:    { alignItems: 'center' },
  titleEyebrow: {
    fontSize: 9, fontFamily: 'PlusJakartaSans_600SemiBold',
    color: D.primary, letterSpacing: 2.5,
    textTransform: 'uppercase', marginBottom: 1,
  },
  title: {
    fontSize: 18, fontFamily: 'PlusJakartaSans_700Bold',
    color: D.text, letterSpacing: -0.3,
  },

  saveBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: D.primary,
    paddingHorizontal: 14, paddingVertical: 9,
    borderRadius: D.radius.lg,
    shadowColor: D.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  saveBtnText: {
    fontSize: 13, fontFamily: 'PlusJakartaSans_700Bold',
    color: D.white, letterSpacing: 0.2,
  },

  content: { paddingHorizontal: 20, paddingTop: 4 },

  // ── Icon grid ──
  iconGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  iconOption: {
    alignItems: 'center', justifyContent: 'center',
    minWidth: 72, minHeight: 72,
    paddingHorizontal: 8,
    borderWidth: 1.5, borderColor: D.border,
    borderRadius: D.radius.md,
    backgroundColor: D.surface,
    gap: 5, position: 'relative',
  },
  iconOptionSelected: {
    borderColor: D.primary,
    backgroundColor: D.primarySoft,
  },
  iconLabel: { fontSize: 9, fontFamily: 'PlusJakartaSans_400Regular', color: D.textMuted },
  iconLabelSelected: { color: D.primary, fontFamily: 'PlusJakartaSans_600SemiBold' },
  iconDot: {
    position: 'absolute', top: 6, right: 6,
    width: 6, height: 6, borderRadius: 3,
    backgroundColor: D.primary,
  },

  // ── Category chips ──
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  catChip: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 12, paddingVertical: 7,
    borderWidth: 1.5, borderColor: D.border,
    borderRadius: 20,
    backgroundColor: D.surface,
  },
  catChipSelected: {
    borderColor: D.primary,
    backgroundColor: D.primary,
  },
  catText: { fontSize: 12, fontFamily: 'PlusJakartaSans_500Medium', color: D.textSub },
  catTextSelected: { color: D.white, fontFamily: 'PlusJakartaSans_700Bold' },

  // ── Price block ──
  priceBlock: {
    backgroundColor: D.surface,
    borderWidth: 1, borderColor: D.border,
    borderRadius: D.radius.lg,
    padding: 16, gap: 14,
  },

  miniLabel: {
    fontSize: 10, fontFamily: 'PlusJakartaSans_600SemiBold',
    color: D.textSub, letterSpacing: 1,
    textTransform: 'uppercase', marginBottom: 8,
  },

  currencyRow: { flexDirection: 'row', gap: 6 },
  currencyBtn: {
    paddingHorizontal: 14, paddingVertical: 9,
    borderRadius: D.radius.sm,
    borderWidth: 1.5, borderColor: D.border,
    backgroundColor: D.surfaceHigh,
  },
  currencyBtnSelected: {
    borderColor: D.primary,
    backgroundColor: D.primarySoft,
  },
  currencyBtnText: {
    fontSize: 12, fontFamily: 'PlusJakartaSans_600SemiBold', color: D.textMuted,
  },
  currencyBtnTextSelected: { color: D.primary },

  priceInputBox: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1.5, borderColor: D.border,
    borderRadius: D.radius.md,
    backgroundColor: D.surfaceHigh,
    paddingHorizontal: 14, minHeight: 52, gap: 8,
  },
  priceCurrencyTag: {
    fontSize: 11, fontFamily: 'PlusJakartaSans_700Bold',
    color: D.primary, letterSpacing: 0.5,
    paddingRight: 8,
    borderRightWidth: 1, borderRightColor: D.border,
  },
  priceInput: {
    flex: 1, fontSize: 24, fontFamily: 'PlusJakartaSans_700Bold',
    color: D.text, letterSpacing: -0.5,
  },

  // ── Delivery tags ──
  deliveryRow: { flexDirection: 'row', gap: 8 },
  deliveryTag: {
    flex: 1, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center',
    gap: 5, paddingVertical: 11,
    borderRadius: D.radius.md,
    borderWidth: 1.5, borderColor: D.border,
    backgroundColor: D.surface,
  },
  deliveryTagSelected: {
    borderColor: D.primary,
    backgroundColor: D.primarySoft,
  },
  deliveryTagText: {
    fontSize: 11, fontFamily: 'PlusJakartaSans_500Medium', color: D.textMuted,
  },
  deliveryTagTextSelected: {
    color: D.primary, fontFamily: 'PlusJakartaSans_700Bold',
  },

  // ── CTA ──
  ctaBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8,
    backgroundColor: D.primary,
    borderRadius: D.radius.lg,
    paddingVertical: 16,
    shadowColor: D.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  ctaBtnText: {
    fontSize: 15, fontFamily: 'PlusJakartaSans_700Bold',
    color: D.white, letterSpacing: 0.2,
  },
});