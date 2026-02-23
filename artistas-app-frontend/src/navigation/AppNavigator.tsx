// src/navigation/AppNavigator.tsx
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuthStore } from '../store/authStore';
import { onAuthChange } from '../services/firebase/auth';
import { getMyProfile } from '../services/api/users';
import { AuthStack } from './AuthStack';
import { MainTabNavigator } from './MainTabNavigator';
import OnboardingScreen from '../screens/auth/onboarding';
import { SplashScreen } from '../screens/auth/splash';
import { ModalContainer } from '../components/ModalContainer';

const linking = {
  prefixes: ['http://localhost:8081'],
  config: {
    screens: {
      Auth: 'auth',
      Main: 'main',
    },
  },
};

export const AppNavigator = () => {
  const { isAuthenticated, isProfileComplete, isLoading, user, setUser, setLoading, logout } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      if (!firebaseUser) {
        logout();
        setLoading(false);
        return;
      }

      // Si el perfil ya está completo en el store, no re-sincronizar
      // (evita resetear isProfileComplete cuando Firebase refresca el token)
      const { isProfileComplete: alreadyComplete } = useAuthStore.getState();
      if (alreadyComplete) {
        setLoading(false);
        return;
      }

      // Si el usuario es artista y no tiene perfil completo, no intentar verificar BD
      // Dejar que el onboarding cree el perfil desde cero
      const { user: currentUser } = useAuthStore.getState();
      if (currentUser?.role === 'artist' && !currentUser?.isProfileComplete) {
        console.log('🎨 Artista necesita onboarding, omitiendo verificación de BD');
        setLoading(false);
        return;
      }

      try {
        const profile = await getMyProfile();
        setUser(profile);
      } catch (error) {
        console.log('🔄 Usuario no encontrado en BD, necesita onboarding');
        // No es error, es usuario nuevo que necesita onboarding
        // Solo establecer fallback si no hay usuario ya en el store
        const { user: existingUser, pendingRole } = useAuthStore.getState();
        if (!existingUser) {
          setUser({
            id: firebaseUser.uid,
            firebaseUid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || '',
            username: '', // Campo requerido, vacío inicialmente
            photoURL: firebaseUser.photoURL || null,
            role: (pendingRole as any) || 'client',
            isCompany: false,
            city: null,
            bio: null,
            isProfileComplete: false,
            createdAt: '',
            updatedAt: '',
          });
        }
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Splash mientras Firebase resuelve el estado inicial
  if (isLoading) {
    return <SplashScreen />;
  }

  // Artista autenticado sin perfil → onboarding
  // IMPORTANTE: Solo mostrar onboarding si el usuario no existe en BD o no tiene perfil completo
  const showSetupProfile = isAuthenticated && user?.role === 'artist' && !isProfileComplete;

  return (
    <>
      <NavigationContainer linking={linking}>
        {!isAuthenticated && <AuthStack />}
        {showSetupProfile && <OnboardingScreen />}
        {isAuthenticated && (isProfileComplete || user?.role === 'client') && !showSetupProfile && (
          <MainTabNavigator />
        )}
      </NavigationContainer>
      
      {/* ModalContainer fuera del NavigationContainer */}
      <ModalContainer />
    </>
  );
};
