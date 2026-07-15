import { apiRequest } from '@/lib/api/client';
import { CreateFaqRequest, Faq, FaqListParams, UpdateFaqRequest } from '@/lib/models/faq';

function buildFaqQuery(params: FaqListParams = {}) {
  const query = new URLSearchParams();

  if (params.pageNumber) query.set('PageNumber', String(params.pageNumber));
  if (params.pageSize) query.set('PageSize', String(params.pageSize));
  if (params.search?.trim()) query.set('Search', params.search.trim());

  const queryString = query.toString();
  return queryString ? `/faqs?${queryString}` : '/faqs';
}

export function getFaqs(token: string | null, params?: FaqListParams) {
  return apiRequest<Faq[]>(buildFaqQuery(params), {
    token,
    action: 'faqs.list',
  });
}

export function getFaqById(id: number, token: string | null) {
  return apiRequest<Faq>(`/faqs/${id}`, {
    token,
    action: 'faqs.details',
  });
}

export function createFaq(payload: CreateFaqRequest, token: string) {
  return apiRequest<Faq>('/faqs', {
    method: 'POST',
    body: payload,
    token,
    action: 'faqs.create',
  });
}

export function updateFaq(id: number, payload: UpdateFaqRequest, token: string) {
  return apiRequest<Faq>(`/faqs/${id}`, {
    method: 'PUT',
    body: payload,
    token,
    action: 'faqs.update',
  });
}

export function deleteFaq(id: number, token: string) {
  return apiRequest<null>(`/faqs/${id}`, {
    method: 'DELETE',
    token,
    action: 'faqs.delete',
  });
}
