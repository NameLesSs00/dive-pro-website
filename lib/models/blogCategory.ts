export interface BlogCategory {
  id: number;
  name: string;
  imageUrl: string;
}

export interface BlogCategoryListParams {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
}

export interface CreateBlogCategoryRequest {
  name: string;
  image: File;
}

export interface UpdateBlogCategoryRequest {
  name: string;
  image?: File | null;
}
