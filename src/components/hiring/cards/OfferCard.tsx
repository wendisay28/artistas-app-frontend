// components/hiring/cards/OfferCard.tsx

import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { colors } from '../../../constants/colors';

interface OfferCardProps {
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
    created_date: string;
  };
  isSaved?: boolean;
  onPress?: () => void;
  onChatPress?: () => void;
  onApplyPress?: () => void;
  onSavePress?: () => void;
}

const TYPE_CONFIG = {
  collaboration: { color: '#8B5CF6', label: 'Colaboración', icon: 'people' },
  hiring: { color: '#10B981', label: 'Contratación', icon: 'briefcase' },
  gig: { color: '#F59E0B', label: 'Gig', icon: 'flash' },
  event: { color: '#3B82F6', label: 'Evento', icon: 'calendar' },
};

export default function OfferCard({
  offer,
  isSaved = false,
  onPress,
  onChatPress,
  onApplyPress,
  onSavePress,
}: OfferCardProps) {
  
  const config = TYPE_CONFIG[offer.offer_type] || TYPE_CONFIG.hiring;

  const handlePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    onPress?.();
  };

  const handleChatPress = (e: any) => {
    e.stopPropagation();
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onChatPress?.();
  };

  const handleApplyPress = (e: any) => {
    e.stopPropagation();
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onApplyPress?.();
  };

  const handleSavePress = (e: any) => {
    e.stopPropagation();
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onSavePress?.();
  };

  const timeAgo = (date: string) => {
    const now = new Date();
    const created = new Date(date);
    const diffMs = now.getTime() - created.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `Hace ${diffMins}m`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    return `Hace ${diffDays}d`;
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
      ]}
      onPress={handlePress}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.typeRow}>
          <View style={[styles.typeIconBg, { backgroundColor: config.color + '20' }]}>
            <Ionicons name={config.icon as any} size={16} color={config.color} />
          </View>
          <Text style={[styles.typeLabel, { color: config.color }]}>
            {config.label}
          </Text>
          {offer.is_urgent && (
            <View style={styles.urgentBadge}>
              <Ionicons name="flame" size={10} color={colors.error} />
              <Text style={styles.urgentText}>URGENTE</Text>
            </View>
          )}
        </View>

        <Text style={styles.timeText}>{timeAgo(offer.created_date)}</Text>
      </View>

      {/* Title & Description */}
      <Text style={styles.title}>{offer.title}</Text>
      {offer.description && (
        <Text style={styles.description} numberOfLines={2}>
          {offer.description}
        </Text>
      )}

      {/* Meta Info */}
      <View style={styles.metaRow}>
        {(offer.budget_min || offer.budget_max) && (
          <View style={styles.metaItem}>
            <Ionicons name="cash-outline" size={14} color={colors.success} />
            <Text style={[styles.metaText, { color: colors.success }]}>
              {offer.budget_min && offer.budget_max
                ? `$${offer.budget_min} - $${offer.budget_max}`
                : offer.budget_max
                ? `Hasta $${offer.budget_max}`
                : `Desde $${offer.budget_min}`}
            </Text>
          </View>
        )}
        {offer.location && (
          <View style={styles.metaItem}>
            <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
            <Text style={styles.metaText}>{offer.location}</Text>
          </View>
        )}
        {offer.date && (
          <View style={styles.metaItem}>
            <Ionicons name="calendar-outline" size={14} color={colors.textSecondary} />
            <Text style={styles.metaText}>{offer.date}</Text>
          </View>
        )}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.posterRow}>
          <View style={styles.posterAvatar}>
            <Text style={styles.posterAvatarText}>
              {offer.poster_name?.[0] || '?'}
            </Text>
          </View>
          <Text style={styles.posterName}>{offer.poster_name || 'Anónimo'}</Text>
        </View>

        <View style={styles.actionsRow}>
          <Pressable
            style={({ pressed }) => [
              styles.iconBtn,
              pressed && styles.iconBtnPressed,
            ]}
            onPress={handleSavePress}
          >
            <Ionicons
              name={isSaved ? 'bookmark' : 'bookmark-outline'}
              size={18}
              color={isSaved ? colors.primary : colors.textSecondary}
            />
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.chatBtn,
              pressed && styles.chatBtnPressed,
            ]}
            onPress={handleChatPress}
          >
            <MaterialCommunityIcons name="chat-outline" size={16} color={colors.text} />
            <Text style={styles.chatBtnText}>Chat</Text>
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
              <Text style={styles.applyBtnText}>Aplicar</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardPressed: {
    opacity: 0.95,
    transform: [{ scale: 0.99 }],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  typeIconBg: {
    width: 28,
    height: 28,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeLabel: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  urgentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: colors.error + '15',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  urgentText: {
    fontSize: 9,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.error,
    letterSpacing: 0.5,
  },
  timeText: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textLight,
  },
  title: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.text,
    marginBottom: 6,
    lineHeight: 22,
  },
  description: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 14,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: colors.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  posterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  posterAvatar: {
    width: 28,
    height: 28,
    borderRadius: 10,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  posterAvatarText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.textSecondary,
  },
  posterName: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: colors.textSecondary,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
  chatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chatBtnPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.97 }],
  },
  chatBtnText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: colors.text,
  },
  applyBtn: {
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  applyBtnPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.97 }],
  },
  applyBtnGradient: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  applyBtnText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#fff',
  },
});