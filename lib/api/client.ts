import { API_BASE_URL } from '@/lib/config/api';
import { ApiError, ApiResponse } from '@/lib/models/apiResponse';

type ApiRequestOptions = {
  method?: string;
  body?: unknown;
  token?: string | null;
  action: string;
};

function buildUrl(path: string) {
  const normalizedBase = API_BASE_URL.replace(/\/$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
}

function normalizeErrors(message: string, errors: unknown): string[] {
  if (Array.isArray(errors)) {
    return errors.filter((error): error is string => typeof error === 'string');
  }

  return message ? [message] : ['Something went wrong. Please try again.'];
}

export async function apiRequest<T>(
  path: string,
  { method = 'GET', body, token, action }: ApiRequestOptions
): Promise<ApiResponse<T>> {
  const url = buildUrl(path);

  if (process.env.NODE_ENV === 'development') {
    console.info(`[api] ${action}: ${method} ${url}`);
  }

  const response = await fetch(url, {
    method,
    headers: {
      accept: '*/*',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  let payload: ApiResponse<T> | null = null;

  try {
    payload = (await response.json()) as ApiResponse<T>;
  } catch {
    payload = null;
  }

  if (!response.ok || !payload?.success) {
    const message = payload?.message || response.statusText || 'Request failed.';
    throw new ApiError({
      message,
      errors: normalizeErrors(message, payload?.errors),
      status: response.status,
      pagination: payload?.pagination ?? null,
    });
  }

  return payload;
}
