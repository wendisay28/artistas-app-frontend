// src/screens/auth/setup-profile/hooks/useSetupProfile.ts
import { useState, useCallback } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { useAuthStore } from '../../../../store/authStore';
import { updateMyProfile } from '../../../../services/api/users';

export const useSetupProfile = () => {
  const { user, setUser, setError } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName ?? '');
  const [username, setUsername] = useState(user?.username ?? '');
  const [photoURI, setPhotoURI] = useState<string | null>(user?.photoURL ?? null);
  const [city, setCity] = useState(user?.city ?? '');
  const [bio, setBio] = useState(user?.bio ?? '');

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

  const saveProfile = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const updatedUser = await updateMyProfile({
        photoURL: photoURI ?? undefined,
      });
      setUser(updatedUser);
      return { success: true };
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Error al actualizar el perfil');
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  }, [displayName, username, photoURI, city, bio, user, setUser, setError]);

  return {
    displayName, setDisplayName,
    username, setUsername,
    photoURI, pickPhoto,
    city, setCity,
    bio, setBio,
    isLoading,
    saveProfile,
  };
};
