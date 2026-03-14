import React, { memo, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { useExplore } from '../../hooks/useExplore';
import { ArtistCard, EventCard, VenueCard, GalleryCard } from './components/SimpleCards';
import { colors } from '../../constants/colors';

// Componente CategorySelector inline simple
const SimpleCategorySelector: React.FC<{
  selectedCategory: string;
  onSelect: (category: string) => void;
}> = ({ selectedCategory, onSelect }) => {
  const categories = [
    { id: 'artists', label: 'Artistas', icon: 'brush-outline' },
    { id: 'events', label: 'Eventos', icon: 'calendar-outline' },
    { id: 'venues', label: 'Salas', icon: 'business-outline' },
    { id: 'gallery', label: 'Galería', icon: 'images-outline' },
  ];

  return (
    <View style={categoryStyles.container}>
      {categories.map(category => (
        <TouchableOpacity
          key={category.id}
          style={[
            categoryStyles.categoryItem,
            selectedCategory === category.id && categoryStyles.categoryItemActive
          ]}
          onPress={() => onSelect(category.id)}
          activeOpacity={0.7}
        >
          <Ionicons 
            name={category.icon as any} 
            size={16} 
            color={selectedCategory === category.id ? '#fff' : '#9333ea'} 
          />
          <Text style={[
            categoryStyles.categoryLabel,
            selectedCategory === category.id && categoryStyles.categoryLabelActive
          ]}>
            {category.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const categoryStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#faf5ff',
    borderWidth: 1,
    borderColor: '#e9d5ff',
    gap: 6,
  },
  categoryItemActive: {
    backgroundColor: '#9333ea',
    borderColor: '#9333ea',
  },
  categoryLabel: {
    fontSize: 13,
    color: '#9333ea',
    fontFamily: 'Inter_500Medium',
  },
  categoryLabelActive: {
    color: '#fff',
    fontFamily: 'Inter_600SemiBold',
  },
});

// Memoized components para evitar re-renders
const MemoizedArtistCard = memo(ArtistCard);
const MemoizedEventCard = memo(EventCard);
const MemoizedVenueCard = memo(VenueCard);
const MemoizedGalleryCard = memo(GalleryCard);

const ExploreScreen = () => {
  const insets = useSafeAreaInsets();
  const explore = useExplore();

  // Memoizar categorías para evitar recreación
  const categories = useMemo(() => [
    { id: 'artists', label: 'Artistas', icon: 'brush-outline' },
    { id: 'events', label: 'Eventos', icon: 'calendar-outline' },
    { id: 'venues', label: 'Salas', icon: 'business-outline' },
    { id: 'gallery', label: 'Galería', icon: 'images-outline' },
  ], []);

  // Memoizar renderizado de cards
  const renderCard = useCallback(({ item, index }: { item: any; index: number }) => {
    const cardProps = { item, index };
    
    switch (explore.category) {
      case 'artists':
        return <MemoizedArtistCard {...cardProps} />;
      case 'events':
        return <MemoizedEventCard {...cardProps} />;
      case 'venues':
        return <MemoizedVenueCard {...cardProps} />;
      case 'gallery':
        return <MemoizedGalleryCard {...cardProps} />;
      default:
        return <MemoizedArtistCard {...cardProps} />;
    }
  }, [explore.category]);

  // Memoizar key extractor
  const keyExtractor = useCallback((item: any) => item.id || item.key, []);

  // Memoizar footer para loading
  const renderFooter = useCallback(() => {
    if (!explore.loading) return null;
    
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="small" color="#9333ea" />
        <Text style={styles.loadingText}>Cargando más...</Text>
      </View>
    );
  }, [explore.loading]);

  // Memoizar empty state
  const renderEmptyState = useCallback(() => {
    if (explore.loading) return null;
    
    return (
      <View style={styles.emptyState}>
        <Ionicons name="search" size={48} color="#d1d5db" />
        <Text style={styles.emptyTitle}>No se encontraron resultados</Text>
        <Text style={styles.emptySubtitle}>
          Intenta ajustando los filtros o términos de búsqueda
        </Text>
        <TouchableOpacity 
          style={styles.clearFiltersBtn}
          onPress={explore.clearFilters}
        >
          <Text style={styles.clearFiltersText}>Limpiar filtros</Text>
        </TouchableOpacity>
      </View>
    );
  }, [explore.loading, explore.clearFilters]);

  // Optimización: Prevenir re-renders innecesarios
  const handleRefresh = useCallback(() => {
    explore.refresh();
  }, [explore.refresh]);

  const handleLoadMore = useCallback(() => {
    explore.loadMore();
  }, [explore.loadMore]);

  const handleSearch = useCallback((text: string) => {
    explore.search(text);
  }, [explore.search]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header con búsqueda */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#9333ea" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar artistas, eventos, salas..."
            placeholderTextColor="#9ca3af"
            onChangeText={handleSearch}
            defaultValue={explore.filters.query}
          />
          {explore.filters.query && (
            <TouchableOpacity onPress={() => explore.search('')}>
              <Ionicons name="close-circle" size={20} color="#d1d5db" />
            </TouchableOpacity>
          )}
        </View>
        
        <TouchableOpacity 
          style={styles.filterBtn}
          onPress={() => {/* TODO: Abrir panel de filtros */}}
        >
          <Ionicons name="options" size={20} color="#9333ea" />
        </TouchableOpacity>
      </View>

      {/* Categorías */}
      <SimpleCategorySelector
        selectedCategory={explore.category}
        onSelect={explore.setCategory}
      />

      {/* Resultados info */}
      <View style={styles.resultsInfo}>
        <Text style={styles.resultsCount}>
          {explore.total} {explore.category === 'artists' ? 'artistas' : 
           explore.category === 'events' ? 'eventos' : 
           explore.category === 'venues' ? 'salas' : 'obras'}
        </Text>
        {explore.error && (
          <Text style={styles.errorText}>{explore.error}</Text>
        )}
      </View>

      {/* Lista principal optimizada */}
      <FlatList
        data={explore.data}
        renderItem={renderCard}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={explore.loading && explore.filters.offset === 0}
            onRefresh={handleRefresh}
            tintColor="#9333ea"
            colors={['#9333ea']}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmptyState}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        initialNumToRender={10}
        windowSize={10}
        getItemLayout={(data, index) => ({
          length: 200, // Altura aproximada de cada card
          offset: 200 * index,
          index,
        })}
      />

      {/* Loading overlay para carga inicial */}
      {explore.loading && explore.data.length === 0 && (
        <View style={styles.initialLoading}>
          <ActivityIndicator size="large" color="#9333ea" />
          <Text style={styles.initialLoadingText}>Cargando...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#faf5ff',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: '#e9d5ff',
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#1f2937',
    fontFamily: 'Inter_500Medium',
  },
  filterBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#f3e8ff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e9d5ff',
  },
  resultsInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  resultsCount: {
    fontSize: 14,
    color: '#6b7280',
    fontFamily: 'Inter_500Medium',
  },
  errorText: {
    fontSize: 12,
    color: '#ef4444',
    fontFamily: 'Inter_500Medium',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  loadingFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  loadingText: {
    fontSize: 14,
    color: '#9333ea',
    fontFamily: 'Inter_500Medium',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    color: '#374151',
    fontFamily: 'Inter_600SemiBold',
    marginTop: 12,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6b7280',
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    marginBottom: 20,
  },
  clearFiltersBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#f3e8ff',
    borderWidth: 1,
    borderColor: '#e9d5ff',
  },
  clearFiltersText: {
    fontSize: 14,
    color: '#9333ea',
    fontFamily: 'Inter_600SemiBold',
  },
  initialLoading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  initialLoadingText: {
    fontSize: 16,
    color: '#9333ea',
    fontFamily: 'Inter_500Medium',
  },
});

export default memo(ExploreScreen);
