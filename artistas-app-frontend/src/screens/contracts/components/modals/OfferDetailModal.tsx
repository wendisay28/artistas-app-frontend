// components/hiring/modals/OfferDetailModal.tsx

import React from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Platform,
  Share,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Colors } from '../../../../theme/colors'; // FIX: unificado con el resto
import type { Offer } from '../../../types/hiring'; // FIX: tipo centralizado

interface OfferDetailModalProps {
  visible: boolean;
  onClose: () => void;
  offer: Offer | null;
  isSaved?: boolean;
  onChatPress?: () => void;
  onApplyPress?: () => void;
  onSavePress?: () => void;
  onSharePress?: () => void;
}

const TYPE_CONFIG = {
  collaboration: { color: '#8B5CF6', label: 'Colaboración', icon: 'people' as const },
  hiring:        { color: '#10B981', label: 'Contratación', icon: 'briefcase' as const },
  gig:           { color: '#F59E0B', label: 'Gig',          icon: 'flash' as const },
  event:         { color: '#3B82F6', label: 'Evento',        icon: 'calendar' as const },
};

function timeAgo(date: string): string {
  const diffHours = Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60));
  if (diffHours < 1) return 'Hace unos minutos';
  if (diffHours < 24) return `Hace ${diffHours}h`;
  return `Hace ${Math.floor(diffHours / 24)}d`;
}

function getInitials(name?: string): string {
  if (!name) return '?';
  return name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();
}

