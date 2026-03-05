// ─────────────────────────────────────────────────────────────────────
// ProductDetailModal.tsx — Vista detalle de producto (patrón GalleryDetails)
// ─────────────────────────────────────────────────────────────────────

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  Pressable,
  TouchableOpacity,
  Platform,
  Dimensions,
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { colors } from '../../../../../constants/colors';

// ─────────────────────────────────────────────────────────────────────────────

const { width: SCREEN_W } = Dimensions.get('window');

// ── Types ─────────────────────────────────────────────────────────────

export interface ProductDetail {
  id: string;
  name: string;
  price: string;
  type: string;
  rating?: number;
  isFeatured?: boolean;
  isNew?: boolean;
  gradientStart: string;
  gradientEnd: string;
  previewColor: string;
  description?: string;
  format?: string;
  availability?: string;
  views?: number;
  // Campos adicionales para coincidir con ProductCard
  image?: string;
  verified?: boolean;
  distance?: string;
  tags?: string[];
  bio?: string;
  location?: string;
}

interface ProductDetailModalProps {
  visible: boolean;
  product: ProductDetail | null;
  onClose: () => void;
  onBuy?: () => void;
  onShare?: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  visible,
  product,
  onClose,
  onBuy,
  onShare,
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'reviews'>('info');
  const [descExpanded, setDescExpanded] = useState(false);

  if (!product) return null;

  const handleTabPress = (tab: typeof activeTab) => {
    if (Platform.OS !== 'web') Haptics.selectionAsync();
    setActiveTab(tab);
  };

  const handleShare = async () => {
    try {
      await Share.share({ message: `Mira este producto: ${product.name} — ${product.price}` });
    } catch {}
    onShare?.();
  };

