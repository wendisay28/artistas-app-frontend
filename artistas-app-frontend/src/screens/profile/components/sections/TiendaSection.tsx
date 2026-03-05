// ─────────────────────────────────────────────────────────────────────
// TiendaSection.tsx — Tienda propia del artista · Diseño Moderno
// Estética: consistente con theme/colors.ts · moderno · limpio
// ─────────────────────────────────────────────────────────────────────

import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Animated,
  TextInput,
  Modal,
  Share,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Radius, Spacing } from '../../../../theme';
import { Product } from '../types';
import { EditButton } from '../shared/EditButton';

// ── Constantes de layout ──────────────────────────────────────────────
const SCREEN_W = Dimensions.get('window').width;
const H_PAD    = Spacing.lg ?? 16;
const GAP      = 12;
const CARD_W   = (SCREEN_W - H_PAD * 2 - GAP) / 2;

// ── Tipos ─────────────────────────────────────────────────────────────────────
type FilterKey = 'todo' | 'digital' | 'nft' | 'fisico' | 'musica' | 'cursos';
type SortKey   = 'popular' | 'nuevo' | 'precio_asc' | 'precio_desc';
type ViewMode  = 'grid' | 'list';

type FilterDef = {
  key:   FilterKey;
  label: string;
  icon:  React.ComponentProps<typeof Ionicons>['name'];
};

const FILTERS: FilterDef[] = [
  { key: 'todo',    label: 'Todo',         icon: 'apps-outline'          },
  { key: 'digital', label: 'Arte digital', icon: 'image-outline'         },
  { key: 'nft',     label: 'NFT',          icon: 'diamond-outline'       },
  { key: 'fisico',  label: 'Físico',       icon: 'cube-outline'          },
  { key: 'musica',  label: 'Música',       icon: 'musical-notes-outline' },
  { key: 'cursos',  label: 'Cursos',       icon: 'school-outline'        },
];

const SORTS: { key: SortKey; label: string; icon: React.ComponentProps<typeof Ionicons>['name'] }[] = [
  { key: 'popular',     label: 'Más popular',  icon: 'flame-outline'       },
  { key: 'nuevo',       label: 'Más nuevos',   icon: 'sparkles-outline'    },
  { key: 'precio_asc',  label: 'Menor precio', icon: 'arrow-up-outline'    },
  { key: 'precio_desc', label: 'Mayor precio', icon: 'arrow-down-outline'  },
];

// ── Tipo de Producto ──────────────────────────────────────────────────────────
export type StoreProduct = Product & {
  category:     FilterKey;
  isNew?:       boolean;
  isFeatured?:  boolean;
  rating?:      number;
  ratingCount?: number;
  description?: string;
  previewColor: string;
  gradientStart: string;
  gradientEnd:   string;
};

