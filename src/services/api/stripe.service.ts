// src/services/api/stripe.service.ts
import { apiClient } from './config';

export interface StripeAccountData {
  holderName: string;
  email: string;
  phone?: string;
  accountType: 'individual' | 'company';
  acceptTerms: boolean;
}

export interface StripeConnectionStatus {
  status: 'disconnected' | 'pending' | 'connected' | 'restricted' | 'error';
  accountId?: string;
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
  requirements?: string[];
  currentDeadline?: string;
}

export interface StripeConnectResponse {
  message: string;
  connectUrl?: string;
  status: StripeConnectionStatus['status'];
}

export interface StripeDashboardResponse {
  dashboardUrl: string;
  expiresAt: string;
}

export interface ComprobantePayload {
  emitter: string;
  emitterNit: string;
  emitterType: string;
  client: string;
  clientNit: string;
  clientEmail?: string;
  clientCity: string;
  description: string;
  amount: number;
  taxRate?: number;
  currency?: string;
  status?: 'borrador' | 'pendiente' | 'completado';
}

export interface ComprobanteRecord extends ComprobantePayload {
  id: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export const stripeService = {
  // Iniciar conexión con Stripe Connect
  async initiateConnect(accountData: StripeAccountData): Promise<StripeConnectResponse> {
    const response = await apiClient.post<StripeConnectResponse>('/stripe/connect', accountData);
    return response.data;
  },

  // Verificar estado real de la conexión (consulta Stripe)
  async getConnectionStatus(): Promise<StripeConnectionStatus> {
    const response = await apiClient.get<StripeConnectionStatus>('/stripe/status');
    return response.data;
  },

  // Obtener enlace del dashboard de Stripe
  async getDashboardLink(): Promise<StripeDashboardResponse> {
    const response = await apiClient.get<StripeDashboardResponse>('/stripe/dashboard-link');
    return response.data;
  },

  // Desconectar cuenta Stripe
  async disconnect(): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>('/stripe/disconnect');
    return response.data;
  },

  // Actualizar información de la cuenta
  async updateAccount(accountData: Partial<StripeAccountData>): Promise<{ message: string }> {
    const response = await apiClient.put<{ message: string }>('/stripe/account', accountData);
    return response.data;
  },

  // Subir documento de verificación
  async uploadDocument(fileUri: string, filename: string, mimeType: string, docType: string): Promise<{ fileId: string }> {
    const formData = new FormData();
    formData.append('file', { uri: fileUri, name: filename, type: mimeType } as any);
    formData.append('docType', docType);
    const response = await apiClient.post<{ fileId: string }>('/stripe/upload-document', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // ── Comprobantes ────────────────────────────────────────────────────────────

  async getComprobantes(): Promise<{ data: ComprobanteRecord[] }> {
    const response = await apiClient.get<{ data: ComprobanteRecord[] }>('/stripe/comprobantes');
    return response.data;
  },

  async createComprobante(payload: ComprobantePayload): Promise<{ data: ComprobanteRecord }> {
    const response = await apiClient.post<{ data: ComprobanteRecord }>('/stripe/comprobantes', payload);
    return response.data;
  },

  async updateComprobanteStatus(id: number, status: 'borrador' | 'pendiente' | 'completado'): Promise<{ data: ComprobanteRecord }> {
    const response = await apiClient.patch<{ data: ComprobanteRecord }>(`/stripe/comprobantes/${id}`, { status });
    return response.data;
  },
};
