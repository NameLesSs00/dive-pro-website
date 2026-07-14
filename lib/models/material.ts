export interface Material {
  id: number;
  name: string;
}

export interface MaterialListParams {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
}

export interface CreateMaterialRequest {
  name: string;
}

export interface UpdateMaterialRequest {
  name: string;
}
