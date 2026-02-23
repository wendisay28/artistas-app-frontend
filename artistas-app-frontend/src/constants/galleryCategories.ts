// ============================================================
// TIPOS PRINCIPALES PARA GALERÍA (Objetos artísticos)
// ============================================================

export interface GallerySubcategory {
  id: string;
  // El nombre se obtiene del diccionario
}

export interface GalleryCategory {
  id: string;
  subcategories: GallerySubcategory[];
  suggestedUses?: string[];               // Usos sugeridos (ej. 'decoración', 'colección')
  suggestedConditions?: string[];          // Condiciones típicas (ids de PRODUCT_CONDITIONS)
  suggestedTransactionTypes?: string[];    // Tipos de transacción comunes (ids de TRANSACTION_TYPES)
  suggestedPriceRange?: { min: number; max: number }; // Rango de precio típico
}

// ============================================================
// DATOS ESTRUCTURALES (solo IDs)
// ============================================================

export const GALLERY_CATEGORIES: GalleryCategory[] = [
  {
    id: 'painting',
    subcategories: [
      { id: 'oil' },
      { id: 'acrylic' },
      { id: 'watercolor' },
      { id: 'mixed-media' },
      { id: 'digital-illustration' },
      { id: 'portrait' },
      { id: 'landscape' },
      { id: 'abstract' },
      { id: 'street-art' },
      { id: 'miniatures' },
    ],
    suggestedUses: ['decoracion', 'coleccion', 'inversion'],
    suggestedConditions: ['new', 'used'],
    suggestedTransactionTypes: ['purchase', 'exchange'],
    suggestedPriceRange: { min: 50000, max: 5000000 },
  },
  {
    id: 'sculpture',
    subcategories: [
      { id: 'ceramic' },
      { id: 'wood' },
      { id: 'stone' },
      { id: 'metal' },
      { id: 'resin' },
      { id: 'modern-sculpture' },
      { id: 'classic-sculpture' },
      { id: 'installation' },
    ],
    suggestedUses: ['decoracion', 'exterior', 'coleccion'],
    suggestedConditions: ['new', 'restored'],
    suggestedTransactionTypes: ['purchase'],
    suggestedPriceRange: { min: 100000, max: 10000000 },
  },
  {
    id: 'books',
    subcategories: [
      { id: 'literature' },
      { id: 'essay' },
      { id: 'art-books' },
      { id: 'comics' },
      { id: 'children-books' },
      { id: 'manuals' },
      { id: 'marketing' },
      { id: 'entrepreneurship' },
      { id: 'self-development' },
      { id: 'fanzines' },
      { id: 'antique-books' },
    ],
    suggestedUses: ['lectura', 'investigacion', 'coleccion'],
    suggestedConditions: ['new', 'used'],
    suggestedTransactionTypes: ['purchase', 'second-hand', 'exchange'],
    suggestedPriceRange: { min: 10000, max: 200000 },
  },
  {
    id: 'instruments',
    subcategories: [
      { id: 'strings' },
      { id: 'percussion' },
      { id: 'wind' },
      { id: 'keyboards' },
      { id: 'traditional' },
      { id: 'accessories' },
      { id: 'sound-equipment' },
      { id: 'used-instruments' },
    ],
    suggestedUses: ['musica', 'grabacion', 'ensenanza'],
    suggestedConditions: ['new', 'used', 'restored'],
    suggestedTransactionTypes: ['purchase', 'second-hand', 'rental'],
    suggestedPriceRange: { min: 50000, max: 3000000 },
  },
  {
    id: 'handicrafts',
    subcategories: [
      { id: 'ceramic' },
      { id: 'jewelry' },
      { id: 'textiles' },
      { id: 'wood-carving' },
      { id: 'indigenous-art' },
      { id: 'basketry' },
      { id: 'souvenirs' },
      { id: 'sustainable' },
    ],
    suggestedUses: ['decoracion', 'regalo', 'tradicion'],
    suggestedConditions: ['new'],
    suggestedTransactionTypes: ['purchase', 'exchange'],
    suggestedPriceRange: { min: 10000, max: 500000 },
  },
  {
    id: 'decoration',
    subcategories: [
      { id: 'design-objects' },
      { id: 'collectibles' },
      { id: 'furniture' },
      { id: 'lighting' },
      { id: 'tapestry' },
      { id: 'botanical' },
      { id: 'scenography' },
      { id: 'upcycled' },
    ],
    suggestedUses: ['decoracion', 'ambientacion', 'eventos'],
    suggestedConditions: ['new', 'restored'],
    suggestedTransactionTypes: ['purchase', 'rental'],
    suggestedPriceRange: { min: 20000, max: 2000000 },
  },
  {
    id: 'fashion-art',
    subcategories: [
      { id: 'stage-costumes' },
      { id: 'dance-shoes' },
      { id: 'dancewear' },
      { id: 'costumes' },
      { id: 'props' },
      { id: 'photography-wardrobe' },
      { id: 'accessories' },
    ],
    suggestedUses: ['vestuario', 'performance', 'fotografia'],
    suggestedConditions: ['new', 'used'],
    suggestedTransactionTypes: ['purchase', 'rental'],
    suggestedPriceRange: { min: 30000, max: 800000 },
  },
  {
    id: 'art-supplies',
    subcategories: [
      { id: 'paints' },
      { id: 'brushes' },
      { id: 'canvases' },
      { id: 'stationery' },
      { id: 'printing' },
      { id: 'easels' },
      { id: 'molding' },
      { id: 'engraving' },
      { id: 'digital' },
      { id: 'makeup' },
      { id: 'other' },
    ],
    suggestedUses: ['creacion', 'ensenanza', 'restauracion'],
    suggestedConditions: ['new'],
    suggestedTransactionTypes: ['purchase'],
    suggestedPriceRange: { min: 5000, max: 500000 },
  },
];

