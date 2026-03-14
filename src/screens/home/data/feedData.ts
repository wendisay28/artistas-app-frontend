// src/screens/home/data/feedData.ts
// Mock posts del feed comunitario — reemplazar por API cuando exista

export interface FeedPost {
  id: string;
  author: {
    id: string;
    name: string;
    username: string;
    avatar: string | null;
    initials: string;
    category: string;        // id de ARTIST_CATEGORIES
    categoryLabel: string;
    verified?: boolean;
  };
  content: string;
  images?: string[];
  likes: number;
  comments: number;
  inspirations: number;
  createdAt: string; // ISO o relativo
}

export const MOCK_FEED_POSTS: FeedPost[] = [
  {
    id: 'p1',
    author: {
      id: 'u1', name: 'Luna Restrepo', username: 'lunarestrepo',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop',
      initials: 'LR', category: 'artes-visuales', categoryLabel: 'Visuales', verified: true,
    },
    content: 'Terminé esta pieza esta madrugada 🎨 Acrílico sobre lienzo 80×100 cm. A veces el proceso es más bello que el resultado.',
    images: ['https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&auto=format&fit=crop'],
    likes: 142, comments: 18, inspirations: 34, createdAt: '2h',
  },
  {
    id: 'p2',
    author: {
      id: 'u2', name: 'Camilo Torres', username: 'camilomusic',
      avatar: null, initials: 'CT', category: 'musica', categoryLabel: 'Música',
    },
    content: 'Este sábado en el Teatro Metropolitano ✨ Entrada libre. Vengan a escuchar algo distinto — jazz fusión con sonidos del Pacífico.',
    likes: 89, comments: 23, inspirations: 12, createdAt: '4h',
  },
  {
    id: 'p3',
    author: {
      id: 'u3', name: 'Sara Múnera', username: 'saramunera.foto',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop',
      initials: 'SM', category: 'artes-visuales', categoryLabel: 'Visuales',
    },
    content: 'Golden hour en el centro de Medellín. Siempre encuentro algo nuevo en las mismas calles.',
    images: [
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=600&auto=format&fit=crop',
    ],
    likes: 211, comments: 9, inspirations: 55, createdAt: '6h',
  },
  {
    id: 'p4',
    author: {
      id: 'u4', name: 'Diego Arango', username: 'diegoarango.dj',
      avatar: null, initials: 'DA', category: 'musica', categoryLabel: 'Música',
    },
    content: '¿Buscan DJ para bodas y eventos corporativos en Medellín? Abro agenda para abril y mayo 🎵 DM o escríbeme por el portal.',
    likes: 47, comments: 31, inspirations: 8, createdAt: '1d',
  },
  {
    id: 'p5',
    author: {
      id: 'u5', name: 'Valeria Ospina', username: 'valeriadanza',
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&auto=format&fit=crop',
      initials: 'VO', category: 'artes-escenicas', categoryLabel: 'Escénicas',
    },
    content: 'Ensayo #47 del año. La disciplina no es un talento, es una decisión que renuevas cada día 🩰',
    images: ['https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=600&auto=format&fit=crop'],
    likes: 178, comments: 14, inspirations: 67, createdAt: '1d',
  },
  {
    id: 'p6',
    author: {
      id: 'u6', name: 'Tomás Reyes', username: 'tomasreyes.film',
      avatar: null, initials: 'TR', category: 'audiovisual', categoryLabel: 'Audiovisual',
    },
    content: 'Cortometraje documental listo. 8 meses de grabación en las comunas de Medellín. Pronto en festivales 🎬',
    likes: 302, comments: 44, inspirations: 91, createdAt: '2d',
  },
  {
    id: 'p7',
    author: {
      id: 'u7', name: 'Ana Cardona', username: 'anacardona.design',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop',
      initials: 'AC', category: 'diseno', categoryLabel: 'Diseño',
    },
    content: 'Nuevo branding terminado para una empresa local 🎨 Me encanta cuando el cliente confía en el proceso creativo desde el inicio.',
    images: ['https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&auto=format&fit=crop'],
    likes: 94, comments: 7, inspirations: 29, createdAt: '2d',
  },
  {
    id: 'p8',
    author: {
      id: 'u8', name: 'Julián Betancur', username: 'julianbetancur.teatro',
      avatar: null, initials: 'JB', category: 'artes-escenicas', categoryLabel: 'Escénicas', verified: true,
    },
    content: 'La obra "Voces del Barrio" se presenta este mes en el Centro Cultural. Gracias a todos por el apoyo 🙏 Entradas desde $15.000.',
    likes: 256, comments: 38, inspirations: 43, createdAt: '3d',
  },
];
