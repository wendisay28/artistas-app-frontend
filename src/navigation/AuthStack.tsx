// src/navigation/AuthStack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '../store/authStore';
import { LoginScreen } from '../screens/auth/login';
import { SetupProfileScreen } from '../screens/auth/setup-profile';
import { WelcomeScreen } from '../screens/auth/onboarding/WelcomeScreen';
import { LocationScreen } from '../screens/auth/onboarding/LocationScreen';

export type AuthStackParams = {
  Welcome: undefined;
  Login: undefined;
  SetupProfile: undefined;
  Location: { userType: 'client' | 'artist' };
};

const Stack = createNativeStackNavigator<AuthStackParams>();

export const AuthStack = () => {
  const { isAuthenticated, isProfileComplete, user } = useAuthStore();

  // Lógica de navegación inicial
  const getInitialRoute = () => {
    if (isAuthenticated && isProfileComplete) {
      return 'SetupProfile'; // Esto será manejado por el navigator principal
    }
    
    if (isAuthenticated && !isProfileComplete) {
      return 'SetupProfile';
    }
    
    // Si no hay sesión, mostrar WelcomeScreen primero
    return 'Welcome';
  };

  return (
    <Stack.Navigator
      initialRouteName={getInitialRoute()}
      screenOptions={{ headerShown: false, animation: 'fade' }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Location" component={LocationScreen} />
      <Stack.Screen name="SetupProfile" component={SetupProfileScreen} />
    </Stack.Navigator>
  );
};