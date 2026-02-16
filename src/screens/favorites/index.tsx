import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Text,
  Animated,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../hooks/useAuth';
import { useFavoritesData } from './hooks/useFavoritesData';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import TopBar from '../../components/shared/TopBar';

// Detail Views
import { ArtistDetailView } from '../../components/favorites/details/ArtistDetailView';
import EventDetailView from '../../components/favorites/details/EventDetailView';
import SiteDetailView from '../../components/favorites/details/SiteDetailView';
import ProductDetailView from '../../components/favorites/details/ProductDetailView';

// Filter Panels
import { FilterPanel } from '../../components/favorites/filters/FilterPanel';
import { EventFilterPanel } from '../../components/favorites/filters/EventFilterPanel';
import { SiteFilterPanel } from '../../components/favorites/filters/SiteFilterPanel';
import { GalleryFilterPanel } from '../../components/favorites/filters/GalleryFilterPanel';

// Tabs
import { ArtistsTab } from '../../components/favorites/tabs/ArtistsTab';
import { EventsTab } from '../../components/favorites/tabs/EventsTab';
import { SitesTab } from '../../components/favorites/tabs/SitesTab';
import { GalleryTab } from '../../components/favorites/tabs/GalleryTab';

// Comparison
import { ComparisonDialog } from '../../components/favorites/comparison/ComparisonDialog';

// Styles
import { styles } from './styles/favorites.styles';

type TabType = 'artists' | 'events' | 'sites' | 'gallery';
type ViewMode = 'grid' | 'list';

const TAB_LABELS: Record<TabType, string> = {
  artists: 'Artistas',
  events: 'Eventos',
  sites: 'Sitios',
  gallery: 'Galería',
};

const professions = [
  'Músico', 'DJ', 'Banda', 'Animador', 'Payaso',
  'Magos', 'Chef', 'Fotógrafo', 'Decorador', 'Otro',
];

