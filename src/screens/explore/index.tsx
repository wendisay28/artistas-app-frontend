// src/screens/explore/index.tsx — Orquestador de pantalla (solo JSX + estilos)
import React from 'react';
import {
  View, Text, StyleSheet, Pressable,
  Platform, ActivityIndicator, ScrollView, TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors } from '../../constants/colors';
import SwipeCard, { CARD_WIDTH, CARD_HEIGHT } from '../../components/explore/cards/SwipeCard';
import ArtistCardContent  from '../../components/explore/cards/ArtistCardContent';
import EventCardContent   from '../../components/explore/cards/EventCardContent';
import GalleryCardContent from '../../components/explore/cards/GalleryCardContent';
import VenueCardContent   from '../../components/explore/cards/VenueCardContent';

import ArtistDetails  from '../../components/explore/details/ArtistDetails';
import EventDetails   from '../../components/explore/details/EventDetails';
import GalleryDetails from '../../components/explore/details/GalleryDetails';
import VenueDetails   from '../../components/explore/details/VenueDetails';

import UnifiedFiltersPanel from './components/shared/UnifiedFiltersPanel';
import HireModal           from '../../components/modals/HireModal';
import { ComingSoonSection } from '../../components/shared/ComingSoonSection';

import type { Artist, Event, Venue, GalleryItem, ExploreCard, CategoryId } from '../../types/explore';
import { useExploreScreen } from './useExploreScreen';

// ── Labels e íconos de categoría ──────────────────────────────────────────────
const CATEGORY_LABELS: Record<CategoryId, string> = {
  artists: 'Artistas', events: 'Eventos', venues: 'Salas', gallery: 'Galería',
};

