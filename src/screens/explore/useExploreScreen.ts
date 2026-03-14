// src/screens/explore/useExploreScreen.ts
import { useState, useCallback, useRef, useEffect } from 'react';
import { Platform, ScrollView } from 'react-native';
import * as Haptics from 'expo-haptics';
import { auth } from '../../services/firebase/config';
import { useProfileStore } from '../../store/profileStore';
import { artistsService } from '../../services/api/artists';
import { servicesService } from '../../services/api/services';
import { portfolioService } from '../../services/api/portfolio';
import type { Artist, ExploreCard, CategoryId } from '../../types/explore';

// ── Filtros ────────────────────────────────────────────────────────────────────
export type ExploreFiltersState = {
  query: string;
  distance: number;
  price: number;
  priceMin: number;
  priceMax: number;
  selectedDate: Date | null;
  categoryFilter: string;
  subCategory: string;
  selectedRole: string;
  selectedSpecialization: string;
  selectedTads: string[];
  selectedStats: Record<string, any>;
  priceType: 'all' | 'free' | 'paid';
  format: string;
  sortBy: string;
  transactionTypes: string[];
  conditions: string[];
};

const DEFAULT_FILTERS: ExploreFiltersState = {
  query: '', distance: 10, price: 5000, priceMin: 0, priceMax: 20000,
  selectedDate: null, categoryFilter: 'all', subCategory: 'all',
  selectedRole: '', selectedSpecialization: '', selectedTads: [],
  selectedStats: {}, priceType: 'all', format: 'all', sortBy: 'rating',
  transactionTypes: [], conditions: [],
};

const MOCK_EVENTS: ExploreCard[] = [
  { id: 'e1', type: 'event', name: 'Exposición de Arte Urbano', location: 'Medellín', rating: 4.8, reviews: 23, responseTime: '24h', price: 15000, image: 'https://picsum.photos/400/300?random=1', gallery: [], tags: ['arte', 'urbano'], bio: 'Exposición colectiva de arte urbano', availability: 'Disponible', verified: true, date: '2026-03-15', time: '20:00', venue: 'Galería Central', city: 'Medellín', description: 'Exposición de arte urbano con artistas locales' },
  { id: 'e2', type: 'event', name: 'Taller de Fotografía', location: 'Bogotá', rating: 4.6, reviews: 15, responseTime: '12h', price: 25000, image: 'https://picsum.photos/400/300?random=2', gallery: [], tags: ['fotografía', 'taller'], bio: 'Taller intensivo de fotografía', availability: 'Disponible', verified: false, date: '2026-03-20', time: '18:00', venue: 'Studio Pro', city: 'Bogotá', description: 'Taller práctico de fotografía' },
];

