// ============================================================
// TIPOS PRINCIPALES (solo IDs)
// ============================================================

export interface PlaceSubcategory {
  id: string;
  // El nombre, descripción, ícono, color se obtienen del diccionario
}

export interface PlaceCategory {
  id: string;
  subcategories: PlaceSubcategory[];
  suggestedUses?: string[];          // IDs de usos sugeridos (ej. 'wedding', 'conference')
  suggestedCapacities?: number[];     // rangos de capacidad sugeridos (ej. [20, 50, 100, 200])
  suggestedAmenities?: string[];       // IDs de amenidades comunes (ej. 'wifi', 'projector')
}

// ============================================================
// DATOS ESTRUCTURALES (solo IDs, sin textos)
// ============================================================

export const PLACE_CATEGORIES: PlaceCategory[] = [
  {
    id: 'gastronomy',
    subcategories: [
      { id: 'restaurants' },
      { id: 'bars-rooftops' },
      { id: 'cafes' },
      { id: 'bistros' },
      { id: 'bakeries' },
      { id: 'brunch-spots' },
      { id: 'food-trucks' },
      { id: 'themed-restaurants' }
    ],
    suggestedUses: ['dinner', 'date', 'meeting', 'gastronomic-event', 'culinary-experience'],
    suggestedCapacities: [10, 20, 50, 100],
    suggestedAmenities: ['wifi', 'parking', 'terrace', 'private-room']
  },
  {
    id: 'event-spaces',
    subcategories: [
      { id: 'event-halls' },
      { id: 'farms' },
      { id: 'terraces' },
      { id: 'auditoriums' },
      { id: 'convention-centers' },
      { id: 'corporate-spaces' },
      { id: 'wedding-venues' },
      { id: 'rooftop-venues' }
    ],
    suggestedUses: ['wedding', 'celebration', 'conference', 'corporate-event', 'social-gathering'],
    suggestedCapacities: [50, 100, 200, 500, 1000],
    suggestedAmenities: ['wifi', 'parking', 'catering', 'stage', 'sound-system']
  },
  {
    id: 'cultural-literary',
    subcategories: [
      { id: 'libraries' },
      { id: 'bookstores' },
      { id: 'cultural-houses' },
      { id: 'reading-centers' },
      { id: 'literary-spaces' },
      { id: 'publishing-spaces' },
      { id: 'museums' },
      { id: 'heritage-houses' }
    ],
    suggestedUses: ['book-launch', 'poetry-reading', 'talk', 'exhibition', 'cultural-meetup'],
    suggestedCapacities: [20, 50, 100, 200],
    suggestedAmenities: ['wifi', 'seating', 'projector', 'bookshelves']
  },
  {
    id: 'creative-studios',
    subcategories: [
      { id: 'recording-studios' },
      { id: 'photo-studios' },
      { id: 'film-studios' },
      { id: 'rehearsal-spaces' },
      { id: 'podcast-studios' },
      { id: 'voice-booths' },
      { id: 'creative-labs' },
      { id: 'editing-studios' }
    ],
    suggestedUses: ['recording', 'production', 'rehearsal', 'creative-development', 'session'],
    suggestedCapacities: [5, 10, 20, 50],
    suggestedAmenities: ['acoustic-treatment', 'equipment', 'wifi', 'green-room']
  },
  {
    id: 'art-exhibition',
    subcategories: [
      { id: 'art-galleries' },
      { id: 'museums' },
      { id: 'exhibition-halls' },
      { id: 'street-art' },
      { id: 'artist-studios' },
      { id: 'digital-art' },
      { id: 'design-centers' },
      { id: 'immersive-spaces' }
    ],
    suggestedUses: ['exhibition', 'curatorship', 'installation', 'art-event', 'presentation'],
    suggestedCapacities: [20, 50, 100, 200],
    suggestedAmenities: ['lighting', 'walls', 'security', 'wifi']
  },
  {
    id: 'performing-arts',
    subcategories: [
      { id: 'theaters' },
      { id: 'performing-arts-venues' },
      { id: 'dance-studios' },
      { id: 'circus-spaces' },
      { id: 'comedy-clubs' },
      { id: 'indie-cinemas' },
      { id: 'multifunctional-spaces' },
      { id: 'cultural-centers' }
    ],
    suggestedUses: ['live-performance', 'rehearsal', 'show', 'spectacle', 'cultural-event'],
    suggestedCapacities: [50, 100, 200, 500],
    suggestedAmenities: ['stage', 'sound-system', 'lighting', 'dressing-rooms']
  },
  {
    id: 'technology',
    subcategories: [
      { id: 'coworking' },
      { id: 'innovation-hubs' },
      { id: 'tech-labs' },
      { id: 'virtual-classrooms' },
      { id: 'vr-spaces' },
      { id: 'gaming-rooms' },
      { id: 'digital-training' },
      { id: 'makerspaces' }
    ],
    suggestedUses: ['hackathon', 'app-launch', 'creative-session', 'workshop', 'tech-experience'],
    suggestedCapacities: [10, 20, 50, 100],
    suggestedAmenities: ['wifi', 'screens', 'vr-equipment', '3d-printers']
  },
  {
    id: 'wellness-nature',
    subcategories: [
      { id: 'eco-farms' },
      { id: 'retreat-centers' },
      { id: 'spas' },
      { id: 'nature-reserves' },
      { id: 'glamping' },
      { id: 'outdoor-spaces' },
      { id: 'botanical-gardens' },
      { id: 'private-beaches' }
    ],
    suggestedUses: ['wellness-experience', 'creative-retreat', 'photoshoot', 'disconnect', 'outdoor'],
    suggestedCapacities: [10, 20, 50, 100],
    suggestedAmenities: ['parking', 'bathrooms', 'camping-area', 'trails']
  },
  {
    id: 'tourism',
    subcategories: [
      { id: 'food-tours' },
      { id: 'cultural-tours' },
      { id: 'heritage-houses-tourism' },
      { id: 'viewpoints' },
      { id: 'landmark-streets' },
      { id: 'photo-spots' },
      { id: 'local-markets' }
    ],
    suggestedUses: ['tour', 'cultural-experience', 'photography', 'local-tourism', 'urban-exploration'],
    suggestedCapacities: [5, 10, 20, 50],
    suggestedAmenities: ['guide', 'transport', 'refreshments']
  }
];

