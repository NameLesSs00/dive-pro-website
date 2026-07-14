export interface Size {
  id: number;
  name: string;
}

export interface SizeListParams {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
}

export interface CreateSizeRequest {
  name: string;
}

export interface UpdateSizeRequest {
  name: string;
}