export default function FavoritesScreen() {
  useAuth();
  const insets = useSafeAreaInsets();

  const {
    artists: backendArtists,
    events: backendEvents,
    sites: backendSites,
    gallery: backendGallery,
    loading: favoritesLoading,
  } = useFavoritesData();

  // State
  const [activeTab, setActiveTab] = useState<TabType>('artists');
  const [selectedForComparison, setSelectedForComparison] = useState<number[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'recent' | 'today' | 'custom' | null>(null);
  const [customDate, setCustomDate] = useState('');
  const [selectedProfession, setSelectedProfession] = useState('');
  const [sortByPrice, setSortByPrice] = useState<'free' | 'price_asc' | 'price_desc' | ''>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedDetailItem, setSelectedDetailItem] = useState<any>(null);
  const [detailType, setDetailType] = useState<TabType | 'product'>('artists');

  // FAB animation
  const fabAnim = useRef(new Animated.Value(0)).current;
  const showFab = selectedForComparison.length > 1;

  useEffect(() => {
    Animated.spring(fabAnim, {
      toValue: showFab ? 1 : 0,
      useNativeDriver: true,
      tension: 60,
      friction: 8,
    }).start();
  }, [showFab]);

  const handlePriceChange = (price: string) => {
    setSortByPrice(price as 'free' | 'price_asc' | 'price_desc' | '');
  };

  // Current tab data
  const currentData = useMemo(() => {
    switch (activeTab) {
      case 'artists': return backendArtists;
      case 'events': return backendEvents;
      case 'sites': return backendSites;
      case 'gallery': return backendGallery;
      default: return [];
    }
  }, [activeTab, backendArtists, backendEvents, backendSites, backendGallery]);

  // Functional search filter
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return currentData;
    const q = searchQuery.toLowerCase();
    return currentData.filter((item: any) =>
      item.name?.toLowerCase().includes(q) ||
      item.title?.toLowerCase().includes(q) ||
      item.description?.toLowerCase().includes(q)
    );
  }, [currentData, searchQuery]);

  const handleSelectItem = (item: any, type: TabType | 'product') => {
    setSelectedDetailItem(item);
    setDetailType(type);
    setShowDetailModal(true);
  };

  const handleSelectForComparison = (itemId: number) => {
    setSelectedForComparison((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };

  const handleToggleFavorite = (itemId: number) => {
    console.log('Toggle favorite for item:', itemId);
  };

  // Detail view renderer
  const renderDetailView = () => {
    if (!selectedDetailItem) return null;
    const commonProps = {
      open: showDetailModal,
      onClose: () => setShowDetailModal(false),
      onToggleFavorite: () => {},
      isFavorite: true,
    };

    switch (detailType) {
      case 'artists':
        return <ArtistDetailView artist={selectedDetailItem} {...commonProps} />;
      case 'events':
        return <EventDetailView event={selectedDetailItem} {...commonProps} />;
      case 'sites':
        return <SiteDetailView site={selectedDetailItem} {...commonProps} />;
      case 'gallery':
      case 'product':
        return <ProductDetailView product={selectedDetailItem} {...commonProps} />;
      default:
        return null;
    }
  };

  // Filter panel renderer
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
      case 'sites':
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

  // Tab content renderer
  const renderTabContent = () => {
    const data = filteredData as any[];

    switch (activeTab) {
      case 'artists':
        return (
          <ArtistsTab
            data={data}
            viewMode={viewMode}
            selectedForComparison={selectedForComparison}
            onSelectForComparison={handleSelectForComparison}
            onSelectItem={(item) => handleSelectItem(item, 'artists')}
            onToggleFavorite={handleToggleFavorite}
          />
        );
      case 'events':
        return (
          <EventsTab
            data={data}
            viewMode={viewMode}
            selectedForComparison={selectedForComparison}
            onSelectForComparison={handleSelectForComparison}
            onSelectItem={(item) => handleSelectItem(item, 'events')}
            onToggleFavorite={handleToggleFavorite}
          />
        );
      case 'sites':
        return (
          <SitesTab
            data={data}
            viewMode={viewMode}
            selectedForComparison={selectedForComparison}
            onSelectForComparison={handleSelectForComparison}
            onSelectItem={(item) => handleSelectItem(item, 'sites')}
            onToggleFavorite={handleToggleFavorite}
          />
        );
      case 'gallery':
        return (
          <GalleryTab
            data={data}
            viewMode={viewMode}
            selectedForComparison={selectedForComparison}
            onSelectForComparison={handleSelectForComparison}
            onSelectItem={(item) => handleSelectItem(item, 'gallery')}
            onToggleFavorite={handleToggleFavorite}
          />
        );
    }
  };

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

  return (
    <View style={styles.container}>
      <TopBar title="Mis Favoritos" topInset={insets.top} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 96 }}
      >
        {/* Tabs pill */}
        <View style={styles.tabsContainer}>
          {(['artists', 'events', 'sites', 'gallery'] as TabType[]).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => {
                setActiveTab(tab);
                setSelectedForComparison([]);
                setSearchQuery('');
              }}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {TAB_LABELS[tab]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Search + controls */}
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

        {/* Filters */}
        {showFilters && renderFilterPanel()}

        {/* Tab content */}
        {renderTabContent()}
      </ScrollView>

      {/* FAB — Comparar */}
      <Animated.View
        style={[
          styles.fabContainer,
          {
            paddingBottom: insets.bottom + 96,
            opacity: fabAnim,
            transform: [{
              translateY: fabAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [80, 0],
              }),
            }],
          },
        ]}
        pointerEvents={showFab ? 'auto' : 'none'}
      >
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setShowComparison(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="git-compare-outline" size={20} color={colors.white} />
          <Text style={styles.fabText}>
            Comparar ({selectedForComparison.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.clearSelectionButton}
          onPress={() => setSelectedForComparison([])}
        >
          <Text style={styles.clearSelectionText}>Limpiar selección</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Detail Modal */}
      {showDetailModal && renderDetailView()}

      {/* Comparison Dialog */}
      {showComparison && (
        <ComparisonDialog
          open={showComparison}
          onOpenChange={setShowComparison}
          comparisonData={currentData.filter((item: any) => selectedForComparison.includes(item.id))}
          comparisonTab={activeTab}
        />
      )}
    </View>
  );
}
