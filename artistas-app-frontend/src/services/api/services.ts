// src/services/api/services.ts
import { apiClient } from './config';
import { API_ENDPOINTS } from './endpoints';

export interface Service {
  id?: number;
  userId?: string;
  name: string;
  description?: string;
  price?: number;
  duration?: string;
  category?: string;
  images?: string[];
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const servicesService = {
  // Obtener servicios del usuario autenticado
  getMyServices: async (): Promise<Service[]> => {
    const response = await apiClient.get(API_ENDPOINTS.SERVICES.ME);
    return response.data.data;
  },

  // Obtener servicios de un usuario específico
  getUserServices: async (userId: string): Promise<Service[]> => {
    const response = await apiClient.get(API_ENDPOINTS.SERVICES.USER(userId));
    return response.data.data;
  },

  // Obtener un servicio por ID
  getServiceById: async (id: number): Promise<Service> => {
    const response = await apiClient.get(API_ENDPOINTS.SERVICES.DETAIL(id));
    return response.data.data;
  },

  // Crear un nuevo servicio
  createService: async (service: Omit<Service, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Service> => {
    const response = await apiClient.post(API_ENDPOINTS.SERVICES.CREATE, service);
    return response.data.data;
  },

  // Actualizar un servicio existente
  updateService: async (id: number, service: Partial<Service>): Promise<Service> => {
    const response = await apiClient.patch(API_ENDPOINTS.SERVICES.UPDATE(id), service);
    return response.data.data;
  },

  // Eliminar un servicio
  deleteService: async (id: number): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.SERVICES.DELETE(id));
  },
};
