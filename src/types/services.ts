// src/types/services.ts
// Tipos para servicios de artistas

export interface Service {
  id: string;
  name: string;
  description?: string;
  price?: number;
  price_per_hour?: number;
  price_per_session?: number;
  currency?: string;
  category?: string;
  duration?: number;
  requirements?: string[];
  included?: string[];
  artist_id: string;
  created_at?: string;
  updated_at?: string;
  is_active?: boolean;
}

export interface ServiceCategory {
  id: string;
  name: string;
  description?: string;
}

export interface CreateServiceRequest {
  name: string;
  description?: string;
  price?: number;
  price_per_hour?: number;
  price_per_session?: number;
  currency?: string;
  category?: string;
  duration?: number;
  requirements?: string[];
  included?: string[];
}

export interface UpdateServiceRequest {
  id: string;
  name?: string;
  description?: string;
  price?: number;
  price_per_hour?: number;
  price_per_session?: number;
  currency?: string;
  category?: string;
  duration?: number;
  requirements?: string[];
  included?: string[];
  is_active?: boolean;
}
