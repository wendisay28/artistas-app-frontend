// src/services/artists.service.ts
import axios from 'axios';

const API_URL = 'https://api.buscart.com';

export interface Artist {
  userId: string;
  name: string;
  username?: string;
  profileImageUrl?: string;
  profession?: string;
  category?: string;
  bio?: string;
  verified?: boolean;
  followersCount?: number;
  followingCount?: number;
  postsCount?: number;
  location?: string;
  website?: string;
  socialLinks?: {
    instagram?: string;
    twitter?: string;
    youtube?: string;
    spotify?: string;
  };
}

class ArtistsService {
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

  // Search artists
  async searchArtists(query: string, limit: number = 10): Promise<Artist[]> {
    try {
      const response = await axios.get(
        `${API_URL}/artists/search?q=${encodeURIComponent(query)}&limit=${limit}`,
        { headers: this.getHeaders() }
      );
      return response.data.data || [];
    } catch (error) {
      console.error('Error searching artists:', error);
      return [];
    }
  }

  // Get artist by ID
  async getArtistById(userId: string): Promise<Artist> {
    try {
      const response = await axios.get(`${API_URL}/artists/${userId}`, {
        headers: this.getHeaders(),
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching artist:', error);
      throw error;
    }
  }

  // Get featured artists
  async getFeaturedArtists(limit: number = 10): Promise<Artist[]> {
    try {
      const response = await axios.get(
        `${API_URL}/artists/featured?limit=${limit}`,
        { headers: this.getHeaders() }
      );
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching featured artists:', error);
      return [];
    }
  }

  // Get artists by category
  async getArtistsByCategory(category: string, page: number = 1, limit: number = 20) {
    try {
      const response = await axios.get(
        `${API_URL}/artists/category/${category}?page=${page}&limit=${limit}`,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching artists by category:', error);
      throw error;
    }
  }

  // Follow artist
  async followArtist(userId: string): Promise<void> {
    try {
      await axios.post(`${API_URL}/artists/${userId}/follow`, {}, {
        headers: this.getHeaders(),
      });
    } catch (error) {
      console.error('Error following artist:', error);
      throw error;
    }
  }

  // Unfollow artist
  async unfollowArtist(userId: string): Promise<void> {
    try {
      await axios.delete(`${API_URL}/artists/${userId}/follow`, {
        headers: this.getHeaders(),
      });
    } catch (error) {
      console.error('Error unfollowing artist:', error);
      throw error;
    }
  }
}

export const artistsService = new ArtistsService();