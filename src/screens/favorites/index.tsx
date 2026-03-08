import React, { useState, useMemo } from 'react';
import {
  View,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Text,
  FlatList,
  Modal,
  ScrollView,
  Pressable,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppFooter } from '../../components/shared/AppFooter';
import { useAuth } from '../../hooks/useAuth';
import { useFavoritesData } from './hooks/useFavoritesData';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import TopBar from '../../components/shared/TopBar';

// Explore card contents
import ArtistCardContent from '../../components/explore/cards/ArtistCardContent';
import EventCardContent from '../../components/explore/cards/EventCardContent';
import VenueCardContent from '../../components/explore/cards/VenueCardContent';
import GalleryCardContent from '../../components/explore/cards/GalleryCardContent';

// Cards cuadrícula home-style
import {
  ArtistCard as HomeArtistCard,
  EventGridCard,
  VenueGridCard,
  GalleryGridCard,
} from '../home/components/ContentCards';

// Cards de lista
import { ArtistCardList } from './components/items/ArtistCardList';
import { EventCardList } from './components/items/EventCardList';
import { VenueCardList } from './components/items/VenueCardList';
import { GalleryCardList } from './components/items/GalleryCardList';

// El gap entre columnas debe coincidir con lo declarado en ArtistCard.tsx
const COLUMN_GAP = 10;
const H_PADDING = 16;

// Ancho de tarjeta para cuadrícula (calculado para 2 columnas con gap)
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GRID_CARD_WIDTH = (SCREEN_WIDTH - H_PADDING * 2 - COLUMN_GAP) / 2;

// Explore details
import ArtistDetails from '../../components/explore/details/ArtistDetails';
import EventDetails from '../../components/explore/details/EventDetails';
import VenueDetails from '../../components/explore/details/VenueDetails';
import GalleryDetails from '../../components/explore/details/GalleryDetails';

// Filter Panels
import { FilterPanel } from './components/filters/FilterPanel';
import { EventFilterPanel } from './components/filters/EventFilterPanel';
import { SiteFilterPanel } from './components/filters/SiteFilterPanel';
import { GalleryFilterPanel } from './components/filters/GalleryFilterPanel';

// Types
import type { Artist, Event, Venue, GalleryItem, ExploreCard } from '../../types/explore';
import { styles } from './styles/favorites.styles';

type TabType = 'artists' | 'events' | 'venues' | 'gallery';
type ViewMode = 'grid' | 'list';

const TAB_LABELS: Record<TabType, string> = {
  artists: 'Artistas',
  events: 'Eventos',
  venues: 'Salas',
  gallery: 'Galería',
};

const professions = [
  'Músico', 'DJ', 'Banda', 'Animador', 'Payaso',
  'Magos', 'Chef', 'Fotógrafo', 'Decorador', 'Otro',
];

