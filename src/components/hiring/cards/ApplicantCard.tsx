// components/hiring/cards/ApplicantCard.tsx

import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { colors } from '../../../constants/colors';

import type { ApplicantCardProps } from '../../../types/hiring';

export default function ApplicantCard({
  applicant,
  onViewProfile,
  onChatPress,
  onAcceptPress,
}: ApplicantCardProps) {

  const handleViewProfile = () => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    onViewProfile?.();
  };

  const handleChatPress = (e: any) => {
    e.stopPropagation();
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onChatPress?.();
  };

  const handleAcceptPress = (e: any) => {
    e.stopPropagation();
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onAcceptPress?.();
  };

  const timeAgo = (date: string) => {
    const now = new Date();
    const applied = new Date(date);
    const diffHours = Math.floor((now.getTime() - applied.getTime()) / (1000 * 60 * 60));
    if (diffHours < 1) return 'Hace unos minutos';
    if (diffHours < 24) return `Hace ${diffHours}h`;
    const diffDays = Math.floor(diffHours / 24);
    return `Hace ${diffDays}d`;
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
      ]}
      onPress={handleViewProfile}
    >
      {/* Header */}
      <View style={styles.header}>
        {/* Avatar */}
        <LinearGradient
          colors={[colors.primary, colors.accent]}
          style={styles.avatarBorder}
        >
          <View style={styles.avatarInner}>
            <Text style={styles.avatarText}>
              {applicant.name[0].toUpperCase()}
            </Text>
          </View>
        </LinearGradient>

        {/* Info */}
        <View style={styles.info}>
          <Text style={styles.name}>{applicant.name}</Text>
          <Text style={styles.category}>{applicant.category}</Text>
          
          {/* Rating */}
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={14} color={colors.starYellow} />
            <Text style={styles.ratingText}>
              {applicant.rating.toFixed(1)}
            </Text>
            <Text style={styles.reviewsText}>
              ({applicant.reviews_count})
            </Text>
          </View>
        </View>

        {/* Time */}
        <Text style={styles.timeText}>{timeAgo(applicant.applied_date)}</Text>
      </View>

      {/* Message */}
      {applicant.message && (
        <View style={styles.messageBox}>
          <Ionicons name="chatbubble-outline" size={14} color={colors.textSecondary} />
          <Text style={styles.messageText} numberOfLines={2}>
            {applicant.message}
          </Text>
        </View>
      )}

      {/* Actions */}
      <View style={styles.actionsRow}>
        <Pressable
          style={({ pressed }) => [
            styles.viewBtn,
            pressed && styles.viewBtnPressed,
          ]}
          onPress={handleViewProfile}
        >
          <Ionicons name="person-outline" size={16} color={colors.text} />
          <Text style={styles.viewBtnText}>Ver perfil</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.chatBtn,
            pressed && styles.chatBtnPressed,
          ]}
          onPress={handleChatPress}
        >
          <Ionicons name="chatbubble-outline" size={16} color={colors.text} />
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.acceptBtn,
            pressed && styles.acceptBtnPressed,
          ]}
          onPress={handleAcceptPress}
        >
          <LinearGradient
            colors={[colors.success, '#059669']}
            style={styles.acceptBtnGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="checkmark" size={18} color="#fff" />
            <Text style={styles.acceptBtnText}>Aceptar</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  cardPressed: {
    opacity: 0.95,
    transform: [{ scale: 0.99 }],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  avatarBorder: {
    width: 50,
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInner: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: '#1A1A2E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#fff',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.text,
    marginBottom: 2,
  },
  category: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: colors.text,
  },
  reviewsText: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textSecondary,
  },
  timeText: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textLight,
  },
  messageBox: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: colors.surfaceAlt,
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
  },
  messageText: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textSecondary,
    lineHeight: 18,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  viewBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
  },
  viewBtnPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.97 }],
  },
  viewBtnText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: colors.text,
  },
  chatBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatBtnPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
  acceptBtn: {
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: colors.success,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  acceptBtnPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.97 }],
  },
  acceptBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  acceptBtnText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#fff',
  },
});