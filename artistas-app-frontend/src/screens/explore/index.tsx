// ─────────────────────────────────────────────────────────────────────────────
// pages/explore/index.tsx — Orquestador principal de la pantalla Explore
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Animated,
  Image, Pressable, Platform, ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors } from '../../constants/colors';
import { auth } from '../../services/firebase/config';

import SwipeCard, { CARD_WIDTH, CARD_HEIGHT } from '../../components/explore/cards/SwipeCard';
import ArtistCardContent  from '../../components/explore/cards/ArtistCardContent';
import EventCardContent   from '../../components/explore/cards/EventCardContent';
import GalleryCardContent from '../../components/explore/cards/GalleryCardContent';
import VenueCardContent   from '../../components/explore/cards/VenueCardContent';

import ArtistDetails  from '../../components/explore/details/ArtistDetails';
import EventDetails   from '../../components/explore/details/EventDetails';
import GalleryDetails from '../../components/explore/details/GalleryDetails';
import VenueDetails   from '../../components/explore/details/VenueDetails';

import CategorySelector from './components/CategorySelector';
import UnifiedFiltersPanel from './components/shared/UnifiedFiltersPanel';

// Importar servicios y tipos reales
import { artistsService } from '../../services/api/artists';
import type {
  Artist, Event, Venue, GalleryItem,
  ExploreCard, CategoryId, SwipeDirection, SwipeResult,
  ExploreFilters,
} from '../../types/explore';

const CATEGORY_LABELS: Record<CategoryId, string> = {
  artists: 'Artistas',
  events:  'Eventos',
  venues:  'Salas',
  gallery: 'Galería',
};

const CATEGORY_ICONS: Record<CategoryId, string> = {
  artists: 'brush-outline',
  events:  'calendar-outline',
  venues:  'business-outline',
  gallery: 'images-outline',
};

// Estado inicial para las categorías (vacío hasta cargar desde API)
const INITIAL_STACK_DATA: Record<CategoryId, ExploreCard[]> = {
  artists: [],
  events:  [],
  venues:  [],
  gallery: [],
};

