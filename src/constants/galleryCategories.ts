export interface GallerySubcategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
}

export interface GalleryCategory {
  id: string;
  name: string;
  description?: string;
  icon: string;
  color: string;
  subcategories: GallerySubcategory[];
}

export const GALLERY_CATEGORIES: GalleryCategory[] = [
  {
    id: 'painting',
    name: 'Pintura',
    icon: 'Palette',
    color: '#3498db',
    subcategories: [
      { id: 'oil', name: 'Óleo' },
      { id: 'acrylic', name: 'Acrílico' },
      { id: 'watercolor', name: 'Acuarela' },
      { id: 'mixed-media', name: 'Técnica mixta / collage' },
      { id: 'digital-illustration', name: 'Ilustración digital' },
      { id: 'portrait', name: 'Retrato' },
      { id: 'landscape', name: 'Paisaje' },
      { id: 'abstract', name: 'Arte abstracto' },
      { id: 'street-art', name: 'Street art / muralismo' },
      { id: 'miniatures', name: 'Miniaturas o formatos pequeños' }
    ]
  },
  {
    id: 'sculpture',
    name: 'Escultura',
    icon: 'Mountain',
    color: '#9b59b6',
    subcategories: [
      { id: 'ceramic', name: 'Cerámica' },
      { id: 'wood', name: 'Madera' },
      { id: 'stone', name: 'Piedra' },
      { id: 'metal', name: 'Metal' },
      { id: 'resin', name: 'Resina o materiales mixtos' },
      { id: 'modern-sculpture', name: 'Escultura moderna' },
      { id: 'classic-sculpture', name: 'Escultura clásica' },
      { id: 'installation', name: 'Instalación escultórica' }
    ]
  },
  {
    id: 'books',
    name: 'Libros',
    icon: 'BookOpen',
    color: '#e74c3c',
    subcategories: [
      { id: 'literature', name: 'Literatura (novela, cuento, poesía)' },
      { id: 'essay', name: 'Ensayo / filosofía / crónica' },
      { id: 'art-books', name: 'Libros de arte o fotografía' },
      { id: 'comics', name: 'Cómics o novelas gráficas' },
      { id: 'children-books', name: 'Libros infantiles o ilustrados' },
      { id: 'manuals', name: 'Manuales y guías profesionales' },
      { id: 'marketing', name: 'Marketing / negocios creativos' },
      { id: 'entrepreneurship', name: 'Emprendimiento / gestión cultural' },
      { id: 'self-development', name: 'Desarrollo personal / liderazgo' },
      { id: 'fanzines', name: 'Fanzines o autopublicaciones' },
      { id: 'antique-books', name: 'Ediciones antiguas o de colección' }
    ]
  },
  {
    id: 'instruments',
    name: 'Instrumentos Musicales',
    icon: 'Music',
    color: '#2ecc71',
    subcategories: [
      { id: 'strings', name: 'Cuerdas (guitarra, violín, bajo, etc.)' },
      { id: 'percussion', name: 'Percusión' },
      { id: 'wind', name: 'Viento' },
      { id: 'keyboards', name: 'Teclados / pianos' },
      { id: 'traditional', name: 'Instrumentos tradicionales' },
      { id: 'accessories', name: 'Accesorios musicales' },
      { id: 'sound-equipment', name: 'Equipos de sonido' },
      { id: 'used-instruments', name: 'Instrumentos restaurados o de segunda mano' }
    ]
  },
  {
    id: 'handicrafts',
    name: 'Artesanías',
    icon: 'Scissors',
    color: '#f39c12',
    subcategories: [
      { id: 'ceramic', name: 'Cerámica tradicional' },
      { id: 'jewelry', name: 'Joyería artesanal' },
      { id: 'textiles', name: 'Tejidos y bordados' },
      { id: 'wood-carving', name: 'Madera tallada' },
      { id: 'indigenous-art', name: 'Arte indígena / ancestral' },
      { id: 'basketry', name: 'Cestería o fibras naturales' },
      { id: 'souvenirs', name: 'Souvenirs culturales' },
      { id: 'sustainable', name: 'Productos sostenibles o reciclados' }
    ]
  },
  {
    id: 'decoration',
    name: 'Decoración',
    icon: 'Home',
    color: '#1abc9c',
    subcategories: [
      { id: 'design-objects', name: 'Objetos de diseño artesanal' },
      { id: 'collectibles', name: 'Piezas de colección' },
      { id: 'furniture', name: 'Muebles artísticos o restaurados' },
      { id: 'lighting', name: 'Lámparas o luminarias' },
      { id: 'tapestry', name: 'Tapices / arte mural' },
      { id: 'botanical', name: 'Arte botánico / terrarios' },
      { id: 'scenography', name: 'Escenografía o ambientación' },
      { id: 'upcycled', name: 'Objetos intervenidos o reciclados' }
    ]
  },
  {
    id: 'fashion-art',
    name: 'Moda Arte (Utilería y Vestuario Artístico)',
    icon: 'Shirt',
    color: '#e84393',
    description: 'Para artistas escénicos, maquilladores, fotógrafos o productores',
    subcategories: [
      { id: 'stage-costumes', name: 'Vestuario escénico (teatro, danza, circo)' },
      { id: 'dance-shoes', name: 'Zapatos para danza o ballet' },
      { id: 'dancewear', name: 'Tutús, leotardos y accesorios de danza' },
      { id: 'costumes', name: 'Disfraces o caracterización' },
      { id: 'props', name: 'Props o accesorios para performance' },
      { id: 'photography-wardrobe', name: 'Indumentaria para fotografía o cine' },
      { id: 'accessories', name: 'Accesorios de autor o cosplay' }
    ]
  },
  {
    id: 'art-supplies',
    name: 'Suministros Artísticos',
    icon: 'Brush',
    color: '#7f8c8d',
    description: 'Todo lo que el artista necesita para crear: desde materiales básicos hasta equipos especializados',
    subcategories: [
      { id: 'paints', name: 'Pinturas y pigmentos (óleo, acrílico, acuarela, spray, tinta, etc.)' },
      { id: 'brushes', name: 'Pinceles, espátulas y herramientas' },
      { id: 'canvases', name: 'Lienzos, bastidores y marcos' },
      { id: 'stationery', name: 'Papelería artística (hojas, cuadernos, sketchbooks, blocs)' },
      { id: 'printing', name: 'Materiales para impresión o fotografía' },
      { id: 'easels', name: 'Soportes y caballetes' },
      { id: 'molding', name: 'Arcilla, resina, yeso, silicona' },
      { id: 'engraving', name: 'Herramientas de grabado o modelado' },
      { id: 'digital', name: 'Materiales digitales (tabletas, stylus, pantallas gráficas)' },
      { id: 'makeup', name: 'Maquillaje artístico / bodypaint' },
      { id: 'other', name: 'Otros' }
    ]
  }
];

