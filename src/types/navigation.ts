// ─────────────────────────────────────────────────────────────────────────────
// navigation.ts — Tipos de navegación de la aplicación
// ─────────────────────────────────────────────────────────────────────────────

export type RootStackParamList = {
  // Tabs principales
  Explore: undefined;
  Profile: undefined;
  Favorites: undefined;
  Messages: undefined;
  
  // Pantallas de perfil
  Settings: undefined;
  Help: undefined;
  Wallet: undefined;
  StripeSetup: undefined;
  
  // Pantallas de edición
  EditProfile: undefined;
  EditService: { serviceId?: string };
  EditProduct: { productId?: string };
  EditEvent: { eventId?: string };
  
  // Otras pantallas
  ArtistDetails: { artistId: string };
  EventDetails: { eventId: string };
  VenueDetails: { venueId: string };
  GalleryDetails: { galleryId: string };
};
