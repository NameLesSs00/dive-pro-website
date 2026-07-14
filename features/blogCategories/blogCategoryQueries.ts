'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createBlogCategory,
  deleteBlogCategory,
  getBlogCategories,
  updateBlogCategory,
} from '@/lib/apis/blogCategoriesApi';
import {
  BlogCategory,
  BlogCategoryListParams,
  CreateBlogCategoryRequest,
  UpdateBlogCategoryRequest,
} from '@/lib/models/blogCategory';
import { ApiError } from '@/lib/models/apiResponse';

export const blogCategoriesQueryKey = ['blog-categories'];

type BlogCategoryListCache = {
  blogCategories: BlogCategory[];
  pagination: {
    pageNumber?: number;
    pageSize?: number;
    totalCount?: number;
    totalPages?: number;
    [key: string]: unknown;
  } | null;
};

export function useBlogCategories(token: string | null, params: BlogCategoryListParams) {
  return useQuery({
    queryKey: [...blogCategoriesQueryKey, params],
    queryFn: async (): Promise<BlogCategoryListCache> => {
      if (!token) throw new Error('You need to login again.');
      const response = await getBlogCategories(token, params);
      return {
        blogCategories: response.data,
        pagination: response.pagination,
      };
    },
    enabled: Boolean(token),
  });
}

export function useCreateBlogCategory(token: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateBlogCategoryRequest) => {
      if (!token) throw new Error('You need to login again.');
      const response = await createBlogCategory(payload, token);
      return response.data;
    },
    onSuccess: (createdBlogCategory) => {
      queryClient.setQueriesData<BlogCategoryListCache>({ queryKey: blogCategoriesQueryKey }, (current) => {
        if (!current) return current;

        const withoutDuplicate = current.blogCategories.filter(
          (blogCategory) => blogCategory.id !== createdBlogCategory.id
        );
        return {
          ...current,
          blogCategories: [createdBlogCategory, ...withoutDuplicate],
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

export function useUpdateBlogCategory(token: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: UpdateBlogCategoryRequest }) => {
      if (!token) throw new Error('You need to login again.');
      const response = await updateBlogCategory(id, payload, token);
      return response.data;
    },
    onSuccess: (updatedBlogCategory) => {
      queryClient.setQueriesData<BlogCategoryListCache>({ queryKey: blogCategoriesQueryKey }, (current) => {
        if (!current) return current;

        return {
          ...current,
          blogCategories: current.blogCategories.map((blogCategory) =>
            blogCategory.id === updatedBlogCategory.id ? updatedBlogCategory : blogCategory
          ),
        };
      });
    },
  });
}

export function useDeleteBlogCategory(token: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      if (!token) throw new Error('You need to login again.');
      try {
        await deleteBlogCategory(id, token);
      } catch (error) {
        if (
          error instanceof ApiError &&
          [error.message, ...error.errors].some((message) => /blog.?categor(y|ies).+not found/i.test(message))
        ) {
          return id;
        }

        throw error;
      }
      return id;
    },
    onSuccess: (deletedBlogCategoryId) => {
      queryClient.setQueriesData<BlogCategoryListCache>({ queryKey: blogCategoriesQueryKey }, (current) => {
        if (!current) return current;

        const blogCategories = current.blogCategories.filter(
          (blogCategory) => blogCategory.id !== deletedBlogCategoryId
        );
        return {
          ...current,
          blogCategories,
          pagination: current.pagination
            ? {
                ...current.pagination,
                totalCount: Math.max(0, Number(current.pagination.totalCount ?? blogCategories.length + 1) - 1),
              }
            : current.pagination,
        };
      });
    },
  });
}
