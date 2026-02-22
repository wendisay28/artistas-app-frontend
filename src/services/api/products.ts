// src/services/api/products.ts
// Servicio para gestionar productos de artistas
import { apiClient } from './config';

export interface Product {
  id?: string;
  userId?: string;
  name: string;
  description: string;
  price?: number;
  currency?: string;
  category?: string;
  images?: string[];
  inStock?: boolean;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export const productsService = {
  // Obtener productos del usuario autenticado
  getMyProducts: async (): Promise<Product[]> => {
    const response = await apiClient.get('/store/me');
    return response.data.data || [];
  },

  // Obtener un producto por ID
  getProductById: async (id: string): Promise<Product> => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data.data;
  },

  // Crear un nuevo producto
  createProduct: async (product: Omit<Product, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
    const response = await apiClient.post('/products', product);
    return response.data.data;
  },

  // Actualizar un producto existente
  updateProduct: async (id: string, product: Partial<Product>): Promise<Product> => {
    const response = await apiClient.patch(`/products/${id}`, product);
    return response.data.data;
  },

  // Eliminar un producto
  deleteProduct: async (id: string): Promise<void> => {
    await apiClient.delete(`/products/${id}`);
  },
};

export default productsService;
