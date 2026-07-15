import { getApiAssetUrl } from '@/lib/config/api';
import { Product } from '@/lib/models/product';

export const fallbackProductImage = '/products/Dumm/iamge1.png';

export function getProductImage(product: Product | null | undefined) {
  const firstImage = product?.colors?.flatMap((color) => color.images ?? []).find(Boolean);
  return getApiAssetUrl(firstImage) || fallbackProductImage;
}

export function getProductSubtitle(product: Product) {
  return product.subCategoryName || product.categoryName || product.type || 'Dive Pro gear';
}
