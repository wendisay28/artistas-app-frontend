import React from 'react';
import {
  View,
  ScrollView,
  FlatList,
  StyleSheet,
  Text,
  ActivityIndicator,
} from 'react-native';
import { ArtistCard } from '../items/ArtistCard';

interface Artist {
  id: number;
  name: string;
  type: string; // profession en tu web es 'type'
  rating: number;
  price: number;
  image: string;
  fans: number;
  city: string;
  description: string;
  verified?: boolean;
  availability?: string;
  favorite: boolean;
}

interface ArtistsTabProps {
  data: Artist[];
  viewMode: 'grid' | 'list';
  selectedForComparison: number[];
  onSelectForComparison: (id: number) => void;
  onSelectItem: (item: Artist) => void;
  onToggleFavorite: (id: number) => void;
}

export const ArtistsTab: React.FC<ArtistsTabProps> = ({
  data,
  viewMode,
  selectedForComparison,
  onSelectForComparison,
  onSelectItem,
  onToggleFavorite,
}) => {
  const renderGridItem = (item: Artist) => (
    <View style={styles.gridItem}>
      <ArtistCard
        artist={item}
        isSelected={selectedForComparison.includes(item.id)}
        onToggleSelect={() => onSelectForComparison(item.id)}
        onToggleFavorite={() => onToggleFavorite(item.id)}
        onPress={() => onSelectItem(item)}
      />
    </View>
  );

  const renderListItem = (item: Artist) => (
    <ArtistCard
      artist={item}
      isSelected={selectedForComparison.includes(item.id)}
      onToggleSelect={() => onSelectForComparison(item.id)}
      onToggleFavorite={() => onToggleFavorite(item.id)}
      onPress={() => onSelectItem(item)}
      listMode
    />
  );

  if (data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No hay artistas en tus favoritos</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {viewMode === 'grid' ? (
        <FlatList
          data={data}
          renderItem={({ item }) => renderGridItem(item)}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          scrollEnabled={false}
          contentContainerStyle={styles.gridContent}
        />
      ) : (
        <FlatList
          data={data}
          renderItem={({ item }) => renderListItem(item)}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={false}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
    marginVertical: 16,
  },
  gridItem: {
    flex: 1,
    marginHorizontal: 6,
    marginBottom: 12,
  },
  row: {
    justifyContent: 'space-between',
  },
  gridContent: {
    paddingVertical: 8,
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