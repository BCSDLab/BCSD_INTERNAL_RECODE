export interface PagedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
}

export interface ApiError {
  error_code: string;
  message: string;
}

export interface FilterOptions {
  tracks: string[];
  statuses: string[];
  payment_statuses: string[];
}

export interface MemberFilterParams {
  status?: string;
  track?: string;
  payment_status?: string;
  name?: string;
  page: number;
  size: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}
