// components/hiring/tabs/MyOffersTab.tsx

import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../../theme/colors';
import MyOfferCard from '../cards/MyOfferCard';
import { AppFooter } from '../../../../components/shared/AppFooter';

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
  offer_type: 'collaboration' | 'hiring' | 'gig' | 'event';
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
  onCreatePress?: () => void;
}

export default function MyOffersTab({
  offers,
  onOfferPress,
  onViewApplicantsPress,
  onEditPress,
  onDeletePress,
  onRefresh,
  isRefreshing = false,
  onCreatePress,
}: MyOffersTabProps) {

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconBg}>
        <Ionicons name="newspaper-outline" size={32} color={Colors.textLight} />
      </View>
      <Text style={styles.emptyTitle}>No has publicado ofertas</Text>
      <Text style={styles.emptySubtitle}>
        Crea tu primera oferta para empezar a recibir aplicaciones
      </Text>
      {onCreatePress && (
        <Pressable
          style={({ pressed }) => [styles.createBtn, pressed && { opacity: 0.8 }]}
          onPress={onCreatePress}
        >
          <Ionicons name="add" size={18} color="#fff" />
          <Text style={styles.createBtnText}>Crear oferta</Text>
        </Pressable>
      )}
    </View>
  );

  const renderOffer = ({ item }: { item: MyOffer }) => (
    <MyOfferCard
      offer={item}
      onPress={() => onOfferPress?.(item.id)}
      onViewApplicants={() => onViewApplicantsPress?.(item.id)}
      onEdit={() => onEditPress?.(item.id)}
      onDelete={() => onDeletePress?.(item.id)}
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
  createBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  createBtnText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#fff',
  },
});