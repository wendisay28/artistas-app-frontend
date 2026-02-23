import type {
  Artist, Service, PortfolioItem, Review,
  Product, ArtistEvent, ScheduleItem, LiveRequest, CalendarDay,
} from './components/types';

export const MOCK_ARTIST: Artist = {
  id: '1',
  name: 'Valeria Noir',
  handle: '@valeria.noir',
  location: 'Medellín, CO',
  avatar: '',
  isVerified: true,
  isOnline: true,
  bio: 'Cantautora y artista visual nacida en Medellín. Creo mundos sonoros y visuales donde el alma encuentra refugio. Mezclo pop contemporáneo con texturas de R&B y arte generativo.',
  tags: [
    { label: 'Pop / R&B', genre: true },
    { label: 'Arte Visual', genre: true },
    { label: 'Comisiones' },
  ],
  stats: [
    { value: '12.4K', label: 'Seguidores' },
    { value: '148', label: 'Obras' },
    { value: '4.9', label: 'Rating' },
    { value: '87', label: 'Servicios' },
  ],
  info: [
    { label: 'Ciudad', icon: 'location', value: 'Medellín, CO' },
    { label: 'Desde', icon: 'calendar', value: '2019' },
    { label: 'Formación', icon: 'school', value: 'Bellas Artes UdeA' },
    { label: 'Idiomas', icon: 'globe', value: 'ES · EN' },
    { label: 'Géneros', icon: 'musical-notes', value: 'Pop · R&B · Soul' },
    { label: 'Estilo', icon: 'color-palette', value: 'Digital · Mixta' },
  ],
  socialLinks: [
    { label: 'Spotify', icon: 'musical-note', url: '#' },
    { label: 'Instagram', icon: 'camera', url: '#' },
    { label: 'Sitio web', icon: 'link', url: '#' },
  ],
};

export const MOCK_SERVICES: Service[] = [
  {
    id: 'service-1',
    name: 'Sesión Maternidad',
    description: 'Captura los momentos especiales de tu embarazo en un ambiente profesional y cómodo.',
    price: 250000,
    currency: 'COP',
    duration: '1 hora',
    category: 'Maternidad',
    location: 'Estudio',
    includes: ['15 fotos editadas', 'Impresiones 10x15', 'Asesoría de vestuario'],
    deliveryTime: '3-5 días',
    maxPeople: 3,
    icon: 'camera-outline',
    isAvailable: true
  },
  {
    id: 'service-2',
    name: 'Retrato Familiar',
    description: 'Sesión fotográfica profesional para capturar los lazos familiares.',
    price: 180000,
    currency: 'COP',
    duration: '2 horas',
    category: 'Familia',
    location: 'Exterior',
    includes: ['25 fotos digitales', 'Galería online', '1 impresión grande'],
    deliveryTime: '5-7 días',
    maxPeople: 6,
    icon: 'people-outline',
    isAvailable: true
  },
  {
    id: 'service-3',
    name: 'Sesión de Estudio',
    description: 'Grabación profesional con equipo de alta calidad.',
    price: 120000,
    currency: 'COP',
    duration: '2 horas',
    category: 'Grabación',
    location: 'Estudio',
    includes: ['Ingeniero de sonido', 'Mezcla básica', 'Masterización'],
    deliveryTime: '48-72 horas',
    maxPeople: 4,
    icon: 'mic-outline',
    isAvailable: true
  },
  {
    id: 'service-4',
    name: 'Consultar por proyectos personalizados',
    icon: 'chatbubble-outline',
    description: 'Trabajos personalizados según tus necesidades',
    price: 0,
  }
];

export const MOCK_PORTFOLIO: PortfolioItem[] = [
  { id: 'p1', emoji: '', price: '$280', gradientStart: '#12091e', gradientEnd: '#1e0c12', span: 'double' },
  { id: 'p2', emoji: '', isNFT: true, gradientStart: '#1e1209', gradientEnd: '#1a0e04' },
  { id: 'p3', emoji: '', price: '$120', gradientStart: '#09120e', gradientEnd: '#091209' },
  { id: 'p4', emoji: '', price: '$340', gradientStart: '#1a091e', gradientEnd: '#12091a' },
  { id: 'p5', emoji: '', isNFT: true, gradientStart: '#091e1a', gradientEnd: '#091218' },
  { id: 'p6', emoji: '', price: '$95', gradientStart: '#1e1a09', gradientEnd: '#1a1809' },
  { id: 'p7', emoji: '', gradientStart: '#121212', gradientEnd: '#1e1e1e' },
];

export const MOCK_REVIEWS: Review[] = [
  {
    id: 'r1', reviewerName: 'Carlos M.', reviewerEmoji: '',
    reviewerAvatarGradient: ['#d4a853', '#b85c3a'],
    serviceName: 'Show privado cumpleaños', stars: 5,
    text: 'Valeria hizo que la noche fuera completamente mágica. Superó todas las expectativas.',
    date: '14 Feb 2025',
  },
  {
    id: 'r2', reviewerName: 'Daniela R.', reviewerEmoji: '',
    reviewerAvatarGradient: ['#3ecf8e', '#2a9e68'],
    serviceName: 'Retrato digital', stars: 5,
    text: 'El retrato quedó exactamente como lo imaginé, incluso mejor. Muy puntual y excelente comunicación.',
    date: '2 Feb 2025',
  },
  {
    id: 'r3', reviewerName: 'Andrés T.', reviewerEmoji: '',
    reviewerAvatarGradient: ['#5a8dee', '#3a5db8'],
    serviceName: 'Canción personalizada', stars: 4,
    text: 'La canción para el aniversario de mis padres los hizo llorar. Talento enorme. 100% recomendada.',
    date: '28 Ene 2025',
  },
];

