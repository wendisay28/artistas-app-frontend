// src/navigation/PaymentsStack.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { StripeSetupScreen } from '../screens/payments/StripeSetupScreen';
import { WalletScreen } from '../screens/payments/WalletScreen';
import NewInvoiceScreen from '../screens/payments/stripe/dashboard/NewInvoiceScreen';

export type PaymentsStackParamList = {
  StripeSetup: undefined;
  Wallet: undefined;
  NewInvoiceScreen: undefined;
};

const Stack = createStackNavigator();

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
    <Stack.Screen 
      name="NewInvoiceScreen" 
      component={NewInvoiceScreen}
      options={{
        title: 'Nueva Factura',
        headerShown: true,
      }}
    />
  </Stack.Navigator>
);