export default function FavoritesScreen() {
  useAuth();
  const insets = useSafeAreaInsets();

  const { artists, events, venues, gallery, loading: favoritesLoading } = useFavoritesData();

  const [activeTab, setActiveTab]           = useState<TabType>('artists');
  const [searchQuery, setSearchQuery]       = useState('');
  const [detailItem, setDetailItem]         = useState<ExploreCard | null>(null);
  const [viewMode, setViewMode]             = useState<ViewMode>('grid');
  const [showFilters, setShowFilters]       = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'recent' | 'today' | 'custom' | null>(null);
  const [customDate, setCustomDate]         = useState('');
  const [selectedProfession, setSelectedProfession] = useState('');
  const [sortByPrice, setSortByPrice]       = useState<'free' | 'price_asc' | 'price_desc' | ''>('');

  const handlePriceChange = (price: string) =>
    setSortByPrice(price as 'free' | 'price_asc' | 'price_desc' | '');

  // ── Datos del tab activo ───────────────────────────────────────────────────
  const currentData = useMemo((): ExploreCard[] => {
    switch (activeTab) {
      case 'artists': return artists;
      case 'events':  return events;
      case 'venues':  return venues;
      case 'gallery': return gallery;
      default:        return [];
    }
  }, [activeTab, artists, events, venues, gallery]);

  // ── Filtro de búsqueda ────────────────────────────────────────────────────
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return currentData;
    const q = searchQuery.toLowerCase();
    return currentData.filter(item =>
      item.name?.toLowerCase().includes(q) ||
      item.bio?.toLowerCase().includes(q) ||
      item.location?.toLowerCase().includes(q)
    );
  }, [currentData, searchQuery]);

  // ── Helpers de render ─────────────────────────────────────────────────────
  const renderCardContent = (item: ExploreCard) => {
    switch (item.type) {
      case 'artist':  return <ArtistCardContent artist={item as Artist} />;
      case 'event':   return <EventCardContent event={item as Event} />;
      case 'venue':   return <VenueCardContent venue={item as Venue} />;
      case 'gallery': return <GalleryCardContent item={item as GalleryItem} />;
    }
  };

  const renderDetailContent = (item: ExploreCard) => {
    switch (item.type) {
      case 'artist':  return <ArtistDetails artist={item as Artist} />;
      case 'event':   return <EventDetails event={item as Event} />;
      case 'venue':   return <VenueDetails venue={item as Venue} />;
      case 'gallery': return <GalleryDetails item={item as GalleryItem} />;
    }
  };

  // ── Render: cuadrícula ────────────────────────────────────────────────────
  const renderGridItem = ({ item, index }: { item: ExploreCard; index: number }) => {
    const isLeftColumn = index % 2 === 0;

    if (item.type === 'artist') {
      const a = item as Artist;
      const categoryStr = typeof a.category === 'string'
        ? a.category
        : (a.category as any)?.categoryId ?? 'Artista';
      const artistItem = {
        id:         a.id,
        name:       a.name,
        discipline: a.specialty || categoryStr,
        rating:     a.rating ?? 0,
        works:      a.reviews ?? 0,
        avatarUri:  a.image ?? null,
        gradients:  ['#7c3aed', '#2563eb'] as [string, string],
        initials:   a.name?.charAt(0).toUpperCase() ?? 'A',
        available:  a.availability?.toLowerCase() === 'disponible',
      };
      return (
        <View style={[
          gridStyles.itemWrapper,
          isLeftColumn ? { marginRight: COLUMN_GAP / 2 } : { marginLeft: COLUMN_GAP / 2 },
        ]}>
          <HomeArtistCard
            item={artistItem}
            onPress={() => setDetailItem(item)}
          />
        </View>
      );
    }

    const wrapperStyle = [
      gridStyles.itemWrapper,
      isLeftColumn ? { marginRight: COLUMN_GAP / 2 } : { marginLeft: COLUMN_GAP / 2 },
    ];

    if (item.type === 'event') {
      return (
        <View style={wrapperStyle}>
          <EventGridCard item={item as Event} onPress={() => setDetailItem(item)} />
        </View>
      );
    }
    if (item.type === 'venue') {
      return (
        <View style={wrapperStyle}>
          <VenueGridCard item={item as Venue} onPress={() => setDetailItem(item)} />
        </View>
      );
    }
    if (item.type === 'gallery') {
      return (
        <View style={wrapperStyle}>
          <GalleryGridCard item={item as GalleryItem} onPress={() => setDetailItem(item)} />
        </View>
      );
    }
    return null;
  };

  // ── Render: lista horizontal ──────────────────────────────────────────────
  const renderListCard = (item: ExploreCard) => {
    switch (item.type) {
      case 'artist':
        return <ArtistCardList artist={item as Artist} onPress={() => setDetailItem(item)} />;
      case 'event':
        return <EventCardList event={item as Event} onPress={() => setDetailItem(item)} />;
      case 'venue':
        return <VenueCardList venue={item as Venue} onPress={() => setDetailItem(item)} />;
      case 'gallery':
        return <GalleryCardList item={item as GalleryItem} onPress={() => setDetailItem(item)} />;
    }
  };

  // ── Render: filtros ───────────────────────────────────────────────────────
  const renderFilterPanel = () => {
    switch (activeTab) {
      case 'artists':
        return (
          <FilterPanel
            showFilters={showFilters}
            selectedFilter={selectedFilter}
            customDate={customDate}
            selectedProfession={selectedProfession}
            sortByPrice={sortByPrice}
            onFilterChange={setSelectedFilter}
            onCustomDateChange={setCustomDate}
            onProfessionChange={setSelectedProfession}
            onSortByPrice={handlePriceChange}
            onClearFilters={() => {}}
            onClose={() => setShowFilters(false)}
            artistCategories={professions}
          />
        );
      case 'events':
        return (
          <EventFilterPanel
            showFilters={showFilters}
            customDate={customDate}
            selectedCategory={selectedProfession}
            sortByPrice={sortByPrice}
            onCustomDateChange={setCustomDate}
            onCategoryChange={setSelectedProfession}
            onSortByPrice={handlePriceChange}
            onClearFilters={() => {}}
            onModalityChange={() => {}}
            onCityChange={() => {}}
            onClose={() => setShowFilters(false)}
            categories={professions}
          />
        );
      case 'venues':
        return (
          <SiteFilterPanel
            showFilters={showFilters}
            selectedService={selectedProfession}
            selectedCapacity={''}
            selectedCity={''}
            selectedPrice={sortByPrice}
            onServiceChange={setSelectedProfession}
            onCapacityChange={() => {}}
            onCityChange={() => {}}
            onPriceChange={handlePriceChange}
            onClearFilters={() => {}}
            onClose={() => setShowFilters(false)}
          />
        );
      case 'gallery':
        return (
          <GalleryFilterPanel
            showFilters={showFilters}
            selectedCategory={selectedProfession}
            selectedBookType={''}
            selectedStyle={''}
            selectedTrend={''}
            priceRange={[0, 1000]}
            onCategoryChange={setSelectedProfession}
            onBookTypeChange={() => {}}
            onStyleChange={() => {}}
            onTrendChange={() => {}}
            onPriceRangeChange={() => {}}
            onClearFilters={() => {}}
            onClose={() => setShowFilters(false)}
          />
        );
      default:
        return null;
    }
  };

  // ── Loading ───────────────────────────────────────────────────────────────
  if (favoritesLoading) {
    return (
      <View style={styles.container}>
        <TopBar title="Mis Favoritos" topInset={insets.top} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </View>
    );
  }

  // ── Main ──────────────────────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      <TopBar title="Mis Favoritos" topInset={insets.top} />

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {(['artists', 'events', 'venues', 'gallery'] as TabType[]).map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => { setActiveTab(tab); setSearchQuery(''); }}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {TAB_LABELS[tab]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Search + controles */}
      <View style={styles.searchRow}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar en favoritos..."
            placeholderTextColor={colors.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.viewModeToggle}>
          <TouchableOpacity
            style={[styles.viewModeButton, viewMode === 'grid' && styles.viewModeButtonActive]}
            onPress={() => setViewMode('grid')}
          >
            <Ionicons name="grid" size={16} color={viewMode === 'grid' ? colors.primary : colors.textLight} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.viewModeButton, viewMode === 'list' && styles.viewModeButtonActive]}
            onPress={() => setViewMode('list')}
          >
            <Ionicons name="list" size={16} color={viewMode === 'list' ? colors.primary : colors.textLight} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.controlButton, showFilters && styles.controlButtonActive]}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Ionicons
            name="options-outline"
            size={18}
            color={showFilters ? colors.white : colors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      {/* Filtros */}
      {showFilters && renderFilterPanel()}

      {/* Contador + contenido + footer — todo en un ScrollView */}
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
      >
        <Text style={localStyles.counter}>
          {filteredData.length} {filteredData.length === 1 ? 'favorito' : 'favoritos'}
        </Text>

        {/* Vacío */}
        {filteredData.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="heart-outline" size={48} color={colors.textLight} />
            <Text style={styles.emptyText}>No tienes favoritos aquí</Text>
            <Text style={styles.emptySubtext}>Explora y guarda lo que te guste</Text>
          </View>
        ) : viewMode === 'grid' ? (
          // ── CUADRÍCULA 2 COLUMNAS ────────────────────────────────────────
          <FlatList
            key="grid"
            data={filteredData}
            keyExtractor={item => item.id}
            numColumns={2}
            scrollEnabled={false}
            columnWrapperStyle={gridStyles.columnWrapper}
            contentContainerStyle={gridStyles.listContent}
            renderItem={renderGridItem}
          />
        ) : (
          // ── LISTA ────────────────────────────────────────────────────────
          <FlatList
            key="list"
            data={filteredData}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            contentContainerStyle={{ paddingHorizontal: H_PADDING, paddingVertical: 8 }}
            renderItem={({ item }) => renderListCard(item)}
          />
        )}

        <AppFooter />
      </ScrollView>

      {/* Detail Modal */}
      <Modal
        visible={detailItem !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setDetailItem(null)}
      >
        <View style={{ flex: 1, backgroundColor: colors.background }}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            paddingTop: insets.top + 8,
            paddingHorizontal: 16,
            paddingBottom: 8,
          }}>
            <TouchableOpacity
              onPress={() => setDetailItem(null)}
              style={{
                width: 36, height: 36, borderRadius: 18,
                backgroundColor: colors.backgroundSecondary,
                alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Ionicons name="close" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ alignItems: 'center', paddingBottom: insets.bottom + 32 }}
          >
            {detailItem && renderDetailContent(detailItem)}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

// ── Estilos locales ───────────────────────────────────────────────────────────
const localStyles = StyleSheet.create({
  counter: {
    fontSize: 13,
    color: 'rgba(109,40,217,0.55)',
    fontFamily: 'PlusJakartaSans_500Medium',
    marginHorizontal: H_PADDING,
    marginBottom: 8,
  },
});

// ── Estilos cuadrícula ────────────────────────────────────────────────────────
const gridStyles = StyleSheet.create({

  listContent: {
    paddingHorizontal: H_PADDING,
    paddingTop: 16,
    paddingBottom: 16,
  },
  // columnWrapperStyle: alinea las 2 columnas sin margin en las cards
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: COLUMN_GAP,
  },
  // Wrapper individual — ancho fijo, centra la card del home dentro
  itemWrapper: {
    width: GRID_CARD_WIDTH,
    alignItems: 'center',
  },
});

