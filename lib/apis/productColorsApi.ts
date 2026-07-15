import { apiRequest } from '@/lib/api/client';
import { CreateProductColorRequest, ProductColor, UpdateProductColorRequest } from '@/lib/models/product';

const hiddenHexCode = '---';

function appendFiles(formData: FormData, key: string, files: File[]) {
  files.forEach((file) => {
    formData.append(key, file);
  });
}

function appendStrings(formData: FormData, key: string, values: string[]) {
  values.forEach((value) => {
    if (value.trim()) formData.append(key, value);
  });
}

export function getProductColors(productId: number, token: string | null) {
  return apiRequest<ProductColor[]>(`/product-colors/product/${productId}`, {
    token,
    action: 'productColors.listByProduct',
  });
}

export function createProductColor(payload: CreateProductColorRequest, token: string) {
  const formData = new FormData();
  formData.append('ProductId', String(payload.productId));
  formData.append('ColorName', payload.colorName.trim());
  formData.append('HexCode', hiddenHexCode);
  appendFiles(formData, 'Images', payload.images);

  return apiRequest<ProductColor>('/product-colors', {
    method: 'POST',
    body: formData,
    token,
    action: 'productColors.create',
  });
}

export function updateProductColor(id: number, payload: UpdateProductColorRequest, token: string) {
  const formData = new FormData();
  formData.append('ColorName', payload.colorName.trim());
  formData.append('HexCode', hiddenHexCode);
  appendStrings(formData, 'ImageUrls', payload.imageUrls);

  return apiRequest<ProductColor>(`/product-colors/${id}`, {
    method: 'PUT',
    body: formData,
    token,
    action: 'productColors.update',
  });
}

export function deleteProductColor(id: number, token: string) {
  return apiRequest<null>(`/product-colors/${id}`, {
    method: 'DELETE',
    token,
    action: 'productColors.delete',
  });
}
