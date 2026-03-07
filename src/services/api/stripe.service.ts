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
  connectUrl?: string; // URL para redirigir a Stripe Connect
  status: StripeConnectionStatus['status'];
}

export interface StripeDashboardResponse {
  dashboardUrl: string;
  expiresAt: string;
}

export const stripeService = {
  // Iniciar conexión con Stripe Connect
  async initiateConnect(accountData: StripeAccountData): Promise<StripeConnectResponse> {
    const response = await apiClient.post<StripeConnectResponse>('/stripe/connect', accountData);
    return response.data;
  },

  // Verificar estado de la conexión
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
  }
};
