// Categorías de Eventos
// Estructura jerárquica: Categoría → Tipo de Evento → Subtipo
// Diseñado para ser consistente con la estructura de artistCategories.ts

export interface EventSubtype {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
}

export interface EventType {
  id: string;
  name: string;
  description?: string;
  icon?: string;  // Haciendo opcional
  color?: string; // Haciendo opcional
  subtypes?: EventSubtype[];
  suggestedTags?: string[];
  suggestedAudience?: string[];
}

export interface EventCategory {
  id: string;
  name: string;
  description?: string;
  icon: string;
  color: string;
  eventTypes: EventType[];
  suggestedVenues?: string[];
  suggestedDurations?: number[]; // en minutos
}

/**
 * Categorías principales de eventos con su jerarquía completa
 */
export const EVENT_CATEGORIES: EventCategory[] = [
  {
    id: 'festivals',
    name: 'Festivales y Ferias',
    icon: 'Festival',
    color: '#8A2BE2', // 🟣
    eventTypes: [
      { id: 'music-festival', name: 'Festival de música' },
      { id: 'film-festival', name: 'Festival de cine' },
      { id: 'food-festival', name: 'Festival gastronómico' },
      { id: 'cultural-festival', name: 'Festival cultural o tradicional' },
      { id: 'art-design-festival', name: 'Festival de arte o diseño' },
      { id: 'literary-festival', name: 'Festival Literario' },
      { id: 'entrepreneurship-fair', name: 'Feria de emprendimiento' },
      { id: 'art-fair', name: 'Feria de arte' },
      { id: 'food-fair', name: 'Feria gastronómica' },
      { id: 'fashion-beauty-fair', name: 'Feria de moda o belleza' },
      { id: 'local-market', name: 'Mercado local / artesanal / sostenible' },
      { id: 'tech-innovation-fair', name: 'Feria de tecnología / innovación' }
    ]
  },
  {
    id: 'music',
    name: 'Música',
    icon: 'Music',
    color: '#1E90FF', // 🔵
    eventTypes: [
      { id: 'concerts', name: 'Conciertos' },
      { id: 'recitals', name: 'Recitales' },
      { id: 'tributes', name: 'Tributos o homenajes' },
      { id: 'acoustic-sessions', name: 'Sesiones acústicas / íntimas' },
      { id: 'dj-sets', name: 'DJ sets / electrónica' },
      { id: 'music-jams', name: 'Encuentros o jams musicales' },
      { id: 'musicals', name: 'Musicales' },
      { id: 'live-performances', name: 'Presentaciones en vivo' }
    ]
  },
  {
    id: 'performing-arts',
    name: 'Artes Escénicas',
    icon: 'Drama',
    color: '#32CD32', // 🟢
    eventTypes: [
      { id: 'theater', name: 'Teatro' },
      { id: 'dance', name: 'Danza' },
      { id: 'contemporary-circus', name: 'Circo contemporáneo' },
      { id: 'performance', name: 'Performance' },
      { id: 'stand-up', name: 'Stand-up comedy' },
      { id: 'improvisation', name: 'Improvisación' },
      { id: 'street-theater', name: 'Teatro callejero' },
      { id: 'opera', name: 'Ópera o zarzuela' }
    ]
  },
  {
    id: 'cinema',
    name: 'Cine',
    icon: 'Film',
    color: '#FFA500', // 🟠
    eventTypes: [
      { id: 'movie-premiere', name: 'Estreno cinematográfico' },
      { id: 'special-screening', name: 'Proyección especial' },
      { id: 'art-cinema', name: 'Cinearte o cine foro' },
      { id: 'film-festival', name: 'Festival de cine' },
      { id: 'documentaries', name: 'Documentales' },
      { id: 'short-films', name: 'Cortometrajes' },
      { id: 'tv-premieres', name: 'Series o lanzamientos audiovisuales' },
      { id: 'filmmakers-meetup', name: 'Encuentros de cineastas' }
    ]
  },
  {
    id: 'art',
    name: 'Arte',
    icon: 'Palette',
    color: '#FFD700', // 🟡
    eventTypes: [
      { id: 'art-exhibition', name: 'Exposición de arte' },
      { id: 'photography', name: 'Fotografía' },
      { id: 'graphic-design', name: 'Diseño gráfico o industrial' },
      { id: 'street-art', name: 'Arte urbano / muralismo' },
      { id: 'digital-art', name: 'Arte digital o NFT' },
      { id: 'immersive-installations', name: 'Instalaciones inmersivas' },
      { id: 'sculpture-painting', name: 'Escultura / pintura' },
      { id: 'museums-galleries', name: 'Museos o galerías' }
    ]
  },
  {
    id: 'conferences-education',
    name: 'Conferencias/Educación',
    icon: 'GraduationCap',
    color: '#D2691E', // 🟤
    eventTypes: [
      { id: 'creative-workshop', name: 'Taller creativo' },
      { id: 'professional-workshop', name: 'Taller profesional o técnico' },
      { id: 'bootcamp', name: 'Curso intensivo o bootcamp' },
      { id: 'talk', name: 'Charla o conferencia' },
      { id: 'discussion', name: 'Conversatorio' },
      { id: 'seminar', name: 'Seminario' },
      { id: 'expert-panel', name: 'Serie profesional / panel de expertos' },
      { id: 'mentoring', name: 'Mentorías o laboratorios' }
    ]
  },
  {
    id: 'culture',
    name: 'Cultura',
    icon: 'Landmark',
    color: '#000000', // ⚫
    eventTypes: [
      { id: 'traditional-celebrations', name: 'Celebraciones tradicionales' },
      { id: 'patronal-feasts', name: 'Fiestas patronales' },
      { id: 'parades', name: 'Desfiles o carnavales' },
      { id: 'literature', name: 'Literatura / ferias del libro' },
      { id: 'book-presentations', name: 'Presentaciones editoriales' },
      { id: 'poetry-readings', name: 'Lecturas o recitales poéticos' },
      { id: 'local-gastronomy', name: 'Gastronomía local' },
      { id: 'indigenous-culture', name: 'Cultura ancestral o indígena' },
      { id: 'community-gatherings', name: 'Encuentros comunitarios' }
    ]
  },
  {
    id: 'technology',
    name: 'Tecnología',
    icon: 'Cpu',
    color: '#FF0000', // 🔴
    eventTypes: [
      { id: 'hackathon', name: 'Hackathon' },
      { id: 'app-launch', name: 'Lanzamientos de apps o ads' },
      { id: 'startup-events', name: 'Eventos de startups' },
      { id: 'tech-fairs', name: 'Ferias o expos tech' },
      { id: 'vr-ar', name: 'Realidad virtual / aumentada' },
      { id: 'ai', name: 'Inteligencia artificial' },
      { id: 'gaming', name: 'Gaming o eSports' },
      { id: 'metaverse', name: 'Metaverso / experiencias digitales' }
    ]
  },
  {
    id: 'lifestyle',
    name: 'Estilo de Vida',
    icon: 'Heart',
    color: '#FFFFFF', // ⚪
    eventTypes: [
      { id: 'yoga-meditation', name: 'Yoga / meditación' },
      { id: 'beauty', name: 'Belleza / cuidado personal' },
      { id: 'healthy-food', name: 'Alimentación saludable' },
      { id: 'fitness', name: 'Fitness o actividades físicas' },
      { id: 'mindfulness', name: 'Mindfulness o crecimiento personal' },
      { id: 'wellness-retreats', name: 'Wellness retreats' },
      { id: 'self-care-workshops', name: 'Talleres de autocuidado' }
    ]
  },
  {
    id: 'business',
    name: 'Negocios',
    icon: 'Briefcase',
    color: '#8B4513', // 🟤
    eventTypes: [
      { id: 'networking', name: 'Networking' },
      { id: 'pitch-days', name: 'Pitch days' },
      { id: 'business-mentoring', name: 'Mentorías empresariales' },
      { id: 'leadership-talks', name: 'Charlas de liderazgo o management' },
      { id: 'brand-presentations', name: 'Presentaciones de marca' },
      { id: 'product-launch', name: 'Lanzamientos de producto' },
      { id: 'business-forums', name: 'Foros empresariales' },
      { id: 'coworking', name: 'Espacios coworking o de innovación' }
    ]
  }
];

