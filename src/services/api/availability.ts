import { API_BASE_URL, apiClient } from './config';

// Types
export interface AvailabilityRule {
  id: string;
  artistId: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
  slotDurationMinutes: number;
}

export interface BlockedDate {
  id: string;
  artistId: number;
  date: string;
  reason?: string;
  blockType: 'vacation' | 'personal' | 'event' | 'other';
}

export interface ArtistBooking {
  id: string;
  artistId: number;
  clientId: string;
  title: string;
  description?: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  locationType: 'online' | 'client_place' | 'artist_place' | 'venue';
  location?: string;
  city?: string;
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
  price?: string;
  currency: string;
  deposit?: string;
  depositPaid: boolean;
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled' | 'completed' | 'expired';
  clientNotes?: string;
  artistNotes?: string;
  cancellationReason?: string;
  requestedAt: string;
  acceptedAt?: string;
  rejectedAt?: string;
  cancelledAt?: string;
  completedAt?: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AvailabilityResponse {
  artistId: string;
  month: string;
  availability: Record<string, string[]>; // date -> time slots
  rules: Array<{
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    slotDurationMinutes: number;
  }>;
  blockedDates: Array<{
    date: string;
    reason?: string;
    blockType: string;
  }>;
}

export interface CreateBookingRequest {
  artistId: number;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  title: string;
  description?: string;
  clientNotes?: string;
  locationType?: 'online' | 'client_place' | 'artist_place' | 'venue';
  location?: string;
  price?: string;
}

export interface UpdateBookingRequest {
  status: 'accepted' | 'rejected' | 'cancelled' | 'completed';
  artistNotes?: string;
}

// API Functions
export const availabilityApi = {
  // Obtener disponibilidad de un artista para un mes específico
  async getArtistAvailability(artistId: string, month: string): Promise<AvailabilityResponse> {
    const response = await apiClient.get(`/v1/artists/${artistId}/availability?month=${month}`);
    return response.data;
  },

  // Crear una nueva reserva
  async createBooking(booking: CreateBookingRequest, token: string): Promise<{ message: string; booking: ArtistBooking }> {
    const response = await apiClient.post('/v1/bookings', booking);
    return response.data;
  },

  // Actualizar estado de una reserva
  async updateBookingStatus(bookingId: string, update: UpdateBookingRequest, token: string): Promise<{ message: string; booking: ArtistBooking }> {
    const response = await apiClient.patch(`/v1/bookings/${bookingId}`, update);
    return response.data;
  },

  // Obtener reservas del usuario actual
  async getUserBookings(token: string, options?: { status?: string; role?: 'client' | 'artist' }): Promise<{ bookings: (ArtistBooking & { artist?: { id: number; userId: string; name: string } })[] }> {
    const params = new URLSearchParams();
    if (options?.status) params.append('status', options.status);
    if (options?.role) params.append('role', options.role);

    const response = await apiClient.get(`/v1/bookings?${params.toString()}`);
    return response.data;
  },
};
