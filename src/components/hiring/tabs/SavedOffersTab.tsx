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
import { colors } from '../../../constants/colors';

// TODO: Importar cuando esté listo
// import OfferCard from '../cards/OfferCard';

interface SavedOffer {
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
  saved_date: string;
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
        <Ionicons name="bookmark-outline" size={32} color={colors.textLight} />
      </View>
      <Text style={styles.emptyTitle}>No tienes ofertas guardadas</Text>
      <Text style={styles.emptySubtitle}>
        Guarda ofertas que te interesen para encontrarlas fácilmente después
      </Text>
      <View style={styles.tipBox}>
        <Ionicons name="bulb-outline" size={16} color={colors.secondary} />
        <Text style={styles.tipText}>
          Toca el ícono de bookmark en cualquier oferta para guardarla
        </Text>
      </View>
    </View>
  );

  const renderOffer = ({ item }: { item: SavedOffer }) => (
    <View style={styles.cardContainer}>
      {/* TODO: Reemplazar con OfferCard component */}
      {/* <OfferCard
        offer={item}
        onPress={() => onOfferPress?.(item.id)}
        onChatPress={() => onChatPress?.(item.id)}
        onApplyPress={() => onApplyPress?.(item.id)}
        onSavePress={() => onUnsavePress?.(item.id)}
        isSaved={true}
      /> */}
      
      {/* Placeholder temporal */}
      <View style={styles.placeholderCard}>
        <View style={styles.placeholderHeader}>
          <View style={styles.placeholderLeft}>
            <Text style={styles.placeholderTitle}>{item.title}</Text>
            <Text style={styles.placeholderDesc} numberOfLines={2}>
              {item.description}
            </Text>
          </View>
          <Ionicons
            name="bookmark"
            size={20}
            color={colors.primary}
            style={styles.bookmarkIcon}
          />
        </View>

        {item.budget_max && (
          <Text style={styles.placeholderBudget}>
            ${item.budget_min || 0} - ${item.budget_max}
          </Text>
        )}

        <View style={styles.metaRow}>
          {item.location && (
            <View style={styles.metaItem}>
              <Ionicons name="location-outline" size={12} color={colors.textLight} />
              <Text style={styles.metaText}>{item.location}</Text>
            </View>
          )}
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={12} color={colors.textLight} />
            <Text style={styles.metaText}>
              Guardada hace {Math.floor(Math.random() * 7) + 1}d
            </Text>
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
    marginBottom: 20,
  },
  tipBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.secondary + '15',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    maxWidth: 300,
  },
  tipText: {
    flex: 1,
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: colors.text,
    lineHeight: 18,
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
    flexDirection: 'row',
    marginBottom: 12,
    gap: 12,
  },
  placeholderLeft: {
    flex: 1,
  },
  placeholderTitle: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.text,
    marginBottom: 6,
  },
  placeholderDesc: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textSecondary,
  },
  bookmarkIcon: {
    marginTop: 2,
  },
  placeholderBudget: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.success,
    marginBottom: 10,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textSecondary,
  },
});