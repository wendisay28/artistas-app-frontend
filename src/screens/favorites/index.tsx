import React, { useState, useMemo, useCallback } from 'react';
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
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';
import { useFavoritesData } from './hooks/useFavoritesData';
import { useListsStore } from '../../store/listsStore';
import { useThemeStore } from '../../store/themeStore';
import { colors } from '../../constants/colors';
import { LinearGradient } from 'expo-linear-gradient';

// Components
import TopBar from '../../components/shared/TopBar';
import FavoritesHeader from './components/FavoritesHeader';
import { ComingSoonSection } from '../../components/shared/ComingSoonSection';

// Cards
import { ArtistCard } from './components/items/ArtistCard';
import { EventCard } from './components/items/EventCard';
import { ArtistCardList } from './components/items/ArtistCardList';
import { EventCardList } from './components/items/EventCardList';
import { VenueCardList } from './components/items/VenueCardList';
import { GalleryCardList } from './components/items/GalleryCardList';

// Details
import ArtistDetails from '../../components/explore/details/ArtistDetails';
import EventDetails from '../../components/explore/details/EventDetails';
import VenueDetails from '../../components/explore/details/VenueDetails';
import GalleryDetails from '../../components/explore/details/GalleryDetails';

// Modals & Tabs
import { ProjectsTab } from './components/projects/ProjectsTab';
import { AddToProjectModal } from './components/projects/AddToProjectModal';
import { InspirationTab } from './components/inspiration/InspirationTab';

// Filtros
import { FilterPanel } from './components/filters/FilterPanel';
import { EventFilterPanel } from './components/filters/EventFilterPanel';
import { GalleryFilterPanel } from './components/filters/GalleryFilterPanel';
import { SiteFilterPanel } from './components/filters/SiteFilterPanel';

// Types
import type { Artist, Event, Venue, GalleryItem, ExploreCard } from '../../types/explore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const PILL_META: Record<string, { label: string; icon: string }> = {
  todos:   { label: 'Todos',    icon: 'grid' },
  artists: { label: 'Artistas', icon: 'person' },
  events:  { label: 'Eventos',  icon: 'calendar' },
  venues:  { label: 'Salas',    icon: 'business' },
  gallery: { label: 'Galería',  icon: 'image' },
};
const H_PADDING = 16;
const COLUMN_GAP = 12;
const GRID_CARD_WIDTH = (SCREEN_WIDTH - (H_PADDING * 2) - COLUMN_GAP) / 2;

type TabType = 'saved' | 'projects' | 'inspiration';
type ViewMode = 'grid' | 'list';


