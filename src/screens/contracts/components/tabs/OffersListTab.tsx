// components/hiring/tabs/OffersListTab.tsx

import React from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../../theme/colors';
import OfferCard from '../cards/OfferCard';
import { AppFooter } from '../../../../components/shared/AppFooter';

interface Offer {
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
  category?: string;
}

interface OffersListTabProps {
  offers: Offer[];
  savedOfferIds?: Set<string>;
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
  savedOfferIds = new Set(),
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
        <Ionicons name="briefcase-outline" size={32} color={Colors.textLight} />
      </View>
      <Text style={styles.emptyTitle}>No hay ofertas disponibles</Text>
      <Text style={styles.emptySubtitle}>
        Prueba ajustando los filtros o vuelve más tarde
      </Text>
    </View>
  );

  const renderOffer = ({ item }: { item: Offer }) => (
    <OfferCard
      offer={item}
      isSaved={savedOfferIds.has(item.id)}
      onPress={() => onOfferPress?.(item.id)}
      onChatPress={() => onChatPress?.(item.id)}
      onApplyPress={() => onApplyPress?.(item.id)}
      onSavePress={() => onSavePress?.(item.id)}
    />
  );

  return (
    <FlatList
      data={offers}
      renderItem={renderOffer}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={renderEmptyState}
      ListFooterComponent={<View style={{ marginHorizontal: -16 }}><AppFooter /></View>}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
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
    paddingTop: 12,
  },
  separator: {
    height: 12,
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
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});