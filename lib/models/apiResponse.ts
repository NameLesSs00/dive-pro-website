export interface ApiPagination {
  pageNumber?: number;
  pageSize?: number;
  totalCount?: number;
  totalPages?: number;
  [key: string]: unknown;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors: string[];
  pagination: ApiPagination | null;
}

export class ApiError extends Error {
  errors: string[];
  status: number;
  pagination: ApiPagination | null;

  constructor({
    message,
    errors = [],
    status,
    pagination = null,
  }: {
    message: string;
    errors?: string[];
    status: number;
    pagination?: ApiPagination | null;
  }) {
    super(message);
    this.name = 'ApiError';
    this.errors = errors;
    this.status = status;
    this.pagination = pagination;
  }
}
