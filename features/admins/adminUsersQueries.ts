'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createAdminUser, deleteAdminUser, getAdminUsers } from '@/lib/apis/adminUsersApi';
import { AdminUser, CreateAdminUserRequest } from '@/lib/models/adminUser';

export const adminUsersQueryKey = ['admin-users'];

export function useAdminUsers(token: string | null) {
  return useQuery({
    queryKey: adminUsersQueryKey,
    queryFn: async () => {
      if (!token) throw new Error('You need to login again.');
      const response = await getAdminUsers(token);
      return response.data;
    },
    enabled: Boolean(token),
  });
}

export function useCreateAdminUser(token: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateAdminUserRequest) => {
      if (!token) throw new Error('You need to login again.');
      const response = await createAdminUser(payload, token);
      return response.data;
    },
    onSuccess: (createdAdmin) => {
      queryClient.setQueryData<AdminUser[]>(adminUsersQueryKey, (currentAdmins = []) => {
        const withoutDuplicate = currentAdmins.filter((admin) => admin.id !== createdAdmin.id);
        return [...withoutDuplicate, createdAdmin];
      });
    },
  });
}

export function useDeleteAdminUser(token: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!token) throw new Error('You need to login again.');
      await deleteAdminUser(id, token);
      return id;
    },
    onSuccess: (deletedAdminId) => {
      queryClient.setQueryData<AdminUser[]>(adminUsersQueryKey, (currentAdmins = []) =>
        currentAdmins.filter((admin) => admin.id !== deletedAdminId)
      );
    },
  });
}
