// src/services/api/storage.ts
import { apiClient } from './config';
import { API_ENDPOINTS } from './endpoints';
import { ImagePickerAsset } from 'expo-image-picker';

export interface UploadImageResponse {
  success: boolean;
  message: string;
  imageUrl: string;
  fileName: string;
}

export const storageService = {
  // Subir imagen
  uploadImage: async (file: ImagePickerAsset, bucket?: string): Promise<UploadImageResponse> => {
    const formData = new FormData();
    
    // The browser File object is not available in React Native,
    // so we need to construct the multipart form data manually.
    const asset = {
      uri: file.uri,
      name: file.fileName || 'image.jpg',
      type: file.mimeType || 'image/jpeg'
    } as any;

    formData.append('image', asset);
    
    if (bucket) {
      formData.append('bucket', bucket);
    }

    const response = await apiClient.post(API_ENDPOINTS.STORAGE.UPLOAD_IMAGE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  // Eliminar imagen
  deleteImage: async (imageUrl: string): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.STORAGE.DELETE_IMAGE, { imageUrl });
  },
};
