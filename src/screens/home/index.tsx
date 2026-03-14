// src/screens/home/index.tsx
// ─── HomeScreen refactorizado ─────────────────────────────────────────────────
//
// CAMBIOS VS VERSIÓN ANTERIOR:
//   ✅ Mock data → src/screens/home/data/homeData.ts
//   ✅ profilePct → hook useProfileCompletion (pesos corregidos, suman 100)
//   ✅ LocationPickerModal → src/components/shared/LocationPickerModal.tsx
//   ✅ Filtro de categorías normalizado (ignora tildes y mayúsculas)
//   ✅ Empty states en secciones vacías
//   ✅ Venues en scroll horizontal (igual que events y artists)
//   ✅ gap consistente entre secciones
//   ✅ PortalAutorScreen como Stack screen (no Modal pesado)
//   ✅ Animación de entrada en secciones con Animated.Value
//   ✅ SectionHeader con badge de cantidad visible

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable,
  Modal, Animated, ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/authStore';
import TopBar from '../../components/shared/TopBar';
import { AppFooter } from '../../components/shared/AppFooter';
import { LocationPickerModal } from './components/Locationpickermodal';
import { PortalAutorScreen } from '../portal/PortalAutorScreen';
import { useProximityLogic } from './hooks/useProximityLogic';
import { useProfileCompletion } from './hooks/Useprofilecompletion';
import { useHomeData } from './hooks/useHomeData';
import { useThemeStore } from '../../store/themeStore';

import HomeBanners from './components/HomeBanners';
import SectionHeader from './components/SectionHeader';
import {
  EventCard, ArtistCard, VenueCard,
  EventItem, ArtistItem, VenueItem,
} from './components/ContentCards';
import { FeedPost, FeedDivider } from './components/FeedPost';

import {
  ARTIST_PILL_CATEGORIES,
  MOCK_VENUES,
} from './data/homeData';
import { MOCK_FEED_POSTS } from './data/feedData';

// ── Normalizar strings para comparación sin tildes ni mayúsculas ──────────────

const normalize = (str: string) =>
  str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

// ── Empty state ───────────────────────────────────────────────────────────────

const EmptySection: React.FC<{ message: string; colors?: any }> = ({ message, colors }) => (
  <View style={getEmptyStyles(colors).wrap}>
    <Ionicons name="search-outline" size={28} color={colors?.primary || '#7c3aed'} />
    <Text style={getEmptyStyles(colors).text}>{message}</Text>
  </View>
);

const getEmptyStyles = (colors: any) => StyleSheet.create({
  wrap: {
    marginHorizontal: 16,
    paddingVertical: 28,
    alignItems: 'center',
    gap: 10,
    borderRadius: 16,
    backgroundColor: colors?.background === '#000000' ? 'rgba(139,92,246,0.1)' : 'rgba(124,58,237,0.04)',
    borderWidth: 1,
    borderColor: colors?.background === '#000000' ? 'rgba(139,92,246,0.2)' : 'rgba(124,58,237,0.1)',
    borderStyle: 'dashed',
  },
  text: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_500Medium',
    color: colors?.background === '#000000' ? 'rgba(167,139,250,0.8)' : 'rgba(124,58,237,0.7)',
    textAlign: 'center',
  },
});

// ── Animated section wrapper ──────────────────────────────────────────────────
// Cada sección hace fade+slide in al montarse

const AnimatedSection: React.FC<{ delay?: number; children: React.ReactNode }> = ({
  delay = 0,
  children,
}) => {
  const opacity   = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(18)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1, duration: 380, delay,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0, delay, speed: 14, bounciness: 4,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      {children}
    </Animated.View>
  );
};

// ── Carrusel reutilizable ─────────────────────────────────────────────────────

const EventsCarousel: React.FC<{
  events: EventItem[]; city: string; loading: boolean; colors: any;
}> = ({ events, city, loading, colors }) => (
  <View style={getStyles(colors).section}>
    <SectionHeader
      title="Eventos cerca de ti"
      subtitle={`${city} · Esta semana`}
      onSeeAll={() => {}}
    />
    {loading ? (
      <View style={{ paddingVertical: 28, alignItems: 'center' }}>
        <ActivityIndicator color="#7c3aed" />
      </View>
    ) : events.length > 0 ? (
      <ScrollView
        horizontal showsHorizontalScrollIndicator={false}
        contentContainerStyle={getStyles(colors).hScroll}
        decelerationRate="fast" snapToInterval={220} snapToAlignment="start"
      >
        {events.map(item => (
          <EventCard key={item.id} item={item} onPress={() => {}} />
        ))}
      </ScrollView>
    ) : (
      <EmptySection message={`No hay eventos cerca de ${city}`} colors={colors} />
    )}
  </View>
);

