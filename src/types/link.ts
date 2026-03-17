export interface LinkResponse {
  id: string;
  code: string;
  title: string;
  description: string | null;
  url: string;
  creator_id: string;
  created_at: string;
  expires_at: string | null;
  expired_at: string | null;
  updated_at: string;
}

export interface DailyClick {
  date: string;
  count: number;
}

export interface LinkDetail extends LinkResponse {
  total_clicks: number;
  daily_clicks: DailyClick[];
}

export interface CreateLinkRequest {
  title: string;
  url: string;
  code?: string;
  description?: string;
  expires_at?: string;
}

export interface UpdateLinkRequest {
  title?: string;
  description?: string;
  expires_at?: string;
}

export interface CreatorOption {
  id: string;
  name: string;
}

export interface LinkFiltersResponse {
  creators: CreatorOption[];
}

export interface LinkFilterParams {
  creator_id?: string;
  expired?: string;
  page: number;
  size: number;
}
