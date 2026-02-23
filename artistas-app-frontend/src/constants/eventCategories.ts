// ============================================================
// TIPOS PRINCIPALES (basados en artistCategories)
// ============================================================

export interface EventSubtype {
  id: string;
  // name se obtiene del diccionario
  description?: string;
  icon?: string;
  color?: string;
}

export interface EventType {
  id: string;
  subtypes?: EventSubtype[];
  suggestedDisciplines?: string[];  // IDs de disciplinas de artistas que suelen participar
  suggestedFormats?: ('presencial' | 'virtual' | 'hibrido')[];
  suggestedAudienceRange?: { min: number; max: number };
  suggestedDurations?: number[]; // en minutos
  suggestedTags?: string[];       // para búsqueda libre
}

export interface EventCategory {
  id: string;
  eventTypes: EventType[];
  suggestedVenues?: string[];
  suggestedDurations?: number[]; // en minutos, heredable a tipos
}

// ============================================================
// DATOS ESTRUCTURALES (solo IDs)
// ============================================================

export const EVENT_CATEGORIES: EventCategory[] = [
  {
    id: 'festivals',
    eventTypes: [
      { id: 'music-festival' },
      { id: 'film-festival' },
      { id: 'food-festival' },
      { id: 'cultural-festival' },
      { id: 'art-design-festival' },
      { id: 'literary-festival' },
      { id: 'entrepreneurship-fair' },
      { id: 'art-fair' },
      { id: 'food-fair' },
      { id: 'fashion-beauty-fair' },
      { id: 'local-market' },
      { id: 'tech-innovation-fair' }
    ],
    suggestedVenues: ['parque', 'plaza', 'centro de convenciones', 'recinto ferial'],
    suggestedDurations: [120, 180, 240, 480] // minutos
  },
  {
    id: 'music',
    eventTypes: [
      { 
        id: 'concerts',
        subtypes: [
          { id: 'symphonic' },
          { id: 'rock' },
          { id: 'pop' },
          { id: 'electronic' },
          { id: 'jazz' }
        ],
        suggestedDisciplines: ['musica', 'produccion-musical', 'diseno-sonido'],
        suggestedFormats: ['presencial', 'virtual'],
        suggestedAudienceRange: { min: 100, max: 50000 },
        suggestedDurations: [90, 120, 150]
      },
      { id: 'recitals' },
      { id: 'tributes' },
      { id: 'acoustic-sessions' },
      { id: 'dj-sets' },
      { id: 'music-jams' },
      { id: 'musicals' },
      { id: 'live-performances' }
    ],
    suggestedVenues: ['teatro', 'auditorio', 'estadio', 'club'],
    suggestedDurations: [60, 90, 120, 180]
  },
  {
    id: 'performing-arts',
    eventTypes: [
      { 
        id: 'theater',
        subtypes: [
          { id: 'drama' },
          { id: 'comedy' },
          { id: 'musical' },
          { id: 'experimental' }
        ],
        suggestedDisciplines: ['teatro', 'actuacion', 'direccion-teatral']
      },
      { 
        id: 'dance',
        subtypes: [
          { id: 'ballet' },
          { id: 'contemporary' },
          { id: 'folkloric' },
          { id: 'urban' }
        ],
        suggestedDisciplines: ['danza', 'coreografia']
      },
      { id: 'contemporary-circus', suggestedDisciplines: ['circo'] },
      { id: 'performance', suggestedDisciplines: ['performance'] },
      { id: 'stand-up', suggestedDisciplines: ['stand-up'] },
      { id: 'improvisation' },
      { id: 'street-theater' },
      { id: 'opera', suggestedDisciplines: ['opera'] }
    ]
  },
  {
    id: 'cinema',
    eventTypes: [
      { id: 'movie-premiere' },
      { id: 'special-screening' },
      { id: 'art-cinema' },
      { id: 'film-festival' },
      { id: 'documentaries' },
      { id: 'short-films' },
      { id: 'tv-premieres' },
      { id: 'filmmakers-meetup' }
    ]
  },
  {
    id: 'art',
    eventTypes: [
      { id: 'art-exhibition', suggestedDisciplines: ['pintura', 'escultura', 'fotografia'] },
      { id: 'photography', suggestedDisciplines: ['fotografia'] },
      { id: 'graphic-design', suggestedDisciplines: ['diseno-grafico'] },
      { id: 'street-art', suggestedDisciplines: ['graffiti'] },
      { id: 'digital-art', suggestedDisciplines: ['arte-digital', 'arte-generativo'] },
      { id: 'immersive-installations' },
      { id: 'sculpture-painting' },
      { id: 'museums-galleries' }
    ]
  },
  {
    id: 'conferences-education',
    eventTypes: [
      { id: 'creative-workshop' },
      { id: 'professional-workshop' },
      { id: 'bootcamp' },
      { id: 'talk' },
      { id: 'discussion' },
      { id: 'seminar' },
      { id: 'expert-panel' },
      { id: 'mentoring' }
    ]
  },
  {
    id: 'culture',
    eventTypes: [
      { id: 'traditional-celebrations' },
      { id: 'patronal-feasts' },
      { id: 'parades' },
      { id: 'literature' },
      { id: 'book-presentations' },
      { id: 'poetry-readings' },
      { id: 'local-gastronomy' },
      { id: 'indigenous-culture' },
      { id: 'community-gatherings' }
    ]
  },
  {
    id: 'technology',
    eventTypes: [
      { id: 'hackathon' },
      { id: 'app-launch' },
      { id: 'startup-events' },
      { id: 'tech-fairs' },
      { id: 'vr-ar' },
      { id: 'ai' },
      { id: 'gaming' },
      { id: 'metaverse' }
    ]
  },
  {
    id: 'lifestyle',
    eventTypes: [
      { id: 'yoga-meditation' },
      { id: 'beauty' },
      { id: 'healthy-food' },
      { id: 'fitness' },
      { id: 'mindfulness' },
      { id: 'wellness-retreats' },
      { id: 'self-care-workshops' }
    ]
  },
  {
    id: 'business',
    eventTypes: [
      { id: 'networking' },
      { id: 'pitch-days' },
      { id: 'business-mentoring' },
      { id: 'leadership-talks' },
      { id: 'brand-presentations' },
      { id: 'product-launch' },
      { id: 'business-forums' },
      { id: 'coworking' }
    ]
  }
];

