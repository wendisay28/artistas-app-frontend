// ============================================================
// artistCategoriesBasic.ts - Versión con IDs de roles actualizados
// y etiquetas sugeridas por disciplina
// ============================================================

// ----------------------------------------------------------------------
// Tipos básicos
// ----------------------------------------------------------------------
export interface Role {
  id: string; // Ej: 'pintor', 'escultor', 'community-manager'
}

export interface Discipline {
  id: string; // Ej: 'pintura', 'marketing-digital'
  roles: Role[];
  suggestedTags?: string[]; // Etiquetas sugeridas para esta disciplina
}

export interface Category {
  id: string;
  disciplines: Discipline[];
}

// ----------------------------------------------------------------------
// Datos estructurales (solo IDs)
// 7 categorías con disciplinas y roles generales
// ----------------------------------------------------------------------
export const ARTIST_CATEGORIES: Category[] = [
  // 1. ARTES VISUALES Y PLÁSTICAS
  {
    id: 'artes-visuales',
    disciplines: [
      {
        id: 'pintura',
        roles: [{ id: 'pintor' }],
        suggestedTags: ['oleo', 'acrilico', 'acuarela', 'retrato', 'paisaje', 'abstracto', 'mural']
      },
      {
        id: 'escultura',
        roles: [{ id: 'escultor' }],
        suggestedTags: ['piedra', 'madera', 'metal', 'ceramica', 'resina', 'bronce', 'instalacion']
      },
      {
        id: 'fotografia',
        roles: [{ id: 'fotografo' }],
        suggestedTags: ['retrato', 'paisaje', 'documental', 'fine-art', 'experimental', 'moda', 'producto']
      },
      {
        id: 'ilustracion',
        roles: [{ id: 'ilustrador' }],
        suggestedTags: ['editorial', 'infantil', 'cientifica', 'digital', 'tradicional', 'conceptual']
      },
      {
        id: 'grabado',
        roles: [{ id: 'grabador' }],
        suggestedTags: ['serigrafia', 'linoleo', 'aguafuerte', 'litografia', 'xilografia']
      },
      {
        id: 'arte-digital',
        roles: [{ id: 'artista-digital' }],
        suggestedTags: ['ilustracion-digital', 'arte-generativo', 'nft', 'modelado-3d', 'vr', 'ar', 'ia']
      },
      {
        id: 'curaduria',
        roles: [{ id: 'curador' }],
        suggestedTags: ['arte-contemporaneo', 'fotografia', 'arte-digital', 'patrimonio', 'museos']
      },
      {
        id: 'ceramica',
        roles: [{ id: 'ceramista' }],
        suggestedTags: ['utilitaria', 'escultorica', 'alfareria', 'gres', 'porcelana']
      },
      {
        id: 'artesania',
        roles: [{ id: 'artesano' }],
        suggestedTags: ['textil', 'cuero', 'madera', 'joyeria', 'cesteria', 'indigena']
      }
    ]
  },

  // 2. ARTES ESCÉNICAS Y PERFORMANCE
  {
    id: 'artes-escenicas',
    disciplines: [
      {
        id: 'teatro',
        roles: [
          { id: 'actor' },
          { id: 'director-teatral' },
          { id: 'dramaturgo' }
        ],
        suggestedTags: ['dramatico', 'comedia', 'musical', 'clasico', 'contemporaneo', 'improvisacion']
      },
      {
        id: 'danza',
        roles: [
          { id: 'bailarin' },
          { id: 'coreografo' }
        ],
        suggestedTags: ['ballet', 'contemporaneo', 'folklorico', 'urbano', 'flamenco', 'tango']
      },
      {
        id: 'circo',
        roles: [
          { id: 'payaso' },
          { id: 'malabarista' },
          { id: 'acrobata' },
          { id: 'trapecista' },
          { id: 'contorsionista' },
          { id: 'equilibrista' },
          { id: 'zancudo' },
          { id: 'monociclista' },
          { id: 'titiritero' },
          { id: 'faquir' },
          { id: 'director-circense' }
        ],
        suggestedTags: ['payaso', 'malabares', 'acrobacia', 'trapecista', 'contorsion', 'equilibrio', 'zancos', 'monociclo', 'titeres', 'fuego']
      },
      {
        id: 'magia',
        roles: [{ id: 'mago' }],
        suggestedTags: ['escenario', 'cerca', 'ilusionismo', 'mentalismo', 'infantil']
      },
      {
        id: 'performance',
        roles: [{ id: 'performer' }],
        suggestedTags: ['body-art', 'accion', 'multimedia', 'intervencion']
      },
      {
        id: 'teatro-callejero',
        roles: [{ id: 'artista-callejero' }],
        suggestedTags: ['estatuas-vivientes', 'animacion', 'malabares', 'zancos']
      }
    ]
  },

  // 3. MÚSICA Y SONIDO
  {
    id: 'musica',
    disciplines: [
      {
        id: 'musica-instrumental',
        roles: [
          { id: 'musico' },
          { id: 'instrumentista' },
          { id: 'director-orquesta' }
        ],
        suggestedTags: ['guitarra', 'violin', 'piano', 'bateria', 'bajo', 'vientos', 'cuerdas']
      },
      {
        id: 'canto',
        roles: [
          { id: 'cantante' },
          { id: 'cantante-lirico' }
        ],
        suggestedTags: ['pop', 'rock', 'jazz', 'clasico', 'folklore', 'soprano', 'tenor']
      },
      {
        id: 'produccion-musical',
        roles: [
          { id: 'productor-musical' },
          { id: 'dj' },
          { id: 'compositor' }
        ],
        suggestedTags: ['beatmaker', 'mezcla', 'masterizacion', 'electronica', 'edm', 'hip-hop']
      },
      {
        id: 'sonido',
        roles: [
          { id: 'ingeniero-sonido' },
          { id: 'disenador-sonoro' }
        ],
        suggestedTags: ['sonido-en-vivo', 'grabacion', 'audio-digital', 'sound-design', 'foley']
      }
    ]
  },

  // 4. MEDIOS AUDIOVISUALES Y CINE
  {
    id: 'audiovisual',
    disciplines: [
      {
        id: 'cine',
        roles: [
          { id: 'director-cine' },
          { id: 'guionista' },
          { id: 'productor-audiovisual' },
          { id: 'director-fotografia' }
        ],
        suggestedTags: ['ficcion', 'documental', 'cortometraje', 'largometraje', 'experimental']
      },
      {
        id: 'animacion',
        roles: [
          { id: 'animador-2d' },
          { id: 'animador-3d' },
          { id: 'stop-motion' }
        ],
        suggestedTags: ['2d-digital', '3d', 'stopmotion', 'rigging', 'texturizado', 'layout']
      },
      {
        id: 'edicion-postproduccion',
        roles: [
          { id: 'editor-video' },
          { id: 'colorista' },
          { id: 'vfx-artist' }
        ],
        suggestedTags: ['premiere', 'final-cut', 'davinci', 'after-effects', 'nuke', 'compositing']
      },
      {
        id: 'television',
        roles: [
          { id: 'presentador-tv' },
          { id: 'productor-tv' },
          { id: 'camarografo' }
        ],
        suggestedTags: ['noticias', 'entretenimiento', 'deportes', 'reality', 'live']
      }
    ]
  },

  // 5. DISEÑO Y CREATIVIDAD APLICADA
  {
    id: 'diseno',
    disciplines: [
      {
        id: 'diseno-grafico',
        roles: [
          { id: 'disenador-grafico' },
          { id: 'director-arte' },
          { id: 'branding-designer' }
        ],
        suggestedTags: ['branding', 'editorial', 'packaging', 'tipografia', 'ilustracion', 'social-media']
      },
      {
        id: 'diseno-industrial',
        roles: [
          { id: 'disenador-industrial' },
          { id: 'disenador-producto' }
        ],
        suggestedTags: ['producto', 'mobiliario', 'automotriz', 'ergonomia', 'prototipado']
      },
      {
        id: 'diseno-interiores',
        roles: [
          { id: 'disenador-interiores' },
          { id: 'decorador' }
        ],
        suggestedTags: ['residencial', 'comercial', 'corporativo', 'iluminacion', 'ambientacion']
      },
      {
        id: 'diseno-moda',
        roles: [
          { id: 'disenador-moda' },
          { id: 'patronista' },
          { id: 'modisto' }
        ],
        suggestedTags: ['alta-costura', 'pret-a-porter', 'streetwear', 'sostenible', 'patronaje']
      },
      {
        id: 'diseno-textil',
        roles: [{ id: 'disenador-textil' }],
        suggestedTags: ['estampados', 'tejido', 'bordado', 'tintes', 'texturas']
      },
      {
        id: 'arquitectura',
        roles: [
          { id: 'arquitecto' },
          { id: 'arquitecto-paisajista' }
        ],
        suggestedTags: ['residencial', 'comercial', 'paisajismo', 'urbanismo', 'sostenible']
      }
    ]
  },

  // 6. COMUNICACIÓN, MARKETING Y CONTENIDO
  {
    id: 'comunicacion',
    disciplines: [
      {
        id: 'marketing-digital',
        roles: [
          { id: 'community-manager' },
          { id: 'content-creator' },
          { id: 'ugc-creator' },
          { id: 'copywriter' },
          { id: 'growth-marketer' },
          { id: 'seo-manager' },
          { id: 'personal-brand-creator' }
        ],
        suggestedTags: ['redes-sociales', 'estrategia', 'analitica', 'ads', 'email-marketing', 'inbound', 'posicionamiento']
      },
      {
        id: 'contenido',
        roles: [
          { id: 'creador-contenido' },
          { id: 'influencer' },
          { id: 'youtuber' },
          { id: 'tiktoker' }
        ],
        suggestedTags: ['youtube', 'instagram', 'tiktok', 'twitch', 'linkedin', 'twitter']
      },
      {
        id: 'periodismo',
        roles: [
          { id: 'periodista' },
          { id: 'redactor' },
          { id: 'corresponsal' }
        ],
        suggestedTags: ['noticias', 'entrevistas', 'reportajes', 'investigacion', 'opinion']
      },
      {
        id: 'podcast',
        roles: [
          { id: 'podcaster' },
          { id: 'locutor' }
        ],
        suggestedTags: ['entrevistas', 'narrativo', 'educativo', 'noticias', 'comedia']
      },
      {
        id: 'publicidad',
        roles: [
          { id: 'creativo-publicitario' },
          { id: 'copywriter' },
          { id: 'estratega-marcas' }
        ],
        suggestedTags: ['campañas', 'concepto', 'redaccion', 'marca', 'medios']
      }
    ]
  },

  // 7. PATRIMONIO, CULTURA Y TURISMO
  {
    id: 'cultura-turismo',
    disciplines: [
      {
        id: 'gestion-cultural',
        roles: [
          { id: 'gestor-cultural' },
          { id: 'productor-cultural' },
          { id: 'promotor-cultural' }
        ],
        suggestedTags: ['proyectos', 'convocatorias', 'financiamiento', 'comunidad', 'redes']
      },
      {
        id: 'patrimonio',
        roles: [
          { id: 'restaurador' },
          { id: 'conservador' },
          { id: 'arqueologo' }
        ],
        suggestedTags: ['restauracion', 'conservacion', 'excavacion', 'musealizacion', 'catalogacion']
      },
      {
        id: 'turismo-cultural',
        roles: [
          { id: 'guia-turistico' },
          { id: 'planificador-rutas' }
        ],
        suggestedTags: ['rutas', 'patrimonio', 'museos', 'caminatas', 'turismo-local']
      },
      {
        id: 'gastronomia-local',
        roles: [
          { id: 'chef-tradicional' },
          { id: 'investigador-gastronomico' }
        ],
        suggestedTags: ['cocina-tradicional', 'recetas', 'productos-locales', 'cultura-culinaria']
      },
      {
        id: 'museos',
        roles: [
          { id: 'museografo' },
          { id: 'educador-museos' }
        ],
        suggestedTags: ['curaduria', 'educacion', 'didactica', 'exposiciones', 'publicos']
      }
    ]
  }
];

