// components/hiring/modals/ApplicantsModal.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  FlatList,
  StyleSheet,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { colors } from '../../../constants/colors';
import ApplicantCard from '../cards/ApplicantCard';
import type { Applicant } from '../../../types/hiring';

interface ApplicantsModalProps {
  visible: boolean;
  onClose: () => void;
  offerTitle: string;
  applicants: Applicant[];
  onViewProfile?: (applicantId: string) => void;
  onChatPress?: (applicantId: string) => void;
  onAcceptPress?: (applicantId: string) => void;
}

type SortType = 'recent' | 'rating' | 'name';

export default function ApplicantsModal({
  visible,
  onClose,
  offerTitle,
  applicants,
  onViewProfile,
  onChatPress,
  onAcceptPress,
}: ApplicantsModalProps) {
  const insets = useSafeAreaInsets();
  const [sortBy, setSortBy] = useState<SortType>('recent');

  const webTopInset = Platform.OS === 'web' ? 67 : 0;
  const webBottomInset = Platform.OS === 'web' ? 34 : 0;

  const handleClose = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onClose();
  };

  const handleSortChange = (type: SortType) => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    setSortBy(type);
  };

  // Ordenar aplicantes
  const sortedApplicants = [...applicants].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'name':
        return a.name.localeCompare(b.name);
      case 'recent':
      default:
        return new Date(b.applied_date).getTime() - new Date(a.applied_date).getTime();
    }
  });

  const renderEmpty = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconBg}>
        <Ionicons name="people-outline" size={40} color={colors.textLight} />
      </View>
      <Text style={styles.emptyTitle}>Sin aplicantes aún</Text>
      <Text style={styles.emptySubtitle}>
        Comparte tu oferta para recibir más aplicaciones
      </Text>
    </View>
  );

  const renderApplicant = ({ item }: { item: typeof applicants[0] }) => (
    <ApplicantCard
      applicant={item}
      onViewProfile={() => onViewProfile?.(item.id)}
      onChatPress={() => onChatPress?.(item.id)}
      onAcceptPress={() => onAcceptPress?.(item.id)}
    />
  );

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
            <View style={styles.headerLeft}>
              <Pressable
                style={({ pressed }) => [
                  styles.backBtn,
                  pressed && styles.backBtnPressed,
                ]}
                onPress={handleClose}
              >
                <Ionicons name="chevron-back" size={24} color={colors.text} />
              </Pressable>
              <View style={styles.headerText}>
                <Text style={styles.headerTitle}>Aplicantes</Text>
                <Text style={styles.headerSubtitle} numberOfLines={1}>
                  {offerTitle}
                </Text>
              </View>
            </View>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{applicants.length}</Text>
            </View>
          </View>

          {/* Sort Options */}
          <View style={styles.sortContainer}>
            <Ionicons name="funnel-outline" size={16} color={colors.textSecondary} />
            <Text style={styles.sortLabel}>Ordenar:</Text>
            <View style={styles.sortOptions}>
              <Pressable
                style={({ pressed }) => [
                  styles.sortChip,
                  sortBy === 'recent' && styles.sortChipActive,
                  pressed && styles.sortChipPressed,
                ]}
                onPress={() => handleSortChange('recent')}
              >
                <Text
                  style={[
                    styles.sortChipText,
                    sortBy === 'recent' && styles.sortChipTextActive,
                  ]}
                >
                  Recientes
                </Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.sortChip,
                  sortBy === 'rating' && styles.sortChipActive,
                  pressed && styles.sortChipPressed,
                ]}
                onPress={() => handleSortChange('rating')}
              >
                <Text
                  style={[
                    styles.sortChipText,
                    sortBy === 'rating' && styles.sortChipTextActive,
                  ]}
                >
                  Rating
                </Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.sortChip,
                  sortBy === 'name' && styles.sortChipActive,
                  pressed && styles.sortChipPressed,
                ]}
                onPress={() => handleSortChange('name')}
              >
                <Text
                  style={[
                    styles.sortChipText,
                    sortBy === 'name' && styles.sortChipTextActive,
                  ]}
                >
                  Nombre
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Applicants List */}
          <FlatList
            data={sortedApplicants}
            renderItem={renderApplicant}
            keyExtractor={(item) => item.id}
            contentContainerStyle={[
              styles.listContent,
              { paddingBottom: (insets.bottom || webBottomInset) + 20 },
            ]}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={renderEmpty}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
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
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  headerLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
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
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.text,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textSecondary,
  },
  countBadge: {
    backgroundColor: colors.primary + '20',
    borderRadius: 12,
    minWidth: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  countText: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.primary,
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  sortLabel: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: colors.textSecondary,
  },
  sortOptions: {
    flexDirection: 'row',
    gap: 6,
    flex: 1,
  },
  sortChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sortChipActive: {
    backgroundColor: colors.primary + '15',
    borderColor: colors.primary,
  },
  sortChipPressed: {
    opacity: 0.7,
  },
  sortChipText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: colors.textSecondary,
  },
  sortChipTextActive: {
    color: colors.primary,
  },
  listContent: {
    padding: 16,
  },
  separator: {
    height: 12,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 32,
  },
  emptyIconBg: {
    width: 100,
    height: 100,
    borderRadius: 28,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});