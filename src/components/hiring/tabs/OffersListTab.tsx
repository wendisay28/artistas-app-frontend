// components/hiring/tabs/OffersListTab.tsx

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
// import OfferCard from '../cards/OfferCard';

interface Offer {
  id: string;
  title: string;
  description: string;
  budget_min?: number;
  budget_max?: number;
  location?: string;
  date?: string;
  offer_type: string;
  is_urgent?: boolean;
  poster_name?: string;
  poster_avatar?: string;
  created_date: string;
}

interface OffersListTabProps {
  offers: Offer[];
  onOfferPress?: (offerId: string) => void;
  onChatPress?: (offerId: string) => void;
  onApplyPress?: (offerId: string) => void;
  onSavePress?: (offerId: string) => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  onEndReached?: () => void;
}

export default function OffersListTab({
  offers,
  onOfferPress,
  onChatPress,
  onApplyPress,
  onSavePress,
  onRefresh,
  isRefreshing = false,
  onEndReached,
}: OffersListTabProps) {

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconBg}>
        <Ionicons name="briefcase-outline" size={32} color={colors.textLight} />
      </View>
      <Text style={styles.emptyTitle}>No hay ofertas disponibles</Text>
      <Text style={styles.emptySubtitle}>
        Prueba ajustando los filtros o vuelve más tarde
      </Text>
    </View>
  );

  const renderOffer = ({ item }: { item: Offer }) => (
    <View style={styles.cardContainer}>
      {/* TODO: Reemplazar con OfferCard component */}
      {/* <OfferCard
        offer={item}
        onPress={() => onOfferPress?.(item.id)}
        onChatPress={() => onChatPress?.(item.id)}
        onApplyPress={() => onApplyPress?.(item.id)}
        onSavePress={() => onSavePress?.(item.id)}
      /> */}
      
      {/* Placeholder temporal */}
      <View style={styles.placeholderCard}>
        <Text style={styles.placeholderTitle}>{item.title}</Text>
        <Text style={styles.placeholderDesc}>{item.description}</Text>
        {item.budget_max && (
          <Text style={styles.placeholderBudget}>
            ${item.budget_min || 0} - ${item.budget_max}
          </Text>
        )}
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
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
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
  placeholderTitle: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.text,
    marginBottom: 8,
  },
  placeholderDesc: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  placeholderBudget: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.success,
  },
});