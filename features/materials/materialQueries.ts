'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createMaterial, deleteMaterial, getMaterials, updateMaterial } from '@/lib/apis/materialsApi';
import {
  CreateMaterialRequest,
  Material,
  MaterialListParams,
  UpdateMaterialRequest,
} from '@/lib/models/material';
import { ApiError } from '@/lib/models/apiResponse';

export const materialsQueryKey = ['materials'];

type MaterialListCache = {
  materials: Material[];
  pagination: {
    pageNumber?: number;
    pageSize?: number;
    totalCount?: number;
    totalPages?: number;
    [key: string]: unknown;
  } | null;
};

export function useMaterials(token: string | null, params: MaterialListParams) {
  return useQuery({
    queryKey: [...materialsQueryKey, params],
    queryFn: async (): Promise<MaterialListCache> => {
      if (!token) throw new Error('You need to login again.');
      const response = await getMaterials(token, params);
      return {
        materials: response.data,
        pagination: response.pagination,
      };
    },
    enabled: Boolean(token),
  });
}

export function usePublicMaterials(params: MaterialListParams) {
  return useQuery({
    queryKey: [...materialsQueryKey, 'public', params],
    queryFn: async (): Promise<MaterialListCache> => {
      const response = await getMaterials(null, params);
      return {
        materials: response.data,
        pagination: response.pagination,
      };
    },
  });
}

export function useCreateMaterial(token: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateMaterialRequest) => {
      if (!token) throw new Error('You need to login again.');
      const response = await createMaterial(payload, token);
      return response.data;
    },
    onSuccess: (createdMaterial) => {
      queryClient.setQueriesData<MaterialListCache>({ queryKey: materialsQueryKey }, (current) => {
        if (!current) return current;

        const withoutDuplicate = current.materials.filter((material) => material.id !== createdMaterial.id);
        return {
          ...current,
          materials: [createdMaterial, ...withoutDuplicate],
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

export function useUpdateMaterial(token: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: UpdateMaterialRequest }) => {
      if (!token) throw new Error('You need to login again.');
      const response = await updateMaterial(id, payload, token);
      return response.data;
    },
    onSuccess: (updatedMaterial) => {
      queryClient.setQueriesData<MaterialListCache>({ queryKey: materialsQueryKey }, (current) => {
        if (!current) return current;

        return {
          ...current,
          materials: current.materials.map((material) =>
            material.id === updatedMaterial.id ? updatedMaterial : material
          ),
        };
      });
    },
  });
}

export function useDeleteMaterial(token: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      if (!token) throw new Error('You need to login again.');
      try {
        await deleteMaterial(id, token);
      } catch (error) {
        if (
          error instanceof ApiError &&
          [error.message, ...error.errors].some((message) => /material.+not found/i.test(message))
        ) {
          return id;
        }

        throw error;
      }
      return id;
    },
    onSuccess: (deletedMaterialId) => {
      queryClient.setQueriesData<MaterialListCache>({ queryKey: materialsQueryKey }, (current) => {
        if (!current) return current;

        const materials = current.materials.filter((material) => material.id !== deletedMaterialId);
        return {
          ...current,
          materials,
          pagination: current.pagination
            ? {
                ...current.pagination,
                totalCount: Math.max(0, Number(current.pagination.totalCount ?? materials.length + 1) - 1),
              }
            : current.pagination,
        };
      });
    },
  });
}