// ----------------------------------------------------------------------
// Diccionario de textos (ES)
// ----------------------------------------------------------------------
export interface CategoryStrings {
  name: string;
  disciplines: {
    [disciplineId: string]: {
      name: string;
      roles: {
        [roleId: string]: {
          name: string;
        };
      };
    };
  };
}

export const STRINGS_ES: { [categoryId: string]: CategoryStrings } = {
  'artes-visuales': {
    name: 'Artes Visuales y Plásticas',
    disciplines: {
      pintura: {
        name: 'Pintura',
        roles: { pintor: { name: 'Pintor' } }
      },
      escultura: {
        name: 'Escultura',
        roles: { escultor: { name: 'Escultor' } }
      },
      fotografia: {
        name: 'Fotografía',
        roles: { fotografo: { name: 'Fotógrafo' } }
      },
      ilustracion: {
        name: 'Ilustración',
        roles: { ilustrador: { name: 'Ilustrador' } }
      },
      grabado: {
        name: 'Grabado',
        roles: { grabador: { name: 'Grabador' } }
      },
      'arte-digital': {
        name: 'Arte Digital',
        roles: { 'artista-digital': { name: 'Artista Digital' } }
      },
      curaduria: {
        name: 'Curaduría',
        roles: { curador: { name: 'Curador' } }
      },
      ceramica: {
        name: 'Cerámica',
        roles: { ceramista: { name: 'Ceramista' } }
      },
      artesania: {
        name: 'Artesanía',
        roles: { artesano: { name: 'Artesano' } }
      }
    }
  },
  'artes-escenicas': {
    name: 'Artes Escénicas y Performance',
    disciplines: {
      teatro: {
        name: 'Teatro',
        roles: {
          actor: { name: 'Actor/Actriz' },
          'director-teatral': { name: 'Director Teatral' },
          dramaturgo: { name: 'Dramaturgo' }
        }
      },
      danza: {
        name: 'Danza',
        roles: {
          bailarin: { name: 'Bailarín' },
          coreografo: { name: 'Coreógrafo' }
        }
      },
      circo: {
        name: 'Circo',
        roles: {
          payaso: { name: 'Payaso' },
          malabarista: { name: 'Malabarista' },
          acrobata: { name: 'Acróbata' },
          trapecista: { name: 'Trapecista' },
          contorsionista: { name: 'Contorsionista' },
          equilibrista: { name: 'Equilibrista' },
          zancudo: { name: 'Zancudo' },
          monociclista: { name: 'Monociclista' },
          titiritero: { name: 'Titiritero' },
          faquir: { name: 'Faquir / Artista de fuego' },
          'director-circense': { name: 'Director Circense' }
        }
      },
      magia: {
        name: 'Magia',
        roles: { mago: { name: 'Mago/Ilusionista' } }
      },
      performance: {
        name: 'Performance',
        roles: { performer: { name: 'Performer' } }
      },
      'teatro-callejero': {
        name: 'Teatro Callejero',
        roles: { 'artista-callejero': { name: 'Artista Callejero' } }
      }
    }
  },
  'musica': {
    name: 'Música y Sonido',
    disciplines: {
      'musica-instrumental': {
        name: 'Música Instrumental',
        roles: {
          musico: { name: 'Músico' },
          instrumentista: { name: 'Instrumentista' },
          'director-orquesta': { name: 'Director de Orquesta' }
        }
      },
      canto: {
        name: 'Canto',
        roles: {
          cantante: { name: 'Cantante' },
          'cantante-lirico': { name: 'Cantante Lírico' }
        }
      },
      'produccion-musical': {
        name: 'Producción Musical',
        roles: {
          'productor-musical': { name: 'Productor Musical' },
          dj: { name: 'DJ' },
          compositor: { name: 'Compositor' }
        }
      },
      sonido: {
        name: 'Sonido',
        roles: {
          'ingeniero-sonido': { name: 'Ingeniero de Sonido' },
          'disenador-sonoro': { name: 'Diseñador Sonoro' }
        }
      }
    }
  },
  'audiovisual': {
    name: 'Medios Audiovisuales y Cine',
    disciplines: {
      cine: {
        name: 'Cine',
        roles: {
          'director-cine': { name: 'Director de Cine' },
          guionista: { name: 'Guionista' },
          'productor-audiovisual': { name: 'Productor Audiovisual' },
          'director-fotografia': { name: 'Director de Fotografía' }
        }
      },
      animacion: {
        name: 'Animación',
        roles: {
          'animador-2d': { name: 'Animador 2D' },
          'animador-3d': { name: 'Animador 3D' },
          'stop-motion': { name: 'Stop Motion' }
        }
      },
      'edicion-postproduccion': {
        name: 'Edición y Postproducción',
        roles: {
          'editor-video': { name: 'Editor de Video' },
          colorista: { name: 'Colorista' },
          'vfx-artist': { name: 'Artista VFX' }
        }
      },
      television: {
        name: 'Televisión',
        roles: {
          'presentador-tv': { name: 'Presentador de TV' },
          'productor-tv': { name: 'Productor de TV' },
          camarografo: { name: 'Camarógrafo' }
        }
      }
    }
  },
  'diseno': {
    name: 'Diseño y Creatividad Aplicada',
    disciplines: {
      'diseno-grafico': {
        name: 'Diseño Gráfico',
        roles: {
          'disenador-grafico': { name: 'Diseñador Gráfico' },
          'director-arte': { name: 'Director de Arte' },
          'branding-designer': { name: 'Diseñador de Branding' }
        }
      },
      'diseno-industrial': {
        name: 'Diseño Industrial',
        roles: {
          'disenador-industrial': { name: 'Diseñador Industrial' },
          'disenador-producto': { name: 'Diseñador de Producto' }
        }
      },
      'diseno-interiores': {
        name: 'Diseño de Interiores',
        roles: {
          'disenador-interiores': { name: 'Diseñador de Interiores' },
          decorador: { name: 'Decorador' }
        }
      },
      'diseno-moda': {
        name: 'Diseño de Moda',
        roles: {
          'disenador-moda': { name: 'Diseñador de Moda' },
          patronista: { name: 'Patronista' },
          modisto: { name: 'Modisto' }
        }
      },
      'diseno-textil': {
        name: 'Diseño Textil',
        roles: { 'disenador-textil': { name: 'Diseñador Textil' } }
      },
      arquitectura: {
        name: 'Arquitectura',
        roles: {
          arquitecto: { name: 'Arquitecto' },
          'arquitecto-paisajista': { name: 'Arquitecto Paisajista' }
        }
      }
    }
  },
  'comunicacion': {
    name: 'Comunicación, Marketing y Contenido',
    disciplines: {
      'marketing-digital': {
        name: 'Marketing Digital',
        roles: {
          'community-manager': { name: 'Community Manager' },
          'content-creator': { name: 'Content Creator' },
          'ugc-creator': { name: 'UGC Creator' },
          'copywriter': { name: 'Copywriter' },
          'growth-marketer': { name: 'Growth Marketer' },
          'seo-manager': { name: 'SEO Manager' },
          'personal-brand-creator': { name: 'Personal Brand Creator' }
        }
      },
      contenido: {
        name: 'Creación de Contenido',
        roles: {
          'creador-contenido': { name: 'Creador de Contenido' },
          influencer: { name: 'Influencer' },
          youtuber: { name: 'Youtuber' },
          tiktoker: { name: 'Tiktoker' }
        }
      },
      periodismo: {
        name: 'Periodismo',
        roles: {
          periodista: { name: 'Periodista' },
          redactor: { name: 'Redactor' },
          corresponsal: { name: 'Corresponsal' }
        }
      },
      podcast: {
        name: 'Podcast',
        roles: {
          podcaster: { name: 'Podcaster' },
          locutor: { name: 'Locutor' }
        }
      },
      publicidad: {
        name: 'Publicidad',
        roles: {
          'creativo-publicitario': { name: 'Creativo Publicitario' },
          copywriter: { name: 'Copywriter' },
          'estratega-marcas': { name: 'Estratega de Marcas' }
        }
      }
    }
  },
  'cultura-turismo': {
    name: 'Patrimonio, Cultura y Turismo',
    disciplines: {
      'gestion-cultural': {
        name: 'Gestión Cultural',
        roles: {
          'gestor-cultural': { name: 'Gestor Cultural' },
          'productor-cultural': { name: 'Productor Cultural' },
          'promotor-cultural': { name: 'Promotor Cultural' }
        }
      },
      patrimonio: {
        name: 'Patrimonio',
        roles: {
          restaurador: { name: 'Restaurador' },
          conservador: { name: 'Conservador' },
          arqueologo: { name: 'Arqueólogo' }
        }
      },
      'turismo-cultural': {
        name: 'Turismo Cultural',
        roles: {
          'guia-turistico': { name: 'Guía Turístico' },
          'planificador-rutas': { name: 'Planificador de Rutas' }
        }
      },
      'gastronomia-local': {
        name: 'Gastronomía Local',
        roles: {
          'chef-tradicional': { name: 'Chef Tradicional' },
          'investigador-gastronomico': { name: 'Investigador Gastronómico' }
        }
      },
      museos: {
        name: 'Museos',
        roles: {
          museografo: { name: 'Museógrafo' },
          'educador-museos': { name: 'Educador de Museos' }
        }
      }
    }
  }
};

