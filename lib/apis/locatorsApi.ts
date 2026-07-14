import { apiRequest } from '@/lib/api/client';
import {
  CreateLocatorRequest,
  Locator,
  LocatorListParams,
  UpdateLocatorRequest,
} from '@/lib/models/locator';

function buildLocatorQuery(params: LocatorListParams = {}) {
  const query = new URLSearchParams();

  if (params.pageNumber) query.set('PageNumber', String(params.pageNumber));
  if (params.pageSize) query.set('PageSize', String(params.pageSize));
  if (params.search?.trim()) query.set('Search', params.search.trim());

  const queryString = query.toString();
  return queryString ? `/locators?${queryString}` : '/locators';
}

export function getLocators(token: string | null, params?: LocatorListParams) {
  return apiRequest<Locator[]>(buildLocatorQuery(params), {
    token,
    action: 'locators.list',
  });
}

export function getLocatorById(id: number, token: string | null) {
  return apiRequest<Locator>(`/locators/${id}`, {
    token,
    action: 'locators.details',
  });
}

export function createLocator(payload: CreateLocatorRequest, token: string) {
  return apiRequest<Locator>('/locators', {
    method: 'POST',
    body: payload,
    token,
    action: 'locators.create',
  });
}

export function updateLocator(id: number, payload: UpdateLocatorRequest, token: string) {
  return apiRequest<Locator>(`/locators/${id}`, {
    method: 'PUT',
    body: payload,
    token,
    action: 'locators.update',
  });
}

export function deleteLocator(id: number, token: string) {
  return apiRequest<null>(`/locators/${id}`, {
    method: 'DELETE',
    token,
    action: 'locators.delete',
  });
}
