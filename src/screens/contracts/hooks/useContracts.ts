// src/screens/contracts/hooks/useContracts.ts
// Conecta la pantalla de contratos con el backend real

import { useState, useEffect, useCallback } from 'react';
import { contractsService } from '../../../services/api/contracts';
import type { ActiveContract, CompletedContract } from '../../../types/hiring';

const INITIAL_MILESTONES = {
  arrival_checked: false,
  departure_checked: false,
  delivery_submitted: false,
  delivery_accepted: false,
  change_requested: false,
  change_request_used: false,
};

// Mapea el contrato del backend al tipo ActiveContract del frontend
function mapToActiveContract(raw: any): ActiveContract {
  return {
    id: String(raw.id),
    title: raw.service_name ?? raw.title ?? 'Contrato sin título',
    description: raw.description ?? '',
    offer_type: raw.offer_type ?? 'hiring',
    budget_min: raw.amount ?? 0,
    budget_max: raw.amount ?? 0,
    location: raw.location ?? '',
    date: raw.service_date ?? raw.created_at,
    category: raw.category ?? '',
    is_urgent: raw.is_urgent ?? false,
    poster_id: raw.client_id ?? raw.poster_id ?? '',
    poster_name: raw.client_name ?? raw.poster_name ?? '',
    created_date: raw.created_at,
    service_type: raw.service_type ?? 'presencial',
    amount: raw.amount ?? 0,
    currency: raw.currency ?? 'COP',
    milestones: raw.milestones ?? { ...INITIAL_MILESTONES },
    service_start: raw.accepted_at ?? raw.created_at,
    deadline: raw.deadline,
  };
}

// Mapea el contrato del backend al tipo CompletedContract del frontend
function mapToCompletedContract(raw: any): CompletedContract {
  return {
    ...mapToActiveContract(raw),
    completed_at: raw.completed_at ?? raw.updated_at,
    payment_status: raw.payment_status ?? 'pending',
    artist_rating: raw.artist_rating,
    client_rating: raw.client_rating,
    review: raw.review,
  };
}

export function useContracts(role: 'artist' | 'client' = 'artist') {
  const [activeContracts, setActiveContracts] = useState<ActiveContract[]>([]);
  const [completedContracts, setCompletedContracts] = useState<CompletedContract[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await contractsService.getUserContracts(role);
      const contracts: any[] = Array.isArray(data) ? data : data?.contracts ?? [];

      const active = contracts
        .filter((c: any) => ['accepted', 'active', 'in_progress'].includes(c.status))
        .map(mapToActiveContract);

      const completed = contracts
        .filter((c: any) => ['completed', 'cancelled', 'disputed'].includes(c.status))
        .map(mapToCompletedContract);

      setActiveContracts(active);
      setCompletedContracts(completed);
    } catch (err: any) {
      console.warn('[useContracts] Error al cargar contratos:', err?.message);
      setError('No se pudieron cargar los contratos.');
    } finally {
      setIsLoading(false);
    }
  }, [role]);

  useEffect(() => {
    load();
  }, [load]);

  const updateContractStatus = useCallback(async (
    id: string,
    status: string,
    extra?: any
  ) => {
    try {
      await contractsService.updateContractStatus(id, status, extra);
      await load(); // refrescar lista tras actualizar
    } catch (err: any) {
      console.warn('[useContracts] Error actualizando contrato:', err?.message);
    }
  }, [load]);

  return {
    activeContracts,
    completedContracts,
    isLoading,
    error,
    refresh: load,
    updateContractStatus,
    setActiveContracts,
    setCompletedContracts,
  };
}
