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
        // Solo hacer logout si Zustand tampoco tiene sesión activa.
        // Evita logout prematuro por timing de Firebase en hot-reload.
        const { isAuthenticated: wasAuth } = useAuthStore.getState();
        if (!wasAuth) logout();
        setLoading(false);
        return;
      }

      // Si el perfil ya está completo en el store, no re-sincronizar
      // (evita resetear isProfileComplete cuando Firebase refresque el token)
      const { isProfileComplete: alreadyComplete } = useAuthStore.getState();
      if (alreadyComplete) {
        setLoading(false);
        return;
      }

      // Para usuarios nuevos, intentar sincronizar con backend
      // Si falla, es normal - significa que necesita onboarding
      try {
        console.log('🔄 Intentando sincronizar con backend...');
        const profile = await getMyProfile();
        if (profile) {
          // El backend devuelve campos distintos al tipo UserProfile.
          // Mapeamos para no perder la foto y nombre de Google.
          const raw = profile as any;
          setUser({
            id: raw.id,
            firebaseUid: raw.id,
            email: raw.email || firebaseUser.email || '',
            // Preferir displayName de Google si el backend aún no lo tiene
            displayName:
              raw.displayName ||
              firebaseUser.displayName ||
              [raw.firstName, raw.lastName]
                .filter((s: string) => s && s !== 'Usuario')
                .join(' ')
                .trim() ||
              '',
            username: raw.username || '',
            // El backend lo llama profileImageUrl
            photoURL: raw.photoURL || raw.profileImageUrl || firebaseUser.photoURL || null,
            role: raw.role || (raw.userType === 'artist' ? 'artist' : 'client'),
            isCompany: raw.isCompany || false,
            city: raw.city || null,
            bio: raw.bio || null,
            isProfileComplete: raw.isProfileComplete || raw.onboardingCompleted || false,
            createdAt: raw.createdAt || new Date().toISOString(),
            updatedAt: raw.updatedAt || new Date().toISOString(),
          });
          console.log('✅ Perfil sincronizado:', raw.email);
        }
      } catch (error: any) {
        console.log('🔄 Usuario no encontrado en BD, necesita onboarding - Error:', error?.response?.status || error.message);
        
        // Si es 404, es usuario nuevo - normal
        // Si es otro error, puede ser problema de red o token
        if (error?.response?.status !== 404) {
          console.error('❌ Error inesperado al sincronizar:', error);
          // Para errores diferentes a 404, podríamos querer reintentar
          // pero por ahora, continuamos con onboarding
        }
        
        // Establecer usuario básico desde Firebase para el onboarding
        const { user: existingUser, pendingRole } = useAuthStore.getState();
        if (!existingUser) {
          setUser({
            id: firebaseUser.uid,
            firebaseUid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || firebaseUser.email || '',
            username: '',
            photoURL: firebaseUser.photoURL || null,
            role: (pendingRole as any) || 'client',
            isCompany: false,
            city: null,
            bio: null,
            isProfileComplete: false,
            createdAt: '',
            updatedAt: '',
          });
        } else if (!existingUser.displayName || !existingUser.photoURL) {
          // Hay usuario persistido pero le faltan datos de Google — completar desde Firebase
          const raw = existingUser as any;
          setUser({
            ...existingUser,
            displayName: existingUser.displayName || firebaseUser.displayName || '',
            photoURL: existingUser.photoURL || raw.profileImageUrl || firebaseUser.photoURL || null,
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

  // Usuario autenticado sin perfil completo → onboarding
  // IMPORTANTE: Mostrar onboarding para cualquier usuario que no tenga perfil completo
  const showSetupProfile = isAuthenticated && !isProfileComplete;

  return (
    <NavigationContainer linking={linking}>
      {!isAuthenticated && <AuthStack />}
      {showSetupProfile && <OnboardingScreen />}
      {isAuthenticated && (isProfileComplete || user?.role === 'client') && !showSetupProfile && (
        <MainTabNavigator />
      )}
    </NavigationContainer>
  );
};
