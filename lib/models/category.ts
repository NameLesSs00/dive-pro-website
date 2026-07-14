export interface Category {
  id: number;
  name: string;
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
  image: File;
}

export interface UpdateCategoryRequest {
  name: string;
  image?: File | null;
}
