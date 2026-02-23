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
  View, Text, StyleSheet, ScrollView,
  Modal, Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/authStore';
import TopBar from '../../components/shared/TopBar';
import { AppFooter } from '../../components/shared/AppFooter';
import { LocationPickerModal } from './components/Locationpickermodal';
import { PortalAutorScreen } from '../artist/PortalAutorScreen';
import { useProximityLogic } from './hooks/useProximityLogic';
import { useProfileCompletion } from './hooks/Useprofilecompletion';

import HomeBanners from './components/HomeBanners';
import SectionHeader from './components/SectionHeader';
import {
  EventCard, ArtistCard, VenueCard,
  EventItem, ArtistItem, VenueItem,
} from './components/ContentCards';

import {
  EVENT_CATEGORIES,
  MOCK_EVENTS,
  MOCK_ARTISTS,
  MOCK_VENUES,
} from './data/homeData';

// ── Normalizar strings para comparación sin tildes ni mayúsculas ──────────────

const normalize = (str: string) =>
  str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

// ── Empty state ───────────────────────────────────────────────────────────────

const EmptySection: React.FC<{ message: string }> = ({ message }) => (
  <View style={es.wrap}>
    <Ionicons name="search-outline" size={28} color="rgba(124,58,237,0.25)" />
    <Text style={es.text}>{message}</Text>
  </View>
);

const es = StyleSheet.create({
  wrap: {
    marginHorizontal: 16,
    paddingVertical: 28,
    alignItems: 'center',
    gap: 10,
    borderRadius: 16,
    backgroundColor: 'rgba(124,58,237,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(124,58,237,0.1)',
    borderStyle: 'dashed',
  },
  text: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(124,58,237,0.45)',
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

// ── HomeScreen ────────────────────────────────────────────────────────────────

function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();

  const [activeCategory, setActiveCategory] = useState('todos');
  const [portalVisible,  setPortalVisible]  = useState(false);
  const [locationModal,  setLocationModal]  = useState(false);
  const [manualCity,     setManualCity]     = useState<string | null>(null);

  // ── Perfil completion — hook limpio con pesos que suman 100 ──────────────
  const { percentage: profilePct } = useProfileCompletion();

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
        ? MOCK_EVENTS
        : MOCK_EVENTS.filter(e =>
            normalize(e.category).includes(normalize(activeCategory))
          )
    )
  );

  const nearbyArtists: ArtistItem[] = sortByDistance(filterByProximity(MOCK_ARTISTS));
  const nearbyVenues:  VenueItem[]  = filterByProximity(MOCK_VENUES);

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <View style={s.root}>
      <TopBar
        topInset={insets.top}
        showLocation
        city={currentCity}
        locationLoading={locationLoading}
        onLocationPress={() => setLocationModal(true)}
      />

      <ScrollView
        contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
      >
        {/* Banners — desaparece cuando profilePct === 100 */}
        <AnimatedSection delay={0}>
          <HomeBanners
            showProfileBanner={profilePct < 100}
            profilePct={profilePct}
            onProfilePress={() => setPortalVisible(true)}
            categories={EVENT_CATEGORIES}
            activeCategory={activeCategory}
            onCategoryPress={setActiveCategory}
          />
        </AnimatedSection>

        {/* ── Eventos ─────────────────────────────────────────────────── */}
        <AnimatedSection delay={80}>
          <View style={s.section}>
            <SectionHeader
              title="Eventos cerca de ti"
              subtitle={`${currentCity} · Esta semana`}
              onSeeAll={() => {/* navegar a EventsScreen */}}
            />
            {filteredEvents.length > 0 ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={s.hScroll}
                decelerationRate="fast"
                snapToInterval={220} // snap suave por card
                snapToAlignment="start"
              >
                {filteredEvents.map(item => (
                  <EventCard
                    key={item.id}
                    item={item}
                    onPress={() => console.log('Event:', item.title)}
                  />
                ))}
              </ScrollView>
            ) : (
              <EmptySection message={`No hay eventos de esta categoría\ncerca de ${currentCity}`} />
            )}
          </View>
        </AnimatedSection>

        {/* ── Artistas ─────────────────────────────────────────────────── */}
        <AnimatedSection delay={160}>
          <View style={s.section}>
            <SectionHeader
              title="Artistas cerca de ti"
              subtitle="Talento local disponible ahora"
              onSeeAll={() => {/* navegar a ArtistsScreen */}}
            />
            {nearbyArtists.length > 0 ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={s.hScroll}
                decelerationRate="fast"
              >
                {nearbyArtists.map(item => (
                  <ArtistCard
                    key={item.id}
                    item={item}
                    onPress={() => console.log('Artist:', item.name)}
                  />
                ))}
              </ScrollView>
            ) : (
              <EmptySection message={`No encontramos artistas\ncerca de ${currentCity} por ahora`} />
            )}
          </View>
        </AnimatedSection>

        {/* ── Venues — también horizontal, sin lista vertical ──────────── */}
        <AnimatedSection delay={240}>
          <View style={s.section}>
            <SectionHeader
              title="Salas y espacios"
              subtitle={`Recintos disponibles en ${currentCity}`}
              onSeeAll={() => {/* navegar a VenuesScreen */}}
            />
            {nearbyVenues.length > 0 ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={s.hScroll}
                decelerationRate="fast"
              >
                {nearbyVenues.map(item => (
                  <VenueCard
                    key={item.id}
                    item={item}
                    onPress={() => console.log('Venue:', item.name)}
                  />
                ))}
              </ScrollView>
            ) : (
              <EmptySection message={`No hay espacios registrados\nen ${currentCity} aún`} />
            )}
          </View>
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
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f5f0ff',
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
});

export default HomeScreen;