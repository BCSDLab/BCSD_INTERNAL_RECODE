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

export interface SortFieldInput {
  field: string;
  order: string;
}

export interface MemberFilterInput {
  status?: string;
  track?: string;
  team?: string;
  paymentStatus?: string;
  name?: string;
  email?: string;
  department?: string;
  studentId?: string;
  phone?: string;
  page?: number;
  size?: number;
  sorts?: SortFieldInput[];
}
