import { apiRequest } from '@/lib/api/client';
import {
  Blog,
  BlogListParams,
  BlogSectionsRequest,
  CreateBlogRequest,
  UpdateBlogRequest,
} from '@/lib/models/blog';

function buildBlogsQuery(params: BlogListParams = {}) {
  const query = new URLSearchParams();

  if (params.pageNumber) query.set('PageNumber', String(params.pageNumber));
  if (params.pageSize) query.set('PageSize', String(params.pageSize));
  if (params.search?.trim()) query.set('Search', params.search.trim());

  const queryString = query.toString();
  return queryString ? `/Blogs?${queryString}` : '/Blogs';
}

function buildBlogFormData(payload: CreateBlogRequest | UpdateBlogRequest) {
  const formData = new FormData();
  formData.append('CategoryId', String(payload.categoryId));
  formData.append('Title', payload.title);
  formData.append('Description', payload.description);

  if ('image' in payload && payload.image) {
    formData.append('Image', payload.image);
  }

  return formData;
}

export function getBlogs(token: string | null, params?: BlogListParams) {
  return apiRequest<Blog[]>(buildBlogsQuery(params), {
    token,
    action: 'blogs.list',
  });
}

export function getBlogById(id: number, token: string | null) {
  return apiRequest<Blog>(`/Blogs/${id}`, {
    token,
    action: 'blogs.details',
  });
}

export function createBlog(payload: CreateBlogRequest, token: string) {
  return apiRequest<Blog>('/Blogs', {
    method: 'POST',
    body: buildBlogFormData(payload),
    token,
    action: 'blogs.create',
  });
}

export function updateBlog(id: number, payload: UpdateBlogRequest, token: string) {
  return apiRequest<Blog>(`/Blogs/${id}`, {
    method: 'PUT',
    body: buildBlogFormData(payload),
    token,
    action: 'blogs.update',
  });
}

export function deleteBlog(id: number, token: string) {
  return apiRequest<null>(`/Blogs/${id}`, {
    method: 'DELETE',
    token,
    action: 'blogs.delete',
  });
}

export function createBlogSections(blogId: number, payload: BlogSectionsRequest, token: string) {
  return apiRequest<null>(`/Blogs/${blogId}/sections`, {
    method: 'POST',
    body: payload,
    token,
    action: 'blogs.sections.create',
  });
}

export function updateBlogSections(blogId: number, payload: BlogSectionsRequest, token: string) {
  return apiRequest<null>(`/Blogs/${blogId}/sections`, {
    method: 'PUT',
    body: payload,
    token,
    action: 'blogs.sections.update',
  });
}
