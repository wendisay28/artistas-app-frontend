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
  uploadImage: async (file: ImagePickerAsset, path?: string): Promise<UploadImageResponse> => {
    const formData = new FormData();
    const asset = {
      uri: file.uri,
      name: file.fileName || 'image.jpg',
      type: file.mimeType || 'image/jpeg',
    } as any;
    formData.append('file', asset);
    if (path) {
      formData.append('path', path);
    }
    const response = await apiClient.post(API_ENDPOINTS.STORAGE.UPLOAD_IMAGE, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    const d = response.data;
    return { success: d.success, message: 'OK', imageUrl: d.downloadURL, fileName: d.fileName };
  },

  uploadVideo: async (
    file: ImagePickerAsset,
    onProgress?: (progress: number) => void,
  ): Promise<UploadImageResponse> => {
    const formData = new FormData();
    const asset = {
      uri: file.uri,
      name: file.fileName || 'video.mp4',
      type: file.mimeType || 'video/mp4',
    } as any;
    formData.append('file', asset);
    try {
      const response = await apiClient.post(API_ENDPOINTS.STORAGE.UPLOAD_VIDEO, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 180000, // 3 min para videos grandes
        onUploadProgress: (evt: any) => {
          if (evt.total) {
            onProgress?.(Math.round((evt.loaded * 100) / evt.total));
          }
        },
      });
      const d = response.data;
      if (!d?.downloadURL) throw new Error('Server response missing downloadURL');
      return { success: d.success, message: 'OK', imageUrl: d.downloadURL, fileName: d.fileName };
    } catch (error) {
      console.error('Error uploading video:', error);
      throw error;
    }
  },

  // Eliminar imagen
  deleteImage: async (imageUrl: string): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.STORAGE.DELETE_IMAGE, { imageUrl });
  },
};
