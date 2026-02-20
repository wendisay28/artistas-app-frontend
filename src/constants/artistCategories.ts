// ============================================================
// TIPOS PRINCIPALES
// ============================================================

export interface Specialization {
  id: string;
  // El nombre se obtiene del diccionario de idiomas
}

export interface SuggestedStat {
  id: string;               // Identificador único del stat
  label: string;            // Nombre mostrado al usuario
  type: 'number' | 'text' | 'single-select' | 'multi-select';
  options?: string[];       // Opciones para selects
}

export interface Role {
  id: string;
  specializations: Specialization[];
  suggestedDisciplines?: string[];  // IDs de disciplinas sugeridas como talentos adicionales
  suggestedStats?: SuggestedStat[]; // Estadísticas recomendadas con metadatos
}

export interface Discipline {
  id: string;
  roles: Role[];
}

export interface Category {
  id: string;
  disciplines: Discipline[];
}

// ============================================================
// DATOS ESTRUCTURALES (solo IDs, sin textos)
// ============================================================

export const ARTIST_CATEGORIES: Category[] = [
  // ============================================================
  // CATEGORÍA 1: ARTES VISUALES Y PLÁSTICAS
  // ============================================================
  {
    id: 'artes-visuales',
    disciplines: [
      {
        id: 'pintura',
        roles: [
          {
            id: 'pintor',
            specializations: [
              { id: 'oleo' },
              { id: 'acuarela' },
              { id: 'retrato' },
              { id: 'mural' },
              { id: 'abstracto' },
            ],
            suggestedDisciplines: ['escultura', 'ilustracion', 'fotografia'],
            suggestedStats: [
              { id: 'años_experiencia', label: 'Años de experiencia', type: 'number' },
              { id: 'nivel_técnico', label: 'Nivel técnico', type: 'single-select', options: ['Básico', 'Intermedio', 'Avanzado', 'Profesional'] },
              { id: 'técnica_preferida', label: 'Técnica preferida', type: 'text' },
              { id: 'tamaño_obra', label: 'Tamaño de obra', type: 'text' },
              { id: 'exposición_realizada', label: 'Exposiciones realizadas', type: 'number' },
            ],
          },
        ],
      },
      {
        id: 'escultura',
        roles: [
          {
            id: 'escultor',
            specializations: [
              { id: 'piedra' },
              { id: 'madera' },
              { id: 'metal' },
              { id: 'ceramica' },
            ],
            suggestedDisciplines: ['ceramica', 'diseno-producto'],
            suggestedStats: [
              { id: 'material_principal', label: 'Material principal', type: 'text' },
              { id: 'técnica', label: 'Técnica', type: 'text' },
              { id: 'volumen_trabajo', label: 'Volumen de trabajo (m³ aprox)', type: 'number' },
              { id: 'exposiciones', label: 'Exposiciones', type: 'number' },
            ],
          },
        ],
      },
      {
        id: 'ilustracion',
        roles: [
          {
            id: 'ilustrador',
            specializations: [
              { id: 'editorial' },
              { id: 'infantil' },
              { id: 'digital' },
              { id: 'cientifica' },
            ],
            suggestedDisciplines: ['diseno-grafico', 'animacion'],
            suggestedStats: [
              { id: 'software_domina', label: 'Software que domina', type: 'text' },
              { id: 'estilo_visual', label: 'Estilo visual', type: 'text' },
              { id: 'clientes_prioritarios', label: 'Clientes prioritarios', type: 'text' },
            ],
          },
        ],
      },
      {
        id: 'graffiti',
        roles: [
          {
            id: 'graffitero',
            specializations: [
              { id: 'graffiti-mural' },
              { id: 'stencil' },
              { id: 'comercial' },
            ],
            suggestedDisciplines: ['pintura', 'diseno-grafico'],
            suggestedStats: [
              { id: 'superficie_pintada', label: 'Superficie pintada (m²)', type: 'number' },
              { id: 'estilo', label: 'Estilo', type: 'text' },
              { id: 'años_experiencia', label: 'Años de experiencia', type: 'number' },
            ],
          },
        ],
      },
      {
        id: 'caricatura',
        roles: [
          {
            id: 'caricaturista',
            specializations: [
              { id: 'eventos' },
              { id: 'digital' },
              { id: 'politico' },
            ],
            suggestedDisciplines: ['ilustracion', 'diseno-grafico'],
            suggestedStats: [
              { id: 'estilo', label: 'Estilo', type: 'text' },
              { id: 'eventos_realizados', label: 'Eventos realizados', type: 'number' },
              { id: 'años_experiencia', label: 'Años de experiencia', type: 'number' },
            ],
          },
        ],
      },
      {
        id: 'fotografia',
        roles: [
          {
            id: 'fotografo',
            specializations: [
              { id: 'bodas' },
              { id: 'eventos' },
              { id: 'retrato' },
              { id: 'comercial' },
              { id: 'moda' },
              { id: 'producto' },
            ],
            suggestedDisciplines: ['edicion-video', 'diseno-grafico'],
            suggestedStats: [
              { id: 'cámara_principal', label: 'Cámara principal', type: 'text' },
              { id: 'estilo', label: 'Estilo', type: 'text' },
              { id: 'software_uso', label: 'Software de edición', type: 'text' },
              { id: 'eventos_cubiertos', label: 'Eventos cubiertos', type: 'number' },
            ],
          },
        ],
      },
      {
        id: 'diseno-grafico',
        roles: [
          {
            id: 'disenador-grafico',
            specializations: [
              { id: 'branding' },
              { id: 'editorial' },
              { id: 'packaging' },
              { id: 'publicidad' },
            ],
            suggestedDisciplines: ['ilustracion', 'diseno-web'],
            suggestedStats: [
              { id: 'software_principal', label: 'Software principal', type: 'text' },
              { id: 'proyectos_realizados', label: 'Proyectos realizados', type: 'number' },
              { id: 'años_experiencia', label: 'Años de experiencia', type: 'number' },
            ],
          },
        ],
      },
      {
        id: 'grabado',
        roles: [
          {
            id: 'grabador',
            specializations: [
              { id: 'serigrafia' },
              { id: 'linoleografia' },
              { id: 'litografia' },
            ],
            suggestedDisciplines: ['ilustracion', 'diseno-textil'],
            suggestedStats: [
              { id: 'técnica_principal', label: 'Técnica principal', type: 'text' },
              { id: 'tiraje_promedio', label: 'Tiraje promedio', type: 'number' },
              { id: 'años_experiencia', label: 'Años de experiencia', type: 'number' },
            ],
          },
        ],
      },
      {
        id: 'ceramica',
        roles: [
          {
            id: 'ceramista',
            specializations: [
              { id: 'utilitaria' },
              { id: 'escultorica' },
              { id: 'decorativa' },
            ],
            suggestedDisciplines: ['escultura', 'artesania'],
            suggestedStats: [
              { id: 'técnica', label: 'Técnica', type: 'text' },
              { id: 'tipo_horno', label: 'Tipo de horno', type: 'text' },
              { id: 'producción_mensual', label: 'Producción mensual (piezas)', type: 'number' },
            ],
          },
        ],
      },
      {
        id: 'arte-corporal',
        roles: [
          {
            id: 'maquillador-artistico',
            specializations: [
              { id: 'efectos-especiales' },
              { id: 'body-paint' },
              { id: 'caracterizacion' },
            ],
            suggestedDisciplines: ['moda', 'fotografia'],
            suggestedStats: [
              { id: 'años_experiencia', label: 'Años de experiencia', type: 'number' },
              { id: 'productos_uso', label: 'Productos que usa', type: 'text' },
              { id: 'eventos_realizados', label: 'Eventos realizados', type: 'number' },
            ],
          },
          {
            id: 'tatuador',
            specializations: [
              { id: 'realista' },
              { id: 'tradicional' },
              { id: 'minimalista' },
            ],
            suggestedDisciplines: ['ilustracion', 'pintura'],
            suggestedStats: [
              { id: 'estilo_principal', label: 'Estilo principal', type: 'text' },
              { id: 'años_experiencia', label: 'Años de experiencia', type: 'number' },
              { id: 'certificaciones', label: 'Certificaciones', type: 'text' },
            ],
          },
        ],
      },
      {
        id: 'artesania',
        roles: [
          {
            id: 'artesano',
            specializations: [
              { id: 'textil' },
              { id: 'cuero' },
              { id: 'madera' },
              { id: 'joyeria' },
            ],
            suggestedDisciplines: ['diseno-producto', 'ceramica'],
            suggestedStats: [
              { id: 'material_principal', label: 'Material principal', type: 'text' },
              { id: 'técnica', label: 'Técnica', type: 'text' },
              { id: 'producción_mensual', label: 'Producción mensual', type: 'number' },
            ],
          },
        ],
      },
    ],
  },

  // ============================================================
  // CATEGORÍA 2: ARTES ESCÉNICAS
  // ============================================================
  {
    id: 'artes-escenicas',
    disciplines: [
      {
        id: 'musica',
        roles: [
          {
            id: 'musico',
            specializations: [
              { id: 'banda' },
              { id: 'solista' },
              { id: 'orquesta' },
            ],
            suggestedDisciplines: ['produccion-musical', 'diseno-sonido'],
            suggestedStats: [
              { id: 'instrumento_principal', label: 'Instrumento principal', type: 'text' },
              { id: 'género_musical', label: 'Género musical', type: 'text' },
              { id: 'experiencia_en_vivo', label: 'Experiencia en vivo (años)', type: 'number' },
              { id: 'grabaciones', label: 'Grabaciones realizadas', type: 'number' },
            ],
          },
          {
            id: 'cantante',
            specializations: [
              { id: 'jazz' },
              { id: 'pop' },
              { id: 'rock' },
              { id: 'clasico' },
              { id: 'folklore' },
            ],
            suggestedDisciplines: ['composicion', 'produccion-musical'],
            suggestedStats: [
              { id: 'rango_vocal', label: 'Rango vocal', type: 'text' },
              { id: 'género_musical', label: 'Género musical', type: 'text' },
              { id: 'años_experiencia', label: 'Años de experiencia', type: 'number' },
              { id: 'presentaciones_realizadas', label: 'Presentaciones realizadas', type: 'number' },
            ],
          },
          {
            id: 'dj',
            specializations: [
              { id: 'electronica' },
              { id: 'hip-hop' },
              { id: 'house' },
              { id: 'techno' },
            ],
            suggestedDisciplines: ['produccion-musical', 'streaming'],
            suggestedStats: [
              { id: 'género_musical', label: 'Género musical', type: 'text' },
              { id: 'equipamiento', label: 'Equipamiento', type: 'text' },
              { id: 'eventos_realizados', label: 'Eventos realizados', type: 'number' },
            ],
          },
          {
            id: 'productor-musical',
            specializations: [
              { id: 'grabacion' },
              { id: 'mezcla' },
              { id: 'masterizacion' },
            ],
            suggestedDisciplines: ['musica', 'diseno-sonido'],
            suggestedStats: [
              { id: 'software_principal', label: 'Software principal', type: 'text' },
              { id: 'género_especializado', label: 'Género especializado', type: 'text' },
              { id: 'proyectos_realizados', label: 'Proyectos realizados', type: 'number' },
            ],
          },
        ],
      },
      {
        id: 'danza',
        roles: [
          {
            id: 'bailarin',
            specializations: [
              { id: 'ballet' },
              { id: 'contemporaneo' },
              { id: 'folklorico' },
              { id: 'urbano' },
            ],
            suggestedDisciplines: ['coreografia', 'teatro-fisico'],
            suggestedStats: [
              { id: 'estilo_danza', label: 'Estilo de danza', type: 'text' },
              { id: 'años_formación', label: 'Años de formación', type: 'number' },
              { id: 'ensayos_a_semana', label: 'Ensayos por semana', type: 'number' },
            ],
          },
          {
            id: 'coreografo',
            specializations: [
              { id: 'espectaculo' },
              { id: 'comercial' },
              { id: 'contemporaneo' },
            ],
            suggestedDisciplines: ['danza', 'direccion-escenica'],
            suggestedStats: [
              { id: 'estilo', label: 'Estilo', type: 'text' },
              { id: 'obras_creadas', label: 'Obras creadas', type: 'number' },
              { id: 'años_experiencia', label: 'Años de experiencia', type: 'number' },
            ],
          },
        ],
      },
      {
        id: 'teatro',
        roles: [
          {
            id: 'actor',
            specializations: [
              { id: 'drama' },
              { id: 'comedia' },
              { id: 'musical' },
            ],
            suggestedDisciplines: ['direccion-teatral', 'produccion-escenica'],
            suggestedStats: [
              { id: 'medios_trabajados', label: 'Medios trabajados (cine, tv, teatro)', type: 'text' },
              { id: 'premios', label: 'Premios', type: 'text' },
              { id: 'tipo_rol', label: 'Tipo de rol (protagónico, secundario)', type: 'text' },
              { id: 'años_experiencia', label: 'Años de experiencia', type: 'number' },
            ],
          },
          {
            id: 'director-teatro',
            specializations: [
              { id: 'clasico' },
              { id: 'contemporaneo' },
              { id: 'experimental' },
            ],
            suggestedDisciplines: ['dramaturgia', 'produccion-escenica'],
            suggestedStats: [
              { id: 'obras_dirigidas', label: 'Obras dirigidas', type: 'number' },
              { id: 'estilo', label: 'Estilo', type: 'text' },
              { id: 'años_experiencia', label: 'Años de experiencia', type: 'number' },
            ],
          },
        ],
      },
      {
        id: 'circo',
        roles: [
          {
            id: 'artista-circense',
            specializations: [
              { id: 'payaso' },
              { id: 'malabarista' },
              { id: 'acrobata' },
              { id: 'trapecista' },
            ],
            suggestedDisciplines: ['teatro', 'danza'],
            suggestedStats: [
              { id: 'especialidad', label: 'Especialidad', type: 'text' },
              { id: 'años_experiencia', label: 'Años de experiencia', type: 'number' },
              { id: 'shows_realizados', label: 'Shows realizados', type: 'number' },
            ],
          },
        ],
      },
      {
        id: 'magia',
        roles: [
          {
            id: 'mago',
            specializations: [
              { id: 'escenario' },
              { id: 'cerca' },
              { id: 'ilusionismo' },
              { id: 'mentalismo' },
            ],
            suggestedDisciplines: ['teatro', 'presentacion'],
            suggestedStats: [
              { id: 'tipo_magia', label: 'Tipo de magia', type: 'text' },
              { id: 'eventos_realizados', label: 'Eventos realizados', type: 'number' },
              { id: 'años_experiencia', label: 'Años de experiencia', type: 'number' },
            ],
          },
        ],
      },
      {
        id: 'stand-up',
        roles: [
          {
            id: 'comediante',
            specializations: [
              { id: 'stand-up' },
              { id: 'improvisacion' },
              { id: 'monologo' },
            ],
            suggestedDisciplines: ['actuacion', 'teatro'],
            suggestedStats: [
              { id: 'estilo_comedia', label: 'Estilo de comedia', type: 'text' },
              { id: 'presentaciones', label: 'Presentaciones', type: 'number' },
              { id: 'años_experiencia', label: 'Años de experiencia', type: 'number' },
            ],
          },
        ],
      },
      {
        id: 'performance',
        roles: [
          {
            id: 'artista-performance',
            specializations: [
              { id: 'conceptual' },
              { id: 'experimental' },
              { id: 'multimedia' },
            ],
            suggestedDisciplines: ['teatro', 'artes-visuales'],
            suggestedStats: [
              { id: 'estilo', label: 'Estilo', type: 'text' },
              { id: 'obras_presentadas', label: 'Obras presentadas', type: 'number' },
              { id: 'años_experiencia', label: 'Años de experiencia', type: 'number' },
            ],
          },
        ],
      },
      {
        id: 'opera',
        roles: [
          {
            id: 'cantante-opera',
            specializations: [
              { id: 'soprano' },
              { id: 'tenor' },
              { id: 'baritono' },
              { id: 'bajo' },
            ],
            suggestedDisciplines: ['canto', 'teatro'],
            suggestedStats: [
              { id: 'registro_vocal', label: 'Registro vocal', type: 'text' },
              { id: 'repertorio', label: 'Repertorio', type: 'text' },
              { id: 'años_formación', label: 'Años de formación', type: 'number' },
            ],
          },
        ],
      },
      {
        id: 'arte-callejero',
        roles: [
          {
            id: 'artista-callejero',
            specializations: [
              { id: 'estatua-viviente' },
              { id: 'musico' },
              { id: 'performance' },
            ],
            suggestedDisciplines: ['teatro', 'musica'],
            suggestedStats: [
              { id: 'especialidad', label: 'Especialidad', type: 'text' },
              { id: 'ubicaciones', label: 'Ubicaciones frecuentes', type: 'text' },
              { id: 'años_experiencia', label: 'Años de experiencia', type: 'number' },
            ],
          },
        ],
      },
    ],
  },

  // ============================================================
  // CATEGORÍA 3: MEDIOS AUDIOVISUALES
  // ============================================================
  {
    id: 'medios-audiovisuales',
    disciplines: [
      {
        id: 'cine',
        roles: [
          {
            id: 'actor-cine',
            specializations: [
              { id: 'principal' },
              { id: 'reparto' },
              { id: 'doble' },
            ],
            suggestedDisciplines: ['direccion-cine', 'edicion-video'],
            suggestedStats: [
              { id: 'películas_participadas', label: 'Películas participadas', type: 'number' },
              { id: 'premios', label: 'Premios', type: 'text' },
              { id: 'años_experiencia', label: 'Años de experiencia', type: 'number' },
            ],
          },
          {
            id: 'director-cine',
            specializations: [
              { id: 'ficcion' },
              { id: 'documental' },
              { id: 'cortometraje' },
            ],
            suggestedDisciplines: ['guion', 'produccion'],
            suggestedStats: [
              { id: 'películas_dirigidas', label: 'Películas dirigidas', type: 'number' },
              { id: 'festivales', label: 'Festivales', type: 'text' },
              { id: 'años_experiencia', label: 'Años de experiencia', type: 'number' },
            ],
          },
        ],
      },
      {
        id: 'television',
        roles: [
          {
            id: 'presentador-tv',
            specializations: [
              { id: 'noticias' },
              { id: 'entretenimiento' },
              { id: 'deportes' },
            ],
            suggestedDisciplines: ['produccion-televisiva', 'periodismo'],
            suggestedStats: [
              { id: 'canales_trabajados', label: 'Canales trabajados', type: 'text' },
              { id: 'rating_promedio', label: 'Rating promedio', type: 'number' },
              { id: 'formatos_domina', label: 'Formatos que domina', type: 'text' },
            ],
          },
          {
            id: 'actor-tv',
            specializations: [
              { id: 'telenovela' },
              { id: 'serie' },
              { id: 'comercial' },
            ],
            suggestedDisciplines: ['cine', 'teatro'],
            suggestedStats: [
              { id: 'producciones', label: 'Producciones', type: 'number' },
              { id: 'años_experiencia', label: 'Años de experiencia', type: 'number' },
              { id: 'tipo_personaje', label: 'Tipo de personaje', type: 'text' },
            ],
          },
        ],
      },
      {
        id: 'radio',
        roles: [
          {
            id: 'locutor',
            specializations: [
              { id: 'musical' },
              { id: 'noticias' },
              { id: 'deportes' },
            ],
            suggestedDisciplines: ['podcast', 'produccion-radio'],
            suggestedStats: [
              { id: 'emisoras_trabajadas', label: 'Emisoras trabajadas', type: 'text' },
              { id: 'años_experiencia', label: 'Años de experiencia', type: 'number' },
              { id: 'horarios', label: 'Horarios', type: 'text' },
            ],
          },
        ],
      },
      {
        id: 'streaming',
        roles: [
          {
            id: 'streamer',
            specializations: [
              { id: 'gaming' },
              { id: 'musica' },
              { id: 'contenido' },
            ],
            suggestedDisciplines: ['produccion-video', 'marketing-digital'],
            suggestedStats: [
              { id: 'plataforma', label: 'Plataforma', type: 'text' },
              { id: 'seguidores', label: 'Seguidores', type: 'number' },
              { id: 'horas_streaming', label: 'Horas de streaming', type: 'number' },
              { id: 'engagement', label: 'Engagement (%)', type: 'number' },
            ],
          },
        ],
      },
      {
        id: 'podcast',
        roles: [
          {
            id: 'podcaster',
            specializations: [
              { id: 'entrevistas' },
              { id: 'narrativa' },
              { id: 'educativo' },
            ],
            suggestedDisciplines: ['produccion-audio', 'radio'],
            suggestedStats: [
              { id: 'episodios', label: 'Episodios', type: 'number' },
              { id: 'descargas', label: 'Descargas', type: 'number' },
              { id: 'plataformas', label: 'Plataformas', type: 'text' },
            ],
          },
        ],
      },
      {
        id: 'animacion',
        roles: [
          {
            id: 'animador',
            specializations: [
              { id: '2d' },
              { id: '3d' },
              { id: 'motion-capture' },
            ],
            suggestedDisciplines: ['ilustracion', 'modelado-3d'],
            suggestedStats: [
              { id: 'software_principal', label: 'Software principal', type: 'text' },
              { id: 'proyectos', label: 'Proyectos', type: 'number' },
              { id: 'años_experiencia', label: 'Años de experiencia', type: 'number' },
            ],
          },
        ],
      },
      {
        id: 'doblaje',
        roles: [
          {
            id: 'actor-doblaje',
            specializations: [
              { id: 'cine' },
              { id: 'videojuegos' },
              { id: 'comerciales' },
            ],
            suggestedDisciplines: ['locucion', 'actuacion'],
            suggestedStats: [
              { id: 'registro_vocal', label: 'Registro vocal', type: 'text' },
              { id: 'idiomas', label: 'Idiomas', type: 'text' },
              { id: 'proyectos', label: 'Proyectos', type: 'number' },
            ],
          },
        ],
      },
      {
        id: 'locucion',
        roles: [
          {
            id: 'locutor-comercial',
            specializations: [
              { id: 'comercial' },
              { id: 'institucional' },
              { id: 'voz-off' },
            ],
            suggestedDisciplines: ['doblaje', 'radio'],
            suggestedStats: [
              { id: 'tipo_voz', label: 'Tipo de voz', type: 'text' },
              { id: 'idiomas', label: 'Idiomas', type: 'text' },
              { id: 'clientes', label: 'Clientes', type: 'text' },
            ],
          },
        ],
      },
      {
        id: 'videoarte',
        roles: [
          {
            id: 'videoartista',
            specializations: [
              { id: 'experimental' },
              { id: 'instalacion' },
              { id: 'conceptual' },
            ],
            suggestedDisciplines: ['edicion-video', 'artes-visuales'],
            suggestedStats: [
              { id: 'obras_creadas', label: 'Obras creadas', type: 'number' },
              { id: 'exposiciones', label: 'Exposiciones', type: 'text' },
              { id: 'técnicas', label: 'Técnicas', type: 'text' },
            ],
          },
        ],
      },
    ],
  },

  // ============================================================
  // CATEGORÍA 4: MODA Y DISEÑO
  // ============================================================
  {
    id: 'moda-diseno',
    disciplines: [
      {
        id: 'moda',
        roles: [
          {
            id: 'modelo',
            specializations: [
              { id: 'pasarela' },
              { id: 'comercial' },
              { id: 'editorial' },
              { id: 'fitness' },
            ],
            suggestedDisciplines: ['fotografia', 'diseno-textil'],
            suggestedStats: [
              { id: 'altura', label: 'Altura (cm)', type: 'number' },
              { id: 'medidas', label: 'Medidas', type: 'text' },
              { id: 'estilo', label: 'Estilo', type: 'text' },
              { id: 'años_experiencia', label: 'Años de experiencia', type: 'number' },
            ],
          },
          {
            id: 'disenador-moda',
            specializations: [
              { id: 'alta-costura' },
              { id: 'pret-a-porter' },
              { id: 'streetwear' },
              { id: 'sostenible' },
            ],
            suggestedDisciplines: ['diseno-textil', 'patronaje'],
            suggestedStats: [
              { id: 'colecciones_presentadas', label: 'Colecciones presentadas', type: 'number' },
              { id: 'pasarelas_participadas', label: 'Pasarelas participadas', type: 'number' },
              { id: 'años_experiencia', label: 'Años de experiencia', type: 'number' },
            ],
          },
          {
            id: 'estilista',
            specializations: [
              { id: 'personal' },
              { id: 'editorial' },
              { id: 'celebridades' },
            ],
            suggestedDisciplines: ['moda', 'fotografia'],
            suggestedStats: [
              { id: 'clientes', label: 'Clientes', type: 'text' },
              { id: 'eventos', label: 'Eventos', type: 'text' },
              { id: 'años_experiencia', label: 'Años de experiencia', type: 'number' },
            ],
          },
          {
            id: 'maquillador',
            specializations: [
              { id: 'moda' },
              { id: 'novias' },
              { id: 'caracterizacion' },
            ],
            suggestedDisciplines: ['peluqueria', 'moda'],
            suggestedStats: [
              { id: 'especialidad', label: 'Especialidad', type: 'text' },
              { id: 'productos', label: 'Productos', type: 'text' },
              { id: 'eventos', label: 'Eventos', type: 'number' },
            ],
          },
          {
            id: 'peluquero',
            specializations: [
              { id: 'corte' },
              { id: 'color' },
              { id: 'peinado' },
            ],
            suggestedDisciplines: ['maquillaje', 'moda'],
            suggestedStats: [
              { id: 'técnicas', label: 'Técnicas', type: 'text' },
              { id: 'certificaciones', label: 'Certificaciones', type: 'text' },
              { id: 'años_experiencia', label: 'Años de experiencia', type: 'number' },
            ],
          },
        ],
      },
      {
        id: 'diseno-interiores',
        roles: [
          {
            id: 'disenador-interiores',
            specializations: [
              { id: 'residencial' },
              { id: 'comercial' },
              { id: 'corporativo' },
            ],
            suggestedDisciplines: ['arquitectura', 'diseno-producto'],
            suggestedStats: [
              { id: 'metros_proyectados', label: 'Metros proyectados', type: 'number' },
              { id: 'estilo_principal', label: 'Estilo principal', type: 'text' },
              { id: 'presupuesto_promedio', label: 'Presupuesto promedio', type: 'number' },
            ],
          },
          {
            id: 'decorador',
            specializations: [
              { id: 'eventos' },
              { id: 'escaparates' },
              { id: 'hogar' },
            ],
            suggestedDisciplines: ['diseno-interiores', 'eventos'],
            suggestedStats: [
              { id: 'estilo', label: 'Estilo', type: 'text' },
              { id: 'proyectos', label: 'Proyectos', type: 'number' },
              { id: 'años_experiencia', label: 'Años de experiencia', type: 'number' },
            ],
          },
        ],
      },
      {
        id: 'arquitectura',
        roles: [
          {
            id: 'arquitecto',
            specializations: [
              { id: 'residencial' },
              { id: 'comercial' },
              { id: 'paisajismo' },
            ],
            suggestedDisciplines: ['diseno-interiores', 'urbanismo'],
            suggestedStats: [
              { id: 'proyectos_construidos', label: 'Proyectos construidos', type: 'number' },
              { id: 'software', label: 'Software', type: 'text' },
              { id: 'años_experiencia', label: 'Años de experiencia', type: 'number' },
            ],
          },
        ],
      },
      {
        id: 'diseno-producto',
        roles: [
          {
            id: 'disenador-producto',
            specializations: [
              { id: 'industrial' },
              { id: 'digital' },
              { id: 'mobiliario' },
            ],
            suggestedDisciplines: ['modelado-3d', 'prototipado'],
            suggestedStats: [
              { id: 'software', label: 'Software', type: 'text' },
              { id: 'productos_lanzados', label: 'Productos lanzados', type: 'number' },
              { id: 'años_experiencia', label: 'Años de experiencia', type: 'number' },
            ],
          },
        ],
      },
      {
        id: 'diseno-textil',
        roles: [
          {
            id: 'disenador-textil',
            specializations: [
              { id: 'estampado' },
              { id: 'tejido' },
              { id: 'bordado' },
            ],
            suggestedDisciplines: ['moda', 'artesania'],
            suggestedStats: [
              { id: 'técnicas', label: 'Técnicas', type: 'text' },
              { id: 'colecciones', label: 'Colecciones', type: 'number' },
              { id: 'años_experiencia', label: 'Años de experiencia', type: 'number' },
            ],
          },
        ],
      },
      {
        id: 'diseno-joyas',
        roles: [
          {
            id: 'joyero',
            specializations: [
              { id: 'oro' },
              { id: 'plata' },
              { id: 'bisuteria' },
            ],
            suggestedDisciplines: ['orfebreria', 'diseno-producto'],
            suggestedStats: [
              { id: 'material_principal', label: 'Material principal', type: 'text' },
              { id: 'piezas_creadas', label: 'Piezas creadas', type: 'number' },
              { id: 'años_experiencia', label: 'Años de experiencia', type: 'number' },
            ],
          },
        ],
      },
    ],
  },

  // ============================================================
  // CATEGORÍA 5: CULTURA Y TURISMO
  // ============================================================
  {
    id: 'cultura-turismo',
    disciplines: [
      {
        id: 'turismo-cultural',
        roles: [
          {
            id: 'guia-turistico',
            specializations: [
              { id: 'museos' },
              { id: 'patrimonial' },
              { id: 'arte' },
            ],
            suggestedDisciplines: ['narracion', 'curaduria'],
            suggestedStats: [
              { id: 'idiomas', label: 'Idiomas', type: 'text' },
              { id: 'rutas_realizadas', label: 'Rutas realizadas', type: 'number' },
              { id: 'años_experiencia', label: 'Años de experiencia', type: 'number' },
            ],
          },
        ],
      },
      {
        id: 'narrativa-educacion',
        roles: [
          {
            id: 'narrador',
            specializations: [
              { id: 'oral' },
              { id: 'cuentacuentos' },
              { id: 'historico' },
            ],
            suggestedDisciplines: ['tallerista', 'mentor-artistico'],
            suggestedStats: [
              { id: 'audiencias_atendidas', label: 'Audiencias atendidas', type: 'number' },
              { id: 'estilos_narrativa', label: 'Estilos de narrativa', type: 'text' },
              { id: 'años_actividad', label: 'Años de actividad', type: 'number' },
            ],
          },
        ],
      },
      {
        id: 'gestion-cultural',
        roles: [
          {
            id: 'gestor-cultural',
            specializations: [
              { id: 'curaduria' },
              { id: 'produccion' },
              { id: 'coordinacion' },
            ],
            suggestedDisciplines: ['eventos', 'produccion-ejecutiva'],
            suggestedStats: [
              { id: 'proyectos_gestionados', label: 'Proyectos gestionados', type: 'number' },
              { id: 'instituciones', label: 'Instituciones', type: 'text' },
              { id: 'años_experiencia', label: 'Años de experiencia', type: 'number' },
            ],
          },
        ],
      },
      {
        id: 'patrimonio',
        roles: [
          {
            id: 'conservador',
            specializations: [
              { id: 'arte' },
              { id: 'documentos' },
              { id: 'objetos' },
            ],
            suggestedDisciplines: ['restauracion', 'museologia'],
            suggestedStats: [
              { id: 'especialidad', label: 'Especialidad', type: 'text' },
              { id: 'certificaciones', label: 'Certificaciones', type: 'text' },
              { id: 'años_experiencia', label: 'Años de experiencia', type: 'number' },
            ],
          },
          {
            id: 'restaurador',
            specializations: [
              { id: 'pintura' },
              { id: 'escultura' },
              { id: 'mobiliario' },
            ],
            suggestedDisciplines: ['conservacion', 'quimica'],
            suggestedStats: [
              { id: 'técnicas', label: 'Técnicas', type: 'text' },
              { id: 'obras_restauradas', label: 'Obras restauradas', type: 'number' },
              { id: 'años_experiencia', label: 'Años de experiencia', type: 'number' },
            ],
          },
        ],
      },
    ],
  },

  // ============================================================
  // CATEGORÍA 6: ARTE DIGITAL Y TECNOLOGÍA
  // ============================================================
  {
    id: 'arte-digital-tecnologia',
    disciplines: [
      {
        id: 'diseno-digital',
        roles: [
          {
            id: 'disenador-ux-ui',
            specializations: [
              { id: 'web' },
              { id: 'mobile' },
              { id: 'producto-digital' },
            ],
            suggestedDisciplines: ['desarrollo-frontend', 'investigacion-usuarios'],
            suggestedStats: [
              { id: 'software_principal', label: 'Software principal', type: 'text' },
              { id: 'proyectos_realizados', label: 'Proyectos realizados', type: 'number' },
              { id: 'años_experiencia', label: 'Años de experiencia', type: 'number' },
            ],
          },
          {
            id: 'disenador-web',
            specializations: [
              { id: 'landing-pages' },
              { id: 'e-commerce' },
              { id: 'corporativo' },
            ],
            suggestedDisciplines: ['desarrollo-web', 'marketing-digital'],
            suggestedStats: [
              { id: 'framework', label: 'Framework preferido', type: 'text' },
              { id: 'proyectos', label: 'Proyectos', type: 'number' },
              { id: 'conversiones', label: 'Tasa de conversión (%)', type: 'number' },
            ],
          },
        ],
      },
      {
        id: 'desarrollo-creativo',
        roles: [
          {
            id: 'desarrollador-creativo',
            specializations: [
              { id: 'frontend' },
              { id: 'experiencias-interactivas' },
              { id: 'creative-coding' },
            ],
            suggestedDisciplines: ['diseno-web', 'arte-generativo'],
            suggestedStats: [
              { id: 'lenguajes', label: 'Lenguajes', type: 'text' },
              { id: 'frameworks', label: 'Frameworks', type: 'text' },
              { id: 'proyectos', label: 'Proyectos', type: 'number' },
            ],
          },
        ],
      },
      {
        id: 'contenido-digital',
        roles: [
          {
            id: 'creador-contenido',
            specializations: [
              { id: 'ugc' },
              { id: 'influencer' },
              { id: 'content-creator' },
            ],
            suggestedDisciplines: ['produccion-video', 'fotografia'],
            suggestedStats: [
              { id: 'followers', label: 'Seguidores', type: 'number' },
              { id: 'engagement', label: 'Engagement (%)', type: 'number' },
              { id: 'plataformas_domina', label: 'Plataformas que domina', type: 'text' },
            ],
          },
          {
            id: 'community-manager',
            specializations: [
              { id: 'marca' },
              { id: 'artista' },
              { id: 'emprendimiento' },
            ],
            suggestedDisciplines: ['marketing-digital', 'diseno-grafico'],
            suggestedStats: [
              { id: 'plataformas', label: 'Plataformas', type: 'text' },
              { id: 'cuentas_gestionadas', label: 'Cuentas gestionadas', type: 'number' },
              { id: 'crecimiento', label: 'Crecimiento (%)', type: 'number' },
            ],
          },
        ],
      },
      {
        id: 'arte-generativo',
        roles: [
          {
            id: 'artista-digital',
            specializations: [
              { id: 'nft' },
              { id: 'vr' },
              { id: 'ar' },
              { id: 'ia' },
            ],
            suggestedDisciplines: ['programacion', 'artes-visuales'],
            suggestedStats: [
              { id: 'plataformas', label: 'Plataformas', type: 'text' },
              { id: 'obras_vendidas', label: 'Obras vendidas', type: 'number' },
              { id: 'tecnologías', label: 'Tecnologías', type: 'text' },
            ],
          },
        ],
      },
      {
        id: 'produccion-digital',
        roles: [
          {
            id: 'editor-video',
            specializations: [
              { id: 'comercial' },
              { id: 'narrativo' },
              { id: 'musical' },
            ],
            suggestedDisciplines: ['motion-design', 'colorista'],
            suggestedStats: [
              { id: 'software_principal', label: 'Software principal', type: 'text' },
              { id: 'proyectos', label: 'Proyectos', type: 'number' },
              { id: 'años_experiencia', label: 'Años de experiencia', type: 'number' },
            ],
          },
          {
            id: 'motion-designer',
            specializations: [
              { id: '2d' },
              { id: '3d' },
              { id: 'mixto' },
            ],
            suggestedDisciplines: ['animacion', 'diseno-grafico'],
            suggestedStats: [
              { id: 'software', label: 'Software', type: 'text' },
              { id: 'proyectos', label: 'Proyectos', type: 'number' },
              { id: 'clientes', label: 'Clientes', type: 'text' },
            ],
          },
          {
            id: 'disenador-3d',
            specializations: [
              { id: 'modelado' },
              { id: 'texturizado' },
              { id: 'renderizado' },
            ],
            suggestedDisciplines: ['animacion', 'arquitectura'],
            suggestedStats: [
              { id: 'software', label: 'Software', type: 'text' },
              { id: 'industria', label: 'Industria', type: 'text' },
              { id: 'años_experiencia', label: 'Años de experiencia', type: 'number' },
            ],
          },
        ],
      },
    ],
  },

  // ============================================================
  // CATEGORÍA 7: OTROS SERVICIOS CREATIVOS
  // ============================================================
  {
    id: 'servicios-creativos',
    disciplines: [
      {
        id: 'representacion-gestion',
        roles: [
          {
            id: 'agente-talento',
            specializations: [
              { id: 'artistico' },
              { id: 'deportivo' },
              { id: 'corporativo' },
            ],
            suggestedDisciplines: ['produccion-eventos', 'marketing-cultural'],
            suggestedStats: [
              { id: 'artistas_representados', label: 'Artistas representados', type: 'number' },
              { id: 'eventos_gestionados', label: 'Eventos gestionados', type: 'number' },
              { id: 'años_experiencia', label: 'Años de experiencia', type: 'number' },
            ],
          },
          {
            id: 'manager-artistico',
            specializations: [
              { id: 'musica' },
              { id: 'artes-escenicas' },
              { id: 'audiovisual' },
            ],
            suggestedDisciplines: ['produccion', 'marketing'],
            suggestedStats: [
              { id: 'artistas', label: 'Artistas', type: 'number' },
              { id: 'contratos', label: 'Contratos gestionados', type: 'number' },
              { id: 'años_experiencia', label: 'Años de experiencia', type: 'number' },
            ],
          },
        ],
      },
      {
        id: 'promocion-marketing',
        roles: [
          {
            id: 'promotor-cultural',
            specializations: [
              { id: 'eventos' },
              { id: 'festivales' },
              { id: 'institucional' },
            ],
            suggestedDisciplines: ['produccion-ejecutiva', 'seguridad-evento'],
            suggestedStats: [
              { id: 'eventos_organizados', label: 'Eventos organizados', type: 'number' },
              { id: 'asistentes', label: 'Asistentes', type: 'number' },
              { id: 'redes_de_contacto', label: 'Redes de contacto', type: 'text' },
            ],
          },
        ],
      },
      {
        id: 'educacion-mentoria',
        roles: [
          {
            id: 'mentor-artistico',
            specializations: [
              { id: 'coaching' },
              { id: 'talleres' },
              { id: 'masterclasses' },
            ],
            suggestedDisciplines: ['docencia', 'produccion'],
            suggestedStats: [
              { id: 'alumnos', label: 'Alumnos', type: 'number' },
              { id: 'instituciones', label: 'Instituciones', type: 'text' },
              { id: 'años_experiencia', label: 'Años de experiencia', type: 'number' },
            ],
          },
          {
            id: 'conferencista',
            specializations: [
              { id: 'arte' },
              { id: 'cultura' },
              { id: 'creatividad' },
            ],
            suggestedDisciplines: ['educacion', 'comunicacion'],
            suggestedStats: [
              { id: 'conferencias', label: 'Conferencias', type: 'number' },
              { id: 'temas', label: 'Temas', type: 'text' },
              { id: 'audiencia_promedio', label: 'Audiencia promedio', type: 'number' },
            ],
          },
        ],
      },
      {
        id: 'servicios-evento',
        roles: [
          {
            id: 'productor-eventos',
            specializations: [
              { id: 'corporativo' },
              { id: 'social' },
              { id: 'cultural' },
            ],
            suggestedDisciplines: ['logistica', 'catering'],
            suggestedStats: [
              { id: 'eventos_producidos', label: 'Eventos producidos', type: 'number' },
              { id: 'capacidad', label: 'Capacidad máxima', type: 'number' },
              { id: 'años_experiencia', label: 'Años de experiencia', type: 'number' },
            ],
          },
        ],
      },
      {
        id: 'consultoria-creativa',
        roles: [
          {
            id: 'consultor-cultural',
            specializations: [
              { id: 'estrategia' },
              { id: 'innovacion' },
              { id: 'branding' },
            ],
            suggestedDisciplines: ['marketing', 'produccion-ejecutiva'],
            suggestedStats: [
              { id: 'proyectos', label: 'Proyectos', type: 'number' },
              { id: 'sectores', label: 'Sectores', type: 'text' },
              { id: 'años_experiencia', label: 'Años de experiencia', type: 'number' },
            ],
          },
          {
            id: 'director-creativo',
            specializations: [
              { id: 'publicidad' },
              { id: 'branding' },
              { id: 'contenido' },
            ],
            suggestedDisciplines: ['diseno-grafico', 'produccion'],
            suggestedStats: [
              { id: 'campañas', label: 'Campañas', type: 'number' },
              { id: 'premios', label: 'Premios', type: 'text' },
              { id: 'años_experiencia', label: 'Años de experiencia', type: 'number' },
            ],
          },
        ],
      },
    ],
  },
];

