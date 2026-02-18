// src/screens/auth/setup-profile/hooks/useSetupProfile.ts
import { useState, useCallback } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { useAuthStore } from '../../../../store/authStore';
import { createUserProfile } from '../../../../services/api/users';
import { UserRole } from '../../../../types/User';

export const useSetupProfile = () => {
  const { user, setUser, setProfileComplete, setError } = useAuthStore();
  const [step, setStep] = useState<1 | 2 | 3>(1); // paso del onboarding
  const [displayName, setDisplayName] = useState(user?.displayName ?? '');
  const [photoURI, setPhotoURI] = useState<string | null>(user?.photoURL ?? null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const pickPhoto = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) setPhotoURI(result.assets[0].uri);
  }, []);

  const goNextStep = useCallback(() => {
    if (step < 3) setStep((prev) => (prev + 1) as 1 | 2 | 3);
  }, [step]);

  const goPrevStep = useCallback(() => {
    if (step > 1) setStep((prev) => (prev - 1) as 1 | 2 | 3);
  }, [step]);

  const submitProfile = useCallback(async () => {
    if (!displayName.trim() || !role) {
      setError('Completa tu nombre y elige un rol para continuar.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const updatedUser = await createUserProfile({
        displayName: displayName.trim(),
        photoURL: photoURI ?? undefined,
        role,
      });
      setUser(updatedUser);
      setProfileComplete(true);
    } catch {
      setError('No se pudo guardar tu perfil. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  }, [displayName, photoURI, role]);

  return {
    step, displayName, setDisplayName,
    photoURI, pickPhoto,
    role, setRole,
    isLoading,
    goNextStep, goPrevStep,
    submitProfile,
  };
};