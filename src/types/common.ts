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

export interface MemberFilters {
  tracks: string[];
  statuses: string[];
  paymentStatuses: string[];
}

export interface MemberFilterInput {
  status?: string;
  track?: string;
  team?: string;
  paymentStatus?: string;
  name?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortOrder?: string;
}
