import { apiClient } from './config';

export interface LegalAcceptanceStatus {
  termsAccepted: boolean;
  privacyAccepted: boolean;
  ageVerified: boolean;
  termsAcceptedAt: string | null;
  allAccepted: boolean;
}

export interface UpdateLegalAcceptanceRequest {
  termsAccepted: boolean;
  privacyAccepted: boolean;
  ageVerified: boolean;
}

export interface UpdateLegalAcceptanceResponse {
  message: string;
  termsAccepted: boolean;
  privacyAccepted: boolean;
  ageVerified: boolean;
  allAccepted: boolean;
  termsAcceptedAt: string | null;
}

export interface UpdateDeliveryModeRequest {
  deliveryMode: 'presencial' | 'digital' | 'hibrido' | null;
}

export interface UpdateDeliveryModeResponse {
  message: string;
  deliveryMode: string | null;
}

export interface ActivateProfileResponse {
  message: string;
  profilePublic: boolean;
  activatedAt: string;
}

export const legalService = {
  // Obtener estado actual de aceptación legal
  async getLegalAcceptanceStatus(): Promise<LegalAcceptanceStatus> {
    const response = await apiClient.get<LegalAcceptanceStatus>('/legal/status');
    return response.data;
  },

  // Actualizar aceptación legal individual
  async updateLegalAcceptance(data: UpdateLegalAcceptanceRequest): Promise<UpdateLegalAcceptanceResponse> {
    const response = await apiClient.put<UpdateLegalAcceptanceResponse>('/legal/acceptance', data);
    return response.data;
  },

  // Aceptar todos los términos de una vez
  async acceptAllTerms(): Promise<UpdateLegalAcceptanceResponse> {
    const response = await apiClient.post<UpdateLegalAcceptanceResponse>('/legal/accept-all');
    return response.data;
  },

  // Actualizar modo de entrega
  async updateDeliveryMode(deliveryMode: UpdateDeliveryModeRequest['deliveryMode']): Promise<UpdateDeliveryModeResponse> {
    const response = await apiClient.put<UpdateDeliveryModeResponse>('/legal/delivery-mode', { deliveryMode });
    return response.data;
  },

  // Activar perfil para hacerlo público
  async activateProfile(): Promise<ActivateProfileResponse> {
    const response = await apiClient.post<ActivateProfileResponse>('/legal/activate-profile');
    return response.data;
  },
};
