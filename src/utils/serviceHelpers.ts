// Lógica de negocio para servicios de artistas

export type ServiceNature = 'digital' | 'presencial' | 'hibrido';

export interface UnitOption {
  id: string;
  label: string;
  category: 'ugc' | 'presencial' | 'creative' | 'entertainment';
  icon: string;
  nature: ServiceNature; // Agregamos la naturaleza para saber qué lógica aplicar
}

// Mapeo de unidades por disciplina con Naturaleza definida
export const getUnitSuggestions = (disciplineId: string): UnitOption[] => {
  const mapping: Record<string, UnitOption[]> = {
    audiovisual: [
      { id: 'Videos', label: 'Videos', category: 'ugc', icon: 'videocam-outline', nature: 'digital' },
      { id: 'UGC Completo', label: 'UGC (Visita + Edit)', category: 'ugc', icon: 'megaphone-outline', nature: 'hibrido' },
      { id: 'Ediciones', label: 'Ediciones', category: 'creative', icon: 'brush-outline', nature: 'digital' },
      { id: 'Sesiones', label: 'Sesiones', category: 'presencial', icon: 'people-outline', nature: 'presencial' },
      { id: 'Reels/TikToks', label: 'Reels/TikToks', category: 'ugc', icon: 'phone-portrait-outline', nature: 'digital' },
    ],
    musica: [
      { id: 'Canciones', label: 'Canciones', category: 'creative', icon: 'musical-note', nature: 'digital' },
      { id: 'Jingle', label: 'Jingle Publicitario', category: 'creative', icon: 'mic-outline', nature: 'digital' },
      { id: 'Shows', label: 'Shows', category: 'entertainment', icon: 'musical-notes-outline', nature: 'presencial' },
      { id: 'Beats', label: 'Beats', category: 'creative', icon: 'musical-note', nature: 'digital' },
      { id: 'Voiceovers', label: 'Voiceovers', category: 'creative', icon: 'mic-outline', nature: 'digital' },
    ],
    fotografia: [
      { id: 'Fotos', label: 'Fotos', category: 'ugc', icon: 'camera-outline', nature: 'digital' },
      { id: 'Sesiones', label: 'Sesiones', category: 'presencial', icon: 'people-outline', nature: 'hibrido' }, // Híbrido: vas y luego entregas
      { id: 'Eventos', label: 'Eventos/Bodas', category: 'presencial', icon: 'calendar-outline', nature: 'hibrido' }, // Híbrido
      { id: 'Ediciones', label: 'Ediciones', category: 'creative', icon: 'brush-outline', nature: 'digital' },
    ],
    diseno: [
      { id: 'Diseños', label: 'Diseños', category: 'creative', icon: 'brush-outline', nature: 'digital' },
      { id: 'Textos', label: 'Textos', category: 'creative', icon: 'document-text-outline', nature: 'digital' },
      { id: 'Branding', label: 'Branding', category: 'creative', icon: 'brush-outline', nature: 'digital' },
    ],
    arte: [
      { id: 'Obras', label: 'Obras', category: 'creative', icon: 'star-outline', nature: 'digital' },
      { id: 'Show en vivo', label: 'Show en vivo', category: 'entertainment', icon: 'musical-notes-outline', nature: 'presencial' }, // Caso Payasos
      { id: 'Clase', label: 'Clase/Instrucción', category: 'presencial', icon: 'school-outline', nature: 'presencial' }, // Caso Danza
      { id: 'Actuación', label: 'Actuación', category: 'entertainment', icon: 'star-outline', nature: 'presencial' },
    ],
  };
  
  return mapping[disciplineId] || [];
};

// Hints dinámicos por unidad (Labels de los Inputs)
export const getHintByUnit = (unit: string): { includedCount: string; deliveryDays: string } => {
  const hints: Record<string, { includedCount: string; deliveryDays: string }> = {
    // UGC y Contenido Digital
    'Videos': {
      includedCount: '¿Cuántos videos entregas en total?',
      deliveryDays: '¿Días para editar y entregar videos?'
    },
    'UGC Completo': {
      includedCount: '¿Cuántos videos finales entregas?',
      deliveryDays: '¿Días para entregar tras la visita al local?'
    },
    'Fotos': {
      includedCount: '¿Cuántas fotos entregas en total?',
      deliveryDays: '¿Días para editar y entregar fotos?'
    },
    'Reels/TikToks': {
      includedCount: '¿Cuántos reels/tiktoks creas?',
      deliveryDays: '¿Días para crear y entregar reels?'
    },
    
    // Servicios Presenciales / Híbridos
    'Sesiones': {
      includedCount: '¿Cuántas sesiones realizas?',
      deliveryDays: '¿Días para entregar el material editado?'
    },
    'Horas': {
      includedCount: '¿Cuántas horas dura el servicio?',
      deliveryDays: '¿Días de anticipación para agendar?'
    },
    'Eventos': {
      includedCount: '¿Cuántos eventos o días de cobertura?',
      deliveryDays: '¿Días para entregar la galería completa?'
    },
    'Visitas': {
      includedCount: '¿Cuántas visitas al negocio incluyes?',
      deliveryDays: '¿Días de anticipación para coordinar?'
    },
    
    // Servicios Creativos
    'Canciones': {
      includedCount: '¿Cuántas canciones compones?',
      deliveryDays: '¿Días para entregar la versión final?'
    },
    'Jingle': {
        includedCount: '¿Cuántas versiones del jingle entregas?',
        deliveryDays: '¿Días para la entrega del audio?'
    },
    'Diseños': {
      includedCount: '¿Cuántos diseños gráficos creas?',
      deliveryDays: '¿Días para entregar todos los diseños?'
    },
    'Ediciones': {
      includedCount: '¿Cuántas ediciones realizas?',
      deliveryDays: '¿Días para entregar archivos editados?'
    },
    
    // Servicios de Entretenimiento (Netamente Presencial)
    'Show en vivo': {
      includedCount: '¿Cuántos shows/pases realizas?',
      deliveryDays: '¿Días de anticipación para reservar fecha?'
    },
    'Clase': {
        includedCount: '¿Cuántas clases o sesiones incluye el pack?',
        deliveryDays: '¿Días de anticipación para programar?'
    },
    'Shows': {
      includedCount: '¿Cuántas presentaciones incluye?',
      deliveryDays: '¿Días de anticipación para la reserva?'
    },
  };
  
  return hints[unit] || {
    includedCount: '¿Cuántas unidades incluyes?',
    deliveryDays: '¿Días para entregar?'
  };
};

