// src/screens/payments/stripe/StripeOnboardingContext.tsx
import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { StripeConnectionStatus, StripeAccountData } from '../../../services/api/stripe.service';

export type StripeSetupStep = 'welcome' | 'account-info' | 'verification' | 'complete' | 'error';

interface StripeSetupState {
  currentStep: StripeSetupStep;
  connectionStatus: StripeConnectionStatus;
  isLoading: boolean;
  accountData: Partial<StripeAccountData>;
  connectUrl?: string;
  error?: string;
}

type StripeSetupAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_STEP'; payload: StripeSetupStep }
  | { type: 'SET_CONNECTION_STATUS'; payload: StripeConnectionStatus }
  | { type: 'UPDATE_ACCOUNT_DATA'; payload: Partial<StripeAccountData> }
  | { type: 'SET_CONNECT_URL'; payload: string }
  | { type: 'SET_ERROR'; payload?: string }
  | { type: 'RESET' };

const initialState: StripeSetupState = {
  currentStep: 'welcome',
  connectionStatus: { status: 'disconnected', chargesEnabled: false, payoutsEnabled: false },
  isLoading: false,
  accountData: {},
};

function stripeSetupReducer(state: StripeSetupState, action: StripeSetupAction): StripeSetupState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_STEP':
      return { ...state, currentStep: action.payload };
    case 'SET_CONNECTION_STATUS':
      return { ...state, connectionStatus: action.payload };
    case 'UPDATE_ACCOUNT_DATA':
      return { ...state, accountData: { ...state.accountData, ...action.payload } };
    case 'SET_CONNECT_URL':
      return { ...state, connectUrl: action.payload };
    case 'SET_ERROR':
      return { ...state, currentStep: 'error', error: action.payload };
    case 'RESET':
      return { ...initialState };
    default:
      return state;
  }
}

const StripeOnboardingContext = createContext<{
  state: StripeSetupState;
  dispatch: React.Dispatch<StripeSetupAction>;
  goNextStep: () => void;
  goPrevStep: () => void;
  setStep: (step: StripeSetupStep) => void;
  updateAccountData: (data: Partial<StripeAccountData>) => void;
  updateConnectionStatus: (status: StripeConnectionStatus) => void;
  setLoading: (loading: boolean) => void;
  setError: (error?: string) => void;
} | null>(null);

export function StripeOnboardingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(stripeSetupReducer, initialState);

  const goNextStep = () => {
    const steps: StripeSetupStep[] = ['welcome', 'account-info', 'verification', 'complete'];
    const currentIndex = steps.indexOf(state.currentStep);
    if (currentIndex < steps.length - 1) {
      dispatch({ type: 'SET_STEP', payload: steps[currentIndex + 1] });
    }
  };

  const goPrevStep = () => {
    const steps: StripeSetupStep[] = ['welcome', 'account-info', 'verification', 'complete'];
    const currentIndex = steps.indexOf(state.currentStep);
    if (currentIndex > 0) {
      dispatch({ type: 'SET_STEP', payload: steps[currentIndex - 1] });
    }
  };

  const setStep = (step: StripeSetupStep) => {
    dispatch({ type: 'SET_STEP', payload: step });
  };

  const updateAccountData = (data: Partial<StripeAccountData>) => {
    dispatch({ type: 'UPDATE_ACCOUNT_DATA', payload: data });
  };

  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const updateConnectionStatus = (status: StripeConnectionStatus) => {
    dispatch({ type: 'SET_CONNECTION_STATUS', payload: status });
  };

  const setError = (error?: string) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  return (
    <StripeOnboardingContext.Provider
      value={{
        state,
        dispatch,
        goNextStep,
        goPrevStep,
        setStep,
        updateAccountData,
        updateConnectionStatus,
        setLoading,
        setError,
      }}
    >
      {children}
    </StripeOnboardingContext.Provider>
  );
}

export function useStripeOnboarding() {
  const context = useContext(StripeOnboardingContext);
  if (!context) {
    throw new Error('useStripeOnboarding must be used within StripeOnboardingProvider');
  }
  return context;
}