// ============================================================
// FILTROS TRANSVERSALES (constantes)
// ============================================================

export const TRANSACTION_TYPES = [
  { id: 'purchase' },
  { id: 'exchange' },
  { id: 'second-hand' },
  { id: 'donation' },
  { id: 'rental' },
] as const;

export const PRODUCT_CONDITIONS = [
  { id: 'new' },
  { id: 'used' },
  { id: 'restored' },
] as const;

// ============================================================
// DICCIONARIO DE TEXTOS (ESPAÑOL)
// ============================================================

export interface GalleryStrings {
  categories: {
    [categoryId: string]: {
      name: string;
      description?: string;
      icon: string;
      color: string;
      subcategories: {
        [subId: string]: {
          name: string;
          description?: string;
          icon?: string;
        };
      };
    };
  };
  transactionTypes: {
    [id: string]: { name: string; icon: string };
  };
  conditions: {
    [id: string]: string;
  };
  uses: {
    [id: string]: string; // para suggestedUses
  };
}

export const GALLERY_STRINGS_ES: GalleryStrings = {
  categories: {
    painting: {
      name: 'Pintura',
      description: 'Obras pictóricas en diversas técnicas y estilos',
      icon: 'Palette',
      color: '#3498db',
      subcategories: {
        oil: { name: 'Óleo', description: 'Pintura al óleo sobre lienzo o tabla' },
        acrylic: { name: 'Acrílico', description: 'Pintura acrílica' },
        watercolor: { name: 'Acuarela', description: 'Pintura con acuarelas' },
        'mixed-media': { name: 'Técnica mixta / collage' },
        'digital-illustration': { name: 'Ilustración digital' },
        portrait: { name: 'Retrato' },
        landscape: { name: 'Paisaje' },
        abstract: { name: 'Arte abstracto' },
        'street-art': { name: 'Street art / muralismo' },
        miniatures: { name: 'Miniaturas o formatos pequeños' },
      },
    },
    sculpture: {
      name: 'Escultura',
      icon: 'Mountain',
      color: '#9b59b6',
      subcategories: {
        ceramic: { name: 'Cerámica' },
        wood: { name: 'Madera' },
        stone: { name: 'Piedra' },
        metal: { name: 'Metal' },
        resin: { name: 'Resina o materiales mixtos' },
        'modern-sculpture': { name: 'Escultura moderna' },
        'classic-sculpture': { name: 'Escultura clásica' },
        installation: { name: 'Instalación escultórica' },
      },
    },
    books: {
      name: 'Libros',
      icon: 'BookOpen',
      color: '#e74c3c',
      subcategories: {
        literature: { name: 'Literatura (novela, cuento, poesía)' },
        essay: { name: 'Ensayo / filosofía / crónica' },
        'art-books': { name: 'Libros de arte o fotografía' },
        comics: { name: 'Cómics o novelas gráficas' },
        'children-books': { name: 'Libros infantiles o ilustrados' },
        manuals: { name: 'Manuales y guías profesionales' },
        marketing: { name: 'Marketing / negocios creativos' },
        entrepreneurship: { name: 'Emprendimiento / gestión cultural' },
        'self-development': { name: 'Desarrollo personal / liderazgo' },
        fanzines: { name: 'Fanzines o autopublicaciones' },
        'antique-books': { name: 'Ediciones antiguas o de colección' },
      },
    },
    instruments: {
      name: 'Instrumentos Musicales',
      icon: 'Music',
      color: '#2ecc71',
      subcategories: {
        strings: { name: 'Cuerdas (guitarra, violín, bajo, etc.)' },
        percussion: { name: 'Percusión' },
        wind: { name: 'Viento' },
        keyboards: { name: 'Teclados / pianos' },
        traditional: { name: 'Instrumentos tradicionales' },
        accessories: { name: 'Accesorios musicales' },
        'sound-equipment': { name: 'Equipos de sonido' },
        'used-instruments': { name: 'Instrumentos restaurados o de segunda mano' },
      },
    },
    handicrafts: {
      name: 'Artesanías',
      icon: 'Scissors',
      color: '#f39c12',
      subcategories: {
        ceramic: { name: 'Cerámica tradicional' },
        jewelry: { name: 'Joyería artesanal' },
        textiles: { name: 'Tejidos y bordados' },
        'wood-carving': { name: 'Madera tallada' },
        'indigenous-art': { name: 'Arte indígena / ancestral' },
        basketry: { name: 'Cestería o fibras naturales' },
        souvenirs: { name: 'Souvenirs culturales' },
        sustainable: { name: 'Productos sostenibles o reciclados' },
      },
    },
    decoration: {
      name: 'Decoración',
      icon: 'Home',
      color: '#1abc9c',
      subcategories: {
        'design-objects': { name: 'Objetos de diseño artesanal' },
        collectibles: { name: 'Piezas de colección' },
        furniture: { name: 'Muebles artísticos o restaurados' },
        lighting: { name: 'Lámparas o luminarias' },
        tapestry: { name: 'Tapices / arte mural' },
        botanical: { name: 'Arte botánico / terrarios' },
        scenography: { name: 'Escenografía o ambientación' },
        upcycled: { name: 'Objetos intervenidos o reciclados' },
      },
    },
    'fashion-art': {
      name: 'Moda Arte (Utilería y Vestuario Artístico)',
      description: 'Para artistas escénicos, maquilladores, fotógrafos o productores',
      icon: 'Shirt',
      color: '#e84393',
      subcategories: {
        'stage-costumes': { name: 'Vestuario escénico (teatro, danza, circo)' },
        'dance-shoes': { name: 'Zapatos para danza o ballet' },
        dancewear: { name: 'Tutús, leotardos y accesorios de danza' },
        costumes: { name: 'Disfraces o caracterización' },
        props: { name: 'Props o accesorios para performance' },
        'photography-wardrobe': { name: 'Indumentaria para fotografía o cine' },
        accessories: { name: 'Accesorios de autor o cosplay' },
      },
    },
    'art-supplies': {
      name: 'Suministros Artísticos',
      description: 'Todo lo que el artista necesita para crear',
      icon: 'Brush',
      color: '#7f8c8d',
      subcategories: {
        paints: { name: 'Pinturas y pigmentos (óleo, acrílico, acuarela, spray, tinta, etc.)' },
        brushes: { name: 'Pinceles, espátulas y herramientas' },
        canvases: { name: 'Lienzos, bastidores y marcos' },
        stationery: { name: 'Papelería artística (hojas, cuadernos, sketchbooks, blocs)' },
        printing: { name: 'Materiales para impresión o fotografía' },
        easels: { name: 'Soportes y caballetes' },
        molding: { name: 'Arcilla, resina, yeso, silicona' },
        engraving: { name: 'Herramientas de grabado o modelado' },
        digital: { name: 'Materiales digitales (tabletas, stylus, pantallas gráficas)' },
        makeup: { name: 'Maquillaje artístico / bodypaint' },
        other: { name: 'Otros' },
      },
    },
  },
  transactionTypes: {
    purchase: { name: 'Compra', icon: 'ShoppingCart' },
    exchange: { name: 'Trueque', icon: 'RefreshCw' },
    'second-hand': { name: 'Segunda mano', icon: 'Clock' },
    donation: { name: 'Donación', icon: 'Heart' },
    rental: { name: 'Alquiler', icon: 'Calendar' },
  },
  conditions: {
    new: 'Nuevo',
    used: 'Usado',
    restored: 'Restaurado / intervenido',
  },
  uses: {
    decoracion: 'Decoración',
    coleccion: 'Colección',
    inversion: 'Inversión',
    exterior: 'Exterior',
    lectura: 'Lectura',
    investigacion: 'Investigación',
    musica: 'Música',
    grabacion: 'Grabación',
    ensenanza: 'Enseñanza',
    regalo: 'Regalo',
    tradicion: 'Tradición',
    ambientacion: 'Ambientación',
    eventos: 'Eventos',
    vestuario: 'Vestuario',
    performance: 'Performance',
    fotografia: 'Fotografía',
    creacion: 'Creación',
    restauracion: 'Restauración',
  },
};

