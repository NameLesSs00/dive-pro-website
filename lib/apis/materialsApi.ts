import { apiRequest } from '@/lib/api/client';
import {
  CreateMaterialRequest,
  Material,
  MaterialListParams,
  UpdateMaterialRequest,
} from '@/lib/models/material';

function buildMaterialQuery(params: MaterialListParams = {}) {
  const query = new URLSearchParams();

  if (params.pageNumber) query.set('PageNumber', String(params.pageNumber));
  if (params.pageSize) query.set('PageSize', String(params.pageSize));
  if (params.search?.trim()) query.set('Search', params.search.trim());

  const queryString = query.toString();
  return queryString ? `/materials?${queryString}` : '/materials';
}

export function getMaterials(token: string | null, params?: MaterialListParams) {
  return apiRequest<Material[]>(buildMaterialQuery(params), {
    token,
    action: 'materials.list',
  });
}

export function getMaterialById(id: number, token: string) {
  return apiRequest<Material>(`/materials/${id}`, {
    token,
    action: 'materials.details',
  });
}

export function createMaterial(payload: CreateMaterialRequest, token: string) {
  return apiRequest<Material>('/materials', {
    method: 'POST',
    body: payload,
    token,
    action: 'materials.create',
  });
}

export function updateMaterial(id: number, payload: UpdateMaterialRequest, token: string) {
  return apiRequest<Material>(`/materials/${id}`, {
    method: 'PUT',
    body: payload,
    token,
    action: 'materials.update',
  });
}

export function deleteMaterial(id: number, token: string) {
  return apiRequest<null>(`/materials/${id}`, {
    method: 'DELETE',
    token,
    action: 'materials.delete',
  });
}