// ============================================================
// DICCIONARIO DE TEXTOS (ESPAÑOL)
// ============================================================

export interface PlaceCategoryStrings {
  name: string;
  description?: string;
  icon: string;
  color: string;
  subcategories: {
    [subcategoryId: string]: {
      name: string;
      description?: string;
      icon?: string;
      color?: string;
    };
  };
  // Los suggestedUses, capacities, amenities se manejan por ID, no necesitan traducción aquí.
}

export const PLACE_STRINGS_ES: { [categoryId: string]: PlaceCategoryStrings } = {
  gastronomy: {
    name: 'Gastronomía y Cafés',
    icon: 'Utensils',
    color: '#8A2BE2',
    subcategories: {
      restaurants: { name: 'Restaurantes' },
      'bars-rooftops': { name: 'Bares / rooftops' },
      cafes: { name: 'Cafeterías' },
      bistros: { name: 'Bistrós o gastrobares' },
      bakeries: { name: 'Pastelerías o panaderías artesanales' },
      'brunch-spots': { name: 'Espacios con brunch' },
      'food-trucks': { name: 'Food trucks o patios gastronómicos' },
      'themed-restaurants': { name: 'Restaurantes temáticos' }
    }
  },
  'event-spaces': {
    name: 'Espacios para Eventos',
    icon: 'Calendar',
    color: '#1E90FF',
    subcategories: {
      'event-halls': { name: 'Salones de eventos' },
      farms: { name: 'Fincas o haciendas' },
      terraces: { name: 'Terrazas o jardines' },
      auditoriums: { name: 'Auditorios' },
      'convention-centers': { name: 'Centros de convenciones' },
      'corporate-spaces': { name: 'Espacios corporativos o de networking' },
      'wedding-venues': { name: 'Espacios para bodas o celebraciones' },
      'rooftop-venues': { name: 'Rooftops o venues con vista panorámica' }
    }
  },
  'cultural-literary': {
    name: 'Espacios Culturales y Literarios',
    icon: 'BookOpen',
    color: '#2E8B57',
    subcategories: {
      libraries: { name: 'Bibliotecas' },
      bookstores: { name: 'Librerías' },
      'cultural-houses': { name: 'Casas culturales' },
      'reading-centers': { name: 'Centros de lectura' },
      'literary-spaces': { name: 'Espacios literarios independientes' },
      'publishing-spaces': { name: 'Salas de lanzamiento editorial' },
      museums: { name: 'Museos o salas de exhibición cultural' },
      'heritage-houses': { name: 'Casas patrimoniales o de memoria' }
    }
  },
  'creative-studios': {
    name: 'Estudios Creativos y de Producción',
    icon: 'Video',
    color: '#FF8C00',
    subcategories: {
      'recording-studios': { name: 'Estudios de grabación musical' },
      'photo-studios': { name: 'Estudios de fotografía' },
      'film-studios': { name: 'Estudios de video o cine' },
      'rehearsal-spaces': { name: 'Salas de ensayo' },
      'podcast-studios': { name: 'Espacios de podcast' },
      'voice-booths': { name: 'Cabinas de locución' },
      'creative-labs': { name: 'Laboratorios creativos' },
      'editing-studios': { name: 'Espacios de edición o postproducción' }
    }
  },
  'art-exhibition': {
    name: 'Arte y Exposición',
    icon: 'Palette',
    color: '#FFD700',
    subcategories: {
      'art-galleries': { name: 'Galerías de arte' },
      museums: { name: 'Museos' },
      'exhibition-halls': { name: 'Salas de exposición' },
      'street-art': { name: 'Espacios de arte urbano / muralismo' },
      'artist-studios': { name: 'Talleres de artistas' },
      'digital-art': { name: 'Espacios de arte digital / NFT' },
      'design-centers': { name: 'Centros de diseño o creatividad' },
      'immersive-spaces': { name: 'Espacios inmersivos o interactivos' }
    }
  },
  'performing-arts': {
    name: 'Artes Escénicas y Entretenimiento',
    icon: 'Theater',
    color: '#8B4513',
    subcategories: {
      theaters: { name: 'Teatros' },
      'performing-arts-venues': { name: 'Auditorios escénicos' },
      'dance-studios': { name: 'Salas de danza' },
      'circus-spaces': { name: 'Espacios de circo o performance' },
      'comedy-clubs': { name: 'Comedy clubs o bares de stand-up' },
      'indie-cinemas': { name: 'Salas de cine independiente' },
      'multifunctional-spaces': { name: 'Espacios multifuncionales o black box' },
      'cultural-centers': { name: 'Centros culturales con programación en vivo' }
    }
  },
  technology: {
    name: 'Tecnología e Innovación',
    icon: 'Cpu',
    color: '#000000',
    subcategories: {
      coworking: { name: 'Espacios de coworking' },
      'innovation-hubs': { name: 'Hubs de innovación' },
      'tech-labs': { name: 'Laboratorios tecnológicos' },
      'virtual-classrooms': { name: 'Aulas virtuales o híbridas' },
      'vr-spaces': { name: 'Espacios de realidad virtual o metaverso' },
      'gaming-rooms': { name: 'Salas de proyección o gaming' },
      'digital-training': { name: 'Centros de capacitación digital' },
      makerspaces: { name: 'Makerspaces o FabLabs' }
    }
  },
  'wellness-nature': {
    name: 'Bienestar y Naturaleza',
    icon: 'Leaf',
    color: '#FFFFFF',
    subcategories: {
      'eco-farms': { name: 'Fincas ecológicas' },
      'retreat-centers': { name: 'Centros de retiro o meditación' },
      spas: { name: 'Spa o wellness centers' },
      'nature-reserves': { name: 'Reservas naturales' },
      glamping: { name: 'Glampings' },
      'outdoor-spaces': { name: 'Espacios al aire libre' },
      'botanical-gardens': { name: 'Jardines botánicos' },
      'private-beaches': { name: 'Playas privadas o zonas campestres' }
    }
  },
  tourism: {
    name: 'Experiencias Turísticas',
    icon: 'Compass',
    color: '#8A2BE2',
    subcategories: {
      'food-tours': { name: 'Rutas gastronómicas' },
      'cultural-tours': { name: 'Tours culturales' },
      'heritage-houses-tourism': { name: 'Casas patrimoniales' },
      viewpoints: { name: 'Rooftops o miradores' },
      'landmark-streets': { name: 'Calles emblemáticas / arte urbano' },
      'photo-spots': { name: 'Espacios para fotografía urbana' },
      'local-markets': { name: 'Zonas de mercado o tradición local' }
    }
  }
};

