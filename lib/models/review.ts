export interface Review {
  id: number;
  productId: number;
  productName?: string;
  name: string;
  email: string;
  comment: string;
  rate: number;
  createdAt?: string;
}

export interface ReviewListParams {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
}

export interface CreateReviewRequest {
  productId: number;
  name: string;
  email: string;
  comment: string;
  rate: number;
}

export interface UpdateReviewRequest {
  id: number;
  name: string;
  email: string;
  comment: string;
  rate: number;
}
