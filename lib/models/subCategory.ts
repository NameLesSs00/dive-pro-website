export interface SubCategory {
  id: number;
  name: string;
  categoryId: number;
}

export interface SubCategoryListParams {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
}

export interface CreateSubCategoryRequest {
  name: string;
  categoryId: number;
}

export interface UpdateSubCategoryRequest {
  name: string;
  categoryId: number;
}
