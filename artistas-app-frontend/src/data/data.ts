import type {
  Artist, Service, PortfolioItem, Review,
  Product, ArtistEvent, ScheduleItem, LiveRequest, CalendarDay,
} from './types';

export const MOCK_ARTIST: Artist = {
  id: '1',
  name: 'Valeria Noir',
  handle: '@valeria.noir',
  location: 'Medellín, CO',
  avatar: '🎤',
  isVerified: true,
  isOnline: true,
  bio: 'Cantautora y artista visual nacida en Medellín. Creo mundos sonoros y visuales donde el alma encuentra refugio. Mezclo pop contemporáneo con texturas de R&B y arte generativo. ✦',
  tags: [
    { label: '🎵 Pop / R&B', genre: true },
    { label: '🎨 Arte Visual', genre: true },
    { label: 'Comisiones ✦' },
  ],
  stats: [
    { value: '12.4K', label: 'Seguidores' },
    { value: '148', label: 'Obras' },
    { value: '4.9★', label: 'Rating' },
    { value: '87', label: 'Servicios' },
  ],
  info: [
    { label: 'Ciudad', icon: '📍', value: 'Medellín, CO' },
    { label: 'Desde', icon: '🗓', value: '2019' },
    { label: 'Formación', icon: '🎓', value: 'Bellas Artes UdeA' },
    { label: 'Idiomas', icon: '🌐', value: 'ES · EN' },
    { label: 'Géneros', icon: '🎵', value: 'Pop · R&B · Soul' },
    { label: 'Estilo', icon: '🎨', value: 'Digital · Mixta' },
  ],
  socialLinks: [
    { label: 'Spotify', icon: '🎵', url: '#' },
    { label: 'Instagram', icon: '📸', url: '#' },
    { label: 'Sitio web', icon: '🔗', url: '#' },
  ],
};

export const MOCK_SERVICES: Service[] = [
  {
    id: 's1', icon: '🎤', name: 'Show en vivo — Privado',
    description: 'Presentación musical para eventos privados: cumpleaños, bodas, corporativos.',
    price: 'Desde $250K COP', deliveryTag: '📍 Presencial',
    bgGradient: ['#12091e', '#1e0e1a'],
  },
  {
    id: 's2', icon: '🎨', name: 'Retrato digital personalizado',
    description: 'Arte digital al estilo de Valeria. 2 revisiones incluidas.',
    price: '$80 USD', deliveryTag: '⏱ 5–7 días',
    bgGradient: ['#091e09', '#0e1a09'],
  },
  {
    id: 's3', icon: '🎵', name: 'Canción original (encargo)',
    description: 'Composición y grabación de canción personalizada.',
    price: '$150 USD', deliveryTag: '⏱ 10–14 días',
    bgGradient: ['#1e0909', '#1a0e0e'],
  },
  {
    id: 's4', icon: '💻', name: 'Masterclass 1:1 online',
    description: 'Sesión de composición, técnica vocal o arte digital.',
    price: '$60 USD', deliveryTag: '📹 Online',
    bgGradient: ['#09121e', '#0e121a'],
  },
];

export const MOCK_PORTFOLIO: PortfolioItem[] = [
  { id: 'p1', emoji: '🌌', price: '$280', gradientStart: '#12091e', gradientEnd: '#1e0c12', span: 'double' },
  { id: 'p2', emoji: '🔥', isNFT: true, gradientStart: '#1e1209', gradientEnd: '#1a0e04' },
  { id: 'p3', emoji: '🌿', price: '$120', gradientStart: '#09120e', gradientEnd: '#091209' },
  { id: 'p4', emoji: '🌙', price: '$340', gradientStart: '#1a091e', gradientEnd: '#12091a' },
  { id: 'p5', emoji: '💫', isNFT: true, gradientStart: '#091e1a', gradientEnd: '#091218' },
  { id: 'p6', emoji: '🎭', price: '$95', gradientStart: '#1e1a09', gradientEnd: '#1a1809' },
  { id: 'p7', emoji: '🦋', gradientStart: '#121212', gradientEnd: '#1e1e1e' },
];

export const MOCK_REVIEWS: Review[] = [
  {
    id: 'r1', reviewerName: 'Carlos M.', reviewerEmoji: '😊',
    reviewerAvatarGradient: ['#d4a853', '#b85c3a'],
    serviceName: 'Show privado cumpleaños', stars: 5,
    text: 'Valeria hizo que la noche fuera completamente mágica. Superó todas las expectativas.',
    date: '14 Feb 2025',
  },
  {
    id: 'r2', reviewerName: 'Daniela R.', reviewerEmoji: '🎨',
    reviewerAvatarGradient: ['#3ecf8e', '#2a9e68'],
    serviceName: 'Retrato digital', stars: 5,
    text: 'El retrato quedó exactamente como lo imaginé, incluso mejor. Muy puntual y excelente comunicación.',
    date: '2 Feb 2025',
  },
  {
    id: 'r3', reviewerName: 'Andrés T.', reviewerEmoji: '🎵',
    reviewerAvatarGradient: ['#5a8dee', '#3a5db8'],
    serviceName: 'Canción personalizada', stars: 4,
    text: 'La canción para el aniversario de mis padres los hizo llorar. Talento enorme. 100% recomendada.',
    date: '28 Ene 2025',
  },
];

