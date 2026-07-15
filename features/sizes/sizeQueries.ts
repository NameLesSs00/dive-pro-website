'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createSize, deleteSize, getSizes, updateSize } from '@/lib/apis/sizesApi';
import { CreateSizeRequest, Size, SizeListParams, UpdateSizeRequest } from '@/lib/models/size';
import { ApiError } from '@/lib/models/apiResponse';

export const sizesQueryKey = ['sizes'];

type SizeListCache = {
  sizes: Size[];
  pagination: {
    pageNumber?: number;
    pageSize?: number;
    totalCount?: number;
    totalPages?: number;
    [key: string]: unknown;
  } | null;
};

export function useSizes(token: string | null, params: SizeListParams) {
  return useQuery({
    queryKey: [...sizesQueryKey, params],
    queryFn: async (): Promise<SizeListCache> => {
      if (!token) throw new Error('You need to login again.');
      const response = await getSizes(token, params);
      return {
        sizes: response.data,
        pagination: response.pagination,
      };
    },
    enabled: Boolean(token),
  });
}

export function usePublicSizes(params: SizeListParams) {
  return useQuery({
    queryKey: [...sizesQueryKey, 'public', params],
    queryFn: async (): Promise<SizeListCache> => {
      const response = await getSizes(null, params);
      return {
        sizes: response.data,
        pagination: response.pagination,
      };
    },
  });
}

export function useCreateSize(token: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateSizeRequest) => {
      if (!token) throw new Error('You need to login again.');
      const response = await createSize(payload, token);
      return response.data;
    },
    onSuccess: (createdSize) => {
      queryClient.setQueriesData<SizeListCache>({ queryKey: sizesQueryKey }, (current) => {
        if (!current) return current;

        const withoutDuplicate = current.sizes.filter((size) => size.id !== createdSize.id);
        return {
          ...current,
          sizes: [createdSize, ...withoutDuplicate],
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

export function useUpdateSize(token: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: UpdateSizeRequest }) => {
      if (!token) throw new Error('You need to login again.');
      const response = await updateSize(id, payload, token);
      return response.data;
    },
    onSuccess: (updatedSize) => {
      queryClient.setQueriesData<SizeListCache>({ queryKey: sizesQueryKey }, (current) => {
        if (!current) return current;

        return {
          ...current,
          sizes: current.sizes.map((size) => (size.id === updatedSize.id ? updatedSize : size)),
        };
      });
    },
  });
}

export function useDeleteSize(token: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      if (!token) throw new Error('You need to login again.');
      try {
        await deleteSize(id, token);
      } catch (error) {
        if (
          error instanceof ApiError &&
          [error.message, ...error.errors].some((message) => /size.+not found/i.test(message))
        ) {
          return id;
        }

        throw error;
      }
      return id;
    },
    onSuccess: (deletedSizeId) => {
      queryClient.setQueriesData<SizeListCache>({ queryKey: sizesQueryKey }, (current) => {
        if (!current) return current;

        const sizes = current.sizes.filter((size) => size.id !== deletedSizeId);
        return {
          ...current,
          sizes,
          pagination: current.pagination
            ? {
                ...current.pagination,
                totalCount: Math.max(0, Number(current.pagination.totalCount ?? sizes.length + 1) - 1),
              }
            : current.pagination,
        };
      });
    },
  });
}
