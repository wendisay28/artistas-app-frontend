// components/hiring/tabs/MyOffersTab.tsx

import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../constants/colors';

// TODO: Importar cuando esté listo
// import MyOfferCard from '../cards/MyOfferCard';

interface MyOffer {
  id: string;
  title: string;
  description: string;
  budget_min?: number;
  budget_max?: number;
  status: 'active' | 'closed' | 'draft';
  views_count: number;
  applicants_count: number;
  created_date: string;
  offer_type: string;
  is_urgent?: boolean;
}

interface MyOffersTabProps {
  offers: MyOffer[];
  onOfferPress?: (offerId: string) => void;
  onViewApplicantsPress?: (offerId: string) => void;
  onEditPress?: (offerId: string) => void;
  onDeletePress?: (offerId: string) => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export default function MyOffersTab({
  offers,
  onOfferPress,
  onViewApplicantsPress,
  onEditPress,
  onDeletePress,
  onRefresh,
  isRefreshing = false,
}: MyOffersTabProps) {

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconBg}>
        <Ionicons name="newspaper-outline" size={32} color={colors.textLight} />
      </View>
      <Text style={styles.emptyTitle}>No has publicado ofertas</Text>
      <Text style={styles.emptySubtitle}>
        Crea tu primera oferta para empezar a recibir aplicaciones
      </Text>
    </View>
  );

  const renderOffer = ({ item }: { item: MyOffer }) => (
    <View style={styles.cardContainer}>
      {/* TODO: Reemplazar con MyOfferCard component */}
      {/* <MyOfferCard
        offer={item}
        onPress={() => onOfferPress?.(item.id)}
        onViewApplicants={() => onViewApplicantsPress?.(item.id)}
        onEdit={() => onEditPress?.(item.id)}
        onDelete={() => onDeletePress?.(item.id)}
      /> */}
      
      {/* Placeholder temporal */}
      <View style={styles.placeholderCard}>
        <View style={styles.placeholderHeader}>
          <View style={styles.placeholderTitleRow}>
            <Text style={styles.placeholderTitle}>{item.title}</Text>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor:
                    item.status === 'active'
                      ? colors.success + '20'
                      : item.status === 'closed'
                      ? colors.textLight + '20'
                      : colors.warning + '20',
                },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  {
                    color:
                      item.status === 'active'
                        ? colors.success
                        : item.status === 'closed'
                        ? colors.textSecondary
                        : colors.warning,
                  },
                ]}
              >
                {item.status === 'active'
                  ? 'Activa'
                  : item.status === 'closed'
                  ? 'Cerrada'
                  : 'Borrador'}
              </Text>
            </View>
          </View>
          <Text style={styles.placeholderDesc} numberOfLines={2}>
            {item.description}
          </Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Ionicons name="eye-outline" size={16} color={colors.accent} />
            <Text style={styles.statValue}>{item.views_count}</Text>
            <Text style={styles.statLabel}>vistas</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Ionicons name="people-outline" size={16} color={colors.primary} />
            <Text style={styles.statValue}>{item.applicants_count}</Text>
            <Text style={styles.statLabel}>aplicantes</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <FlatList
      data={offers}
      renderItem={renderOffer}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={renderEmptyState}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        ) : undefined
      }
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 20,
  },
  cardContainer: {
    marginBottom: 12,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyIconBg: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
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
  // Estilos temporales del placeholder
  placeholderCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  placeholderHeader: {
    marginBottom: 12,
  },
  placeholderTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  placeholderTitle: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.text,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  placeholderDesc: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textSecondary,
  },
  statsRow: {
    flexDirection: 'row',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
  },
  statValue: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.text,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textSecondary,
  },
});