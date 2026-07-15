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

export function slugifyProductName(name: string) {
  const slug = name
    .toLowerCase()
    .trim()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return slug || 'product';
}

export function getProductPath(product: Pick<Product, 'id' | 'name'>) {
  return `/products/${product.id}-${slugifyProductName(product.name)}`;
}

export function getProductIdFromParam(value: string) {
  const [idPart] = value.split('-');
  const productId = Number(idPart);

  return Number.isFinite(productId) && productId > 0 ? productId : null;
}