// ── Mock products ─────────────────────────────────────────────────────────────
export const STORE_PRODUCTS: StoreProduct[] = [
  {
    id: 'sp1', name: 'Cosmos Interior', type: 'Arte digital · 4K', price: '$45 USD',
    category: 'digital', emoji: '', gradientStart: '#7C3AED', gradientEnd: '#8B5CF6',
    previewColor: '#EDE9FE', isFeatured: true, rating: 4.9, ratingCount: 38,
    description: 'Arte digital de alta resolución disponible para descarga inmediata.',
  },
  {
    id: 'sp2', name: 'Llama Eterna', type: 'NFT · OpenSea', price: '0.4 ETH',
    badge: 'nft', category: 'nft', emoji: '', gradientStart: '#F59E0B', gradientEnd: '#FCD34D',
    previewColor: '#FEF2F5', isNew: true, rating: 5.0, ratingCount: 3,
  },
  {
    id: 'sp3', name: 'EP "Ruido Visible"', type: 'Vinilo · Ed. limitada', price: '$85.000 COP',
    badge: 'low', category: 'musica', emoji: '', gradientStart: '#10B981', gradientEnd: '#34D399',
    previewColor: '#E0F2FE', rating: 4.8, ratingCount: 12,
  },
  {
    id: 'sp4', name: 'Print "Noche Azul"', type: 'Giclée · 50×70 cm', price: '$120 USD',
    badge: 'out', category: 'fisico', emoji: '', gradientStart: '#3B82F6', gradientEnd: '#60A5FA',
    previewColor: '#E0F2FE', rating: 4.7, ratingCount: 22,
  },
  {
    id: 'sp5', name: 'Pack Wallpapers', type: 'Digital · 20 archivos', price: '$12 USD',
    category: 'digital', emoji: '', gradientStart: '#EC4899', gradientEnd: '#F472B6',
    previewColor: '#EDE9FE', isNew: true, rating: 4.6, ratingCount: 54,
  },
  {
    id: 'sp6', name: 'Masterclass Procreate', type: 'Curso · 3 hrs video', price: '$25 USD',
    category: 'cursos', emoji: '', gradientStart: '#059669', gradientEnd: '#10B981',
    previewColor: '#E0F2FE', rating: 4.9, ratingCount: 41,
  },
  {
    id: 'sp7', name: 'Canción Personalizada', type: 'Entrega en 10 días', price: '$150 USD',
    category: 'musica', emoji: '', gradientStart: '#DC2626', gradientEnd: '#EF4444',
    previewColor: '#FEF2F5', rating: 5.0, ratingCount: 9,
  },
  {
    id: 'sp8', name: 'Retrato Digital', type: 'Arte digital · Encargo', price: '$80 USD',
    category: 'digital', emoji: '', gradientStart: '#7C3AED', gradientEnd: '#A78BFA',
    previewColor: '#EDE9FE', rating: 4.8, ratingCount: 31,
  },
];

// ─────────────────────────────────────────────────────────────────────
// SUB-COMPONENTES
// ─────────────────────────────────────────────────────────────────────

// ── Badge de estado ───────────────────────────────────────────────────
type BadgeType = 'nft' | 'low' | 'out' | 'new' | 'featured';

const BADGE_CFG: Record<BadgeType, { label: string; bg: string; text: string; border: string }> = {
  nft:      { label: 'NFT',       bg: '#3B82F6', text: '#60A5FA', border: '#1D4ED8' },
  low:      { label: 'Últimas',   bg: '#FEF2F5', text: '#F59E0B', border: '#FCD34D' },
  out:      { label: 'Agotado',   bg: Colors.surface2, text: Colors.textSecondary, border: Colors.border },
  new:      { label: 'Nuevo',     bg: '#E0F2FE', text: '#10B981', border: '#34D399' },
  featured: { label: 'Destacado', bg: '#EDE9FE', text: '#7C3AED', border: '#8B5CF6' },
};

const Badge: React.FC<{ type: BadgeType; size?: 'sm' | 'md' }> = ({ type, size = 'sm' }) => {
  const cfg = BADGE_CFG[type];
  return (
    <View style={[bdg.wrap, { backgroundColor: cfg.bg, borderColor: cfg.border },
      size === 'md' && bdg.wrapMd]}>
      <Text style={[bdg.label, { color: cfg.text }, size === 'md' && bdg.labelMd]}>
        {cfg.label}
      </Text>
    </View>
  );
};

