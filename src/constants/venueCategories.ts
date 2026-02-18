export interface PlaceSubcategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
}

export interface PlaceCategory {
  id: string;
  name: string;
  description?: string;
  icon: string;
  color: string;
  subcategories: PlaceSubcategory[];
  suggestedUses?: string[];
}

export const PLACE_CATEGORIES: PlaceCategory[] = [
  {
    id: 'gastronomy',
    name: 'Gastronomía y Cafés',
    icon: 'Utensils',
    color: '#8A2BE2', // 🟣
    suggestedUses: [
      'Reservas para cenas', 
      'Citas', 
      'Reuniones', 
      'Eventos gastronómicos',
      'Experiencias culinarias'
    ],
    subcategories: [
      { id: 'restaurants', name: 'Restaurantes' },
      { id: 'bars-rooftops', name: 'Bares / rooftops' },
      { id: 'cafes', name: 'Cafeterías' },
      { id: 'bistros', name: 'Bistrós o gastrobares' },
      { id: 'bakeries', name: 'Pastelerías o panaderías artesanales' },
      { id: 'brunch-spots', name: 'Espacios con brunch' },
      { id: 'food-trucks', name: 'Food trucks o patios gastronómicos' },
      { id: 'themed-restaurants', name: 'Restaurantes temáticos' }
    ]
  },
  {
    id: 'event-spaces',
    name: 'Espacios para Eventos',
    icon: 'Calendar',
    color: '#1E90FF', // 🔵
    suggestedUses: [
      'Bodas',
      'Celebraciones',
      'Conferencias',
      'Eventos corporativos',
      'Reuniones sociales'
    ],
    subcategories: [
      { id: 'event-halls', name: 'Salones de eventos' },
      { id: 'farms', name: 'Fincas o haciendas' },
      { id: 'terraces', name: 'Terrazas o jardines' },
      { id: 'auditoriums', name: 'Auditorios' },
      { id: 'convention-centers', name: 'Centros de convenciones' },
      { id: 'corporate-spaces', name: 'Espacios corporativos o de networking' },
      { id: 'wedding-venues', name: 'Espacios para bodas o celebraciones' },
      { id: 'rooftop-venues', name: 'Rooftops o venues con vista panorámica' }
    ]
  },
  {
    id: 'cultural-literary',
    name: 'Espacios Culturales y Literarios',
    icon: 'BookOpen',
    color: '#2E8B57', // 🟢
    suggestedUses: [
      'Lanzamientos de libros',
      'Recitales poéticos',
      'Charlas',
      'Exposiciones',
      'Encuentros culturales'
    ],
    subcategories: [
      { id: 'libraries', name: 'Bibliotecas' },
      { id: 'bookstores', name: 'Librerías' },
      { id: 'cultural-houses', name: 'Casas culturales' },
      { id: 'reading-centers', name: 'Centros de lectura' },
      { id: 'literary-spaces', name: 'Espacios literarios independientes' },
      { id: 'publishing-spaces', name: 'Salas de lanzamiento editorial' },
      { id: 'museums', name: 'Museos o salas de exhibición cultural' },
      { id: 'heritage-houses', name: 'Casas patrimoniales o de memoria' }
    ]
  },
  {
    id: 'creative-studios',
    name: 'Estudios Creativos y de Producción',
    icon: 'Video',
    color: '#FF8C00', // 🟠
    suggestedUses: [
      'Grabación',
      'Producción',
      'Ensayos',
      'Desarrollo de proyectos',
      'Sesiones creativas'
    ],
    subcategories: [
      { id: 'recording-studios', name: 'Estudios de grabación musical' },
      { id: 'photo-studios', name: 'Estudios de fotografía' },
      { id: 'film-studios', name: 'Estudios de video o cine' },
      { id: 'rehearsal-spaces', name: 'Salas de ensayo' },
      { id: 'podcast-studios', name: 'Espacios de podcast' },
      { id: 'voice-booths', name: 'Cabinas de locución' },
      { id: 'creative-labs', name: 'Laboratorios creativos' },
      { id: 'editing-studios', name: 'Espacios de edición o postproducción' }
    ]
  },
  {
    id: 'art-exhibition',
    name: 'Arte y Exposición',
    icon: 'Palette',
    color: '#FFD700', // 🟡
    suggestedUses: [
      'Exhibición de obras',
      'Curadurías',
      'Instalaciones artísticas',
      'Eventos de arte visual',
      'Presentaciones artísticas'
    ],
    subcategories: [
      { id: 'art-galleries', name: 'Galerías de arte' },
      { id: 'museums', name: 'Museos' },
      { id: 'exhibition-halls', name: 'Salas de exposición' },
      { id: 'street-art', name: 'Espacios de arte urbano / muralismo' },
      { id: 'artist-studios', name: 'Talleres de artistas' },
      { id: 'digital-art', name: 'Espacios de arte digital / NFT' },
      { id: 'design-centers', name: 'Centros de diseño o creatividad' },
      { id: 'immersive-spaces', name: 'Espacios inmersivos o interactivos' }
    ]
  },
  {
    id: 'performing-arts',
    name: 'Artes Escénicas y Entretenimiento',
    icon: 'Theater',
    color: '#8B4513', // 🟤
    suggestedUses: [
      'Presentaciones en vivo',
      'Ensayos',
      'Funciones',
      'Espectáculos',
      'Eventos culturales'
    ],
    subcategories: [
      { id: 'theaters', name: 'Teatros' },
      { id: 'performing-arts-venues', name: 'Auditorios escénicos' },
      { id: 'dance-studios', name: 'Salas de danza' },
      { id: 'circus-spaces', name: 'Espacios de circo o performance' },
      { id: 'comedy-clubs', name: 'Comedy clubs o bares de stand-up' },
      { id: 'indie-cinemas', name: 'Salas de cine independiente' },
      { id: 'multifunctional-spaces', name: 'Espacios multifuncionales o black box' },
      { id: 'cultural-centers', name: 'Centros culturales con programación en vivo' }
    ]
  },
  {
    id: 'technology',
    name: 'Tecnología e Innovación',
    icon: 'Cpu',
    color: '#000000', // ⚫
    suggestedUses: [
      'Hackathons',
      'Lanzamientos de apps',
      'Sesiones creativas',
      'Talleres',
      'Experiencias tecnológicas'
    ],
    subcategories: [
      { id: 'coworking', name: 'Espacios de coworking' },
      { id: 'innovation-hubs', name: 'Hubs de innovación' },
      { id: 'tech-labs', name: 'Laboratorios tecnológicos' },
      { id: 'virtual-classrooms', name: 'Aulas virtuales o híbridas' },
      { id: 'vr-spaces', name: 'Espacios de realidad virtual o metaverso' },
      { id: 'gaming-rooms', name: 'Salas de proyección o gaming' },
      { id: 'digital-training', name: 'Centros de capacitación digital' },
      { id: 'makerspaces', name: 'Makerspaces o FabLabs' }
    ]
  },
  {
    id: 'wellness-nature',
    name: 'Bienestar y Naturaleza',
    icon: 'Leaf',
    color: '#FFFFFF', // ⚪
    suggestedUses: [
      'Experiencias de bienestar',
      'Retiros creativos',
      'Sesiones fotográficas',
      'Desconexión',
      'Actividades al aire libre'
    ],
    subcategories: [
      { id: 'eco-farms', name: 'Fincas ecológicas' },
      { id: 'retreat-centers', name: 'Centros de retiro o meditación' },
      { id: 'spas', name: 'Spa o wellness centers' },
      { id: 'nature-reserves', name: 'Reservas naturales' },
      { id: 'glamping', name: 'Glampings' },
      { id: 'outdoor-spaces', name: 'Espacios al aire libre' },
      { id: 'botanical-gardens', name: 'Jardines botánicos' },
      { id: 'private-beaches', name: 'Playas privadas o zonas campestres' }
    ]
  },
  {
    id: 'tourism',
    name: 'Experiencias Turísticas',
    icon: 'Compass',
    color: '#8A2BE2', // 🟣 (mismo que gastronomía para agrupación visual)
    suggestedUses: [
      'Rutas turísticas',
      'Experiencias culturales',
      'Fotografía',
      'Turismo local',
      'Exploración urbana'
    ],
    subcategories: [
      { id: 'food-tours', name: 'Rutas gastronómicas' },
      { id: 'cultural-tours', name: 'Tours culturales' },
      { id: 'heritage-houses-tourism', name: 'Casas patrimoniales' },
      { id: 'viewpoints', name: 'Rooftops o miradores' },
      { id: 'landmark-streets', name: 'Calles emblemáticas / arte urbano' },
      { id: 'photo-spots', name: 'Espacios para fotografía urbana' },
      { id: 'local-markets', name: 'Zonas de mercado o tradición local' }
    ]
  }
];

