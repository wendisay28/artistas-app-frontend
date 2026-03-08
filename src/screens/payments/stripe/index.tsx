// src/screens/payments/stripe/index.tsx
import React from 'react';
import { View } from 'react-native';
import Step1Welcome from './Step1Welcome';
import Step2AccountInfo from './Step2AccountInfo';
import Step3Verification from './Step3Verification';
import StripeDashboard from './dashboard';
import { useStripeOnboarding } from './StripeOnboardingContext';

import { Comprobante } from './dashboard/tabs/FacturasTab';

interface StripeSetupFlowProps {
  onClose?: () => void;
  onSelectComprobante?: (c: Comprobante) => void;
  onNewComprobante?: () => void;
}

const StripeSetupSteps = ({
  onSelectComprobante,
  onNewComprobante,
}: { onSelectComprobante?: (c: Comprobante) => void; onNewComprobante?: () => void }) => {
  const { state } = useStripeOnboarding();

  switch (state.currentStep) {
    case 'welcome':      return <Step1Welcome />;
    case 'account-info': return <Step2AccountInfo />;
    case 'verification': return <Step3Verification />;
    case 'complete':     return <StripeDashboard onSelectComprobante={onSelectComprobante} onNewComprobante={onNewComprobante} />;
    case 'error':        return <Step1Welcome />;
    default:             return <Step1Welcome />;
  }
};

// El Provider real está en StripeSetupScreen.tsx — no duplicar aquí
const StripeSetupFlow = ({ onClose, onSelectComprobante, onNewComprobante }: StripeSetupFlowProps) => (
  <View style={{ flex: 1 }}>
    <StripeSetupSteps onSelectComprobante={onSelectComprobante} onNewComprobante={onNewComprobante} />
  </View>
);

export default StripeSetupFlow;