/**
 * Obtiene una categoría por su ID
 */
export function getCategoryById(id: string): EventCategory | undefined {
  return EVENT_CATEGORIES.find(category => category.id === id);
}

/**
 * Obtiene un tipo de evento por su ID dentro de una categoría
 */
export function getEventTypeById(categoryId: string, eventTypeId: string): EventType | undefined {
  const category = getCategoryById(categoryId);
  if (!category) return undefined;
  return category.eventTypes.find(type => type.id === eventTypeId);
}

/**
 * Obtiene un subtipo de evento por su ID
 */
export function getEventSubtypeById(
  categoryId: string, 
  eventTypeId: string, 
  subtypeId: string
): EventSubtype | undefined {
  const eventType = getEventTypeById(categoryId, eventTypeId);
  if (!eventType || !eventType.subtypes) return undefined;
  return eventType.subtypes.find(subtype => subtype.id === subtypeId);
}

/**
 * Obtiene todos los tipos de eventos de una categoría
 */
export function getEventTypesByCategory(categoryId: string): EventType[] {
  const category = getCategoryById(categoryId);
  return category ? category.eventTypes : [];
}

/**
 * Obtiene todos los subtipos de un tipo de evento
 */
export function getEventSubtypes(
  categoryId: string, 
  eventTypeId: string
): EventSubtype[] {
  const eventType = getEventTypeById(categoryId, eventTypeId);
  return eventType?.subtypes || [];
}