// ============================================================
// DICCIONARIO DE TEXTOS (ESPAÑOL)
// ============================================================

export interface EventCategoryStrings {
  name: string;
  description?: string;
  icon: string;
  color: string;
  eventTypes: {
    [typeId: string]: {
      name: string;
      description?: string;
      icon?: string;
      color?: string;
      subtypes?: {
        [subtypeId: string]: {
          name: string;
          description?: string;
          icon?: string;
          color?: string;
        };
      };
    };
  };
}

export const EVENT_STRINGS_ES: { [categoryId: string]: EventCategoryStrings } = {
  festivals: {
    name: 'Festivales y Ferias',
    icon: 'Festival',
    color: '#8A2BE2',
    eventTypes: {
      'music-festival': { name: 'Festival de música' },
      'film-festival': { name: 'Festival de cine' },
      'food-festival': { name: 'Festival gastronómico' },
      'cultural-festival': { name: 'Festival cultural o tradicional' },
      'art-design-festival': { name: 'Festival de arte o diseño' },
      'literary-festival': { name: 'Festival Literario' },
      'entrepreneurship-fair': { name: 'Feria de emprendimiento' },
      'art-fair': { name: 'Feria de arte' },
      'food-fair': { name: 'Feria gastronómica' },
      'fashion-beauty-fair': { name: 'Feria de moda o belleza' },
      'local-market': { name: 'Mercado local / artesanal / sostenible' },
      'tech-innovation-fair': { name: 'Feria de tecnología / innovación' }
    }
  },
  music: {
    name: 'Música',
    icon: 'Music',
    color: '#1E90FF',
    eventTypes: {
      concerts: { 
        name: 'Conciertos',
        subtypes: {
          symphonic: { name: 'Sinfónico' },
          rock: { name: 'Rock' },
          pop: { name: 'Pop' },
          electronic: { name: 'Electrónica' },
          jazz: { name: 'Jazz' }
        }
      },
      recitals: { name: 'Recitales' },
      tributes: { name: 'Tributos o homenajes' },
      'acoustic-sessions': { name: 'Sesiones acústicas / íntimas' },
      'dj-sets': { name: 'DJ sets / electrónica' },
      'music-jams': { name: 'Encuentros o jams musicales' },
      musicals: { name: 'Musicales' },
      'live-performances': { name: 'Presentaciones en vivo' }
    }
  },
  'performing-arts': {
    name: 'Artes Escénicas',
    icon: 'Drama',
    color: '#32CD32',
    eventTypes: {
      theater: { 
        name: 'Teatro',
        subtypes: {
          drama: { name: 'Drama' },
          comedy: { name: 'Comedia' },
          musical: { name: 'Musical' },
          experimental: { name: 'Experimental' }
        }
      },
      dance: { 
        name: 'Danza',
        subtypes: {
          ballet: { name: 'Ballet' },
          contemporary: { name: 'Contemporáneo' },
          folkloric: { name: 'Folclórico' },
          urban: { name: 'Urbano' }
        }
      },
      'contemporary-circus': { name: 'Circo contemporáneo' },
      performance: { name: 'Performance' },
      'stand-up': { name: 'Stand-up comedy' },
      improvisation: { name: 'Improvisación' },
      'street-theater': { name: 'Teatro callejero' },
      opera: { name: 'Ópera o zarzuela' }
    }
  },
  cinema: {
    name: 'Cine',
    icon: 'Film',
    color: '#FFA500',
    eventTypes: {
      'movie-premiere': { name: 'Estreno cinematográfico' },
      'special-screening': { name: 'Proyección especial' },
      'art-cinema': { name: 'Cinearte o cine foro' },
      'film-festival': { name: 'Festival de cine' },
      documentaries: { name: 'Documentales' },
      'short-films': { name: 'Cortometrajes' },
      'tv-premieres': { name: 'Series o lanzamientos audiovisuales' },
      'filmmakers-meetup': { name: 'Encuentros de cineastas' }
    }
  },
  art: {
    name: 'Arte',
    icon: 'Palette',
    color: '#FFD700',
    eventTypes: {
      'art-exhibition': { name: 'Exposición de arte' },
      photography: { name: 'Fotografía' },
      'graphic-design': { name: 'Diseño gráfico o industrial' },
      'street-art': { name: 'Arte urbano / muralismo' },
      'digital-art': { name: 'Arte digital o NFT' },
      'immersive-installations': { name: 'Instalaciones inmersivas' },
      'sculpture-painting': { name: 'Escultura / pintura' },
      'museums-galleries': { name: 'Museos o galerías' }
    }
  },
  'conferences-education': {
    name: 'Conferencias/Educación',
    icon: 'GraduationCap',
    color: '#D2691E',
    eventTypes: {
      'creative-workshop': { name: 'Taller creativo' },
      'professional-workshop': { name: 'Taller profesional o técnico' },
      bootcamp: { name: 'Curso intensivo o bootcamp' },
      talk: { name: 'Charla o conferencia' },
      discussion: { name: 'Conversatorio' },
      seminar: { name: 'Seminario' },
      'expert-panel': { name: 'Serie profesional / panel de expertos' },
      mentoring: { name: 'Mentorías o laboratorios' }
    }
  },
  culture: {
    name: 'Cultura',
    icon: 'Landmark',
    color: '#000000',
    eventTypes: {
      'traditional-celebrations': { name: 'Celebraciones tradicionales' },
      'patronal-feasts': { name: 'Fiestas patronales' },
      parades: { name: 'Desfiles o carnavales' },
      literature: { name: 'Literatura / ferias del libro' },
      'book-presentations': { name: 'Presentaciones editoriales' },
      'poetry-readings': { name: 'Lecturas o recitales poéticos' },
      'local-gastronomy': { name: 'Gastronomía local' },
      'indigenous-culture': { name: 'Cultura ancestral o indígena' },
      'community-gatherings': { name: 'Encuentros comunitarios' }
    }
  },
  technology: {
    name: 'Tecnología',
    icon: 'Cpu',
    color: '#FF0000',
    eventTypes: {
      hackathon: { name: 'Hackathon' },
      'app-launch': { name: 'Lanzamientos de apps o ads' },
      'startup-events': { name: 'Eventos de startups' },
      'tech-fairs': { name: 'Ferias o expos tech' },
      'vr-ar': { name: 'Realidad virtual / aumentada' },
      ai: { name: 'Inteligencia artificial' },
      gaming: { name: 'Gaming o eSports' },
      metaverse: { name: 'Metaverso / experiencias digitales' }
    }
  },
  lifestyle: {
    name: 'Estilo de Vida',
    icon: 'Heart',
    color: '#FFFFFF',
    eventTypes: {
      'yoga-meditation': { name: 'Yoga / meditación' },
      beauty: { name: 'Belleza / cuidado personal' },
      'healthy-food': { name: 'Alimentación saludable' },
      fitness: { name: 'Fitness o actividades físicas' },
      mindfulness: { name: 'Mindfulness o crecimiento personal' },
      'wellness-retreats': { name: 'Wellness retreats' },
      'self-care-workshops': { name: 'Talleres de autocuidado' }
    }
  },
  business: {
    name: 'Negocios',
    icon: 'Briefcase',
    color: '#8B4513',
    eventTypes: {
      networking: { name: 'Networking' },
      'pitch-days': { name: 'Pitch days' },
      'business-mentoring': { name: 'Mentorías empresariales' },
      'leadership-talks': { name: 'Charlas de liderazgo o management' },
      'brand-presentations': { name: 'Presentaciones de marca' },
      'product-launch': { name: 'Lanzamientos de producto' },
      'business-forums': { name: 'Foros empresariales' },
      coworking: { name: 'Espacios coworking o de innovación' }
    }
  }
};

