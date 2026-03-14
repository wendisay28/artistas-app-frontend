// src/services/api/posts.ts
// Servicio para posts del feed comunitario y sus comentarios

import apiClient from './config';
import { API_ENDPOINTS } from './endpoints';
import type { FeedPost } from '../../screens/home/data/feedData';

export interface Comment {
  id: string;
  author: {
    id: string;
    name: string;
    username: string;
    avatar: string | null;
    initials: string;
  };
  content: string;
  createdAt: string;
  replyTo?: string;
  likes: number;
  liked?: boolean;
}

// ── Posts ─────────────────────────────────────────────────────────────────────

export const postsService = {
  async getList(page = 1, limit = 20): Promise<FeedPost[]> {
    const { data } = await apiClient.get(API_ENDPOINTS.POSTS.LIST, {
      params: { page, limit },
    });
    return data?.posts ?? data ?? [];
  },

  async getDetail(id: string): Promise<FeedPost> {
    const { data } = await apiClient.get(API_ENDPOINTS.POSTS.DETAIL(id));
    return data;
  },

  async create(payload: { content: string; images?: string[]; category?: string }): Promise<FeedPost> {
    const { data } = await apiClient.post(API_ENDPOINTS.POSTS.CREATE, payload);
    return data;
  },

  async toggleLike(id: string): Promise<{ liked: boolean; likes: number }> {
    const { data } = await apiClient.post(API_ENDPOINTS.POSTS.LIKE(id));
    return data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.POSTS.DELETE(id));
  },
};

// ── Comments ──────────────────────────────────────────────────────────────────

export const commentsService = {
  async getByPost(postId: string): Promise<Comment[]> {
    const { data } = await apiClient.get(API_ENDPOINTS.COMMENTS.LIST(postId));
    return data?.comments ?? data ?? [];
  },

  async create(postId: string, content: string, replyTo?: string): Promise<Comment> {
    const { data } = await apiClient.post(API_ENDPOINTS.COMMENTS.CREATE(postId), {
      content,
      ...(replyTo ? { replyTo } : {}),
    });
    return data;
  },

  async toggleLike(id: string): Promise<{ liked: boolean; likes: number }> {
    const { data } = await apiClient.post(API_ENDPOINTS.COMMENTS.LIKE(id));
    return data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.COMMENTS.DELETE(id));
  },
};
