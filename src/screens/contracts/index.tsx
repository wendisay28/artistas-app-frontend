// src/pages/contracts/index.tsx

import React, { useState, useCallback, useEffect } from 'react';
import { useContracts } from './hooks/useContracts';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParams } from '../../navigation/RootStack';
import { Colors } from '../../theme/colors';
import { useThemeStore } from '../../store/themeStore';

// ── Shared
import TopBar from '../../components/shared/TopBar';

// ── Hiring components
import HiringHeader from './components/header/HiringHeader';
import SearchBar from './components/header/SearchBar';
import AvailabilitySwitch from './components/shared/AvailabilitySwitch';
import RealTimeOfferBanner from './components/shared/RealTimeOfferBanner';
import OffersListTab from './components/tabs/OffersListTab';
import MyOffersTab from './components/tabs/MyOffersTab';
import SavedOffersTab from './components/tabs/SavedOffersTab';
import AppliedOfferCard from './components/tabs/AppliedOfferCard';
import ActiveServiceCard from './components/tabs/ActiveServiceCard';
import CompletedServiceCard from './components/tabs/CompletedServiceCard';
import AvailabilityModal from './components/modals/AvailabilityModal';
import CreateOfferModal from './components/modals/CreateOfferModal';
import FilterModal from './components/modals/FilterModal';
import OfferDetailModal from './components/modals/OfferDetailModal';
import ApplicantsModal from './components/modals/ApplicantsModal';

// ── Types
import type { TabType, ExploreSubTab, UrgentSubTab, Offer, MyOffer, SavedOffer, OfferFormData, Applicant, OfferFilters, ActiveContract, CompletedContract, MilestoneState, ServiceType } from '../../types/hiring';
import { contractsService } from '../../services/api/contracts';

// ── Modals de contratación
import ServiceTypeModal from './components/modals/ServiceTypeModal';

// ── Push notifications
import {
  schedulePreServiceReminder,
  scheduleEndOfServiceReminder,
  scheduleArrivalNudge,
  notifyChangeRequest,
  notifyPaymentReleased,
} from '../../services/notifications/hiringNotifications';

// ── Tipo de cuenta (vendrá del contexto de auth en producción)
type AccountType = 'artist' | 'client';

// ── Mock data ────────────────────────────────────────────────────────────────

const MOCK_OFFERS: Offer[] = [
  {
    id: '1',
    title: 'Muralista para restaurante',
    description: 'Buscamos un muralista para decorar la fachada de nuestro restaurante en el centro de Madrid. Estilo contemporáneo con temática gastronómica.',
    offer_type: 'hiring',
    budget_min: 800,
    budget_max: 1500,
    location: 'Madrid',
    date: '2026-03-15',
    category: 'Pintor',
    is_urgent: true,
    poster_id: 'u1',
    poster_name: 'Restaurante El Jardín',
    created_date: '2026-02-10',
  },
  {
    id: '2',
    title: 'Fotógrafo para evento corporativo',
    description: 'Necesitamos fotógrafo profesional para cubrir un evento corporativo de 4 horas. Incluye edición y entrega digital.',
    offer_type: 'event',
    budget_min: 300,
    budget_max: 500,
    location: 'Barcelona',
    date: '2026-03-20',
    category: 'Fotógrafo',
    poster_id: 'u2',
    poster_name: 'Tech Solutions S.L.',
    created_date: '2026-02-12',
  },
  {
    id: '3',
    title: 'DJ para fiesta privada',
    description: 'Buscamos DJ para fiesta de cumpleaños. Música variada: house, reggaeton, pop. Equipo propio.',
    offer_type: 'gig',
    budget_min: 200,
    budget_max: 400,
    location: 'Valencia',
    date: '2026-04-01',
    category: 'DJ',
    poster_id: 'u3',
    poster_name: 'Ana García',
    created_date: '2026-02-13',
  },
  {
    id: '4',
    title: 'Colaboración artística - Expo conjunta',
    description: 'Busco artista visual para organizar una exposición conjunta en galería del centro. Compartimos gastos y beneficios.',
    offer_type: 'collaboration',
    location: 'Sevilla',
    category: 'Pintor',
    poster_id: 'u4',
    poster_name: 'Lucía Fernández',
    created_date: '2026-02-14',
  },
];