// ============================================================
// FUNCIONES HELPER CON LOCALIZACIÓN
// ============================================================

// Obtener textos de una categoría
export const getEventCategoryStrings = (categoryId: string, lang: 'es' = 'es'): EventCategoryStrings | undefined => {
  const dictionaries = { es: EVENT_STRINGS_ES };
  return dictionaries[lang][categoryId];
};

// Obtener nombre localizado de categoría
export const getLocalizedEventCategoryName = (categoryId: string, lang: 'es' = 'es'): string => {
  return getEventCategoryStrings(categoryId, lang)?.name || categoryId;
};

// Obtener nombre localizado de tipo de evento
export const getLocalizedEventTypeName = (categoryId: string, typeId: string, lang: 'es' = 'es'): string => {
  return getEventCategoryStrings(categoryId, lang)?.eventTypes[typeId]?.name || typeId;
};

// Obtener nombre localizado de subtipo
export const getLocalizedEventSubtypeName = (
  categoryId: string,
  typeId: string,
  subtypeId: string,
  lang: 'es' = 'es'
): string => {
  return getEventCategoryStrings(categoryId, lang)?.eventTypes[typeId]?.subtypes?.[subtypeId]?.name || subtypeId;
};

// Obtener categoría por ID (datos estructurales)
export const getEventCategoryById = (id: string): EventCategory | undefined => {
  return EVENT_CATEGORIES.find(cat => cat.id === id);
};

