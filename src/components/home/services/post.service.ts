// src/services/post.service.ts
import axios from 'axios';

const API_URL = 'https://api.buscart.com'; // Reemplaza con tu URL real

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
  media?: Array<{
    url: string;
    type: 'image' | 'video';
    altText?: string;
  }>;
  metadata?: {
    postSubtype?: string;
    quoteText?: string;
    quoteAuthor?: string;
  };
  likeCount: number;
  commentCount: number;
  shareCount: number;
  saveCount?: number;
  inspirationCount?: number;
  isLiked?: boolean;
  isPinned?: boolean;
  featured?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreatePostData {
  content: string;
  type: 'post' | 'nota' | 'blog';
  isPublic: boolean;
  media?: Array<{
    url: string;
    type: 'image' | 'video';
    file?: File;
  }>;
  metadata?: any;
}

class PostService {
  private getAuthToken(): string | null {
    // Implementa tu lógica de autenticación
    // Por ejemplo, usando AsyncStorage en React Native
    return null;
  }

  private getHeaders() {
    const token = this.getAuthToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // Get posts with filters
  async getPosts(
    userId?: string,
    page: number = 1,
    limit: number = 10,
    followingOnly: boolean = false,
    category?: string
  ): Promise<{ posts: Post[]; total: number; hasMore: boolean }> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(userId && { userId }),
        ...(followingOnly && { followingOnly: 'true' }),
        ...(category && { category }),
      });

      const response = await axios.get(`${API_URL}/posts?${params}`, {
        headers: this.getHeaders(),
      });

      return {
        posts: response.data.data || [],
        total: response.data.pagination?.total || 0,
        hasMore: response.data.pagination?.hasMore || false,
      };
    } catch (error) {
      console.error('Error fetching posts:', error);
      
      // DATOS MOCK PARA VISUALIZACIÓN - Eliminar en producción
      if (page === 1) {
        const mockPosts: Post[] = [
          {
            id: 1,
            type: 'post',
            content: '¡Acabo de terminar mi nueva serie de retratos! 📸 Estoy muy emocionado de compartir con ustedes este proyecto que me ha tomado semanas de trabajo. La luz natural fue mi mejor aliada en esta sesión.',
            title: 'Nueva serie de retratos',
            featuredImage: 'https://picsum.photos/400/300?random=1',
            category: 'photography',
            tags: ['retratos', 'fotografía', 'luz natural'],
            readingTime: 3,
            author: {
              id: '1',
              name: 'Carlos Rodríguez',
              username: 'carlosphoto',
              avatar: 'https://picsum.photos/100/100?random=1',
              category: 'Fotografía',
              verified: true,
            },
            media: [
              {
                url: 'https://picsum.photos/400/300?random=1',
                type: 'image',
                altText: 'Retrato artístico'
              }
            ],
            likeCount: 245,
            commentCount: 32,
            shareCount: 18,
            isLiked: false,
            featured: true,
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: 2,
            type: 'blog',
            content: 'En este artículo les quiero compartir mis 5 mejores consejos para iluminación en estudios pequeños. Muchos creen que necesitan equipo costoso, pero la realidad es que con creatividad se pueden lograr resultados increíbles...',
            title: '5 Tips de Iluminación para Estudios Pequeños',
            excerpt: 'Aprende a sacar el máximo provecho de tu espacio con estos consejos prácticos.',
            featuredImage: 'https://picsum.photos/400/300?random=2',
            category: 'photography',
            tags: ['tips', 'iluminación', 'estudio'],
            readingTime: 5,
            author: {
              id: '2',
              name: 'María González',
              username: 'mariacrea',
              avatar: 'https://picsum.photos/100/100?random=2',
              category: 'Fotografía',
              verified: true,
            },
            likeCount: 189,
            commentCount: 45,
            shareCount: 23,
            isLiked: true,
            createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: 3,
            type: 'post',
            content: '¿Alguien más emocionado con el nuevo evento de fotografía urbana? 🏙️ Ya tengo mi cámara lista y no puedo esperar para capturar la esencia de la ciudad esta noche.',
            title: 'Preparados para la noche fotográfica',
            featuredImage: 'https://picsum.photos/400/300?random=3',
            category: 'photography',
            tags: ['fotografía urbana', 'noche', 'evento'],
            author: {
              id: '3',
              name: 'Diego Martínez',
              username: 'diegourbano',
              avatar: 'https://picsum.photos/100/100?random=3',
              category: 'Fotografía',
              verified: false,
            },
            media: [
              {
                url: 'https://picsum.photos/400/300?random=3',
                type: 'image',
                altText: 'Ciudad de noche'
              }
            ],
            likeCount: 156,
            commentCount: 28,
            shareCount: 12,
            isLiked: false,
            createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: 4,
            type: 'nota',
            content: 'Recordatorio importante: Mañana sesión de estudio a las 10am. Traer reflectores y fondos adicionales. 📝️',
            title: 'Recordatorio de Sesión',
            category: 'photography',
            tags: ['recordatorio', 'sesión', 'estudio'],
            author: {
              id: '1',
              name: 'Carlos Rodríguez',
              username: 'carlosphoto',
              avatar: 'https://picsum.photos/100/100?random=1',
              category: 'Fotografía',
              verified: true,
            },
            likeCount: 23,
            commentCount: 5,
            shareCount: 2,
            isLiked: true,
            createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: 5,
            type: 'blog',
            content: 'La composición es uno de los elementos más importantes en la fotografía. Hoy quiero hablar sobre la regla de los tercios y cómo podemos aplicarla de manera creativa...',
            title: 'Dominando la Regla de los Tercios',
            excerpt: 'Un enfoque práctico para mejorar tus composiciones fotográficas.',
            featuredImage: 'https://picsum.photos/400/300?random=4',
            category: 'photography',
            tags: ['composición', 'regla de tercios', 'técnicas'],
            readingTime: 7,
            author: {
              id: '4',
              name: 'Ana Sofía López',
              username: 'anacompo',
              avatar: 'https://picsum.photos/100/100?random=4',
              category: 'Fotografía',
              verified: true,
            },
            likeCount: 312,
            commentCount: 67,
            shareCount: 34,
            isLiked: false,
            featured: true,
            createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
          }
        ];

        return {
          posts: mockPosts,
          total: mockPosts.length,
          hasMore: false,
        };
      }
      
      throw error;
    }
  }

  // Get single post by ID
  async getPostById(postId: number): Promise<Post> {
    try {
      const response = await axios.get(`${API_URL}/posts/${postId}`, {
        headers: this.getHeaders(),
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching post:', error);
      throw error;
    }
  }

  // Create new post
  async createPost(data: CreatePostData): Promise<Post> {
    try {
      const formData = new FormData();
      formData.append('content', data.content);
      formData.append('type', data.type);
      formData.append('isPublic', String(data.isPublic));

      if (data.metadata) {
        formData.append('metadata', JSON.stringify(data.metadata));
      }

      if (data.media && data.media.length > 0) {
        data.media.forEach((media, index) => {
          if (media.file) {
            formData.append('media', media.file as any);
          }
        });
      }

      const response = await axios.post(`${API_URL}/posts`, formData, {
        headers: {
          ...this.getHeaders(),
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data.data;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  }

  // Update post
  async updatePost(postId: number, data: Partial<CreatePostData>): Promise<Post> {
    try {
      const response = await axios.put(`${API_URL}/posts/${postId}`, data, {
        headers: this.getHeaders(),
      });
      return response.data.data;
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  }

  // Delete post
  async deletePost(postId: number): Promise<void> {
    try {
      await axios.delete(`${API_URL}/posts/${postId}`, {
        headers: this.getHeaders(),
      });
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  }

  // Like post
  async likePost(postId: number): Promise<void> {
    try {
      await axios.post(`${API_URL}/posts/${postId}/like`, {}, {
        headers: this.getHeaders(),
      });
    } catch (error) {
      console.error('Error liking post:', error);
      throw error;
    }
  }

  // Unlike post
  async unlikePost(postId: number): Promise<void> {
    try {
      await axios.delete(`${API_URL}/posts/${postId}/like`, {
        headers: this.getHeaders(),
      });
    } catch (error) {
      console.error('Error unliking post:', error);
      throw error;
    }
  }

  // Share post
  async sharePost(postId: number, content?: string): Promise<Post> {
    try {
      const response = await axios.post(
        `${API_URL}/posts/${postId}/share`,
        { content },
        { headers: this.getHeaders() }
      );
      return response.data.data;
    } catch (error) {
      console.error('Error sharing post:', error);
      throw error;
    }
  }

  // Get comments
  async getComments(postId: number, page: number = 1, limit: number = 20) {
    try {
      const response = await axios.get(
        `${API_URL}/posts/${postId}/comments?page=${page}&limit=${limit}`,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  }

  // Create comment
  async createComment(postId: number, data: {
    content: string;
    parentId?: number;
    images?: any[];
    mentions?: string[];
  }) {
    try {
      const response = await axios.post(
        `${API_URL}/posts/${postId}/comments`,
        data,
        { headers: this.getHeaders() }
      );
      return response.data.data;
    } catch (error) {
      console.error('Error creating comment:', error);
      throw error;
    }
  }

  // Delete comment
  async deleteComment(postId: number, commentId: number): Promise<void> {
    try {
      await axios.delete(`${API_URL}/posts/${postId}/comments/${commentId}`, {
        headers: this.getHeaders(),
      });
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  }
}

export const postService = new PostService();