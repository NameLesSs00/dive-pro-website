'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createProduct,
  deleteProduct,
  getProductAverageReview,
  getProductById,
  getProducts,
  updateProduct,
} from '@/lib/apis/productsApi';
import { CreateProductRequest, Product, ProductListParams, UpdateProductRequest } from '@/lib/models/product';

export const productsQueryKey = ['products'];

type ProductListCache = {
  products: Product[];
  pagination: {
    pageNumber?: number;
    pageSize?: number;
    totalCount?: number;
    totalPages?: number;
    [key: string]: unknown;
  } | null;
};

export function useProducts(token: string | null, params: ProductListParams) {
  return useQuery({
    queryKey: [...productsQueryKey, params],
    queryFn: async (): Promise<ProductListCache> => {
      if (!token) throw new Error('You need to login again.');
      const response = await getProducts(token, params);
      return {
        products: response.data,
        pagination: response.pagination,
      };
    },
    enabled: Boolean(token),
  });
}

export function usePublicProducts(params: ProductListParams) {
  return useQuery({
    queryKey: [...productsQueryKey, 'public', params],
    queryFn: async (): Promise<ProductListCache> => {
      const response = await getProducts(null, params);
      return {
        products: response.data,
        pagination: response.pagination,
      };
    },
  });
}

export function usePublicProduct(id: number | null) {
  return useQuery({
    queryKey: [...productsQueryKey, 'public', 'details', id],
    queryFn: async (): Promise<Product> => {
      if (!id) throw new Error('Product not found.');
      const response = await getProductById(id, null);
      return response.data;
    },
    enabled: Boolean(id),
  });
}

export function useProductAverageReview(id: number | null) {
  return useQuery({
    queryKey: [...productsQueryKey, 'public', 'average-review', id],
    queryFn: async () => {
      if (!id) throw new Error('Product not found.');
      const response = await getProductAverageReview(id, null);
      return response.data;
    },
    enabled: Boolean(id),
  });
}

export function useCreateProduct(token: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateProductRequest) => {
      if (!token) throw new Error('You need to login again.');
      const response = await createProduct(payload, token);
      return response.data;
    },
    onSuccess: (createdProduct) => {
      queryClient.setQueriesData<ProductListCache>({ queryKey: productsQueryKey }, (current) => {
        if (!current) return current;

        const withoutDuplicate = current.products.filter((product) => product.id !== createdProduct.id);
        return {
          ...current,
          products: [createdProduct, ...withoutDuplicate],
          pagination: current.pagination
            ? {
                ...current.pagination,
                totalCount: Number(current.pagination.totalCount ?? withoutDuplicate.length) + 1,
              }
            : current.pagination,
        };
      });
    },
  });
}

export function useUpdateProduct(token: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: UpdateProductRequest }) => {
      if (!token) throw new Error('You need to login again.');
      const response = await updateProduct(id, payload, token);
      return response.data;
    },
    onSuccess: (updatedProduct) => {
      queryClient.setQueriesData<ProductListCache>({ queryKey: productsQueryKey }, (current) => {
        if (!current) return current;

        return {
          ...current,
          products: current.products.map((product) => (product.id === updatedProduct.id ? updatedProduct : product)),
        };
      });
    },
  });
}

export function useDeleteProduct(token: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      if (!token) throw new Error('You need to login again.');
      await deleteProduct(id, token);
      return id;
    },
    onSuccess: (deletedProductId) => {
      queryClient.setQueriesData<ProductListCache>({ queryKey: productsQueryKey }, (current) => {
        if (!current) return current;

        const products = current.products.filter((product) => product.id !== deletedProductId);
        return {
          ...current,
          products,
          pagination: current.pagination
            ? {
                ...current.pagination,
                totalCount: Math.max(0, Number(current.pagination.totalCount ?? products.length + 1) - 1),
              }
            : current.pagination,
        };
      });
    },
  });
}
