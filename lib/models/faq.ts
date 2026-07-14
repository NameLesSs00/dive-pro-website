export interface Faq {
  id: number;
  question: string;
  answer: string;
}

export interface FaqListParams {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
}

export interface CreateFaqRequest {
  question: string;
  answer: string;
}

export interface UpdateFaqRequest {
  question: string;
  answer: string;
}
