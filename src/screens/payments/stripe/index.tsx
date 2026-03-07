// src/screens/payments/stripe/index.tsx
import React from 'react';
import { View, ScrollView } from 'react-native';
import Step1Welcome from './Step1Welcome';
import Step2AccountInfo from './Step2AccountInfo';
import Step3Verification from './Step3Verification';
import Step4Complete from './Step4Complete';
import { StripeOnboardingProvider, useStripeOnboarding } from './StripeOnboardingContext';

interface StripeSetupFlowProps {
  onClose?: () => void;
}

// Componente interno que lee el step desde el contexto compartido
const StripeSetupSteps = () => {
  const { state } = useStripeOnboarding();

  switch (state.currentStep) {
    case 'welcome': return <Step1Welcome />;
    case 'account-info': return <Step2AccountInfo />;
    case 'verification': return <Step3Verification />;
    case 'complete': return <Step4Complete />;
    case 'error': return <Step1Welcome /> // Por ahora volvemos al welcome si hay error
    default: return <Step1Welcome />;
  }
};

const StripeSetupFlow = ({ onClose }: StripeSetupFlowProps) => (
  <View style={{ flex: 1 }}>
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <StripeSetupSteps />
    </ScrollView>
  </View>
);

export default StripeSetupFlow;
