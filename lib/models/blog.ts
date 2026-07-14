export interface BlogSection {
  id: number;
  sectionNo: number;
  title: string;
  description: string;
}

export interface Blog {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  categoryId: number;
  categoryName: string | null;
  sections: BlogSection[];
}

export interface BlogListParams {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
}

export interface BlogSectionInput {
  sectionNo: number;
  title: string;
  description: string;
}

export interface BlogSectionsRequest {
  sections: BlogSectionInput[];
}

export interface CreateBlogRequest {
  categoryId: number;
  title: string;
  description: string;
  image: File;
}

export interface UpdateBlogRequest {
  categoryId: number;
  title: string;
  description: string;
  image?: File | null;
}