// Obtener tipo de evento por IDs
export const getEventTypeById = (categoryId: string, typeId: string): EventType | undefined => {
  const category = getEventCategoryById(categoryId);
  return category?.eventTypes.find(t => t.id === typeId);
};

// Obtener subtipo por IDs
export const getEventSubtypeById = (
  categoryId: string,
  typeId: string,
  subtypeId: string
): EventSubtype | undefined => {
  const type = getEventTypeById(categoryId, typeId);
  return type?.subtypes?.find(s => s.id === subtypeId);
};

// Obtener todos los tipos de evento de una categoría
export const getEventTypesByCategory = (categoryId: string): EventType[] => {
  const category = getEventCategoryById(categoryId);
  return category ? category.eventTypes : [];
};

// Obtener todos los subtipos de un tipo
export const getEventSubtypes = (categoryId: string, typeId: string): EventSubtype[] => {
  const type = getEventTypeById(categoryId, typeId);
  return type?.subtypes || [];
};

// Obtener todas las disciplinas sugeridas para un tipo (para filtros/recomendaciones)
export const getSuggestedDisciplinesForEventType = (categoryId: string, typeId: string): string[] => {
  const type = getEventTypeById(categoryId, typeId);
  return type?.suggestedDisciplines || [];
};

// Obtener formatos sugeridos
export const getSuggestedFormatsForEventType = (categoryId: string, typeId: string): string[] => {
  const type = getEventTypeById(categoryId, typeId);
  return type?.suggestedFormats || [];
};