const bdg = StyleSheet.create({
  wrap:    { borderRadius: 6, borderWidth: 1, paddingHorizontal: 6, paddingVertical: 2 },
  wrapMd:  { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  label:   { fontSize: 9, fontFamily: 'PlusJakartaSans_700Bold', letterSpacing: 0.3 },
  labelMd: { fontSize: 11 },
});

// ── Rating Row ────────────────────────────────────────────────────────
const RatingRow: React.FC<{ rating: number; count: number; compact?: boolean }> = ({
  rating, count, compact,
}) => (
  <View style={rr.row}>
    <Ionicons name="star" size={compact ? 10 : 11} color={Colors.warm} />
    <Text style={[rr.val, compact && rr.compact]}>{rating.toFixed(1)}</Text>
    {!compact && <Text style={rr.count}>({count})</Text>}
  </View>
);

const rr = StyleSheet.create({
  row:     { flexDirection: 'row', alignItems: 'center', gap: 3 },
  val:     { fontSize: 11.5, fontFamily: 'PlusJakartaSans_700Bold', color: Colors.textSecondary },
  compact: { fontSize: 10.5 },
  count:   { fontSize: 10.5, fontFamily: 'PlusJakartaSans_400Regular', color: Colors.textSecondary },
});

// ── Botón añadir ───────────────────────────────────────────────────
const AddButton: React.FC<{
  disabled?: boolean;
  onPress: () => void;
  variant?: 'icon' | 'pill';
}> = ({ disabled, onPress, variant = 'icon' }) => {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    if (disabled) return;
    Animated.sequence([
      Animated.spring(scale, { toValue: 0.85, useNativeDriver: true, speed: 50 }),
      Animated.spring(scale, { toValue: 1,    useNativeDriver: true, speed: 20 }),
    ]).start();
    onPress();
  };

  if (variant === 'pill') {
    return (
      <Animated.View style={{ transform: [{ scale }] }}>
        <TouchableOpacity
          style={[abt.pill, disabled && abt.pillDisabled]}
          onPress={handlePress}
          activeOpacity={0.8}
        >
          <Ionicons name={disabled ? 'close-outline' : 'bag-add-outline'}
            size={13} color={disabled ? Colors.textSecondary : '#fff'} />
          <Text style={[abt.pillText, disabled && abt.pillTextDisabled]}>
            {disabled ? 'Agotado' : 'Añadir'}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        style={[abt.icon, disabled && abt.iconDisabled]}
        onPress={handlePress}
        disabled={disabled}
        activeOpacity={0.75}
      >
        <Ionicons
          name={disabled ? 'close-outline' : 'add'}
          size={16}
          color={disabled ? Colors.textSecondary : '#fff'}
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

const abt = StyleSheet.create({
  icon: {
    width: 32, height: 32, borderRadius: 10,
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center',
  },
  iconDisabled: { backgroundColor: Colors.surface2 },
  pill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: Colors.primary, borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 8,
  },
  pillDisabled: { backgroundColor: Colors.surface2 },
  pillText: {
    fontSize: 12, fontFamily: 'PlusJakartaSans_700Bold', color: '#fff',
  },
  pillTextDisabled: { color: Colors.textSecondary },
});

// ─────────────────────────────────────────────────────────────────────
// TARJETA GRID (2 columnas)
// ─────────────────────────────────────────────────────────────────────
const GridCard: React.FC<{
  product: StoreProduct;
  onPress: () => void;
  onAddToCart: () => void;
}> = ({ product, onPress, onAddToCart }) => {
  const isOut = product.badge === 'out';
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn  = () => Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, speed: 50 }).start();
  const onPressOut = () => Animated.spring(scale, { toValue: 1,    useNativeDriver: true, speed: 20 }).start();

  return (
    <Animated.View style={[{ transform: [{ scale }] }, { width: CARD_W }]}>
      <TouchableOpacity
        style={gc.card}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        activeOpacity={1}
      >
        {/* Thumbnail con gradiente */}
        <LinearGradient
          colors={[product.gradientStart, product.gradientEnd]}
          style={gc.thumb}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={{ opacity: 0.8 }}>
            <Ionicons
              name="image-outline"
              size={32}
              color={product.previewColor}
            />
          </View>

          {/* Badges top */}
          <View style={gc.badgeTopLeft}>
            {product.isFeatured && <Badge type="featured" />}
            {product.isNew && !product.isFeatured && <Badge type="new" />}
          </View>
          {product.badge && (
            <View style={gc.badgeTopRight}>
              <Badge type={product.badge as BadgeType} />
            </View>
          )}
        </LinearGradient>

        {/* Body */}
        <View style={gc.body}>
          <Text style={gc.name} numberOfLines={1}>{product.name}</Text>
          <Text style={gc.type} numberOfLines={1}>{product.type}</Text>

          {product.rating !== undefined && (
            <RatingRow rating={product.rating} count={product.ratingCount ?? 0} compact />
          )}

          <View style={gc.footer}>
            <Text style={[gc.price, isOut && gc.priceOut]}>{product.price}</Text>
            <AddButton disabled={isOut} onPress={onAddToCart} variant="icon" />
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const gc = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  thumb: {
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badgeTopLeft: { 
    position: 'absolute', 
    top: 12, 
    left: 12, 
  },
  badgeTopRight: { 
    position: 'absolute', 
    top: 12, 
    right: 12, 
  },
  body: { 
    padding: 16, 
    backgroundColor: Colors.bg,
  },
  name: { 
    fontSize: 15, 
    fontFamily: 'PlusJakartaSans_700Bold', 
    color: Colors.text, 
    marginBottom: 4,
  },
  type: { 
    fontSize: 11, 
    fontFamily: 'PlusJakartaSans_500Medium', 
    color: Colors.textSecondary, 
    marginBottom: 6,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  price: { 
    fontSize: 16, 
    fontFamily: 'PlusJakartaSans_800ExtraBold', 
    color: Colors.primary,
  },
  priceOut: { 
    color: Colors.textSecondary, 
    textDecorationLine: 'line-through' 
  },
});

// ─────────────────────────────────────────────────────────────────────
// SEARCH BAR
// ─────────────────────────────────────────────────────────────────────
const SearchBar: React.FC<{
  value: string;
  onChange: (v: string) => void;
  viewMode: ViewMode;
  onToggleView: () => void;
  isOwner?: boolean;
  onEditSection?: () => void;
}> = ({ value, onChange, viewMode, onToggleView, isOwner, onEditSection }) => (
  <View style={sb.row}>
    <View style={sb.inputWrap}>
      <Ionicons name="search-outline" size={15} color={Colors.textSecondary} />
      <TextInput
        style={sb.input}
        placeholder="Buscar en la tienda..."
        placeholderTextColor={Colors.textSecondary}
        value={value}
        onChangeText={onChange}
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={() => onChange('')}>
          <Ionicons name="close-circle" size={16} color={Colors.textSecondary} />
        </TouchableOpacity>
      )}
    </View>
    {isOwner && onEditSection && (
      <TouchableOpacity style={sb.iconBtn} onPress={onEditSection} activeOpacity={0.75}>
        <Ionicons name="pencil-outline" size={17} color={Colors.textSecondary} />
      </TouchableOpacity>
    )}
    <TouchableOpacity style={sb.iconBtn} onPress={onToggleView} activeOpacity={0.75}>
      <Ionicons
        name={viewMode === 'grid' ? 'list-outline' : 'grid-outline'}
        size={17}
        color={Colors.textSecondary}
      />
    </TouchableOpacity>
  </View>
);

