import { apiRequest } from '@/lib/api/client';
import { Category, CategoryListParams, CreateCategoryRequest, UpdateCategoryRequest } from '@/lib/models/category';

function buildCategoryQuery(params: CategoryListParams = {}) {
  const query = new URLSearchParams();

  if (params.pageNumber) query.set('PageNumber', String(params.pageNumber));
  if (params.pageSize) query.set('PageSize', String(params.pageSize));
  if (params.search?.trim()) query.set('Search', params.search.trim());

  const queryString = query.toString();
  return queryString ? `/categories?${queryString}` : '/categories';
}

function buildCategoryFormData(payload: CreateCategoryRequest | UpdateCategoryRequest) {
  const formData = new FormData();
  formData.append('Name', payload.name);

  if ('image' in payload && payload.image) {
    formData.append('ImageUrl', payload.image);
  }

  return formData;
}

export function getCategories(token: string, params?: CategoryListParams) {
  return apiRequest<Category[]>(buildCategoryQuery(params), {
    token,
    action: 'categories.list',
  });
}

export function getCategoryById(id: number, token: string) {
  return apiRequest<Category>(`/categories/${id}`, {
    token,
    action: 'categories.details',
  });
}

export function createCategory(payload: CreateCategoryRequest, token: string) {
  return apiRequest<Category>('/categories', {
    method: 'POST',
    body: buildCategoryFormData(payload),
    token,
    action: 'categories.create',
  });
}

export function updateCategory(id: number, payload: UpdateCategoryRequest, token: string) {
  return apiRequest<Category>(`/categories/${id}`, {
    method: 'PUT',
    body: buildCategoryFormData(payload),
    token,
    action: 'categories.update',
  });
}

export function deleteCategory(id: number, token: string) {
  return apiRequest<null>(`/categories/${id}`, {
    method: 'DELETE',
    token,
    action: 'categories.delete',
  });
}
