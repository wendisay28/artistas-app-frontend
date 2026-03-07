// src/navigation/PaymentsStack.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { StripeSetupScreen } from '../screens/payments/StripeSetupScreen';
import { WalletScreen } from '../screens/payments/WalletScreen';

export type PaymentsStackParamList = {
  StripeSetup: undefined;
  Wallet: undefined;
};

const Stack = createStackNavigator<PaymentsStackParamList>();

export const PaymentsStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      gestureEnabled: true,
      cardStyle: { backgroundColor: '#FFFFFF' },
    }}
  >
    <Stack.Screen 
      name="StripeSetup" 
      component={StripeSetupScreen}
      options={{
        title: 'Configuración de Pagos',
      }}
    />
    <Stack.Screen 
      name="Wallet" 
      component={WalletScreen}
      options={{
        title: 'Mi Billetera',
      }}
    />
  </Stack.Navigator>
);
