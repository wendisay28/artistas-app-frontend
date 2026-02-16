// src/constants/artistCategories.ts
export const ARTIST_CATEGORIES = [
  {
    id: 'music',
    name: 'Música',
    disciplines: [
      {
        id: 'live',
        name: 'Música en Vivo',
        roles: [
          { id: 'singer', name: 'Cantante' },
          { id: 'guitarist', name: 'Guitarrista' },
          { id: 'drummer', name: 'Baterista' },
          { id: 'bassist', name: 'Bajista' },
          { id: 'pianist', name: 'Pianista' },
          { id: 'dj', name: 'DJ' },
        ]
      },
      {
        id: 'production',
        name: 'Producción Musical',
        roles: [
          { id: 'producer', name: 'Productor' },
          { id: 'mixer', name: 'Ingeniero de Mezcla' },
          { id: 'mastering', name: 'Ingeniero de Mastering' },
        ]
      }
    ]
  },
  {
    id: 'photography',
    name: 'Fotografía',
    disciplines: [
      {
        id: 'portrait',
        name: 'Retrato',
        roles: [
          { id: 'portrait_photographer', name: 'Fotógrafo de Retrato' },
          { id: 'wedding_photographer', name: 'Fotógrafo de Boda' },
        ]
      },
      {
        id: 'commercial',
        name: 'Fotografía Comercial',
        roles: [
          { id: 'product_photographer', name: 'Fotógrafo de Producto' },
          { id: 'fashion_photographer', name: 'Fotógrafo de Moda' },
        ]
      }
    ]
  },
  {
    id: 'design',
    name: 'Diseño',
    disciplines: [
      {
        id: 'graphic',
        name: 'Diseño Gráfico',
        roles: [
          { id: 'graphic_designer', name: 'Diseñador Gráfico' },
          { id: 'brand_designer', name: 'Diseñador de Marca' },
          { id: 'ui_designer', name: 'Diseñador UI' },
        ]
      },
      {
        id: 'digital',
        name: 'Diseño Digital',
        roles: [
          { id: 'web_designer', name: 'Diseñador Web' },
          { id: 'app_designer', name: 'Diseñador de Apps' },
        ]
      }
    ]
  },
  {
    id: 'video',
    name: 'Video',
    disciplines: [
      {
        id: 'production',
        name: 'Producción de Video',
        roles: [
          { id: 'videographer', name: 'Videógrafo' },
          { id: 'video_editor', name: 'Editor de Video' },
          { id: 'director', name: 'Director' },
        ]
      },
      {
        id: 'animation',
        name: 'Animación',
        roles: [
          { id: 'animator', name: 'Animador' },
          { id: 'motion_designer', name: 'Diseñador de Motion' },
        ]
      }
    ]
  },
  {
    id: 'art',
    name: 'Arte',
    disciplines: [
      {
        id: 'visual',
        name: 'Arte Visual',
        roles: [
          { id: 'painter', name: 'Pintor' },
          { id: 'sculptor', name: 'Escultor' },
          { id: 'illustrator', name: 'Ilustrador' },
        ]
      },
      {
        id: 'digital_art',
        name: 'Arte Digital',
        roles: [
          { id: 'digital_artist', name: 'Artista Digital' },
          { id: 'nft_artist', name: 'Artista NFT' },
        ]
      }
    ]
  },
  {
    id: 'performance',
    name: 'Performance',
    disciplines: [
      {
        id: 'theater',
        name: 'Teatro',
        roles: [
          { id: 'actor', name: 'Actor' },
          { id: 'director', name: 'Director de Teatro' },
        ]
      },
      {
        id: 'dance',
        name: 'Danza',
        roles: [
          { id: 'dancer', name: 'Bailarín' },
          { id: 'choreographer', name: 'Coreógrafo' },
        ]
      }
    ]
  }
];

export const getDisciplinesByCategory = (categoryId: string) => {
  const category = ARTIST_CATEGORIES.find(cat => cat.id === categoryId);
  return category ? category.disciplines : [];
};

export const getRolesByDiscipline = (categoryId: string, disciplineId: string) => {
  const category = ARTIST_CATEGORIES.find(cat => cat.id === categoryId);
  if (!category) return [];
  
  const discipline = category.disciplines.find(disc => disc.id === disciplineId);
  return discipline ? discipline.roles : [];
};

export const getSpecializationsByRole = (categoryId: string, disciplineId: string, roleId: string) => {
  // Para futuras especializaciones
  return [];
};
