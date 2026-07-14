export interface Locator {
  id: number;
  name: string;
  address: string;
  phone: string;
  from: string;
  to: string;
  longitude: number;
  latitude: number;
}

export interface LocatorListParams {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
}

export interface CreateLocatorRequest {
  name: string;
  address: string;
  phone: string;
  from: string;
  to: string;
  longitude: number;
  latitude: number;
}

export type UpdateLocatorRequest = CreateLocatorRequest;
