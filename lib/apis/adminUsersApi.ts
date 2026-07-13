import { apiRequest } from '@/lib/api/client';
import { AdminUser, CreateAdminUserRequest } from '@/lib/models/adminUser';

export function getAdminUsers(token: string) {
  return apiRequest<AdminUser[]>('/auth/users', {
    token,
    action: 'adminUsers.list',
  });
}

export function createAdminUser(payload: CreateAdminUserRequest, token: string) {
  return apiRequest<AdminUser>('/auth/users', {
    method: 'POST',
    body: payload,
    token,
    action: 'adminUsers.create',
  });
}

export function deleteAdminUser(id: string, token: string) {
  return apiRequest<null>(`/auth/users/${id}`, {
    method: 'DELETE',
    token,
    action: 'adminUsers.delete',
  });
}