// ============================================================
// FUNCIONES HELPER (con localización)
// ============================================================

export const getCategoryById = (id: string): GalleryCategory | undefined => {
  return GALLERY_CATEGORIES.find(cat => cat.id === id);
};

export const getSubcategoriesByCategory = (categoryId: string): GallerySubcategory[] => {
  const cat = getCategoryById(categoryId);
  return cat?.subcategories || [];
};

export const getSubcategoryById = (categoryId: string, subId: string): GallerySubcategory | undefined => {
  const cat = getCategoryById(categoryId);
  return cat?.subcategories.find(sub => sub.id === subId);
};

// Localización

export const getLocalizedGalleryCategoryName = (categoryId: string): string => {
  return GALLERY_STRINGS_ES.categories[categoryId]?.name || categoryId;
};

export const getLocalizedGalleryCategoryDescription = (categoryId: string): string | undefined => {
  return GALLERY_STRINGS_ES.categories[categoryId]?.description;
};

export const getLocalizedGalleryCategoryIcon = (categoryId: string): string => {
  return GALLERY_STRINGS_ES.categories[categoryId]?.icon || 'Package';
};

export const getLocalizedGalleryCategoryColor = (categoryId: string): string => {
  return GALLERY_STRINGS_ES.categories[categoryId]?.color || '#888';
};

