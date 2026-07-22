export interface SubCategory {
  id: number;
  name: string;
  categoryId: number;
  order: number;
}

export interface SubCategoryListParams {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
}

export interface CreateSubCategoryRequest {
  name: string;
  order: number;
  categoryId: number;
}

export interface UpdateSubCategoryRequest {
  name: string;
  order: number;
  categoryId: number;
}
