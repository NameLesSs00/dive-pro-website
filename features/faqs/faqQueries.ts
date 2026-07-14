'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createFaq, deleteFaq, getFaqs, updateFaq } from '@/lib/apis/faqsApi';
import { CreateFaqRequest, Faq, FaqListParams, UpdateFaqRequest } from '@/lib/models/faq';

export const faqsQueryKey = ['faqs'];

type FaqListCache = {
  faqs: Faq[];
  pagination: {
    pageNumber?: number;
    pageSize?: number;
    totalCount?: number;
    totalPages?: number;
    [key: string]: unknown;
  } | null;
};

export function useFaqs(token: string | null, params: FaqListParams) {
  return useQuery({
    queryKey: [...faqsQueryKey, params],
    queryFn: async (): Promise<FaqListCache> => {
      if (!token) throw new Error('You need to login again.');
      const response = await getFaqs(token, params);
      return {
        faqs: response.data,
        pagination: response.pagination,
      };
    },
    enabled: Boolean(token),
  });
}

export function useCreateFaq(token: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateFaqRequest) => {
      if (!token) throw new Error('You need to login again.');
      const response = await createFaq(payload, token);
      return response.data;
    },
    onSuccess: (createdFaq) => {
      queryClient.setQueriesData<FaqListCache>({ queryKey: faqsQueryKey }, (current) => {
        if (!current) return current;

        const withoutDuplicate = current.faqs.filter((faq) => faq.id !== createdFaq.id);
        return {
          ...current,
          faqs: [createdFaq, ...withoutDuplicate],
          pagination: current.pagination
            ? {
                ...current.pagination,
                totalCount: Number(current.pagination.totalCount ?? withoutDuplicate.length) + 1,
              }
            : current.pagination,
        };
      });
    },
  });
}

export function useUpdateFaq(token: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: UpdateFaqRequest }) => {
      if (!token) throw new Error('You need to login again.');
      const response = await updateFaq(id, payload, token);
      return response.data;
    },
    onSuccess: (updatedFaq) => {
      queryClient.setQueriesData<FaqListCache>({ queryKey: faqsQueryKey }, (current) => {
        if (!current) return current;

        return {
          ...current,
          faqs: current.faqs.map((faq) => (faq.id === updatedFaq.id ? updatedFaq : faq)),
        };
      });
    },
  });
}

export function useDeleteFaq(token: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      if (!token) throw new Error('You need to login again.');
      await deleteFaq(id, token);
      return id;
    },
    onSuccess: (deletedFaqId) => {
      queryClient.setQueriesData<FaqListCache>({ queryKey: faqsQueryKey }, (current) => {
        if (!current) return current;

        const faqs = current.faqs.filter((faq) => faq.id !== deletedFaqId);
        return {
          ...current,
          faqs,
          pagination: current.pagination
            ? {
                ...current.pagination,
                totalCount: Math.max(0, Number(current.pagination.totalCount ?? faqs.length + 1) - 1),
              }
            : current.pagination,
        };
      });
    },
  });
}