const sb = StyleSheet.create({
  row:       { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  inputWrap: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: Colors.surface, borderRadius: 14,
    borderWidth: 1, borderColor: Colors.border,
    paddingHorizontal: 13, height: 42,
  },
  input:  { flex: 1, fontSize: 13, fontFamily: 'PlusJakartaSans_400Regular', color: Colors.text },
  iconBtn: {
    width: 42, height: 42, borderRadius: 14,
    backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
});

// ─────────────────────────────────────────────────────────────────────
// PRODUCT DETAIL MODAL
// ─────────────────────────────────────────────────────────────────────
const ProductDetailModal: React.FC<{
  product: StoreProduct;
  visible: boolean;
  onClose: () => void;
  onAddToCart: () => void;
}> = ({ product, visible, onClose, onAddToCart }) => {
  const [saved, setSaved] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `¡Mira este producto! ${product.name} - ${product.price}`,
        url: `https://artistas-app.com/product/${product.id}`,
      });
    } catch (error) {
      Alert.alert('Error', 'No se pudo compartir el producto');
    }
  };

  const handleSave = () => {
    setSaved(!saved);
    // Aquí iría la lógica para guardar en favoritos
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={pdm.container}>
        {/* Header */}
        <View style={pdm.header}>
          <TouchableOpacity onPress={onClose} style={pdm.headerBtn}>
            <Ionicons name="arrow-back" size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={pdm.headerTitle}>Detalles del producto</Text>
          <TouchableOpacity onPress={handleShare} style={pdm.headerBtn}>
            <Ionicons name="share-outline" size={24} color={Colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Product Image */}
          <View style={pdm.imageContainer}>
            <LinearGradient
              colors={[product.gradientStart, product.gradientEnd]}
              style={pdm.productImage}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={{ opacity: 0.8 }}>
                <Ionicons
                  name="image-outline"
                  size={64}
                  color={product.previewColor}
                />
              </View>
            </LinearGradient>
            
            {/* Image dots */}
            <View style={pdm.dots}>
              {[0, 1, 2].map((i) => (
                <View
                  key={i}
                  style={[pdm.dot, i === selectedImage && pdm.dotActive]}
                />
              ))}
            </View>
          </View>

          {/* Product Info */}
          <View style={pdm.content}>
            {/* Title and Price */}
            <View style={pdm.titleRow}>
              <View style={pdm.titleLeft}>
                <Text style={pdm.productName}>{product.name}</Text>
                <Text style={pdm.productType}>{product.type}</Text>
              </View>
              <TouchableOpacity onPress={handleSave} style={pdm.saveBtn}>
                <Ionicons
                  name={saved ? 'bookmark' : 'bookmark-outline'}
                  size={24}
                  color={saved ? Colors.primary : Colors.textSecondary}
                />
              </TouchableOpacity>
            </View>

            {/* Price and Rating */}
            <View style={pdm.priceRow}>
              <Text style={pdm.price}>{product.price}</Text>
              {product.rating !== undefined && (
                <View style={pdm.ratingContainer}>
                  <Ionicons name="star" size={16} color={Colors.warm} />
                  <Text style={pdm.rating}>
                    {product.rating.toFixed(1)} ({product.ratingCount ?? 0})
                  </Text>
                </View>
              )}
            </View>

            {/* Badges */}
            <View style={pdm.badges}>
              {product.isFeatured && <Badge type="featured" size="md" />}
              {product.isNew && !product.isFeatured && <Badge type="new" size="md" />}
              {product.badge && <Badge type={product.badge as BadgeType} size="md" />}
            </View>

            {/* Description */}
            {product.description && (
              <View style={pdm.section}>
                <Text style={pdm.sectionTitle}>Descripción</Text>
                <Text style={pdm.description}>{product.description}</Text>
              </View>
            )}

            {/* Quick Actions */}
            <View style={pdm.quickActions}>
              <TouchableOpacity style={pdm.actionBtn}>
                <Ionicons name="chatbubble-outline" size={20} color={Colors.primary} />
                <Text style={pdm.actionText}>Preguntar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={pdm.actionBtn}>
                <Ionicons name="heart-outline" size={20} color={Colors.primary} />
                <Text style={pdm.actionText}>Me gusta</Text>
              </TouchableOpacity>
              <TouchableOpacity style={pdm.actionBtn}>
                <Ionicons name="eye-outline" size={20} color={Colors.primary} />
                <Text style={pdm.actionText}>Vistas</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Action */}
        <View style={pdm.bottomAction}>
          <TouchableOpacity
            style={[
              pdm.addToCartBtn,
              product.badge === 'out' && pdm.addToCartBtnDisabled
            ]}
            onPress={onAddToCart}
            disabled={product.badge === 'out'}
          >
            <Ionicons
              name={product.badge === 'out' ? 'close-outline' : 'bag-add-outline'}
              size={20}
              color="#fff"
            />
            <Text style={pdm.addToCartText}>
              {product.badge === 'out' ? 'Agotado' : 'Añadir al carrito'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const pdm = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: Colors.text,
  },
  imageContainer: {
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dots: {
    position: 'absolute',
    bottom: 16,
    flexDirection: 'row',
    alignSelf: 'center',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  dotActive: {
    backgroundColor: '#fff',
    width: 20,
  },
  content: {
    padding: Spacing.lg,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleLeft: {
    flex: 1,
  },
  productName: {
    fontSize: 22,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: Colors.text,
    marginBottom: 4,
  },
  productType: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: Colors.textSecondary,
  },
  saveBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  price: {
    fontSize: 24,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: Colors.primary,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: Colors.textSecondary,
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: Colors.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.border,
    marginBottom: 20,
  },
  actionBtn: {
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: Colors.textSecondary,
  },
  bottomAction: {
    padding: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.bg,
  },
  addToCartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
  },
  addToCartBtnDisabled: {
    backgroundColor: Colors.surface2,
  },
  addToCartText: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#fff',
  },
});

