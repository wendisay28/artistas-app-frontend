// src/services/api/events.ts
// Servicio para gestionar eventos de artistas
import { apiClient } from './config';
import { API_ENDPOINTS } from './endpoints';

export interface Event {
  id?: string;
  userId?: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  price?: number;
  currency?: string;
  capacity?: number;
  attendees?: number;
  category?: string;
  images?: string[];
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface EventResponse {
  events: Event[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export const eventsService = {
  // Obtener eventos del usuario autenticado
  getMyEvents: async (): Promise<Event[]> => {
    const response = await apiClient.get('/events/upcoming');
    return response.data || [];
  },

  // Obtener un evento por ID
  getEventById: async (id: string): Promise<Event> => {
    const response = await apiClient.get(API_ENDPOINTS.EVENTS.DETAIL(id));
    return response.data.data;
  },

  // Crear un nuevo evento
  createEvent: async (event: Omit<Event, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Event> => {
    const response = await apiClient.post(API_ENDPOINTS.EVENTS.LIST, event);
    return response.data.data;
  },

  // Actualizar un evento existente
  updateEvent: async (id: string, event: Partial<Event>): Promise<Event> => {
    const response = await apiClient.patch(API_ENDPOINTS.EVENTS.DETAIL(id), event);
    return response.data.data;
  },

  // Eliminar un evento
  deleteEvent: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.EVENTS.DETAIL(id));
  },
};

export default eventsService;
