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
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: folder === 'covers' ? [16, 9] : [1, 1],
    quality: 0.85,
  });

  if (result.canceled || !result.assets?.length) return null;

  const asset = result.assets[0];
  const uri = asset.uri;
  const filename = uri.split('/').pop() ?? `${folder}_${Date.now()}.jpg`;
  const type = asset.mimeType ?? 'image/jpeg';

  // Build FormData
  const form = new FormData();
  form.append('file', { uri, name: filename, type } as any);
  form.append('bucket', 'artistas-uploads');
  form.append('path', folder);

  // Get fresh Firebase token
  const token = await refreshToken();

  const response = await fetch(`${BACKEND_URL}/api/v1/upload/image`, {
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
