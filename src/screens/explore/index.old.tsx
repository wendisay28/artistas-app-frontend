// ─────────────────────────────────────────────────────────────────────────────
// pages/explore/index.tsx — Orquestador principal de la pantalla Explore
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Image, Pressable, Platform, ActivityIndicator, ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors } from '../../constants/colors';
import { auth } from '../../services/firebase/config';
import { useProfileStore } from '../../store/profileStore';

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
import { useFavoritesStore } from '../../store/favoritesStore';
import HireModal from '../../components/modals/HireModal';
import { ComingSoonSection } from '../../components/shared/ComingSoonSection';

// Importar servicios y tipos reales
import { artistsService } from '../../services/api/artists';
import { servicesService } from '../../services/api/services';
import { portfolioService } from '../../services/api/portfolio';
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


export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const { artistData } = useProfileStore();

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

  // HireModal para el detalle de artista
  const [hireModalArtist, setHireModalArtist] = useState<Artist | null>(null);

  // Datos completos del artista activo (servicios, portfolio, experiencia, formación, redes)
  const [artistFullData, setArtistFullData] = useState<{
    services: any[];
    portfolio: any[];
    videos: any[];
    workExperience: any[];
    education: any[];
    socialMedia: any;
    description: string | null;
  } | null>(null);

  // Caché de detalles por userId — evita re-fetches en cada swipe
  const detailsCache = useRef<Map<string, any>>(new Map());

  // Debounce para re-fetch al cambiar filtros
  const filtersDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isInitialFilters = useRef(true);


  // Cargar datos desde la API cuando cambia la categoría o los filtros
  const loadCategoryData = useCallback(async (category: CategoryId, currentFilters?: typeof filters) => {
    setIsLoading(true);
    setError(null);

    try {
      let data: ExploreCard[] = [];
      const f = currentFilters ?? filters;

      switch (category) {
        case 'artists':
          const response = await artistsService.getExploreArtists({
            limit: 20,
            category: f.categoryFilter !== 'all' ? f.categoryFilter : undefined,
            subCategory: f.subCategory !== 'all' ? f.subCategory : undefined,
            distance: f.distance,
            priceMin: f.priceMin > 0 ? f.priceMin : undefined,
            priceMax: f.priceMax < 20000 ? f.priceMax : undefined,
            priceType: f.priceType !== 'all' ? f.priceType : undefined,
            tags: f.selectedTads.length > 0 ? f.selectedTads : undefined,
          });
          data = response.artists ?? [];
          
          // Priorizar tu perfil si está autenticado
          const currentUser = auth.currentUser;
          
          if (currentUser) {
            const myProfile = data.find(artist => artist.id === currentUser.uid);
            if (myProfile) {
              // Mover tu perfil al principio
              data = [myProfile, ...data.filter(artist => artist.id !== currentUser.uid)];
            }
          }
          
          console.log('[Explore] Artistas cargados:', data.length);
          break;
        case 'events':
          // Datos mock para eventos mientras se implementa el servicio
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
          // Venues próximamente
          data = [];
          break;
        case 'gallery':
          // Galería próximamente
          data = [];
          break;
      }
      
      setStack(data);
    } catch (err) {
      console.error(`[Explore] Error loading ${category}:`, err);
      setError('No se pudieron cargar los datos. Intenta de nuevo.');
      setStack([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Cargar datos al cambiar categoría (inmediato)
  useEffect(() => {
    loadCategoryData(selectedCategory, filters);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]);

  // Re-fetch automático al cambiar filtros (debounced 600ms)
  useEffect(() => {
    if (isInitialFilters.current) {
      isInitialFilters.current = false;
      return;
    }
    if (filtersDebounceRef.current) clearTimeout(filtersDebounceRef.current);
    filtersDebounceRef.current = setTimeout(() => {
      loadCategoryData(selectedCategory, filters);
    }, 600);
    return () => {
      if (filtersDebounceRef.current) clearTimeout(filtersDebounceRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  // Asegurarse de que el perfil del usuario esté cargado para el avatar
  useEffect(() => {
    const loadUserProfile = async () => {
      const currentUser = auth.currentUser;
      if (currentUser && !artistData) {
        try {
          await useProfileStore.getState().loadProfile(
            currentUser.uid,
            currentUser.photoURL,
            currentUser.displayName
          );
        } catch (error) {
          console.warn('[Explore] Error cargando perfil:', error);
        }
      }
    };
    loadUserProfile();
  }, [artistData]);

  // Cargar datos completos del artista activo: servicios, portfolio, experiencia, formación
  useEffect(() => {
    const topCard = stack[stack.length - 1] ?? null;
    if (!topCard || topCard.type !== 'artist') {
      setArtistFullData(null);
      return;
    }
    const artist = topCard as Artist;
    // artist.id es el userId (string, puede ser un Firebase UID o un mock como "mock-a1")
    const userId = artist.id;
    const isMock = userId.startsWith('mock-');
    if (!userId || isMock) {
      setArtistFullData(null);
      return;
    }

    // Usar caché si ya se cargó este artista
    if (detailsCache.current.has(userId)) {
      setArtistFullData(detailsCache.current.get(userId));
      return;
    }

    let cancelled = false;
    const fetchDetails = async () => {
      try {
        // Agregar timeout y manejo de errores
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 5000)
        );
        
        const [servicesRes, portfolioRes, profileRes] = await Promise.allSettled([
          Promise.race([servicesService.getUserServices(userId), timeoutPromise]),
          Promise.race([portfolioService.getUserPortfolio(userId), timeoutPromise]),
          Promise.race([artistsService.getArtistById(userId), timeoutPromise]),
        ]);
        
        if (cancelled) return;

        // getById retorna { ...userData, details: artistRecord, socialMedia }
        const profileData = profileRes?.status === 'fulfilled' ? profileRes.value : null;

        // Usar primer array NO vacío de la cadena de fallback
        const findNonEmpty = (...sources: any[][]): any[] =>
          sources.find(arr => Array.isArray(arr) && arr.length > 0) ?? [];

        // Si es el perfil propio, profileStore tiene los datos más frescos (guardados localmente)
        const ownArtistData = auth.currentUser?.uid === userId
          ? useProfileStore.getState().artistData
          : null;

        // Fallback de categoría: usar profileStore local si backend no devuelve categoryId/disciplineId/roleId
        const categoryFallback = ownArtistData?.category && 
          (!profileData?.categoryId && !profileData?.disciplineId && !profileData?.roleId)
          ? ownArtistData.category
          : undefined;

        const workExp: any[] = findNonEmpty(
          profileData?.details?.workExperience,
          profileData?.workExperience,
          ownArtistData?.workExperience as any[],
          artist.workExperience as any[],
        );
        const edu: any[] = findNonEmpty(
          profileData?.details?.education,
          profileData?.education,
          ownArtistData?.studies as any[],
          artist.education as any[],
        );
        const socialMedia = profileData?.socialMedia ?? (artist as any).socialMedia ?? null;

        // Extraer description: nivel raíz primero (después del fix backend), luego details, luego profileStore propio
        const description: string | null =
          profileData?.description ||
          profileData?.details?.description ||
          (auth.currentUser?.uid === userId ? useProfileStore.getState().artistData?.description ?? null : null) ||
          null;

        const services = servicesRes.status === 'fulfilled' && Array.isArray(servicesRes.value) ? servicesRes.value : [];

        const portfolioData = portfolioRes.status === 'fulfilled' ? portfolioRes.value as any : {};
        const fullData = {
          services:       services,
          portfolio:      Array.isArray(portfolioData.photos) ? portfolioData.photos : [],
          videos:         Array.isArray(portfolioData.videos) ? portfolioData.videos : [],
          workExperience: workExp.filter((x: any) => x?.company || x?.position),
          education:      edu.filter((x: any) => x?.institution || x?.degree),
          socialMedia,
          description,
        };
        detailsCache.current.set(userId, fullData);
        if (!cancelled) setArtistFullData(fullData);
      } catch (error) {
        console.warn('🔍 [Explore] Error cargando detalles:', error);
        if (!cancelled) {
          // En caso de error de red, usar datos locales si están disponibles
          const ownArtistData = auth.currentUser?.uid === userId
            ? useProfileStore.getState().artistData
            : null;
            
          if (ownArtistData) {
            setArtistFullData({
              services: [],
              portfolio: [],
              videos: [],
              workExperience: ownArtistData.workExperience || [],
              education: ownArtistData.studies || [],
              socialMedia: null,
              description: ownArtistData.description || null,
            });
          } else {
            setArtistFullData(null);
          }
        }
      }
    };
    fetchDetails();
    return () => { cancelled = true; };
  }, [stack]);

// Log para debugging del stack
useEffect(() => {
  console.log('🔍 [Explore] Stack cambió:', stack.length, 'items');
  console.log('🔍 [Explore] Top item:', stack[stack.length - 1]);
}, [stack]);



  const handleCategoryChange = useCallback((cat: CategoryId) => {
    if (Platform.OS !== 'web') Haptics.selectionAsync();
    setSelectedCategory(cat);
    setSwipeHistory([]);
    setMenuOpen(false);
  }, []);

  const handleDismiss = useCallback((id: string, direction: SwipeDirection) => {
    if (direction === 'like') {
      const card = stack.find(c => c.id === id);
      if (card) useFavoritesStore.getState().addFavorite(card);
    }
    setStack(prev => prev.filter(c => c.id !== id));
    setSwipeHistory(prev => [...prev, { cardId: id, direction, timestamp: Date.now() }]);
  }, [stack]);

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
    switch (card.type) {
      case 'artist':  
        return <ArtistCardContent  artist={card as Artist} />;
      case 'event':   
        return <EventCardContent   event={card as Event}   />;
      case 'gallery': 
        return <GalleryCardContent item={card as GalleryItem} />;
      case 'venue':   
        return <VenueCardContent   venue={card as Venue}   />;
      default:
        return null;
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
      <View
        style={[
          styles.header,
          { paddingTop: (insets.top || webTopInset) + 8 },
        ]}
      >
      {/* avatar */}
        {(() => {
          const firebasePhotoURL = auth.currentUser?.photoURL;
          const profileAvatar = artistData?.avatar;
          
          // Prioridad: 1) Profile Store avatar, 2) Firebase photoURL
          const avatarSource = profileAvatar || firebasePhotoURL;
          
          if (avatarSource) {
            return (
              <Image 
                source={{ uri: avatarSource }} 
                style={styles.avatar} 
                onError={(e) => {
                  console.log('[Explore] Error cargando avatar:', e.nativeEvent.error);
                }}
              />
            );
          } else {
            return (
              <View style={[styles.avatar, styles.avatarFallback]}>
                <Ionicons name="person" size={16} color={colors.textSecondary} />
              </View>
            );
          }
        })()}

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
      </View>

      {/* ══ CATEGORY DROPDOWN ══ */}
      {menuOpen && (
        <CategorySelector
          selected={selectedCategory}
          onChange={handleCategoryChange}
          topOffset={(insets.top || webTopInset) + 56}
          onClose={() => setMenuOpen(false)}
        />
      )}

      {/* ══ FILTER PANEL OVERLAY ══ */}
      {showFilters && (
        <View style={styles.filtersOverlay}>
          <Pressable style={styles.filtersBackdrop} onPress={() => setShowFilters(false)} />
          <View style={[styles.filtersSheet, { top: (insets.top || webTopInset) + 58 }]}>
            <UnifiedFiltersPanel
              isOpen={showFilters}
              onToggle={() => setShowFilters(false)}
              category={selectedCategory}

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

              format={filters.format}
              setFormat={(v) => setFilters(prev => ({ ...prev, format: v }))}

              sortBy={filters.sortBy}
              setSortBy={(v) => setFilters(prev => ({ ...prev, sortBy: v }))}

              transactionTypes={filters.transactionTypes}
              setTransactionTypes={(v: string[]) => setFilters(prev => ({ ...prev, transactionTypes: v }))}
              conditions={filters.conditions}
              setConditions={(v: string[]) => setFilters(prev => ({ ...prev, conditions: v }))}
            />
          </View>
        </View>
      )}

      {/* ══ SCROLL ══ */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: (insets.bottom || webBottomInset) + 96 }]}
        showsVerticalScrollIndicator={false}
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
              {(selectedCategory === 'venues' || selectedCategory === 'gallery') ? (
                <ComingSoonSection 
                  title={selectedCategory === 'venues' ? 'Salas y espacios' : 'Galería de arte'}
                  subtitle="Estamos construyendo algo nuevo para ti"
                />
              ) : (
                <>
                  <Ionicons name="albums-outline" size={52} color={colors.border} />
                  <Text style={styles.emptyTitle}>Has visto todo</Text>
                  <Text style={styles.emptySub}>Vuelve pronto o cambia de categoría</Text>
                  <Pressable onPress={handleReset} style={({ pressed }) => [styles.resetBtn, pressed && { opacity: 0.85 }]}>
                    <Ionicons name="refresh" size={16} color="#fff" />
                    <Text style={styles.resetText}>Ver de nuevo</Text>
                  </Pressable>
                </>
              )}
            </View>
          ) : (
            <View>
              {[...stack].reverse().map((card, i) => (
                <SwipeCard key={card.id} card={card} zIndex={stack.length - i} onDismiss={handleDismiss}>
                  {renderCardContent(card)}
                </SwipeCard>
              ))}
            </View>
          )}
        </View>

        {stack.length > 0 && (
          <View style={styles.swipeHint}>
            <Ionicons name="chevron-down" size={16} color={colors.textSecondary} />
            <Text style={styles.swipeHintText}>Desliza para ver más</Text>
          </View>
        )}

        {topCard && <View style={styles.detailsWrapper}>{renderDetails(topCard)}</View>}

      </ScrollView>

      {/* HireModal — abre desde el botón Contratar en el detalle del artista */}
      {hireModalArtist && (
        <HireModal
          visible={!!hireModalArtist}
          artist={hireModalArtist}
          onClose={() => setHireModalArtist(null)}
        />
      )}

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
    backgroundColor: 'rgba(255,255,255,0.97)',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 8, elevation: 4,
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

  // overlay del panel de filtros
  filtersOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    zIndex: 45,
  },
  filtersBackdrop: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  filtersSheet: {
    position: 'absolute', left: 12, right: 12,
    maxHeight: '75%',
  },

  // filter panel (legacy — unused)
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

  swipeHint: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    marginTop: -5, marginBottom: 12,
  },
  swipeHintText: {
    fontSize: 13, fontFamily: 'PlusJakartaSans_400Regular', color: colors.textSecondary,
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

  detailsWrapper: { width: CARD_WIDTH, paddingBottom: 16 },
});