const MOCK_REAL_TIME_OFFERS = [
  {
    id: 'rt1',
    title: 'Cantante para fiesta de cumpleaños',
    budget_max: 300,
    location: 'Madrid',
    category: 'Músico',
    expires_at: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(), // 3h desde ahora
  },
];

const MOCK_URGENT_OFFERS: Offer[] = [
  {
    id: 'u1',
    title: 'Fotógrafo urgente para boda hoy',
    description: 'Se canceló nuestro fotógrafo, necesitamos reemplazo inmediato para ceremonia a las 5pm.',
    offer_type: 'hiring',
    budget_min: 500,
    budget_max: 800,
    location: 'Madrid',
    date: '2026-03-08',
    category: 'Fotógrafo',
    is_urgent: true,
    poster_id: 'u5',
    poster_name: 'Hotel Palace',
    created_date: '2026-03-08',
  },
  {
    id: 'u2',
    title: 'DJ para evento corporativo emergente',
    description: 'Necesitamos DJ para evento inesperado esta noche. 4 horas, equipo propio.',
    offer_type: 'gig',
    budget_min: 350,
    budget_max: 600,
    location: 'Barcelona',
    date: '2026-03-08',
    category: 'DJ',
    is_urgent: true,
    poster_id: 'u6',
    poster_name: 'Eventos Pro S.L.',
    created_date: '2026-03-08',
  },
  {
    id: 'ua1',
    title: 'Músico para gala benéfica',
    description: 'Gala de recaudación de fondos, necesitamos músico para piano durante 2 horas.',
    offer_type: 'gig',
    budget_min: 400,
    budget_max: 600,
    location: 'Valencia',
    date: '2026-03-08',
    category: 'Músico',
    is_urgent: true,
    poster_id: 'u7',
    poster_name: 'Fundación Esperanza',
    created_date: '2026-03-08',
  },
  {
    id: 'up1',
    title: 'Catering para evento corporativo',
    description: 'Servicio de catering para 100 personas, menú vegetariano.',
    offer_type: 'hiring',
    budget_min: 800,
    budget_max: 1200,
    location: 'Madrid',
    date: '2026-03-08',
    category: 'Chef',
    is_urgent: true,
    poster_id: 'u8',
    poster_name: 'TechCorp',
    created_date: '2026-03-08',
  },
];

// Contratos activos — "En Curso"
const INITIAL_MILESTONES: MilestoneState = {
  arrival_checked: false,
  departure_checked: false,
  delivery_submitted: false,
  delivery_accepted: false,
  change_requested: false,
  change_request_used: false,
};

const MOCK_ACTIVE_CONTRACTS: ActiveContract[] = [
  {
    id: 'ac1',
    title: 'DJ para evento corporativo emergente',
    description: 'Necesitamos DJ para evento inesperado esta noche. 4 horas, equipo propio.',
    offer_type: 'gig',
    budget_min: 350,
    budget_max: 600,
    location: 'Barcelona',
    date: '2026-03-08',
    category: 'DJ',
    is_urgent: true,
    poster_id: 'u6',
    poster_name: 'Eventos Pro S.L.',
    created_date: '2026-03-08',
    service_type: 'presencial',
    amount: 480000,
    currency: 'COP',
    milestones: { ...INITIAL_MILESTONES },
  },
  {
    id: 'ac2',
    title: 'Sesión UGC para campaña de redes',
    description: 'Grabación de contenido UGC para marca de ropa. Incluye visita + entrega de videos editados.',
    offer_type: 'hiring',
    budget_min: 400,
    budget_max: 700,
    location: 'Medellín',
    date: '2026-03-08',
    category: 'Creador de contenido',
    is_urgent: true,
    poster_id: 'u7',
    poster_name: 'Moda Urbana',
    created_date: '2026-03-08',
    service_type: 'hibrido',
    amount: 600000,
    currency: 'COP',
    milestones: { ...INITIAL_MILESTONES },
  },
  {
    id: 'ac3',
    title: 'Diseño de logo para startup',
    description: 'Diseño de identidad visual completa: logo, paleta de colores y tipografía.',
    offer_type: 'hiring',
    budget_min: 200,
    budget_max: 400,
    location: 'Remoto',
    date: '2026-03-10',
    category: 'Diseñador',
    poster_id: 'u8',
    poster_name: 'Startup XYZ',
    created_date: '2026-03-06',
    service_type: 'digital',
    amount: 320000,
    currency: 'COP',
    milestones: { ...INITIAL_MILESTONES },
  },
];

