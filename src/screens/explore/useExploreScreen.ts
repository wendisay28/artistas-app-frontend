// src/screens/explore/useExploreScreen.ts
import { useState, useCallback, useRef, useEffect } from 'react';
import { Platform, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { auth } from '../../services/firebase/config';
import { useProfileStore } from '../../store/profileStore';
import { artistsService } from '../../services/api/artists';
import { servicesService } from '../../services/api/services';
import { portfolioService } from '../../services/api/portfolio';
import type { Artist, ExploreCard, CategoryId } from '../../types/explore';

// ── Cache persistente (stale-while-revalidate) ─────────────────────────────────
// Guarda el último resultado de cada categoría en AsyncStorage.
// Al abrir la app: muestra datos del cache INMEDIATAMENTE (sin spinner),
// luego refresca en segundo plano. Igual que Tinder/Instagram/TikTok.
const CACHE_PREFIX = 'explore_stack_v1_';
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutos — después el refresh es visible

async function readStackCache(category: CategoryId): Promise<ExploreCard[] | null> {
  try {
    const raw = await AsyncStorage.getItem(CACHE_PREFIX + category);
    if (!raw) return null;
    const { ts, data } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_TTL_MS) return null; // expirado
    return data as ExploreCard[];
  } catch { return null; }
}

async function writeStackCache(category: CategoryId, data: ExploreCard[]) {
  try {
    await AsyncStorage.setItem(CACHE_PREFIX + category, JSON.stringify({ ts: Date.now(), data }));
  } catch {}
}

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