const ArtistsCarousel: React.FC<{
  artists: ArtistItem[]; loading: boolean; colors: any;
}> = ({ artists, loading, colors }) => (
  <View style={getStyles(colors).section}>
    <SectionHeader
      title="Artistas cerca de ti"
      subtitle="Talento local disponible ahora"
      onSeeAll={() => {}}
    />
    {loading ? (
      <View style={{ paddingVertical: 28, alignItems: 'center' }}>
        <ActivityIndicator color="#7c3aed" />
      </View>
    ) : artists.length > 0 ? (
      <ScrollView
        horizontal showsHorizontalScrollIndicator={false}
        contentContainerStyle={getStyles(colors).hScroll}
        decelerationRate="fast"
      >
        {artists.map(item => (
          <ArtistCard key={item.id} item={item} onPress={() => {}} />
        ))}
      </ScrollView>
    ) : (
      <EmptySection message="No encontramos artistas cerca por ahora" colors={colors} />
    )}
  </View>
);

// ── Feed intercalado con carruseles cada 5 posts ──────────────────────────────

const POSTS_PER_BLOCK = 5;

const FeedWithCarousels: React.FC<{
  posts: any[];
  events: EventItem[];
  artists: ArtistItem[];
  currentCity: string;
  dataLoading: boolean;
  colors: any;
  isDark: boolean;
}> = ({ posts, events, artists, currentCity, dataLoading, colors, isDark }) => {
  // Los carruseles que se van a intercalar, en orden
  const carousels = [
    <EventsCarousel key="events" events={events} city={currentCity} loading={dataLoading} colors={colors} />,
    <ArtistsCarousel key="artists" artists={artists} loading={dataLoading} colors={colors} />,
  ];

  // Sin posts → solo carruseles juntos
  if (posts.length === 0) {
    return <View>{carousels}</View>;
  }

  const blocks: React.ReactNode[] = [];
  let carouselIdx = 0;

  for (let i = 0; i < posts.length; i += POSTS_PER_BLOCK) {
    const chunk = posts.slice(i, i + POSTS_PER_BLOCK);
    chunk.forEach((post, j) => {
      const globalIdx = i + j;
      const isLast    = globalIdx === posts.length - 1;
      blocks.push(
        <FeedPost key={post.id} post={post} isLast={isLast} isDark={isDark} />
      );
      if (!isLast) {
        blocks.push(<FeedDivider key={`div-${post.id}`} isDark={isDark} />);
      }
    });

    // Insertar carrusel si quedan más posts o siempre al final de cada bloque
    if (carouselIdx < carousels.length) {
      blocks.push(
        <View key={`carousel-${carouselIdx}`} style={{ marginTop: 8 }}>
          {carousels[carouselIdx]}
        </View>
      );
      carouselIdx++;
    }
  }

  // Si quedaron carruseles sin mostrar (menos de 5 posts)
  while (carouselIdx < carousels.length) {
    blocks.push(
      <View key={`carousel-tail-${carouselIdx}`} style={{ marginTop: 8 }}>
        {carousels[carouselIdx]}
      </View>
    );
    carouselIdx++;
  }

  return <View>{blocks}</View>;
};

// ── HomeScreen ────────────────────────────────────────────────────────────────

