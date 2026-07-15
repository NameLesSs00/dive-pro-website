import { apiRequest } from '@/lib/api/client';
import {
  CreateProductRequest,
  Product,
  ProductListParams,
  ProductReviewSummary,
  UpdateProductRequest,
} from '@/lib/models/product';

function setNumberOrString(query: URLSearchParams, key: string, value: number | string | null | undefined) {
  if (value === null || value === undefined || value === '') return;
  query.set(key, String(value));
}

function buildProductsQuery(params: ProductListParams = {}) {
  const query = new URLSearchParams();

  setNumberOrString(query, 'CategoryId', params.categoryId);
  setNumberOrString(query, 'SubCategoryId', params.subCategoryId);
  setNumberOrString(query, 'MaterialId', params.materialId);
  setNumberOrString(query, 'Type', params.type);
  setNumberOrString(query, 'Color', params.color);
  setNumberOrString(query, 'SizeId', params.sizeId);
  setNumberOrString(query, 'Size', params.size);
  setNumberOrString(query, 'SectionName', params.sectionName);
  setNumberOrString(query, 'Key', params.key);
  setNumberOrString(query, 'Value', params.value);
  if (params.pageNumber) query.set('PageNumber', String(params.pageNumber));
  if (params.pageSize) query.set('PageSize', String(params.pageSize));
  if (params.search?.trim()) query.set('Search', params.search.trim());

  const queryString = query.toString();
  return queryString ? `/products?${queryString}` : '/products';
}

export function getProducts(token: string | null, params?: ProductListParams) {
  return apiRequest<Product[]>(buildProductsQuery(params), {
    token,
    action: 'products.list',
  });
}

export function getProductById(id: number, token: string | null) {
  return apiRequest<Product>(`/products/${id}`, {
    token,
    action: 'products.details',
  });
}

export function createProduct(payload: CreateProductRequest, token: string) {
  return apiRequest<Product>('/products', {
    method: 'POST',
    body: payload,
    token,
    action: 'products.create',
  });
}

export function updateProduct(id: number, payload: UpdateProductRequest, token: string) {
  return apiRequest<Product>(`/products/${id}`, {
    method: 'PUT',
    body: payload,
    token,
    action: 'products.update',
  });
}

export function deleteProduct(id: number, token: string) {
  return apiRequest<null>(`/products/${id}`, {
    method: 'DELETE',
    token,
    action: 'products.delete',
  });
}

export function getProductAverageReview(id: number, token: string | null) {
  return apiRequest<ProductReviewSummary>(`/products/${id}/average-review`, {
    token,
    action: 'products.averageReview',
  });
}
