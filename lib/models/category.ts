export interface Category {
  id: number;
  name: string;
  order: string;
  imageUrl: string;
  productCount: number;
}

export interface CategoryListParams {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
}

export interface CreateCategoryRequest {
  name: string;
  order: string;
  image: File;
}

export interface UpdateCategoryRequest {
  name: string;
  order: string;
  image?: File | null;
}