// ── Artistas mock para pruebas de rendimiento ──────────────────────────────────
// Se inyectan cuando la API devuelve ≤1 artista (solo perfil propio en dev).
// Cada uno tiene imagen + portafolio de Picsum para probar prefetch real.
const MOCK_ARTISTS: ExploreCard[] = [
  { id: 'mock-1', type: 'artist', name: 'Valentina Rojas', location: 'Medellín', rating: 4.9, reviews: 87, responseTime: '2h', price: 120000, image: 'https://picsum.photos/400/600?random=101', gallery: ['https://picsum.photos/400/600?random=102', 'https://picsum.photos/400/600?random=103', 'https://picsum.photos/400/600?random=104'], tags: ['Fotografía', 'Retrato', 'Bodas'], bio: 'Fotógrafa especializada en retratos y eventos sociales. 8 años capturando momentos únicos.', availability: 'Disponible', verified: true, distance: '1.2 km' },
  { id: 'mock-2', type: 'artist', name: 'Santiago Gómez', location: 'Bogotá', rating: 4.7, reviews: 54, responseTime: '4h', price: 200000, image: 'https://picsum.photos/400/600?random=201', gallery: ['https://picsum.photos/400/600?random=202', 'https://picsum.photos/400/600?random=203', 'https://picsum.photos/400/600?random=204'], tags: ['Música', 'Jazz', 'Piano'], bio: 'Pianista de jazz con formación en Berklee. Disponible para eventos corporativos y bodas.', availability: 'Disponible', verified: true, distance: '3.5 km' },
  { id: 'mock-3', type: 'artist', name: 'Luciana Torres', location: 'Cali', rating: 4.8, reviews: 120, responseTime: '1h', price: 80000, image: 'https://picsum.photos/400/600?random=301', gallery: ['https://picsum.photos/400/600?random=302', 'https://picsum.photos/400/600?random=303', 'https://picsum.photos/400/600?random=304'], tags: ['Pintura', 'Mural', 'Arte abstracto'], bio: 'Muralista y pintora. Transformo espacios con color y narrativa visual.', availability: 'Bajo pedido', verified: false, distance: '7.1 km' },
  { id: 'mock-4', type: 'artist', name: 'Andrés Mejía', location: 'Barranquilla', rating: 4.5, reviews: 33, responseTime: '6h', price: 150000, image: 'https://picsum.photos/400/600?random=401', gallery: ['https://picsum.photos/400/600?random=402', 'https://picsum.photos/400/600?random=403', 'https://picsum.photos/400/600?random=404'], tags: ['Video', 'Cinematografía', 'Documental'], bio: 'Videógrafo y director creativo. Produzco contenido audiovisual que cuenta historias reales.', availability: 'Disponible', verified: true, distance: '2.0 km' },
  { id: 'mock-5', type: 'artist', name: 'Isabela Vargas', location: 'Pereira', rating: 4.6, reviews: 41, responseTime: '3h', price: 90000, image: 'https://picsum.photos/400/600?random=501', gallery: ['https://picsum.photos/400/600?random=502', 'https://picsum.photos/400/600?random=503', 'https://picsum.photos/400/600?random=504'], tags: ['Diseño', 'Ilustración', 'Digital'], bio: 'Diseñadora e ilustradora digital. Identidades visuales y branding para marcas creativas.', availability: 'Disponible', verified: false, distance: '4.8 km' },
  { id: 'mock-6', type: 'artist', name: 'Camilo Herrera', location: 'Manizales', rating: 4.9, reviews: 200, responseTime: '30m', price: 300000, image: 'https://picsum.photos/400/600?random=601', gallery: ['https://picsum.photos/400/600?random=602', 'https://picsum.photos/400/600?random=603', 'https://picsum.photos/400/600?random=604'], tags: ['Teatro', 'Actuación', 'Comedia'], bio: 'Actor y director de teatro con 12 años de experiencia en escena nacional e internacional.', availability: 'Ocupado', verified: true, distance: '0.8 km' },
  { id: 'mock-7', type: 'artist', name: 'Mariana Pinto', location: 'Cartagena', rating: 4.4, reviews: 28, responseTime: '8h', price: 70000, image: 'https://picsum.photos/400/600?random=701', gallery: ['https://picsum.photos/400/600?random=702', 'https://picsum.photos/400/600?random=703', 'https://picsum.photos/400/600?random=704'], tags: ['Danza', 'Ballet', 'Contemporáneo'], bio: 'Bailarina y coreógrafa. Clases, shows y montajes para eventos culturales.', availability: 'Disponible', verified: false, distance: '5.5 km' },
  { id: 'mock-8', type: 'artist', name: 'Felipe Arias', location: 'Bucaramanga', rating: 4.7, reviews: 65, responseTime: '2h', price: 180000, image: 'https://picsum.photos/400/600?random=801', gallery: ['https://picsum.photos/400/600?random=802', 'https://picsum.photos/400/600?random=803', 'https://picsum.photos/400/600?random=804'], tags: ['Escultura', 'Arte urbano', 'Instalación'], bio: 'Escultor y artista urbano. Intervenciones site-specific en espacio público y galerías.', availability: 'Disponible', verified: true, distance: '9.2 km' },
  { id: 'mock-9', type: 'artist', name: 'Daniela Castillo', location: 'Santa Marta', rating: 4.8, reviews: 93, responseTime: '1h', price: 110000, image: 'https://picsum.photos/400/600?random=901', gallery: ['https://picsum.photos/400/600?random=902', 'https://picsum.photos/400/600?random=903', 'https://picsum.photos/400/600?random=904'], tags: ['Fotografía', 'Moda', 'Editorial'], bio: 'Fotógrafa de moda y editorial. Trabajo con marcas, revistas y agencias creativas.', availability: 'Disponible', verified: true, distance: '1.9 km' },
  { id: 'mock-10', type: 'artist', name: 'Julián Mora', location: 'Medellín', rating: 4.5, reviews: 47, responseTime: '5h', price: 140000, image: 'https://picsum.photos/400/600?random=1001', gallery: ['https://picsum.photos/400/600?random=1002', 'https://picsum.photos/400/600?random=1003', 'https://picsum.photos/400/600?random=1004'], tags: ['Música', 'Guitarra', 'Acústico'], bio: 'Guitarrista y compositor. Músico para eventos, sesiones de estudio y clases.', availability: 'Disponible', verified: false, distance: '6.3 km' },
];

