import { useState, useMemo } from 'react';
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
} from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
import { CARD_WIDTH, CARD_HEIGHT } from '../../components/explore/cards/SwipeCard';
const LIST_CARD_HEIGHT = 130;

// Explore details
import ArtistDetails from '../../components/explore/details/ArtistDetails';
import EventDetails from '../../components/explore/details/EventDetails';
import VenueDetails from '../../components/explore/details/VenueDetails';
import GalleryDetails from '../../components/explore/details/GalleryDetails';

// Filter Panels
import { FilterPanel } from '../../components/favorites/filters/FilterPanel';
import { EventFilterPanel } from '../../components/favorites/filters/EventFilterPanel';
import { SiteFilterPanel } from '../../components/favorites/filters/SiteFilterPanel';
import { GalleryFilterPanel } from '../../components/favorites/filters/GalleryFilterPanel';

// Types
import type { Artist, Event, Venue, GalleryItem, ExploreCard } from '../../types/explore';

// Styles
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

  const {
    artists,
    events,
    venues,
    gallery,
    loading: favoritesLoading,
  } = useFavoritesData();

  const [activeTab, setActiveTab] = useState<TabType>('artists');
  const [searchQuery, setSearchQuery] = useState('');
  const [detailItem, setDetailItem] = useState<ExploreCard | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'recent' | 'today' | 'custom' | null>(null);
  const [customDate, setCustomDate] = useState('');
  const [selectedProfession, setSelectedProfession] = useState('');
  const [sortByPrice, setSortByPrice] = useState<'free' | 'price_asc' | 'price_desc' | ''>('');

  const handlePriceChange = (price: string) => {
    setSortByPrice(price as 'free' | 'price_asc' | 'price_desc' | '');
  };

  // Current tab data
  const currentData = useMemo((): ExploreCard[] => {
    switch (activeTab) {
      case 'artists': return artists;
      case 'events': return events;
      case 'venues': return venues;
      case 'gallery': return gallery;
      default: return [];
    }
  }, [activeTab, artists, events, venues, gallery]);

  // Search filter
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return currentData;
    const q = searchQuery.toLowerCase();
    return currentData.filter((item) =>
      item.name?.toLowerCase().includes(q) ||
      item.bio?.toLowerCase().includes(q) ||
      item.location?.toLowerCase().includes(q)
    );
  }, [currentData, searchQuery]);

  // Render card content based on type
  const renderCardContent = (item: ExploreCard) => {
    switch (item.type) {
      case 'artist':  return <ArtistCardContent artist={item as Artist} />;
      case 'event':   return <EventCardContent event={item as Event} />;
      case 'venue':   return <VenueCardContent venue={item as Venue} />;
      case 'gallery': return <GalleryCardContent item={item as GalleryItem} />;
    }
  };

  // Render detail view based on type
  const renderDetailContent = (item: ExploreCard) => {
    switch (item.type) {
      case 'artist':  return <ArtistDetails artist={item as Artist} />;
      case 'event':   return <EventDetails event={item as Event} />;
      case 'venue':   return <VenueDetails venue={item as Venue} />;
      case 'gallery': return <GalleryDetails item={item as GalleryItem} />;
    }
  };

  // Get meta info for horizontal card
  const getCardMeta = (item: ExploreCard) => {
    switch (item.type) {
      case 'artist': {
        const a = item as Artist;
        return { subtitle: a.category, extra: a.experience ? `${a.experience} exp.` : undefined };
      }
      case 'event': {
        const e = item as Event;
        return { subtitle: `${e.date} · ${e.time}`, extra: e.venue };
      }
      case 'venue': {
        const v = item as Venue;
        return { subtitle: v.category, extra: `Cap. ${v.capacity}` };
      }
      case 'gallery': {
        const g = item as GalleryItem;
        return { subtitle: g.artistName, extra: g.medium };
      }
    }
  };

  const formatPrice = (price: number) =>
    `$${price.toLocaleString('es-CO', { maximumFractionDigits: 0 })}`;

  // Horizontal card for list mode (Booking style)
  const renderListCard = (item: ExploreCard) => {
    const meta = getCardMeta(item);
    const isAvailable = item.availability === 'Disponible';

    return (
      <Pressable
        onPress={() => setDetailItem(item)}
        style={({ pressed }) => [
          listStyles.card,
          pressed && { opacity: 0.95, transform: [{ scale: 0.99 }] },
        ]}
      >
        {/* Image */}
        <View style={listStyles.imageContainer}>
          <Image
            source={{ uri: item.image }}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
            transition={200}
          />
          {/* Rating badge */}
          <View style={listStyles.ratingBadge}>
            <Ionicons name="star" size={10} color="#fbbf24" />
            <Text style={listStyles.ratingText}>{item.rating}</Text>
          </View>
        </View>

        {/* Info */}
        <View style={listStyles.info}>
          <View style={listStyles.infoTop}>
            <Text style={listStyles.name} numberOfLines={1}>{item.name}</Text>
            {meta.subtitle && (
              <Text style={listStyles.subtitle} numberOfLines={1}>{meta.subtitle}</Text>
            )}
            <View style={listStyles.metaRow}>
              <Ionicons name="location-outline" size={12} color={colors.textSecondary} />
              <Text style={listStyles.metaText} numberOfLines={1}>{item.location}</Text>
            </View>
            {meta.extra && (
              <View style={listStyles.metaRow}>
                <Ionicons name="information-circle-outline" size={12} color={colors.textSecondary} />
                <Text style={listStyles.metaText} numberOfLines={1}>{meta.extra}</Text>
              </View>
            )}
          </View>

          <View style={listStyles.infoBottom}>
            <View style={[
              listStyles.availDot,
              { backgroundColor: isAvailable ? colors.success : '#f59e0b' },
            ]} />
            <Text style={listStyles.price}>{formatPrice(item.price)}</Text>
          </View>
        </View>

        {/* Heart */}
        <View style={listStyles.heartContainer}>
          <Ionicons name="heart" size={18} color="#f87171" />
        </View>
      </Pressable>
    );
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

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {(['artists', 'events', 'venues', 'gallery'] as TabType[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => {
              setActiveTab(tab);
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

      {/* Count */}
      <Text style={{
        fontSize: 13,
        color: colors.textSecondary,
        fontFamily: 'PlusJakartaSans_500Medium',
        marginHorizontal: 16,
        marginBottom: 8,
      }}>
        {filteredData.length} {filteredData.length === 1 ? 'favorito' : 'favoritos'}
      </Text>

      {/* List */}
      {filteredData.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-outline" size={48} color={colors.textLight} />
          <Text style={styles.emptyText}>No tienes favoritos aquí</Text>
          <Text style={styles.emptySubtext}>Explora y guarda lo que te guste</Text>
        </View>
      ) : (
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            alignItems: viewMode === 'grid' ? 'center' : undefined,
            paddingHorizontal: viewMode === 'grid' ? 0 : 16,
            paddingBottom: insets.bottom + 96,
          }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) =>
            viewMode === 'list'
              ? renderListCard(item)
              : (
                <Pressable
                  onPress={() => setDetailItem(item)}
                  style={{ width: CARD_WIDTH, height: CARD_HEIGHT, marginBottom: 16 }}
                >
                  {renderCardContent(item)}
                </Pressable>
              )
          }
        />
      )}

      {/* Detail Modal */}
      <Modal
        visible={detailItem !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setDetailItem(null)}
      >
        <View style={{ flex: 1, backgroundColor: colors.background }}>
          {/* Close button */}
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
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: colors.backgroundSecondary,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="close" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              alignItems: 'center',
              paddingBottom: insets.bottom + 32,
            }}
          >
            {detailItem && renderDetailContent(detailItem)}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

// ── Styles for horizontal list cards (Booking style) ─────────────────────────
const listStyles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    height: LIST_CARD_HEIGHT,
  },
  imageContainer: {
    width: LIST_CARD_HEIGHT,
    height: LIST_CARD_HEIGHT,
    backgroundColor: '#e5e7eb',
  },
  ratingBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  ratingText: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#fff',
  },
  info: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    justifyContent: 'space-between',
  },
  infoTop: {
    gap: 3,
  },
  name: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.text,
    lineHeight: 20,
  },
  subtitle: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: colors.primary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textSecondary,
    flex: 1,
  },
  infoBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  availDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  price: {
    fontSize: 15,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.text,
  },
  heartContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});
