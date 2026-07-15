import { apiRequest } from '@/lib/api/client';
import {
  BlogCategory,
  BlogCategoryListParams,
  CreateBlogCategoryRequest,
  UpdateBlogCategoryRequest,
} from '@/lib/models/blogCategory';

function buildBlogCategoryQuery(params: BlogCategoryListParams = {}) {
  const query = new URLSearchParams();

  if (params.pageNumber) query.set('PageNumber', String(params.pageNumber));
  if (params.pageSize) query.set('PageSize', String(params.pageSize));
  if (params.search?.trim()) query.set('Search', params.search.trim());

  const queryString = query.toString();
  return queryString ? `/blog-categories?${queryString}` : '/blog-categories';
}

function buildBlogCategoryFormData(payload: CreateBlogCategoryRequest | UpdateBlogCategoryRequest) {
  const formData = new FormData();
  formData.append('Name', payload.name);

  if ('image' in payload && payload.image) {
    formData.append('ImageUrl', payload.image);
  }

  return formData;
}

export function getBlogCategories(token: string | null, params?: BlogCategoryListParams) {
  return apiRequest<BlogCategory[]>(buildBlogCategoryQuery(params), {
    token,
    action: 'blogCategories.list',
  });
}

export function getBlogCategoryById(id: number, token: string | null) {
  return apiRequest<BlogCategory>(`/blog-categories/${id}`, {
    token,
    action: 'blogCategories.details',
  });
}

export function createBlogCategory(payload: CreateBlogCategoryRequest, token: string) {
  return apiRequest<BlogCategory>('/blog-categories', {
    method: 'POST',
    body: buildBlogCategoryFormData(payload),
    token,
    action: 'blogCategories.create',
  });
}

export function updateBlogCategory(id: number, payload: UpdateBlogCategoryRequest, token: string) {
  return apiRequest<BlogCategory>(`/blog-categories/${id}`, {
    method: 'PUT',
    body: buildBlogCategoryFormData(payload),
    token,
    action: 'blogCategories.update',
  });
}

export function deleteBlogCategory(id: number, token: string) {
  return apiRequest<null>(`/blog-categories/${id}`, {
    method: 'DELETE',
    token,
    action: 'blogCategories.delete',
  });
}
