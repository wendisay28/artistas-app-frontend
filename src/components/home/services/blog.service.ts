// src/services/blog.service.ts
import axios from 'axios';

const API_URL = 'https://api.buscart.com';

export interface BlogPost {
  id: number;
  title: string;
  subtitle?: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  category?: string;
  tags?: string[];
  readingTime?: number;
  slug: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  likeCount: number;
  commentCount: number;
  shareCount: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt?: string;
}

class BlogService {
  private getAuthToken(): string | null {
    return null;
  }

  private getHeaders() {
    const token = this.getAuthToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // Get all blog posts
  async getAllPosts(params?: {
    page?: number;
    limit?: number;
    category?: string;
    tag?: string;
  }): Promise<{
    data: BlogPost[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      hasMore: boolean;
    };
  }> {
    try {
      const queryParams = new URLSearchParams({
        page: (params?.page || 1).toString(),
        limit: (params?.limit || 10).toString(),
        ...(params?.category && { category: params.category }),
        ...(params?.tag && { tag: params.tag }),
      });

      const response = await axios.get(`${API_URL}/blog?${queryParams}`, {
        headers: this.getHeaders(),
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      throw error;
    }
  }

  // Get single blog post
  async getPostById(postId: number): Promise<BlogPost> {
    try {
      const response = await axios.get(`${API_URL}/blog/${postId}`, {
        headers: this.getHeaders(),
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching blog post:', error);
      throw error;
    }
  }

  // Get blog post by slug
  async getPostBySlug(slug: string): Promise<BlogPost> {
    try {
      const response = await axios.get(`${API_URL}/blog/slug/${slug}`, {
        headers: this.getHeaders(),
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching blog post by slug:', error);
      throw error;
    }
  }

  // Create blog post
  async createPost(data: {
    title: string;
    subtitle?: string;
    content: string;
    excerpt?: string;
    featuredImage?: string;
    category?: string;
    tags?: string[];
  }): Promise<BlogPost> {
    try {
      const response = await axios.post(`${API_URL}/blog`, data, {
        headers: this.getHeaders(),
      });
      return response.data.data;
    } catch (error) {
      console.error('Error creating blog post:', error);
      throw error;
    }
  }

  // Update blog post
  async updatePost(postId: number, data: Partial<BlogPost>): Promise<BlogPost> {
    try {
      const response = await axios.put(`${API_URL}/blog/${postId}`, data, {
        headers: this.getHeaders(),
      });
      return response.data.data;
    } catch (error) {
      console.error('Error updating blog post:', error);
      throw error;
    }
  }

  // Delete blog post
  async deletePost(postId: number): Promise<void> {
    try {
      await axios.delete(`${API_URL}/blog/${postId}`, {
        headers: this.getHeaders(),
      });
    } catch (error) {
      console.error('Error deleting blog post:', error);
      throw error;
    }
  }

  // Get featured posts
  async getFeaturedPosts(limit: number = 5): Promise<BlogPost[]> {
    try {
      const response = await axios.get(
        `${API_URL}/blog/featured?limit=${limit}`,
        { headers: this.getHeaders() }
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching featured posts:', error);
      throw error;
    }
  }

  // Search blog posts
  async searchPosts(query: string, page: number = 1, limit: number = 10) {
    try {
      const response = await axios.get(
        `${API_URL}/blog/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error searching blog posts:', error);
      throw error;
    }
  }
}

export const blogService = new BlogService();