export const MOCK_PRODUCTS: Product[] = [
  { id: 'pr1', emoji: '', name: 'Cosmos Interior', type: 'Arte digital · Alta resolución', price: '$45 USD', gradientStart: '#12091e', gradientEnd: '#1e0e1a' },
  { id: 'pr2', emoji: '', name: 'Llama Eterna', type: 'NFT · OpenSea', price: '0.4 ETH', badge: 'nft', gradientStart: '#1e1209', gradientEnd: '#1a120a' },
  { id: 'pr3', emoji: '', name: 'EP "Ruido Visible"', type: 'Vinilo · Ed. limitada', price: '$85.000', badge: 'low', gradientStart: '#091e09', gradientEnd: '#0e1a0e' },
  { id: 'pr4', emoji: '', name: 'Print "Noche Azul"', type: 'Impresión giclée · A3', price: '$120 USD', badge: 'out', gradientStart: '#09121e', gradientEnd: '#091218' },
  { id: 'pr5', emoji: '', name: 'Pack Wallpapers', type: 'Digital · 20 archivos', price: '$12 USD', gradientStart: '#1a091e', gradientEnd: '#12091a' },
  { id: 'pr6', emoji: '', name: 'Tutorial Procreate', type: 'Video · 3 hrs', price: '$25 USD', gradientStart: '#1e1a09', gradientEnd: '#1a1809' },
];

export const MOCK_EVENTS: ArtistEvent[] = [
  {
    id: 'e1', title: 'Noche Acústica — Vol. 3', emoji: '',
    dateLabel: 'Hoy · 8:00 PM', location: 'Bar Clandestino',
    price: '$45.000', currency: 'COP', status: 'live',
    attendees: 34, capacity: 50, revenue: '$1.53M',
    gradientStart: '#12091e', gradientEnd: '#1e0e14',
  },
  {
    id: 'e2', title: 'Workshop: Arte con IA', emoji: '',
    dateLabel: 'Sáb 22 Feb', location: 'Online · Zoom',
    price: '$89.000', currency: 'COP', status: 'upcoming',
    attendees: 28, capacity: 30, revenue: '$2.49M',
    gradientStart: '#091e09', gradientEnd: '#0e1a12',
    isSoldOut: true,
  },
  {
    id: 'e3', title: 'Exposición "Ruido Visible"', emoji: '',
    dateLabel: '1–15 Mar', location: 'Galería El Poblado',
    price: 'Gratis', status: 'draft',
    attendees: 0, capacity: 999,
    gradientStart: '#1e1209', gradientEnd: '#1a1200',
    isFree: true,
  },
];

export const MOCK_SCHEDULE: ScheduleItem[] = [
  { id: 'sc1', month: 'FEB', day: '20', title: 'Sesión grabación — Estudio 4', time: '2:00 PM', location: 'Laureles', status: 'confirmed' },
  { id: 'sc2', month: 'FEB', day: '22', title: 'Workshop Arte con IA', time: '10:00 AM', location: 'Online', status: 'confirmed' },
  { id: 'sc3', month: 'MAR', day: '1', title: 'Inauguración Exposición', time: '6:00 PM', location: 'Galería El Poblado', status: 'pending' },
];

export const MOCK_LIVE_REQUEST: LiveRequest = {
  id: 'lr1',
  title: '',
  description: '',
  offerAmount: '',
  currency: '',
  secondsRemaining: 0,
};

export const MOCK_CALENDAR: CalendarDay[] = [
  // Week 1 padding (Feb starts on Sunday in 2026, so Mon–Sat empty)
  { day: null, state: 'empty' }, { day: null, state: 'empty' },
  { day: null, state: 'empty' }, { day: null, state: 'empty' },
  { day: null, state: 'empty' }, { day: null, state: 'empty' },
  { day: 1, state: 'normal' }, { day: 2, state: 'normal' },
  { day: 3, state: 'normal' }, { day: 4, state: 'normal' },
  { day: 5, state: 'normal' }, { day: 6, state: 'normal' },
  { day: 7, state: 'normal' },
  { day: 8, state: 'normal' }, { day: 9, state: 'normal' },
  { day: 10, state: 'normal' }, { day: 11, state: 'normal' },
  { day: 12, state: 'normal' }, { day: 13, state: 'normal' },
  { day: 14, state: 'normal' },
  { day: 15, state: 'today' },
  { day: 16, state: 'normal' },
  { day: 17, state: 'normal' },
  { day: 18, state: 'normal' }, { day: 19, state: 'normal' },
  { day: 20, state: 'booked', hasEvent: true }, { day: 21, state: 'normal' },
  { day: 22, state: 'booked', hasEvent: true }, { day: 23, state: 'normal' },
  { day: 24, state: 'normal' }, { day: 25, state: 'normal' },
  { day: 26, state: 'normal' }, { day: 27, state: 'normal' },
  { day: 28, state: 'normal' },
];
