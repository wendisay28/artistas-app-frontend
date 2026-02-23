// Barrel exports for all types
export type { Artist as ArtistProfile } from './Artist';
export type { UserProfile, UserRole, CreateUserPayload, AuthState } from './User';
export type { 
  CategoryId, 
  Category, 
  AvailabilityStatus, 
  ExploreCard, 
  Artist, 
  Event, 
  Venue, 
  GalleryItem, 
  Review,
  SwipeDirection, 
  SwipeResult, 
  ExploreFilters, 
  SortOption 
} from './explore';
export type { 
  OfferType, 
  OfferStatus, 
  TabType, 
  Offer, 
  MyOffer, 
  SavedOffer, 
  Applicant, 
  OfferFormData, 
  OfferFilters, 
  HiringState, 
  OffersResponse, 
  ApplicantsResponse, 
  ApplicantCardProps 
} from './hiring';
export * from './profile';
export type { ButtonProps, CatalogCardProps } from './ui';
