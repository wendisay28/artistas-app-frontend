// src/services/api/contracts.ts
import apiClient from './config';

export const contractsService = {
  // Crear nueva contratación
  async createContract(data: {
    artistId: string;
    serviceId?: number;
    serviceType: string;
    serviceName: string;
    description?: string;
    amount?: number;
    serviceDate?: string;
    metadata?: Record<string, any>;
  }) {
    const response = await apiClient.post('/v1/contracts', data);
    return response.data;
  },

  // Obtener contratos del usuario (como cliente o artista)
  async getUserContracts(type?: 'client' | 'artist') {
    const response = await apiClient.get('/v1/contracts', { params: { type } });
    return response.data;
  },

  // Obtener contrato por ID
  async getContractById(id: string | number) {
    const response = await apiClient.get(`/v1/contracts/${id}`);
    return response.data;
  },

  // Actualizar estado del contrato
  async updateContractStatus(id: string | number, status: string, data?: any) {
    const response = await apiClient.put(`/v1/contracts/${id}/status`, { status, ...data });
    return response.data;
  },

  // Crear preferencia de MercadoPago para un contrato
  async createMPPreference(contractId: number | string, title: string, amount: number, description?: string) {
    const response = await apiClient.post('/v1/payments/mp/preference', {
      contractId,
      title,
      amount,
      description,
    });
    return response.data as {
      success: boolean;
      data: {
        preferenceId: string;
        initPoint: string;
        sandboxInitPoint: string;
      };
    };
  },

  // Obtener historial de pagos de un contrato
  async getPaymentStatus(contractId: string | number) {
    const response = await apiClient.get(`/v1/payments/contract/${contractId}`);
    return response.data;
  },
};