// ============================================================
// FUNCIONES HELPER
// ============================================================

/**
 * Obtiene una categoría por ID (datos estructurales)
 */
export function getCategoryById(id: string): PlaceCategory | undefined {
  return PLACE_CATEGORIES.find(cat => cat.id === id);
}

/**
 * Obtiene una subcategoría por IDs de categoría y subcategoría
 */
export function getSubcategoryById(categoryId: string, subcategoryId: string): PlaceSubcategory | undefined {
  const category = getCategoryById(categoryId);
  return category?.subcategories.find(sub => sub.id === subcategoryId);
}

/**
 * Devuelve todas las categorías con sus subcategorías (datos estructurales)
 */
export function getCategoriesWithSubcategories(): PlaceCategory[] {
  return PLACE_CATEGORIES;
}

/**
 * Obtiene los textos de una categoría en el idioma especificado.
 */
export function getLocalizedCategoryStrings(categoryId: string, lang: 'es' = 'es'): PlaceCategoryStrings | undefined {
  const dictionaries = { es: PLACE_STRINGS_ES };
  return dictionaries[lang][categoryId];
}

/**
 * Obtiene el nombre localizado de una categoría
 */
export function getLocalizedCategoryName(categoryId: string, lang: 'es' = 'es'): string {
  return getLocalizedCategoryStrings(categoryId, lang)?.name || categoryId;
}