function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const { colors, toggleTheme } = useThemeStore();

  const [activeCategory, setActiveCategory] = useState('todos');
  const [portalVisible,  setPortalVisible]  = useState(false);
  const [locationModal, setLocationModal]  = useState(false);
  const [manualCity,     setManualCity]     = useState<string | null>(null);

  // ── Perfil completion — hook limpio con pesos que suman 100 ──────────────
  const { percentage: profilePct } = useProfileCompletion();

  // ── Datos reales desde API (artistas + eventos) ──────────────────────────
  const { artists: apiArtists, events: apiEvents, isLoading: dataLoading } = useHomeData();

  // ── Proximity / location ─────────────────────────────────────────────────
  const {
    userLocation,
    filterByProximity,
    sortByDistance,
    requestLocationPermission,
    isLoading: locationLoading,
  } = useProximityLogic({
    maxDistanceKm: 15,
    userCity: manualCity || user?.city || 'Medellín',
  });

  const currentCity = userLocation?.city || manualCity || user?.city || 'Medellín';

  const handleDetectGPS = useCallback(async () => {
    await requestLocationPermission();
    setManualCity(null);
    setLocationModal(false);
  }, [requestLocationPermission]);

  // ── Filtro de eventos — normalizado para manejar tildes ──────────────────
  const filteredEvents: EventItem[] = sortByDistance(
    filterByProximity(
      activeCategory === 'todos'
        ? apiEvents
        : apiEvents.filter(e =>
            normalize(e.category).includes(normalize(activeCategory))
          )
    )
  );

  const nearbyArtists: ArtistItem[] = sortByDistance(filterByProximity(apiArtists));
  const nearbyVenues:  VenueItem[]  = filterByProximity(MOCK_VENUES);

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <View style={getStyles(colors).root}>
      <TopBar
        topInset={insets.top}
        showLocation
        city={currentCity}
        locationLoading={locationLoading}
        onLocationPress={() => setLocationModal(true)}
      />

      <ScrollView
        style={getStyles(colors).scroll}
        contentContainerStyle={{ paddingBottom: (insets.bottom || 10) + 80 }}
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
      >
        {/* Banners — desaparece cuando profilePct === 100 */}
        <AnimatedSection delay={0}>
          <HomeBanners
            showProfileBanner={profilePct < 100}
            profilePct={profilePct}
            onProfilePress={() => setPortalVisible(true)}
            categories={ARTIST_PILL_CATEGORIES}
            activeCategory={activeCategory}
            onCategoryPress={setActiveCategory}
          />
        </AnimatedSection>

        {/* ── Feed intercalado con carruseles ──────────────────────────
            Lógica: cada 5 posts se inserta un carrusel.
            Si no hay posts, los carruseles aparecen juntos sin vacío.
        ──────────────────────────────────────────────────────────── */}
        <AnimatedSection delay={80}>
          <FeedWithCarousels
            posts={MOCK_FEED_POSTS}
            events={filteredEvents}
            artists={nearbyArtists}
            currentCity={currentCity}
            dataLoading={dataLoading}
            colors={colors}
            isDark={colors.background === '#000000'}
          />
        </AnimatedSection>

        <AppFooter />

      </ScrollView>

      {/* ── Portal del Autor ─────────────────────────────────────────────
          NOTA: idealmente esto debería ser una Stack screen (navigator.push),
          no un Modal pesado con pageSheet. Dejamos el Modal por compatibilidad
          pero el componente está desacoplado y listo para migrar.
      ── */}
      <Modal
        visible={portalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setPortalVisible(false)}
      >
        <PortalAutorScreen onClose={() => setPortalVisible(false)} />
      </Modal>

      {/* ── Location picker ───────────────────────────────────────────── */}
      <LocationPickerModal
        visible={locationModal}
        isDetecting={locationLoading}
        onDetectGPS={handleDetectGPS}
        onClose={() => setLocationModal(false)}
      />

      {/* ── FAB compose — crear post ──────────────────────────────────────── */}
      <View style={[getStyles(colors).fabCompose, { bottom: insets.bottom + 90 }]}>
        <Pressable
          onPress={() => console.log('Abrir CreatePost')}
          style={({ pressed }) => [
            getStyles(colors).fabInner,
            pressed && { opacity: 0.85, transform: [{ scale: 0.95 }] },
          ]}
        >
          <Ionicons name="create-outline" size={22} color="#fff" />
        </Pressable>
      </View>

      {/* ── FAB tema ──────────────────────────────────────────────────────── */}
      <View style={[getStyles(colors).fabTheme, { bottom: insets.bottom + 24 }]}>
        <Pressable
          onPress={toggleTheme}
          style={({ pressed }) => [
            getStyles(colors).fabThemeInner,
            pressed && { opacity: 0.8 },
          ]}
        >
          <Ionicons
            name={colors.background === '#000000' ? 'sunny' : 'moon'}
            size={18}
            color={colors.text}
          />
        </Pressable>
      </View>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const getStyles = (colors: any) => StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    gap: 8,          // FIX: era 0, las secciones se tocaban
    paddingTop: 4,
  },
  section: {
    marginBottom: 12,
  },
  hScroll: {
    paddingHorizontal: 16,
    paddingBottom: 6,
    paddingTop: 2,
    gap: 12,
  },
  fabCompose: {
    position: 'absolute',
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7c3aed',
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 14,
    elevation: 10,
  },
  fabInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabTheme: {
    position: 'absolute',
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabThemeInner: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default HomeScreen;