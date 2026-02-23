// ─────────────────────────────────────────────────────────────────────────────
// EditProductModal.tsx — Modal para agregar/editar productos de la tienda
// nombre · tipo · precio · emoji · descripción · stock · categorías
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
import { Product } from '../types';

// ── Tipos ─────────────────────────────────────────────────────────────────────

export type ProductFormData = {
  name: string;
  type: string;
  price: string;
  emoji: string;
  description: string;
  stock: string;
  categories: string[];
  gradientStart: string;
  gradientEnd: string;
};

type Props = {
  visible: boolean;
  product?: Product; // Si se proporciona, es modo edición
  onClose: () => void;
  onSave: (data: ProductFormData) => void;
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

export const EditProductModal: React.FC<Props> = ({ visible, product, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [price, setPrice] = useState('');
  const [emoji, setEmoji] = useState('🎨');
  const [description, setDescription] = useState('');
  const [stock, setStock] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [gradientStart, setGradientStart] = useState('#FF6B6B');
  const [gradientEnd, setGradientEnd] = useState('#4ECDC4');

  // Opciones de tipos de productos
  const productTypes = [
    'Arte Digital', 'Impresión', 'Merchandise', 'Curso', 
    'Tutorial', 'Template', 'Presets', 'Otro'
  ];

  // Opciones de emojis
  const emojiOptions = [
    '🎨', '📷', '🖼️', '🎭', '🎪', '🎯', '🎲', '🎸',
    '🖌️', '✏️', '📐', '🔧', '💡', '🌟', '🔥', '💎'
  ];

  // Opciones de gradientes
  const gradientOptions = [
    { start: '#FF6B6B', end: '#4ECDC4', label: 'Coral' },
    { start: '#45B7D1', end: '#96CEB4', label: 'Océano' },
    { start: '#F7DC6F', end: '#BB8FCE', label: 'Atardecer' },
    { start: '#85C1E2', end: '#F8B739', label: 'Cielo' },
    { start: '#F8B739', end: '#C0392B', label: 'Fuego' },
    { start: '#8E44AD', end: '#3498DB', label: 'Místico' },
  ];

  // Pre-poblar al abrir (modo edición)
  useEffect(() => {
    if (visible && product) {
      setName(product.name ?? '');
      setType(product.type ?? '');
      setPrice(product.price ?? '');
      setEmoji(product.emoji ?? '🎨');
      setDescription('');
      setStock('10'); // Default
      setCategories([]);
      setGradientStart(product.gradientStart ?? '#FF6B6B');
      setGradientEnd(product.gradientEnd ?? '#4ECDC4');
    } else if (visible) {
      // Reset para modo creación
      setName('');
      setType('');
      setPrice('');
      setEmoji('🎨');
      setDescription('');
      setStock('10');
      setCategories([]);
      setGradientStart('#FF6B6B');
      setGradientEnd('#4ECDC4');
    }
  }, [visible, product]);

  const handleSave = () => {
    if (!name.trim() || !price.trim()) {
      alert('Por favor completa los campos obligatorios');
      return;
    }

    onSave({
      name: name.trim(),
      type: type.trim(),
      price: price.trim(),
      emoji: emoji,
      description: description.trim(),
      stock: stock.trim(),
      categories: categories,
      gradientStart: gradientStart,
      gradientEnd: gradientEnd,
    });
    onClose();
  };

  const toggleCategory = (category: string) => {
    setCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
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
            <Text style={styles.title}>{product ? 'Editar Producto' : 'Nuevo Producto'}</Text>
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
              label="Nombre del producto"
              icon="pricetag-outline"
              value={name}
              onChangeText={setName}
              placeholder="ej. Presets de Lightroom"
              maxLength={60}
            />

            <Field
              label="Tipo"
              icon="folder-outline"
              value={type}
              onChangeText={setType}
              placeholder="ej. Arte Digital"
              maxLength={30}
            />

            <Field
              label="Precio"
              icon="cash-outline"
              value={price}
              onChangeText={setPrice}
              placeholder="ej. 25000"
              keyboardType="numeric"
              hint="Valor en pesos colombianos"
            />

            <Field
              label="Stock"
              icon="cube-outline"
              value={stock}
              onChangeText={setStock}
              placeholder="ej. 10"
              keyboardType="numeric"
              hint="Unidades disponibles"
            />

            {/* ── Emoji ── */}
            <Text style={[styles.sectionLabel, { marginTop: 20 }]}>EMOJI</Text>
            <Text style={styles.tagHint}>
              Selecciona un emoji para tu producto
            </Text>

            <View style={styles.emojiGrid}>
              {emojiOptions.map((emojiOption) => (
                <TouchableOpacity
                  key={emojiOption}
                  style={[
                    styles.emojiOption,
                    emoji === emojiOption && styles.emojiOptionSelected
                  ]}
                  onPress={() => setEmoji(emojiOption)}
                >
                  <Text style={styles.emojiText}>{emojiOption}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* ── Descripción ── */}
            <Text style={[styles.sectionLabel, { marginTop: 20 }]}>DESCRIPCIÓN</Text>

            <Field
              label="Descripción del producto"
              icon="document-text-outline"
              value={description}
              onChangeText={setDescription}
              placeholder="Describe tu producto..."
              multiline
              maxLength={300}
              hint="¿Qué incluye? ¿Para quién es?"
            />

            {/* ── Gradiente ── */}
            <Text style={[styles.sectionLabel, { marginTop: 20 }]}>COLOR DE FONDO</Text>
            <Text style={styles.tagHint}>
              Selecciona un gradiente para tu producto
            </Text>

            <View style={styles.gradientGrid}>
              {gradientOptions.map((gradient, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.gradientOption,
                    gradientStart === gradient.start && gradientEnd === gradient.end && styles.gradientOptionSelected
                  ]}
                  onPress={() => {
                    setGradientStart(gradient.start);
                    setGradientEnd(gradient.end);
                  }}
                >
                  <View style={[
                    styles.gradientPreview,
                    { 
                      backgroundColor: gradient.start 
                    }
                  ]} />
                  <Text style={styles.gradientLabel}>{gradient.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* ── Tipos sugeridos ── */}
            <Text style={[styles.sectionLabel, { marginTop: 20 }]}>TIPOS SUGERIDOS</Text>
            <View style={styles.typeGrid}>
              {productTypes.map((productType) => (
                <TouchableOpacity
                  key={productType}
                  style={[
                    styles.typeOption,
                    type === productType && styles.typeOptionSelected
                  ]}
                  onPress={() => setType(productType)}
                >
                  <Text style={[
                    styles.typeText,
                    type === productType && styles.typeTextSelected
                  ]}>
                    {productType}
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
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
  },
  emojiOption: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    backgroundColor: Colors.surface,
  },
  emojiOptionSelected: {
    borderColor: Colors.primary,
    backgroundColor: `${Colors.primary}10`,
  },
  emojiText: {
    fontSize: 24,
  },
  gradientGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
  },
  gradientOption: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 60,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    backgroundColor: Colors.surface,
    padding: 4,
  },
  gradientOptionSelected: {
    borderColor: Colors.primary,
    backgroundColor: `${Colors.primary}10`,
  },
  gradientPreview: {
    width: '100%',
    height: 30,
    borderRadius: Radius.sm,
  },
  gradientLabel: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: Colors.text,
    marginTop: 2,
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