/**
 * Obtiene el ícono localizado de una categoría
 */
export function getLocalizedCategoryIcon(categoryId: string, lang: 'es' = 'es'): string {
  return getLocalizedCategoryStrings(categoryId, lang)?.icon || 'MapPin'; // fallback
}

/**
 * Obtiene el color localizado de una categoría
 */
export function getLocalizedCategoryColor(categoryId: string, lang: 'es' = 'es'): string {
  return getLocalizedCategoryStrings(categoryId, lang)?.color || '#000000';
}

/**
 * Obtiene el nombre localizado de una subcategoría
 */
export function getLocalizedSubcategoryName(categoryId: string, subcategoryId: string, lang: 'es' = 'es'): string {
  return getLocalizedCategoryStrings(categoryId, lang)?.subcategories[subcategoryId]?.name || subcategoryId;
}

/**
 * Obtiene las subcategorías de una categoría
 */
export function getSubcategoriesByCategory(categoryId: string): PlaceSubcategory[] {
  const category = getCategoryById(categoryId);
  return category?.subcategories || [];
}

/**
 * Obtiene los usos sugeridos de una categoría (IDs)
 */
export function getSuggestedUses(categoryId: string): string[] {
  const category = getCategoryById(categoryId);
  return category?.suggestedUses || [];
}

/**
 * Obtiene las capacidades sugeridas de una categoría
 */
export function getSuggestedCapacities(categoryId: string): number[] {
  const category = getCategoryById(categoryId);
  return category?.suggestedCapacities || [];
}

/**
 * Obtiene las amenidades sugeridas de una categoría
 */
export function getSuggestedAmenities(categoryId: string): string[] {
  const category = getCategoryById(categoryId);
  return category?.suggestedAmenities || [];
}

/**
 * Busca lugares por término de búsqueda (en nombres localizados)
 * Nota: para búsqueda real deberías usar el diccionario según idioma actual.
 */
export function searchPlaces(searchTerm: string, lang: 'es' = 'es') {
  const term = searchTerm.toLowerCase();
  const results: {
    categories: PlaceCategory[];
    subcategories: Array<{ categoryId: string; subcategory: PlaceSubcategory }>;
  } = { categories: [], subcategories: [] };

  PLACE_CATEGORIES.forEach(category => {
    const catStrings = getLocalizedCategoryStrings(category.id, lang);
    if (!catStrings) return;

    // Buscar en categoría
    if (catStrings.name.toLowerCase().includes(term) || catStrings.description?.toLowerCase().includes(term)) {
      results.categories.push(category);
    }

    // Buscar en subcategorías
    category.subcategories.forEach(sub => {
      const subName = catStrings.subcategories[sub.id]?.name || sub.id;
      const subDesc = catStrings.subcategories[sub.id]?.description || '';
      if (subName.toLowerCase().includes(term) || subDesc.toLowerCase().includes(term)) {
        results.subcategories.push({ categoryId: category.id, subcategory: sub });
      }
    });
  });

  return results;
}