export interface MemberResponse {
  id: string;
  name: string;
  email: string;
  status: string;
  track: string;
  team: string;
  paymentStatus: string;
}

export interface MemberDetail extends MemberResponse {
  department: string;
  studentId: string;
  schoolEmail: string;
  phone: string;
  joinDate: string;
  lastUpdated: string;
}