// Búsqueda mejorada
export function searchEvents(searchTerm: string, lang: 'es' = 'es'): {
  categories: { id: string; name: string }[];
  eventTypes: { id: string; name: string; categoryId: string }[];
  subtypes: { id: string; name: string; typeId: string; categoryId: string }[];
} {
  const term = searchTerm.toLowerCase();
  const categories: { id: string; name: string }[] = [];
  const eventTypes: { id: string; name: string; categoryId: string }[] = [];
  const subtypes: { id: string; name: string; typeId: string; categoryId: string }[] = [];

  EVENT_CATEGORIES.forEach(cat => {
    const catStrings = getEventCategoryStrings(cat.id, lang);
    if (catStrings) {
      // Buscar en nombre de categoría
      if (catStrings.name.toLowerCase().includes(term)) {
        categories.push({ id: cat.id, name: catStrings.name });
      }

      cat.eventTypes.forEach(type => {
        const typeName = catStrings.eventTypes[type.id]?.name || type.id;
        if (typeName.toLowerCase().includes(term)) {
          eventTypes.push({ id: type.id, name: typeName, categoryId: cat.id });
        }

        type.subtypes?.forEach(sub => {
          const subName = catStrings.eventTypes[type.id]?.subtypes?.[sub.id]?.name || sub.id;
          if (subName.toLowerCase().includes(term)) {
            subtypes.push({ id: sub.id, name: subName, typeId: type.id, categoryId: cat.id });
          }
        });
      });
    }
  });

  return { categories, eventTypes, subtypes };
}

// ============================================================
// COMPATIBILIDAD CON SISTEMA ANTERIOR
// ============================================================
export const getSubcategoriesByCategory = (categoryId: string): EventType[] => {
  return getEventTypesByCategory(categoryId);
};

export const getSubcategoryById = (categoryId: string, subcategoryId: string): EventType | undefined => {
  return getEventTypeById(categoryId, subcategoryId);
};

// ============================================================
// FILTROS SUGERIDOS PARA EL MARKETPLACE
// ============================================================

export interface EventFilterDefinition {
  id: string;
  label: string;
  type: 'single-select' | 'multi-select' | 'range' | 'boolean' | 'text';
  options?: { id: string; label: string }[];
  range?: { min: number; max: number; step?: number };
  dependsOn?: { category?: string; type?: string }; // para filtros dinámicos
}

// Filtros globales (siempre visibles)
export const GLOBAL_EVENT_FILTERS: EventFilterDefinition[] = [
  { id: 'price', label: 'Precio', type: 'range', range: { min: 0, max: 1000, step: 10 } },
  { id: 'location', label: 'Ubicación', type: 'text' },
  { id: 'format', label: 'Formato', type: 'multi-select', options: [
    { id: 'presencial', label: 'Presencial' },
    { id: 'virtual', label: 'Virtual' },
    { id: 'hibrido', label: 'Híbrido' }
  ]},
  { id: 'date', label: 'Fecha', type: 'range' }, // se manejaría con calendario
  { id: 'audience', label: 'Audiencia', type: 'range', range: { min: 0, max: 50000 } }
];

// Función para obtener filtros dinámicos según categoría/tipo seleccionado
export function getDynamicEventFilters(categoryId?: string, typeId?: string): EventFilterDefinition[] {
  const filters: EventFilterDefinition[] = [];

  if (categoryId) {
    // Filtro por tipo de evento (si no está ya seleccionado)
    if (!typeId) {
      const types = getEventTypesByCategory(categoryId);
      filters.push({
        id: 'eventType',
        label: 'Tipo de evento',
        type: 'single-select',
        options: types.map(t => ({ id: t.id, label: getLocalizedEventTypeName(categoryId, t.id) }))
      });
    }

    // Filtro por duración (si la categoría tiene sugerencias)
    const cat = getEventCategoryById(categoryId);
    if (cat?.suggestedDurations) {
      filters.push({
        id: 'duration',
        label: 'Duración (minutos)',
        type: 'multi-select',
        options: cat.suggestedDurations.map(d => ({ id: d.toString(), label: `${d} min` }))
      });
    }

    // Si hay un tipo específico, añadir filtros basados en sus metadatos
    if (typeId) {
      const type = getEventTypeById(categoryId, typeId);
      if (type) {
        // Filtro por subtipo
        if (type.subtypes && type.subtypes.length > 0) {
          filters.push({
            id: 'subtype',
            label: 'Subtipo',
            type: 'multi-select',
            options: type.subtypes.map(s => ({ id: s.id, label: getLocalizedEventSubtypeName(categoryId, typeId, s.id) }))
          });
        }
        // Filtro por disciplinas sugeridas (para vincular con artistas)
        if (type.suggestedDisciplines && type.suggestedDisciplines.length > 0) {
          filters.push({
            id: 'suggestedDisciplines',
            label: 'Disciplinas artísticas involucradas',
            type: 'multi-select',
            options: type.suggestedDisciplines.map(d => ({ id: d, label: d })) // Aquí podrías obtener nombre real desde artistStrings
          });
        }
      }
    }
  }

  return filters;
}