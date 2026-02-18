// src/navigation/AppNavigator.tsx
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuthStore } from '../store/authStore';
import { onAuthChange } from '../services/firebase/auth';
import { getMyProfile } from '../services/api/users';
import { AuthStack } from './AuthStack';
import { MainTabNavigator } from './MainTabNavigator';

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
    // Listener de Firebase — sincroniza sesión persistida
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      if (!firebaseUser) {
        logout();
        setLoading(false);
        return;
      }
      // TODO: reconectar con backend cuando esté listo
      // try {
      //   const profile = await getMyProfile();
      //   setUser(profile);
      // } catch {
      //   logout();
      // }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (isLoading) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator size="large" color="#6C5CE7" />
      </View>
    );
  }

  return (
    <NavigationContainer linking={linking}>
      {isAuthenticated ? <MainTabNavigator /> : <AuthStack />}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  splash: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FA' },
});