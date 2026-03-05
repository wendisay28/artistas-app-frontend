// src/hooks/useProfileImageUpload.ts
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { Alert, Platform } from 'react-native';
import { refreshToken } from '../services/firebase/auth';
import { updateMyProfile } from '../services/api/users';
import { useAuthStore } from '../store/authStore';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL!;

/**
 * Redimensiona y comprime una imagen antes de subir.
 * Esto reduce drásticamente el tamaño del archivo (de 8MB → ~200KB).
 */
export async function compressImage(
  uri: string,
  maxWidth: number,
  quality = 0.8
): Promise<string> {
  const result = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: maxWidth } }],
    { compress: quality, format: ImageManipulator.SaveFormat.JPEG }
  );
  return result.uri;
}

interface UploadResult {
  downloadURL: string;
}

async function pickAndUpload(
  folder: 'avatars' | 'covers'
): Promise<string | null> {
  // Request permissions
  if (Platform.OS !== 'web') {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permiso requerido',
        'Necesitamos acceso a tu galería para cambiar la imagen.'
      );
      return null;
    }
  }

  // Launch picker
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: folder === 'covers' ? [16, 9] : [1, 1],
    quality: 0.8,
  });

  if (result.canceled || !result.assets?.length) return null;

  return uploadToServer(result.assets[0].uri, folder, result.assets[0].mimeType);
}

const MAX_WIDTH: Record<string, number> = {
  avatars:   500,
  covers:    1200,
  portfolio: 1200,
  services:  900,
};

/**
 * Sube una imagen local al backend y devuelve la URL pública.
 * Comprime y redimensiona automáticamente antes de subir.
 */
export async function uploadToServer(
  uri: string,
  folder: 'avatars' | 'covers' | 'portfolio' | 'services',
  mimeType?: string | null
): Promise<string> {
  // Comprimir antes de subir (reduce de ~8MB a ~150-300KB)
  const maxWidth = MAX_WIDTH[folder] ?? 1200;
  const compressedUri = await compressImage(uri, maxWidth, 0.8);

  const filename = `${folder}_${Date.now()}.jpg`;
  const type = 'image/jpeg';

  const form = new FormData();
  form.append('file', { uri: compressedUri, name: filename, type } as any);
  form.append('path', folder);

  const token = await refreshToken();

  const response = await fetch(`${BACKEND_URL}/upload/image`, {
    method: 'POST',
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
    body: form,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Upload failed: ${response.status} ${text}`);
  }

  const data: UploadResult = await response.json();
  return data.downloadURL;
}

export function useProfileImageUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const { user, setUser } = useAuthStore();

  const uploadAvatar = async () => {
    try {
      setIsUploading(true);
      const url = await pickAndUpload('avatars');
      if (!url) return;

      const updated = await updateMyProfile({ photoURL: url });
      if (user) setUser({ ...user, ...updated, photoURL: url });
    } catch (e) {
      console.error('uploadAvatar error:', e);
      Alert.alert('Error', 'No se pudo subir la imagen de perfil.');
    } finally {
      setIsUploading(false);
    }
  };

  const uploadCover = async () => {
    try {
      setIsUploading(true);
      const url = await pickAndUpload('covers');
      if (!url) return;

      const updated = await updateMyProfile({ coverImageUrl: url });
      if (user) setUser({ ...user, ...updated });
    } catch (e) {
      console.error('uploadCover error:', e);
      Alert.alert('Error', 'No se pudo subir la imagen de portada.');
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadAvatar, uploadCover, isUploading };
}