// ============================================================
// DICCIONARIO DE TEXTOS (ESPAÑOL)
// ============================================================

export interface CategoryStrings {
  name: string;
  disciplines: {
    [disciplineId: string]: {
      name: string;
      roles: {
        [roleId: string]: {
          name: string;
          specializations: {
            [specId: string]: string;
          };
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
        roles: {
          pintor: {
            name: 'Pintor',
            specializations: {
              oleo: 'Óleo',
              acuarela: 'Acuarela',
              retrato: 'Retrato',
              mural: 'Mural',
              abstracto: 'Abstracto',
            },
          },
        },
      },
      escultura: {
        name: 'Escultura',
        roles: {
          escultor: {
            name: 'Escultor',
            specializations: {
              piedra: 'Piedra',
              madera: 'Madera',
              metal: 'Metal',
              ceramica: 'Cerámica',
            },
          },
        },
      },
      ilustracion: {
        name: 'Ilustración',
        roles: {
          ilustrador: {
            name: 'Ilustrador',
            specializations: {
              editorial: 'Editorial',
              infantil: 'Infantil',
              digital: 'Digital',
              cientifica: 'Científica',
            },
          },
        },
      },
      graffiti: {
        name: 'Graffiti y Arte Urbano',
        roles: {
          graffitero: {
            name: 'Artista Urbano',
            specializations: {
              'graffiti-mural': 'Graffiti mural',
              stencil: 'Stencil',
              comercial: 'Comercial',
            },
          },
        },
      },
      caricatura: {
        name: 'Caricatura',
        roles: {
          caricaturista: {
            name: 'Caricaturista',
            specializations: {
              eventos: 'Eventos',
              digital: 'Digital',
              politico: 'Político',
            },
          },
        },
      },
      fotografia: {
        name: 'Fotografía',
        roles: {
          fotografo: {
            name: 'Fotógrafo',
            specializations: {
              bodas: 'Bodas',
              eventos: 'Eventos',
              retrato: 'Retratos',
              comercial: 'Comercial',
              moda: 'Moda',
              producto: 'Producto',
            },
          },
        },
      },
      'diseno-grafico': {
        name: 'Diseño Gráfico',
        roles: {
          'disenador-grafico': {
            name: 'Diseñador Gráfico',
            specializations: {
              branding: 'Branding',
              editorial: 'Editorial',
              packaging: 'Packaging',
              publicidad: 'Publicidad',
            },
          },
        },
      },
      grabado: {
        name: 'Grabado',
        roles: {
          grabador: {
            name: 'Grabador',
            specializations: {
              serigrafia: 'Serigrafía',
              linoleografia: 'Linoleografía',
              litografia: 'Litografía',
            },
          },
        },
      },
      ceramica: {
        name: 'Cerámica',
        roles: {
          ceramista: {
            name: 'Ceramista',
            specializations: {
              utilitaria: 'Utilitaria',
              escultorica: 'Escultórica',
              decorativa: 'Decorativa',
            },
          },
        },
      },
      'arte-corporal': {
        name: 'Arte Corporal',
        roles: {
          'maquillador-artistico': {
            name: 'Maquillador Artístico',
            specializations: {
              'efectos-especiales': 'Efectos especiales',
              'body-paint': 'Body paint',
              caracterizacion: 'Caracterización',
            },
          },
          tatuador: {
            name: 'Tatuador',
            specializations: {
              realista: 'Realista',
              tradicional: 'Tradicional',
              minimalista: 'Minimalista',
            },
          },
        },
      },
      artesania: {
        name: 'Artesanía',
        roles: {
          artesano: {
            name: 'Artesano',
            specializations: {
              textil: 'Textil',
              cuero: 'Cuero',
              madera: 'Madera',
              joyeria: 'Joyería',
            },
          },
        },
      },
    },
  },
  'artes-escenicas': {
    name: 'Artes Escénicas',
    disciplines: {
      musica: {
        name: 'Música',
        roles: {
          musico: {
            name: 'Músico',
            specializations: {
              banda: 'Músico de banda',
              solista: 'Solista',
              orquesta: 'Músico de orquesta',
            },
          },
          cantante: {
            name: 'Cantante',
            specializations: {
              jazz: 'Jazz',
              pop: 'Pop',
              rock: 'Rock',
              clasico: 'Clásico',
              folklore: 'Folklore',
            },
          },
          dj: {
            name: 'DJ',
            specializations: {
              electronica: 'Electrónica',
              'hip-hop': 'Hip-hop',
              house: 'House',
              techno: 'Techno',
            },
          },
          'productor-musical': {
            name: 'Productor Musical',
            specializations: {
              grabacion: 'Grabación',
              mezcla: 'Mezcla',
              masterizacion: 'Masterización',
            },
          },
        },
      },
      danza: {
        name: 'Danza',
        roles: {
          bailarin: {
            name: 'Bailarín',
            specializations: {
              ballet: 'Ballet',
              contemporaneo: 'Contemporáneo',
              folklorico: 'Folclórico',
              urbano: 'Urbano',
            },
          },
          coreografo: {
            name: 'Coreógrafo',
            specializations: {
              espectaculo: 'Espectáculo',
              comercial: 'Comercial',
              contemporaneo: 'Contemporáneo',
            },
          },
        },
      },
      teatro: {
        name: 'Teatro',
        roles: {
          actor: {
            name: 'Actor',
            specializations: {
              drama: 'Drama',
              comedia: 'Comedia',
              musical: 'Musical',
            },
          },
          'director-teatro': {
            name: 'Director de Teatro',
            specializations: {
              clasico: 'Clásico',
              contemporaneo: 'Contemporáneo',
              experimental: 'Experimental',
            },
          },
        },
      },
      circo: {
        name: 'Circo',
        roles: {
          'artista-circense': {
            name: 'Artista Circense',
            specializations: {
              payaso: 'Payaso',
              malabarista: 'Malabarista',
              acrobata: 'Acróbata',
              trapecista: 'Trapecista',
            },
          },
        },
      },
      magia: {
        name: 'Magia',
        roles: {
          mago: {
            name: 'Mago',
            specializations: {
              escenario: 'Escenario',
              cerca: 'Cerca',
              ilusionismo: 'Ilusionismo',
              mentalismo: 'Mentalismo',
            },
          },
        },
      },
      'stand-up': {
        name: 'Stand-up',
        roles: {
          comediante: {
            name: 'Comediante',
            specializations: {
              'stand-up': 'Stand-up',
              improvisacion: 'Improvisación',
              monologo: 'Monólogo',
            },
          },
        },
      },
      performance: {
        name: 'Performance',
        roles: {
          'artista-performance': {
            name: 'Artista de Performance',
            specializations: {
              conceptual: 'Conceptual',
              experimental: 'Experimental',
              multimedia: 'Multimedia',
            },
          },
        },
      },
      opera: {
        name: 'Ópera',
        roles: {
          'cantante-opera': {
            name: 'Cantante de Ópera',
            specializations: {
              soprano: 'Soprano',
              tenor: 'Tenor',
              baritono: 'Barítono',
              bajo: 'Bajo',
            },
          },
        },
      },
      'arte-callejero': {
        name: 'Arte Callejero',
        roles: {
          'artista-callejero': {
            name: 'Artista Callejero',
            specializations: {
              'estatua-viviente': 'Estatua viviente',
              musico: 'Músico',
              performance: 'Performance',
            },
          },
        },
      },
    },
  },
  'medios-audiovisuales': {
    name: 'Medios Audiovisuales',
    disciplines: {
      cine: {
        name: 'Cine',
        roles: {
          'actor-cine': {
            name: 'Actor de Cine',
            specializations: {
              principal: 'Actor principal',
              reparto: 'Actor de reparto',
              doble: 'Doble de acción',
            },
          },
          'director-cine': {
            name: 'Director de Cine',
            specializations: {
              ficcion: 'Ficción',
              documental: 'Documental',
              cortometraje: 'Cortometraje',
            },
          },
        },
      },
      television: {
        name: 'Televisión',
        roles: {
          'presentador-tv': {
            name: 'Presentador de Televisión',
            specializations: {
              noticias: 'Noticias',
              entretenimiento: 'Entretenimiento',
              deportes: 'Deportes',
            },
          },
          'actor-tv': {
            name: 'Actor de Televisión',
            specializations: {
              telenovela: 'Telenovela',
              serie: 'Serie',
              comercial: 'Comercial',
            },
          },
        },
      },
      radio: {
        name: 'Radio',
        roles: {
          locutor: {
            name: 'Locutor',
            specializations: {
              musical: 'Musical',
              noticias: 'Noticias',
              deportes: 'Deportes',
            },
          },
        },
      },
      streaming: {
        name: 'Streaming',
        roles: {
          streamer: {
            name: 'Streamer',
            specializations: {
              gaming: 'Gaming',
              musica: 'Música',
              contenido: 'Contenido general',
            },
          },
        },
      },
      podcast: {
        name: 'Podcast',
        roles: {
          podcaster: {
            name: 'Podcaster',
            specializations: {
              entrevistas: 'Entrevistas',
              narrativa: 'Narrativa',
              educativo: 'Educativo',
            },
          },
        },
      },
      animacion: {
        name: 'Animación',
        roles: {
          animador: {
            name: 'Animador',
            specializations: {
              '2d': 'Animación 2D',
              '3d': 'Animación 3D',
              'motion-capture': 'Motion capture',
            },
          },
        },
      },
      doblaje: {
        name: 'Doblaje',
        roles: {
          'actor-doblaje': {
            name: 'Actor de Doblaje',
            specializations: {
              cine: 'Cine',
              videojuegos: 'Videojuegos',
              comerciales: 'Comerciales',
            },
          },
        },
      },
      locucion: {
        name: 'Locución',
        roles: {
          'locutor-comercial': {
            name: 'Locutor',
            specializations: {
              comercial: 'Comercial',
              institucional: 'Institucional',
              'voz-off': 'Voz en off',
            },
          },
        },
      },
      videoarte: {
        name: 'Videoarte',
        roles: {
          videoartista: {
            name: 'Videoartista',
            specializations: {
              experimental: 'Experimental',
              instalacion: 'Instalación',
              conceptual: 'Conceptual',
            },
          },
        },
      },
    },
  },
  'moda-diseno': {
    name: 'Moda y Diseño',
    disciplines: {
      moda: {
        name: 'Moda',
        roles: {
          modelo: {
            name: 'Modelo',
            specializations: {
              pasarela: 'Pasarela',
              comercial: 'Comercial',
              editorial: 'Editorial',
              fitness: 'Fitness',
            },
          },
          'disenador-moda': {
            name: 'Diseñador de Moda',
            specializations: {
              'alta-costura': 'Alta costura',
              'pret-a-porter': 'Prêt-à-porter',
              streetwear: 'Streetwear',
              sostenible: 'Sostenible',
            },
          },
          estilista: {
            name: 'Estilista',
            specializations: {
              personal: 'Personal',
              editorial: 'Editorial',
              celebridades: 'Celebridades',
            },
          },
          maquillador: {
            name: 'Maquillador',
            specializations: {
              moda: 'Moda',
              novias: 'Novias',
              caracterizacion: 'Caracterización',
            },
          },
          peluquero: {
            name: 'Peluquero',
            specializations: {
              corte: 'Corte',
              color: 'Color',
              peinado: 'Peinado',
            },
          },
        },
      },
      'diseno-interiores': {
        name: 'Diseño de Interiores',
        roles: {
          'disenador-interiores': {
            name: 'Diseñador de Interiores',
            specializations: {
              residencial: 'Residencial',
              comercial: 'Comercial',
              corporativo: 'Corporativo',
            },
          },
          decorador: {
            name: 'Decorador',
            specializations: {
              eventos: 'Eventos',
              escaparates: 'Escaparates',
              hogar: 'Hogar',
            },
          },
        },
      },
      arquitectura: {
        name: 'Arquitectura',
        roles: {
          arquitecto: {
            name: 'Arquitecto',
            specializations: {
              residencial: 'Residencial',
              comercial: 'Comercial',
              paisajismo: 'Paisajismo',
            },
          },
        },
      },
      'diseno-producto': {
        name: 'Diseño de Producto',
        roles: {
          'disenador-producto': {
            name: 'Diseñador de Producto',
            specializations: {
              industrial: 'Industrial',
              digital: 'Digital',
              mobiliario: 'Mobiliario',
            },
          },
        },
      },
      'diseno-textil': {
        name: 'Diseño Textil',
        roles: {
          'disenador-textil': {
            name: 'Diseñador Textil',
            specializations: {
              estampado: 'Estampado',
              tejido: 'Tejido',
              bordado: 'Bordado',
            },
          },
        },
      },
      'diseno-joyas': {
        name: 'Diseño de Joyas',
        roles: {
          joyero: {
            name: 'Joyero',
            specializations: {
              oro: 'Oro',
              plata: 'Plata',
              bisuteria: 'Bisutería',
            },
          },
        },
      },
    },
  },
  'cultura-turismo': {
    name: 'Cultura y Turismo',
    disciplines: {
      'turismo-cultural': {
        name: 'Turismo Cultural',
        roles: {
          'guia-turistico': {
            name: 'Guía Turístico',
            specializations: {
              museos: 'Museos',
              patrimonial: 'Patrimonial',
              arte: 'Arte',
            },
          },
        },
      },
      'narrativa-educacion': {
        name: 'Narrativa y Educación',
        roles: {
          narrador: {
            name: 'Narrador',
            specializations: {
              oral: 'Oral',
              cuentacuentos: 'Cuentacuentos',
              historico: 'Histórico',
            },
          },
        },
      },
      'gestion-cultural': {
        name: 'Gestión Cultural',
        roles: {
          'gestor-cultural': {
            name: 'Gestor Cultural',
            specializations: {
              curaduria: 'Curaduría',
              produccion: 'Producción',
              coordinacion: 'Coordinación',
            },
          },
        },
      },
      patrimonio: {
        name: 'Patrimonio',
        roles: {
          conservador: {
            name: 'Conservador',
            specializations: {
              arte: 'Arte',
              documentos: 'Documentos',
              objetos: 'Objetos',
            },
          },
          restaurador: {
            name: 'Restaurador',
            specializations: {
              pintura: 'Pintura',
              escultura: 'Escultura',
              mobiliario: 'Mobiliario',
            },
          },
        },
      },
    },
  },
  'arte-digital-tecnologia': {
    name: 'Arte Digital y Tecnología',
    disciplines: {
      'diseno-digital': {
        name: 'Diseño Digital',
        roles: {
          'disenador-ux-ui': {
            name: 'Diseñador UX/UI',
            specializations: {
              web: 'Web',
              mobile: 'Mobile',
              'producto-digital': 'Producto digital',
            },
          },
          'disenador-web': {
            name: 'Diseñador Web',
            specializations: {
              'landing-pages': 'Landing pages',
              'e-commerce': 'E-commerce',
              corporativo: 'Corporativo',
            },
          },
        },
      },
      'desarrollo-creativo': {
        name: 'Desarrollo Creativo',
        roles: {
          'desarrollador-creativo': {
            name: 'Desarrollador Creativo',
            specializations: {
              frontend: 'Frontend creativo',
              'experiencias-interactivas': 'Experiencias interactivas',
              'creative-coding': 'Creative coding',
            },
          },
        },
      },
      'contenido-digital': {
        name: 'Contenido Digital',
        roles: {
          'creador-contenido': {
            name: 'Creador de Contenido',
            specializations: {
              ugc: 'UGC',
              influencer: 'Influencer',
              'content-creator': 'Content creator',
            },
          },
          'community-manager': {
            name: 'Community Manager',
            specializations: {
              marca: 'Marca',
              artista: 'Artista',
              emprendimiento: 'Emprendimiento',
            },
          },
        },
      },
      'arte-generativo': {
        name: 'Arte Generativo',
        roles: {
          'artista-digital': {
            name: 'Artista Digital',
            specializations: {
              nft: 'NFT',
              vr: 'Realidad virtual',
              ar: 'Realidad aumentada',
              ia: 'IA generativa',
            },
          },
        },
      },
      'produccion-digital': {
        name: 'Producción Digital',
        roles: {
          'editor-video': {
            name: 'Editor de Video',
            specializations: {
              comercial: 'Comercial',
              narrativo: 'Narrativo',
              musical: 'Musical',
            },
          },
          'motion-designer': {
            name: 'Motion Designer',
            specializations: {
              '2d': '2D',
              '3d': '3D',
              mixto: 'Mixto',
            },
          },
          'disenador-3d': {
            name: 'Diseñador 3D',
            specializations: {
              modelado: 'Modelado',
              texturizado: 'Texturizado',
              renderizado: 'Renderizado',
            },
          },
        },
      },
    },
  },
  'servicios-creativos': {
    name: 'Otros Servicios Creativos',
    disciplines: {
      'representacion-gestion': {
        name: 'Representación y Gestión',
        roles: {
          'agente-talento': {
            name: 'Agente de Talento',
            specializations: {
              artistico: 'Artístico',
              deportivo: 'Deportivo',
              corporativo: 'Corporativo',
            },
          },
          'manager-artistico': {
            name: 'Mánager Artístico',
            specializations: {
              musica: 'Música',
              'artes-escenicas': 'Artes escénicas',
              audiovisual: 'Audiovisual',
            },
          },
        },
      },
      'promocion-marketing': {
        name: 'Promoción y Marketing',
        roles: {
          'promotor-cultural': {
            name: 'Promotor Cultural',
            specializations: {
              eventos: 'Eventos',
              festivales: 'Festivales',
              institucional: 'Institucional',
            },
          },
        },
      },
      'educacion-mentoria': {
        name: 'Educación y Mentoría',
        roles: {
          'mentor-artistico': {
            name: 'Mentor Artístico',
            specializations: {
              coaching: 'Coaching',
              talleres: 'Talleres',
              masterclasses: 'Masterclasses',
            },
          },
          conferencista: {
            name: 'Conferencista',
            specializations: {
              arte: 'Arte',
              cultura: 'Cultura',
              creatividad: 'Creatividad',
            },
          },
        },
      },
      'servicios-evento': {
        name: 'Servicios de Evento',
        roles: {
          'productor-eventos': {
            name: 'Productor de Eventos',
            specializations: {
              corporativo: 'Corporativo',
              social: 'Social',
              cultural: 'Cultural',
            },
          },
        },
      },
      'consultoria-creativa': {
        name: 'Consultoría Creativa',
        roles: {
          'consultor-cultural': {
            name: 'Consultor Cultural',
            specializations: {
              estrategia: 'Estrategia',
              innovacion: 'Innovación',
              branding: 'Branding cultural',
            },
          },
          'director-creativo': {
            name: 'Director Creativo',
            specializations: {
              publicidad: 'Publicidad',
              branding: 'Branding',
              contenido: 'Contenido',
            },
          },
        },
      },
    },
  },
};

// ============================================================
// FUNCIONES HELPER (CON SOPORTE DE IDIOMA)
// ============================================================

/**
 * Obtiene los textos de una categoría en el idioma especificado.
 */
export const getCategoryStrings = (categoryId: string, lang: 'es' = 'es'): CategoryStrings | undefined => {
  const dictionaries = { es: STRINGS_ES };
  return dictionaries[lang][categoryId];
};

/**
 * Obtiene una categoría por su ID (datos estructurales).
 */
export const getCategoryById = (id: string): Category | undefined => {
  return ARTIST_CATEGORIES.find(cat => cat.id === id);
};

/**
 * Obtiene una disciplina por IDs de categoría y disciplina.
 */
export const getDisciplineById = (categoryId: string, disciplineId: string): Discipline | undefined => {
  const category = getCategoryById(categoryId);
  return category?.disciplines.find(disc => disc.id === disciplineId);
};

/**
 * Obtiene un rol por IDs de categoría, disciplina y rol.
 */
export const getRoleById = (
  categoryId: string,
  disciplineId: string,
  roleId: string
): Role | undefined => {
  const discipline = getDisciplineById(categoryId, disciplineId);
  return discipline?.roles.find(role => role.id === roleId);
};

/**
 * Obtiene una especialización por IDs completos.
 */
export const getSpecializationById = (
  categoryId: string,
  disciplineId: string,
  roleId: string,
  specializationId: string
): Specialization | undefined => {
  const role = getRoleById(categoryId, disciplineId, roleId);
  return role?.specializations.find(spec => spec.id === specializationId);
};

/**
 * Devuelve las disciplinas de una categoría.
 */
export const getDisciplinesByCategory = (categoryId: string): Discipline[] => {
  const category = getCategoryById(categoryId);
  return category?.disciplines || [];
};

/**
 * Devuelve los roles de una disciplina.
 */
export const getRolesByDiscipline = (categoryId: string, disciplineId: string): Role[] => {
  const discipline = getDisciplineById(categoryId, disciplineId);
  return discipline?.roles || [];
};

/**
 * Devuelve las especializaciones de un rol.
 */
export const getSpecializationsByRole = (
  categoryId: string,
  disciplineId: string,
  roleId: string
): Specialization[] => {
  const role = getRoleById(categoryId, disciplineId, roleId);
  return role?.specializations || [];
};

/**
 * Obtiene los nombres traducidos de una categoría, disciplina, rol o especialización.
 * Si no se encuentra, devuelve el ID como fallback.
 */
export const getLocalizedCategoryName = (categoryId: string, lang: 'es' = 'es'): string => {
  return getCategoryStrings(categoryId, lang)?.name || categoryId;
};

export const getLocalizedDisciplineName = (categoryId: string, disciplineId: string, lang: 'es' = 'es'): string => {
  return getCategoryStrings(categoryId, lang)?.disciplines[disciplineId]?.name || disciplineId;
};

export const getLocalizedRoleName = (categoryId: string, disciplineId: string, roleId: string, lang: 'es' = 'es'): string => {
  return getCategoryStrings(categoryId, lang)?.disciplines[disciplineId]?.roles[roleId]?.name || roleId;
};

export const getLocalizedSpecializationName = (
  categoryId: string,
  disciplineId: string,
  roleId: string,
  specializationId: string,
  lang: 'es' = 'es'
): string => {
  return (
    getCategoryStrings(categoryId, lang)?.disciplines[disciplineId]?.roles[roleId]?.specializations[
      specializationId
    ] || specializationId
  );
};

/**
 * Obtiene las disciplinas sugeridas (TADs) de un rol.
 */
export const getSuggestedDisciplines = (
  categoryId: string,
  disciplineId: string,
  roleId: string
): string[] => {
  const role = getRoleById(categoryId, disciplineId, roleId);
  return role?.suggestedDisciplines || [];
};

/**
 * Obtiene las estadísticas sugeridas de un rol.
 */
export const getSuggestedStats = (
  categoryId: string,
  disciplineId: string,
  roleId: string
): SuggestedStat[] => {
  const role = getRoleById(categoryId, disciplineId, roleId);
  return role?.suggestedStats || [];
};

/**
 * Busca una disciplina por su ID en todas las categorías.
 */
export const findDisciplineById = (disciplineId: string): { category: Category; discipline: Discipline } | undefined => {
  for (const category of ARTIST_CATEGORIES) {
    const discipline = category.disciplines.find(d => d.id === disciplineId);
    if (discipline) {
      return { category, discipline };
    }
  }
  return undefined;
};

// ============================================================
// COMPATIBILIDAD CON SISTEMA ANTERIOR (Subcategorías)
// ============================================================

export const getSubcategoriesByCategory = (categoryId: string): Discipline[] => {
  return getDisciplinesByCategory(categoryId);
};

export const getSpecializationsBySubcategory = (
  categoryId: string,
  subcategoryId: string
): Role[] => {
  return getRolesByDiscipline(categoryId, subcategoryId);
};