// Contratos finalizados — "Finalizadas"
const MOCK_COMPLETED_CONTRACTS: CompletedContract[] = [
  {
    id: 'cc1',
    title: 'Fotografía para boda',
    description: 'Servicio fotográfico completo para boda. Evento finalizado exitosamente.',
    offer_type: 'hiring',
    budget_min: 600,
    budget_max: 1000,
    location: 'Madrid',
    date: '2026-03-07',
    category: 'Fotógrafo',
    is_urgent: true,
    poster_id: 'u9',
    poster_name: 'Boda Perfecta',
    created_date: '2026-03-07',
    service_type: 'presencial',
    amount: 850000,
    currency: 'COP',
    milestones: {
      arrival_checked: true,
      arrival_time: '2026-03-07T17:05:00.000Z',
      departure_checked: true,
      departure_time: '2026-03-07T23:30:00.000Z',
      delivery_submitted: false,
      delivery_accepted: false,
      change_requested: false,
      change_request_used: false,
    },
    completed_at: '2026-03-07T23:35:00.000Z',
    payment_status: 'released',
    artist_rating: 5,
  },
  {
    id: 'cc2',
    title: 'Vídeo promocional para restaurante',
    description: 'Producción audiovisual: grabación + edición + entrega de 3 videos cortos.',
    offer_type: 'hiring',
    budget_min: 500,
    budget_max: 900,
    location: 'Bogotá',
    date: '2026-03-06',
    category: 'Videomaker',
    poster_id: 'u10',
    poster_name: 'La Paella D\'Oro',
    created_date: '2026-03-04',
    service_type: 'hibrido',
    amount: 720000,
    currency: 'COP',
    milestones: {
      arrival_checked: true,
      arrival_time: '2026-03-06T10:00:00.000Z',
      departure_checked: true,
      departure_time: '2026-03-06T14:00:00.000Z',
      delivery_submitted: true,
      delivery_link: 'https://drive.google.com/videos-restaurante',
      delivery_accepted: true,
      change_requested: false,
      change_request_used: false,
    },
    completed_at: '2026-03-07T09:00:00.000Z',
    payment_status: 'released',
  },
];

const MOCK_MY_OFFERS: MyOffer[] = [
  {
    id: 'm1',
    title: 'Clases de guitarra a domicilio',
    description: 'Ofrezco clases particulares de guitarra española y eléctrica. Todos los niveles.',
    offer_type: 'gig',
    budget_min: 25,
    budget_max: 40,
    location: 'Madrid',
    status: 'active',
    views_count: 124,
    applicants_count: 3,
    poster_id: 'me',
    created_date: '2026-02-08',
  },
  {
    id: 'm2',
    title: 'Sesión de fotos artística',
    description: 'Sesión de fotografía artística en estudio o exteriores. Incluye 20 fotos editadas.',
    offer_type: 'hiring',
    budget_min: 150,
    budget_max: 250,
    status: 'draft',
    views_count: 0,
    applicants_count: 0,
    poster_id: 'me',
    created_date: '2026-02-11',
  },
];

const MOCK_SAVED_OFFERS: SavedOffer[] = [
  { ...MOCK_OFFERS[0], saved_date: '2026-02-12' },
  { ...MOCK_OFFERS[3], saved_date: '2026-02-14' },
];

const MOCK_APPLICANTS: Applicant[] = [
  {
    id: 'a1',
    user_id: 'u10',
    name: 'Pedro Sánchez',
    category: 'Muralista',
    rating: 4.9,
    reviews_count: 32,
    message: 'Tengo 8 años de experiencia en murales urbanos. Me encantaría participar.',
    applied_date: '2026-02-11',
    offer_id: 'm1',
  },
  {
    id: 'a2',
    user_id: 'u11',
    name: 'Laura Martín',
    category: 'Artista Visual',
    rating: 4.7,
    reviews_count: 18,
    message: 'Mi portafolio incluye trabajos similares. Disponible inmediatamente.',
    applied_date: '2026-02-12',
    offer_id: 'm1',
  },
];

// ── Componente principal ─────────────────────────────────────────────────────

interface ContractsScreenProps {
  // En producción esto vendrá del contexto de autenticación
  accountType?: AccountType;
}

