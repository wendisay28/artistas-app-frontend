// src/screens/auth/onboarding/hooks/useOnboarding.ts
import { useState, useCallback } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { useAuthStore } from '../../../../store/authStore';
import { useProfileStore } from '../../../../store/profileStore';
import { createUserProfile } from '../../../../services/api/users';
import { UserRole } from '../../../../types/User';

export const useOnboarding = () => {
  const { user, setUser, setProfileComplete, setError } = useAuthStore();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [displayName, setDisplayName] = useState(user?.displayName ?? '');
  const [username, setUsername] = useState('');
  const [photoURI, setPhotoURI] = useState<string | null>(user?.photoURL ?? null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDiscipline, setSelectedDiscipline] = useState<string | null>(null);
  const [city, setCity] = useState(user?.city ?? '');
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
    console.log('🎯 goNextStep llamado - paso actual:', step);
    if (step < 4) {
      const newStep = (step + 1) as 1 | 2 | 3 | 4;
      console.log('📈 Cambiando al paso:', newStep);
      setStep(newStep);
    } else {
      console.log('⚠️ Ya está en el último paso');
    }
  }, [step]);

  const goPrevStep = useCallback(() => {
    if (step > 1) setStep((prev) => (prev - 1) as 1 | 2 | 3 | 4);
  }, [step]);

  const submitProfile = useCallback(async () => {
    const resolvedRole = role ?? 'artist';
    setIsLoading(true);
    setError(null);

    // Preparar la selección de categoría para guardar en el perfil
    const categorySelection = selectedCategory
      ? { categoryId: selectedCategory, disciplineId: selectedDiscipline ?? '', roleId: '' }
      : undefined;

    try {
      const updatedUser = await createUserProfile({
        displayName: displayName.trim(),
        username: username.trim(),
        photoURL: photoURI ?? undefined,
        role: resolvedRole,
        city: city.trim() || undefined,
      });
      setUser(updatedUser);

      // Guardar la categoría elegida en el onboarding al store del perfil
      if (categorySelection) {
        useProfileStore.getState().setArtistData({ category: categorySelection });
      }

      setProfileComplete(true);
    } catch {
      // Backend unavailable — set profile complete locally so the user can continue
      setUser({
        id: user?.id ?? '',
        firebaseUid: user?.firebaseUid ?? '',
        email: user?.email ?? '',
        displayName: displayName.trim() || user?.displayName || '',
        username: username.trim(),
        photoURL: photoURI ?? user?.photoURL ?? null,
        role: resolvedRole as any,
        isCompany: false,
        city: city.trim() || null,
        bio: null,
        isProfileComplete: true,
        createdAt: user?.createdAt ?? new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      // Guardar la categoría también en caso de error de backend
      if (categorySelection) {
        useProfileStore.getState().setArtistData({ category: categorySelection });
      }

      setProfileComplete(true);
    } finally {
      setIsLoading(false);
    }
  }, [displayName, photoURI, role, city, user, selectedCategory, selectedDiscipline]);

  return {
    step, displayName, setDisplayName,
    username, setUsername,
    photoURI, pickPhoto,
    role, setRole,
    selectedCategory, setSelectedCategory,
    selectedDiscipline, setSelectedDiscipline,
    city, setCity,
    isLoading,
    goNextStep, goPrevStep, submitProfile,
  };
};
