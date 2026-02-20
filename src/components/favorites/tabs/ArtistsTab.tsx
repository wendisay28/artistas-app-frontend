import React from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
} from 'react-native';
import { ArtistCard } from '../items/ArtistCard';
import type { FavoriteArtist } from '../../../data/favorites-mock';

interface ArtistsTabProps {
  data: FavoriteArtist[];
  viewMode: 'grid' | 'list';
  selectedForComparison: number[];
  onSelectForComparison: (id: number) => void;
  onSelectItem: (item: FavoriteArtist) => void;
  onToggleFavorite: (id: number) => void;
}

export const ArtistsTab: React.FC<ArtistsTabProps> = ({
  data,
  onSelectItem,
  onToggleFavorite,
}) => {
  if (data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No hay artistas en tus favoritos</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <ArtistCard
            artist={item}
            onPress={() => onSelectItem(item)}
            onToggleFavorite={() => onToggleFavorite(Number(item.id) || 0)}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        scrollEnabled={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
    marginVertical: 16,
  },
  listContent: {
    paddingVertical: 8,
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    fontWeight: '500',
  },
});
