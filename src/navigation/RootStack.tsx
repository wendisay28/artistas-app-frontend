// src/navigation/RootStack.tsx
// Stack raíz que envuelve las tabs y expone pantallas modales globales
// (ContractDetails, etc.) accesibles desde cualquier parte de la app.

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainTabNavigator } from './MainTabNavigator';
import ContractDetailsScreen from '../screens/contracts/ContractDetailsScreen';
import ChatScreen from '../screens/chat/ChatScreen';

export type RootStackParams = {
  MainTabs: undefined;
  ContractDetails: {
    contractId: string;
    /** URL de checkout de MercadoPago (ya generada al crear el contrato) */
    initPoint?: string;
  };
  Chat: {
    contractId: string;
    contractTitle: string;
    otherUserId: string;
    otherUserName: string;
  };
};

const Stack = createNativeStackNavigator<RootStackParams>();

export function RootStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      <Stack.Screen
        name="ContractDetails"
        component={ContractDetailsScreen}
        options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
      />
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={{ animation: 'slide_from_right' }}
      />
    </Stack.Navigator>
  );
}
