'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from '@/lib/apis/categoriesApi';
import { Category, CategoryListParams, CreateCategoryRequest, UpdateCategoryRequest } from '@/lib/models/category';

export const categoriesQueryKey = ['categories'];

type CategoryListCache = {
  categories: Category[];
  pagination: {
    pageNumber?: number;
    pageSize?: number;
    totalCount?: number;
    totalPages?: number;
    [key: string]: unknown;
  } | null;
};

export function useCategories(token: string | null, params: CategoryListParams) {
  return useQuery({
    queryKey: [...categoriesQueryKey, params],
    queryFn: async (): Promise<CategoryListCache> => {
      if (!token) throw new Error('You need to login again.');
      const response = await getCategories(token, params);
      return {
        categories: response.data,
        pagination: response.pagination,
      };
    },
    enabled: Boolean(token),
  });
}

export function useCreateCategory(token: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateCategoryRequest) => {
      if (!token) throw new Error('You need to login again.');
      const response = await createCategory(payload, token);
      return response.data;
    },
    onSuccess: (createdCategory) => {
      queryClient.setQueriesData<CategoryListCache>({ queryKey: categoriesQueryKey }, (current) => {
        if (!current) return current;

        const withoutDuplicate = current.categories.filter((category) => category.id !== createdCategory.id);
        return {
          ...current,
          categories: [createdCategory, ...withoutDuplicate],
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

export function useUpdateCategory(token: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: UpdateCategoryRequest }) => {
      if (!token) throw new Error('You need to login again.');
      const response = await updateCategory(id, payload, token);
      return response.data;
    },
    onSuccess: (updatedCategory) => {
      queryClient.setQueriesData<CategoryListCache>({ queryKey: categoriesQueryKey }, (current) => {
        if (!current) return current;

        return {
          ...current,
          categories: current.categories.map((category) =>
            category.id === updatedCategory.id ? updatedCategory : category
          ),
        };
      });
    },
  });
}

export function useDeleteCategory(token: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      if (!token) throw new Error('You need to login again.');
      await deleteCategory(id, token);
      return id;
    },
    onSuccess: (deletedCategoryId) => {
      queryClient.setQueriesData<CategoryListCache>({ queryKey: categoriesQueryKey }, (current) => {
        if (!current) return current;

        const categories = current.categories.filter((category) => category.id !== deletedCategoryId);
        return {
          ...current,
          categories,
          pagination: current.pagination
            ? {
                ...current.pagination,
                totalCount: Math.max(0, Number(current.pagination.totalCount ?? categories.length + 1) - 1),
              }
            : current.pagination,
        };
      });
    },
  });
}
