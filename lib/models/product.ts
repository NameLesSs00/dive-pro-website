export type ProductType = 'Shorty' | 'Full';

export interface ProductSectionItem {
  productSectionId: number;
  key: string;
  value: string;
}

export interface ProductSection {
  id: number;
  name: string;
  items: ProductSectionItem[];
}

export interface ProductColor {
  id: number;
  productId: number;
  colorName: string;
  hexCode: string;
  images: string[];
}

export interface CreateProductColorRequest {
  productId: number;
  colorName: string;
  images: File[];
}

export interface UpdateProductColorRequest {
  colorName: string;
  imageUrls: string[];
}

export interface ProductSize {
  sizeId: number;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  categoryId: number;
  categoryName: string;
  subCategoryId: number;
  subCategoryName: string;
  materialId: number;
  materialName: string;
  type: ProductType;
  isFeatured: boolean;
  sections: ProductSection[];
  colors: ProductColor[];
  sizes: ProductSize[];
  highlights: string[];
}

export interface ProductReviewSummary {
  productId: number;
  averageRate: number;
  totalReviews: number;
}

export interface ProductListParams {
  categoryId?: number | string | null;
  subCategoryId?: number | string | null;
  materialId?: number | string | null;
  type?: ProductType | string | null;
  color?: string | null;
  sizeId?: number | string | null;
  size?: string | null;
  sectionName?: string | null;
  key?: string | null;
  value?: string | null;
  pageNumber?: number;
  pageSize?: number;
  search?: string;
}

export interface ProductSectionItemInput {
  key: string;
  value: string;
}

export interface ProductSectionInput {
  name: string;
  items: ProductSectionItemInput[];
}

export interface CreateProductRequest {
  name: string;
  description: string;
  categoryId: number;
  subCategoryId: number;
  materialId: number;
  type: ProductType;
  isFeatured: boolean;
  sizes: number[];
  sections: ProductSectionInput[];
  highlights: string[];
}

export type UpdateProductRequest = CreateProductRequest;
