// Mock data para la sección de favoritos
// Artistas destacados en favoritos

export const MOCK_FAVORITE_ARTISTS = [
  {
    id: 'fav-artist-1',
    name: 'Catalina Martínez',
    category: 'Pintura Contemporánea',
    type: 'artist',
    location: 'Ciudad de México',
    rating: 4.8,
    reviews: 124,
    responseTime: 'Inmediata',
    price: 2500,
    image: 'https://picsum.photos/seed/catalina-martinez/400/600',
    gallery: [
      'https://picsum.photos/seed/catalina-1/400/400',
      'https://picsum.photos/seed/catalina-2/400/400',
      'https://picsum.photos/seed/catalina-3/400/400',
    ],
    tags: ['Pintura', 'Arte Digital', 'Abstracto'],
    bio: 'Artista plástica con más de 10 años de experiencia en pintura contemporánea. Especializada en técnicas mixtas y arte digital. Su obra se caracteriza por colores vibrantes y formas orgánicas que exploran la relación entre el ser humano y la naturaleza.',
    experience: '12 años',
    style: 'Contemporáneo',
    services: ['Pintura al óleo', 'Arte Digital', 'Murales', 'Retratos'],
    distance: '2.5 km',
    verified: true,
    availability: 'Disponible'
  },
  {
    id: 'fav-artist-2',
    name: 'Roberto Silva',
    category: 'Músico',
    type: 'artist',
    location: 'Guadalajara',
    rating: 4.6,
    reviews: 89,
    responseTime: '2 horas',
    price: 1800,
    image: 'https://picsum.photos/seed/roberto-silva/400/600',
    gallery: [
      'https://picsum.photos/seed/roberto-1/400/400',
      'https://picsum.photos/seed/roberto-2/400/400',
    ],
    tags: ['Guitarra', 'Jazz', 'Compositor'],
    bio: 'Guitarrista profesional con más de 8 años de experiencia. Toca en varios locales de la ciudad y ha participado en numerosos festivales de jazz. Su estilo único combina técnica tradicional con influencias modernas.',
    experience: '8 años',
    style: 'Jazz Fusión',
    services: ['Guitarra', 'Composición', 'Producción Musical'],
    distance: '5.1 km',
    verified: true,
    availability: 'Disponible'
  },
  {
    id: 'fav-artist-3',
    name: 'Ana Sofía López',
    category: 'Fotógrafa',
    type: 'artist',
    location: 'Monterrey',
    rating: 4.9,
    reviews: 156,
    responseTime: '1 hora',
    price: 2200,
    image: 'https://picsum.photos/seed/ana-sofia/400/600',
    gallery: [
      'https://picsum.photos/seed/ana-sofia-1/400/400',
      'https://picsum.photos/seed/ana-sofia-2/400/400',
      'https://picsum.photos/seed/ana-sofia-3/400/400',
    ],
    tags: ['Fotografía', 'Retratos', 'Bodas', 'Eventos'],
    bio: 'Fotógrafa profesional especializada en retratos y bodas. Con más de 7 años de experiencia capturando los momentos más importantes de sus clientes. Su estilo se caracteriza por la calidez y la naturalidad de sus fotografías.',
    experience: '7 años',
    style: 'Fotografía Artística',
    services: ['Retratos', 'Bodas', 'Eventos Corporativos', 'Edición'],
    distance: '1.8 km',
    verified: true,
    availability: 'Disponible'
  },
  {
    id: 'fav-artist-4',
    name: 'Luis Hernández',
    prop: 'Escultor',
    type: 'artist',
    location: 'Oaxaca',
    rating: 4.7,
    reviews: 67,
    responseTime: '24 horas',
    price: 3500,
    image: 'https://picsum.photos/seed/luis-hernandez/400/600',
    gallery: [
      'https://picsum.photos/seed/luis-hernandez-1/400/400',
      'https://picsum.photos/seed/luis-hernandez-2/400/400',
      'https://picsum.photos/seed/luis-hernandez-3/400/400',
    ],
    tags: ['Escultura', 'Arte Contemporáneo', 'Madera', 'Piedra'],
    bio: 'Escultor con más de 15 años de experiencia. Especializado en esculturas en madera y piedra. Sus obras reflejan la cultura oaxaqueña y han sido exhibidas en varias galerías del país.',
    experience: '15 años',
    style: 'Escultura Tradicional',
    services: ['Escultura Personalizada', 'Restauración', 'Exhibiciones', 'Talleres'],
    distance: '3.2 km',
    verified: true,
    availability: 'Disponible'
  },
  {
    id: 'fav-artist-5',
    name: 'María González',
    category: 'Diseñadora Gráfica',
    type: 'artist',
    location: 'Ciudad de México',
    rating: 4.8,
    reviews: 203,
    responseTime: 'Inmediata',
    price: 2800,
    image: 'https://picsum.photos/seed/maria-gonzalez/400/600',
    gallery: [
      'https://picsum.photos/seed/maria-gonzalez-1/400/400',
      'https://picsum.photos/seed/maria-gonzalez-2/400/400',
      'https://picsum.photos/seed/maria-gonzalez-3/400/400',
    ],
    tags: ['Diseño Gráfico', 'Branding', 'UI/UX', 'Illustration'],
    bio: 'Diseñadora gráfica con más de 6 años de experiencia. Especializada en branding corporativo y diseño de interfaces para aplicaciones móviles y web. Su enfoque se centra en la usabilidad y la estética moderna.',
    experience: '6 años',
    style: 'Diseño Digital',
    services: ['Branding', 'Diseño UI/UX', 'Illustration', 'Motion Graphics'],
    distance: '0.8 km',
    verified: true,
    availability: 'Disponible'
  }
];

// Tipos para los artistas en favoritos
export interface FavoriteArtist {
  id: string;
  name: string;
  category: string;
  type: 'artist';
  location: string;
  rating: number;
  reviews: number;
  responseTime: string;
  price: number;
  image: string;
  gallery: string[];
  tags: string[];
  bio: string;
  experience: string;
  style: string;
  services: string[];
  distance?: string;
  verified?: boolean;
  availability: string;
}
