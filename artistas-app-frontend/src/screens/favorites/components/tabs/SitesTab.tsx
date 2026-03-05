import React from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
} from 'react-native';
import { SiteCard } from '../items/SiteCard';

interface Site {
  id: number;
  name: string;
  category: string;
  address: string;
  city: string;
  rating: number;
  image: string;
  favorite: boolean;
}

interface SitesTabProps {
  data: Site[];
  viewMode: 'grid' | 'list';
  selectedForComparison: number[];
  onSelectForComparison: (id: number) => void;
  onSelectItem: (item: Site) => void;
  onToggleFavorite: (id: number) => void;
}

export const SitesTab: React.FC<SitesTabProps> = ({
  data,
  viewMode,
  selectedForComparison,
  onSelectForComparison,
  onSelectItem,
  onToggleFavorite,
}) => {
  const renderGridItem = (item: Site) => (
    <View style={styles.gridItem}>
      <SiteCard
        site={item}
        isSelected={selectedForComparison.includes(item.id)}
        onToggleSelect={() => onSelectForComparison(item.id)}
        onToggleFavorite={() => onToggleFavorite(item.id)}
        onPress={() => onSelectItem(item)}
      />
    </View>
  );

  const renderListItem = (item: Site) => (
    <SiteCard
      site={item}
      isSelected={selectedForComparison.includes(item.id)}
      onToggleSelect={() => onSelectForComparison(item.id)}
      onToggleFavorite={() => onToggleFavorite(item.id)}
      onPress={() => onSelectItem(item)}
    />
  );

  if (data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No hay sitios en tus favoritos</Text>
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