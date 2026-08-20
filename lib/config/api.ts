export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://divebro.premiumasp.net/api';

export const API_ASSET_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, '');

export function getApiAssetUrl(path: string | null | undefined) {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;

  const normalizedBase = API_ASSET_BASE_URL.replace(/\/$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  return `${normalizedBase}${normalizedPath}`;
}