export default function FavoritesScreen() {
  useAuth();
  const insets = useSafeAreaInsets();
  const { isDark } = useThemeStore();
  const { projects } = useListsStore();
  const { artists, events, venues, gallery, loading: favoritesLoading } = useFavoritesData();

  // States
  const [activeTab, setActiveTab] = useState<TabType>('saved');
  const [savedFilter, setSavedFilter] = useState<'todos' | 'artists' | 'events' | 'venues' | 'gallery'>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [detailItem, setDetailItem] = useState<ExploreCard | null>(null);
  const [addToProjectItem, setAddToProjectItem] = useState<ExploreCard | null>(null);
  const [selectedProfession, setSelectedProfession] = useState('');
  const [sortByPrice, setSortByPrice] = useState<'free' | 'price_asc' | 'price_desc' | ''>('');

  // ── Estados filtros avanzados ─────────────────────────────────────────────
  // Artistas / General
  const [selectedDateFilter, setSelectedDateFilter] = useState('');
  const [customDate, setCustomDate] = useState('');
  // Eventos
  const [eventCategory, setEventCategory] = useState('');
  const [_eventModality, setEventModality] = useState('');
  const [eventCity, setEventCity] = useState('');
  // Galería
  const [galleryCategory, setGalleryCategory] = useState('');
  const [galleryBookType, setGalleryBookType] = useState('');
  const [galleryStyle, setGalleryStyle] = useState('');
  const [galleryTrend, setGalleryTrend] = useState('');
  const [galleryPriceRange, setGalleryPriceRange] = useState([0, 5000000]);
  // Sitios
  const [venueService, setVenueService] = useState('');
  const [venueCapacity, setVenueCapacity] = useState('');
  const [venueCity, setVenueCity] = useState('');
  const [venuePrice, setVenuePrice] = useState('');

  const clearFilters = () => {
    setSelectedProfession(''); setSortByPrice(''); setSelectedDateFilter('');
    setCustomDate(''); setEventCategory(''); setEventModality(''); setEventCity('');
    setGalleryCategory(''); setGalleryBookType(''); setGalleryStyle(''); setGalleryTrend('');
    setGalleryPriceRange([0, 5000000]);
    setVenueService(''); setVenueCapacity(''); setVenueCity(''); setVenuePrice('');
    setShowFilters(false);
  };

  // ── Lógica de filtrado ─────────────────────────────────────────────────────
  const filteredData = useMemo(() => {
    let data: ExploreCard[] = [];

    // 1. Filtro por tab
    switch (savedFilter) {
      case 'todos':   data = [...artists, ...events, ...venues, ...gallery]; break;
      case 'artists': data = artists; break;
      case 'events':  data = events; break;
      case 'venues':  data = venues; break;
      case 'gallery': data = gallery; break;
    }

    // 2. Búsqueda
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      data = data.filter(item =>
        item.name?.toLowerCase().includes(q) ||
        item.location?.toLowerCase().includes(q),
      );
    }

    // 3. Artistas: profesión
    if (selectedProfession) {
      data = data.filter(item => {
        if (item.type !== 'artist') return true;
        const cat = typeof (item as Artist).category === 'string'
          ? (item as Artist).category as string
          : ((item as Artist).category as any)?.categoryId ?? '';
        return cat === selectedProfession;
      });
    }

    // 4. Eventos: categoría (tags)
    if (eventCategory) {
      data = data.filter(item => {
        if (item.type !== 'event') return true;
        return item.tags?.some(t => t.toLowerCase().includes(eventCategory.toLowerCase()));
      });
    }

    // 5. Eventos: ciudad
    if (eventCity) {
      data = data.filter(item => {
        if (item.type !== 'event') return true;
        const e = item as Event;
        return (
          e.city?.toLowerCase().includes(eventCity.toLowerCase()) ||
          e.location?.toLowerCase().includes(eventCity.toLowerCase())
        );
      });
    }

    // 6. Galería: categoría
    if (galleryCategory) {
      data = data.filter(item => {
        if (item.type !== 'gallery') return true;
        const g = item as GalleryItem;
        return (
          g.category?.toLowerCase() === galleryCategory.toLowerCase() ||
          g.medium?.toLowerCase().includes(galleryCategory.toLowerCase())
        );
      });
    }

    // 7. Galería: estilo (tags)
    if (galleryStyle) {
      data = data.filter(item => {
        if (item.type !== 'gallery') return true;
        return item.tags?.some(t => t.toLowerCase().includes(galleryStyle.toLowerCase()));
      });
    }

    // 8. Galería: tendencias
    if (galleryTrend) {
      data = data.filter(item => {
        if (item.type !== 'gallery') return true;
        if (galleryTrend === 'bestsellers')  return item.rating >= 4.5;
        if (galleryTrend === 'new_arrivals') return (item as GalleryItem).year >= 2024;
        if (galleryTrend === 'featured')     return item.rating >= 4.0;
        return true;
      });
    }

    // 9. Galería: rango de precio
    const [minPrice, maxPrice] = galleryPriceRange;
    if (minPrice > 0 || maxPrice < 5000000) {
      data = data.filter(item => {
        if (item.type !== 'gallery') return true;
        return item.price >= minPrice && item.price <= maxPrice;
      });
    }

    // 10. Sitios: servicio
    if (venueService) {
      data = data.filter(item => {
        if (item.type !== 'venue') return true;
        const v = item as Venue;
        return (
          v.category?.toLowerCase().includes(venueService.toLowerCase()) ||
          v.amenities?.some(a => a.toLowerCase().includes(venueService.toLowerCase()))
        );
      });
    }

    // 11. Sitios: capacidad
    if (venueCapacity) {
      data = data.filter(item => {
        if (item.type !== 'venue') return true;
        const cap = (item as Venue).capacity ?? 0;
        if (venueCapacity === 'small')  return cap >= 1   && cap <= 20;
        if (venueCapacity === 'medium') return cap >= 21  && cap <= 50;
        if (venueCapacity === 'large')  return cap >= 51  && cap <= 100;
        if (venueCapacity === 'xlarge') return cap > 100;
        return true;
      });
    }

    // 12. Sitios: ciudad
    if (venueCity) {
      data = data.filter(item => {
        if (item.type !== 'venue') return true;
        return item.location?.toLowerCase().includes(venueCity.toLowerCase());
      });
    }

    // 13. Sitios: rango de precio
    if (venuePrice) {
      data = data.filter(item => {
        if (item.type !== 'venue') return true;
        const p = item.price ?? 0;
        if (venuePrice === 'economic')  return p < 100000;
        if (venuePrice === 'moderate')  return p >= 100000  && p < 500000;
        if (venuePrice === 'high')      return p >= 500000  && p < 1000000;
        if (venuePrice === 'premium')   return p >= 1000000;
        return true;
      });
    }

    // 14. Ordenar / filtrar por precio (artistas + eventos + todos)
    if (sortByPrice) {
      if (sortByPrice === 'free') {
        data = data.filter(item => !item.price || item.price === 0);
      } else {
        data = [...data].sort((a, b) =>
          sortByPrice === 'price_asc'
            ? (a.price ?? 0) - (b.price ?? 0)
            : (b.price ?? 0) - (a.price ?? 0),
        );
      }
    }

    return data;
  }, [
    savedFilter, artists, events, venues, gallery, searchQuery,
    selectedProfession, sortByPrice,
    eventCategory, eventCity,
    galleryCategory, galleryStyle, galleryTrend, galleryPriceRange,
    venueService, venueCapacity, venueCity, venuePrice,
  ]);

  // ── Render Helpers ────────────────────────────────────────────────────────
  const renderItem = useCallback(({ item }: { item: ExploreCard; index: number }) => {
    if (viewMode === 'grid') {
      return (
        <View style={{ width: GRID_CARD_WIDTH, marginBottom: COLUMN_GAP }}>
          {item.type === 'artist' ? (
            <ArtistCard
              artist={item as Artist}
              onPress={() => setDetailItem(item)}
              onToggleFavorite={() => {}}
              onAddToProject={() => setAddToProjectItem(item)}
            />
          ) : (
            <EventCard
              event={item as Event}
              onPress={() => setDetailItem(item)}
              onToggleFavorite={() => {}}
              onAddToProject={() => setAddToProjectItem(item)}
            />
          )}
        </View>
      );
    }

    // Renderizado en Lista
    switch (item.type) {
      case 'artist': return <View style={localStyles.listItemWrapper}><ArtistCardList artist={item as Artist} onPress={() => setDetailItem(item)} onAddToProject={() => setAddToProjectItem(item)} /></View>;
      case 'event': return <View style={localStyles.listItemWrapper}><EventCardList event={item as Event} onPress={() => setDetailItem(item)} onAddToProject={() => setAddToProjectItem(item)} /></View>;
      case 'venue': return <View style={localStyles.listItemWrapper}><VenueCardList venue={item as Venue} onPress={() => setDetailItem(item)} /></View>;
      case 'gallery': return <View style={localStyles.listItemWrapper}><GalleryCardList item={item as GalleryItem} onPress={() => setDetailItem(item)} /></View>;
      default: return null;
    }
  }, [viewMode, isDark]);


  const SavedTabHeader = useCallback(() => (
    <View>
      <FavoritesHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        savedCount={filteredData.length}
        projectsCount={projects.length}
        inspirationCount={0}
      />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={localStyles.filterScroll}>
        {(['todos', 'artists', 'events', 'venues', 'gallery'] as const).map(type => {
          const isActive = savedFilter === type;
          const meta = PILL_META[type];

          return (
            <TouchableOpacity key={type} onPress={() => setSavedFilter(type)} activeOpacity={0.8}>
              {isActive ? (
                <LinearGradient
                  colors={['#7c3aed', '#2563eb']}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={localStyles.pillActive}
                >
                  <Ionicons name={meta.icon as any} size={14} color="#fff" />
                  <Text style={localStyles.pillLabelActive}>{meta.label}</Text>
                </LinearGradient>
              ) : isDark ? (
                <View style={localStyles.pillInactiveDark}>
                  <Ionicons name={meta.icon as any} size={14} color="#a78bfa" />
                  <Text style={localStyles.pillLabelDark}>{meta.label}</Text>
                </View>
              ) : (
                <View style={localStyles.pillShadow}>
                  <View style={localStyles.pillInactive}>
                    <Ionicons name={meta.icon as any} size={14} color="#7c3aed" />
                    <Text style={localStyles.pillLabel}>{meta.label}</Text>
                  </View>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <View style={localStyles.searchRow}>
        <View style={[localStyles.searchBar, isDark && localStyles.searchBarDark]}>
          <Ionicons name="search" size={18} color={isDark ? '#9CA3AF' : '#6B7280'} />
          <TextInput
            placeholder="Buscar..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={isDark ? '#4B5563' : '#9CA3AF'}
            style={[localStyles.searchInput, isDark && { color: '#FFF' }]}
          />
        </View>
        <View style={[localStyles.viewToggleGroup, isDark && localStyles.viewToggleGroupDark]}>
          <TouchableOpacity
            style={[localStyles.viewToggleBtn, viewMode === 'grid' && localStyles.viewToggleBtnActive]}
            onPress={() => setViewMode('grid')}
          >
            <Ionicons name="grid" size={17} color={viewMode === 'grid' ? '#FFF' : colors.primary} />
          </TouchableOpacity>
          <View style={[localStyles.viewToggleDivider, isDark && localStyles.viewToggleDividerDark]} />
          <TouchableOpacity
            style={[localStyles.viewToggleBtn, viewMode === 'list' && localStyles.viewToggleBtnActive]}
            onPress={() => setViewMode('list')}
          >
            <Ionicons name="list" size={17} color={viewMode === 'list' ? '#FFF' : colors.primary} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[localStyles.iconBtn, showFilters && { backgroundColor: colors.primary }, isDark && !showFilters && { backgroundColor: '#150d27', borderColor: '#2d1f4d' }]}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Ionicons name="options-outline" size={20} color={showFilters ? '#FFF' : '#6B7280'} />
        </TouchableOpacity>
      </View>
      <Text style={localStyles.counterText}>
        {filteredData.length} {filteredData.length === 1 ? 'favorito' : 'favoritos'}
      </Text>
    </View>
  ), [activeTab, savedFilter, searchQuery, viewMode, showFilters, isDark, filteredData.length, projects.length]);

  // Renderiza el modal de filtros correcto según el tab activo
  const renderFilterModal = () => {
    if (savedFilter === 'events') {
      return (
        <EventFilterPanel
          showFilters={showFilters}
          customDate={customDate}
          selectedCategory={eventCategory}
          sortByPrice={sortByPrice}
          onCustomDateChange={setCustomDate}
          onCategoryChange={setEventCategory}
          onSortByPrice={setSortByPrice}
          onModalityChange={setEventModality}
          onCityChange={setEventCity}
          onClearFilters={clearFilters}
          onClose={() => setShowFilters(false)}
        />
      );
    }
    if (savedFilter === 'gallery') {
      return (
        <GalleryFilterPanel
          showFilters={showFilters}
          selectedCategory={galleryCategory}
          selectedBookType={galleryBookType}
          selectedStyle={galleryStyle}
          selectedTrend={galleryTrend}
          priceRange={galleryPriceRange}
          onCategoryChange={setGalleryCategory}
          onBookTypeChange={setGalleryBookType}
          onStyleChange={setGalleryStyle}
          onTrendChange={setGalleryTrend}
          onPriceRangeChange={setGalleryPriceRange}
          onClearFilters={clearFilters}
          onClose={() => setShowFilters(false)}
        />
      );
    }
    if (savedFilter === 'venues') {
      return (
        <Modal visible={showFilters} animationType="slide" transparent onRequestClose={() => setShowFilters(false)}>
          <View style={localStyles.filterModalOverlay}>
            <View style={[localStyles.filterModalSheet, isDark && { backgroundColor: '#0a0618', borderColor: 'rgba(139,92,246,0.22)' }]}>
              <SiteFilterPanel
                showFilters={true}
                selectedService={venueService}
                selectedCapacity={venueCapacity}
                selectedCity={venueCity}
                selectedPrice={venuePrice}
                onServiceChange={setVenueService}
                onCapacityChange={setVenueCapacity}
                onCityChange={setVenueCity}
                onPriceChange={setVenuePrice}
                onClearFilters={clearFilters}
                onClose={() => setShowFilters(false)}
              />
            </View>
          </View>
        </Modal>
      );
    }
    // Default: artistas / todos
    return (
      <FilterPanel
        showFilters={showFilters}
        selectedFilter={selectedDateFilter}
        customDate={customDate}
        selectedProfession={selectedProfession}
        sortByPrice={sortByPrice}
        onFilterChange={setSelectedDateFilter}
        onCustomDateChange={setCustomDate}
        onProfessionChange={setSelectedProfession}
        onSortByPrice={setSortByPrice}
        onClearFilters={clearFilters}
        onClose={() => setShowFilters(false)}
      />
    );
  };

  const ListFooter = () => (
    activeTab === 'saved' && filteredData.length > 0 ? (
      <View style={localStyles.promoContainer}>
        <View style={[localStyles.promoCard, isDark && localStyles.promoCardDark]}>
          <Text style={[localStyles.promoTitle, isDark && { color: '#FFF' }]}>✨ Crea un Proyecto</Text>
          <Text style={localStyles.promoSub}>Organiza tus artistas para tu próximo evento</Text>
          <TouchableOpacity style={localStyles.promoBtn} onPress={() => setActiveTab('projects')}>
            <Ionicons name="folder-open-outline" size={15} color="#fff" />
            <Text style={localStyles.promoBtnText}>Empezar ahora</Text>
            <Ionicons name="arrow-forward" size={14} color="rgba(255,255,255,0.75)" />
          </TouchableOpacity>
        </View>
      </View>
    ) : null
  );

  if (favoritesLoading) {
    return (
      <View style={[localStyles.screen, isDark && { backgroundColor: '#0a0618' }]}>
        <TopBar title="Favoritos" topInset={insets.top} />
        <ActivityIndicator style={{ flex: 1 }} color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[localStyles.screen, isDark && { backgroundColor: '#0a0618' }]}>
      <TopBar title="Favoritos" topInset={insets.top} />
      
      {activeTab === 'saved' ? (
        <FlatList
          key={viewMode}
          data={filteredData}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          numColumns={viewMode === 'grid' ? 2 : 1}
          ListHeaderComponent={SavedTabHeader}
          ListFooterComponent={ListFooter}
          columnWrapperStyle={viewMode === 'grid' ? { justifyContent: 'space-between', paddingHorizontal: H_PADDING } : null}
          contentContainerStyle={{ paddingBottom: insets.bottom + 90, flexGrow: 1 }}
          ListEmptyComponent={
            <View style={localStyles.emptyContainer}>
               <Ionicons name="heart-dislike-outline" size={50} color="#CCC" />
               <Text style={localStyles.emptyText}>No se encontraron resultados</Text>
            </View>
          }
        />
      ) : activeTab === 'projects' ? (
        <View style={{ flex: 1 }}>
          <FavoritesHeader activeTab={activeTab} onTabChange={setActiveTab} savedCount={filteredData.length} projectsCount={projects.length} inspirationCount={0} />
          <View style={{ flex: 1, backgroundColor: 'transparent' }}>
            <ProjectsTab />
          </View>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <FavoritesHeader activeTab={activeTab} onTabChange={setActiveTab} savedCount={filteredData.length} projectsCount={projects.length} inspirationCount={0} />
          <InspirationTab />
        </View>
      )}

      {/* Modal Detalle */}
      <Modal visible={!!detailItem} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setDetailItem(null)}>
        <View style={{ flex: 1, backgroundColor: isDark ? '#0a0618' : '#FFF' }}>
            <TouchableOpacity onPress={() => setDetailItem(null)} style={[localStyles.closeModal, { top: insets.top + 10 }]}>
                <Ionicons name="close" size={24} color={isDark ? '#FFF' : '#000'} />
            </TouchableOpacity>
            <ScrollView contentContainerStyle={{ paddingTop: 60 }}>
                {detailItem?.type === 'artist' && <ArtistDetails artist={detailItem as Artist} />}
                {detailItem?.type === 'event' && <EventDetails event={detailItem as Event} />}
            </ScrollView>
        </View>
      </Modal>

      <AddToProjectModal visible={!!addToProjectItem} item={addToProjectItem} onClose={() => setAddToProjectItem(null)} />

      {/* Modales de filtros */}
      {renderFilterModal()}
    </View>
  );
}

const localStyles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F9FAFB' },
  filterScroll: { paddingHorizontal: 16, gap: 10, paddingVertical: 10 },
  pillActive: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 10, gap: 8,
    borderRadius: 50,
    elevation: 4, shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.25, shadowRadius: 6,
  },
  pillShadow: {
    borderRadius: 50,
    shadowColor: '#7c3aed', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18, shadowRadius: 8, elevation: 3,
  },
  pillInactive: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 10, gap: 8,
    borderRadius: 50,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.75)',
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  pillLabel: { fontSize: 13, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#000' },
  pillInactiveDark: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 10, gap: 8,
    borderRadius: 50,
    backgroundColor: '#0a0618',
    borderWidth: 1, borderColor: 'rgba(139,92,246,0.25)',
  },
  pillLabelDark: { fontSize: 13, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#fff' },
  pillLabelActive: { fontSize: 13, fontFamily: 'PlusJakartaSans_700Bold', color: '#fff' },
  listItemWrapper: { paddingHorizontal: H_PADDING },
  searchRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 10, marginBottom: 12, alignItems: 'center' },
  viewToggleGroup: { flexDirection: 'row', height: 45, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#FFF', overflow: 'hidden' },
  viewToggleGroupDark: { backgroundColor: '#150d27', borderColor: '#2d1f4d' },
  viewToggleBtn: { width: 38, alignItems: 'center', justifyContent: 'center' },
  viewToggleBtnActive: { backgroundColor: colors.primary },
  viewToggleDivider: { width: 1, backgroundColor: '#E5E7EB' },
  viewToggleDividerDark: { backgroundColor: '#2d1f4d' },
  searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 12, paddingHorizontal: 12, height: 45, borderWidth: 1, borderColor: '#E5E7EB' },
  searchBarDark: { backgroundColor: '#150d27', borderColor: '#2d1f4d' },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 14 },
  iconBtn: { width: 45, height: 45, borderRadius: 12, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB' },
  counterText: { paddingHorizontal: 16, fontSize: 12, color: '#6B7280', marginBottom: 10, fontWeight: '500' },
  filterPanel: { marginHorizontal: 16, padding: 16, backgroundColor: '#FFF', borderRadius: 16, marginBottom: 15, elevation: 2 },
  filterPanelDark: { backgroundColor: '#1a0f2e' },
  filterTitle: { fontWeight: 'bold', marginBottom: 10 },
  professionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  profChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, backgroundColor: '#F3F4F6' },
  profChipActive: { backgroundColor: colors.primary },
  profText: { fontSize: 11, color: '#4B5563' },
  promoContainer: { paddingHorizontal: 16, marginTop: 20 },
  promoCard: { padding: 20, backgroundColor: '#EDE9FE', borderRadius: 20, alignItems: 'center' },
  promoCardDark: { backgroundColor: '#1e133a' },
  promoTitle: { fontSize: 16, fontWeight: 'bold', color: '#4C1D95' },
  promoSub: { fontSize: 12, color: '#6D28D9', textAlign: 'center', marginTop: 4 },
  promoBtn: { marginTop: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.10)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.28)' },
  promoBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 13 },
  emptyContainer: { alignItems: 'center', marginTop: 50 },
  emptyText: { marginTop: 10, color: '#9CA3AF' },
  closeModal: { position: 'absolute', right: 16, zIndex: 10, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.05)', justifyContent: 'center', alignItems: 'center' },
  filterModalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-end' },
  filterModalSheet: { maxHeight: '85%', backgroundColor: '#F9FAFB', borderTopLeftRadius: 24, borderTopRightRadius: 24, borderTopWidth: 1, borderLeftWidth: 1, borderRightWidth: 1, borderColor: 'rgba(139,92,246,0.2)', overflow: 'hidden' },
});