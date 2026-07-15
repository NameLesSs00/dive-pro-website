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

function normalizeProductId(value: unknown) {
  const productId = Number(value);
  return Number.isFinite(productId) ? productId : null;
}

function isSameProductReview(review: Review, productId: number) {
  return normalizeProductId(review.productId) === productId;
}

function buildOptimisticReview(payload: CreateReviewRequest): Review {
  return {
    id: -Date.now(),
    productId: payload.productId,
    name: payload.name,
    email: payload.email,
    comment: payload.comment,
    rate: payload.rate,
    createdAt: new Date().toISOString(),
  };
}

function upsertProductReview(current: ReviewListCache | undefined, review: Review, previousId?: number) {
  if (!current) {
    return {
      reviews: [review],
      pagination: {
        pageNumber: 1,
        pageSize: 100,
        totalCount: 1,
      },
    };
  }

  const withoutDuplicate = current.reviews.filter(
    (currentReview) => currentReview.id !== review.id && currentReview.id !== previousId,
  );

  return {
    ...current,
    reviews: [review, ...withoutDuplicate],
    pagination: current.pagination
      ? {
          ...current.pagination,
          totalCount: Math.max(
            Number(current.pagination.totalCount ?? withoutDuplicate.length),
            withoutDuplicate.length + 1,
          ),
        }
      : current.pagination,
  };
}

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

export function usePublicProductReviews(productId: number | null, params: ReviewListParams = { pageNumber: 1, pageSize: 100 }) {
  return useQuery({
    queryKey: [...reviewsQueryKey, 'public', 'product', productId, params],
    queryFn: async (): Promise<ReviewListCache> => {
      if (!productId) throw new Error('Product not found.');
      const response = await getReviews(null, params);
      const reviews = response.data.filter((review) => isSameProductReview(review, productId));

      return {
        reviews,
        pagination: response.pagination,
      };
    },
    enabled: Boolean(productId),
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
    mutationFn: async (payload: CreateReviewRequest): Promise<Review> => {
      const response = await createReview(payload);
      return response.data ?? buildOptimisticReview(payload);
    },
    onMutate: async (payload) => {
      const optimisticReview = buildOptimisticReview(payload);
      await queryClient.cancelQueries({
        queryKey: [...reviewsQueryKey, 'public', 'product', payload.productId],
      });

      queryClient.setQueriesData<ReviewListCache>(
        { queryKey: [...reviewsQueryKey, 'public', 'product', payload.productId] },
        (current) => upsertProductReview(current, optimisticReview),
      );

      return { optimisticReview };
    },
    onSuccess: (createdReview, payload, context) => {
      const productId = normalizeProductId(createdReview.productId) ?? payload.productId;
      const review = {
        ...createdReview,
        productId,
        name: createdReview.name ?? payload.name,
        email: createdReview.email ?? payload.email,
        comment: createdReview.comment ?? payload.comment,
        rate: createdReview.rate ?? payload.rate,
      };

      queryClient.invalidateQueries({
        queryKey: [...productsQueryKey, 'public', 'average-review', productId],
      });
      queryClient.setQueriesData<ReviewListCache>(
        { queryKey: [...reviewsQueryKey, 'public', 'product', productId] },
        (current) => upsertProductReview(current, review, context?.optimisticReview.id),
      );
    },
    onSettled: (_createdReview, _error, payload) => {
      queryClient.invalidateQueries({
        queryKey: [...reviewsQueryKey, 'public', 'product', payload.productId],
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
