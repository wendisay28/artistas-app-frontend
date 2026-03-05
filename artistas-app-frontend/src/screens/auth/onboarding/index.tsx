// src/screens/auth/onboarding/index.tsx
import React from 'react';
import { View } from 'react-native';
import Step1BasicInfo from './Step1BasicInfo';
import Step2Categories from './Step2Categories';
import Step3Discipline from './Step3Discipline';
import Step4Location from './Step4Location';
import CreatingProfileScreen from './CreatingProfileScreen';
import { OnboardingProvider, useOnboardingContext } from './OnboardingContext';

// Componente interno que lee el step desde el contexto compartido
const OnboardingSteps = () => {
  const { step, isCreatingProfile } = useOnboardingContext();

  // Si está creando el perfil, mostrar pantalla de carga
  if (isCreatingProfile) {
    return <CreatingProfileScreen />;
  }

  switch (step) {
    case 1: return <Step1BasicInfo />;
    case 2: return <Step2Categories />;
    case 3: return <Step3Discipline />;
    case 4: return <Step4Location />;
    default: return <Step1BasicInfo />;
  }
};

const OnboardingScreen = () => (
  <OnboardingProvider>
    <View style={{ flex: 1 }}>
      <OnboardingSteps />
    </View>
  </OnboardingProvider>
);

export default OnboardingScreen;
