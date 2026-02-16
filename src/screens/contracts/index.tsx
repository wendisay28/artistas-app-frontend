// src/pages/contracts/index.tsx — Pantalla de contratación (hiring)
import React, { useState, useCallback } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';

// ── Shared
import TopBar from '../../components/shared/TopBar';

// ── Hiring components
import HiringHeader from '../../components/hiring/header/HiringHeader';
import SearchBar from '../../components/hiring/header/SearchBar';
import OffersListTab from '../../components/hiring/tabs/OffersListTab';
import MyOffersTab from '../../components/hiring/tabs/MyOffersTab';
import SavedOffersTab from '../../components/hiring/tabs/SavedOffersTab';
import CreateOfferModal from '../../components/hiring/modals/CreateOfferModal';
import FilterModal from '../../components/hiring/modals/FilterModal';
import OfferDetailModal from '../../components/hiring/modals/OfferDetailModal';
import ApplicantsModal from '../../components/hiring/modals/ApplicantsModal';

// ── Types
import type { TabType, Offer, MyOffer, SavedOffer, OfferFormData, Applicant } from '../../types/hiring';

// ── Mock data (temporal hasta conectar con backend)
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
    poster_avatar: undefined,
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
  {
    ...MOCK_OFFERS[0],
    saved_date: '2026-02-12',
  },
  {
    ...MOCK_OFFERS[3],
    saved_date: '2026-02-14',
  },
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

export default function ContractsScreen() {
  const insets = useSafeAreaInsets();

  // ── State
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [hasActiveFilters, setHasActiveFilters] = useState(false);

  // ── Modals
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [applicantsModalVisible, setApplicantsModalVisible] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [savedOfferIds, setSavedOfferIds] = useState<Set<string>>(
    new Set(MOCK_SAVED_OFFERS.map((o) => o.id))
  );

  // ── Handlers
  const handleOfferPress = useCallback((offerId: string) => {
    const offer = MOCK_OFFERS.find((o) => o.id === offerId) ?? null;
    setSelectedOffer(offer);
    setDetailModalVisible(true);
  }, []);

  const handleSavePress = useCallback((offerId: string) => {
    setSavedOfferIds((prev) => {
      const next = new Set(prev);
      if (next.has(offerId)) {
        next.delete(offerId);
      } else {
        next.add(offerId);
      }
      return next;
    });
  }, []);

  const handleCreateSubmit = useCallback((data: OfferFormData) => {
    // TODO: enviar al backend
    setCreateModalVisible(false);
  }, []);

  const handleFilterApply = useCallback((filters: any) => {
    setHasActiveFilters(
      filters.types.length > 0 ||
      filters.budget_max < 10000 ||
      filters.location !== '' ||
      filters.categories.length > 0 ||
      filters.urgent_only
    );
    setFilterModalVisible(false);
  }, []);

  const handleViewApplicants = useCallback((offerId: string) => {
    setApplicantsModalVisible(true);
  }, []);

  // ── Filtrar ofertas por búsqueda
  const filteredOffers = MOCK_OFFERS.filter((o) =>
    searchQuery === '' ||
    o.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ── Render del tab activo
  const renderActiveTab = () => {
    switch (activeTab) {
      case 'all':
        return (
          <OffersListTab
            offers={filteredOffers}
            onOfferPress={handleOfferPress}
            onSavePress={handleSavePress}
          />
        );
      case 'mine':
        return (
          <MyOffersTab
            offers={MOCK_MY_OFFERS}
            onOfferPress={handleOfferPress}
            onViewApplicantsPress={handleViewApplicants}
          />
        );
      case 'saved':
        return (
          <SavedOffersTab
            offers={MOCK_SAVED_OFFERS}
            onOfferPress={handleOfferPress}
            onUnsavePress={handleSavePress}
          />
        );
    }
  };

  return (
    <View style={styles.root}>
      {/* TopBar global */}
      <TopBar
        title="Contratación"
        topInset={insets.top}
        rightActions={
          <Pressable
            onPress={() => setCreateModalVisible(true)}
            style={({ pressed }) => [styles.createBtn, pressed && { opacity: 0.7 }]}
          >
            <Ionicons name="add" size={20} color={colors.white} />
          </Pressable>
        }
      />

      {/* Tabs (all / mine / saved) */}
      <HiringHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        unreadCount={MOCK_APPLICANTS.length}
      />

      {/* Search + filter */}
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        onFilterPress={() => setFilterModalVisible(true)}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Active tab content */}
      <View style={styles.content}>
        {renderActiveTab()}
      </View>

      {/* ── Modals ── */}
      <CreateOfferModal
        visible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
        onSubmit={handleCreateSubmit}
      />

      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onApply={handleFilterApply}
      />

      <OfferDetailModal
        visible={detailModalVisible}
        onClose={() => setDetailModalVisible(false)}
        offer={selectedOffer}
        isSaved={selectedOffer ? savedOfferIds.has(selectedOffer.id) : false}
        onSavePress={() => selectedOffer && handleSavePress(selectedOffer.id)}
      />

      <ApplicantsModal
        visible={applicantsModalVisible}
        onClose={() => setApplicantsModalVisible(false)}
        offerTitle={MOCK_MY_OFFERS[0]?.title ?? ''}
        applicants={MOCK_APPLICANTS}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  createBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingBottom: 96,
  },
});