const AVATAR_COLORS = ['#6366F1', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6'];
function avatarColor(name?: string): string {
  if (!name) return AVATAR_COLORS[0];
  return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
}

export default function OfferDetailModal({
  visible,
  onClose,
  offer,
  isSaved = false,
  onChatPress,
  onApplyPress,
  onSavePress,
  onSharePress,
}: OfferDetailModalProps) {
  const insets = useSafeAreaInsets();

  if (!offer) return null;

  const config = TYPE_CONFIG[offer.offer_type] ?? TYPE_CONFIG.hiring;
  const webTopInset = Platform.OS === 'web' ? 67 : 0;
  const webBottomInset = Platform.OS === 'web' ? 34 : 0;

  const handleClose = () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  };

  const handleShare = async () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await Share.share({
        message: `${offer.title}\n\n${offer.description}\n\nVer más en la app`,
        title: offer.title,
      });
      onSharePress?.();
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleChatPress = () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onChatPress?.();
  };

  const handleApplyPress = () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onApplyPress?.();
  };

  const handleSavePress = () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSavePress?.();
  };

  const budget = offer.budget_min && offer.budget_max
    ? `$${offer.budget_min} – $${offer.budget_max}`
    : offer.budget_max
    ? `Hasta $${offer.budget_max}`
    : offer.budget_min
    ? `Desde $${offer.budget_min}`
    : null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.sheet, { paddingTop: (insets.top || webTopInset) + 8 }]}>

          {/* Header */}
          <View style={styles.header}>
            <Pressable
              style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.7 }]}
              onPress={handleClose}
            >
              <Ionicons name="chevron-back" size={22} color={Colors.text} />
            </Pressable>

            <View style={styles.headerActions}>
              <Pressable
                style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.7 }]}
                onPress={handleShare}
              >
                <Ionicons name="share-outline" size={20} color={Colors.text} />
              </Pressable>
              <Pressable
                style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.7 }]}
                onPress={handleSavePress}
              >
                <Ionicons
                  name={isSaved ? 'bookmark' : 'bookmark-outline'}
                  size={20}
                  color={isSaved ? Colors.primary : Colors.text}
                />
              </Pressable>
            </View>
          </View>

          {/* Contenido */}
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={{ paddingBottom: (insets.bottom || webBottomInset) + 100 }}
            showsVerticalScrollIndicator={false}
          >
            {/* Tipo + urgente + tiempo */}
            <View style={styles.typeRow}>
              <View style={[styles.typePill, { backgroundColor: config.color + '18' }]}>
                <Ionicons name={config.icon} size={14} color={config.color} />
                <Text style={[styles.typeLabel, { color: config.color }]}>
                  {config.label}
                </Text>
              </View>
              {offer.is_urgent && (
                <View style={styles.urgentPill}>
                  <Ionicons name="flame" size={13} color="#EF4444" />
                  <Text style={styles.urgentText}>Urgente</Text>
                </View>
              )}
              <Text style={styles.timeText}>{timeAgo(offer.created_date)}</Text>
            </View>

            {/* Título */}
            <Text style={styles.title}>{offer.title}</Text>

            {/* Descripción */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Descripción</Text>
              <Text style={styles.description}>{offer.description}</Text>
            </View>

            {/* Detalles */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Detalles</Text>
              <View style={styles.detailsGrid}>
                {budget && (
                  <View style={styles.detailItem}>
                    <View style={[styles.detailIcon, { backgroundColor: '#10B98115' }]}>
                      <Ionicons name="cash-outline" size={20} color="#10B981" />
                    </View>
                    <View>
                      <Text style={styles.detailLabel}>Presupuesto</Text>
                      <Text style={[styles.detailValue, { color: '#10B981' }]}>{budget}</Text>
                    </View>
                  </View>
                )}
                {offer.location && (
                  <View style={styles.detailItem}>
                    <View style={[styles.detailIcon, { backgroundColor: Colors.primary + '15' }]}>
                      <Ionicons name="location-outline" size={20} color={Colors.primary} />
                    </View>
                    <View>
                      <Text style={styles.detailLabel}>Ubicación</Text>
                      <Text style={styles.detailValue}>{offer.location}</Text>
                    </View>
                  </View>
                )}
                {offer.date && (
                  <View style={styles.detailItem}>
                    <View style={[styles.detailIcon, { backgroundColor: '#3B82F615' }]}>
                      <Ionicons name="calendar-outline" size={20} color="#3B82F6" />
                    </View>
                    <View>
                      <Text style={styles.detailLabel}>Fecha</Text>
                      <Text style={styles.detailValue}>{offer.date}</Text>
                    </View>
                  </View>
                )}
                {offer.category && (
                  <View style={styles.detailItem}>
                    <View style={[styles.detailIcon, { backgroundColor: '#8B5CF615' }]}>
                      <Ionicons name="person-outline" size={20} color="#8B5CF6" />
                    </View>
                    <View>
                      <Text style={styles.detailLabel}>Categoría</Text>
                      <Text style={styles.detailValue}>{offer.category}</Text>
                    </View>
                  </View>
                )}
              </View>
            </View>

            {/* Publicado por */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Publicado por</Text>
              <View style={styles.posterCard}>
                {/* Avatar con color determinista */}
                <View style={[styles.posterAvatar, { backgroundColor: avatarColor(offer.poster_name) }]}>
                  <Text style={styles.posterAvatarText}>
                    {getInitials(offer.poster_name)}
                  </Text>
                </View>
                <View style={styles.posterInfo}>
                  <Text style={styles.posterName}>{offer.poster_name ?? 'Anónimo'}</Text>
                  <Text style={styles.posterMeta}>Miembro verificado</Text>
                </View>
                <Pressable
                  style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.7 }]}
                  onPress={handleChatPress}
                >
                  <MaterialCommunityIcons name="chat-outline" size={18} color={Colors.text} />
                </Pressable>
              </View>
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={[styles.footer, { paddingBottom: (insets.bottom || webBottomInset) + 16 }]}>
            <Pressable
              style={({ pressed }) => [styles.chatBtn, pressed && { opacity: 0.7 }]}
              onPress={handleChatPress}
            >
              <MaterialCommunityIcons name="chat-outline" size={20} color={Colors.text} />
              <Text style={styles.chatBtnText}>Chat</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.applyBtn, pressed && { opacity: 0.9 }]}
              onPress={handleApplyPress}
            >
              <LinearGradient
                colors={[Colors.primary, Colors.accent ?? Colors.primary]}
                style={styles.applyGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Ionicons name="checkmark-circle" size={20} color="#fff" />
                <Text style={styles.applyBtnText}>Aplicar a esta oferta</Text>
              </LinearGradient>
            </Pressable>
          </View>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Scroll
  scroll: {
    flex: 1,
    paddingHorizontal: 20,
  },

  // Tipo
  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
    marginBottom: 12,
  },
  typePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  typeLabel: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  urgentPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EF444415',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 20,
  },
  urgentText: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#EF4444',
  },
  timeText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: Colors.textLight,
    marginLeft: 'auto',
  },

  // Título
  title: {
    fontSize: 24,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: Colors.text,
    lineHeight: 32,
    marginBottom: 24,
  },

  // Secciones
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: Colors.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: Colors.textSecondary,
    lineHeight: 24,
  },

  // Detalles
  detailsGrid: {
    gap: 10,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  detailIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailLabel: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: Colors.text,
  },

  // Poster
  posterCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  posterAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  posterAvatarText: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#FFFFFF',
  },
  posterInfo: {
    flex: 1,
  },
  posterName: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: Colors.text,
    marginBottom: 2,
  },
  posterMeta: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: Colors.textSecondary,
  },

  // Footer
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
    backgroundColor: Colors.background,
  },
  chatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chatBtnText: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: Colors.text,
  },
  applyBtn: {
    flex: 1,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  applyGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
  },
  applyBtnText: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#fff',
  },
});