export default function ContractsScreen({ accountType = 'artist' }: ContractsScreenProps) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation() as NativeStackNavigationProp<RootStackParams>;
  const { isDark } = useThemeStore();
  const isArtist = accountType === 'artist';

  // ── State principal
  const [activeTab, setActiveTab] = useState<TabType>('urgent');
  const [exploreSubTab, setExploreSubTab] = useState<ExploreSubTab>('general');
  const [urgentSubTab, setUrgentSubTab] = useState<UrgentSubTab>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [hasActiveFilters, setHasActiveFilters] = useState(false);
  
  // ── Estado del modal de disponibilidad
  const [availabilityModalVisible, setAvailabilityModalVisible] = useState(false);
  const [hasSeenAvailabilityModal, setHasSeenAvailabilityModal] = useState(false);

  // ── Estado artista
  const [isAvailable, setIsAvailable] = useState(false);

  // ── Contratos reales desde backend (fallback a mock si API falla)
  const {
    activeContracts: realActive,
    completedContracts: realCompleted,
    isLoading: contractsLoading,
    refresh: refreshContracts,
    updateContractStatus,
    setActiveContracts,
    setCompletedContracts,
  } = useContracts(accountType);

  const [activeContracts, setLocalActiveContracts] = useState<ActiveContract[]>(MOCK_ACTIVE_CONTRACTS);
  const [completedContracts, setLocalCompletedContracts] = useState<CompletedContract[]>(MOCK_COMPLETED_CONTRACTS);

  // Cuando llegan datos reales, reemplazar mock (si hay datos del backend)
  useEffect(() => {
    if (!contractsLoading && realActive.length > 0) setLocalActiveContracts(realActive);
  }, [realActive, contractsLoading]);

  useEffect(() => {
    if (!contractsLoading && realCompleted.length > 0) setLocalCompletedContracts(realCompleted);
  }, [realCompleted, contractsLoading]);

  // ── Saved offers
  const [savedOfferIds, setSavedOfferIds] = useState<Set<string>>(
    new Set(MOCK_SAVED_OFFERS.map((o) => o.id))
  );

  // ── Modals
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [applicantsModalVisible, setApplicantsModalVisible] = useState(false);
  const [acceptModalOffer, setAcceptModalOffer] = useState<Offer | null>(null);

  // ── Estados para modals
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [selectedOfferId, setSelectedOfferId] = useState<string>('');
  const [filters, setFilters] = useState<OfferFilters>({
    types: [],
    categories: [],
    budget_max: 0,
    location: '',
    urgent_only: false,
  });

  // ── Handlers
  const handleOfferPress = useCallback((offerId: string) => {
    const offer = MOCK_OFFERS.find((o) => o.id === offerId) ?? null;
    setSelectedOffer(offer);
    setDetailModalVisible(true);
  }, []);

  const handleCloseDetailModal = useCallback(() => {
    setDetailModalVisible(false);
    setSelectedOffer(null);
  }, []);

  const handleSavePress = useCallback((offerId: string) => {
    setSavedOfferIds((prev) => {
      const next = new Set(prev);
      next.has(offerId) ? next.delete(offerId) : next.add(offerId);
      return next;
    });
  }, []);

  const handleViewApplicants = useCallback((offerId: string) => {
    setSelectedOfferId(offerId);
    setApplicantsModalVisible(true);
  }, []);

  const handleTabChange = useCallback((tab: TabType) => {
    setActiveTab(tab);
    
    // Mostrar modal de disponibilidad si es artista y entra a Urgentes por primera vez
    if (isArtist && tab === 'urgent' && !hasSeenAvailabilityModal && !isAvailable) {
      setAvailabilityModalVisible(true);
      setHasSeenAvailabilityModal(true);
    }
  }, [isArtist, hasSeenAvailabilityModal, isAvailable]);

  const handleAvailabilityToggle = useCallback((value: boolean) => {
    setIsAvailable(value);
  }, []);

  const handleCreateOffer = useCallback((data: OfferFormData) => {
    console.log('Creating offer:', data);
    // Aquí iría la lógica para crear la oferta
    setCreateModalVisible(false);
  }, []);

  const handleApplyFilters = useCallback((newFilters: OfferFilters) => {
    setFilters(newFilters);
    setHasActiveFilters(
      newFilters.categories.length > 0 ||
      newFilters.budget_max > 0 ||
      newFilters.location !== '' ||
      newFilters.urgent_only
    );
    setFilterModalVisible(false);
  }, []);

  const handleApplyPress = useCallback((offerId: string) => {
    console.log('Applying to offer:', offerId);
    // Aquí iría la lógica para aplicar a la oferta
  }, []);

  const handleActivateAvailability = () => {
    setIsAvailable(true);
    setAvailabilityModalVisible(false);
  };

  const handleSkipAvailability = () => {
    setAvailabilityModalVisible(false);
  };

  const handleCloseCreateModal = () => setCreateModalVisible(false);
  const handleCloseFilterModal = () => setFilterModalVisible(false);
  const handleCloseApplicantsModal = () => setApplicantsModalVisible(false);

  const handleRealTimeOfferPress = useCallback((offerId: string) => {
    const offer = MOCK_OFFERS.find((o) => o.id === offerId) ?? null;
    setSelectedOffer(offer);
    setDetailModalVisible(true);
  }, []);

  // ── Aceptar oferta urgente → crea contrato activo en backend + estado local
  const handleAcceptOffer = useCallback(async (offerId: string, serviceType: ServiceType) => {
    const offer = MOCK_URGENT_OFFERS.find((o) => o.id === offerId) ?? null;
    if (!offer) return;

    const now = new Date().toISOString();
    const deadline48h = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();

    // Crear en backend
    try {
      await contractsService.createContract({
        artistId: offer.poster_id,
        serviceType,
        serviceName: offer.title,
        description: offer.description,
        amount: offer.budget_max,
        serviceDate: offer.date,
      });
      refreshContracts(); // recargar lista real
    } catch (err) {
      console.warn('[Contracts] Error creando contrato en backend:', err);
    }

    // Actualizar estado local inmediatamente (optimistic update)
    const newContract: ActiveContract = {
      ...offer,
      service_type: serviceType,
      amount: offer.budget_max,
      currency: 'COP',
      milestones: { ...INITIAL_MILESTONES },
      service_start: now,
      deadline: deadline48h,
    };

    setLocalActiveContracts((prev) => [newContract, ...prev]);
    setAcceptModalOffer(null);
    setUrgentSubTab('in_progress');

    // Notificaciones según tipo de servicio
    if (serviceType !== 'digital' && offer.date) {
      const serviceISO = new Date(offer.date).toISOString();
      const clientName = offer.poster_name ?? 'el cliente';
      const loc = offer.location ?? '';
      await schedulePreServiceReminder(serviceISO, clientName, loc);
      await scheduleEndOfServiceReminder(serviceISO, 4, clientName);
      await scheduleArrivalNudge(serviceISO);
    }
  }, []);

  // ── Hitos — actualizar estado de un contrato activo
  const handleMilestoneUpdate = useCallback((contractId: string, updated: Partial<MilestoneState>) => {
    setLocalActiveContracts((prev) => {
      const contract = prev.find((c) => c.id === contractId);
      // Notificar al artista si el cliente acaba de solicitar un cambio
      if (updated.change_requested && contract && !contract.milestones.change_requested) {
        notifyChangeRequest(contract.poster_name ?? 'El cliente');
      }
      return prev.map((c) =>
        c.id === contractId
          ? { ...c, milestones: { ...c.milestones, ...updated } }
          : c
      );
    });
  }, []);

  // ── Completar contrato — mueve de "En Curso" a "Finalizadas"
  const handleCompleteContract = useCallback(async (contractId: string) => {
    setLocalActiveContracts((prev) => {
      const contract = prev.find((c) => c.id === contractId);
      if (!contract) return prev;
      const completed: CompletedContract = {
        ...contract,
        completed_at: new Date().toISOString(),
        payment_status: 'released',
      };
      setLocalCompletedContracts((old) => [completed, ...old]);
      const amount = contract.amount
        ? `$${contract.amount.toLocaleString('es-CO', { maximumFractionDigits: 0 })}`
        : '';
      notifyPaymentReleased(contract.poster_name ?? 'el cliente', amount);
      return prev.filter((c) => c.id !== contractId);
    });
    // Sincronizar con backend
    try {
      await updateContractStatus(contractId, 'completed');
    } catch (err) {
      console.warn('[Contracts] Error completando contrato en backend:', err);
    }
  }, [updateContractStatus]);

  // ── Calificar cliente
  const handleRateClient = useCallback((contractId: string, rating: number, _review: string) => {
    setLocalCompletedContracts((prev) =>
      prev.map((c) => c.id === contractId ? { ...c, artist_rating: rating } : c)
    );
  }, []);

  // ── Filtrar ofertas por búsqueda
  const filteredOffers = MOCK_OFFERS.filter(
    (o) =>
      searchQuery === '' ||
      o.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUrgentOffers = MOCK_URGENT_OFFERS.filter(
    (o) =>
      searchQuery === '' ||
      o.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ── Ofertas en tiempo real (solo si el artista está disponible)
  const realTimeOffers = isArtist && isAvailable ? MOCK_REAL_TIME_OFFERS : [];

  // ── Ofertas guardadas actualizadas
  const currentSavedOffers = MOCK_SAVED_OFFERS.filter((o) => savedOfferIds.has(o.id));

  // ── Aplicantes de la oferta seleccionada
  const selectedOfferApplicants = MOCK_APPLICANTS.filter(
    (a) => a.offer_id === selectedOfferId
  );

  // ── Empty state helper
  const EmptyTabState = ({ icon, title, sub }: { icon: string; title: string; sub: string }) => (
    <View style={urgentStyles.empty}>
      <View style={[urgentStyles.emptyIcon, isDark && { backgroundColor: 'rgba(139,92,246,0.12)' }]}>
        <Ionicons name={icon as any} size={36} color={isDark ? '#A78BFA' : '#9ca3af'} />
      </View>
      <Text style={[urgentStyles.emptyTitle, isDark && { color: '#FFFFFF' }]}>{title}</Text>
      <Text style={[urgentStyles.emptySub, isDark && { color: '#71717A' }]}>{sub}</Text>
    </View>
  );

  // ── Render del tab activo
  const renderActiveTab = () => {
    switch (activeTab) {
      case 'explore':
        return (
          <OffersListTab
            offers={exploreSubTab === 'general' ? filteredOffers : currentSavedOffers}
            savedOfferIds={savedOfferIds}
            onOfferPress={handleOfferPress}
            onSavePress={handleSavePress}
          />
        );
      case 'urgent':
        // Para Pendientes: usar OffersListTab con botón "Aceptar oferta"
        if (urgentSubTab === 'pending') {
          return (
            <OffersListTab
              offers={filteredUrgentOffers}
              savedOfferIds={savedOfferIds}
              onOfferPress={handleOfferPress}
              onSavePress={handleSavePress}
              onAcceptPress={(offerId) => {
                const offer = MOCK_URGENT_OFFERS.find((o) => o.id === offerId) ?? null;
                if (offer) setAcceptModalOffer(offer);
              }}
            />
          );
        }
        
        // En Curso — tarjetas con hitos
        if (urgentSubTab === 'in_progress') {
          const filtered = activeContracts.filter(
            (c) =>
              searchQuery === '' ||
              c.title.toLowerCase().includes(searchQuery.toLowerCase())
          );
          return (
            <ScrollView style={[urgentStyles.container, isDark && { backgroundColor: '#0a0618' }]} showsVerticalScrollIndicator={false}>
              {filtered.length === 0 ? (
                <EmptyTabState
                  icon="play-circle-outline"
                  title="Sin servicios en curso"
                  sub="Cuando aceptes una oferta aparecerá aquí."
                />
              ) : (
                filtered.map((contract) => (
                  <ActiveServiceCard
                    key={contract.id}
                    contract={contract}
                    onMilestoneUpdate={handleMilestoneUpdate}
                    onComplete={handleCompleteContract}
                    onMessage={() =>
                      navigation.navigate('Chat', {
                        contractId: contract.id,
                        contractTitle: contract.title,
                        otherUserId: contract.poster_id,
                        otherUserName: contract.poster_name ?? 'Cliente',
                      })
                    }
                  />
                ))
              )}
            </ScrollView>
          );
        }

        // Finalizadas — historial con pago y calificación
        const filteredCompleted = completedContracts.filter(
          (c) =>
            searchQuery === '' ||
            c.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
        return (
          <ScrollView style={[urgentStyles.container, isDark && { backgroundColor: '#0a0618' }]} showsVerticalScrollIndicator={false}>
            {filteredCompleted.length === 0 ? (
              <EmptyTabState
                icon="checkmark-done-circle-outline"
                title="Sin servicios finalizados"
                sub="Aquí verás el historial de trabajos completados."
              />
            ) : (
              filteredCompleted.map((contract) => (
                <CompletedServiceCard
                  key={contract.id}
                  contract={contract}
                  onRate={handleRateClient}
                />
              ))
            )}
          </ScrollView>
        );
        
      case 'mine':
        return (
          <MyOffersTab
            offers={MOCK_MY_OFFERS}
            onOfferPress={handleOfferPress}
            onViewApplicantsPress={handleViewApplicants}
            onCreatePress={() => setCreateModalVisible(true)}
          />
        );
    }
  };

  return (
    <View style={[styles.root, isDark && { backgroundColor: '#0a0618' }]}>
      {/* TopBar */}
      <TopBar
        title="Contratación"
        topInset={insets.top}
        rightActions={
          <Pressable
            onPress={() => setCreateModalVisible(true)}
            style={({ pressed }) => [styles.createBtn, pressed && { opacity: 0.7 }]}
          >
            <Ionicons name="add" size={20} color={Colors.white} />
          </Pressable>
        }
      />

      {/* Tabs */}
      <HiringHeader
        activeTab={activeTab}
        onTabChange={handleTabChange}
        unreadCount={MOCK_APPLICANTS.length}
        urgentCount={MOCK_URGENT_OFFERS.length}
        myOffersCount={MOCK_MY_OFFERS.filter((o) => o.status === 'active').length}
        exploreSubTab={exploreSubTab}
        onExploreSubTabChange={setExploreSubTab}
        urgentSubTab={urgentSubTab}
        onUrgentSubTabChange={setUrgentSubTab}
        isArtist={isArtist}
        isAvailable={isAvailable}
        onAvailabilityToggle={handleAvailabilityToggle}
        realTimeOffersCount={realTimeOffers.length}
      />

      {/* Search + filtros — solo para explorar y mis ofertas */}
      {activeTab !== 'urgent' && (
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onFilterPress={() => setFilterModalVisible(true)}
          hasActiveFilters={hasActiveFilters}
          placeholder={
            activeTab === 'explore'
              ? exploreSubTab === 'general' 
                ? 'Buscar ofertas...'
                : 'Buscar guardadas...'
              : 'Buscar mis ofertas...'
          }
        />
      )}

      {/* Contenido del tab activo */}
      <View style={styles.content}>
        {renderActiveTab()}
      </View>

      {/* ── Modals ── */}
      <AvailabilityModal
        visible={availabilityModalVisible}
        onActivate={handleActivateAvailability}
        onSkip={handleSkipAvailability}
        onClose={() => setAvailabilityModalVisible(false)}
      />
      
      <CreateOfferModal
        visible={createModalVisible}
        onClose={handleCloseCreateModal}
        onSubmit={handleCreateOffer}
      />

      <FilterModal
        visible={filterModalVisible}
        onClose={handleCloseFilterModal}
        onApply={handleApplyFilters}
        initialFilters={filters}
      />

      <OfferDetailModal
        visible={detailModalVisible}
        onClose={handleCloseDetailModal}
        offer={selectedOffer}
        onSavePress={selectedOffer ? () => handleSavePress(selectedOffer.id) : undefined}
        onApplyPress={selectedOffer ? () => handleApplyPress(selectedOffer.id) : undefined}
      />

      <ApplicantsModal
        visible={applicantsModalVisible}
        onClose={handleCloseApplicantsModal}
        offerTitle={selectedOffer?.title ?? ''}
        applicants={selectedOfferApplicants}
      />

      {/* Modal para seleccionar tipo de servicio al aceptar oferta urgente */}
      <ServiceTypeModal
        visible={!!acceptModalOffer}
        offerTitle={acceptModalOffer?.title ?? ''}
        onClose={() => setAcceptModalOffer(null)}
        onConfirm={(serviceType) => {
          if (acceptModalOffer) handleAcceptOffer(acceptModalOffer.id, serviceType);
        }}
      />
    </View>
  );
}

// ── Estilos ───────────────────────────────────────────────────────────────────────

const urgentStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingVertical: 8,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    gap: 12,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 17,
    fontFamily: 'PlusJakartaSans_700Bold',
    color: '#374151',
  },
  emptySub: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#9ca3af',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  createBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
});