// ----------------------------------------------------------------------
// Funciones helper básicas
// ----------------------------------------------------------------------
export const getCategoryById = (id: string): Category | undefined => {
  return ARTIST_CATEGORIES.find(cat => cat.id === id);
};

export const getDisciplineById = (categoryId: string, disciplineId: string): Discipline | undefined => {
  const category = getCategoryById(categoryId);
  return category?.disciplines.find(d => d.id === disciplineId);
};

export const getRoleById = (categoryId: string, disciplineId: string, roleId: string): Role | undefined => {
  const discipline = getDisciplineById(categoryId, disciplineId);
  return discipline?.roles.find(r => r.id === roleId);
};

export const getLocalizedCategoryName = (categoryId: string, lang: 'es' = 'es'): string => {
  const dicts = { es: STRINGS_ES };
  return dicts[lang][categoryId]?.name || categoryId;
};

export const getLocalizedDisciplineName = (categoryId: string, disciplineId: string, lang: 'es' = 'es'): string => {
  return STRINGS_ES[categoryId]?.disciplines[disciplineId]?.name || disciplineId;
};

export const getLocalizedRoleName = (categoryId: string, disciplineId: string, roleId: string, lang: 'es' = 'es'): string => {
  return STRINGS_ES[categoryId]?.disciplines[disciplineId]?.roles[roleId]?.name || roleId;
};

// Obtener etiquetas sugeridas para una disciplina
export const getSuggestedTagsForDiscipline = (categoryId: string, disciplineId: string): string[] => {
  const discipline = getDisciplineById(categoryId, disciplineId);
  return discipline?.suggestedTags || [];
};

// Búsqueda simple
export const searchCategories = (term: string) => {
  const t = term.toLowerCase();
  return ARTIST_CATEGORIES.filter(cat =>
    getLocalizedCategoryName(cat.id).toLowerCase().includes(t) ||
    cat.disciplines.some(d =>
      getLocalizedDisciplineName(cat.id, d.id).toLowerCase().includes(t) ||
      d.roles.some(r => getLocalizedRoleName(cat.id, d.id, r.id).toLowerCase().includes(t))
    )
  );
};

// Helper functions for CategorySelector
export const getDisciplinesByCategory = (categoryId: string) => {
  const category = getCategoryById(categoryId);
  return category?.disciplines || [];
};

export const getRolesByDiscipline = (categoryId: string, disciplineId: string) => {
  const discipline = getDisciplineById(categoryId, disciplineId);
  return discipline?.roles || [];
};