import { apiRequest } from '@/lib/api/client';
import { CreateReviewRequest, Review, ReviewListParams, UpdateReviewRequest } from '@/lib/models/review';

function buildReviewsQuery(params: ReviewListParams = {}) {
  const query = new URLSearchParams();

  if (params.pageNumber) query.set('PageNumber', String(params.pageNumber));
  if (params.pageSize) query.set('PageSize', String(params.pageSize));
  if (params.search?.trim()) query.set('Search', params.search.trim());

  const queryString = query.toString();
  return queryString ? `/reviews?${queryString}` : '/reviews';
}

export function getReviews(token: string, params?: ReviewListParams) {
  return apiRequest<Review[]>(buildReviewsQuery(params), {
    token,
    action: 'reviews.list',
  });
}

export function createReview(payload: CreateReviewRequest) {
  return apiRequest<Review>('/reviews', {
    method: 'POST',
    body: payload,
    token: null,
    action: 'reviews.create',
  });
}

export function getReviewById(id: number, token: string) {
  return apiRequest<Review>(`/reviews/${id}`, {
    token,
    action: 'reviews.details',
  });
}

export function updateReview(id: number, payload: UpdateReviewRequest, token: string) {
  return apiRequest<Review>(`/reviews/${id}`, {
    method: 'PUT',
    body: payload,
    token,
    action: 'reviews.update',
  });
}

export function deleteReview(id: number, token: string) {
  return apiRequest<null>(`/reviews/${id}`, {
    method: 'DELETE',
    token,
    action: 'reviews.delete',
  });
}