// Funciones de utilidad
export function getCategoryById(id: string): PlaceCategory | undefined {
  return PLACE_CATEGORIES.find(category => category.id === id);
}

export function getSubcategoryById(categoryId: string, subcategoryId: string) {
  const category = getCategoryById(categoryId);
  if (!category) return undefined;
  return category.subcategories.find(sub => sub.id === subcategoryId);
}

export function getCategoriesWithSubcategories() {
  return PLACE_CATEGORIES.map(category => ({
    ...category,
    subcategories: category.subcategories || []
  }));
}

export function searchPlaces(searchTerm: string) {
  const term = searchTerm.toLowerCase();
  const results = {
    categories: [] as PlaceCategory[],
    subcategories: [] as Array<{categoryId: string; subcategory: PlaceSubcategory}>
  };

  PLACE_CATEGORIES.forEach(category => {
    // Buscar en categorías
    if (category.name.toLowerCase().includes(term) || 
        category.description?.toLowerCase().includes(term)) {
      results.categories.push(category);
    }

    // Buscar en subcategorías
    category.subcategories.forEach(subcategory => {
      if (subcategory.name.toLowerCase().includes(term) || 
          subcategory.description?.toLowerCase().includes(term)) {
        results.subcategories.push({
          categoryId: category.id,
          subcategory
        });
      }
    });
  });

  return results;
}