// ── Pantalla ──────────────────────────────────────────────────────────────────
export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const {
    selectedCategory, stack, currentIndex,
    showFilters, setShowFilters,
    showSearch, setShowSearch,
    filters, setFilters,
    isLoading, error,
    hireModalArtist, setHireModalArtist,
    artistFullData, connectedIds,
    scrollRef,
    topCard,
    handleCategoryChange,
    handleNext, handlePrev, handleConnect,
    handleResetFilters, handleReset, loadCategoryData,
  } = useExploreScreen();

  const webTop    = Platform.OS === 'web' ? 67 : 0;
  const webBottom = Platform.OS === 'web' ? 34 : 0;


  // ── Render de tarjeta ───────────────────────────────────────────────────────
  const renderCardContent = (card: ExploreCard) => {
    switch (card.type) {
      case 'artist':  return (
        <ArtistCardContent
          artist={card as Artist}
          isFollowing={connectedIds.has(card.id)}
          onFollow={handleConnect}
        />
      );
      case 'event':   return <EventCardContent   event={card as Event} />;
      case 'gallery': return <GalleryCardContent item={card as GalleryItem} />;
      case 'venue':   return <VenueCardContent   venue={card as Venue} />;
      default:        return null;
    }
  };

  const renderDetails = (card: ExploreCard) => {
    switch (card.type) {
      case 'artist': {
        const c = card as Artist;
        return (
          <ArtistDetails
            artist={{
              ...c,
              description:    artistFullData?.description ?? c.description ?? '',
              services:       artistFullData?.services?.map(s => s.name) ?? [],
              servicesData:   artistFullData?.services ?? [],
              workExperience: artistFullData?.workExperience ?? [],
              education:      artistFullData?.education ?? [],
            }}
            onHire={() => setHireModalArtist(c)}
            onMessage={() => {}}
            onShare={() => {}}
            socialLinks={artistFullData?.socialMedia ?? c.socialLinks}
          />
        );
      }
      case 'event':
        return <EventDetails event={card as Event} onBuyTicket={() => {}} onShare={() => {}} onViewDetails={() => {}} />;
      case 'gallery':
        return <GalleryDetails item={card as GalleryItem} onBuy={() => {}} onContact={() => {}} onShare={() => {}} />;
      case 'venue':
        return <VenueDetails venue={card as Venue} onReserve={() => {}} onContact={() => {}} onShare={() => {}} />;
    }
  };

  // ── JSX ─────────────────────────────────────────────────────────────────────
  return (
    <View style={s.root}>

      {/* ══ HEADER ══ */}
      <View style={[s.header, { paddingTop: (insets.top || webTop) + 12 }]}>
        {showSearch ? (
          /* Modo búsqueda */
          <>
            <Pressable
              onPress={() => { setShowSearch(false); setFilters(prev => ({ ...prev, query: '' })); }}
              style={({ pressed }) => [s.backBtn, pressed && { opacity: 0.8 }]}
            >
              <Ionicons name="close-outline" size={24} color={colors.text} />
            </Pressable>
            <View style={s.searchContainer}>
              <Ionicons name="search-outline" size={16} color={colors.textSecondary} />
              <TextInput
                autoFocus
                placeholder="Buscar artista..."
                placeholderTextColor={colors.textSecondary}
                value={filters.query}
                onChangeText={v => setFilters(prev => ({ ...prev, query: v }))}
                style={s.searchInput}
                returnKeyType="search"
              />
              {filters.query.length > 0 && (
                <Pressable onPress={() => setFilters(prev => ({ ...prev, query: '' }))} style={s.clearBtn}>
                  <Ionicons name="close-circle" size={16} color={colors.textSecondary} />
                </Pressable>
              )}
            </View>
          </>
        ) : (
          /* Modo normal */
          <>
            {/* Izquierda: filtros */}
            <Pressable
              onPress={() => { if (Platform.OS !== 'web') Haptics.selectionAsync(); setShowFilters(p => !p); }}
              style={({ pressed }) => [s.actionBtn, showFilters && s.actionBtnActive, pressed && { opacity: 0.7 }]}
            >
              <Ionicons name="options-outline" size={16} color={showFilters ? colors.primary : colors.text} />
            </Pressable>

            {/* Centro: cápsula de categorías */}
            <View style={s.tabCapsule}>
              {(['artists', 'events', 'venues', 'gallery'] as CategoryId[]).map(cat => (
                <Pressable
                  key={cat}
                  onPress={() => { if (Platform.OS !== 'web') Haptics.selectionAsync(); handleCategoryChange(cat); }}
                  style={[s.tabItem, selectedCategory === cat && s.tabItemActive]}
                >
                  <Text style={[s.tabText, selectedCategory === cat && s.tabTextActive]}>
                    {CATEGORY_LABELS[cat]}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Derecha: buscar */}
            <Pressable
              onPress={() => { if (Platform.OS !== 'web') Haptics.selectionAsync(); setShowSearch(true); setShowFilters(false); }}
              style={({ pressed }) => [s.actionBtn, pressed && { opacity: 0.7 }]}
            >
              <Ionicons name="search-outline" size={16} color={colors.text} />
            </Pressable>
          </>
        )}
      </View>

      {/* ══ FILTER PANEL OVERLAY ══ */}
      {showFilters && (
        <View style={s.filtersOverlay}>
          <Pressable style={s.filtersBackdrop} onPress={() => setShowFilters(false)} />
          <View style={[s.filtersSheet, { top: (insets.top || webTop) + 58 }]}>
            <UnifiedFiltersPanel
              isOpen={showFilters}
              onToggle={() => setShowFilters(false)}
              category={selectedCategory}
              distance={filters.distance}            setDistance={v => setFilters(p => ({ ...p, distance: v }))}
              price={filters.price}                 setPrice={v => setFilters(p => ({ ...p, price: v }))}
              priceMin={filters.priceMin}           setPriceMin={v => setFilters(p => ({ ...p, priceMin: v }))}
              priceMax={filters.priceMax}           setPriceMax={v => setFilters(p => ({ ...p, priceMax: v }))}
              selectedDate={filters.selectedDate}   setSelectedDate={d => setFilters(p => ({ ...p, selectedDate: d }))}
              onResetFilters={handleResetFilters}
              categoryFilter={filters.categoryFilter}         setCategoryFilter={v => setFilters(p => ({ ...p, categoryFilter: v }))}
              subCategory={filters.subCategory}               setSubCategory={v => setFilters(p => ({ ...p, subCategory: v }))}
              selectedRole={filters.selectedRole}             setSelectedRole={v => setFilters(p => ({ ...p, selectedRole: v }))}
              selectedSpecialization={filters.selectedSpecialization} setSelectedSpecialization={v => setFilters(p => ({ ...p, selectedSpecialization: v }))}
              selectedTads={filters.selectedTads}             setSelectedTads={(v: string[]) => setFilters(p => ({ ...p, selectedTads: v }))}
              selectedStats={filters.selectedStats}           setSelectedStats={(v: Record<string, any>) => setFilters(p => ({ ...p, selectedStats: v }))}
              priceType={filters.priceType}                   setPriceType={v => setFilters(p => ({ ...p, priceType: v }))}
              format={filters.format}                         setFormat={v => setFilters(p => ({ ...p, format: v }))}
              sortBy={filters.sortBy}                         setSortBy={v => setFilters(p => ({ ...p, sortBy: v }))}
              transactionTypes={filters.transactionTypes}     setTransactionTypes={(v: string[]) => setFilters(p => ({ ...p, transactionTypes: v }))}
              conditions={filters.conditions}                 setConditions={(v: string[]) => setFilters(p => ({ ...p, conditions: v }))}
            />
          </View>
        </View>
      )}

      {/* ══ SCROLL ══ */}
      <ScrollView
        ref={scrollRef}
        style={s.scroll}
        contentContainerStyle={[s.scrollContent, { paddingBottom: (insets.bottom || webBottom) + 96 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ height: (insets.top || webTop) + 60 }} />

        {/* ── Tarjeta actual ─────────────────────────────────────────────────── */}
        <View style={s.cardWrapper}>
          {/* Ver más — overlay en borde inferior de la tarjeta */}
          {topCard && !isLoading && !error && stack.length > 0 && (
            <Pressable
              onPress={() => scrollRef.current?.scrollTo({ y: CARD_HEIGHT + 80, animated: true })}
              style={({ pressed }) => [s.verMasBtn, pressed && { opacity: 0.7 }]}
            >
              <Text style={s.verMasText}>Ver más</Text>
              <Ionicons name="chevron-down-outline" size={13} color={colors.textSecondary} />
            </Pressable>
          )}
          {isLoading ? (
            <View style={s.centerState}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={s.loadingText}>Cargando...</Text>
            </View>
          ) : error ? (
            <View style={s.centerState}>
              <Ionicons name="alert-circle-outline" size={52} color={colors.primary} />
              <Text style={s.stateTitle}>Error al cargar</Text>
              <Text style={s.stateSub}>{error}</Text>
              <Pressable onPress={() => loadCategoryData(selectedCategory)} style={({ pressed }) => [s.resetBtn, pressed && { opacity: 0.85 }]}>
                <Ionicons name="refresh" size={16} color="#fff" />
                <Text style={s.resetText}>Reintentar</Text>
              </Pressable>
            </View>
          ) : stack.length === 0 ? (
            <View style={s.centerState}>
              {(selectedCategory === 'venues' || selectedCategory === 'gallery') ? (
                <ComingSoonSection
                  title={selectedCategory === 'venues' ? 'Salas y espacios' : 'Galería de arte'}
                  subtitle="Estamos construyendo algo nuevo para ti"
                />
              ) : (
                <>
                  <Ionicons name="albums-outline" size={52} color={colors.border} />
                  <Text style={s.stateTitle}>Has visto todo</Text>
                  <Text style={s.stateSub}>Vuelve pronto o cambia de categoría</Text>
                  <Pressable onPress={handleReset} style={({ pressed }) => [s.resetBtn, pressed && { opacity: 0.85 }]}>
                    <Ionicons name="refresh" size={16} color="#fff" />
                    <Text style={s.resetText}>Ver de nuevo</Text>
                  </Pressable>
                </>
              )}
            </View>
          ) : topCard ? (
            <SwipeCard
              key={topCard.id}
              card={topCard}
              zIndex={1}
              onDismiss={(_, dir) => dir === 'like' ? handleNext() : handlePrev()}
            >
              {renderCardContent(topCard)}
            </SwipeCard>
          ) : null}
        </View>


        {/* Detalles del artista/evento/etc */}
        {topCard && <View style={s.detailsWrapper}>{renderDetails(topCard)}</View>}
      </ScrollView>

      {hireModalArtist && (
        <HireModal visible={!!hireModalArtist} artist={hireModalArtist} onClose={() => setHireModalArtist(null)} />
      )}
    </View>
  );
}

// ── Estilos ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },

  header: {
    position: 'absolute', top: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingBottom: 12,
    zIndex: 50,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 3,
  },

  // Cápsula de tabs de categoría
  tabCapsule: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.06)',
    borderRadius: 22,
    padding: 3,
    marginHorizontal: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    borderRadius: 19,
  },
  tabItemActive: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  tabText: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: '#fff',
  },

  actionBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: colors.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 3, elevation: 2,
  },
  actionBtnActive: { backgroundColor: colors.primary + '08', borderColor: colors.primary + '30' },

  backBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  searchContainer: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8,
    borderWidth: 1, borderColor: colors.border, marginHorizontal: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 3, elevation: 2,
  },
  searchInput: { flex: 1, fontSize: 15, fontFamily: 'PlusJakartaSans_400Regular', color: colors.text, padding: 0 },
  clearBtn: { padding: 2 },

  filtersOverlay:  { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 45 },
  filtersBackdrop: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.25)' },
  filtersSheet:    { position: 'absolute', left: 12, right: 12, maxHeight: '75%' },

  scroll:        { flex: 1 },
  scrollContent: { alignItems: 'center' },

  cardWrapper: { width: CARD_WIDTH, height: CARD_HEIGHT, marginBottom: 42 },


  centerState: {
    width: CARD_WIDTH, height: CARD_HEIGHT,
    alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: colors.background,
    borderRadius: 24, borderWidth: 1, borderColor: colors.border,
  },
  stateTitle:  { fontSize: 18, fontFamily: 'PlusJakartaSans_700Bold', color: colors.text },
  stateSub:    { fontSize: 13, fontFamily: 'PlusJakartaSans_400Regular', color: colors.textSecondary, textAlign: 'center', paddingHorizontal: 32 },
  loadingText: { fontSize: 16, fontFamily: 'PlusJakartaSans_500Medium', color: colors.text, marginTop: 8 },

  resetBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 8,
    backgroundColor: colors.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 14,
    shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  resetText: { fontSize: 14, fontFamily: 'PlusJakartaSans_700Bold', color: '#fff' },

  verMasBtn: {
    position: 'absolute',
    bottom: -26,
    alignSelf: 'center',
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingVertical: 5, paddingHorizontal: 14,
    zIndex: 10,
  },
  verMasText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: colors.textSecondary,
  },

  detailsWrapper: { width: CARD_WIDTH, paddingBottom: 16 },
});