// Componente para el icono animado del swipe hint
const AnimatedSwipeHintIcon = ({ animValue }: { animValue: Animated.Value }) => (
  <Animated.View style={{
    transform: [{
      translateY: animValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 8],
        extrapolate: 'clamp',
      })
    }],
  }}>
    <Ionicons name="chevron-down" size={18} color={colors.textSecondary} />
  </Animated.View>
);

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();

  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('artists');
  const [stack, setStack] = useState<ExploreCard[]>([]);
  const [swipeHistory, setSwipeHistory] = useState<SwipeResult[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estados para filtros (compartidos entre categorías)
  const [filters, setFilters] = useState({
    // Genéricos
    distance: 10,
    price: 5000,
    priceMin: 0,
    priceMax: 20000,
    selectedDate: null as Date | null,
    
    // Artistas
    categoryFilter: 'all',
    subCategory: 'all',
    selectedRole: '',
    selectedSpecialization: '',
    selectedTads: [] as string[],
    selectedStats: {} as Record<string, any>,
    priceType: 'all' as 'all' | 'free' | 'paid',
    
    // Eventos
    format: 'all',
    
    // Venues
    sortBy: 'rating',
    
    // Galería
    transactionTypes: [] as string[],
    conditions: [] as string[],
  });

  // Animación para el swipe hint
  const swipeHintAnim = useRef(new Animated.Value(0)).current;

  // Cargar datos desde la API cuando cambia la categoría
  const loadCategoryData = useCallback(async (category: CategoryId) => {
    setIsLoading(true);
    setError(null);
    
    console.log(`[Explore] Cargando categoría: ${category}`);
    
    try {
      let data: ExploreCard[] = [];
      
      switch (category) {
        case 'artists':
          const response = await artistsService.getExploreArtists({ limit: 20 });
          data = response.artists ?? [];
          if (data.length === 0) {
            data = [
              {
                id: 'mock-a1',
                type: 'artist',
                name: 'Valentina Rojas',
                category: 'Fotografía',
                bio: 'Fotógrafa de retrato y moda con 8 años de experiencia en Medellín. Especializada en editorial y portafolios artísticos.',
                image: 'https://picsum.photos/seed/valentina/400/500',
                gallery: [
                  'https://picsum.photos/seed/val1/400/300',
                  'https://picsum.photos/seed/val2/400/300',
                  'https://picsum.photos/seed/val3/400/300',
                ],
                tags: ['Retrato', 'Moda', 'Editorial'],
                rating: 4.9,
                reviews: 47,
                price: 180000,
                location: 'Medellín',
                responseTime: '~2h',
                availability: 'Disponible',
                verified: true,
                experience: '8 años',
                style: 'Editorial / Fine Art',
                services: ['Sesión de fotos', 'Portafolio artístico', 'Fotografía de eventos'],
              },
              {
                id: 'mock-a2',
                type: 'artist',
                name: 'Sebastián Mora',
                category: 'Música',
                bio: 'Guitarrista y compositor bogotano. Fusiona jazz, bossa nova y música andina colombiana en cada presentación en vivo.',
                image: 'https://picsum.photos/seed/sebastian/400/500',
                gallery: [
                  'https://picsum.photos/seed/seb1/400/300',
                  'https://picsum.photos/seed/seb2/400/300',
                ],
                tags: ['Jazz', 'Guitarra', 'Compositor'],
                rating: 4.7,
                reviews: 32,
                price: 250000,
                location: 'Bogotá',
                responseTime: '~4h',
                availability: 'Disponible',
                verified: true,
                experience: '12 años',
                style: 'Jazz / Fusión',
                services: ['Presentación en vivo', 'Clases de guitarra', 'Composición'],
              },
              {
                id: 'mock-a3',
                type: 'artist',
                name: 'Camila Herrera',
                category: 'Ilustración',
                bio: 'Ilustradora digital y muralista de Cali. Crea piezas llenas de color con temáticas latinoamericanas y culturales.',
                image: 'https://picsum.photos/seed/camila/400/500',
                gallery: [
                  'https://picsum.photos/seed/cam1/400/300',
                  'https://picsum.photos/seed/cam2/400/300',
                  'https://picsum.photos/seed/cam3/400/300',
                  'https://picsum.photos/seed/cam4/400/300',
                ],
                tags: ['Digital', 'Mural', 'Cultural'],
                rating: 4.8,
                reviews: 61,
                price: 120000,
                location: 'Cali',
                responseTime: '~1h',
                availability: 'Disponible',
                verified: false,
                experience: '5 años',
                style: 'Ilustración digital / Muralismo',
                services: ['Ilustración digital', 'Murales', 'Identidad visual'],
              },
            ];
          }
          break;
        case 'events':
          // Datos mock para eventos mientras se implementa el servicio
          console.log('[Explore] Usando datos mock para eventos...');
          data = [
            {
              id: 'e1',
              type: 'event',
              name: 'Exposición de Arte Urbano',
              location: 'Medellín',
              rating: 4.8,
              reviews: 23,
              responseTime: '24h',
              price: 15000,
              image: 'https://picsum.photos/400/300?random=1',
              gallery: [],
              tags: ['arte', 'urbano'],
              bio: 'Exposición colectiva de arte urbano',
              availability: 'Disponible',
              verified: true,
              date: '2026-03-15',
              time: '20:00',
              venue: 'Galería Central',
              city: 'Medellín',
              description: 'Exposición de arte urbano con artistas locales',
            },
            {
              id: 'e2', 
              type: 'event',
              name: 'Taller de Fotografía',
              location: 'Bogotá',
              rating: 4.6,
              reviews: 15,
              responseTime: '12h',
              price: 25000,
              image: 'https://picsum.photos/400/300?random=2',
              gallery: [],
              tags: ['fotografía', 'taller'],
              bio: 'Taller intensivo de fotografía',
              availability: 'Disponible',
              verified: false,
              date: '2026-03-20',
              time: '18:00',
              venue: 'Studio Pro',
              city: 'Bogotá',
              description: 'Taller práctico de fotografía',
            }
          ];
          break;
        case 'venues':
          // Datos mock para salas mientras se implementa el servicio
          console.log('[Explore] Usando datos mock para salas...');
          data = [
            {
              id: 'v1',
              type: 'venue',
              name: 'Galería Arte Moderno',
              location: 'Medellín, El Poblado',
              rating: 4.9,
              reviews: 45,
              responseTime: '48h',
              price: 50000,
              image: 'https://picsum.photos/400/300?random=3',
              gallery: ['Arte Moderno'],
              tags: ['galería', 'exposiciones'],
              bio: 'Espacio dedicado al arte contemporáneo',
              availability: 'Disponible',
              verified: true,
              category: 'Galería de Arte',
              capacity: 100,
              amenities: ['Sonido profesional', 'Iluminación', 'Camerinos'],
              openingHours: 'Lun-Sáb 10:00-20:00',
              website: 'https://galeriaarte.com',
            },
            {
              id: 'v2',
              type: 'venue', 
              name: 'Espacio Creativo',
              location: 'Bogotá, Chapinero',
              rating: 4.7,
              reviews: 32,
              responseTime: '24h',
              price: 35000,
              image: 'https://picsum.photos/400/300?random=4',
              gallery: ['Arte Alternativo'],
              tags: ['creativo', 'workshops'],
              bio: 'Espacio para artistas emergentes',
              availability: 'Disponible',
              verified: false,
              category: 'Centro Cultural',
              capacity: 50,
              amenities: ['Proyector', 'Sonido básico'],
              openingHours: 'Mar-Dom 14:00-22:00',
            }
          ];
          break;
        case 'gallery':
          // Datos mock para galería mientras se implementa el servicio
          console.log('[Explore] Usando datos mock para galería...');
          data = [
            {
              id: 'g1',
              type: 'gallery',
              name: 'Raíces Urbanas',
              artistName: 'Valentina Rojas',
              location: 'Ciudad de México',
              rating: 4.9,
              reviews: 42,
              responseTime: '24h',
              price: 2500000,
              image: 'https://picsum.photos/400/300?random=5',
              gallery: ['Arte Contemporáneo'],
              tags: ['óleo', 'lienzo'],
              bio: 'Obra que explora las raíces de la cultura urbana',
              availability: 'Disponible',
              verified: true,
              medium: 'Óleo sobre lienzo',
              dimensions: '80 x 100 cm',
              year: 2025,
              forSale: true,
            },
            {
              id: 'g2',
              type: 'gallery',
              name: 'Ecos del Silencio',
              artistName: 'Marco López',
              location: 'Oaxaca',
              rating: 4.7,
              reviews: 28,
              responseTime: '48h',
              price: 1800000,
              image: 'https://picsum.photos/400/300?random=6',
              gallery: ['Fotografía'],
              tags: ['digital', 'naturaleza'],
              bio: 'Serie fotográfica que captura la esencia del silencio',
              availability: 'Disponible',
              verified: true,
              medium: 'Fotografía digital',
              dimensions: '60 x 80 cm',
              year: 2025,
              forSale: true,
            }
          ];
          break;
      }
      
      console.log(`[Explore] Datos cargados para ${category}:`, data.length);
      setStack(data);
    } catch (err) {
      console.error(`[Explore] Error loading ${category}:`, err);
      setError('No se pudieron cargar los datos. Intenta de nuevo.');
      setStack([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Cargar datos iniciales
  useEffect(() => {
    loadCategoryData(selectedCategory);
  }, [selectedCategory, loadCategoryData]);

  useEffect(() => {
    // Animación sutil del swipe hint
    const animateSwipeHint = () => {
      Animated.sequence([
        Animated.timing(swipeHintAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(swipeHintAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start();
    };

    // Iniciar animación después de 1s y repetir cada 4s
    const timer = setTimeout(() => {
      animateSwipeHint();
      const interval = setInterval(animateSwipeHint, 4000);
      return () => clearInterval(interval);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const scrollY = useRef(new Animated.Value(0)).current;

  const headerBg = scrollY.interpolate({
    inputRange:  [0, 80],
    outputRange: ['rgba(255,255,255,0)', 'rgba(255,255,255,0.97)'],
    extrapolate: 'clamp',
  });
  const headerShadow = scrollY.interpolate({
    inputRange:  [0, 80],
    outputRange: [0, 0.08],
    extrapolate: 'clamp',
  });

  const handleCategoryChange = useCallback((cat: CategoryId) => {
    if (Platform.OS !== 'web') Haptics.selectionAsync();
    setSelectedCategory(cat);
    setSwipeHistory([]);
    setMenuOpen(false);
  }, []);

  const handleDismiss = useCallback((id: string, direction: SwipeDirection) => {
    setStack(prev => prev.filter(c => c.id !== id));
    setSwipeHistory(prev => [...prev, { cardId: id, direction, timestamp: Date.now() }]);
  }, []);

  // Resetear filtros a valores por defecto
  const handleResetFilters = useCallback(() => {
    setFilters({
      distance: 10,
      price: 5000,
      priceMin: 0,
      priceMax: 20000,
      selectedDate: null,
      categoryFilter: 'all',
      subCategory: 'all',
      selectedRole: '',
      selectedSpecialization: '',
      selectedTads: [],
      selectedStats: {},
      priceType: 'all',
      format: 'all',
      sortBy: 'rating',
      transactionTypes: [],
      conditions: [],
    });
  }, []);

  const handleReset = useCallback(() => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    handleResetFilters();
    loadCategoryData(selectedCategory);
    setSwipeHistory([]);
  }, [selectedCategory, loadCategoryData, handleResetFilters]);

  const renderCardContent = (card: ExploreCard) => {
    console.log('[Explore] Renderizando tarjeta:', card.type, card.id);
    console.log('[Explore] Datos de la tarjeta:', card);
    
    switch (card.type) {
      case 'artist':  
        console.log('[Explore] Renderizando ArtistCardContent');
        return <ArtistCardContent  artist={card as Artist} />;
      case 'event':   
        console.log('[Explore] Renderizando EventCardContent');
        return <EventCardContent   event={card as Event}   />;
      case 'gallery': 
        console.log('[Explore] Renderizando GalleryCardContent');
        return <GalleryCardContent item={card as GalleryItem} />;
      case 'venue':   
        console.log('[Explore] Renderizando VenueCardContent');
        return <VenueCardContent   venue={card as Venue}   />;
      default:
        console.log('[Explore] Tipo de tarjeta no reconocido:', (card as any).type);
        return null;
    }
  };

  const renderDetails = (card: ExploreCard) => {
    switch (card.type) {
      case 'artist': {
        const c = card as Artist;
        return <ArtistDetails artist={c} onHire={() => {}} onMessage={() => {}} onShare={() => {}} />;
      }
      case 'event': {
        const c = card as Event;
        return <EventDetails event={c} onBuyTicket={() => {}} onShare={() => {}} onViewDetails={() => {}} />;
      }
      case 'gallery': {
        const c = card as GalleryItem;
        return <GalleryDetails item={c} onBuy={() => {}} onContact={() => {}} onShare={() => {}} />;
      }
      case 'venue': {
        const c = card as Venue;
        return <VenueDetails venue={c} onReserve={() => {}} onContact={() => {}} onShare={() => {}} />;
      }
    }
  };

  const topCard = stack[stack.length - 1] ?? null;
  const webTopInset    = Platform.OS === 'web' ? 67 : 0;
  const webBottomInset = Platform.OS === 'web' ? 34 : 0;

  return (
    <View style={styles.root}>

      {/* ══ HEADER ══ */}
      <Animated.View
        style={[
          styles.header,
          {
            paddingTop:      (insets.top || webTopInset) + 8,
            backgroundColor: headerBg,
            shadowOpacity:   headerShadow,
          },
        ]}
      >
        {/* avatar */}
        {auth.currentUser?.photoURL ? (
          <Image source={{ uri: auth.currentUser.photoURL }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarFallback]}>
            <Ionicons name="person" size={16} color={colors.textSecondary} />
          </View>
        )}

        {/* botón categoría (reemplaza "Explorar") */}
        <Pressable
          onPress={() => {
            if (Platform.OS !== 'web') Haptics.selectionAsync();
            setMenuOpen(p => !p);
            setShowFilters(false);
          }}
          style={({ pressed }) => [
            styles.categoryBtn,
            menuOpen && styles.categoryBtnActive,
            pressed && { opacity: 0.8 },
          ]}
        >
          <Ionicons
            name={CATEGORY_ICONS[selectedCategory] as any}
            size={15}
            color={menuOpen ? colors.primary : colors.text}
          />
          <Text style={[styles.categoryLabel, menuOpen && { color: colors.primary }]}>
            {CATEGORY_LABELS[selectedCategory]}
          </Text>
          <Ionicons
            name={menuOpen ? 'chevron-up' : 'chevron-down'}
            size={14}
            color={menuOpen ? colors.primary : colors.textSecondary}
          />
        </Pressable>

        {/* filtros — misma posición que antes */}
        <Pressable
          onPress={() => {
            if (Platform.OS !== 'web') Haptics.selectionAsync();
            setShowFilters(p => !p);
            setMenuOpen(false);
          }}
          style={({ pressed }) => [
            styles.iconBtn,
            showFilters && styles.iconBtnActive,
            pressed && { opacity: 0.7 },
          ]}
        >
          <Ionicons
            name="options-outline"
            size={20}
            color={showFilters ? colors.primary : colors.text}
          />
        </Pressable>
      </Animated.View>

      {/* ══ CATEGORY DROPDOWN ══ */}
      {menuOpen && (
        <CategorySelector
          selected={selectedCategory}
          onChange={handleCategoryChange}
          topOffset={(insets.top || webTopInset) + 56}
          onClose={() => setMenuOpen(false)}
        />
      )}

      {/* ══ FILTER PANEL ══ */}
      {showFilters && (
        <UnifiedFiltersPanel
          isOpen={showFilters}
          onToggle={() => setShowFilters(false)}
          category={selectedCategory}
          
          // Props genéricas
          distance={filters.distance}
          setDistance={(v) => setFilters(prev => ({ ...prev, distance: v }))}
          price={filters.price}
          setPrice={(v) => setFilters(prev => ({ ...prev, price: v }))}
          priceMin={filters.priceMin}
          setPriceMin={(v) => setFilters(prev => ({ ...prev, priceMin: v }))}
          priceMax={filters.priceMax}
          setPriceMax={(v) => setFilters(prev => ({ ...prev, priceMax: v }))}
          selectedDate={filters.selectedDate}
          setSelectedDate={(d) => setFilters(prev => ({ ...prev, selectedDate: d }))}
          onResetFilters={handleResetFilters}
          
          // Props específicas de artistas
          categoryFilter={filters.categoryFilter}
          setCategoryFilter={(v) => setFilters(prev => ({ ...prev, categoryFilter: v }))}
          subCategory={filters.subCategory}
          setSubCategory={(v) => setFilters(prev => ({ ...prev, subCategory: v }))}
          selectedRole={filters.selectedRole}
          setSelectedRole={(v) => setFilters(prev => ({ ...prev, selectedRole: v }))}
          selectedSpecialization={filters.selectedSpecialization}
          setSelectedSpecialization={(v) => setFilters(prev => ({ ...prev, selectedSpecialization: v }))}
          selectedTads={filters.selectedTads}
          setSelectedTads={(v: string[]) => setFilters(prev => ({ ...prev, selectedTads: v }))}
          selectedStats={filters.selectedStats}
          setSelectedStats={(v: Record<string, any>) => setFilters(prev => ({ ...prev, selectedStats: v }))}
          priceType={filters.priceType}
          setPriceType={(v) => setFilters(prev => ({ ...prev, priceType: v }))}
          
          // Props específicas de eventos
          format={filters.format}
          setFormat={(v) => setFilters(prev => ({ ...prev, format: v }))}
          
          // Props específicas de venues
          sortBy={filters.sortBy}
          setSortBy={(v) => setFilters(prev => ({ ...prev, sortBy: v }))}
          
          // Props específicas de galería
          transactionTypes={filters.transactionTypes}
          setTransactionTypes={(v: string[]) => setFilters(prev => ({ ...prev, transactionTypes: v }))}
          conditions={filters.conditions}
          setConditions={(v: string[]) => setFilters(prev => ({ ...prev, conditions: v }))}
        />
      )}

      {/* ══ SCROLL ══ */}
      <Animated.ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: (insets.bottom || webBottomInset) + 96 }]}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
        scrollEventThrottle={16}
      >
        <View style={{ height: (insets.top || webTopInset) + 60 }} />

        {/* stack */}
        <View style={styles.stackWrapper}>
          {isLoading ? (
            <View style={styles.loadingState}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.loadingText}>Cargando artistas...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorState}>
              <Ionicons name="alert-circle-outline" size={52} color={colors.primary} />
              <Text style={styles.errorTitle}>Error al cargar</Text>
              <Text style={styles.errorSub}>{error}</Text>
              <Pressable onPress={() => loadCategoryData(selectedCategory)} style={({ pressed }) => [styles.resetBtn, pressed && { opacity: 0.85 }]}>
                <Ionicons name="refresh" size={16} color="#fff" />
                <Text style={styles.resetText}>Reintentar</Text>
              </Pressable>
            </View>
          ) : stack.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="albums-outline" size={52} color={colors.border} />
              <Text style={styles.emptyTitle}>Has visto todo</Text>
              <Text style={styles.emptySub}>Vuelve pronto o cambia de categoría</Text>
              <Pressable onPress={handleReset} style={({ pressed }) => [styles.resetBtn, pressed && { opacity: 0.85 }]}>
                <Ionicons name="refresh" size={16} color="#fff" />
                <Text style={styles.resetText}>Ver de nuevo</Text>
              </Pressable>
            </View>
          ) : (
            <View>
              {(() => {
                console.log('[Explore] Renderizando stack de tarjetas:', stack.length);
                return null;
              })()}
              {[...stack].reverse().map((card, i) => {
                console.log(`[Explore] Tarjeta ${i}:`, card.type, card.id);
                return (
                  <SwipeCard key={card.id} card={card} zIndex={stack.length - i} onDismiss={handleDismiss}>
                    {renderCardContent(card)}
                  </SwipeCard>
                );
              })}
            </View>
          )}
        </View>

        {stack.length > 0 && (
          <View style={styles.swipeHint}>
            <AnimatedSwipeHintIcon animValue={swipeHintAnim} />
            <Text style={styles.swipeHintText}>Desliza para ver más</Text>
          </View>
        )}

        {topCard && <View style={styles.detailsWrapper}>{renderDetails(topCard)}</View>}

      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },

  header: {
    position: 'absolute', top: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 16, paddingBottom: 10,
    zIndex: 50,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowRadius: 8, elevation: 4,
  },

  avatar: { width: 32, height: 32, borderRadius: 16 },
  avatarFallback: {
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: colors.border,
  },

  // botón categoría — pill que reemplaza "Explorar"
  categoryBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: 7,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8,
    borderWidth: 1, borderColor: colors.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  categoryBtnActive: {
    backgroundColor: colors.primary + '10',
    borderColor: colors.primary + '40',
  },
  categoryLabel: {
    flex: 1, fontSize: 15,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.text,
  },

  // botón filtros
  iconBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: colors.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  iconBtnActive: {
    backgroundColor: colors.primary + '10',
    borderColor: colors.primary + '40',
  },

  // filter panel
  filterPanel: {
    position: 'absolute', right: 16, width: 220,
    backgroundColor: '#fff', borderRadius: 16, padding: 14,
    zIndex: 45,
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12, shadowRadius: 16, elevation: 8,
  },
  filterTitle: {
    fontSize: 13, fontFamily: 'PlusJakartaSans_700Bold',
    color: colors.text, marginBottom: 10,
  },
  filterChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  filterChip: {
    backgroundColor: colors.background, borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 6,
    borderWidth: 1, borderColor: colors.border,
  },
  filterChipText: {
    fontSize: 12, fontFamily: 'PlusJakartaSans_500Medium',
    color: colors.textSecondary,
  },

  scroll: { flex: 1 },
  scrollContent: { alignItems: 'center' },

  stackWrapper: {
    width: CARD_WIDTH, height: CARD_HEIGHT,
    position: 'relative', marginBottom: 8,
  },

  emptyState: {
    width: CARD_WIDTH, height: CARD_HEIGHT,
    alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: colors.background,
    borderRadius: 24, borderWidth: 1, borderColor: colors.border,
  },
  loadingState: {
    width: CARD_WIDTH, height: CARD_HEIGHT,
    alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: colors.background,
    borderRadius: 24, borderWidth: 1, borderColor: colors.border,
  },
  errorState: {
    width: CARD_WIDTH, height: CARD_HEIGHT,
    alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: colors.background,
    borderRadius: 24, borderWidth: 1, borderColor: colors.border,
  },
  emptyTitle: {
    fontSize: 18, fontFamily: 'PlusJakartaSans_700Bold', color: colors.text,
  },
  errorTitle: {
    fontSize: 18, fontFamily: 'PlusJakartaSans_700Bold', color: colors.text,
  },
  emptySub: {
    fontSize: 13, fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textSecondary, textAlign: 'center', paddingHorizontal: 32,
  },
  errorSub: {
    fontSize: 13, fontFamily: 'PlusJakartaSans_400Regular',
    color: colors.textSecondary, textAlign: 'center', paddingHorizontal: 32,
  },
  loadingText: {
    fontSize: 16, fontFamily: 'PlusJakartaSans_500Medium',
    color: colors.text, marginTop: 8,
  },
  resetBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 8,
    backgroundColor: colors.primary, paddingHorizontal: 24, paddingVertical: 12,
    borderRadius: 14,
    shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  resetText: {
    fontSize: 14, fontFamily: 'PlusJakartaSans_700Bold', color: '#fff',
  },

  swipeHint: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    marginTop: -5, marginBottom: 12,
  },
  swipeHintText: {
    fontSize: 13, fontFamily: 'PlusJakartaSans_400Regular', color: colors.textSecondary,
  },
  swipeHintIcon: {
    transform: [{
      translateY: 8, // Valor fijo, la animación se manejará en el componente
    }],
  },

  detailsWrapper: { width: CARD_WIDTH, paddingBottom: 16 },
});