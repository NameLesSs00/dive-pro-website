'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createReview, deleteReview, getReviewById, getReviews, updateReview } from '@/lib/apis/reviewsApi';
import { CreateReviewRequest, Review, ReviewListParams, UpdateReviewRequest } from '@/lib/models/review';
import { productsQueryKey } from '@/features/products/productQueries';

export const reviewsQueryKey = ['reviews'];

type ReviewListCache = {
  reviews: Review[];
  pagination: {
    pageNumber?: number;
    pageSize?: number;
    totalCount?: number;
    totalPages?: number;
    [key: string]: unknown;
  } | null;
};

export function useReviews(token: string | null, params: ReviewListParams) {
  return useQuery({
    queryKey: [...reviewsQueryKey, params],
    queryFn: async (): Promise<ReviewListCache> => {
      if (!token) throw new Error('You need to login again.');
      const response = await getReviews(token, params);
      return {
        reviews: response.data,
        pagination: response.pagination,
      };
    },
    enabled: Boolean(token),
  });
}

export function useReview(id: number | null, token: string | null) {
  return useQuery({
    queryKey: [...reviewsQueryKey, 'details', id],
    queryFn: async (): Promise<Review> => {
      if (!id) throw new Error('Review not found.');
      if (!token) throw new Error('You need to login again.');
      const response = await getReviewById(id, token);
      return response.data;
    },
    enabled: Boolean(id && token),
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateReviewRequest) => {
      const response = await createReview(payload);
      return response.data;
    },
    onSuccess: (createdReview) => {
      queryClient.invalidateQueries({
        queryKey: [...productsQueryKey, 'public', 'average-review', createdReview.productId],
      });
    },
  });
}

export function useUpdateReview(token: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: UpdateReviewRequest }) => {
      if (!token) throw new Error('You need to login again.');
      const response = await updateReview(id, payload, token);
      return response.data;
    },
    onSuccess: (updatedReview) => {
      queryClient.setQueriesData<ReviewListCache>({ queryKey: reviewsQueryKey }, (current) => {
        if (!current) return current;
        return {
          ...current,
          reviews: current.reviews.map((review) => (review.id === updatedReview.id ? updatedReview : review)),
        };
      });
    },
  });
}

export function useDeleteReview(token: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      if (!token) throw new Error('You need to login again.');
      await deleteReview(id, token);
      return id;
    },
    onSuccess: (deletedReviewId) => {
      queryClient.setQueriesData<ReviewListCache>({ queryKey: reviewsQueryKey }, (current) => {
        if (!current) return current;

        const reviews = current.reviews.filter((review) => review.id !== deletedReviewId);
        return {
          ...current,
          reviews,
          pagination: current.pagination
            ? {
                ...current.pagination,
                totalCount: Math.max(0, Number(current.pagination.totalCount ?? reviews.length + 1) - 1),
              }
            : current.pagination,
        };
      });
    },
  });
}
