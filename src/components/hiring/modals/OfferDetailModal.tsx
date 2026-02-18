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
import { colors } from '../../../constants/colors';

interface OfferDetailModalProps {
  visible: boolean;
  onClose: () => void;
  offer: {
    id: string;
    title: string;
    description: string;
    budget_min?: number;
    budget_max?: number;
    location?: string;
    date?: string;
    offer_type: 'collaboration' | 'hiring' | 'gig' | 'event';
    is_urgent?: boolean;
    poster_name?: string;
    poster_avatar?: string;
    category?: string;
    created_date: string;
  } | null;
  isSaved?: boolean;
  onChatPress?: () => void;
  onApplyPress?: () => void;
  onSavePress?: () => void;
  onSharePress?: () => void;
}

const TYPE_CONFIG = {
  collaboration: { color: '#8B5CF6', label: 'Colaboración', icon: 'people' },
  hiring: { color: '#10B981', label: 'Contratación', icon: 'briefcase' },
  gig: { color: '#F59E0B', label: 'Gig', icon: 'flash' },
  event: { color: '#3B82F6', label: 'Evento', icon: 'calendar' },
};

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

  const config = TYPE_CONFIG[offer.offer_type] || TYPE_CONFIG.hiring;
  const webTopInset = Platform.OS === 'web' ? 67 : 0;
  const webBottomInset = Platform.OS === 'web' ? 34 : 0;

  const handleClose = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onClose();
  };

  const handleShare = async () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
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
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onChatPress?.();
  };

  const handleApplyPress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onApplyPress?.();
  };

  const handleSavePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onSavePress?.();
  };

  const timeAgo = (date: string) => {
    const now = new Date();
    const created = new Date(date);
    const diffHours = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60));
    if (diffHours < 1) return 'Hace unos minutos';
    if (diffHours < 24) return `Hace ${diffHours}h`;
    const diffDays = Math.floor(diffHours / 24);
    return `Hace ${diffDays}d`;
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { paddingTop: (insets.top || webTopInset) + 8 }]}>
          {/* Header */}
          <View style={styles.header}>
            <Pressable
              style={({ pressed }) => [
                styles.backBtn,
                pressed && styles.backBtnPressed,
              ]}
              onPress={handleClose}
            >
              <Ionicons name="chevron-back" size={24} color={colors.text} />
            </Pressable>

            <View style={styles.headerActions}>
              <Pressable
                style={({ pressed }) => [
                  styles.headerIconBtn,
                  pressed && styles.headerIconBtnPressed,
                ]}
                onPress={handleShare}
              >
                <Ionicons name="share-outline" size={20} color={colors.text} />
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.headerIconBtn,
                  pressed && styles.headerIconBtnPressed,
                ]}
                onPress={handleSavePress}
              >
                <Ionicons
                  name={isSaved ? 'bookmark' : 'bookmark-outline'}
                  size={20}
                  color={isSaved ? colors.primary : colors.text}
                />
              </Pressable>
            </View>
          </View>

          {/* Content */}
          <ScrollView
            style={styles.content}
            contentContainerStyle={{
              paddingBottom: (insets.bottom || webBottomInset) + 100,
            }}
            showsVerticalScrollIndicator={false}
          >
            {/* Type Badge */}
            <View style={styles.typeRow}>
              <View style={[styles.typeBadge, { backgroundColor: config.color + '20' }]}>
                <Ionicons name={config.icon as any} size={16} color={config.color} />
                <Text style={[styles.typeLabel, { color: config.color }]}>
                  {config.label}
                </Text>
              </View>
              {offer.is_urgent && (
                <View style={styles.urgentBadge}>
                  <Ionicons name="flame" size={14} color={colors.error} />
                  <Text style={styles.urgentText}>URGENTE</Text>
                </View>
              )}
              <Text style={styles.timeText}>{timeAgo(offer.created_date)}</Text>
            </View>

            {/* Title */}
            <Text style={styles.title}>{offer.title}</Text>

            {/* Description */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Descripción</Text>
              <Text style={styles.description}>{offer.description}</Text>
            </View>

            {/* Details */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Detalles</Text>
              <View style={styles.detailsGrid}>
                {(offer.budget_min || offer.budget_max) && (
                  <View style={styles.detailItem}>
                    <View style={styles.detailIconBg}>
                      <Ionicons name="cash-outline" size={20} color={colors.success} />
                    </View>
                    <View style={styles.detailText}>
                      <Text style={styles.detailLabel}>Presupuesto</Text>
                      <Text style={[styles.detailValue, { color: colors.success }]}>
                        {offer.budget_min && offer.budget_max
                          ? `$${offer.budget_min} - $${offer.budget_max}`
                          : offer.budget_max
                          ? `Hasta $${offer.budget_max}`
                          : `Desde $${offer.budget_min}`}
                      </Text>
                    </View>
                  </View>
                )}

                {offer.location && (
                  <View style={styles.detailItem}>
                    <View style={styles.detailIconBg}>
                      <Ionicons name="location-outline" size={20} color={colors.accent} />
                    </View>
                    <View style={styles.detailText}>
                      <Text style={styles.detailLabel}>Ubicación</Text>
                      <Text style={styles.detailValue}>{offer.location}</Text>
                    </View>
                  </View>
                )}

                {offer.date && (
                  <View style={styles.detailItem}>
                    <View style={styles.detailIconBg}>
                      <Ionicons name="calendar-outline" size={20} color={colors.primary} />
                    </View>
                    <View style={styles.detailText}>
                      <Text style={styles.detailLabel}>Fecha</Text>
                      <Text style={styles.detailValue}>{offer.date}</Text>
                    </View>
                  </View>
                )}

                {offer.category && (
                  <View style={styles.detailItem}>
                    <View style={styles.detailIconBg}>
                      <Ionicons name="person-outline" size={20} color={colors.accent} />
                    </View>
                    <View style={styles.detailText}>
                      <Text style={styles.detailLabel}>Categoría</Text>
                      <Text style={styles.detailValue}>{offer.category}</Text>
                    </View>
                  </View>
                )}
              </View>
            </View>

            {/* Poster Info */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Publicado por</Text>
              <View style={styles.posterCard}>
                <LinearGradient
                  colors={[colors.primary, colors.accent]}
                  style={styles.posterAvatarBorder}
                >
                  <View style={styles.posterAvatar}>
                    <Text style={styles.posterAvatarText}>
                      {offer.poster_name?.[0] || '?'}
                    </Text>
                  </View>
                </LinearGradient>
                <View style={styles.posterInfo}>
                  <Text style={styles.posterName}>{offer.poster_name || 'Anónimo'}</Text>
                  <Text style={styles.posterMeta}>Miembro verificado</Text>
                </View>
                <Pressable
                  style={({ pressed }) => [
                    styles.posterChatBtn,
                    pressed && styles.posterChatBtnPressed,
                  ]}
                  onPress={handleChatPress}
                >
                  <MaterialCommunityIcons name="chat-outline" size={18} color={colors.text} />
                </Pressable>
              </View>
            </View>
          </ScrollView>

          {/* Footer Actions */}
          <View style={[styles.footer, { paddingBottom: (insets.bottom || webBottomInset) + 16 }]}>
            <Pressable
              style={({ pressed }) => [
                styles.chatFooterBtn,
                pressed && styles.chatFooterBtnPressed,
              ]}
              onPress={handleChatPress}
            >
              <MaterialCommunityIcons name="chat-outline" size={20} color={colors.text} />
              <Text style={styles.chatFooterBtnText}>Chat</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.applyBtn,
                pressed && styles.applyBtnPressed,
              ]}
              onPress={handleApplyPress}
            >
              <LinearGradient
                colors={[colors.primary, colors.accent]}
                style={styles.applyBtnGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnPressed: {
    opacity: 0.7,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIconBtnPressed: {
    opacity: 0.7,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
    marginBottom: 12,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  typeLabel: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  urgentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.error + '15',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 12,
  },
  urgentText: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.error,
    letterSpacing: 0.5,
  },
  timeText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textLight,
    marginLeft: 'auto',
  },
  title: {
    fontSize: 24,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.text,
    lineHeight: 32,
    marginBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textSecondary,
    lineHeight: 24,
  },
  detailsGrid: {
    gap: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  detailIconBg: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailText: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: colors.textSecondary,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.text,
  },
  posterCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  posterAvatarBorder: {
    width: 50,
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  posterAvatar: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: '#1A1A2E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  posterAvatarText: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#fff',
  },
  posterInfo: {
    flex: 1,
  },
  posterName: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.text,
    marginBottom: 2,
  },
  posterMeta: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textSecondary,
  },
  posterChatBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  posterChatBtnPressed: {
    opacity: 0.7,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    backgroundColor: colors.background,
  },
  chatFooterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chatFooterBtnPressed: {
    opacity: 0.7,
  },
  chatFooterBtnText: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: colors.text,
  },
  applyBtn: {
    flex: 1,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  applyBtnPressed: {
    opacity: 0.9,
  },
  applyBtnGradient: {
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