// Filtros transversales
export const TRANSACTION_TYPES = [
  { id: 'purchase', name: 'Compra', icon: 'ShoppingCart' },
  { id: 'exchange', name: 'Trueque', icon: 'RefreshCw' },
  { id: 'second-hand', name: 'Segunda mano', icon: 'Clock' },
  { id: 'donation', name: 'Donación', icon: 'Heart' },
  { id: 'rental', name: 'Alquiler', icon: 'Calendar' }
];

export const PRODUCT_CONDITIONS = [
  { id: 'new', name: 'Nuevo' },
  { id: 'used', name: 'Usado' },
  { id: 'restored', name: 'Restaurado / intervenido' }
];

// Funciones de utilidad
export function getCategoryById(id: string): GalleryCategory | undefined {
  return GALLERY_CATEGORIES.find(category => category.id === id);
}

export function getSubcategoryById(categoryId: string, subcategoryId: string) {
  const category = getCategoryById(categoryId);
  if (!category) return undefined;
  return category.subcategories.find(sub => sub.id === subcategoryId);
}

export function searchGalleryItems(searchTerm: string) {
  const term = searchTerm.toLowerCase();
  const results = {
    categories: [] as GalleryCategory[],
    subcategories: [] as Array<{categoryId: string; subcategory: GallerySubcategory}>
  };

  GALLERY_CATEGORIES.forEach(category => {
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