  const handleBuy = () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onBuy?.();
  };

  const isAvailable = product.availability !== 'No disponible';

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.root}>
        {/* ── Thumbnail hero ── */}
        <LinearGradient
          colors={[product.gradientStart, product.gradientEnd]}
          style={styles.hero}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={{ opacity: 0.35 }}>
            <Ionicons name="image-outline" size={80} color={product.previewColor} />
          </View>

          {/* Badge */}
          {(product.isFeatured || product.isNew) && (
            <View style={[styles.heroBadge, product.isFeatured ? styles.badgeFeatured : styles.badgeNew]}>
              <Text style={styles.heroBadgeText}>
                {product.isFeatured ? 'Destacado' : 'Nuevo'}
              </Text>
            </View>
          )}

          {/* Botón cerrar */}
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Ionicons name="close" size={20} color="#fff" />
          </TouchableOpacity>
        </LinearGradient>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ══════════ NOMBRE + PRECIO ══════════ */}
          <View style={styles.titleCard}>
            <View style={styles.titleRow}>
              <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
              <View style={styles.typePill}>
                <Text style={styles.typeText}>{product.type}</Text>
              </View>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>PRECIO</Text>
              <Text style={styles.price}>{product.price}</Text>
            </View>
          </View>

          {/* ══════════ DESCRIPCIÓN ══════════ */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Descripción</Text>
            <Text
              style={styles.bioText}
              numberOfLines={descExpanded ? undefined : 3}
            >
              {product.description || 'Sin descripción disponible para este producto.'}
            </Text>
            <Pressable
              onPress={() => setDescExpanded(p => !p)}
              style={styles.readMoreBtn}
            >
              <Text style={styles.readMoreText}>
                {descExpanded ? 'Ver menos' : 'Ver más'}
              </Text>
              <Ionicons
                name={descExpanded ? 'chevron-up' : 'chevron-down'}
                size={14}
                color={colors.primary}
              />
            </Pressable>
          </View>

          {/* ══════════ STATS ══════════ */}
          <View style={styles.statsCard}>
            <View style={styles.statItem}>
              <Ionicons name="star" size={22} color={colors.starYellow} />
              <Text style={styles.statValue}>{product.rating ?? '—'}</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons name="eye" size={22} color={colors.primary} />
              <Text style={styles.statValue}>{product.views ?? 0}</Text>
              <Text style={styles.statLabel}>Vistas</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons
                name={isAvailable ? 'pricetag' : 'lock-closed'}
                size={22}
                color={isAvailable ? colors.success : colors.textSecondary}
              />
              <Text style={[
                styles.statValue,
                { color: isAvailable ? colors.success : colors.textSecondary, fontSize: 13 },
              ]}>
                {product.availability ?? 'Disponible'}
              </Text>
              <Text style={styles.statLabel}>Estado</Text>
            </View>
          </View>

          {/* ══════════ TABS ══════════ */}
          <View style={styles.tabsCard}>
            <View style={styles.tabBar}>
              {(
                [
                  { id: 'info'    as const, label: 'Detalles', icon: 'information-circle' as const },
                  { id: 'reviews' as const, label: 'Reseñas',  icon: 'chatbubbles'        as const },
                ]
              ).map(t => (
                <Pressable
                  key={t.id}
                  style={[styles.tabItem, activeTab === t.id && styles.tabItemActive]}
                  onPress={() => handleTabPress(t.id)}
                >
                  <Ionicons
                    name={t.icon}
                    size={15}
                    color={activeTab === t.id ? colors.primary : colors.textSecondary}
                  />
                  <Text style={[styles.tabLabel, activeTab === t.id && styles.tabLabelActive]}>
                    {t.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* ── Info tab ── */}
            {activeTab === 'info' && (
              <View style={styles.tabContent}>
                {[
                  { icon: 'apps-outline'    as const, label: 'Tipo',          value: product.type          },
                  { icon: 'cube-outline'    as const, label: 'Formato',        value: product.format ?? '—' },
                  { icon: 'pricetag-outline' as const, label: 'Precio',        value: product.price         },
                  { icon: 'checkmark-circle-outline' as const, label: 'Disponibilidad', value: product.availability ?? 'Disponible' },
                ].map((spec, i) => (
                  <View key={i} style={styles.specChip}>
                    <View style={styles.specIconCircle}>
                      <Ionicons name={spec.icon} size={16} color={colors.primary} />
                    </View>
                    <View style={styles.specMeta}>
                      <Text style={styles.specLabel}>{spec.label}</Text>
                      <Text style={styles.specValue} numberOfLines={1}>{spec.value}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* ── Reviews tab ── */}
            {activeTab === 'reviews' && (
              <View style={styles.tabContent}>
                <Text style={styles.noReviewsText}>Reseñas próximamente...</Text>
              </View>
            )}
          </View>

          {/* ══════════ CTA ══════════ */}
          <View style={styles.ctaRow}>
            <Pressable
              onPress={handleShare}
              style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.7 }]}
            >
              <Ionicons name="share-social-outline" size={20} color={colors.text} />
            </Pressable>

            <Pressable
              onPress={handleBuy}
              disabled={!isAvailable}
              style={({ pressed }) => [
                styles.buyBtn,
                !isAvailable && styles.buyBtnDisabled,
                pressed && isAvailable && { opacity: 0.9, transform: [{ scale: 0.97 }] },
              ]}
            >
              <Ionicons
                name={isAvailable ? 'bag-handle-outline' : 'lock-closed-outline'}
                size={16}
                color="#fff"
              />
              <Text style={styles.buyBtnText}>
                {isAvailable ? 'Adquirir producto' : 'No disponible'}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

// ── Styles ────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Hero
  hero: {
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeFeatured: { backgroundColor: 'rgba(124,58,237,0.85)' },
  badgeNew:      { backgroundColor: 'rgba(37,99,235,0.85)'  },
  heroBadgeText: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Scroll
  scroll: { flex: 1 },
  scrollContent: {
    padding: 16,
    gap: 12,
    paddingBottom: 32,
  },

  // Título + precio
  titleCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
  },
  productName: {
    flex: 1,
    fontSize: 20,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#1e1b4b',
    lineHeight: 26,
  },
  typePill: {
    backgroundColor: 'rgba(124,58,237,0.08)',
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  typeText: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#7c3aed',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priceLabel: {
    fontSize: 9,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: 'rgba(124,58,237,0.4)',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  price: {
    fontSize: 24,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    color: '#7c3aed',
  },

  // Card compartido
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.text,
    marginBottom: 10,
  },
  bioText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textSecondary,
    lineHeight: 22,
  },
  readMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  readMoreText: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: colors.primary,
  },

  // Stats
  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 5,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.text,
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: colors.textSecondary,
  },

  // Tabs
  tabsCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tabItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 13,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabItemActive: {
    borderBottomColor: colors.primary,
  },
  tabLabel: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: colors.textSecondary,
  },
  tabLabelActive: {
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.primary,
  },
  tabContent: {
    padding: 14,
    gap: 8,
  },

  // Spec chips (tab Detalles)
  specChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.background,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  specIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  specMeta: { flex: 1 },
  specLabel: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textSecondary,
  },
  specValue: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: colors.text,
    marginTop: 1,
  },

  // CTA
  ctaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingTop: 4,
  },
  iconBtn: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#f9fafb',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  buyBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buyBtnDisabled: {
    backgroundColor: colors.textSecondary,
    shadowOpacity: 0,
    elevation: 0,
  },
  buyBtnText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#fff',
  },
  noReviewsText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
