import { API_BASE_URL } from '@/lib/config/api';
import { ApiError, ApiPagination, ApiResponse } from '@/lib/models/apiResponse';

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
    const normalized = errors
      .flatMap((error) => {
        if (typeof error === 'string') return [error];
        if (error && typeof error === 'object') {
          return Object.values(error)
            .flat()
            .filter((value): value is string => typeof value === 'string');
        }
        return [];
      })
      .filter(Boolean);

    if (normalized.length) return normalized;
  }

  if (errors && typeof errors === 'object') {
    const normalized = Object.values(errors)
      .flat()
      .filter((value): value is string => typeof value === 'string');

    if (normalized.length) return normalized;
  }

  if (typeof errors === 'string') return [errors];

  return message ? [message] : ['Something went wrong. Please try again.'];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function normalizePagination(value: unknown): ApiPagination | null {
  return isRecord(value) ? value : null;
}

export async function apiRequest<T>(
  path: string,
  { method = 'GET', body, token, action }: ApiRequestOptions
): Promise<ApiResponse<T>> {
  const url = buildUrl(path);
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;

  if (process.env.NODE_ENV === 'development') {
    console.info(`[api] ${action}: ${method} ${url}`);
  }

  const response = await fetch(url, {
    method,
    headers: {
      accept: '*/*',
      ...(body && !isFormData ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
  });

  let payload: unknown = null;

  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  const payloadRecord = isRecord(payload) ? payload : null;
  const isWrappedResponse = typeof payloadRecord?.success === 'boolean';

  if (!response.ok || (isWrappedResponse && !payloadRecord.success)) {
    const message =
      (typeof payloadRecord?.message === 'string' && payloadRecord.message) || response.statusText || 'Request failed.';
    throw new ApiError({
      message,
      errors: normalizeErrors(message, payloadRecord?.errors),
      status: response.status,
      pagination: normalizePagination(payloadRecord?.pagination),
    });
  }

  if (isWrappedResponse) {
    return {
      success: true,
      message: typeof payloadRecord.message === 'string' ? payloadRecord.message : '',
      data: payloadRecord.data as T,
      errors: Array.isArray(payloadRecord.errors) ? payloadRecord.errors.filter((error): error is string => typeof error === 'string') : [],
      pagination: normalizePagination(payloadRecord.pagination),
    };
  }

  if (response.status === 204 || payload === null) {
    return {
      success: true,
      message: '',
      data: null as T,
      errors: [],
      pagination: null,
    };
  }

  const data = payloadRecord && 'items' in payloadRecord ? payloadRecord.items : payload;

  return {
    success: true,
    message: '',
    data: data as T,
    errors: [],
    pagination: normalizePagination(payloadRecord?.pagination),
  };
}
