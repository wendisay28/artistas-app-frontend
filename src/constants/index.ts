// src/constants/index.ts
// Barrel export para todas las constantes

// Artistas
export {
  getCategoryById as getArtistCategoryById,
  getDisciplineById as getArtistDisciplineById,
  getRoleById as getArtistRoleById,
  getLocalizedCategoryName as getArtistCategoryName,
  getLocalizedDisciplineName as getArtistDisciplineName,
  getLocalizedRoleName as getArtistRoleName,
  searchCategories as searchArtistCategories,
  getDisciplinesByCategory as getArtistDisciplinesByCategory,
} from './artistCategories';

export type {
  Role,
  Discipline,
  Category,
  CategoryStrings,
} from './artistCategories';

// Eventos
export {
  // Constants
  EVENT_CATEGORIES,
  EVENT_STRINGS_ES,
  // Helper functions
  getEventCategoryStrings,
  getLocalizedEventCategoryName,
  getLocalizedEventTypeName,
  getLocalizedEventSubtypeName,
  getEventCategoryById,
  getEventTypeById,
  getEventSubtypeById,
  getEventTypesByCategory,
  getEventSubtypes,
  getSuggestedDisciplinesForEventType,
  getSuggestedFormatsForEventType,
  searchEvents,
  getSubcategoriesByCategory as getEventSubcategoriesByCategory,
  getSubcategoryById as getEventSubcategoryById,
  // Filters
  GLOBAL_EVENT_FILTERS,
  getDynamicEventFilters,
} from './eventCategories';

export type {
  EventSubtype,
  EventType,
  EventCategory,
  EventCategoryStrings,
  EventFilterDefinition,
} from './eventCategories';

// Sitios/Venues
export {
  getCategoryById as getVenueCategoryById,
  getSubcategoryById as getVenueSubcategoryById,
  getSubcategoriesByCategory as getVenueSubcategoriesByCategory,
} from './venueCategories';

export type {
  PlaceSubcategory,
  PlaceCategory,
  PlaceCategoryStrings,
} from './venueCategories';

// Galerías
export {
  getCategoryById as getGalleryCategoryById,
  getSubcategoryById as getGallerySubcategoryById,
  getSubcategoriesByCategory as getGallerySubcategoriesByCategory,
} from './galleryCategories';

export type {
  GallerySubcategory,
  GalleryCategory,
  GalleryStrings,
  TransactionTypeId,
  ConditionId,
} from './galleryCategories';
