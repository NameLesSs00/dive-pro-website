import { apiRequest } from '@/lib/api/client';
import {
  CreateSubCategoryRequest,
  SubCategory,
  SubCategoryListParams,
  UpdateSubCategoryRequest,
} from '@/lib/models/subCategory';

function buildSubCategoryQuery(params: SubCategoryListParams = {}) {
  const query = new URLSearchParams();

  if (params.pageNumber) query.set('PageNumber', String(params.pageNumber));
  if (params.pageSize) query.set('PageSize', String(params.pageSize));
  if (params.search?.trim()) query.set('Search', params.search.trim());

  const queryString = query.toString();
  return queryString ? `/subcategories?${queryString}` : '/subcategories';
}

export function getSubCategories(token: string, params?: SubCategoryListParams) {
  return apiRequest<SubCategory[]>(buildSubCategoryQuery(params), {
    token,
    action: 'subCategories.list',
  });
}

export function getSubCategoryById(id: number, token: string) {
  return apiRequest<SubCategory>(`/subcategories/${id}`, {
    token,
    action: 'subCategories.details',
  });
}

export function createSubCategory(payload: CreateSubCategoryRequest, token: string) {
  return apiRequest<SubCategory>('/subcategories', {
    method: 'POST',
    body: payload,
    token,
    action: 'subCategories.create',
  });
}

export function updateSubCategory(id: number, payload: UpdateSubCategoryRequest, token: string) {
  return apiRequest<SubCategory>(`/subcategories/${id}`, {
    method: 'PUT',
    body: payload,
    token,
    action: 'subCategories.update',
  });
}

export function deleteSubCategory(id: number, token: string) {
  return apiRequest<null>(`/subcategories/${id}`, {
    method: 'DELETE',
    token,
    action: 'subCategories.delete',
  });
}
