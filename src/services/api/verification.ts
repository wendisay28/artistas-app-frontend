// src/services/api/verification.ts
// Servicio de API para verificación de artistas

import apiClient from './config';

export interface VerificationStatus {
  verified: boolean;
  verification_status: 'none' | 'pending' | 'approved' | 'rejected';
  verification_documents?: any;
  verification_submitted_at?: string;
  verification_reviewed_at?: string;
  verification_notes?: string;
  email: string;
  user_name: string;
}

export interface VerificationRequest {
  documents: {
    id_card?: string;
    portfolio?: string;
    social_media?: string;
    additional?: string[];
  };
  notes?: string;
}

export interface PendingVerification {
  artist_id: string;
  verification_status: string;
  verification_submitted_at: string;
  verification_documents: any;
  verification_notes?: string;
  user_name: string;
  email: string;
  phone?: string;
  artist_name: string;
  category?: string;
  specialty?: string;
}

export const verificationService = {
  // Obtener estado de verificación
  async getVerificationStatus(artistId: string): Promise<VerificationStatus> {
    const response = await apiClient.get(`/verification/artists/${artistId}/verification`);
    return response.data.data;
  },

  // Enviar solicitud de verificación
  async submitVerification(artistId: string, data: VerificationRequest): Promise<void> {
    await apiClient.post(`/verification/artists/${artistId}/verification/submit`, data);
  },

  // Obtener solicitudes pendientes (solo admin)
  async getPendingVerifications(): Promise<PendingVerification[]> {
    const response = await apiClient.get('/verification/admin/verifications/pending');
    return response.data.data;
  },

  // Aprobar verificación (solo admin)
  async approveVerification(artistId: string, adminNotes?: string): Promise<void> {
    await apiClient.post(`/verification/admin/verifications/${artistId}/approve`, {
      adminNotes
    });
  },

  // Rechazar verificación (solo admin)
  async rejectVerification(artistId: string, rejectionReason: string, adminNotes?: string): Promise<void> {
    await apiClient.post(`/verification/admin/verifications/${artistId}/reject`, {
      rejectionReason,
      adminNotes
    });
  }
};
