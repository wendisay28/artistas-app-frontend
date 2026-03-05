// components/hiring/cards/MyOfferCard.tsx

import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors } from '../../../../constants/colors';

interface MyOfferCardProps {
  offer: {
    id: string;
    title: string;
    description: string;
    budget_min?: number;
    budget_max?: number;
    status: 'active' | 'closed' | 'draft';
    views_count: number;
    applicants_count: number;
    created_date: string;
    offer_type: 'collaboration' | 'hiring' | 'gig' | 'event';
    is_urgent?: boolean;
  };
  onPress?: () => void;
  onViewApplicants?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const STATUS_CONFIG = {
  active: { color: colors.success, label: 'Activa', icon: 'checkmark-circle' },
  closed: { color: colors.textSecondary, label: 'Cerrada', icon: 'close-circle' },
  draft: { color: colors.warning, label: 'Borrador', icon: 'create' },
};

export default function MyOfferCard({
  offer,
  onPress,
  onViewApplicants,
  onEdit,
  onDelete,
}: MyOfferCardProps) {
  
  const statusConfig = STATUS_CONFIG[offer.status];

  const handlePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    onPress?.();
  };

  const handleViewApplicants = (e: any) => {
    e.stopPropagation();
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onViewApplicants?.();
  };

  const handleEdit = (e: any) => {
    e.stopPropagation();
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onEdit?.();
  };

  const timeAgo = (date: string) => {
    const now = new Date();
    const created = new Date(date);
    const diffDays = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
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
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>
            {offer.title}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: statusConfig.color + '20' }]}>
            <Ionicons name={statusConfig.icon as any} size={12} color={statusConfig.color} />
            <Text style={[styles.statusText, { color: statusConfig.color }]}>
              {statusConfig.label}
            </Text>
          </View>
        </View>

        <View style={styles.metaRow}>
          <Text style={styles.timeText}>{timeAgo(offer.created_date)}</Text>
          {offer.is_urgent && (
            <>
              <View style={styles.dot} />
              <View style={styles.urgentBadge}>
                <Ionicons name="flame" size={10} color={colors.error} />
                <Text style={styles.urgentText}>URGENTE</Text>
              </View>
            </>
          )}
        </View>
      </View>

      {/* Description */}
      {offer.description && (
        <Text style={styles.description} numberOfLines={2}>
          {offer.description}
        </Text>
      )}

      {/* Budget */}
      {(offer.budget_min || offer.budget_max) && (
        <Text style={styles.budget}>
          {offer.budget_min && offer.budget_max
            ? `$${offer.budget_min} - $${offer.budget_max}`
            : offer.budget_max
            ? `Hasta $${offer.budget_max}`
            : `Desde $${offer.budget_min}`}
        </Text>
      )}

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Ionicons name="eye-outline" size={18} color={colors.accent} />
          <Text style={styles.statValue}>{offer.views_count}</Text>
          <Text style={styles.statLabel}>vistas</Text>
        </View>

        <View style={styles.statDivider} />

        <Pressable
          style={({ pressed }) => [
            styles.statItem,
            pressed && styles.statItemPressed,
          ]}
          onPress={handleViewApplicants}
        >
          <Ionicons name="people-outline" size={18} color={colors.primary} />
          <Text style={[styles.statValue, { color: colors.primary }]}>
            {offer.applicants_count}
          </Text>
          <Text style={styles.statLabel}>aplicantes</Text>
        </Pressable>
      </View>

      {/* Actions */}
      <View style={styles.actionsRow}>
        <Pressable
          style={({ pressed }) => [
            styles.actionBtn,
            pressed && styles.actionBtnPressed,
          ]}
          onPress={handleEdit}
        >
          <Ionicons name="create-outline" size={16} color={colors.text} />
          <Text style={styles.actionBtnText}>Editar</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.actionBtn,
            pressed && styles.actionBtnPressed,
          ]}
          onPress={onDelete}
        >
          <Ionicons name="trash-outline" size={16} color={colors.error} />
          <Text style={[styles.actionBtnText, { color: colors.error }]}>
            Eliminar
          </Text>
        </Pressable>
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
    marginBottom: 10,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 6,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.text,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textLight,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.textLight,
  },
  urgentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  urgentText: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.error,
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 10,
  },
  budget: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.success,
    marginBottom: 14,
  },
  statsRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: 12,
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  statItemPressed: {
    opacity: 0.7,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
  },
  statValue: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.text,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textSecondary,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionBtnPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.97 }],
  },
  actionBtnText: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: colors.text,
  },
});