export const getLocalizedGallerySubcategoryName = (categoryId: string, subId: string): string => {
  return GALLERY_STRINGS_ES.categories[categoryId]?.subcategories[subId]?.name || subId;
};

export const getLocalizedGallerySubcategoryDescription = (categoryId: string, subId: string): string | undefined => {
  return GALLERY_STRINGS_ES.categories[categoryId]?.subcategories[subId]?.description;
};

export const getLocalizedTransactionType = (id: string): { name: string; icon: string } => {
  return GALLERY_STRINGS_ES.transactionTypes[id] || { name: id, icon: 'Circle' };
};

export const getLocalizedCondition = (id: string): string => {
  return GALLERY_STRINGS_ES.conditions[id] || id;
};

export const getLocalizedUse = (id: string): string => {
  return GALLERY_STRINGS_ES.uses[id] || id;
};

// Búsqueda

export const searchGalleryItems = (searchTerm: string) => {
  const term = searchTerm.toLowerCase();
  const results: {
    categories: GalleryCategory[];
    subcategories: Array<{ categoryId: string; subcategory: GallerySubcategory }>;
  } = {
    categories: [],
    subcategories: [],
  };

  GALLERY_CATEGORIES.forEach(category => {
    const catName = getLocalizedGalleryCategoryName(category.id).toLowerCase();
    const catDesc = getLocalizedGalleryCategoryDescription(category.id)?.toLowerCase() || '';
    if (catName.includes(term) || catDesc.includes(term)) {
      results.categories.push(category);
    }

    category.subcategories.forEach(sub => {
      const subName = getLocalizedGallerySubcategoryName(category.id, sub.id).toLowerCase();
      const subDesc = getLocalizedGallerySubcategoryDescription(category.id, sub.id)?.toLowerCase() || '';
      if (subName.includes(term) || subDesc.includes(term)) {
        results.subcategories.push({ categoryId: category.id, subcategory: sub });
      }
    });
  });

  return results;
};

// Obtener todos los usos únicos (para filtros)
export const getAllUses = (): string[] => {
  const usesSet = new Set<string>();
  GALLERY_CATEGORIES.forEach(cat => {
    cat.suggestedUses?.forEach(use => usesSet.add(use));
  });
  return Array.from(usesSet);
};

// ============================================================
// TIPOS AUXILIARES (exportados para usar en filtros)
// ============================================================

export type TransactionTypeId = typeof TRANSACTION_TYPES[number]['id'];
export type ConditionId = typeof PRODUCT_CONDITIONS[number]['id'];