// Iconos por disciplina
export const getIconByDiscipline = (disciplineId: string): string => {
  const iconMap: Record<string, string> = {
    audiovisual: 'videocam-outline',
    musica: 'musical-note',
    fotografia: 'camera-outline',
    diseno: 'brush-outline',
    arte: 'star-outline',
  };
  return iconMap[disciplineId] || 'camera-outline';
};

// Placeholder dinámico para nombre del servicio
export const getServiceNamePlaceholder = (unit: string, artistRoleName?: string): string => {
  if (artistRoleName) {
    return `Ej: Pack de 3 ${unit} para marcas`;
  }
  return `Ej: Servicio de ${unit}`;
};

// Formateador de precio para COP
export const formatPrice = (price: string): string => {
  const cleanPrice = price.replace(/[^\d]/g, '');
  if (!cleanPrice) return '';
  const number = parseInt(cleanPrice, 10);
  
  if (isNaN(number)) return price;
  
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
};

// Unidades genéricas para fallback
export const getGenericUnits = (): UnitOption[] => [
  { id: 'Videos', label: 'Videos', category: 'ugc', icon: 'videocam-outline', nature: 'digital' },
  { id: 'Fotos', label: 'Fotos', category: 'ugc', icon: 'camera-outline', nature: 'digital' },
  { id: 'Sesiones', label: 'Sesiones', category: 'presencial', icon: 'people-outline', nature: 'hibrido' },
  { id: 'Horas', label: 'Horas', category: 'presencial', icon: 'time-outline', nature: 'presencial' },
  { id: 'Canciones', label: 'Canciones', category: 'creative', icon: 'musical-note', nature: 'digital' },
  { id: 'Shows', label: 'Shows', category: 'entertainment', icon: 'musical-notes-outline', nature: 'presencial' },
];

// ── Package Types ─────────────────────────────────────────────────────────────

export interface PackageTypeOption {
  id: 'simple' | 'pack' | 'weekly' | 'monthly';
  label: string;
  desc: string;
  icon: string;
}

export const getPackageTypes = (): PackageTypeOption[] => [
  { id: 'simple', label: 'Simple', desc: 'Entrega única', icon: 'cube-outline' },
  { id: 'pack', label: 'Pack', desc: 'Paquete de servicios', icon: 'layers-outline' },
  { id: 'weekly', label: 'Semanal', desc: 'Servicio recurrente', icon: 'refresh-outline' },
  { id: 'monthly', label: 'Mensual', desc: 'Suscripción mensual', icon: 'calendar-outline' },
];

// ── Duration Options ───────────────────────────────────────────────────────────

export interface DurationOption {
  value: string;
  label: string;
}

export const getDurationOptions = (): DurationOption[] => [
  { value: '30 min', label: '30 minutos' },
  { value: '1 hora', label: '1 hora' },
  { value: '2 horas', label: '2 horas' },
  { value: '3 horas', label: '3 horas' },
  { value: '4 horas', label: '4 horas' },
  { value: 'Medio día', label: 'Medio día (4 horas)' },
  { value: 'Día completo', label: 'Día completo (8 horas)' },
  { value: 'Por proyecto', label: 'Por acuerdo' },
];

export const getDefaultDuration = (): string => '1 hora';

// ── Category Options ───────────────────────────────────────────────────────────

export interface CategoryOption {
  value: string;
  label: string;
}

export const getCategoryOptions = (): CategoryOption[] => [
  { value: 'creative', label: 'Creativo' },
  { value: 'technical', label: 'Técnico' },
  { value: 'consulting', label: 'Consultoría' },
  { value: 'service', label: 'Servicio' },
];

export const getDefaultCategory = (): string => 'creative';