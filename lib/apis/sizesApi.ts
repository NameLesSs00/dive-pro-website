import { apiRequest } from '@/lib/api/client';
import { CreateSizeRequest, Size, SizeListParams, UpdateSizeRequest } from '@/lib/models/size';

function buildSizeQuery(params: SizeListParams = {}) {
  const query = new URLSearchParams();

  if (params.pageNumber) query.set('PageNumber', String(params.pageNumber));
  if (params.pageSize) query.set('PageSize', String(params.pageSize));
  if (params.search?.trim()) query.set('Search', params.search.trim());

  const queryString = query.toString();
  return queryString ? `/sizes?${queryString}` : '/sizes';
}

export function getSizes(token: string, params?: SizeListParams) {
  return apiRequest<Size[]>(buildSizeQuery(params), {
    token,
    action: 'sizes.list',
  });
}

export function getSizeById(id: number, token: string) {
  return apiRequest<Size>(`/sizes/${id}`, {
    token,
    action: 'sizes.details',
  });
}

export function createSize(payload: CreateSizeRequest, token: string) {
  return apiRequest<Size>('/sizes', {
    method: 'POST',
    body: payload,
    token,
    action: 'sizes.create',
  });
}

export function updateSize(id: number, payload: UpdateSizeRequest, token: string) {
  return apiRequest<Size>(`/sizes/${id}`, {
    method: 'PUT',
    body: payload,
    token,
    action: 'sizes.update',
  });
}

export function deleteSize(id: number, token: string) {
  return apiRequest<null>(`/sizes/${id}`, {
    method: 'DELETE',
    token,
    action: 'sizes.delete',
  });
}
