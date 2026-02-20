// src/navigation/AppNavigator.tsx
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuthStore } from '../store/authStore';
import { onAuthChange } from '../services/firebase/auth';
import { getMyProfile } from '../services/api/users';
import { AuthStack } from './AuthStack';
import { MainTabNavigator } from './MainTabNavigator';
import { SetupProfileScreen } from '../screens/auth/setup-profile';

// Configuración para web
const linking = {
  prefixes: ['http://localhost:8081', 'https://auth.expo.io/@wendisay29/artistas-app-frontend'],
  config: {
    screens: {
      Auth: 'auth',
      Main: 'main',
    },
  },
};

export const AppNavigator = () => {
  const { isAuthenticated, isProfileComplete, isLoading, setUser, setLoading, logout } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      if (!firebaseUser) {
        logout();
        setLoading(false);
        return;
      }
      try {
        const profile = await getMyProfile();
        setUser(profile);
      } catch {
        setUser({
          id: firebaseUser.uid,
          firebaseUid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || '',
          photoURL: firebaseUser.photoURL || null,
          role: 'client',
          isCompany: false,
          city: null,
          bio: null,
          isProfileComplete: false,
          createdAt: '',
          updatedAt: '',
        });
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (isLoading) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator size="large" color="#7C3AED" />
      </View>
    );
  }

  // Tres ramas: no autenticado → onboarding; autenticado sin perfil completo → setup; perfil completo → app
  const showAuth = !isAuthenticated;
  const showSetupProfile = isAuthenticated && !isProfileComplete;

  return (
    <NavigationContainer linking={linking}>
      {showAuth && <AuthStack />}
      {showSetupProfile && <SetupProfileScreen />}
      {isAuthenticated && isProfileComplete && <MainTabNavigator />}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  splash: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FA' },
});