// src/hooks/useProfileImageUpload.ts
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Alert, Platform } from 'react-native';
import { refreshToken } from '../services/firebase/auth';
import { updateMyProfile } from '../services/api/users';
import { useAuthStore } from '../store/authStore';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL!;

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
    quality: 0.85,
  });

  if (result.canceled || !result.assets?.length) return null;

  return uploadToServer(result.assets[0].uri, folder, result.assets[0].mimeType);
}

/**
 * Sube una imagen local al backend y devuelve la URL pública.
 * Úsalo cuando ya tienes la URI (de ImagePicker u otra fuente).
 */
export async function uploadToServer(
  uri: string,
  folder: 'avatars' | 'covers',
  mimeType?: string | null
): Promise<string> {
  const filename = uri.split('/').pop() ?? `${folder}_${Date.now()}.jpg`;
  const type = mimeType ?? 'image/jpeg';

  const form = new FormData();
  form.append('file', { uri, name: filename, type } as any);
  form.append('path', folder); // el backend decide el bucket

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
