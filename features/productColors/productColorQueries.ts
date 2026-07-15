'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createProductColor,
  deleteProductColor,
  getProductColors,
  updateProductColor,
} from '@/lib/apis/productColorsApi';
import { CreateProductColorRequest, Product, ProductColor, UpdateProductColorRequest } from '@/lib/models/product';
import { productsQueryKey } from '@/features/products/productQueries';

export const productColorsQueryKey = ['product-colors'];

type ProductListCache = {
  products: Product[];
  pagination: unknown;
};

function updateProductColorCaches(
  queryClient: ReturnType<typeof useQueryClient>,
  productId: number,
  updater: (colors: ProductColor[]) => ProductColor[],
) {
  queryClient.setQueriesData<ProductListCache>({ queryKey: productsQueryKey }, (current) => {
    if (!current || !Array.isArray(current.products)) return current;

    return {
      ...current,
      products: current.products.map((product) =>
        product.id === productId ? { ...product, colors: updater(product.colors ?? []) } : product,
      ),
    };
  });

  queryClient.setQueriesData<Product>({ queryKey: [...productsQueryKey, 'public', 'details', productId] }, (current) => {
    if (!current) return current;
    return { ...current, colors: updater(current.colors ?? []) };
  });

  queryClient.setQueryData<ProductColor[]>([...productColorsQueryKey, productId], (current) => updater(current ?? []));
}

export function useProductColors(productId: number | null, token: string | null) {
  return useQuery({
    queryKey: [...productColorsQueryKey, productId],
    queryFn: async (): Promise<ProductColor[]> => {
      if (!productId) throw new Error('Product not found.');
      const response = await getProductColors(productId, token);
      return response.data;
    },
    enabled: Boolean(productId),
  });
}

export function useCreateProductColor(token: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateProductColorRequest) => {
      if (!token) throw new Error('You need to login again.');
      const response = await createProductColor(payload, token);
      return response.data;
    },
    onSuccess: (createdColor) => {
      updateProductColorCaches(queryClient, createdColor.productId, (colors) => {
        const withoutDuplicate = colors.filter((color) => color.id !== createdColor.id);
        return [...withoutDuplicate, createdColor];
      });
    },
  });
}

export function useUpdateProductColor(token: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: UpdateProductColorRequest }) => {
      if (!token) throw new Error('You need to login again.');
      const response = await updateProductColor(id, payload, token);
      return response.data;
    },
    onSuccess: (updatedColor) => {
      updateProductColorCaches(queryClient, updatedColor.productId, (colors) =>
        colors.map((color) => (color.id === updatedColor.id ? updatedColor : color)),
      );
    },
  });
}

export function useDeleteProductColor(token: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, productId }: { id: number; productId: number }) => {
      if (!token) throw new Error('You need to login again.');
      await deleteProductColor(id, token);
      return { id, productId };
    },
    onSuccess: ({ id, productId }) => {
      updateProductColorCaches(queryClient, productId, (colors) => colors.filter((color) => color.id !== id));
    },
  });
}
