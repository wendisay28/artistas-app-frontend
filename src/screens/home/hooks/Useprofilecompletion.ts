// src/screens/home/hooks/useProfileCompletion.ts
// ─── Fuente única de verdad del % de completitud ─────────────────────────────
// 9 pasos que suman exactamente 100.

import { useMemo } from 'react';
import { useAuthStore } from '../../../store/authStore';
import { useProfileStore } from '../../../store/profileStore';

export type ProfileStep = {
  key:       string;
  label:     string;
  weight:    number;  // suman 100
  completed: boolean;
};

export type ProfileCompletion = {
  percentage: number;       // 0–100 (puede llegar a 100 si se completan todos)
  steps:      ProfileStep[];
  isComplete: boolean;
  nextStep:   ProfileStep | null;
};

/** Overrides para los pasos que solo el portal puede completar */
export interface ProfileCompletionOverrides {
  delivery?:  boolean;  // ¿Cómo entrega su arte?
  legal?:     boolean;  // Términos aceptados
  services?:  boolean;  // Tiene al menos un servicio publicado
  portfolio?: boolean;  // Tiene fotos en portafolio
  payment?:   boolean;  // Método de cobro conectado
}

export function useProfileCompletion(
  overrides: ProfileCompletionOverrides = {}
): ProfileCompletion {
  const { user }                           = useAuthStore();
  const { artistData, hasServices, hasPortfolio, savedDeliveryMode, hasLegal, hasPayment } = useProfileStore();

  return useMemo(() => {
    const hasSocialLinks = artistData?.info?.some((i: any) =>
      ['Instagram', 'Twitter', 'YouTube', 'Spotify'].includes(i.label)
    );

    // 10 pasos, pesos calibrados para sumar exactamente 100
    const steps: ProfileStep[] = [
      {
        key: 'avatar', label: 'Foto de perfil', weight: 10,
        completed: !!(user?.photoURL || artistData?.avatar),
      },
      {
        key: 'bio', label: 'Descripción / Bio', weight: 10,
        completed: !!(artistData?.bio?.trim() || artistData?.description?.trim()),
      },
      {
        key: 'category', label: 'Categoría artística', weight: 10,
        completed: !!(artistData?.role || (artistData?.tags?.length ?? 0) > 0 || (artistData as any)?.category),
      },
      {
        key: 'location', label: 'Ciudad', weight: 8,
        completed: !!(user?.city || artistData?.location),
      },
      {
        key: 'social', label: 'Redes sociales', weight: 8,
        completed: !!hasSocialLinks,
      },
      {
        key: 'services', label: 'Servicios ofrecidos', weight: 13,
        completed: overrides.services ?? hasServices,
      },
      {
        key: 'portfolio', label: 'Portafolio de fotos', weight: 13,
        completed: overrides.portfolio ?? hasPortfolio,
      },
      {
        key: 'delivery', label: '¿Cómo entregas tu arte?', weight: 10,
        completed: overrides.delivery ?? (savedDeliveryMode !== null),
      },
      {
        key: 'legal', label: 'Validación y Legal', weight: 10,
        completed: overrides.legal ?? hasLegal,
      },
      {
        key: 'payment', label: 'Método de cobro', weight: 8,
        completed: overrides.payment ?? hasPayment,
      },
    ];

    // Sanity check en dev
    if (__DEV__) {
      const total = steps.reduce((acc, s) => acc + s.weight, 0);
      if (total !== 100) console.warn(`[useProfileCompletion] Pesos suman ${total}, deben sumar 100`);
    }

    const totalWeight = steps.reduce((acc, s) => acc + s.weight, 0);
    const earned      = steps.reduce((acc, s) => acc + (s.completed ? s.weight : 0), 0);
    const percentage  = Math.round((earned / totalWeight) * 100);
    const isComplete  = percentage === 100;
    const nextStep    = steps.find(s => !s.completed) ?? null;

    return { percentage, steps, isComplete, nextStep };
  }, [user, artistData, hasServices, hasPortfolio, savedDeliveryMode, hasLegal, hasPayment, overrides.delivery, overrides.legal, overrides.services, overrides.portfolio, overrides.payment]);
}
