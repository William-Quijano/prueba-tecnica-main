import axios from 'axios';
import { Product, CreateProductDTO, UpdateProductDTO, PaginatedResponse } from '@/lib/types/product';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const productsApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getProducts = async (page = 1, limit = 10, search = ''): Promise<PaginatedResponse<Product>> => {
  const { data } = await productsApi.get<PaginatedResponse<Product>>('/products', {
    params: {
      page,
      limit,
      search,
    },
  });
  
  return data;
};

export const getProductById = async (id: string): Promise<Product> => {
  const { data } = await productsApi.get<Product>(`/products/${id}`);
  return data;
};

export const createProduct = async (product: CreateProductDTO | FormData): Promise<Product> => {
  const isFormData = product instanceof FormData;
  const { data } = await productsApi.post<Product>('/products', product, {
    headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined, // Axios usually handles this automatically for FormData, but explicit doesn't hurt or just let undefined override default
  });
  return data;
};

export const updateProduct = async (id: string, product: UpdateProductDTO | FormData): Promise<Product> => {
   const isFormData = product instanceof FormData;
  const { data } = await productsApi.put<Product>(`/products/${id}`, product, {
     headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
  });
  return data;
};

export const deleteProduct = async (id: string): Promise<void> => {
  await productsApi.delete(`/products/${id}`);
};