// ─────────────────────────────────────────────────────────────────────
// TIENDA SECTION — componente principal
// ─────────────────────────────────────────────────────────────────────
type Props = {
  products?: StoreProduct[];
  artistName?: string;
  isOwner?: boolean;
  onEditSection?: () => void;
};

export const TiendaSection: React.FC<Props> = ({
  products = STORE_PRODUCTS,
  artistName = 'Valeria',
  isOwner,
  onEditSection,
}) => {
  const [activeFilter, setActiveFilter] = useState<FilterKey>('todo');
  const [activeSort,   setActiveSort]   = useState<SortKey>('popular');
  const [viewMode,     setViewMode]     = useState<ViewMode>('grid');
  const [cartCount,    setCartCount]    = useState(0);
  const [showSort,     setShowSort]     = useState(false);
  const [search,       setSearch]       = useState('');
  const [selectedProduct, setSelectedProduct] = useState<StoreProduct | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);

  // ── Filtrado + búsqueda + orden ───────────────────────────────────
  const filtered = React.useMemo(() => {
    let list = activeFilter === 'todo'
      ? products
      : products.filter(p => p.category === activeFilter);

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) || p.type.toLowerCase().includes(q),
      );
    }

    return [...list].sort((a, b) => {
      switch (activeSort) {
        case 'popular':     return 0;
        case 'nuevo':       return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        case 'precio_asc':  return parseFloat(a.price.replace(/[^0-9.]/g, '')) - parseFloat(b.price.replace(/[^0-9.]/g, ''));
        case 'precio_desc': return parseFloat(b.price.replace(/[^0-9.]/g, '')) - parseFloat(a.price.replace(/[^0-9.]/g, ''));
        default: return 0;
      }
    });
  }, [activeFilter, search, activeSort, products]);

  const featured = filtered.find(p => p.isFeatured);
  const rest     = filtered.filter(p => !p.isFeatured);

  const addToCart = useCallback(() => setCartCount(c => c + 1), []);
  
  const openProductDetail = useCallback((product: StoreProduct) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  }, []);
  
  const closeProductModal = useCallback(() => {
    setShowProductModal(false);
    setSelectedProduct(null);
  }, []);
  
  const handleAddToCartFromModal = useCallback(() => {
    if (selectedProduct) {
      addToCart();
      closeProductModal();
    }
  }, [selectedProduct, addToCart, closeProductModal]);
  
  const totalProducts = products.length;

  // Grid pairs
  const pairs: StoreProduct[][] = [];
  for (let i = 0; i < rest.length; i += 2) {
    pairs.push([rest[i], rest[i + 1]].filter(Boolean) as StoreProduct[]);
  }

  const sortLabel = SORTS.find(s => s.key === activeSort)?.label ?? 'Ordenar';

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Search */}
      <SearchBar
        value={search}
        onChange={setSearch}
        viewMode={viewMode}
        onToggleView={() => setViewMode(v => v === 'grid' ? 'list' : 'grid')}
        isOwner={isOwner}
        onEditSection={onEditSection}
      />

      {/* Filters */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterContainer}
      >
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f.key}
            style={[
              styles.filterChip,
              activeFilter === f.key && styles.filterChipActive
            ]}
            onPress={() => setActiveFilter(f.key)}
            activeOpacity={0.75}
          >
            <Ionicons 
              name={f.icon} 
              size={14} 
              color={activeFilter === f.key ? Colors.primary : Colors.textSecondary} 
            />
            <Text style={[
              styles.filterChipText,
              activeFilter === f.key && styles.filterChipTextActive
            ]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Featured product */}
      {featured && viewMode === 'grid' && (
        <View style={styles.featuredContainer}>
            <GridCard
              product={featured}
              onPress={() => openProductDetail(featured)}
              onAddToCart={addToCart}
            />
        </View>
      )}

      {/* Products Grid/List */}
      {viewMode === 'grid' ? (
        <View style={styles.gridContainer}>
          {pairs.map((pair, i) => (
            <View key={i} style={styles.gridRow}>
              {pair.map(product => (
                <GridCard
                  key={product.id}
                  product={product}
                  onPress={() => openProductDetail(product)}
                  onAddToCart={addToCart}
                />
              ))}
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.listContainer}>
          {rest.map(product => (
            <View key={product.id} style={styles.listItem}>
              <View style={styles.listThumb}>
                <LinearGradient
                  colors={[product.gradientStart, product.gradientEnd]}
                  style={styles.listThumbGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={{ opacity: 0.8 }}>
                    <Ionicons
                      name="image-outline"
                      size={24}
                      color={product.previewColor}
                    />
                  </View>
                </LinearGradient>
              </View>
              <View style={styles.listContent}>
                <View style={styles.listHeader}>
                  <Text style={styles.listName}>{product.name}</Text>
                  {product.badge && <Badge type={product.badge as BadgeType} />}
                </View>
                <Text style={styles.listType}>{product.type}</Text>
                {product.rating !== undefined && (
                  <RatingRow rating={product.rating} count={product.ratingCount ?? 0} />
                )}
                <View style={styles.listFooter}>
                  <Text style={styles.listPrice}>{product.price}</Text>
                  <AddButton disabled={product.badge === 'out'} onPress={addToCart} variant="pill" />
                </View>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Cart FAB */}
      {cartCount > 0 && (
        <TouchableOpacity style={styles.cartFab} onPress={() => {}}>
          <Ionicons name="bag" size={20} color="#fff" />
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>{cartCount}</Text>
          </View>
        </TouchableOpacity>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          visible={showProductModal}
          onClose={closeProductModal}
          onAddToCart={handleAddToCartFromModal}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  contentContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    paddingTop: 24, // Aumentado el espacio superior
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: Colors.text,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: Colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: Colors.textSecondary,
  },
  filterScroll: {
    marginBottom: 16,
  },
  filterContainer: {
    paddingHorizontal: Spacing.lg,
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterChipText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: Colors.textSecondary,
  },
  filterChipTextActive: {
    color: Colors.bg,
  },
  featuredContainer: {
    marginBottom: 16,
  },
  gridContainer: {
    marginBottom: 20,
  },
  gridRow: {
    flexDirection: 'row',
    gap: GAP,
    marginBottom: GAP,
  },
  listContainer: {
    marginBottom: 20,
  },
  listItem: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  listThumb: {
    width: 60,
    height: 60,
    borderRadius: 12,
    overflow: 'hidden',
  },
  listThumbGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    flex: 1,
    gap: 4,
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  listName: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: Colors.text,
    flex: 1,
  },
  listType: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: Colors.textSecondary,
  },
  listFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  listPrice: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: Colors.primary,
  },
  cartFab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.warm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#fff',
  },
});