/**
 * Busca eventos por término de búsqueda
 */
export function searchEvents(searchTerm: string): {
  categories: EventCategory[];
  eventTypes: EventType[];
  subtypes: EventSubtype[];
} {
  const term = searchTerm.toLowerCase();
  
  const categories = EVENT_CATEGORIES.filter(category => 
    category.name.toLowerCase().includes(term) || 
    category.description?.toLowerCase().includes(term)
  );
  
  const eventTypes: EventType[] = [];
  const subtypes: EventSubtype[] = [];
  
  EVENT_CATEGORIES.forEach(category => {
    const matchingTypes = category.eventTypes.filter(type => 
      type.name.toLowerCase().includes(term) || 
      type.description?.toLowerCase().includes(term)
    );
    
    eventTypes.push(...matchingTypes);
    
    category.eventTypes.forEach(type => {
      const matchingSubtypes = (type.subtypes || []).filter(subtype => 
        subtype.name.toLowerCase().includes(term) ||
        subtype.description?.toLowerCase().includes(term)
      );
      
      subtypes.push(...matchingSubtypes);
    });
  });
  
  return {
    categories,
    eventTypes,
    subtypes
  };
}

// Funciones de compatibilidad para el sistema anterior
export function getSubcategoriesByCategory(categoryId: string): EventType[] {
  return getEventTypesByCategory(categoryId);
}

export function getSubcategoryById(categoryId: string, subcategoryId: string): EventType | undefined {
  return getEventTypeById(categoryId, subcategoryId);
}

// Tipos de eventos sugeridos para la página de inicio
export const SUGGESTED_EVENT_TYPES = [
  { categoryId: 'music', typeId: 'concerts', name: 'Conciertos' },
  { categoryId: 'performing-arts', typeId: 'theater', name: 'Teatro' },
  { categoryId: 'conferences-education', typeId: 'talk', name: 'Conferencias' },
  { categoryId: 'art', typeId: 'art-exhibition', name: 'Exposiciones' },
  { categoryId: 'festivals', typeId: 'food-festival', name: 'Festivales' },
  { categoryId: 'business', typeId: 'networking', name: 'Networking' },
];