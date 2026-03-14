// types/hiring.ts

export type OfferType = 'collaboration' | 'hiring' | 'gig' | 'event';

// Tipo de servicio — determina qué hitos aplican
export type ServiceType = 'presencial' | 'hibrido' | 'digital';

// Estado de hitos de un servicio activo
export interface MilestoneState {
  arrival_checked: boolean;
  arrival_time?: string;
  departure_checked: boolean;
  departure_time?: string;
  delivery_submitted: boolean;
  delivery_link?: string;
  delivery_accepted: boolean;
  change_requested: boolean;      // cliente pidió cambio
  change_request_used: boolean;   // si el único cambio permitido ya fue usado
}

// Datos extendidos de un contrato activo
export interface ActiveContract extends Offer {
  service_type: ServiceType;
  milestones: MilestoneState;
  service_start?: string;         // ISO timestamp cuando se aceptó
  deadline?: string;              // ISO timestamp — deadline entrega digital
  amount?: number;
  currency?: string;
}

// Datos de un contrato finalizado
export interface CompletedContract extends ActiveContract {
  completed_at: string;
  payment_status: 'pending' | 'released' | 'disputed';
  artist_rating?: number;
  client_rating?: number;
  review?: string;
}
export type OfferStatus = 'active' | 'closed' | 'draft';
export type TabType = 'explore' | 'urgent' | 'mine';
export type ExploreSubTab = 'general' | 'saved';
export type UrgentSubTab = 'pending' | 'in_progress' | 'completed';

// Oferta base
export interface Offer {
  id: string;
  title: string;
  description: string;
  offer_type: OfferType;
  budget_min?: number;
  budget_max?: number;
  location?: string;
  date?: string;
  category?: string;
  is_urgent?: boolean;
  poster_id: string;
  poster_name?: string;
  poster_avatar?: string;
  created_date: string;
  updated_date?: string;
}

// Oferta propia (con estadísticas)
export interface MyOffer extends Offer {
  status: OfferStatus;
  views_count: number;
  applicants_count: number;
}

// Oferta guardada
export interface SavedOffer extends Offer {
  saved_date: string;
}

// Aplicante a una oferta
export interface Applicant {
  id: string;
  user_id: string;
  name: string;
  category: string;
  avatar?: string;
  rating: number;
  reviews_count: number;
  message?: string;
  applied_date: string;
  offer_id: string;
}

// Formulario de creación de oferta
export interface OfferFormData {
  title: string;
  description: string;
  offer_type: OfferType;
  budget_min: string;
  budget_max: string;
  location: string;
  date: string;
  category: string;
  is_urgent: boolean;
}

// Filtros
export interface OfferFilters {
  types: OfferType[];
  budget_max: number;
  location: string;
  categories: string[];
  urgent_only: boolean;
}

// Estado de la pantalla Hiring
export interface HiringState {
  activeTab: TabType;
  exploreSubTab?: ExploreSubTab;
  urgentSubTab?: UrgentSubTab;
  searchQuery: string;
  filters: OfferFilters;
  offers: Offer[];
  urgentOffers: Offer[];
  myOffers: MyOffer[];
  savedOffers: SavedOffer[];
  isLoading: boolean;
  hasActiveFilters: boolean;
}

// Respuesta de la API
export interface OffersResponse {
  offers: Offer[];
  total: number;
  page: number;
  hasMore: boolean;
}

export interface ApplicantsResponse {
  applicants: Applicant[];
  total: number;
}

// Props para ApplicantCard
export interface ApplicantCardProps {
  applicant: Applicant;
  onViewProfile?: () => void;
  onChatPress?: () => void;
  onAcceptPress?: () => void;
}