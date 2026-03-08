// src/types/contracts.ts
// Tipos para el sistema de contratos y pagos

export type ContractStatus = 
  | 'pending_payment'    // Esperando pago del cliente
  | 'escrow_hold'        // Pagado, servicio pendiente
  | 'in_progress'        // Servicio en progreso
  | 'disputed'           // Disputa activa
  | 'completed'          // Completado y pagado
  | 'cancelled'           // Cancelado
  | 'refunded';          // Reembolsado

export interface Contract {
  id: string;
  clientId: string;
  artistId: string;
  artistName: string;
  clientName: string;
  artistAvatar?: string;
  clientAvatar?: string;
  
  // Detalles del servicio
  serviceTitle: string;
  serviceDescription?: string;
  price: number;
  currency: string;
  commission: number;        // Comisión de la plataforma
  netAmount: number;         // Monto neto para el artista
  
  // Fechas
  eventDate: string;
  eventLocation?: string;
  technicalSpecs?: string;
  createdAt: string;
  updatedAt: string;
  
  // Estado y pagos
  status: ContractStatus;
  paymentId?: string;
  mercadoPagoPreferenceId?: string;
  
  // Entrega
  deliveryDate?: string;
  deliveryEvidence?: any;
  clientConfirmedAt?: string;
  
  // Calificación
  rating?: number;
  review?: string;
  
  // Metadata
  metadata?: Record<string, any>;
}

export interface CreateContractRequest {
  artistId: string;
  serviceTitle: string;
  serviceDescription?: string;
  price: number;
  currency: string;
  eventDate: string;
  eventLocation?: string;
  technicalSpecs?: string;
  metadata?: Record<string, any>;
}

export interface PaymentPreference {
  id: string;
  initPoint: string;         // URL de checkout de Mercado Pago
  sandboxMode?: boolean;
}

export interface DeliveryData {
  deliveryType: 'link' | 'upload' | 'chat';
  downloadLink?: string;
  files?: string[];
  notes?: string;
}

export interface DisputeData {
  reason: string;
  description: string;
  evidence?: string[];
}

export interface ContractFilters {
  status?: ContractStatus;
  type?: 'client' | 'artist';
  dateRange?: {
    start: string;
    end: string;
  };
  search?: string;
}

// Estados para UI
export const CONTRACT_STATUS_LABELS: Record<ContractStatus, string> = {
  pending_payment: 'Esperando pago',
  escrow_hold: 'Pago confirmado',
  in_progress: 'En progreso',
  disputed: 'En disputa',
  completed: 'Completado',
  cancelled: 'Cancelado',
  refunded: 'Reembolsado'
};

export const CONTRACT_STATUS_COLORS: Record<ContractStatus, string> = {
  pending_payment: '#f59e0b',  // ámbar
  escrow_hold: '#3b82f6',      // azul
  in_progress: '#8b5cf6',      // morado
  disputed: '#ef4444',          // rojo
  completed: '#10b981',         // verde
  cancelled: '#6b7280',         // gris
  refunded: '#6b7280'           // gris
};