// ── Hook ───────────────────────────────────────────────────────────────────────
export function useExploreScreen() {
  const { artistData } = useProfileStore();

  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('artists');
  const [stack, setStack]                         = useState<ExploreCard[]>([]);
  const [currentIndex, setCurrentIndex]           = useState(0);
  const [menuOpen, setMenuOpen]                   = useState(false);
  const [showFilters, setShowFilters]             = useState(false);
  const [showSearch, setShowSearch]               = useState(false);
  const [isLoading, setIsLoading]                 = useState(false);
  const [isLoadingMore, setIsLoadingMore]         = useState(false);
  const [error, setError]                         = useState<string | null>(null);
  const [filters, setFilters]                     = useState<ExploreFiltersState>(DEFAULT_FILTERS);
  const [hireModalArtist, setHireModalArtist]     = useState<Artist | null>(null);
  const [connectedIds, setConnectedIds]           = useState<Set<string>>(new Set());
  const [artistFullData, setArtistFullData]       = useState<{
    services: any[]; portfolio: any[]; videos: any[];
    workExperience: any[]; education: any[];
    socialMedia: any; description: string | null;
  } | null>(null);

  const scrollRef          = useRef<ScrollView>(null);
  const currentPageRef     = useRef(1);
  const hasMoreRef         = useRef(false);
  const isLoadingMoreRef   = useRef(false);
  const detailsCache       = useRef<Map<string, any>>(new Map());
  const filtersDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isInitialFilters   = useRef(true);

  const topCard = stack[currentIndex] ?? null;

  // ── Carga de datos ──────────────────────────────────────────────────────────
  const loadCategoryData = useCallback(async (
    category: CategoryId,
    currentFilters?: ExploreFiltersState,
    page = 1,
  ) => {
    const isFirstPage = page === 1;

    if (isFirstPage) {
      setIsLoading(true);
      setError(null);
      currentPageRef.current = 1;
    } else {
      if (isLoadingMoreRef.current) return;
      isLoadingMoreRef.current = true;
      setIsLoadingMore(true);
    }

    try {
      let data: ExploreCard[] = [];
      const f = currentFilters ?? filters;

      switch (category) {
        case 'artists': {
          const response = await artistsService.getExploreArtists({
            page, limit: 20,
            query:       f.query || undefined,
            category:    f.categoryFilter !== 'all' ? f.categoryFilter : undefined,
            subCategory: f.subCategory !== 'all' ? f.subCategory : undefined,
            distance:    f.distance,
            priceMin:    f.priceMin > 0 ? f.priceMin : undefined,
            priceMax:    f.priceMax < 20000 ? f.priceMax : undefined,
            priceType:   f.priceType !== 'all' ? f.priceType : undefined,
            tags:        f.selectedTads.length > 0 ? f.selectedTads : undefined,
          });
          data = response.artists ?? [];
          hasMoreRef.current = response.hasMore ?? false;
          currentPageRef.current = page;

          if (isFirstPage) {
            const uid = auth.currentUser?.uid;
            if (uid) {
              const mine = data.find(a => a.id === uid);
              if (mine) data = [mine, ...data.filter(a => a.id !== uid)];
            }
          }
          break;
        }
        case 'events':
          data = MOCK_EVENTS;
          break;
        default:
          data = [];
      }

      if (isFirstPage) {
        setStack(data);
        setCurrentIndex(0);
      } else {
        setStack(prev => [...prev, ...data]);
      }
    } catch (err) {
      console.error(`[Explore] Error loading ${category} p${page}:`, err);
      if (isFirstPage) { setError('No se pudieron cargar los datos. Intenta de nuevo.'); setStack([]); }
    } finally {
      if (isFirstPage) setIsLoading(false);
      else { isLoadingMoreRef.current = false; setIsLoadingMore(false); }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cambio de categoría
  useEffect(() => {
    hasMoreRef.current = false;
    currentPageRef.current = 1;
    loadCategoryData(selectedCategory, filters, 1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]);

  // Re-fetch debounced al cambiar filtros
  useEffect(() => {
    if (isInitialFilters.current) { isInitialFilters.current = false; return; }
    if (filtersDebounceRef.current) clearTimeout(filtersDebounceRef.current);
    filtersDebounceRef.current = setTimeout(() => {
      hasMoreRef.current = false;
      currentPageRef.current = 1;
      loadCategoryData(selectedCategory, filters, 1);
    }, 600);
    return () => { if (filtersDebounceRef.current) clearTimeout(filtersDebounceRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  // Cargar perfil del usuario logueado
  useEffect(() => {
    const user = auth.currentUser;
    if (user && !artistData) {
      useProfileStore.getState()
        .loadProfile(user.uid, user.photoURL, user.displayName)
        .catch(() => {});
    }
  }, [artistData]);

  // Cargar detalles completos cuando cambia el artista visible
  useEffect(() => {
    if (!topCard || topCard.type !== 'artist') { setArtistFullData(null); return; }

    const artist = topCard as Artist;
    const userId = artist.id;
    if (!userId || userId.startsWith('mock-')) { setArtistFullData(null); return; }

    if (detailsCache.current.has(userId)) {
      setArtistFullData(detailsCache.current.get(userId));
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const timeout = new Promise<never>((_, r) => setTimeout(() => r(new Error('Timeout')), 3000));
        const profileRes = await Promise.race([artistsService.getArtistById(userId), timeout]);
        if (cancelled) return;

        const profileData = profileRes as any;
        const ownData = auth.currentUser?.uid === userId ? useProfileStore.getState().artistData : null;

        const basicData = {
          services: [], portfolio: [], videos: [],
          workExperience: [], education: [],
          socialMedia: profileData?.socialMedia ?? (artist as any).socialMedia ?? null,
          description: profileData?.description || profileData?.details?.description
            || (auth.currentUser?.uid === userId ? ownData?.description ?? null : null) || null,
        };
        if (!cancelled) setArtistFullData(basicData);

        const [servicesRes, portfolioRes] = await Promise.allSettled([
          Promise.race([servicesService.getUserServices(userId), timeout]),
          Promise.race([portfolioService.getUserPortfolio(userId), timeout]),
        ]);
        if (cancelled) return;

        const firstNonEmpty = (...s: any[][]): any[] => s.find(a => Array.isArray(a) && a.length > 0) ?? [];
        const portfolioData = portfolioRes.status === 'fulfilled' ? (portfolioRes.value as any) : {};

        const fullData = {
          ...basicData,
          services:       servicesRes.status === 'fulfilled' && Array.isArray(servicesRes.value) ? servicesRes.value : [],
          portfolio:      Array.isArray(portfolioData.photos) ? portfolioData.photos : [],
          videos:         Array.isArray(portfolioData.videos) ? portfolioData.videos : [],
          workExperience: firstNonEmpty(profileData?.details?.workExperience, profileData?.workExperience, ownData?.workExperience as any[], artist.workExperience as any[]).filter((x: any) => x?.company || x?.position),
          education:      firstNonEmpty(profileData?.details?.education, profileData?.education, ownData?.studies as any[], artist.education as any[]).filter((x: any) => x?.institution || x?.degree),
        };
        detailsCache.current.set(userId, fullData);
        if (!cancelled) setArtistFullData(fullData);
      } catch {
        if (!cancelled) {
          const ownData = auth.currentUser?.uid === userId ? useProfileStore.getState().artistData : null;
          setArtistFullData(ownData ? {
            services: [], portfolio: [], videos: [],
            workExperience: ownData.workExperience || [],
            education: ownData.studies || [],
            socialMedia: null, description: ownData.description || null,
          } : null);
        }
      }
    })();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topCard?.id]);

  // ── Navegación ───────────────────────────────────────────────────────────────
  const handleNext = useCallback(() => {
    if (Platform.OS !== 'web') Haptics.selectionAsync();
    const next = currentIndex + 1;
    if (next >= stack.length) return;
    setCurrentIndex(next);
    scrollRef.current?.scrollTo({ y: 0, animated: true });
    // Auto-cargar más cuando quedan ≤4 cards
    if (stack.length - next <= 4 && hasMoreRef.current && !isLoadingMoreRef.current) {
      loadCategoryData(selectedCategory, filters, currentPageRef.current + 1);
    }
  }, [currentIndex, stack.length, selectedCategory, filters, loadCategoryData]);

  const handlePrev = useCallback(() => {
    if (currentIndex <= 0) return;
    if (Platform.OS !== 'web') Haptics.selectionAsync();
    setCurrentIndex(i => i - 1);
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  }, [currentIndex]);

  // ── Conectar / Seguir ────────────────────────────────────────────────────────
  const handleConnect = useCallback(() => {
    if (!topCard) return;
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setConnectedIds(prev => {
      const next = new Set(prev);
      if (next.has(topCard.id)) {
        next.delete(topCard.id);
      } else {
        next.add(topCard.id);
      }
      return next;
    });
  }, [topCard]);

  // ── Otros handlers ───────────────────────────────────────────────────────────
  const handleCategoryChange = useCallback((cat: CategoryId) => {
    if (Platform.OS !== 'web') Haptics.selectionAsync();
    setSelectedCategory(cat);
    setMenuOpen(false);
  }, []);

  const handleResetFilters = useCallback(() => setFilters(DEFAULT_FILTERS), []);

  const handleReset = useCallback(() => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    handleResetFilters();
    loadCategoryData(selectedCategory);
  }, [selectedCategory, loadCategoryData, handleResetFilters]);

  return {
    artistData,
    selectedCategory, stack, currentIndex,
    menuOpen, setMenuOpen,
    showFilters, setShowFilters,
    showSearch, setShowSearch,
    filters, setFilters,
    isLoading, isLoadingMore, error,
    hireModalArtist, setHireModalArtist,
    artistFullData,
    connectedIds,
    scrollRef,
    topCard,
    handleCategoryChange,
    handleNext, handlePrev, handleConnect,
    handleResetFilters, handleReset, loadCategoryData,
  };
}
