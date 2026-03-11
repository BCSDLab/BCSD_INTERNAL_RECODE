export interface MemberResponse {
  id: string;
  name: string;
  email: string;
  status: string;
  track: string;
  payment_status: string;
}

export interface MemberDetail extends MemberResponse {
  department: string;
  student_id: string;
  school_email: string;
  phone: string;
  join_date: string;
  last_updated: string;
}
