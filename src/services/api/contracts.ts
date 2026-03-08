// src/services/api/contracts.ts
// Servicio para gestionar contratos y pagos con Mercado Pago

import { apiClient } from './index';
import type { Contract, ContractStatus, CreateContractRequest } from '../../../types/contracts';

export const contractsService = {
  // Crear un nuevo contrato (contratación inmediata)
  async createContract(data: CreateContractRequest) {
    const response = await apiClient.post('/api/contracts/create', data);
    return response.data;
  },

  // Obtener contratos del usuario actual
  async getUserContracts(type?: 'client' | 'artist') {
    const response = await apiClient.get('/api/contracts', {
      params: { type }
    });
    return response.data;
  },

  // Obtener detalles de un contrato específico
  async getContractById(id: string) {
    const response = await apiClient.get(`/api/contracts/${id}`);
    return response.data;
  },

  // Actualizar estado del contrato
  async updateContractStatus(id: string, status: ContractStatus, evidence?: any) {
    const response = await apiClient.patch(`/api/contracts/${id}/status`, {
      status,
      evidence
    });
    return response.data;
  },

  // Confirmar entrega del servicio (artista)
  async markAsDelivered(id: string, deliveryData: any) {
    const response = await apiClient.post(`/api/contracts/${id}/deliver`, deliveryData);
    return response.data;
  },

  // Confirmar recepción (cliente)
  async confirmReceipt(id: string, rating?: number, review?: string) {
    const response = await apiClient.post(`/api/contracts/${id}/confirm`, {
      rating,
      review
    });
    return response.data;
  },

  // Iniciar disputa
  async startDispute(id: string, reason: string, description: string) {
    const response = await apiClient.post(`/api/contracts/${id}/dispute`, {
      reason,
      description
    });
    return response.data;
  },

  // Obtener preferencia de pago de Mercado Pago
  async getPaymentPreference(contractId: string) {
    const response = await apiClient.get(`/api/contracts/${contractId}/payment`);
    return response.data;
  },

  // Verificar estado del pago con Mercado Pago
  async checkPaymentStatus(paymentId: string) {
    const response = await apiClient.get(`/api/payments/${paymentId}/status`);
    return response.data;
  }
};
