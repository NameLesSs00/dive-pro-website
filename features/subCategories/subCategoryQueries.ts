'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createSubCategory,
  deleteSubCategory,
  getSubCategories,
  updateSubCategory,
} from '@/lib/apis/subCategoriesApi';
import {
  CreateSubCategoryRequest,
  SubCategory,
  SubCategoryListParams,
  UpdateSubCategoryRequest,
} from '@/lib/models/subCategory';
import { ApiError } from '@/lib/models/apiResponse';

export const subCategoriesQueryKey = ['sub-categories'];

type SubCategoryListCache = {
  subCategories: SubCategory[];
  pagination: {
    pageNumber?: number;
    pageSize?: number;
    totalCount?: number;
    totalPages?: number;
    [key: string]: unknown;
  } | null;
};

export function useSubCategories(token: string | null, params: SubCategoryListParams) {
  return useQuery({
    queryKey: [...subCategoriesQueryKey, params],
    queryFn: async (): Promise<SubCategoryListCache> => {
      if (!token) throw new Error('You need to login again.');
      const response = await getSubCategories(token, params);
      return {
        subCategories: response.data,
        pagination: response.pagination,
      };
    },
    enabled: Boolean(token),
  });
}

export function usePublicSubCategories(params: SubCategoryListParams) {
  return useQuery({
    queryKey: [...subCategoriesQueryKey, 'public', params],
    queryFn: async (): Promise<SubCategoryListCache> => {
      const response = await getSubCategories(null, params);
      return {
        subCategories: response.data,
        pagination: response.pagination,
      };
    },
  });
}

export function useCreateSubCategory(token: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateSubCategoryRequest) => {
      if (!token) throw new Error('You need to login again.');
      const response = await createSubCategory(payload, token);
      return response.data;
    },
    onSuccess: (createdSubCategory) => {
      queryClient.setQueriesData<SubCategoryListCache>({ queryKey: subCategoriesQueryKey }, (current) => {
        if (!current) return current;

        const withoutDuplicate = current.subCategories.filter(
          (subCategory) => subCategory.id !== createdSubCategory.id
        );
        return {
          ...current,
          subCategories: [createdSubCategory, ...withoutDuplicate],
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

export function useUpdateSubCategory(token: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: UpdateSubCategoryRequest }) => {
      if (!token) throw new Error('You need to login again.');
      const response = await updateSubCategory(id, payload, token);
      return response.data;
    },
    onSuccess: (updatedSubCategory) => {
      queryClient.setQueriesData<SubCategoryListCache>({ queryKey: subCategoriesQueryKey }, (current) => {
        if (!current) return current;

        return {
          ...current,
          subCategories: current.subCategories.map((subCategory) =>
            subCategory.id === updatedSubCategory.id ? updatedSubCategory : subCategory
          ),
        };
      });
    },
  });
}

export function useDeleteSubCategory(token: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      if (!token) throw new Error('You need to login again.');
      try {
        await deleteSubCategory(id, token);
      } catch (error) {
        if (
          error instanceof ApiError &&
          [error.message, ...error.errors].some((message) => /subcategory.+not found/i.test(message))
        ) {
          return id;
        }

        throw error;
      }
      return id;
    },
    onSuccess: (deletedSubCategoryId) => {
      queryClient.setQueriesData<SubCategoryListCache>({ queryKey: subCategoriesQueryKey }, (current) => {
        if (!current) return current;

        const subCategories = current.subCategories.filter(
          (subCategory) => subCategory.id !== deletedSubCategoryId
        );
        return {
          ...current,
          subCategories,
          pagination: current.pagination
            ? {
                ...current.pagination,
                totalCount: Math.max(0, Number(current.pagination.totalCount ?? subCategories.length + 1) - 1),
              }
            : current.pagination,
        };
      });
    },
  });
}
