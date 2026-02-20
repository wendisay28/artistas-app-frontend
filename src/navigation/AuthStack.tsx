// src/navigation/AuthStack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '../store/authStore';
import { LoginScreen } from '../screens/auth/login';
import { SetupProfileScreen } from '../screens/auth/setup-profile';
import { WelcomeScreen } from '../screens/auth/onboarding/WelcomeScreen';
import { LocationScreen } from '../screens/auth/onboarding/LocationScreen';
import { ArtistFormScreen } from '../screens/auth/onboarding/ArtistFormScreen';
import ExploreScreen from '../screens/explore';

export type AuthStackParams = {
  Welcome: undefined;
  Login: undefined;
  Location: { userType: 'client' | 'artist' };
  Explore: undefined;
  ArtistForm: undefined;
  SetupProfile: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParams>();

export const AuthStack = () => {
  const getInitialRoute = (): keyof AuthStackParams => 'Welcome';

  return (
    <Stack.Navigator
      initialRouteName={getInitialRoute()}
      screenOptions={{ headerShown: false, animation: 'fade' }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Location" component={LocationScreen} />
      <Stack.Screen name="Explore" component={ExploreScreen} />
      <Stack.Screen name="ArtistForm" component={ArtistFormScreen} />
      <Stack.Screen name="SetupProfile" component={SetupProfileScreen} />
    </Stack.Navigator>
  );
};