export const MOCK_PRODUCTS: Product[] = [
  { id: 'pr1', emoji: '🌌', name: 'Cosmos Interior', type: 'Arte digital · Alta resolución', price: '$45 USD', gradientStart: '#12091e', gradientEnd: '#1e0e1a' },
  { id: 'pr2', emoji: '🔥', name: 'Llama Eterna', type: 'NFT · OpenSea', price: '0.4 ETH', badge: 'nft', gradientStart: '#1e1209', gradientEnd: '#1a120a' },
  { id: 'pr3', emoji: '🎵', name: 'EP "Ruido Visible"', type: 'Vinilo · Ed. limitada', price: '$85.000', badge: 'low', gradientStart: '#091e09', gradientEnd: '#0e1a0e' },
  { id: 'pr4', emoji: '🖨', name: 'Print "Noche Azul"', type: 'Impresión giclée · A3', price: '$120 USD', badge: 'out', gradientStart: '#09121e', gradientEnd: '#091218' },
  { id: 'pr5', emoji: '💫', name: 'Pack Wallpapers', type: 'Digital · 20 archivos', price: '$12 USD', gradientStart: '#1a091e', gradientEnd: '#12091a' },
  { id: 'pr6', emoji: '🎨', name: 'Tutorial Procreate', type: 'Video · 3 hrs', price: '$25 USD', gradientStart: '#1e1a09', gradientEnd: '#1a1809' },
];

export const MOCK_EVENTS: ArtistEvent[] = [
  {
    id: 'e1', title: 'Noche Acústica — Vol. 3', emoji: '🎤',
    dateLabel: 'Hoy · 8:00 PM', location: 'Bar Clandestino',
    price: '$45.000', currency: 'COP', status: 'live',
    attendees: 34, capacity: 50, revenue: '$1.53M',
    gradientStart: '#12091e', gradientEnd: '#1e0e14',
  },
  {
    id: 'e2', title: 'Workshop: Arte con IA', emoji: '🎨',
    dateLabel: 'Sáb 22 Feb', location: 'Online · Zoom',
    price: '$89.000', currency: 'COP', status: 'upcoming',
    attendees: 28, capacity: 30, revenue: '$2.49M',
    gradientStart: '#091e09', gradientEnd: '#0e1a12',
    isSoldOut: true,
  },
  {
    id: 'e3', title: 'Exposición "Ruido Visible"', emoji: '🎵',
    dateLabel: '1–15 Mar', location: 'Galería El Poblado',
    price: 'Gratis', status: 'draft',
    attendees: 0, capacity: 999,
    gradientStart: '#1e1209', gradientEnd: '#1a1200',
    isFree: true,
  },
];

export const MOCK_SCHEDULE: ScheduleItem[] = [
  { id: 'sc1', month: 'FEB', day: '17', title: 'Noche Acústica — Vol. 3', time: '8:00 PM', location: 'Bar Clandestino', status: 'confirmed' },
  { id: 'sc2', month: 'FEB', day: '20', title: 'Sesión grabación — Estudio 4', time: '2:00 PM', location: 'Laureles', status: 'confirmed' },
  { id: 'sc3', month: 'FEB', day: '22', title: 'Workshop Arte con IA', time: '10:00 AM', location: 'Online', status: 'confirmed' },
  { id: 'sc4', month: 'MAR', day: '1', title: 'Inauguración Exposición', time: '6:00 PM', location: 'Galería El Poblado', status: 'pending' },
];

export const MOCK_LIVE_REQUEST: LiveRequest = {
  id: 'lr1',
  title: '🎂 Cumpleaños de Sofía — Sáb 8PM',
  description: 'Cantante de pop/R&B para celebración privada, aprox. 2 horas. El Poblado. Equipo de sonido incluido.',
  offerAmount: '$350.000',
  currency: 'COP',
  secondsRemaining: 107,
};

export const MOCK_CALENDAR: CalendarDay[] = [
  // Week 1 padding (Feb starts on Sunday in 2026, so Mon–Sat empty)
  { day: null, state: 'empty' }, { day: null, state: 'empty' },
  { day: null, state: 'empty' }, { day: null, state: 'empty' },
  { day: null, state: 'empty' }, { day: null, state: 'empty' },
  { day: 1, state: 'normal' }, { day: 2, state: 'normal' },
  { day: 3, state: 'normal' }, { day: 4, state: 'normal' },
  { day: 5, state: 'normal' }, { day: 6, state: 'normal' },
  { day: 7, state: 'booked', hasEvent: true },
  { day: 8, state: 'normal' }, { day: 9, state: 'normal' },
  { day: 10, state: 'booked' }, { day: 11, state: 'normal' },
  { day: 12, state: 'normal' }, { day: 13, state: 'unavailable' },
  { day: 14, state: 'unavailable' },
  { day: 15, state: 'today', hasEvent: true },
  { day: 16, state: 'normal' },
  { day: 17, state: 'today' },
  { day: 18, state: 'normal' }, { day: 19, state: 'normal' },
  { day: 20, state: 'booked', hasEvent: true }, { day: 21, state: 'normal' },
  { day: 22, state: 'booked', hasEvent: true }, { day: 23, state: 'normal' },
  { day: 24, state: 'normal' }, { day: 25, state: 'unavailable' },
  { day: 26, state: 'unavailable' }, { day: 27, state: 'normal' },
  { day: 28, state: 'normal' },
];