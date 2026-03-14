import React from 'react';
import {
  View, Text, StyleSheet, Pressable,
  Platform, ActivityIndicator, ScrollView, TextInput,
  StatusBar, useColorScheme,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors } from '../../constants/colors';
import { useThemeStore } from '../../store/themeStore';
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

const CATEGORY_LABELS: Record<CategoryId, string> = {
  artists: 'Artistas', events: 'Eventos', venues: 'Salas', gallery: 'Galería',
};

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme(); // Detecta el tema del sistema: 'light' o 'dark'
  const isDarkSystem = colorScheme === 'dark';
  const { isDark, toggleTheme } = useThemeStore();

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

  // 1. Definición de estilos dinámicos según el tema actual
  const themeContainer = isDark ? s.bgDark : s.bgLight;
  const themeText      = isDark ? s.textDark : s.textLight;
  const themeHeader    = isDark ? s.headerDark : s.headerLight;
  const themeCapsule   = isDark ? s.capsuleDark : s.capsuleLight;
  const themeActionBtn = isDark ? s.actionBtnDark : s.actionBtnLight;

  const renderCardContent = (card: ExploreCard) => {
    switch (card.type) {
      case 'artist':  return <ArtistCardContent artist={card as Artist} isFollowing={connectedIds.has(card.id)} onFollow={handleConnect} />;
      case 'event':   return <EventCardContent event={card as Event} />;
      case 'gallery': return <GalleryCardContent item={card as GalleryItem} />;
      case 'venue':   return <VenueCardContent venue={card as Venue} />;
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
              description: artistFullData?.description ?? c.description ?? '',
              services: artistFullData?.services?.map(s => s.name) ?? [],
              servicesData: artistFullData?.services ?? [],
              workExperience: artistFullData?.workExperience ?? [],
              education: artistFullData?.education ?? [],
            }}
            onHire={() => setHireModalArtist(c)}
            onMessage={() => {}}
            onShare={() => {}}
            socialLinks={artistFullData?.socialMedia ?? c.socialLinks}
          />
        );
      }
      case 'event': return <EventDetails event={card as Event} onBuyTicket={() => {}} onShare={() => {}} onViewDetails={() => {}} />;
      case 'gallery': return <GalleryDetails item={card as GalleryItem} onBuy={() => {}} onContact={() => {}} onShare={() => {}} />;
      case 'venue': return <VenueDetails venue={card as Venue} onReserve={() => {}} onContact={() => {}} onShare={() => {}} />;
    }
  };

  return (
    <View style={[s.root, themeContainer]}>
      {/* 2. StatusBar se adapta para que la hora y batería se lean bien en ambos fondos */}
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* ══ HEADER ══ */}
      <View style={[s.header, themeHeader, { paddingTop: (insets.top || webTop) + 8 }]}>
        {showSearch ? (
          <>
            <Pressable onPress={() => { setShowSearch(false); setFilters(prev => ({ ...prev, query: '' })); }} style={s.backBtn}>
              <Ionicons name="close-outline" size={24} color={isDark ? "#FFF" : "#000"} />
            </Pressable>
            <View style={[s.searchContainer, isDark && s.searchContainerDark, themeActionBtn]}>
              <Ionicons name="search-outline" size={16} color={isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)"} />
              <TextInput
                autoFocus
                placeholder="Buscar..."
                placeholderTextColor={isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)"}
                value={filters.query}
                onChangeText={v => setFilters(prev => ({ ...prev, query: v }))}
                style={[s.searchInput, themeText]}
                selectionColor={colors.primary}
              />
            </View>
          </>
        ) : (
          <>
            <Pressable
              onPress={() => { if (Platform.OS !== 'web') Haptics.selectionAsync(); setShowFilters(p => !p); }}
              style={[s.actionBtn, themeActionBtn, showFilters && s.actionBtnActive]}
            >
              <Ionicons name="options-outline" size={16} color={showFilters ? colors.primary : (isDark ? "#FFF" : "#000")} />
            </Pressable>

            {/* CÁPSULA TIPO TINDER/INSTAGRAM */}
            <View style={[s.tabCapsule, themeCapsule]}>
              {(['artists', 'events', 'venues', 'gallery'] as CategoryId[]).map(cat => (
                <Pressable
                  key={cat}
                  onPress={() => { if (Platform.OS !== 'web') Haptics.selectionAsync(); handleCategoryChange(cat); }}
                  style={[s.tabItem, selectedCategory === cat && s.tabItemActive]}
                >
                  <Text style={[
                    s.tabText, 
                    isDark ? s.tabTextDark : s.tabTextLight,
                    selectedCategory === cat && s.tabTextActive
                  ]}>
                    {CATEGORY_LABELS[cat]}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Pressable
              onPress={() => { if (Platform.OS !== 'web') Haptics.selectionAsync(); setShowSearch(true); setShowFilters(false); }}
              style={[s.actionBtn, themeActionBtn]}
            >
              <Ionicons name="search-outline" size={16} color={isDark ? "#FFF" : "#000"} />
            </Pressable>
          </>
        )}
      </View>

      <ScrollView
        ref={scrollRef}
        style={s.scroll}
        contentContainerStyle={[s.scrollContent, { paddingBottom: (insets.bottom || webBottom) + 96 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ height: (insets.top || webTop) + 62 }} />

        <View style={s.cardWrapper}>
          {isLoading ? (
            <View style={s.centerState}><ActivityIndicator size="large" color={colors.primary} /></View>
          ) : stack.length === 0 ? (
            <View style={s.centerState}>
              <Ionicons name="albums-outline" size={48} color={isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"} />
              <Text style={[s.stateTitle, themeText]}>Has visto todo</Text>
            </View>
          ) : topCard ? (
            <SwipeCard key={topCard.id} card={topCard} zIndex={1} onDismiss={(_, dir) => dir === 'like' ? handleNext() : handlePrev()}>
              {renderCardContent(topCard)}
            </SwipeCard>
          ) : null}
        </View>

        {topCard && <View style={s.detailsWrapper}>{renderDetails(topCard)}</View>}
      </ScrollView>

      {hireModalArtist && (
        <HireModal visible={!!hireModalArtist} artist={hireModalArtist} onClose={() => setHireModalArtist(null)} />
      )}

      {/* Botón flotante para cambiar tema (temporal) */}
      <Pressable
        style={[s.themeToggle, isDark ? s.themeToggleDark : s.themeToggleLight]}
        onPress={() => {
          if (Platform.OS !== 'web') Haptics.selectionAsync();
          toggleTheme();
        }}
      >
        <Ionicons 
          name={isDark ? "sunny-outline" : "moon-outline"} 
          size={20} 
          color={isDark ? "#FFF" : "#000"} 
        />
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  
  // 3. Variables de color para los fondos principales
  bgDark: { backgroundColor: '#0a0618' },
  bgLight: { backgroundColor: '#F8F9FA' },
  
  // Variables de color para textos
  textDark: { color: '#FFFFFF' },
  textLight: { color: '#000000' },

  header: {
    position: 'absolute', top: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingBottom: 10, zIndex: 50,
    borderBottomWidth: 1,
  },
  headerDark: { backgroundColor: '#0a0618', borderBottomColor: 'rgba(139,92,246,0.18)' },
  headerLight: { backgroundColor: '#FFFFFF', borderBottomColor: 'rgba(0,0,0,0.05)' },

  tabCapsule: {
    flex: 1, flexDirection: 'row', borderRadius: 20, padding: 3, marginHorizontal: 8, height: 38, alignItems: 'center',
  },
  capsuleDark: { 
    backgroundColor: '#0a0618',
    borderColor: 'rgba(139,92,246,0.25)',
    borderWidth: 1,
  },
  capsuleLight: { backgroundColor: '#E9ECEF' },

  tabItem: { flex: 1, height: '100%', alignItems: 'center', justifyContent: 'center', borderRadius: 17 },
  tabItemActive: { backgroundColor: colors.primary },

  tabText: { fontSize: 10, fontFamily: 'PlusJakartaSans_600SemiBold' },
  tabTextDark: { color: 'rgba(255,255,255,0.4)' },
  tabTextLight: { color: 'rgba(0,0,0,0.5)' },
  tabTextActive: { color: '#FFFFFF' },

  actionBtn: {
    width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', borderWidth: 1,
  },
  actionBtnDark: { 
    backgroundColor: '#0a0618', 
    borderColor: 'rgba(139,92,246,0.25)',
    borderWidth: 1,
  },
  actionBtnLight: { backgroundColor: '#F1F3F5', borderColor: 'rgba(0, 0, 0, 0.05)' },
  actionBtnActive: { backgroundColor: colors.primary + '20', borderColor: colors.primary },

  backBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  searchContainer: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6,
    borderRadius: 18, paddingHorizontal: 12, height: 36, borderWidth: 1, marginHorizontal: 8,
  },
  searchContainerDark: {
    backgroundColor: '#0a0618',
    borderColor: 'rgba(139,92,246,0.25)',
  },
  searchInput: { flex: 1, fontSize: 14, fontFamily: 'PlusJakartaSans_400Regular', padding: 0 },

  scroll: { flex: 1 },
  scrollContent: { alignItems: 'center' },
  cardWrapper: { width: CARD_WIDTH, height: CARD_HEIGHT, marginBottom: 40 },
  centerState: { width: CARD_WIDTH, height: CARD_HEIGHT, alignItems: 'center', justifyContent: 'center', gap: 10 },
  stateTitle: { fontSize: 18, fontFamily: 'PlusJakartaSans_700Bold' },
  detailsWrapper: { width: CARD_WIDTH, paddingBottom: 16 },

  // Botón flotante de tema
  themeToggle: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 100,
  },
  themeToggleLight: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  themeToggleDark: {
    backgroundColor: '#0a0618',
    borderWidth: 1,
    borderColor: 'rgba(139,92,246,0.3)',
  },
});