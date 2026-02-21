// src/navigation/AuthStack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from '../screens/auth/login';
import { WelcomeScreen } from '../screens/auth/onboarding/WelcomeScreen';
import { LocationScreen } from '../screens/auth/onboarding/LocationScreen';
import { ClientExploreHome } from '../screens/client/ExploreHome';

export type AuthStackParams = {
  Welcome: undefined;
  Login: undefined;
  Location: { userType: 'client' | 'artist' };
  ClientHome: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParams>();

export const AuthStack = () => {
  return (
    <Stack.Navigator
      id="AuthStack"
      initialRouteName="Welcome"
      screenOptions={{ headerShown: false, animation: 'fade' }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Location" component={LocationScreen} />
      <Stack.Screen name="ClientHome" component={ClientExploreHome} />
    </Stack.Navigator>
  );
};
