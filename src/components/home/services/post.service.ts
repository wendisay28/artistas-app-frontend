// src/components/home/services/post.service.ts
import apiClient from '../../../services/api/config';

export interface Post {
  id: number;
  type: 'post' | 'nota' | 'blog';
  content: string;
  title?: string;
  subtitle?: string;
  excerpt?: string;
  featuredImage?: string;
  category?: string;
  tags?: string[];
  readingTime?: number;
  slug?: string;
  author: {
    id: string;
    name: string;
    username?: string;
    avatar?: string;
    category?: string;
    verified?: boolean;
  };
  media?: Array<{ url: string; type: 'image' | 'video'; altText?: string }>;
  metadata?: { postSubtype?: string; quoteText?: string; quoteAuthor?: string };
  likeCount: number;
  commentCount: number;
  shareCount: number;
  saveCount?: number;
  inspirationCount?: number;
  isLiked?: boolean;
  isSaved?: boolean;
  isPinned?: boolean;
  featured?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreatePostData {
  content: string;
  type: 'post' | 'nota' | 'blog';
  isPublic: boolean;
  category?: string;
  media?: Array<{ url: string; type: 'image' | 'video' }>;
  metadata?: any;
}

// ── Mock data ────────────────────────────────────────────────────────────────

const MOCK_POSTS: Post[] = [
  {
    id: 1,
    type: 'post',
    content: '¡Acabo de terminar mi nueva serie de retratos! 📸 Semanas de trabajo capturando la esencia de la luz natural. Estoy muy emocionado de compartirlo con la comunidad de BuscArt.',
    category: 'photography',
    author: {
      id: '1',
      name: 'Carlos Rodríguez',
      username: 'carlosphoto',
      avatar: 'https://picsum.photos/100/100?random=1',
      category: 'photography',
      verified: true,
    },
    media: [{ url: 'https://picsum.photos/800/600?random=10', type: 'image' }],
    likeCount: 245,
    commentCount: 32,
    shareCount: 18,
    inspirationCount: 67,
    isLiked: false,
    isSaved: false,
    featured: true,
    createdAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    type: 'blog',
    content: 'En este artículo les quiero compartir mis 5 mejores consejos para iluminación en estudios pequeños. Con creatividad se pueden lograr resultados increíbles sin equipo costoso.',
    title: '5 Tips de Iluminación para Estudios Pequeños',
    excerpt: 'Aprende a sacar el máximo provecho de tu espacio con estos consejos prácticos de fotografía.',
    featuredImage: 'https://picsum.photos/800/400?random=20',
    category: 'photography',
    tags: ['tips', 'iluminación', 'estudio'],
    readingTime: 5,
    author: {
      id: '2',
      name: 'María González',
      username: 'mariacrea',
      avatar: 'https://picsum.photos/100/100?random=2',
      category: 'art',
      verified: true,
    },
    likeCount: 189,
    commentCount: 45,
    shareCount: 23,
    inspirationCount: 112,
    isLiked: true,
    isSaved: true,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 3,
    type: 'post',
    content: '¿Alguien más emocionado con el festival de arte urbano este fin de semana? 🏙️ Ya tengo mi cámara lista y no puedo esperar para capturar la energía de la ciudad.',
    category: 'photography',
    author: {
      id: '3',
      name: 'Diego Martínez',
      username: 'diegourbano',
      avatar: 'https://picsum.photos/100/100?random=3',
      category: 'music',
      verified: false,
    },
    media: [
      { url: 'https://picsum.photos/800/600?random=30', type: 'image' },
      { url: 'https://picsum.photos/800/600?random=31', type: 'image' },
    ],
    likeCount: 156,
    commentCount: 28,
    shareCount: 12,
    inspirationCount: 44,
    isLiked: false,
    isSaved: false,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 4,
    type: 'nota',
    content: 'La música es el lenguaje del alma. Cada nota que toco es una conversación con el universo. 🎵',
    category: 'music',
    metadata: {
      postSubtype: 'quote',
      quoteText: 'La música es el lenguaje del alma.',
      quoteAuthor: 'Ana Sofía López',
    },
    author: {
      id: '4',
      name: 'Ana Sofía López',
      username: 'anamusic',
      avatar: 'https://picsum.photos/100/100?random=4',
      category: 'music',
      verified: true,
    },
    likeCount: 312,
    commentCount: 67,
    shareCount: 34,
    inspirationCount: 189,
    isLiked: false,
    isSaved: false,
    featured: true,
    createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 5,
    type: 'post',
    content: 'Nuevo mural terminado en el centro de la ciudad 🎨 Tres semanas de trabajo bajo el sol, pero el resultado habla por sí solo. ¿Qué les parece?',
    category: 'art',
    author: {
      id: '5',
      name: 'Luisa Vargas',
      username: 'luisaarte',
      avatar: 'https://picsum.photos/100/100?random=5',
      category: 'art',
      verified: false,
    },
    media: [
      { url: 'https://picsum.photos/800/600?random=50', type: 'image' },
      { url: 'https://picsum.photos/800/600?random=51', type: 'image' },
      { url: 'https://picsum.photos/800/600?random=52', type: 'image' },
    ],
    likeCount: 423,
    commentCount: 89,
    shareCount: 56,
    inspirationCount: 234,
    isLiked: true,
    isSaved: false,
    createdAt: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
  },
];

// ── Service class ────────────────────────────────────────────────────────────

class PostService {
  async getPosts(
    page = 1,
    limit = 10,
    followingOnly = false,
    category?: string
  ): Promise<{ posts: Post[]; total: number; hasMore: boolean }> {
    try {
      const params: any = { page, limit };
      if (followingOnly) params.followingOnly = true;
      if (category) params.category = category;

      const { data } = await apiClient.get('/posts', { params });
      return {
        posts: data.data ?? [],
        total: data.pagination?.total ?? 0,
        hasMore: data.pagination?.hasMore ?? false,
      };
    } catch {
      if (page === 1) {
        return { posts: MOCK_POSTS, total: MOCK_POSTS.length, hasMore: false };
      }
      return { posts: [], total: 0, hasMore: false };
    }
  }

  async createPost(data: CreatePostData): Promise<Post> {
    const { data: res } = await apiClient.post('/posts', data);
    return res.data;
  }

  async likePost(postId: number): Promise<void> {
    await apiClient.post(`/posts/${postId}/like`);
  }

  async unlikePost(postId: number): Promise<void> {
    await apiClient.delete(`/posts/${postId}/like`);
  }

  async savePost(postId: number): Promise<void> {
    await apiClient.post(`/posts/${postId}/save`);
  }

  async unsavePost(postId: number): Promise<void> {
    await apiClient.delete(`/posts/${postId}/save`);
  }

  async getComments(postId: number, page = 1, limit = 20) {
    const { data } = await apiClient.get(`/posts/${postId}/comments`, {
      params: { page, limit },
    });
    return data;
  }

  async createComment(postId: number, data: { content: string; parentId?: number }) {
    const { data: res } = await apiClient.post(`/posts/${postId}/comments`, data);
    return res.data;
  }
}

export const postService = new PostService();
