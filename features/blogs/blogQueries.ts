'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createBlog,
  createBlogSections,
  deleteBlog,
  getBlogs,
  updateBlog,
  updateBlogSections,
} from '@/lib/apis/blogsApi';
import {
  Blog,
  BlogListParams,
  BlogSectionInput,
  BlogSectionsRequest,
  CreateBlogRequest,
  UpdateBlogRequest,
} from '@/lib/models/blog';
import { ApiError } from '@/lib/models/apiResponse';

export const blogsQueryKey = ['blogs'];

type BlogListCache = {
  blogs: Blog[];
  pagination: {
    pageNumber?: number;
    pageSize?: number;
    totalCount?: number;
    totalPages?: number;
    [key: string]: unknown;
  } | null;
};

type CreateBlogMutationPayload = {
  blog: CreateBlogRequest;
  sections: BlogSectionInput[];
};

type UpdateBlogMutationPayload = {
  id: number;
  blog: UpdateBlogRequest;
  sections: BlogSectionInput[];
};

function toCachedSections(sections: BlogSectionInput[], existingBlog?: Blog): Blog['sections'] {
  return sections.map((section, index) => ({
    id: existingBlog?.sections?.[index]?.id ?? -(index + 1),
    sectionNo: section.sectionNo,
    title: section.title,
    description: section.description,
  }));
}

function mergeBlogSections(blog: Blog, sections: BlogSectionInput[]) {
  return {
    ...blog,
    sections: sections.length ? toCachedSections(sections, blog) : [],
  };
}

export function useBlogs(token: string | null, params: BlogListParams) {
  return useQuery({
    queryKey: [...blogsQueryKey, params],
    queryFn: async (): Promise<BlogListCache> => {
      if (!token) throw new Error('You need to login again.');
      const response = await getBlogs(token, params);
      return {
        blogs: response.data,
        pagination: response.pagination,
      };
    },
    enabled: Boolean(token),
  });
}

export function useCreateBlog(token: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ blog, sections }: CreateBlogMutationPayload) => {
      if (!token) throw new Error('You need to login again.');
      const response = await createBlog(blog, token);
      const createdBlog = response.data;

      if (sections.length) {
        await createBlogSections(createdBlog.id, { sections }, token);
      }

      return mergeBlogSections(createdBlog, sections);
    },
    onSuccess: (createdBlog) => {
      queryClient.setQueriesData<BlogListCache>({ queryKey: blogsQueryKey }, (current) => {
        if (!current) return current;

        const withoutDuplicate = current.blogs.filter((blog) => blog.id !== createdBlog.id);
        return {
          ...current,
          blogs: [createdBlog, ...withoutDuplicate],
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

export function useUpdateBlog(token: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, blog, sections }: UpdateBlogMutationPayload) => {
      if (!token) throw new Error('You need to login again.');
      const response = await updateBlog(id, blog, token);
      await updateBlogSections(id, { sections }, token);
      return mergeBlogSections(response.data, sections);
    },
    onSuccess: (updatedBlog) => {
      queryClient.setQueriesData<BlogListCache>({ queryKey: blogsQueryKey }, (current) => {
        if (!current) return current;

        return {
          ...current,
          blogs: current.blogs.map((blog) => (blog.id === updatedBlog.id ? updatedBlog : blog)),
        };
      });
    },
  });
}

export function useDeleteBlog(token: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      if (!token) throw new Error('You need to login again.');
      try {
        await deleteBlog(id, token);
      } catch (error) {
        if (
          error instanceof ApiError &&
          [error.message, ...error.errors].some((message) => /blog.+not found/i.test(message))
        ) {
          return id;
        }

        throw error;
      }
      return id;
    },
    onSuccess: (deletedBlogId) => {
      queryClient.setQueriesData<BlogListCache>({ queryKey: blogsQueryKey }, (current) => {
        if (!current) return current;

        const blogs = current.blogs.filter((blog) => blog.id !== deletedBlogId);
        return {
          ...current,
          blogs,
          pagination: current.pagination
            ? {
                ...current.pagination,
                totalCount: Math.max(0, Number(current.pagination.totalCount ?? blogs.length + 1) - 1),
              }
            : current.pagination,
        };
      });
    },
  });
}

export function useCreateBlogSections(token: string | null) {
  return useMutation({
    mutationFn: async ({ blogId, payload }: { blogId: number; payload: BlogSectionsRequest }) => {
      if (!token) throw new Error('You need to login again.');
      await createBlogSections(blogId, payload, token);
      return { blogId, sections: payload.sections };
    },
  });
}

export function useUpdateBlogSections(token: string | null) {
  return useMutation({
    mutationFn: async ({ blogId, payload }: { blogId: number; payload: BlogSectionsRequest }) => {
      if (!token) throw new Error('You need to login again.');
      await updateBlogSections(blogId, payload, token);
      return { blogId, sections: payload.sections };
    },
  });
}