const MOCK_EVENTS: ExploreCard[] = [
  { id: 'e1', type: 'event', name: 'Exposición de Arte Urbano', location: 'Medellín', rating: 4.8, reviews: 23, responseTime: '24h', price: 15000, image: 'https://picsum.photos/400/600?random=10', gallery: ['https://picsum.photos/400/600?random=11', 'https://picsum.photos/400/600?random=12'], tags: ['Arte', 'Urbano', 'Colectivo'], bio: 'Exposición colectiva de arte urbano', availability: 'Disponible', verified: true, date: '2026-03-15', time: '20:00', venue: 'Galería Central', city: 'Medellín', description: 'Exposición colectiva de arte urbano con más de 20 artistas locales. Una noche para conectar con la escena creativa de la ciudad.' },
  { id: 'e2', type: 'event', name: 'Taller de Fotografía Analógica', location: 'Bogotá', rating: 4.6, reviews: 15, responseTime: '12h', price: 25000, image: 'https://picsum.photos/400/600?random=20', gallery: ['https://picsum.photos/400/600?random=21', 'https://picsum.photos/400/600?random=22'], tags: ['Fotografía', 'Taller', 'Análoga'], bio: 'Taller intensivo de fotografía analógica', availability: 'Disponible', verified: false, date: '2026-03-20', time: '18:00', venue: 'Studio Pro', city: 'Bogotá', description: 'Aprende los secretos de la fotografía en película 35mm. Revelado en cuarto oscuro incluido. Cupos muy limitados.' },
  { id: 'e3', type: 'event', name: 'Concierto Jazz en el Parque', location: 'Cali', rating: 4.9, reviews: 41, responseTime: '6h', price: 0, image: 'https://picsum.photos/400/600?random=30', gallery: ['https://picsum.photos/400/600?random=31', 'https://picsum.photos/400/600?random=32'], tags: ['Jazz', 'Concierto', 'Gratis'], bio: 'Noche de jazz al aire libre', availability: 'Disponible', verified: true, date: '2026-03-22', time: '19:30', venue: 'Parque del Perro', city: 'Cali', description: 'Una velada mágica de jazz en vivo bajo las estrellas. Entrada libre, trae tu silla y tu copa favorita.' },
  { id: 'e4', type: 'event', name: 'Festival Gastronómico Fusion', location: 'Cartagena', rating: 4.7, reviews: 88, responseTime: '8h', price: 35000, image: 'https://picsum.photos/400/600?random=40', gallery: ['https://picsum.photos/400/600?random=41', 'https://picsum.photos/400/600?random=42'], tags: ['Gastronomía', 'Cocina', 'Festival'], bio: 'Festival de cocina fusión caribeña', availability: 'Disponible', verified: true, date: '2026-03-28', time: '12:00', venue: 'Plaza de la Aduana', city: 'Cartagena', description: 'Descubre la cocina fusión caribeña de la mano de los mejores chefs del país. Degustaciones, talleres y música en vivo.' },
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
    services: any[]; portfolio: any[]; portfolioUrls: string[]; videos: any[];
    workExperience: any[]; education: any[];
    socialMedia: any; description: string | null;
  } | null>(null);
  const [artistFullDataId, setArtistFullDataId]   = useState<string | null>(null);

  const scrollRef          = useRef<ScrollView>(null);
  const currentPageRef     = useRef(1);
  const hasMoreRef         = useRef(false);
  const isLoadingMoreRef   = useRef(false);
  const detailsCache       = useRef<Map<string, any>>(new Map());
  const filtersDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isInitialFilters   = useRef(true);

  const topCard = stack[currentIndex] ?? null;

  // ── Helpers de prefetch (sin bloquear la carga inicial) ──────────────────────
  const triggerBackgroundPrefetch = useCallback((data: ExploreCard[], category: CategoryId) => {
    if (category !== 'artists') return;
    data.slice(0, 3).forEach((card, i) => {
      const imgUri = (card as any).image;
      if (imgUri) Image.prefetch(imgUri);
      if (i > 0 && card.type === 'artist' && !card.id.startsWith('mock-') && !detailsCache.current.has(card.id)) {
        const uid = card.id;
        const t = new Promise<never>((_, r) => setTimeout(() => r(new Error('t')), 6000));
        Promise.allSettled([
          Promise.race([artistsService.getArtistById(uid), t]),
          Promise.race([servicesService.getUserServices(uid), t]),
          Promise.race([portfolioService.getUserPortfolio(uid), t]),
        ]).then(([pRes, sRes, portRes]) => {
          const pData = pRes.status === 'fulfilled' ? (pRes.value as any) : {};
          const portData = portRes.status === 'fulfilled' ? (portRes.value as any) : {};
          const photos = Array.isArray(portData.photos) ? portData.photos : [];
          photos.slice(0, 3).forEach((p: any) => { if (p.imageUrl) Image.prefetch(p.imageUrl); });
          detailsCache.current.set(uid, {
            services:      sRes.status === 'fulfilled' && Array.isArray(sRes.value) ? sRes.value : [],
            portfolio:     photos,
            portfolioUrls: photos.map((p: any) => p.imageUrl).filter(Boolean) as string[],
            videos:        Array.isArray(portData.videos) ? portData.videos : [],
            workExperience: [], education: [],
            socialMedia: pData?.socialMedia ?? null,
            description: pData?.description || pData?.details?.description || null,
          });
        }).catch(() => {});
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Carga de datos ──────────────────────────────────────────────────────────
  const loadCategoryData = useCallback(async (
    category: CategoryId,
    currentFilters?: ExploreFiltersState,
    page = 1,
  ) => {
    const isFirstPage = page === 1;

    if (!isFirstPage) {
      if (isLoadingMoreRef.current) return;
      isLoadingMoreRef.current = true;
      setIsLoadingMore(true);
    }

    // ── STALE-WHILE-REVALIDATE ───────────────────────────────────────────────
    // Si es la primera página, intentar mostrar el cache ANTES de hacer el fetch.
    // El usuario ve tarjetas al instante. La red actualiza en segundo plano.
    if (isFirstPage) {
      const cached = await readStackCache(category);
      if (cached && cached.length > 0) {
        setStack(cached);
        setCurrentIndex(0);
        setIsLoading(false);           // sin spinner — ya hay datos
        triggerBackgroundPrefetch(cached, category);
        // Continuar con el fetch de red en segundo plano (sin isLoading=true)
      } else {
        setIsLoading(true);            // primera vez, sin cache → mostrar spinner
      }
      setError(null);
      currentPageRef.current = 1;
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
            // ── Inyección de mocks para pruebas de rendimiento ──────────────
            // Si la API devuelve ≤1 artista (solo perfil propio en dev),
            // completar con 10 artistas falsos para probar swipe + cache real.
            if (data.length <= 1) {
              data = [...data, ...MOCK_ARTISTS];
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
        writeStackCache(category, data); // guardar para la próxima apertura
        triggerBackgroundPrefetch(data, category);
      } else {
        setStack(prev => [...prev, ...data]);
      }
    } catch (err) {
      console.error(`[Explore] Error loading ${category} p${page}:`, err);
      // Solo mostrar error si no tenemos datos del cache para mostrar
      if (isFirstPage) {
        setStack(prev => {
          if (prev.length === 0) setError('No se pudieron cargar los datos. Intenta de nuevo.');
          return prev; // mantener el cache si ya hay datos
        });
      }
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
    if (!topCard || topCard.type !== 'artist') { setArtistFullData(null); setArtistFullDataId(null); return; }

    const artist = topCard as Artist;
    const userId = artist.id;
    if (!userId || userId.startsWith('mock-')) { setArtistFullData(null); setArtistFullDataId(null); return; }

    // Limpiar datos del artista anterior SIEMPRE antes de cargar los nuevos
    setArtistFullData(null);
    setArtistFullDataId(null);

    if (detailsCache.current.has(userId)) {
      setArtistFullData(detailsCache.current.get(userId));
      setArtistFullDataId(userId);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const timeout = new Promise<never>((_, r) => setTimeout(() => r(new Error('Timeout')), 4000));

        // Fetch todo en paralelo — no esperar getArtistById antes de services/portfolio
        const [profileRes, servicesRes, portfolioRes] = await Promise.allSettled([
          Promise.race([artistsService.getArtistById(userId), timeout]),
          Promise.race([servicesService.getUserServices(userId), timeout]),
          Promise.race([portfolioService.getUserPortfolio(userId), timeout]),
        ]);
        if (cancelled) return;

        const profileData = profileRes.status === 'fulfilled' ? (profileRes.value as any) : {};
        const portfolioData = portfolioRes.status === 'fulfilled' ? (portfolioRes.value as any) : {};
        const ownData = auth.currentUser?.uid === userId ? useProfileStore.getState().artistData : null;
        const firstNonEmpty = (...s: any[][]): any[] => s.find(a => Array.isArray(a) && a.length > 0) ?? [];

        const rawPhotos = Array.isArray(portfolioData.photos) ? portfolioData.photos : [];
        const fullData = {
          services:       servicesRes.status === 'fulfilled' && Array.isArray(servicesRes.value) ? servicesRes.value : [],
          portfolio:      rawPhotos,
          portfolioUrls:  rawPhotos.map((p: any) => p.imageUrl).filter(Boolean) as string[],
          videos:         Array.isArray(portfolioData.videos) ? portfolioData.videos : [],
          workExperience: firstNonEmpty(profileData?.details?.workExperience, profileData?.workExperience, ownData?.workExperience as any[], artist.workExperience as any[]).filter((x: any) => x?.company || x?.position),
          education:      firstNonEmpty(profileData?.details?.education, profileData?.education, ownData?.studies as any[], artist.education as any[]).filter((x: any) => x?.institution || x?.degree),
          socialMedia:    profileData?.socialMedia ?? (artist as any).socialMedia ?? null,
          description:    profileData?.description || profileData?.details?.description
                          || (auth.currentUser?.uid === userId ? ownData?.description ?? null : null) || null,
        };
        detailsCache.current.set(userId, fullData);
        if (!cancelled) { setArtistFullData(fullData); setArtistFullDataId(userId); }
      } catch {
        if (!cancelled) {
          const ownData = auth.currentUser?.uid === userId ? useProfileStore.getState().artistData : null;
          setArtistFullData(ownData ? {
            services: [], portfolio: [], videos: [],
            workExperience: ownData.workExperience || [],
            education: ownData.studies || [],
            socialMedia: null, description: ownData.description || null,
          } : null);
          setArtistFullDataId(ownData ? userId : null);
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

  // Exposes the details cache so ExploreScreen can pass preloaded data to each stacked card
  const getCardFullData = useCallback((id: string) => detailsCache.current.get(id) ?? null, []);

  return {
    artistData,
    selectedCategory, stack, currentIndex,
    menuOpen, setMenuOpen,
    showFilters, setShowFilters,
    showSearch, setShowSearch,
    filters, setFilters,
    isLoading, isLoadingMore, error,
    hireModalArtist, setHireModalArtist,
    artistFullData, artistFullDataId,
    connectedIds,
    scrollRef,
    topCard,
    handleCategoryChange,
    handleNext, handlePrev, handleConnect,
    handleResetFilters, handleReset, loadCategoryData,
    getCardFullData,
  };
}
