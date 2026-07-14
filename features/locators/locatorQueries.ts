'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createLocator, deleteLocator, getLocators, updateLocator } from '@/lib/apis/locatorsApi';
import {
  CreateLocatorRequest,
  Locator,
  LocatorListParams,
  UpdateLocatorRequest,
} from '@/lib/models/locator';
import { ApiError } from '@/lib/models/apiResponse';

export const locatorsQueryKey = ['locators'];

type LocatorListCache = {
  locators: Locator[];
  pagination: {
    pageNumber?: number;
    pageSize?: number;
    totalCount?: number;
    totalPages?: number;
    [key: string]: unknown;
  } | null;
};

export function useLocators(token: string | null, params: LocatorListParams) {
  return useQuery({
    queryKey: [...locatorsQueryKey, params],
    queryFn: async (): Promise<LocatorListCache> => {
      if (!token) throw new Error('You need to login again.');
      const response = await getLocators(token, params);
      return {
        locators: response.data,
        pagination: response.pagination,
      };
    },
    enabled: Boolean(token),
  });
}

export function usePublicLocators(params: LocatorListParams) {
  return useQuery({
    queryKey: [...locatorsQueryKey, 'public', params],
    queryFn: async (): Promise<LocatorListCache> => {
      const response = await getLocators(null, params);
      return {
        locators: response.data,
        pagination: response.pagination,
      };
    },
  });
}

export function useCreateLocator(token: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateLocatorRequest) => {
      if (!token) throw new Error('You need to login again.');
      const response = await createLocator(payload, token);
      return response.data;
    },
    onSuccess: (createdLocator) => {
      queryClient.setQueriesData<LocatorListCache>({ queryKey: locatorsQueryKey }, (current) => {
        if (!current) return current;

        const withoutDuplicate = current.locators.filter((locator) => locator.id !== createdLocator.id);
        return {
          ...current,
          locators: [createdLocator, ...withoutDuplicate],
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

export function useUpdateLocator(token: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: UpdateLocatorRequest }) => {
      if (!token) throw new Error('You need to login again.');
      const response = await updateLocator(id, payload, token);
      return response.data;
    },
    onSuccess: (updatedLocator) => {
      queryClient.setQueriesData<LocatorListCache>({ queryKey: locatorsQueryKey }, (current) => {
        if (!current) return current;

        return {
          ...current,
          locators: current.locators.map((locator) =>
            locator.id === updatedLocator.id ? updatedLocator : locator
          ),
        };
      });
    },
  });
}

export function useDeleteLocator(token: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      if (!token) throw new Error('You need to login again.');
      try {
        await deleteLocator(id, token);
      } catch (error) {
        if (
          error instanceof ApiError &&
          [error.message, ...error.errors].some((message) => /locator.+not found/i.test(message))
        ) {
          return id;
        }

        throw error;
      }
      return id;
    },
    onSuccess: (deletedLocatorId) => {
      queryClient.setQueriesData<LocatorListCache>({ queryKey: locatorsQueryKey }, (current) => {
        if (!current) return current;

        const locators = current.locators.filter((locator) => locator.id !== deletedLocatorId);
        return {
          ...current,
          locators,
          pagination: current.pagination
            ? {
                ...current.pagination,
                totalCount: Math.max(0, Number(current.pagination.totalCount ?? locators.length + 1) - 1),
              }
            : current.pagination,
        };
      });
    },
  });
}
