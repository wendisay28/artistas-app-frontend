// components/hiring/tabs/SavedOffersTab.tsx

import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../../theme/colors';
import OfferCard from '../cards/OfferCard';
import { AppFooter } from '../../../../components/shared/AppFooter';

interface SavedOffer {
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
  saved_date: string;
  category?: string;
}

interface SavedOffersTabProps {
  offers: SavedOffer[];
  onOfferPress?: (offerId: string) => void;
  onChatPress?: (offerId: string) => void;
  onApplyPress?: (offerId: string) => void;
  onUnsavePress?: (offerId: string) => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

function savedTimeAgo(savedDate: string): string {
  const diff = Date.now() - new Date(savedDate).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return 'Hoy';
  if (days === 1) return 'Ayer';
  return `Hace ${days}d`;
}

export default function SavedOffersTab({
  offers,
  onOfferPress,
  onChatPress,
  onApplyPress,
  onUnsavePress,
  onRefresh,
  isRefreshing = false,
}: SavedOffersTabProps) {

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconBg}>
        <Ionicons name="bookmark-outline" size={32} color={Colors.textLight} />
      </View>
      <Text style={styles.emptyTitle}>No tienes ofertas guardadas</Text>
      <Text style={styles.emptySubtitle}>
        Guarda ofertas que te interesen para encontrarlas fácilmente después
      </Text>
      <View style={styles.tipBox}>
        <Ionicons name="bulb-outline" size={16} color={Colors.primary} />
        <Text style={styles.tipText}>
          Toca el ícono de bookmark en cualquier oferta para guardarla
        </Text>
      </View>
    </View>
  );

  const renderOffer = ({ item }: { item: SavedOffer }) => (
    <View>
      {/* Etiqueta de fecha guardada encima de la card */}
      <View style={styles.savedLabel}>
        <Ionicons name="bookmark" size={11} color={Colors.primary} />
        <Text style={styles.savedLabelText}>
          Guardada {savedTimeAgo(item.saved_date)}
        </Text>
      </View>
      <OfferCard
        offer={item}
        isSaved={true}
        onPress={() => onOfferPress?.(item.id)}
        onChatPress={() => onChatPress?.(item.id)}
        onApplyPress={() => onApplyPress?.(item.id)}
        onSavePress={() => onUnsavePress?.(item.id)}
      />
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
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  separator: {
    height: 16,
  },
  savedLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
    paddingLeft: 4,
  },
  savedLabelText: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: Colors.primary,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
    gap: 8,
  },
  emptyIconBg: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: Colors.text,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 8,
  },
  tipBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.primary + '12',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    maxWidth: 300,
  },
  tipText: {
    flex: 1,
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: Colors.text,
    lineHeight: 18,
  },
});