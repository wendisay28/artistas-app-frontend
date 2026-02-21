// src/screens/auth/onboarding/OnboardingContext.tsx
import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { useOnboarding } from './hooks/useOnboarding';

// Contexto para compartir el estado del onboarding entre todos los pasos
const OnboardingContext = createContext<ReturnType<typeof useOnboarding> | null>(null);

export const useOnboardingContext = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboardingContext debe ser usado dentro de OnboardingProvider');
  }
  return context;
};

export const OnboardingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const onboardingState = useOnboarding();
  
  return (
    <OnboardingContext.Provider value={onboardingState}>
      {children}
    </OnboardingContext.Provider>
  );
};
