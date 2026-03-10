export interface MemberResponse {
  id: string;
  name: string;
  email: string;
  status: string;
  track: string;
  team: string;
  payment_status: string;
}

export interface MemberDetail extends MemberResponse {
  school_email: string;
  phone: string;
  join_date: string;
  last_updated: string;
}
