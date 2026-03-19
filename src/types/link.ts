export interface Link {
  id: string;
  code: string;
  title: string;
  url: string;
  creatorId: string;
  createdAt: string;
  updatedAt: string;
  description: string | null;
  expiresAt: string | null;
  expiredAt: string | null;
}

export interface DailyClick {
  date: string;
  count: number;
}

export interface LinkDetail extends Link {
  totalClicks: number;
  dailyClicks: DailyClick[];
}

export interface CreateLinkInput {
  title: string;
  url: string;
  code?: string;
  description?: string;
  expiresAt?: string;
}

export interface UpdateLinkInput {
  title?: string;
  description?: string;
  expiresAt?: string;
}

export interface CreatorOption {
  id: string;
  name: string;
}

export interface LinkFilters {
  creators: CreatorOption[];
  expired: string[];
}

export interface LinkFilterInput {
  page?: number;
  size?: number;
  sortBy?: string;
  sortOrder?: string;
  creatorId?: string;
  expired?: string;
}
